import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'react-native-paper';
import { ThemeProvider as AppThemeProvider } from './src/context/theme_provider';
import { Provider as ReduxProvider } from 'react-redux';
import MainApp from './main_app';
import { LanguageProvider } from './src/context/language_provider';
import './src/i18n/config';
import { store } from './src/store';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: true,
			retry: 3,
		},
	},
});

const App: React.FC = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ReduxProvider store={store}>
				<GestureHandlerRootView>
					<LanguageProvider>
						<AppThemeProvider>
							<MainApp />
						</AppThemeProvider>
					</LanguageProvider>
				</GestureHandlerRootView>
			</ReduxProvider>
		</QueryClientProvider>
	);
};

export default App;
