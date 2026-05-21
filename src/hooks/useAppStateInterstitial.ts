import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const BACKGROUND_THRESHOLD_MS = 30_000;

export function useAppStateInterstitial() {
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    if (__DEV__) return;

    const {
      InterstitialAd,
      AdEventType,
      TestIds,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    } = require('react-native-google-mobile-ads');

    const adUnitId =
      process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL ?? TestIds.INTERSTITIAL;

    const loadAndShow = () => {
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

      instance.load();

      return () => {
        clearTimeout(timeout);
        unsubLoaded();
      };
    };

    let cleanup: (() => void) | null = null;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundedAt.current = Date.now();
      } else if (nextState === 'active' && backgroundedAt.current !== null) {
        const elapsed = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        if (elapsed >= BACKGROUND_THRESHOLD_MS) {
          cleanup = loadAndShow();
        }
      }
    });

    return () => {
      subscription.remove();
      cleanup?.();
    };
  }, []);
}
