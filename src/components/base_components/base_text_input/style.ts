import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		mainContainer: {
			width: '100%',
		},
		textInput: {
			backgroundColor: theme.colors.textInput.background,
			borderRadius: theme.radius.regular,
			width: '90%',
			alignSelf: 'center',
			margin: ms(10),
			justifyContent: 'center',
			borderWidth: ms(1),
			borderColor: theme.colors.borderColor.regular,
			...theme.fonts.regular,
		},
		label: {
			color: theme.colors.textColor.regular,
			width: '100%',
			padding: ms(5),
			fontWeight: 'bold',
		},
		error: {
			color: theme.colors.textColor.alert,
			width: '100%',
			padding: ms(5),
		},
		requiredText: {
			color: theme.colors.textColor.error,
		},
	});
