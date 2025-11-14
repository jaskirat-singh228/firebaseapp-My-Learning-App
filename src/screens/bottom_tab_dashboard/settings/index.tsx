import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SpaceView from 'components/atoms/space_view';
import ChatBottomSheet from 'components/bottom_sheets/chat_sheet';
import ThemeSelectorDialog from 'components/modals/theme_selector_modal';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { View } from 'react-native';
import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { BottomTabNavigatorParamList } from 'types/navigation_types';

type SettingsScreenProps = MaterialBottomTabScreenProps<
	BottomTabNavigatorParamList,
	'SettingsScreen'
>;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
	const chatBottomSheetRef = React.useRef<BottomSheetModal | null>(null);
	const [showSelectThemeDialog, setShowSelectThemeDialog] = React.useState(false);

	const openBottomSheet = React.useCallback(() => {
		chatBottomSheetRef?.current?.expand();
	}, []);

	return (
		<View
			style={{
				height: '100%',
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<AnimatedLoaderButton
				title={'Change Theme'}
				onPress={() => setShowSelectThemeDialog(true)}
			/>
			<SpaceView height={20} />
			<AnimatedLoaderButton title={'Open Gorhom Bottom Sheet'} onPress={openBottomSheet} />
			<ChatBottomSheet reff={chatBottomSheetRef} />
			<ThemeSelectorDialog
				visible={showSelectThemeDialog}
				onClose={() => setShowSelectThemeDialog(false)}
			/>
		</View>
	);
};

export default SettingsScreen;
