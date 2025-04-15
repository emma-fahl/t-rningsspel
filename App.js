import React, {
  useState
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button
} from 'react-native';

export default function App() {
  const [diceNumber, setDiceNumber] = useState(0);

  const diceImages = [
    require('./assets/dice1.png'),
    require('./assets/dice2.png'),
    require('./assets/dice3.png'),
    require('./assets/dice4.png'),
    require('./assets/dice5.png'),
    require('./assets/dice6.png'),
  ];

  const rollDice = () => {
    const randomNumber = Math.floor(Math.random() * 6); 
    setDiceNumber(randomNumber);
  };

return (
  <View style={styles.container}>
    <Text style={styles.title}>🎲Tärningskastare🎲</Text> {/* Properly closed the <Text> tag */}
    <Image
      source={diceImages[diceNumber]}
      style={styles.diceImage}
    />
    <Button
      title="Kasta tärningen!"
      onPress={rollDice}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
  },
  diceImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
});
