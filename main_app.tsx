import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNetInfo } from '@react-native-community/netinfo';
import AppLoader from 'components/hoc/app_loader';
import { AppDialogProvider } from 'context/app_dialog_provider';
import { useThemeContext } from 'context/theme_provider';
import RootNavigator from 'navigation/root_navigator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar, useWindowDimensions } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { MD3CustomTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { darkTheme, lightTheme } from 'utilities/theme';
import { showToast } from 'utilities/utils';

const MainApp: React.FC = () => {
	const { height, width } = useWindowDimensions();
	const { isDarkTheme } = useThemeContext();
	const statusBarHeight = StatusBar.currentHeight;
	const { isConnected } = useNetInfo();
	const previousConnection = React.useRef<boolean | null>(null);
	const { t } = useTranslation();

	React.useEffect(() => {
		// still undetermined, skip
		if (isConnected === null) return;

		// first valid state
		if (previousConnection.current === null) {
			previousConnection.current = isConnected;

			if (isConnected === false) {
				showToast(t('notifications.noInternetAvailable'), 'danger', false);
			}
			return;
		}

		// later state changes
		if (previousConnection.current !== isConnected) {
			if (isConnected === false) {
				showToast(t('notifications.noInternetAvailable'), 'danger', false);
			} else if (isConnected === true) {
				showToast(t('notifications.backOnline'), 'success', true);
			}
		}

		previousConnection.current = isConnected;
	}, [isConnected, t]);

	const appTheme: MD3CustomTheme = {
		...(isDarkTheme ? darkTheme : lightTheme),
		dimensions: {
			height: height,
			width: width,
		},
	};

	return (
		<PaperProvider theme={appTheme}>
			<SafeAreaProvider>
				<KeyboardProvider navigationBarTranslucent statusBarTranslucent>
					<AppDialogProvider>
						<AppLoader>
							<BottomSheetModalProvider>
								<RootNavigator />
							</BottomSheetModalProvider>
						</AppLoader>
					</AppDialogProvider>
				</KeyboardProvider>
			</SafeAreaProvider>
			<FlashMessage style={{ paddingTop: statusBarHeight }} position='top' />
		</PaperProvider>
	);
};

export default MainApp;
