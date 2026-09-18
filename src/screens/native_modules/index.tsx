import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import React from 'react';
import { View } from 'react-native';
import { AppStackParamList } from 'types/navigation_types';
// import NativeLocalStorage from 'specs/NativeLocalStorage';
// import NativeToast from 'specs/NativeToast';

type NativeModuleScreenProps = NativeStackScreenProps<AppStackParamList, 'NativeModuleScreen'>;

const NativeModuleScreen: React.FC<NativeModuleScreenProps> = (props) => {
	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Native Modules' />
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<AnimatedLoaderButton
					title='Show Native toast'
					onPress={() => {
						// NativeToast.NativeToast('Hello Ji.....');
					}}
				/>
				<AnimatedLoaderButton
					title='Save'
					onPress={() => {
						// const value = 'abcd';
						// NativeLocalStorage.setItem('test', value);
						// NativeToast.NativeToast(`Item ${value} set in Native Local Storage`);
					}}
				/>
				<AnimatedLoaderButton
					title='Get'
					onPress={() => {
						// const value = NativeLocalStorage.getItem('test');
						// NativeToast.NativeToast(`Item ${value} get from Native Local Storage`);
					}}
				/>
				<AnimatedLoaderButton
					title='Clear'
					onPress={() => {
						// NativeLocalStorage.clear();
						// NativeToast.NativeToast('Item clear into Native Local Storage');
					}}
				/>
				<AnimatedLoaderButton
					title='Aadhaar Face Auth (UIDAI)'
					onPress={() => {
						props.navigation.navigate('AadhaarFaceAuthScreen');
					}}
				/>
			</View>
		</FullScreenContainer>
	);
};

export default NativeModuleScreen;
