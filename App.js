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
  const [showGlitter, setShowGlitter] = useState(false);
  const shakeAnim = useState(new Animated.Value(0))[0];
  const glitterAnim = useState(new Animated.Value(0))[0];

  const diceImages = [
    require('./assets/dice1.png'),
    require('./assets/dice2.png'),
    require('./assets/dice3.png'),
    require('./assets/dice4.png'),
    require('./assets/dice5.png'),
    require('./assets/dice6.png'),
  ];

  const rollDice = () => {
    setShowGlitter(false); // döljer glitter först

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
        // visa glitter om det blev 6 (index 5)
        setShowGlitter(true);
        glitterAnim.setValue(0);
        Animated.timing(glitterAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            setShowGlitter(false); // ta bort glitter efter en stund
          }, 1000);
        });
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

    <
    Animated.Image source = {
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
      showGlitter && ( <
        Animated.Image source = {
          require('./assets/glitter.png')
        }
        style = {
          [
            styles.glitter,
            {
              opacity: glitterAnim,
              transform: [{
                scale: glitterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.7, 1.3],
                }),
              }, ],
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
  glitter: {
    position: 'absolute',
    width: 250,
    height: 250,
    top: '35%',
    zIndex: 10,
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
