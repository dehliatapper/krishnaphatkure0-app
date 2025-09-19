import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Image } from 'expo-image';
import NetInfo from '@react-native-community/netinfo';
import { OfflineScreen } from '@/components/offline-screen';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoadEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  };

  if (!isConnected) {
    return <OfflineScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://fromfarmerstoyourplate.com/' }}
        style={styles.webview}
        startInLoadingState={false}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={handleLoadEnd}
      />
      {isLoading && (
        <Animated.View style={[styles.preloader, { opacity: fadeAnim }]}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/sitelogo.webp')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
  },
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
