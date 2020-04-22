import React from 'react';
import { View, Text } from 'react-native';
import MakeItRain from './makeItRain';
import Confetti from './confetti';

function Root(props) {
  const itemComponent = props.itemComponent || <View style={props.itemDimensions}/>;

  switch (props.flavor) {
    case "arrive":
      return ( <Confetti {...props} itemComponent={itemComponent}/> );
    case "rain":
      return ( <MakeItRain {...props} itemComponent={itemComponent}/> );
    default:
      return ( <Text>Unsupported flavor</Text> );
  }
}

Root.defaultProps = {
  numItems: 100,
  itemDimensions: { width: 20, height: 10 },
  itemColors: ['#00e4b2', '#09aec5', '#107ed5'],
  itemTintStrength: 1.0,
  flavor: "arrive",
  fallSpeed: 50,
  flipSpeed: 3,
  horizSpeed: 50,
  continuous: true,
};

export default Root;
