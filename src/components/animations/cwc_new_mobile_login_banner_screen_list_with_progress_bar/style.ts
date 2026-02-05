import { StyleSheet } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { EdgeInsets } from 'react-native-safe-area-context';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';

export const style = (theme: MD3CustomTheme, insets: EdgeInsets) =>
	StyleSheet.create({
		// container: {
		// 	alignItems: 'center',
		// },
		// bannerImage: {
		// 	height: SCREEN_HEIGHT * 0.7, // SCREEN_HEIGHT * 0.7,
		// 	width: SCREEN_WIDTH, // SCREEN_WIDTH,
		// },
		// bottomContainer: {
		// 	position: 'absolute',
		// 	bottom: 0,
		// 	backgroundColor: theme.colors.background,
		// 	width: SCREEN_WIDTH,
		// 	height: SCREEN_HEIGHT * 0.35,
		// 	zIndex: 1000,
		// 	borderTopRightRadius: theme.radius.large,
		// 	borderTopLeftRadius: theme.radius.large,
		// 	alignItems: 'center',
		// 	gap: ms(24),
		// },
		// textListContainer: {
		// 	alignItems: 'center',
		// 	marginTop: ms(24),
		// 	gap: ms(24),
		// 	width: SCREEN_WIDTH,
		// },
		// bannerImageListContainer: {
		// 	flexDirection: 'row',
		// 	alignItems: 'center',
		// },
		// bookASurveyText: {
		// 	textAlign: 'center',
		// 	color: '#1E232C',
		// 	width: '70%',
		// },
		// buttonContainer: {
		// 	gap: ms(12),
		// 	width: SCREEN_WIDTH,
		// 	alignItems: 'center',
		// 	position: 'absolute',
		// 	bottom: 0,
		// },
		// bannerIndicatorContainer: {
		// 	gap: ms(4),
		// 	flexDirection: 'row',
		// 	position: 'absolute',
		// 	top: SCREEN_HEIGHT * 0.03,
		// 	zIndex: 1000,
		// 	width: SCREEN_WIDTH,
		// 	alignItems: 'center',
		// 	justifyContent: 'center',
		// 	padding: ms(10),
		// },
		// indicatorTrack: {
		// 	height: ms(4),
		// 	backgroundColor: '#E0E0E0',
		// 	borderRadius: ms(4),
		// },
		// indicatorFill: {
		// 	height: '100%',
		// 	backgroundColor: theme.colors.primary,
		// 	borderRadius: ms(4),
		// },

		// without infinite scrolling by user
		container: {
			alignItems: 'center',
			flex: 1,
		},
		bannerImage: {
			height: SCREEN_HEIGHT * 0.7,
			width: SCREEN_WIDTH,
		},
		bottomContainer: {
			position: 'absolute',
			bottom: 0,
			backgroundColor: theme.colors.background,
			width: SCREEN_WIDTH,
			height: SCREEN_HEIGHT * 0.35 + (insets?.bottom ?? 0),
			zIndex: 1000,
			borderTopRightRadius: theme.radius.large,
			borderTopLeftRadius: theme.radius.large,
			alignItems: 'center',
			gap: ms(24),
			paddingBottom: insets?.bottom ?? 0,
		},
		textListContainer: {
			alignItems: 'center',
			marginTop: ms(24),
			gap: ms(24),
			width: SCREEN_WIDTH,
		},
		bookASurveyText: {
			textAlign: 'center',
			width: '70%',
		},
		buttonContainer: {
			gap: ms(12),
			width: SCREEN_WIDTH,
			alignItems: 'center',
			position: 'absolute',
			bottom: insets?.bottom ?? 0,
		},
		bannerIndicatorContainer: {
			gap: ms(4),
			flexDirection: 'row',
			position: 'absolute',
			top: (insets?.top ?? 0) + SCREEN_HEIGHT * 0.02,
			zIndex: 1000,
			width: SCREEN_WIDTH,
			alignItems: 'center',
			justifyContent: 'center',
			padding: ms(0),
		},
		indicatorTrack: {
			height: ms(4),
			backgroundColor: theme.colors.textInput.placeholder,
			borderRadius: ms(4),
		},
		indicatorFill: {
			height: ms(4),
			backgroundColor: theme.colors.primary,
			borderRadius: ms(4),
		},
		description1: { lineHeight: ms(20) },
		description2: { lineHeight: ms(20), color: theme.colors.primary },
		title1: { width: '58%' },
	});
