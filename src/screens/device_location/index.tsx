import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import FullScreenContainer from 'components/hoc/full_screen_container';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import React from 'react';
import { TLocationCoords } from 'screens/bottom_tab_dashboard/home';
import { AppStackParamList } from 'types/navigation_types';
import { showToast } from 'utilities/utils';

// const google_map_key = 'GOOGLE_MAPS_API_KEY'; // paid

type LocationScreenProps = NativeStackScreenProps<AppStackParamList, 'LocationScreen'>;

const LocationScreen: React.FC<LocationScreenProps> = () => {
	const [location, setLocation] = React.useState<TLocationCoords | null>(null);

	React.useEffect(() => {
		Geolocation.getCurrentPosition(
			(position) => setLocation(position.coords),
			(error) => showToast(error.message, 'danger'),
			{ enableHighAccuracy: true, timeout: 60000 },
		);
	}, []);

	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Location' />
			<BaseText>
				{location
					? `Lat: ${location.latitude}, Lon: ${location.longitude}`
					: 'Fetching location...'}
			</BaseText>
			{/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<MapView
					provider='google'
					key={google_map_key}
					style={{ flex: 1, width: '100%' }}
					initialRegion={{
						latitude: location?.latitude || 0,
						longitude: location?.longitude || 0,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				>
					<Marker
						coordinate={{
							latitude: location?.latitude || 0,
							longitude: location?.longitude || 0,
						}}
					/>
				</MapView>
			</View> */}
		</FullScreenContainer>
	);
};

export default LocationScreen;
