import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { ms, vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		mainContainer: {
			paddingVertical: vs(10),
			paddingHorizontal: ms(10),
		},
		iconAndTextContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		bounceView: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		backButtonAndTextContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});
