import { useEffect } from 'react';

export function useInterstitialAd() {
  useEffect(() => {
    if (__DEV__) return;

    const {
      InterstitialAd,
      AdEventType,
      TestIds,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require('react-native-google-mobile-ads');

    const adUnitId = process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL ?? TestIds.INTERSTITIAL;
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
