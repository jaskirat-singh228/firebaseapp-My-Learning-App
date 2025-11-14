import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from 'react-native-reanimated';
import { AppStackParamList } from 'types/navigation_types';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';

type AppWelcomeAnimationScreenProps = NativeStackScreenProps<
	AppStackParamList,
	'AppWelcomeAnimationScreen'
>;

const AppWelcomeAnimationScreen: React.FC<AppWelcomeAnimationScreenProps> = (props) => {
	const theme = useTheme();
	const { dark } = useTheme();

	const welcomeText = useSharedValue<number>(-20);
	const worldText = useSharedValue<number>(0);
	const balloons = useSharedValue<number>(SCREEN_HEIGHT);
	const fabButtonTranslateX = useSharedValue<number>(10);
	const fabButtonTranslateY = useSharedValue<number>(60);
	const fabButtonSize = useSharedValue<number>(100);
	const fabButtonOpacity = useSharedValue<number>(0);
	const fabButtonDescriptionOpacity = useSharedValue<number>(0);
	const showAnimationButtonsOpacity = useSharedValue<number>(0);

	const [timer, setTimer] = React.useState(0);

	React.useEffect(() => {
		if (timer > 9) return;

		setTimeout(() => {
			setTimer(timer + 1);
		}, 1000);
	}, [timer]);

	const initializeAnimation = () => {
		welcomeText.value = withDelay(
			200,
			withTiming(SCREEN_HEIGHT * 0.48, { duration: 2000 }, () => {
				worldText.value = withTiming(1, { duration: 2000 }, () => {
					showBalloons();
				});
			}),
		);
	};

	const scaleDownFAB = () => {
		fabButtonSize.value = withTiming(100, { duration: 2000 });
		fabButtonTranslateX.value = withTiming(SCREEN_WIDTH - 130, { duration: 2000 });
		fabButtonTranslateY.value = withTiming(
			SCREEN_HEIGHT - 150,
			{ duration: 2000 },
			() => (showAnimationButtonsOpacity.value = withTiming(1, { duration: 2000 })),
		);
	};

	const scaleAndTranslateFABIcon = () => {
		fabButtonTranslateX.value = withTiming(SCREEN_WIDTH * 0.05, { duration: 2000 }, () => {});
		fabButtonTranslateY.value = withTiming(SCREEN_HEIGHT / 3, { duration: 2000 }, () => {});
		fabButtonSize.value = withTiming(SCREEN_WIDTH * 0.9, { duration: 2000 }, () => {
			fabButtonDescriptionOpacity.value = withTiming(1, { duration: 1500 }, () => {
				fabButtonDescriptionOpacity.value = withTiming(0, { duration: 1500 }, () => {
					scaleDownFAB();
				});
			});
		});
	};

	const showFABIcon = () => {
		fabButtonOpacity.value = withTiming(1, { duration: 1000 }, () => {
			scaleAndTranslateFABIcon();
		});
	};

	const hideWelcomeMsg = () => {
		welcomeText.value = withTiming(
			SCREEN_HEIGHT,
			{
				duration: 2000,
			},
			() => {
				showFABIcon();
			},
		);
	};

	const showBalloons = () => {
		balloons.value = withTiming(-SCREEN_HEIGHT, { duration: 2000 }, () => {
			worldText.value = withTiming(0, { duration: 1000 }, () => {
				hideWelcomeMsg();
			});
		});
	};

	React.useEffect(() => {
		initializeAnimation();
	}, []);

	const welcomeAnimation = useAnimatedStyle(() => ({
		transform: [{ translateY: welcomeText.value }],
	}));

	const worldAnimation = useAnimatedStyle(() => ({
		opacity: worldText.value,
	}));

	const balloonsAnimation = useAnimatedStyle(() => ({
		transform: [{ translateY: balloons.value }],
	}));

	const fabButtonAnimation = useAnimatedStyle(() => ({
		transform: [
			{ translateX: fabButtonTranslateX.value },
			{ translateY: fabButtonTranslateY.value },
		],
	}));

	const fabButtonImageAnimation = useAnimatedStyle(() => ({
		height: fabButtonSize.value,
		width: fabButtonSize.value,
		opacity: fabButtonOpacity.value,
	}));

	const fabButtonDescriptionAnimation = useAnimatedStyle(() => ({
		opacity: fabButtonDescriptionOpacity.value,
	}));

	const showAnimationButtonsList = useAnimatedStyle(() => ({
		opacity: showAnimationButtonsOpacity.value,
	}));

	const animationComponents: {
		title: string;
		type:
			| 'interpolate'
			| 'scroll_header'
			| 'fade'
			| 'slide'
			| 'range_bar'
			| 'repeat_&_sequence'
			| 'pop_up'
			| 'drag_box'
			| 'progress_bar'
			| 'animated_crousal';
	}[] = [
		{ title: 'Interpolate', type: 'interpolate' },
		{ title: 'Animated Scroll Header', type: 'scroll_header' },
		{ title: 'Fade', type: 'fade' },
		{ title: 'Slide', type: 'slide' },
		{ title: 'Range Bar', type: 'range_bar' },
		{ title: 'Repeat and Sequence', type: 'repeat_&_sequence' },
		{ title: 'Pop Up', type: 'pop_up' },
		{ title: 'Drag Box', type: 'drag_box' },
		{ title: 'Instagram Story Progress', type: 'progress_bar' },
		{ title: 'Animated Crousal', type: 'animated_crousal' },
	];

	return (
		<>
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					backgroundColor: theme.colors.background,
				}}
			>
				{/* <BaseText>{`Timer: ${timer}`}</BaseText> */}
				<Animated.Text
					style={[
						theme.fonts.displayMedium,
						welcomeAnimation,
						{
							color: dark
								? theme.colors.textColor.white
								: theme.colors.textColor.black,
						},
					]}
				>
					Welcome To
				</Animated.Text>
				<Animated.Text
					style={[
						theme.fonts.displayLarge,
						worldAnimation,
						{
							position: 'absolute',
							top: SCREEN_HEIGHT / 2 + 20,
							color: dark
								? theme.colors.textColor.white
								: theme.colors.textColor.black,
						},
					]}
				>
					Animations World 🌍
				</Animated.Text>
				<Animated.Image
					resizeMode={'contain'}
					style={[
						balloonsAnimation,
						{
							height: SCREEN_HEIGHT,
							width: SCREEN_WIDTH,
						},
					]}
					source={require('assets/images/balloons.png')}
				/>
			</View>
			<Animated.View
				style={[
					{
						position: 'absolute',
						zIndex: 1000,
					},
					fabButtonAnimation,
				]}
			>
				<Animated.Image
					resizeMode='contain'
					style={[
						fabButtonImageAnimation,
						{
							borderRadius: theme.radius.circle,
						},
					]}
					source={require('assets/images/fab-button.png')}
				/>
				<Animated.Text
					style={[
						fabButtonDescriptionAnimation,
						{ alignSelf: 'center' },
						theme.fonts.titleLarge,
					]}
				>
					Fab Description
				</Animated.Text>
			</Animated.View>
			<Animated.FlatList
				data={animationComponents}
				style={showAnimationButtonsList}
				contentContainerStyle={{ paddingBottom: ms(100) }}
				renderItem={({ item }) => (
					<View style={{ marginTop: ms(10) }}>
						<AnimatedLoaderButton
							key={item.type}
							title={item.title}
							onPress={() =>
								props.navigation.navigate('AnimationDemoScreen', {
									animationType: item.type,
								})
							}
							alignSelfCenter
						/>
					</View>
				)}
			/>
		</>
	);
};

export default AppWelcomeAnimationScreen;
