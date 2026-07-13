import React from 'react';
import { Appearance } from 'react-native';
import {
	AsyncStorageKeys,
	ReadDataFromAsyncStorage,
	SaveDataToAsyncStorage,
} from 'utilities/async_storage_utils';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
	toggleTheme: () => void;
	isDarkTheme: boolean;
	themeMode: ThemeMode;
	setLightTheme: () => void;
	setDarkTheme: () => void;
	setSystemTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
	const context = React.useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};

type ThemeProviderType = {
	children: React.ReactNode;
};

const getSystemTheme = (): boolean => {
	const colorScheme = Appearance.getColorScheme();
	return colorScheme === 'dark';
};

export const ThemeProvider: React.FC<ThemeProviderType> = (props) => {
	const [themeMode, setThemeMode] = React.useState<ThemeMode>('system');
	const [isDarkTheme, setIsDarkTheme] = React.useState(false);

	// Initialize theme from storage or system
	React.useEffect(() => {
		const initializeTheme = async () => {
			try {
				const savedTheme = await ReadDataFromAsyncStorage(AsyncStorageKeys.SELECTED_THEME);
				if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
					setThemeMode(savedTheme as ThemeMode);
					if (savedTheme === 'system') {
						setIsDarkTheme(getSystemTheme());
					} else {
						setIsDarkTheme(savedTheme === 'dark');
					}
				} else {
					// Default to system theme if nothing saved
					const systemIsDark = getSystemTheme();
					setThemeMode('system');
					setIsDarkTheme(systemIsDark);
				}
			} catch (error) {
				console.error('Error loading theme:', error);
				const systemIsDark = getSystemTheme();
				setThemeMode('system');
				setIsDarkTheme(systemIsDark);
			}
		};

		initializeTheme();
	}, []);

	// Listen to system theme changes when in system mode
	React.useEffect(() => {
		if (themeMode !== 'system') return;

		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setIsDarkTheme(colorScheme === 'dark');
		});

		return () => subscription.remove();
	}, [themeMode]);

	const toggleTheme = () => {
		if (themeMode === 'system') {
			const newMode = getSystemTheme() ? 'light' : 'dark';
			setThemeMode(newMode);
			setIsDarkTheme(newMode === 'dark');
			SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_THEME, newMode);
		} else {
			const newMode = isDarkTheme ? 'light' : 'dark';
			setThemeMode(newMode);
			setIsDarkTheme(!isDarkTheme);
			SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_THEME, newMode);
		}
	};

	const setLightTheme = async () => {
		setThemeMode('light');
		setIsDarkTheme(false);
		await SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_THEME, 'light');
	};

	const setDarkTheme = async () => {
		setThemeMode('dark');
		setIsDarkTheme(true);
		await SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_THEME, 'dark');
	};

	const setSystemTheme = async () => {
		setThemeMode('system');
		const systemIsDark = getSystemTheme();
		setIsDarkTheme(systemIsDark);
		await SaveDataToAsyncStorage(AsyncStorageKeys.SELECTED_THEME, 'system');
	};

	return (
		<ThemeContext.Provider
			value={{
				toggleTheme,
				isDarkTheme,
				themeMode,
				setDarkTheme,
				setLightTheme,
				setSystemTheme,
			}}
		>
			{props.children}
		</ThemeContext.Provider>
	);
};
