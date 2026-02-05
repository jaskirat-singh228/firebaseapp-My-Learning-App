import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { SCREEN_HEIGHT } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		container: {
			gap: ms(6),
		},
		selectedItemConatiner: {
			borderWidth: ms(1),
			borderColor: theme.colors.borderColor.regular,
			borderRadius: theme.radius.small,
			paddingVertical: ms(8),
			paddingHorizontal: ms(12),
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: SCREEN_HEIGHT * 0.05,
		},
		listContainer: {
			width: '100%',
			padding: ms(16),
			maxHeight: SCREEN_HEIGHT * 0.75,
		},
		listItem: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderColor: theme.colors.borderColor.regular,
			padding: ms(10),
			borderBottomWidth: ms(1),
			borderBottomColor: theme.colors.borderColor.regular,
			borderRadius: theme.radius.small,
		},

		mainConatiner: {
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		closeIcon: {
			borderRadius: theme.radius.regular,
			padding: ms(7),
			backgroundColor: theme.colors.primary,
		},
	});
