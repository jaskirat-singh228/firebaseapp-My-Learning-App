import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms, vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		container: {
			padding: ms(16),
			gap: ms(20),
		},
		descriptionContainer: {
			paddingHorizontal: ms(0),
			marginTop: vs(16),
			marginBottom: vs(10),
		},
		descriptionText: {
			color: theme.colors.textColor.placeholder,
			textAlign: 'left',
			lineHeight: ms(18),
		},
		languagesContainer: {
			flexDirection: 'row',
			gap: ms(12),
		},
		languageCard: {
			flex: 1,
			backgroundColor: theme.colors.surface,
			borderRadius: theme.radius.regular,
			borderWidth: ms(1),
			borderColor: theme.colors.borderColor.regular,
			position: 'relative',
			overflow: 'hidden',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 1,
			},
			shadowOpacity: 0.08,
			shadowRadius: 3,
			elevation: 2,
		},
		languageCardSelected: {
			backgroundColor: theme.colors.primary,
			shadowColor: theme.colors.primary,
			shadowOpacity: 0.25,
			shadowRadius: 6,
			elevation: 5,
		},
		languageCardPressed: {
			opacity: 0.85,
			transform: [{ scale: 0.97 }],
		},
		languageCardContent: {
			flexDirection: 'row',
			alignItems: 'center',
			padding: ms(12),
		},
		languageIconContainer: {
			width: ms(44),
			height: ms(44),
			borderRadius: ms(22),
			backgroundColor: theme.colors.surfaceVariant,
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: ms(12),
			borderWidth: ms(1.5),
			borderColor: theme.colors.borderColor.regular,
		},
		languageIconContainerSelected: {
			backgroundColor: 'rgba(255, 255, 255, 0.25)',
			borderColor: 'rgba(255, 255, 255, 0.4)',
		},
		languageIcon: {
			fontSize: ms(24),
		},
		languageTextContainer: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		languageLabel: {
			color: theme.colors.textColor.regular,
			fontWeight: '600',
			fontSize: ms(15),
		},
		languageLabelSelected: {
			color: theme.colors.textColor.white,
			fontWeight: '700',
		},
		selectedIndicator: {
			width: ms(24),
			height: ms(24),
			borderRadius: ms(12),
			backgroundColor: theme.colors.success,
			justifyContent: 'center',
			alignItems: 'center',
			marginLeft: ms(8),
		},
		selectedBorder: {
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			height: ms(3),
			backgroundColor: theme.colors.success,
		},
		buttonContainer: {
			alignItems: 'center',
			paddingTop: vs(20),
			paddingHorizontal: ms(20),
			backgroundColor: theme.colors.background,
			borderTopColor: theme.colors.borderColor.regular,
		},
	});
