import Geolocation from '@react-native-community/geolocation';
import crashlytics from '@react-native-firebase/crashlytics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useDialog } from 'context/app_dialog_provider';
import { useFirebaseNotifications } from 'hooks/firebase/useFirebaseNotifications';
import React, { useCallback } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStackParamList, BottomTabNavigatorParamList } from 'types/navigation_types';
import { AnalyticEvent } from 'utilities/analytic_event';
import { SCREEN_WIDTH } from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';
import { createPDF } from 'utilities/utils';

type HomeScreenProps = MaterialBottomTabScreenProps<BottomTabNavigatorParamList, 'HomeScreen'>;

type TButton = { id: number; title: string };

export type TLocationCoords = {
	latitude: number;
	longitude: number;
	altitude: number | null;
	accuracy: number;
	altitudeAccuracy: number | null;
	heading: number | null;
	speed: number | null;
};

export type GeolocationResponse = {
	coords: TLocationCoords;
	timestamp: number;
};

const HomeScreen: React.FC<HomeScreenProps> = () => {
	useFirebaseNotifications();
	const { showDialog, hideDialog } = useDialog();
	const { top } = useSafeAreaInsets();
	const appStackParamList = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

	React.useEffect(() => {
		AnalyticEvent({
			eventName: 'HomeScreenRender',
			eventPayload: {
				name: 'Home_Screen_Render',
			},
		});
	}, []);

	// React.useEffect(() => {
	//   , '<<<<<<<<<<before');

	//   function abc() {
	//     return 'Hello from abc';
	//   }

	//   , '<<<<<<<<<<after');
	// }, []);

	const getLocationPermission = useCallback(() => {
		Geolocation.requestAuthorization(
			() => {
				appStackParamList.navigate('LocationScreen');
				hideDialog();
			},
			() => {
				showDialog({
					title: 'Required Location Access',
					message: 'Do you want to allow location?',
					actionType: 'error',
					onConfirm: async () => {
						Linking.openSettings();
						hideDialog();
					},
					onDismiss: hideDialog,
				});
			},
		);
	}, []);

	const buttonList: TButton[] = [
		{ id: 1, title: 'Analytic Button' },
		{ id: 2, title: 'Crashlytic Button' },
		{ id: 3, title: 'Todo List [online(Firebase)/offline(SQLite)]' },
		{ id: 4, title: 'Reducer (Multiple State Manager)' },
		{ id: 5, title: 'Keyboard Controller' },
		{ id: 6, title: 'Animations' },
		{ id: 7, title: 'Top Tab Bars' },
		{ id: 8, title: 'Device Contacts' },
		{ id: 9, title: 'Device Location' },
		{ id: 10, title: 'HTML To PDF' },
	];

	const handleButtonPress = async (button: TButton) => {
		switch (button.title) {
			case 'Analytic Button':
				AnalyticEvent({
					eventName: 'analyticButtonPress',
					eventPayload: {
						name: 'Jaskirat Singh',
						email: 'jaskirat.singh@weexcel.in',
					},
				});
				return;
			case 'Crashlytic Button':
				crashlytics().crash();
				return;
			case 'Todo List [online(Firebase)/offline(SQLite)]':
				appStackParamList.navigate('TodoScreen', { id: '' });
				return;
			case 'Native Modules':
				appStackParamList.navigate('NativeModuleScreen');
				return;
			case 'Reducer (Multiple State Manager)':
				appStackParamList.navigate('ReducerScreen');
				return;
			case 'Keyboard Controller':
				appStackParamList.navigate('KeyBoardControllerScreen');
				return;
			case 'Animations':
				appStackParamList.navigate('AppWelcomeAnimationScreen');
				return;
			case 'Top Tab Bars':
				appStackParamList.navigate('TopTabDashboardScreen');
				return;
			case 'Device Contacts':
				appStackParamList.navigate('ContactScreen');
				return;
			case 'Device Location':
				getLocationPermission();
				break;
			case 'HTML To PDF':
				createPDF();
				break;
			default:
				return '';
		}
	};

	return (
		<ScrollView
			style={style.mainContainer}
			contentContainerStyle={{
				padding: ms(15),
				paddingTop: top,
				paddingBottom: ms(80),
				backgroundColor: '#FFFFFF',
			}}
		>
			<View style={style.container}>
				{buttonList.map((button: TButton) => (
					<AnimatedLoaderButton
						key={button.id}
						title={button.title}
						alignSelfCenter
						width={SCREEN_WIDTH * 0.8}
						onPress={() => handleButtonPress(button)}
					/>
				))}
			</View>
		</ScrollView>
	);
};

export default HomeScreen;

const style = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: '100%',
	},
	container: {
		gap: vs(10),
		alignItems: 'center',
		paddingBottom: ms(100),
	},
});
