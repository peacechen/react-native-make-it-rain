// Inpsired by
// https://engineering.shopify.com/blogs/engineering/building-arrives-confetti-in-react-native-with-reanimated
// https://dev.to/hrastnik/implementing-gravity-and-collision-detection-in-react-native-2hk5

import React, { useEffect, useMemo } from 'react'
import Animated from 'react-native-reanimated'
import {View, Dimensions, StyleSheet} from 'react-native'

const {
  View: ReanimatedView,
  Clock,
  Value,
  useCode,
  block,
  startClock,
  stopClock,
  set,
  add,
  sub,
  divide,
  diff,
  multiply,
  cond,
  clockRunning,
  greaterThan,
  lessThan,
  lessOrEq,
  eq,
} = Animated;

const Confetti = props => {
  const [containerDims, setContainerDims] = React.useState(Dimensions.get('screen'));
  const [confetti, setConfetti] = React.useState(createConfetti(containerDims));
  const clock = new Clock();

  useEffect(() => {
    return () => { // func indicates unmount
      stopClock(clock);
      setConfetti([]);
    }
  }, []);

  // Update confetti positioning if screen changes (e.g. rotation)
  const onLayout = (event => {
    setContainerDims({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  });

  function createConfetti(dimensions) {
    return useMemo(() => {
      const { width, height } = dimensions;
      // Adapt velocity props
      const xVelMax = props.horizSpeed * 8;
      const yVelMax = props.fallSpeed * 3;
      const angleVelMax = props.flipSpeed;

      return [...new Array(props.numItems)].map((_, index) => {
        return {
          index,
          // Spawn confetti from two different sources, a quarter
          // from the left and a quarter from the right edge of the screen.
          x: new Value(
            width * (index % 2 ? 0.25 : 0.75) - props.itemDimensions.width / 2
          ),
          y: new Value(-props.itemDimensions.height * 2),
          angle: new Value(0),
          xVel: new Value(Math.random() * xVelMax - (xVelMax / 2)),
          yVel: new Value(Math.random() * yVelMax + yVelMax),
          angleVel: new Value((Math.random() * angleVelMax - (angleVelMax / 2)) * Math.PI),
          delay: new Value(Math.floor(index / 10) * 0.3),
          elasticity: Math.random() * 0.9 + 0.1,
          color: props.itemColors[index % props.itemColors.length],
        }
      })
      return confetti;
    }, [dimensions]);
  }

  const useDraw = _confetti => {
    const nativeCode = useMemo(() => {
      const timeDiff = diff(clock);
      const nativeCode = _confetti.map(({
        x,
        y,
        angle,
        xVel,
        yVel,
        angleVel,
        color,
        elasticity,
        delay,
      }) => {
        const dt = divide(timeDiff, 1000)
        const dy = multiply(dt, yVel)
        const dx = multiply(dt, xVel)
        const dAngle = multiply(dt, angleVel)

        return [
          cond(
            lessOrEq(y, containerDims.height + props.itemDimensions.height),
            cond(
              greaterThan(delay, 0),
              [set(delay, sub(delay, dt))],
              [
                set(y, add(y, dy)),
                set(x, add(x, dx)),
                set(angle, add(angle, dAngle)),
              ]
            )
          ),
          cond(greaterThan(x, containerDims.width - props.itemDimensions.width), [
            set(x, containerDims.width - props.itemDimensions.width),
            set(xVel, multiply(xVel, -elasticity)),
          ]),
          cond(lessThan(x, 0), [
            set(x, 0),
            set(xVel, multiply(xVel, -elasticity)),
          ]),
          cond(
            eq(props.continuous, true),
            cond(
              greaterThan(y, containerDims.height + props.itemDimensions.height),
              set(y, -props.itemDimensions.height * 2),
            )
          ),
        ];
      });

      nativeCode.push(cond(clockRunning(clock), 0, startClock(clock)), clock);
      return block(nativeCode);
    }, [_confetti]);

    useCode(() => nativeCode, [nativeCode]);
  };

  useDraw(confetti);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={this.onLayout}>
      {confetti.map(
        ({ index, x, y, angle, color: backgroundColor }) => {
          return (
            <ReanimatedView
              key={index}
              style={[
                styles.animContainer,
                props.itemDimensions,
                { transform: [
                  {translateX: x},
                  {translateY: y},
                  {rotate: angle},
                  {rotateX: angle},
                  {rotateY: angle},
                ]},
              ]}
            >
              { props.itemComponent }
              <View style={[{ backgroundColor }, props.itemDimensions, styles.confettiContainer]} opacity={props.itemTintStrength}/>
            </ReanimatedView>
          )
        }
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  animContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
})

export default Confetti
