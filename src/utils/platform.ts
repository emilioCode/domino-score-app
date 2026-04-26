import { Platform } from 'react-native';

export const isIOS = () => Platform.OS === 'ios';

export const isAndroid = () => Platform.OS === 'android';

export const getStatusBarHeight = () => (Platform.OS === 'ios' ? 44 : 24);
