import { useEffect, useState } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook wrapper for react-i18next's useTranslation
 * Provides type-safe translation access with common utilities
 * Automatically re-renders when language changes
 */
export const useTranslation = () => {
	const { t, i18n } = useI18nTranslation();
	const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

	// Subscribe to language changes to ensure component re-renders
	useEffect(() => {
		const handleLanguageChange = (lng: string) => {
			setCurrentLanguage(lng);
		};

		// Set initial language
		setCurrentLanguage(i18n.language);

		// Subscribe to language changes
		i18n.on('languageChanged', handleLanguageChange);

		// Cleanup
		return () => {
			i18n.off('languageChanged', handleLanguageChange);
		};
	}, [i18n]);

	return {
		t,
		i18n,
		currentLanguage,
		isRTL: false, // Add RTL support if needed in future
	};
};
