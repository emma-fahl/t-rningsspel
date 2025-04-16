import React, {
  useState
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function App() {
  const [diceNumber, setDiceNumber] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const shakeAnim = useState(new Animated.Value(0))[0];
  const confettiAnim = useState(new Animated.Value(0))[0];

  const diceImages = [
    require('./assets/dice1.png'),
    require('./assets/dice2.png'),
    require('./assets/dice3.png'),
    require('./assets/dice4.png'),
    require('./assets/dice5.png'),
    require('./assets/dice6.png'),
  ];

  const rollDice = () => {
    setShowConfetti(false);

    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const randomNumber = Math.floor(Math.random() * 6);
      setDiceNumber(randomNumber);

      if (randomNumber === 5) {
        setShowConfetti(true);
        confettiAnim.setValue(1); 

        setTimeout(() => {
          Animated.timing(confettiAnim, {
            toValue: 0, 
            duration: 1000,
            useNativeDriver: true,
          }).start(() => {
            setShowConfetti(false);
          });
        }, 1500);
      }
    });
  };

  return ( <
    ImageBackground source = {
      require('./assets/background.png')
    }
    style = {
      styles.container
    }
    resizeMode = "cover" >
    <Text style = {
      styles.title
    } > 🎲Tärningskastare🎲 </Text>

    <Animated.Image source = {
      diceImages[diceNumber]
    }
    style = {
      [
        styles.diceImage,
        {
          transform: [{
            rotate: shakeAnim.interpolate({
              inputRange: [-1, 1],
              outputRange: ['-15deg', '15deg'],
            }),
          }, ],
        },
      ]
    }
    />

    {
      showConfetti && ( 
        <Animated.Image source = {
          require('./assets/confetti.gif')
        }
        style = {
          [
            styles.confetti,
            {
              opacity: confettiAnim,
            },
          ]
        }
        />
      )
    }

    <
    TouchableOpacity style = {
      styles.button
    }
    onPress = {
      rollDice
    } >
    <
    Text style = {
      styles.buttonText
    } > Kasta tärningen! </Text> 
    </TouchableOpacity> 
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {
      width: 2,
      height: 2
    },
    textShadowRadius: 5,
  },
  diceImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
  button: {
    backgroundColor: '#307470',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
