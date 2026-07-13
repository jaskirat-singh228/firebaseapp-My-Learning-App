import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
	AsyncStorageKeys,
	ReadDataFromAsyncStorage,
	SaveDataToAsyncStorage,
} from 'utilities/async_storage_utils';
import en from './locales/en.json';
import hi from './locales/hi.json';

export const SUPPORTED_LANGUAGES = {
	en: 'English',
	hi: 'हिंदी',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const LANGUAGE_DETECTOR = {
	type: 'languageDetector' as const,
	async: true,
	detect: async (callback: (lng: string) => void) => {
		try {
			const savedLanguage = await ReadDataFromAsyncStorage(
				AsyncStorageKeys.SELECTED_LANGUAGE
			);
			if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
				callback(savedLanguage);
			} else {
				callback('en'); // Default to English
			}
		} catch (error) {
			console.error('Error detecting language:', error);
			callback('en'); // Default to English on error
		}
	},
	init: () => {},
	cacheUserLanguage: async (lng: string) => {
		try {
			await SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_LANGUAGE, lng);
		} catch (error) {
			console.error('Error saving language:', error);
		}
	},
};

i18n.use(LANGUAGE_DETECTOR)
	.use(initReactI18next)
	.init({
		compatibilityJSON: 'v4',
		resources: {
			en: {
				translation: en,
			},
			hi: {
				translation: hi,
			},
		},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false, // React already escapes values
		},
		react: {
			useSuspense: false,
			bindI18n: 'languageChanged',
			bindI18nStore: 'added removed',
		},
	});

export default i18n;
