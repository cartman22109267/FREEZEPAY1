// screens/SplashScreen.jsx
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function SplashScreenLogin({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(2)).current;
  const lottieRef = useRef(null);
  const [showLottie, setShowLottie] = React.useState(false);


  useEffect(() => {
    const anim = Animated.timing(scaleAnim, { 
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
     });
    anim.start();
    // puis :
    const t = setTimeout(() => setShowLottie(true), 2000);
    return () => clearTimeout(t);
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      {!showLottie ? (
        <Animated.Image
          source={require('../../../assets/images/logoloader.png')}
          style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
          resizeMode="contain"
        />
      ) : (
        <LottieView
          ref={lottieRef}
          source={require('../../../assets/animations/animationsplash.json')}
          autoPlay
          loop={false}
          onAnimationFinish={() => navigation.replace('Login')}
          style={styles.lottie}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  lottie: {
    width: width * 0.6,
    height: width * 0.6,
  },
});
