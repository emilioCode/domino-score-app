import { View, Text, StyleSheet } from 'react-native';

if (!__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  var { BannerAd, BannerAdSize, TestIds } = require('react-native-google-mobile-ads');
}

const adUnitId = __DEV__
  ? ''
  : (process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER ?? '');

export default function BannerAdComponent() {
  if (__DEV__) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Ad Banner</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  placeholder: {
    width: 320,
    height: 50,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  placeholderText: {
    color: '#555555',
    fontSize: 10,
  },
});
