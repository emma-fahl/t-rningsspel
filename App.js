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
} from 'react-native';

export default function App() {
  const [playerDice, setPlayerDice] = useState([0, 0, 0]);
  const [appDice, setAppDice] = useState([0, 0, 0]);
  const [gamePhase, setGamePhase] = useState('player'); // 'player', 'app', 'done'
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiAnim = useState(new Animated.Value(0))[0];

  const playerShakeAnims = [
      useState(new Animated.Value(0))[0],
      useState(new Animated.Value(0))[0],
      useState(new Animated.Value(0))[0],
  ];

  const appShakeAnims = [
      useState(new Animated.Value(0))[0],
      useState(new Animated.Value(0))[0],
      useState(new Animated.Value(0))[0],
  ];

  const diceImages = [
    require('./assets/dice1.png'),
    require('./assets/dice2.png'),
    require('./assets/dice3.png'),
    require('./assets/dice4.png'),
    require('./assets/dice5.png'),
    require('./assets/dice6.png'),
  ];

  const getRandomDice = () => [0, 0, 0].map(() => Math.floor(Math.random() * 6));

  const animateDice = (anims) => {
    const animations = anims.map(anim =>
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    );
    return Animated.parallel(animations);
  };

  const rollForPlayer = () => {
    if (gamePhase !== 'player') return;

    animateDice(playerShakeAnims).start(() => {
      const dice = getRandomDice();
      setPlayerDice(dice);
      setGamePhase('app');

      if (dice.includes(5)) triggerConfetti();

      setTimeout(() => rollForApp(), 1500);
    });
  };

  const rollForApp = () => {
    animateDice(appShakeAnims).start(() => {
      const dice = getRandomDice();
      setAppDice(dice);
      setGamePhase('done');

      const playerSum = playerDice.reduce((a, b) => a + b + 1, 0); // +1 pga 0-index
      const appSum = dice.reduce((a, b) => a + b + 1, 0);

      if (playerSum > appSum) {
        setMessage('🎉 Du vann!');
      } else if (appSum > playerSum) {
        setMessage('😈 Appen vann!');
      } else {
        setMessage('🤝 Oavgjort!');
      }

      if (dice.includes(5)) triggerConfetti();
    });
  };


  const triggerConfetti = () => {
    setShowConfetti(true);
    confettiAnim.setValue(1);
    setTimeout(() => {
      Animated.timing(confettiAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => setShowConfetti(false));
    }, 1500);
  };

  const resetGame = () => {
    setPlayerDice([0, 0, 0]);
    setAppDice([0, 0, 0]);
    setGamePhase('player');
    setMessage('');
  };

  return ( 
    <ImageBackground source = {require('./assets/background.png')}
    style = {styles.container}
    resizeMode = "cover" >
    <Text style = {styles.title} > 🎲Tärningsduellen🎲 </Text>

    <Text style = {styles.label} > Du </Text> 
    <View style = {styles.diceRow} > 
      {playerDice.map((num, i) => ( 
        <Animated.Image key = {`player-${i}`}
        source = {diceImages[num]}
        style = {
          [
            styles.diceImage,
            {
              transform: [{
                rotate: playerShakeAnims[i].interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-15deg', '15deg'],
                }),
              }, ],
            },
          ]
        }
        />
      ))} 
    
    </View>

    <Text style = {styles.label} > Appen </Text> 
    <View style = {styles.diceRow} > 
      {appDice.map((num, i) => ( 
        <Animated.Image key = {`app-${i}`}
        source = {diceImages[num]}
        style = {styles.diceImage}
        />
      ))} 
    </View>

    <Text style = {styles.sumText} >Din summa: {playerDice.reduce((a, b) => a + b + 1, 0)} | Appens: {appDice.reduce((a, b) => a + b + 1, 0)}
    </Text>

    <Text style = {styles.message} > {message} </Text>

    {showConfetti && ( 
      <Animated.Image source = {require('./assets/confetti.gif')}
        style = {[
            styles.confetti,
            {
              opacity: confettiAnim,
            },
          ]
        }
        />
      )}

    {gamePhase === 'player' && ( 
      <TouchableOpacity style = {styles.button} onPress = {rollForPlayer} >
        <Text style = {styles.buttonText} > Kasta dina tärningar </Text> 
        </TouchableOpacity>
      )
    }

    {gamePhase === 'done' && ( 
      <TouchableOpacity style = {styles.button} onPress = {resetGame} >
        <Text style = {styles.buttonText} > Återställ </Text> 
        </TouchableOpacity>
      )
    } </ImageBackground>
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
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {
      width: 2,
      height: 2
    },
    textShadowRadius: 5,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 15,
  },
  diceImage: {
    width: 80,
    height: 80,
  },
  sumText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
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
