// Spring physics from https://blog.swmansion.com/simple-physics-with-reanimated-part-3-a168d69faa51

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
  abs,
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

const randomize = (max, base = 0) => Math.random() * max + base;

const MakeItRain = props => {
  const [containerDims, setContainerDims] = React.useState(Dimensions.get('screen'));
  const [items, setItems] = React.useState(createItems(containerDims));
  const clock = new Clock();

  useEffect(() => {
    return () => { // func indicates unmount
      stopClock(clock);
      setItems([]);
    }
  }, []);

  // Update item positioning if screen changes (e.g. rotation)
  const onLayout = (event => {
    setContainerDims({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  });

  function createItems(dimensions) {
    return useMemo(() => {
      const { width, height } = dimensions;
      // Adapt velocity props
      const xVelMax = props.horizSpeed;
      const yVelMax = props.fallSpeed * 3;
      const angleVelMax = props.flipSpeed;

      return [...new Array(props.numItems)].map((_, index) => {
        let x = randomize(width - props.itemDimensions.width);
        let y = -props.itemDimensions.height * 4;
        let anchor = randomize(width / 3, width / 12);
        let xArc = Math.abs(x - anchor);

        return {
          index,
          x: new Value(x),
          y: new Value(y),
          xArc: new Value(xArc),
          yBase: new Value(y),
          angle: new Value(0),
          anchor: new Value(anchor),
          tension: new Value(4 * Math.min(xArc, width/2) / width),
          xVel: new Value(randomize(xVelMax / 2, xVelMax / 2)),
          yVel: new Value(randomize(yVelMax, yVelMax)),
          angleVel: new Value(randomize(angleVelMax / 2, angleVelMax / 2)),
          delay: new Value((index / props.numItems) * height / yVelMax),
          color: props.itemColors[index % props.itemColors.length],
        }
      });
    }, [dimensions]);
  }

  const spring = (dt, position, velocity, anchor, tension = 50, mass = 1 ) => {
    const dist = sub(position, anchor);
    const acc = divide(multiply(-1, tension, dist), mass);
    return set(velocity, add(velocity, multiply(dt, acc)));
  }

  const swingArc = (x, y, xArc, yBase, anchor ) => {
    const percentArc = divide(abs(sub(x, anchor)), xArc);
    const yOffset = multiply(percentArc, divide(xArc, 4));
    return set(y, sub(yBase, yOffset));
  }

  const useDraw = _items => {
    const nativeCode = useMemo(() => {
      const timeDiff = diff(clock);
      const nativeCode = _items.map(({
        x,
        y,
        xArc,
        yBase,
        angle,
        xVel,
        yVel,
        angleVel,
        color,
        anchor,
        tension,
        delay,
      }) => {
        const dt = divide(timeDiff, 1000)
        const dy = multiply(dt, yVel)
        const dAngle = multiply(dt, angleVel)

        return [
          cond(
            lessOrEq(yBase, containerDims.height + props.itemDimensions.height),
            cond(
              greaterThan(delay, 0),
              [set(delay, sub(delay, dt))],
              [
                set(yBase, add(yBase, dy)),
                spring(dt, x, xVel, anchor, tension), // swinging motion
                set(x, add(x, multiply(xVel, dt))),
                swingArc(x, y, xArc, yBase, anchor ), // create dip in swing
                set(angle, add(angle, dAngle)),
              ]
            )
          ),
          cond(
            eq(props.continuous, true),
            cond(
              greaterThan(yBase, containerDims.height + props.itemDimensions.height),
              set(yBase, -props.itemDimensions.height * 4),
            )
          ),
        ];
      });

      nativeCode.push(cond(clockRunning(clock), 0, startClock(clock)), clock);
      return block(nativeCode);
    }, [_items]);

    useCode(() => nativeCode, [nativeCode]);
  };

  useDraw(items);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} onLayout={this.onLayout}>
      {items.map(
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
              <View style={[{ backgroundColor }, props.itemDimensions, styles.itemContainer]} opacity={props.itemTintStrength}/>
            </ReanimatedView>
          )
        }
      )}
    </View>
  )
}

export default MakeItRain;

const styles = StyleSheet.create({
  animContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
})
