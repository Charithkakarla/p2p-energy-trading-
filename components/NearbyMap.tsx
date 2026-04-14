import { Platform } from 'react-native';
import NearbyMapNative from './NearbyMap.native';
import NearbyMapWeb from './NearbyMap.web';

const NearbyMap = Platform.OS === 'web' ? NearbyMapWeb : NearbyMapNative;

export default NearbyMap;
