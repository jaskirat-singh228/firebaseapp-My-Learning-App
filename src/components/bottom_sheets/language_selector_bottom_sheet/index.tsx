import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BaseBottomSheetModal from 'components/base_components/base_bottom_sheet_modal';
import BaseText from 'components/base_components/base_text';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useLanguageContext } from 'context/language_provider';
import React from 'react';
import { useTranslation } from 'hooks/useTranslation';
import { Pressable, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcon } from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';
import { SupportedLanguage } from '../../../i18n/config';
import { style } from './style';

type LanguageSelectorDialogProps = {
	reff: React.RefObject<BottomSheetModal | null>;
	onClose?: () => void;
};

const LanguageSelectorBottomsheetComp: React.FC<LanguageSelectorDialogProps> = (props) => {
	const { reff, onClose } = props;
	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const viewStyle = style(theme);
	const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageContext();
	const { t } = useTranslation();
	const [selectedLanguage, setSelectedLanguage] =
		React.useState<SupportedLanguage>(currentLanguage);

	React.useEffect(() => {
		setSelectedLanguage(currentLanguage);
	}, [currentLanguage]);

	const handleLanguageSelect = React.useCallback((newValue: SupportedLanguage) => {
		setSelectedLanguage(newValue);
	}, []);

	const handleContinue = React.useCallback(async () => {
		await changeLanguage(selectedLanguage);
		reff.current?.dismiss();
		onClose?.();
	}, [selectedLanguage, changeLanguage, reff, onClose]);

	const handleDismiss = React.useCallback(() => {
		setSelectedLanguage(currentLanguage);
		reff.current?.dismiss();
		onClose?.();
	}, [currentLanguage, reff, onClose]);

	return (
		<BaseBottomSheetModal reff={reff} showHeader={true} onDismiss={handleDismiss}>
			<View style={viewStyle.container}>
				<BaseText variant='headlineSmall' style={{ marginBottom: vs(10), textAlign: 'center' }}>
					{t('settings.choosePreferredLanguage')}
				</BaseText>
				<View style={viewStyle.languagesContainer}>
					{Object.entries(supportedLanguages).map(([key, label]) => {
						const isSelected = selectedLanguage === key;
						return (
							<Pressable
								key={key}
								style={({ pressed }) => [
									viewStyle.languageCard,
									isSelected && viewStyle.languageCardSelected,
									pressed && viewStyle.languageCardPressed,
								]}
								onPress={() => handleLanguageSelect(key as SupportedLanguage)}
							>
								<View style={viewStyle.languageCardContent}>
									<View
										style={[
											viewStyle.languageIconContainer,
											isSelected && viewStyle.languageIconContainerSelected,
										]}
									>
										<BaseText style={viewStyle.languageIcon}>
											{key === 'en' ? '🇬🇧' : '🇮🇳'}
										</BaseText>
									</View>
									<View style={viewStyle.languageTextContainer}>
										<BaseText
											variant='titleMedium'
											style={[
												viewStyle.languageLabel,
												isSelected && viewStyle.languageLabelSelected,
											]}
										>
											{label}
										</BaseText>
										{isSelected && (
											<View style={viewStyle.selectedIndicator}>
												<Icon
													source={MaterialIcon.CHECK_BOLD}
													size={ms(16)}
													color={theme.colors.textColor.white}
												/>
											</View>
										)}
									</View>
								</View>
								{isSelected && <View style={viewStyle.selectedBorder} />}
							</Pressable>
						);
					})}
				</View>

				<View
					style={[viewStyle.buttonContainer, { paddingBottom: insets?.bottom ?? vs(16) }]}
				>
					<AnimatedLoaderButton
						title={t('common.continue')}
						onPress={handleContinue}
						height={vs(50)}
					/>
				</View>
			</View>
		</BaseBottomSheetModal>
	);
};

export const LanguageSelectorBottomsheet = LanguageSelectorBottomsheetComp;
