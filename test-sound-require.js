import Sound from 'react-native-sound';
import { Image } from 'react-native';

const asset = Image.resolveAssetSource(require('./src/assets/noti-sound.wav'));
console.log(asset.uri);
