import Geolocation from '@react-native-community/geolocation';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { IS_ANDROID, IS_IOS } from './constants';

export type LocationCoordinates = {
	latitude: number;
	longitude: number;
	accuracy?: number;
	altitude?: number | null;
	heading?: number | null;
	speed?: number | null;
};

export const checkLocationPermission = async (): Promise<boolean> => {
	if (IS_IOS) return true; // iOS handles this during actual request
	if (IS_ANDROID) {
		return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
	}
	return true;
};

/**
 * Requests location permission.
 * On Android, it uses PermissionsAndroid.
 * On iOS, it relies on the implicit request or manual authorization based on config.
 *
 * If permission is denied, it shows a toast message as per requirements.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
	if (IS_IOS) {
		// iOS handles permissions automatically when location is requested.
		// However, explicit request is good practice.
		Geolocation.requestAuthorization();
		return true;
	}

	if (IS_ANDROID) {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					title: 'Location Permission',
					message: 'App needs access to your location to show nearby PCS Office.',
					buttonPositive: 'OK',
					buttonNegative: 'Cancel',
				}
			);

			if (granted === PermissionsAndroid.RESULTS.GRANTED) return true;
			else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
				Alert.alert(
					'Permission Required',
					'App needs access to your location to show nearby PCS Office. Please enable it in the app settings.',
					[{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
				);
				return false;
			} else {
				Alert.alert(
					'Permission Required',
					'App needs access to your location to show nearby PCS Office. Please enable it in the app settings.',
					[{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
				);
				return false;
			}
		} catch (err) {
			return false;
		}
	}

	return true;
};

/**
 * Retrieves the current location coordinates.
 * Handles permission requests and retries on timeout/unavailable errors.
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates> => {
	return new Promise(async (resolve, reject) => {
		const hasPermission = await requestLocationPermission();

		if (!hasPermission) {
			return reject({ code: 1, message: 'Permission denied' });
		}

		const config = {
			enableHighAccuracy: false, // Use network provider for faster fix
			timeout: 30000,
			maximumAge: 60000,
		};

		Geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					altitude: position.coords.altitude,
					heading: position.coords.heading,
					speed: position.coords.speed,
				});
			},
			(error) => {
				// Retry on Timeout (3) or Unavailable (2)
				if (error.code === 2 || error.code === 3) {
					Geolocation.getCurrentPosition(
						(retryPos) => {
							resolve({
								latitude: retryPos.coords.latitude,
								longitude: retryPos.coords.longitude,
								accuracy: retryPos.coords.accuracy,
								altitude: retryPos.coords.altitude,
								heading: retryPos.coords.heading,
								speed: retryPos.coords.speed,
							});
						},
						(retryErr) => {
							reject(retryErr);
						},
						{ ...config, enableHighAccuracy: true, timeout: 60000, maximumAge: 300000 }
					);
				} else {
					// Permission denied (1)
					if (error.code === 1) {
						Alert.alert(
							'Permission Required',
							'App needs access to your location to show nearby PCS Office. Please enable it in the app settings.',
							[
								{ text: 'Cancel', style: 'cancel' },
								{ text: 'Open Settings', onPress: () => Linking.openSettings() },
							]
						);
					}
					reject(error);
				}
			},
			config
		);
	});
};

export const requestStoragePermission = async () => {
	if (IS_ANDROID) {
		if (Number(Platform.Version) >= 33) {
			return true;
		}
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				{
					title: 'Storage Permission Required',
					message: 'App needs access to your storage to download the bill',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				}
			);
			return granted === PermissionsAndroid.RESULTS.GRANTED;
		} catch (err) {
			console.warn(err);
			return false;
		}
	}
	return true;
};
