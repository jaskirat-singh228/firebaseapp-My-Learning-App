import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		dialog: {
			backgroundColor: theme.colors.background,
			padding: ms(20),
			borderRadius: ms(12),
			width: '90%',
			alignSelf: 'center',
		},
		title: {
			fontSize: ms(20),
			fontWeight: '600',
			marginBottom: ms(15),
			color: theme.colors.textColor.regular,
		},
		option: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: ms(10),
		},
		label: {
			fontSize: ms(16),
			marginLeft: ms(10),
			color: theme.colors.textColor.regular,
		},
		closeButton: {
			marginTop: ms(20),
			backgroundColor: theme.colors.primary,
			padding: ms(10),
			borderRadius: ms(8),
			alignItems: 'center',
		},
	});
