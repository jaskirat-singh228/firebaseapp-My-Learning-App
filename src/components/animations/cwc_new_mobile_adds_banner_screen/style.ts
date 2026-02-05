import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme) =>
	StyleSheet.create({
		container: {
			marginTop: ms(16),
		},
		bannerImage: {
			width: SCREEN_WIDTH * 0.94,
			height: SCREEN_HEIGHT * 0.18,
			borderRadius: theme.radius.regular,
		},
		bookNowOverlay: {
			position: 'absolute',
			right: ms(24),
			top: ms(44),
			zIndex: 100,
		},
		bookNowImage: {
			width: ms(157),
			height: vs(72),
		},
		paginationDots: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: vs(12),
			gap: ms(6),
		},
		dot: {
			width: ms(6),
			height: ms(6),
			borderRadius: theme.radius.circle,
		},
	});
