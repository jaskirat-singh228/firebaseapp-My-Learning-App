import { useFocusEffect } from '@react-navigation/native';
import BaseText from 'components/base_components/base_text';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { FlatList, Image, ImageSourcePropType, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
	cancelAnimation,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { style } from './style';

type TBannerImage = {
	id: string;
	image: ImageSourcePropType;
	title1: string;
	title2: string;
	description1: string;
	description2: string;
};

const bannerImagesList: TBannerImage[] = [
	{
		id: '1',
		image: require('assets/images/login_banner1.png'),
		title1: 'Book a survey ',
		title2: 'for your home.',
		description1:
			'Our pest control experts will inspect your home and create a custom treatment plan. ',
		description2: 'Book today!',
	},
	{
		id: '2',
		image: require('assets/images/login_banner2.png'),
		title1: 'Schedule a service ',
		title2: 'for your home.',
		description1: 'Get a tailored pest control plan for your home. ',
		description2: 'Schedule your inspection today!',
	},
	{
		id: '3',
		image: require('assets/images/survey1.png'),
		title1: 'Book a survey ',
		title2: 'for your home.',
		description1:
			'Our pest control experts will inspect your home and create a custom treatment plan. ',
		description2: 'Book today!',
	},
];

type CWCNewMobileLoginBannerScreenListWithProgressBarCompProps = {};

const CWCPCSMobileNewLoginBannerScreenListWithProgressBarComp: React.FC<
	CWCNewMobileLoginBannerScreenListWithProgressBarCompProps
> = (props) => {
	// const theme = useTheme();
	// const styles = style(theme);

	// const [activeIndex, setActiveIndex] = React.useState(0);
	// const bannerListRef = React.useRef<FlatList>(null);
	// const progress = useSharedValue(0);
	// const isInteracting = React.useRef(false);
	// const isUserInteracting = React.useRef(false);
	// const isProgrammaticScroll = React.useRef(false);
	// const AUTO_SCROLL_DURATION = 3000;
	// const INITIAL_INDEX = 1;
	// const skipNextAnimation = React.useRef(false);
	// const ITEM_WIDTH = SCREEN_WIDTH; // SCREEN_WIDTH;

	// const jumpToIndex = (index: number, animated = true) => {
	// 	bannerListRef.current?.scrollToOffset({
	// 		offset: index * ITEM_WIDTH,
	// 		animated,
	// 	});
	// };

	// const goNext = useCallback(() => {
	// 	if (isUserInteracting.current || isProgrammaticScroll.current) return;

	// 	setActiveIndex((prev) => (prev + 1) % bannerImagesList.length);
	// }, []);

	// const startProgress = useCallback(() => {
	// 	if (isUserInteracting.current || isProgrammaticScroll.current) {
	// 		return;
	// 	}

	// 	progress.value = 0;

	// 	progress.value = withTiming(1, { duration: AUTO_SCROLL_DURATION }, (finished) => {
	// 		if (!finished || isUserInteracting.current || isProgrammaticScroll.current) {
	// 			return;
	// 		}

	// 		scheduleOnRN(goNext);
	// 	});
	// }, [goNext]);

	// React.useEffect(() => {
	// 	cancelAnimation(progress);
	// 	startProgress();
	// }, [activeIndex]);

	// React.useEffect(() => {
	// 	if (isUserInteracting.current) return;

	// 	const scrollIndex = activeIndex + 1;

	// 	isProgrammaticScroll.current = true;

	// 	jumpToIndex(scrollIndex, !skipNextAnimation.current);

	// 	skipNextAnimation.current = false;

	// 	requestAnimationFrame(() => {
	// 		isProgrammaticScroll.current = false;
	// 	});
	// }, [activeIndex]);

	// const loopedData = [
	// 	bannerImagesList[bannerImagesList.length - 1],
	// 	...bannerImagesList,
	// 	bannerImagesList[0],
	// ];

	// const onScrollEnd = (event: any) => {
	// 	if (isProgrammaticScroll.current) return;

	// 	const offsetX = event.nativeEvent.contentOffset.x;
	// 	const index = Math.round(offsetX / ITEM_WIDTH);

	// 	if (index === loopedData.length - 1) {
	// 		isProgrammaticScroll.current = true;
	// 		skipNextAnimation.current = true;

	// 		requestAnimationFrame(() => {
	// 			jumpToIndex(1, false);
	// 			isProgrammaticScroll.current = false;
	// 		});

	// 		setActiveIndex(0);
	// 		return;
	// 	}

	// 	if (index === 0) {
	// 		isProgrammaticScroll.current = true;
	// 		skipNextAnimation.current = true;

	// 		requestAnimationFrame(() => {
	// 			jumpToIndex(bannerImagesList.length, false);
	// 			isProgrammaticScroll.current = false;
	// 		});

	// 		setActiveIndex(bannerImagesList.length - 1);
	// 		return;
	// 	}

	// 	setActiveIndex(index - 1);
	// };

	// without infinite scrolling by user

	const theme = useTheme();
	const insets = useSafeAreaInsets();
	const styles = style(theme, insets);
	const bannerListRef = React.useRef<FlatList>(null);
	const isUserInteracting = React.useRef(false);
	const isProgrammaticScroll = React.useRef(false);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const pausedProgress = React.useRef(0);
	const progress = useSharedValue(0);

	const AUTO_SCROLL_DURATION = 4000;
	const ITEM_WIDTH = SCREEN_WIDTH;

	const jumpToIndex = (index: number, animated = true) => {
		bannerListRef.current?.scrollToOffset({
			offset: index * ITEM_WIDTH,
			animated,
		});
	};

	const goNext = React.useCallback(() => {
		if (isUserInteracting.current || isProgrammaticScroll.current) return;

		setActiveIndex((prev) => {
			if (prev === bannerImagesList.length - 1) return 0;
			return prev + 1;
		});
	}, [bannerImagesList.length]);

	const startProgress = React.useCallback(() => {
		if (isUserInteracting.current || isProgrammaticScroll.current) return;

		progress.value = 0;

		progress.value = withTiming(1, { duration: AUTO_SCROLL_DURATION }, (finished) => {
			if (!finished) return;
			scheduleOnRN(goNext);
		});
	}, [goNext]);

	React.useEffect(() => {
		cancelAnimation(progress);
		startProgress();
	}, [activeIndex]);

	React.useEffect(() => {
		isProgrammaticScroll.current = true;
		jumpToIndex(activeIndex, true);
		requestAnimationFrame(() => {
			isProgrammaticScroll.current = false;
		});
	}, [activeIndex]);

	useFocusEffect(
		React.useCallback(() => {
			isUserInteracting.current = false;
			isProgrammaticScroll.current = true;

			cancelAnimation(progress);
			setActiveIndex(0);

			requestAnimationFrame(() => {
				jumpToIndex(0, false);

				requestAnimationFrame(() => {
					isProgrammaticScroll.current = false;
					startProgress();
				});
			});
		}, [startProgress]),
	);

	const onScrollEnd = (event: any) => {
		if (isProgrammaticScroll.current) return;
		const offsetX = event.nativeEvent.contentOffset.x;
		const index = Math.round(offsetX / ITEM_WIDTH);
		setActiveIndex(index);
		isUserInteracting.current = false;
	};

	const onScrollBeginDrag = () => {
		isUserInteracting.current = true;
		pausedProgress.current = progress.value;
		cancelAnimation(progress);
	};

	const onScrollEndDrag = () => {
		isUserInteracting.current = false;
		const remaining = 1 - pausedProgress.current;

		progress.value = withTiming(
			1,
			{ duration: AUTO_SCROLL_DURATION * remaining },
			(finished) => {
				if (!finished) return;
				scheduleOnRN(goNext);
			},
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.bannerIndicatorContainer}>
				{bannerImagesList.map((_, index) => {
					const animatedStyle = useAnimatedStyle(() => ({
						width:
							index === activeIndex
								? `${progress.value * 100}%`
								: index < activeIndex
									? '100%'
									: '0%',
					}));
					return (
						<View
							key={index}
							style={[
								styles.indicatorTrack,
								{
									width:
										bannerImagesList.length <= 5
											? ms(64)
											: SCREEN_WIDTH / bannerImagesList.length - ms(5),
								},
							]}
						>
							<Animated.View style={[styles.indicatorFill, animatedStyle]} />
						</View>
					);
				})}
			</View>

			<FlatList
				ref={bannerListRef}
				data={bannerImagesList}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScrollEndDrag={onScrollEndDrag}
				onScrollBeginDrag={onScrollBeginDrag}
				onMomentumScrollEnd={onScrollEnd}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<Image source={item.image} resizeMode='cover' style={styles.bannerImage} />
				)}
			/>

			<View style={styles.bottomContainer}>
				<View style={styles.textListContainer}>
					<BaseText
						numberOfLines={2}
						variant='displayLarge'
						style={[styles.bookASurveyText, styles.title1]}
					>
						{bannerImagesList[activeIndex].title1}
						<BaseText variant='displayLarge' style={styles.bookASurveyText}>
							{bannerImagesList[activeIndex].title2}
						</BaseText>
					</BaseText>

					<BaseText
						numberOfLines={3}
						variant='labelMedium'
						style={[styles.bookASurveyText, styles.description1]}
					>
						{bannerImagesList[activeIndex].description1}
						<BaseText
							variant='labelMedium'
							style={[styles.bookASurveyText, styles.description2]}
						>
							{bannerImagesList[activeIndex].description2}
						</BaseText>
					</BaseText>
				</View>

				<View style={styles.buttonContainer}>
					<AnimatedLoaderButton
						title={'Login'}
						onPress={() => {}}
						buttonColor={theme.colors.background}
						textColor={theme.colors.textColor.regular}
						borderWidth={ms(1)}
						borderColor={theme.colors.textColor.regular}
						width={SCREEN_WIDTH * 0.95}
						height={SCREEN_HEIGHT * 0.055}
						borderRadius={theme.radius.regular}
					/>
				</View>
			</View>
		</View>
	);

	// return (
	// 	<FullScreenContainer style={styles.container}>
	// 		<View style={styles.bannerIndicatorContainer}>
	// 			{bannerImagesList.map((_, index) => {
	// 				const animatedStyle = useAnimatedStyle(() => ({
	// 					width:
	// 						index === activeIndex
	// 							? `${progress.value * 100}%`
	// 							: index < activeIndex
	// 								? '100%'
	// 								: '0%',
	// 				}));
	// 				return (
	// 					<View
	// 						key={index}
	// 						style={[
	// 							styles.indicatorTrack,
	// 							{
	// 								width:
	// 									bannerImagesList.length <= 5
	// 										? ms(64)
	// 										: SCREEN_WIDTH / bannerImagesList.length - ms(5),
	// 							},
	// 						]}
	// 					>
	// 						<Animated.View style={[styles.indicatorFill, animatedStyle]} />
	// 					</View>
	// 				);
	// 			})}
	// 		</View>

	// 		<FlatList
	// 			ref={bannerListRef}
	// 			data={loopedData}
	// 			horizontal
	// 			pagingEnabled
	// 			initialScrollIndex={INITIAL_INDEX}
	// 			getItemLayout={(_, index) => ({
	// 				length: ITEM_WIDTH,
	// 				offset: ITEM_WIDTH * index,
	// 				index,
	// 			})}
	// 			removeClippedSubviews={false}
	// 			showsHorizontalScrollIndicator={false}
	// 			onMomentumScrollEnd={onScrollEnd}
	// 			keyExtractor={(_, index) => index.toString()}
	// 			renderItem={({ item }) => (
	// 				<Image source={item.image} resizeMode='cover' style={styles.bannerImage} />
	// 			)}
	// 		/>
	// 		<View style={styles.bottomContainer}>
	// 			<View style={styles.textListContainer}>
	// 				<BaseText
	// 					numberOfLines={2}
	// 					variant='displayLarge'
	// 					style={[styles.bookASurveyText, { width: '58%' }]}
	// 				>
	// 					{bannerImagesList[activeIndex].title1}
	// 					<BaseText variant='displayLarge' style={styles.bookASurveyText}>
	// 						{bannerImagesList[activeIndex].title2}
	// 					</BaseText>
	// 				</BaseText>
	// 				<BaseText
	// 					numberOfLines={3}
	// 					variant='labelMedium'
	// 					style={[styles.bookASurveyText, { lineHeight: ms(20) }]}
	// 				>
	// 					{bannerImagesList[activeIndex].description1}
	// 					<BaseText
	// 						variant='labelMedium'
	// 						style={[
	// 							styles.bookASurveyText,
	// 							{ lineHeight: ms(20), color: theme.colors.primary },
	// 						]}
	// 					>
	// 						{bannerImagesList[activeIndex].description2}
	// 					</BaseText>
	// 				</BaseText>
	// 			</View>

	// 			<View style={styles.buttonContainer}>
	// 				<AnimatedLoaderButton
	// 					title='Login'
	// 					onPress={() => {}}
	// 					buttonColor={theme.colors.textColor.white}
	// 					textColor={theme.colors.textColor.regular}
	// 					borderWidth={1}
	// 					borderColor={theme.colors.textColor.regular}
	// 					width={SCREEN_WIDTH * 0.95}
	// 					height={SCREEN_HEIGHT * 0.055}
	// 					borderRadius={theme.radius.regular}
	// 				/>
	// 				<AnimatedLoaderButton
	// 					title='Login as Guest'
	// 					onPress={() => {}}
	// 					textColor={theme.colors.textColor.white}
	// 					width={SCREEN_WIDTH * 0.95}
	// 					height={SCREEN_HEIGHT * 0.055}
	// 					borderRadius={theme.radius.regular}
	// 				/>
	// 			</View>
	// 		</View>
	// 	</FullScreenContainer>
	// );
};

export const CWCPCSMobileNewLoginBannerScreenListWithProgressBar = React.memo(
	CWCPCSMobileNewLoginBannerScreenListWithProgressBarComp,
);
