import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SpaceView from 'components/atoms/space_view';
import ChatBottomSheet from 'components/bottom_sheets/chat_sheet';
import { LanguageSelectorBottomsheet } from 'components/bottom_sheets/language_selector_bottom_sheet';
import ThemeSelectorDialog from 'components/modals/theme_selector_modal';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useTranslation } from 'hooks/useTranslation';
import React from 'react';
import { View } from 'react-native';
import { MaterialBottomTabScreenProps } from 'react-native-paper';
import { BottomTabNavigatorParamList } from 'types/navigation_types';

type SettingsScreenProps = MaterialBottomTabScreenProps<
	BottomTabNavigatorParamList,
	'SettingsScreen'
>;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
	const { t } = useTranslation();
	const chatBottomSheetRef = React.useRef<BottomSheetModal | null>(null);
	const languageBottomSheetRef = React.useRef<BottomSheetModal | null>(null);
	const [showSelectThemeDialog, setShowSelectThemeDialog] = React.useState(false);

	const openChatSheet = React.useCallback(() => {
		chatBottomSheetRef?.current?.expand();
	}, []);

	const openLanguageSheet = React.useCallback(() => {
		languageBottomSheetRef?.current?.present();
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
				title={t('settings.changeTheme')}
				onPress={() => setShowSelectThemeDialog(true)}
			/>
			<SpaceView height={20} />
			<AnimatedLoaderButton
				title={t('settings.changeLanguage')}
				onPress={openLanguageSheet}
			/>
			<SpaceView height={20} />
			<AnimatedLoaderButton title={'Open Chat Sheet'} onPress={openChatSheet} />
			<ChatBottomSheet reff={chatBottomSheetRef} />
			<ThemeSelectorDialog
				visible={showSelectThemeDialog}
				onClose={() => setShowSelectThemeDialog(false)}
			/>
			<LanguageSelectorBottomsheet reff={languageBottomSheetRef} />
		</View>
	);
};

export default SettingsScreen;
