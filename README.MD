# React Native "Make It Rain"

*Make It Rain* was adapted from Joel Arvidsson's [MakeItRain example](https://github.com/oblador/react-native-animatable/tree/master/Examples/MakeItRain).  This is a self-contained component that may be placed in any component.  It takes up the entire parent view and is positioned absolutely, overlaying on top of other content in the parent.

<img src="https://media.giphy.com/media/5sYvOSluvnVY7CD6vq/giphy.gif" width="204" height="266" />

```jsx
import React, {Component} from 'react';
import { View } from 'react-native';
import MakeItRain from 'react-native-make-it-rain';

class Demo extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Make It Rain</Text>
        <MakeItRain
          numMoneys={10}
          moneyDimensions={{width: 200, height: 100}}
        />
      </View>
    );
  }
}
```

## Usage

*   `npm install react-native-make-it-rain --save`

## Dependencies
*   [react-native-animatable](https://github.com/oblador/react-native-animatable)
*   [react-native-svg](https://github.com/react-native-community/react-native-svg)

## Props
| Prop                           | Description                                          | Type     | Default    |
| ------------------------------ | ---------------------------------------------------- | -------- | ---------- |
| **`numMoneys`**                | How much money falls                                 | Integer  | 15         |
| **`duration`**                 | Money flip duration                                  | Integer  | 3000       |
| **`moneyComponent`**           | Replaces the built-in money component. Can use any React component (Icon, Image, View, etc)  | Component | `CashMoney SVG` |
| **`moneyDimensions`**          | Size of money. If `moneyComponent` is supplied, size should be set to match            | Object    | `{ width: 100, height: 50 }` |
| **`wiggleRoom`**               | How much the money can move horizontally.            | Integer  | 50         |
| **`speed`**                    | How fast the money falls                             | Integer  | 50         |

## ToDo
*   Example project.
*   Conditional usage of react-native-svg (so that it's not needed by the consuming app if a custom moneyComponent is supplied).
*   Tests
