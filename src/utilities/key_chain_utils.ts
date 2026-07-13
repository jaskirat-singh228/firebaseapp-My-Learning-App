import * as Keychain from 'react-native-keychain';
import { KeyChainKeys } from './local_keys';

/**
 * Save data to Keychain for a given service.
 * @param {string} service - The unique key (e.g. LOGIN_DATA, LOGIN_STATUS).
 * @param {string} value - The stringified value to store securely.
 */
export const SaveDataToKeyChain = async (service: string, value: string) => {
	try {
		await Keychain.setGenericPassword('app_user', value, { service });
	} catch (error) {
		console.log(`ERROR saving data to Keychain for service: ${service}`, JSON.stringify(error));
	}
};

/**
 * Get data from Keychain for a given service.
 * @param {string} service - The unique key to retrieve.
 * @returns {Promise<string>} - The stored value (empty string if not found).
 */
export const GetDataFromKeyChain = async (service: string): Promise<string> => {
	try {
		const data = await Keychain.getGenericPassword({ service });
		if (data) {
			return data.password;
		}
	} catch (error) {
		console.log(
			`ERROR getting data from Keychain for service: ${service}`,
			JSON.stringify(error)
		);
	}
	return '';
};

/**
 * Clear data from Keychain for a given service.
 * @param {string} service - The unique key to clear.
 */
export const ClearKeyChainData = async (service: string) => {
	try {
		await Keychain.resetGenericPassword({ service });
	} catch (error) {
		console.log(
			`ERROR clearing data from Keychain for service: ${service}`,
			JSON.stringify(error)
		);
	}
};

/**
 * Clear all app-related Keychain values.
 * Update this list whenever you add a new service.
 */
export const ClearAppKeyChainValues = async () => {
	try {
		await Promise.all([
			Keychain.resetGenericPassword({ service: KeyChainKeys.USER_LOGIN_DATA }),
			Keychain.resetGenericPassword({ service: KeyChainKeys.USER_TOKEN }),
			Keychain.resetGenericPassword({ service: KeyChainKeys.JWT_TOKEN }),
			Keychain.resetGenericPassword({ service: KeyChainKeys.REFRESH_TOKEN }),
		]);
	} catch (error) {
		console.log('ERROR clearing app Keychain values', JSON.stringify(error));
	}
};
