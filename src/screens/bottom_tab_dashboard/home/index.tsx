import Geolocation from '@react-native-community/geolocation';
import crashlytics from '@react-native-firebase/crashlytics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { DropDown, DropDownItem } from 'components/organisms/dropdown';
import { useDialog } from 'context/app_dialog_provider';
import { useFirebaseNotifications } from 'hooks/firebase/useFirebaseNotifications';
import { useTranslation } from 'hooks/useTranslation';
import React, { useCallback } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialBottomTabScreenProps } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppStackParamList, BottomTabNavigatorParamList } from 'types/navigation_types';
import { AnalyticEvent } from 'utilities/analytic_event';
import { SCREEN_WIDTH } from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';

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

export const states: DropDownItem[] = [
	{ id: '1', label: 'Punjab' },
	{ id: '2', label: 'Haryana' },
	{ id: '3', label: 'Delhi' },
	{ id: '4', label: 'Maharashtra' },
	{ id: '5', label: 'Karnataka' },
];

const HomeScreen: React.FC<HomeScreenProps> = (props) => {
	useFirebaseNotifications();
	const { t } = useTranslation();
	const { showDialog, hideDialog } = useDialog();
	const { top } = useSafeAreaInsets();
	const [selectedState, setSelectedState] = React.useState<DropDownItem | null>(null);
	const appStackParamList = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

	React.useEffect(() => {
		AnalyticEvent({
			eventName: 'HomeScreenRender',
			eventPayload: {
				name: 'Home_Screen_Render',
			},
		});
	}, []);

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
		// { id: 10, title: 'HTML To PDF' },
		{ id: 11, title: 'Razorpay' },
		{ id: 12, title: 'Dropdown View' },
	];

	const handlePayPress = async () => {
		try {
			// Open Razorpay checkout with the created order
			var options = {
				description: 'Credits towards consultation',
				image: 'https://dummyjson.com/icon/emilys/128',
				currency: 'INR',
				key: 'rzp_test_S2va5o3zko0xcK', // unique for each app
				amount: 500, // Amount is already in paise from Razorpay API
				name: 'Test User',
				order_id: '1', // Use the order ID from created order
				prefill: {
					contact: '+91' + 9876543210 || '',
					name: 'Test User',
				},
				theme: { color: '#53a20e' },
			};

			RazorpayCheckout.open(options)
				.then((data) => {
					// Alert.alert(`Success: ${data.razorpay_payment_id}`);
					console.log('data.razorpay_payment_id: ', data.razorpay_payment_id);

					props.navigation.goBack();
				})
				.catch((error) => {
					Alert.alert(`Error: ${error.code} | ${error.description}`);
				});
		} catch (error) {
			console.error('Error creating order:', error);
			Alert.alert('Error', 'Failed to create order. Please try again.');
		}
	};

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
				return;
			// case 'HTML To PDF':
			// 	 createPDF();
			// 	Alert.alert('Coming Soon', 'PDF generation will be available soon.');
			// 	return;
			case 'Razorpay':
				handlePayPress();
				return;
			case 'Dropdown View':
				<DropDown
					label={'State'}
					placeholder={'Select State'}
					headerTitle={'Select State'}
					data={states}
					onSelect={(item) => setSelectedState(item)}
				/>;
				return;
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
			}}
		>
			<View style={style.container}>
				<BaseText style={{ fontSize: ms(24), fontWeight: 'bold', marginBottom: ms(10) }}>
					{t('dashboard.home')}
				</BaseText>
				{buttonList.map((button: TButton) => (
					<AnimatedLoaderButton
						key={button.id}
						title={button.title}
						alignSelfCenter
						width={SCREEN_WIDTH * 0.8}
						onPress={() => handleButtonPress(button)}
					/>
				))}

				<View
					style={{
						marginTop: ms(30),
						width: '100%',
						padding: ms(15),
						backgroundColor: '#f0f0f0',
						borderRadius: ms(10),
					}}
				>
					<BaseText
						style={{ fontSize: ms(18), fontWeight: 'bold', marginBottom: ms(10) }}
					>
						{t('labels.time')} {t('common.info')}
					</BaseText>
					<BaseText>
						{t('time.today')}: {new Date().toLocaleDateString()}
					</BaseText>
					<BaseText>
						{t('time.yesterday')}:{' '}
						{new Date(Date.now() - 86400000).toLocaleDateString()}
					</BaseText>
					<BaseText>
						{t('time.tomorrow')}: {new Date(Date.now() + 86400000).toLocaleDateString()}
					</BaseText>
					<BaseText>{t('time.thisWeek')}: ...</BaseText>
				</View>
			</View>
		</ScrollView>
	);
};

export default HomeScreen;

const style = StyleSheet.create({
	mainContainer: {
		flex: 1,
		width: '100%',
		backgroundColor: '#FFFFFF',
	},
	container: {
		gap: vs(10),
		alignItems: 'center',
		paddingBottom: ms(100),
	},
});
