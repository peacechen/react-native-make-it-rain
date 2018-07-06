import React, {Component} from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CashMoney from './assets/cashMoney';

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
    };
  }

  FlippingView = ({ back = false, delay, duration = 1000, moneyComponent, style = {} }) => {
    _moneyComponent = moneyComponent;
    if (!moneyComponent) {
      // Need to size width & height, so create component here with props passed through.
      _moneyComponent = <CashMoney width={this.props.moneyDimensions.width} height={this.props.moneyDimensions.height}/>
    }
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
        style={{
          ...style,
          backfaceVisibility: 'hidden',
        }}
      >
        {_moneyComponent}
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
        from: { translateY: -this.props.moneyDimensions.height - this.props.speed },
        to: { translateY: this.state.containerHeight + this.props.speed },
      }}
      duration={duration}
      delay={delay}
      easing={t => Math.pow(t, 1.7)}
      iterationCount="infinite"
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
    let Falling = this.Falling;
    let Swinging = this.Swinging;
    let FlippingView = this.FlippingView;
    return (
      <View style={styles.container} onLayout={this.onLayout} pointerEvents="none">
        {range(this.props.numMoneys)
          .map(i => randomize(1000))
          .map((flipDelay, i) => (
            <Falling
              key={i}
              duration={this.props.duration}
              delay={i * (this.props.duration / this.props.numMoneys)}
              style={{
                position: 'absolute',
                paddingHorizontal: this.props.wiggleRoom,
                left: randomize(this.state.containerWidth - this.props.moneyDimensions.width) - this.props.wiggleRoom,
              }}
            >
              <Swinging amplitude={this.props.moneyDimensions.width / 5} delay={randomize(this.props.duration)}>
                <FlippingView moneyComponent={this.props.moneyComponent} delay={flipDelay} />
                <FlippingView
                  moneyComponent={this.props.moneyComponent}
                  delay={flipDelay}
                  back
                  style={{ position: 'absolute' }}
                />
              </Swinging>
            </Falling>
          ))}
      </View>
    );
  }
}

MakeItRain.defaultProps = {
  numMoneys: 15,
  duration: 3000,
  moneyDimensions: { width: 100, height: 50 },
  wiggleRoom: 50,
  speed: 50,
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
  }
});
