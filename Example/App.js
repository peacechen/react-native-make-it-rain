import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import MakeItRain from './react-native-make-it-rain';
import CashMoney from './assets/cashMoney';

export default function App() {
  const [isConfetti, setIsConfetti] = useState(true);
  const toggleSwitch = () => setIsConfetti(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.font}>Make It Rain</Text>
      { isConfetti ?
        <MakeItRain
          numItems={100}
          itemComponent={<Text>🤍</Text>}
          itemTintStrength={0.8}
        />
        :
        <MakeItRain
          numItems={50}
          itemDimensions={{width: 200, height: 100}}
          itemComponent={<CashMoney width={200} height={100}/>}
          itemColors={['#ffffff00']}
          flavor={"rain"}
        />
      }

      <View style={styles.switchRow}>
        <Text style={styles.font}>rain</Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isConfetti ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isConfetti}
        />
        <Text style={styles.font}>arrive</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  switchRow: {
    flexDirection: 'row',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    fontSize: 40,
  },
  switch: {
    marginHorizontal: 20,
    transform: [{ scaleX: 2 }, { scaleY: 2 }]
  }
});
