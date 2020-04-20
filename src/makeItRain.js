import React, {Component} from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const randomize = max => Math.random() * max;

const range = count => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
};

class MakeItRain extends Component {
  constructor(props) {
    super(props)

    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      iterationCount: props.continuous ? "infinite" : 1,
      flipDuration: 9000 / props.flipSpeed,
      swingDuration: 35000 / props.horizSpeed,
      fallDuration: 150000 / props.fallSpeed,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.flipSpeed !== this.props.flipSpeed ||
        prevProps.horizSpeed !== this.props.horizSpeed ||
        prevProps.fallDuration !== this.props.fallDuration ||
        prevProps.continuous !== this.props.continuous )
    {
      this.setState({
        iterationCount: this.props.continuous ? "infinite" : 1,
        flipDuration: 9000 / this.props.flipSpeed,
        swingDuration: 35000 / this.props.horizSpeed,
        fallDuration: 150000 / this.props.fallSpeed,
      });
    }
  }

  FlippingView = ({ back = false, delay, duration = 1000, itemComponent, style = {}, index }) => {
    const backgroundColor = this.props.itemColors[index % this.props.itemColors.length];

    return (
      <Animatable.View
        animation={{
          from: { rotateX: back ? '0deg' : '180deg', rotate: !back ? '180deg' : '0deg' },
          to: { rotateX: back ? '360deg' : '-180deg', rotate: !back ? '180deg' : '0deg' },
        }}
        duration={duration}
        delay={delay}
        easing="linear"
        iterationCount="infinite"
        useNativeDriver
        style={[
          styles.itemContainer,
          style,
          { backfaceVisibility: 'hidden' },
        ]}
      >
        {itemComponent}
        <View style={[styles.itemTintContainer, {backgroundColor}, this.props.itemDimensions]} opacity={this.props.itemTintStrength} />
      </Animatable.View>
    );
  }

  Swinging = ({ amplitude, rotation = 7, delay, duration = 700, children }) => (
    <Animatable.View
      animation={{
        0: {
          translateX: -amplitude,
          translateY: -amplitude * 0.8,
          rotate: `${rotation}deg`,
        },
        0.5: {
          translateX: 0,
          translateY: 0,
          rotate: '0deg',
        },
        1: {
          translateX: amplitude,
          translateY: -amplitude * 0.8,
          rotate: `${-rotation}deg`,
        },
      }}
      delay={delay}
      duration={duration}
      direction="alternate"
      easing="ease-in-out"
      iterationCount="infinite"
      useNativeDriver
    >
      {children}
    </Animatable.View>
  );

  Falling = ({ duration, delay, style, children }) => (
    <Animatable.View
      animation={{
        from: { translateY: -this.props.itemDimensions.height },
        to: { translateY: this.state.containerHeight + this.props.itemDimensions.height },
      }}
      duration={duration}
      delay={delay}
      easing={t => Math.pow(t, 1.7)}
      iterationCount={this.state.iterationCount}
      useNativeDriver
      style={style}
    >
      {children}
    </Animatable.View>
  );

  onLayout = (event => {
    this.setState({
      containerWidth: event.nativeEvent.layout.width,
      containerHeight: event.nativeEvent.layout.height,
    })
  });

  render() {
    const Falling = this.Falling;
    const Swinging = this.Swinging;
    const FlippingView = this.FlippingView;

    return (
      <View style={styles.container} onLayout={this.onLayout} pointerEvents="none">
        {range(this.props.numItems)
          .map(i => randomize(1000))
          .map((flipDelay, i) => (
            <Falling
              key={i}
              duration={this.state.fallDuration}
              delay={i * this.state.fallDuration / this.props.numItems}
              style={{
                position: 'absolute',
                paddingHorizontal: this.props.wiggleRoom,
                left: randomize(this.state.containerWidth - this.props.itemDimensions.width) - this.props.wiggleRoom,
              }}
            >
              <Swinging amplitude={this.props.itemDimensions.width / 5} delay={randomize(this.state.swingDuration)} duration={this.state.swingDuration}>
                <FlippingView itemComponent={this.props.itemComponent} delay={flipDelay} duration={this.state.flipDuration} index={i}/>
                <FlippingView
                  itemComponent={this.props.itemComponent}
                  delay={flipDelay}
                  duration={this.state.flipDuration}
                  back
                  style={{ position: 'absolute' }}
                  index={i}
                />
              </Swinging>
            </Falling>
          ))}
      </View>
    );
  }
}

export default MakeItRain;


let styles = StyleSheet.create( {
	container: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemTintContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
