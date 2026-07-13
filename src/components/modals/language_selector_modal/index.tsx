import React from 'react';
import { Pressable, View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import { useLanguageContext } from '../../../context/language_provider';
import { useTranslation } from '../../../hooks/useTranslation';
import { SupportedLanguage } from '../../../i18n';
import BaseModal from '../../base_components/base_modal';
import BaseText from '../../base_components/base_text';
import { style } from './style';

interface LanguageSelectorDialogProps {
	visible: boolean;
	onClose: () => void;
}

const LanguageSelectorDialogModal: React.FC<LanguageSelectorDialogProps> = (props) => {
	const { visible, onClose } = props;
	const theme = useTheme();
	const viewStyle = style(theme);
	const { t } = useTranslation();
	const { currentLanguage, changeLanguage, supportedLanguages } = useLanguageContext();

	const handleSelect = React.useCallback(
		async (newValue: SupportedLanguage) => {
			await changeLanguage(newValue);
			onClose();
		},
		[changeLanguage, onClose],
	);

	return (
		<BaseModal visible={visible} onClose={onClose}>
			<View style={viewStyle.dialog}>
				<BaseText style={viewStyle.title}>{t('settings.selectLanguage')}</BaseText>
				<RadioButton.Group
					onValueChange={(val) => handleSelect(val as SupportedLanguage)}
					value={currentLanguage}
				>
					{(Object.keys(supportedLanguages) as SupportedLanguage[]).map((lng) => (
						<View key={lng} style={viewStyle.option}>
							<RadioButton.Android value={lng} />
							<BaseText style={viewStyle.label}>{supportedLanguages[lng]}</BaseText>
						</View>
					))}
				</RadioButton.Group>

				<Pressable style={viewStyle.closeButton} onPress={onClose}>
					<BaseText style={[theme.fonts.bold, { color: theme.colors.textColor.white }]}>
						{t('common.close')}
					</BaseText>
				</Pressable>
			</View>
		</BaseModal>
	);
};

const LanguageSelectorDialog = React.memo(LanguageSelectorDialogModal);
export default LanguageSelectorDialog;
