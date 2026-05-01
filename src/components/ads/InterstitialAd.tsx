import { useEffect } from 'react';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : (process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL ?? TestIds.INTERSTITIAL);

export function useInterstitialAd() {
  useEffect(() => {
    const instance = InterstitialAd.createForAdRequest(adUnitId);
    let expired = false;

    const timeout = setTimeout(() => {
      expired = true;
    }, 5000);

    const unsubLoaded = instance.addAdEventListener(AdEventType.LOADED, () => {
      if (!expired) {
        try {
          instance.show();
        } catch {}
      }
    });

    const unsubClosed = instance.addAdEventListener(AdEventType.CLOSED, () => {});

    instance.load();

    return () => {
      clearTimeout(timeout);
      unsubLoaded();
      unsubClosed();
    };
  }, []);
}
