# React Native "Make It Rain"

<div align="center">
  <a href="https://npmjs.org/package/react-native-make-it-rain">
    <img src="https://img.shields.io/npm/v/react-native-make-it-rain.svg?style=flat-square" alt="npm package version" />
  </a>
  <a href="https://npmjs.org/package/react-native-make-it-rain">
  <img src="https://img.shields.io/npm/dm/react-native-make-it-rain.svg?style=flat-square" alt="npm downloads" />
  </a>
  <a href="https://github.com/peacechen/react-native-make-it-rain/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/react-native-make-it-rain.svg?style=flat-square" alt="project license" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="make a pull request" />
  </a>
</div>
<br>
<div align="center">
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20react-native-make-it-rain!%20https://github.com/peacechen/react-native-make-it-rain%20%F0%9F%91%8D">
    <img src="https://img.shields.io/twitter/url/https/github.com/peacechen/react-native-make-it-rain.svg?style=social" alt="Tweet" />
  </a>
</div>

### v1.0.0 breaking changes
[Prop names](#props) have been generalized to represent that any type of component can be passed in as the falling pieces.
The `itemComponent` (previously `moneyComponent`) no longer defaults to an SVG.  This allowed for removal of the dependency on `react-native-svg`.  Refer to the Example project for how to pass in an SVG `itemComponent`.


## Summary

This is a self-contained component that may be placed in any component.  It takes up the entire parent view and is positioned absolutely, overlaying other content in the parent.

The default animation was adapted from [Shopify's Arrive confetti example](https://engineering.shopify.com/blogs/engineering/building-arrives-confetti-in-react-native-with-reanimated).

<kbd><img src="https://user-images.githubusercontent.com/6295083/79950404-acc95000-843c-11ea-8d38-77325a902a53.gif" width="320" height="540" /></kbd>

The original *Make It Rain* animation was adapted from Joel Arvidsson's [MakeItRain example](https://github.com/oblador/react-native-animatable/tree/master/Examples/MakeItRain).  It has been rewritten to use `react-native-reanimated`.

<kbd><img src="https://user-images.githubusercontent.com/6295083/42412963-745e701a-81dc-11e8-9a98-399199df7ccf.gif" width="320" height="400" /></kbd>

The `flavor` [prop](#props) selects between them.


## Sample Code
```jsx
import React, {Component} from 'react';
import { View, Text } from 'react-native';
import MakeItRain from 'react-native-make-it-rain';

class Demo extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Make It Rain</Text>
        <MakeItRain
          numItems={80}
          itemDimensions={{width: 40, height: 20}}
          itemComponent={<Text>🤍</Text>}
          itemTintStrength={0.8}
        />
      </View>
    );
  }
}
```

## Usage

> npm install react-native-make-it-rain --save

## Props
| Prop                           | Description                                          | Type     | Default    |
| ------------------------------ | ---------------------------------------------------- | -------- | ---------- |
| **`numItems`**                 | How many items fall                                  | Integer  | 100        |
| **`itemComponent`**            | Replaces the built-in item component. Can use any React component (Icon, Image, View, SVG etc)  | Component | `<View/>` |
| **`itemDimensions`**           | Size of item. If `itemComponent` is supplied, size should be set to match. | Object    | `{ width: 20, height: 10 }` |
| **`itemColors`**               | Colors of falling items.                             | Array    | ['#00e4b2', '#09aec5', '#107ed5'] |
| **`itemTintStrength`**         | Opacity of color overlay on item (0 - 1.0)           | Number   | 1.0        |
| **`flavor`**                   | The animation behavior ("arrive" or "rain")          | String   | "arrive"   |
| **`fallSpeed`**                | How fast the item falls                              | Integer  | 50         |
| **`flipSpeed`**                | Item flip speed                                      | Integer  | 3          |
| **`horizSpeed`**               | How fast the item moves horizontally                 | Integer  | 50         |
| **`continuous`**               | Rain down continuously                               | Boolean  | true       |


# Sample Application

If you'd like to see it in action, run these commands:
```sh
cd Example
npm run cp
npm install
npm start
```

The sample app is an Expo project created with `create-react-native-app`.

## Development

The source files are copied from the project root directory into `Example/react-native-make-it-rain` using `npm run cp`.  If a source file is modified, it must be copied over again with `npm run cp`.

Ideally the Example project could include the parent's source files using package.json, but that causes a babel interopRequireDefault runtime error.


## Credits
Cash SVG in the Example project was sourced from [IconFinder](https://www.iconfinder.com/icons/1889190/currency_currency_exchange_dollar_euro_exchange_finance_money_icon) and is used under the Creative Commons license.

## ToDo
*   Tests
