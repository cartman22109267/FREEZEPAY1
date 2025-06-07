// index.js
import 'react-native-gesture-handler'; // doit être en haut
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
