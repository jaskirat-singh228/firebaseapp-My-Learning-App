import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AnimationDemoScreen from 'screens/animations/AnimationDemoScreen';
import AppWelcomeAnimationScreen from 'screens/animations/app_welcome';
import BottomTabDashBoardScreen from 'screens/bottom_tab_dashboard';
import ContactScreen from 'screens/device_contacts';
import LocationScreen from 'screens/device_location';
import KeyBoardControllerScreen from 'screens/keyboard_controller';
import NativeModuleScreen from 'screens/native_modules';
import ReducerScreen from 'screens/reducer';
import TodoScreen from 'screens/todos';
import TopTabDashboardScreen from 'screens/top_tab_dashboard';
import { RootState } from 'store';
import { setShowPrivacyGuard } from 'store/slices/app_data_slice';
import { AppStackParamList } from 'types/navigation_types';
import { IS_ANDROID, IS_IOS } from 'utilities/constants';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const { loginData } = useSelector((state: RootState) => state.loginData);

	React.useEffect(() => {
		let subscription: NativeEventSubscription | null = null;
		if (IS_IOS) {
			subscription = AppState.addEventListener('change', handleAppStateChange);
		}
		return () => {
			subscription && subscription?.remove();
		};
	}, []);

	const handleAppStateChange = (state: AppStateStatus) => {
		// for now we are skipping for android due to its limitations of not detecting app in recents
		if (IS_ANDROID) return;
		if (state === 'active') {
			dispatch(setShowPrivacyGuard(false));
		} else if (state === 'inactive') {
			dispatch(setShowPrivacyGuard(true));
		}
	};

	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name={'BottomTabDashboardScreen'} component={BottomTabDashBoardScreen} />
			<Stack.Screen name={'TopTabDashboardScreen'} component={TopTabDashboardScreen} />
			<Stack.Screen name={'TodoScreen'} component={TodoScreen} />
			<Stack.Screen name={'NativeModuleScreen'} component={NativeModuleScreen} />
			<Stack.Screen name={'ReducerScreen'} component={ReducerScreen} />
			<Stack.Screen name={'KeyBoardControllerScreen'} component={KeyBoardControllerScreen} />
			<Stack.Screen
				name={'AppWelcomeAnimationScreen'}
				component={AppWelcomeAnimationScreen}
			/>
			<Stack.Screen name={'AnimationDemoScreen'} component={AnimationDemoScreen} />
			<Stack.Screen name={'ContactScreen'} component={ContactScreen} />
			<Stack.Screen name={'LocationScreen'} component={LocationScreen} />
		</Stack.Navigator>
	);
};

export default AppNavigator;
