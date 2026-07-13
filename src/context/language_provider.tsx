import React from 'react';
import { useTranslation } from 'react-i18next';
import { AsyncStorageKeys, SaveDataToAsyncStorage } from 'utilities/async_storage_utils';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../i18n/config';

interface LanguageContextType {
	currentLanguage: SupportedLanguage;
	changeLanguage: (lng: SupportedLanguage) => Promise<void>;
	supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const useLanguageContext = () => {
	const context = React.useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguageContext must be used within a LanguageProvider');
	}
	return context;
};

type LanguageProviderType = {
	children: React.ReactNode;
};

export const LanguageProvider: React.FC<LanguageProviderType> = (props) => {
	const { i18n: i18nInstance } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = React.useState<SupportedLanguage>(
		(i18nInstance.language as SupportedLanguage) || 'en'
	);

	// Listen to language changes and update state to trigger re-renders
	React.useEffect(() => {
		const handleLanguageChange = (lng: string) => {
			if (lng === 'en' || lng === 'hi') {
				setCurrentLanguage(lng as SupportedLanguage);
			}
		};

		// Set initial language
		setCurrentLanguage((i18nInstance.language as SupportedLanguage) || 'en');

		// Subscribe to language changes
		i18nInstance.on('languageChanged', handleLanguageChange);

		// Cleanup
		return () => {
			i18nInstance.off('languageChanged', handleLanguageChange);
		};
	}, [i18nInstance]);

	const changeLanguage = React.useCallback(
		async (lng: SupportedLanguage) => {
			try {
				await i18nInstance.changeLanguage(lng);
				await SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_LANGUAGE, lng);
				// State will update via the languageChanged event listener
			} catch (error) {
				console.error('Error changing language:', error);
			}
		},
		[i18nInstance]
	);

	const contextValue = React.useMemo(
		() => ({
			currentLanguage,
			changeLanguage,
			supportedLanguages: SUPPORTED_LANGUAGES,
		}),
		[currentLanguage, changeLanguage]
	);

	return (
		<LanguageContext.Provider value={contextValue}>{props.children}</LanguageContext.Provider>
	);
};
