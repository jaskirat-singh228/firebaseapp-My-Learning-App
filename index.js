/**
 * @format
 */

import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import 'react-native-get-random-values'; //for todos
import { setNotificationData } from 'utilities/initial_notification_data';
import { backgroundMessageHandler } from 'utilities/notifee_notification_handle';
import App from './App';
import { name as appName } from './app.json';

//for background notifications handling
messaging().onMessage(backgroundMessageHandler);

notifee.onBackgroundEvent(async ({ type, detail }) => {
	if (type === EventType.PRESS) {
		if (detail?.notification?.data) {
			setNotificationData(detail?.notification?.data);
		}
	}
});

AppRegistry.registerComponent(appName, () => App);
