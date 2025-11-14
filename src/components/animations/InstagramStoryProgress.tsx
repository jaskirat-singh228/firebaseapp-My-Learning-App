import FullScreenContainer from 'components/hoc/full_screen_container';
import { CARD_HEIGHT } from 'components/list_items/AnimatedCrousalItem';
import InstaStoryItem from 'components/list_items/InstaStoryItem';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import React from 'react';
import { FlatList, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
	interpolate,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { SCREEN_WIDTH } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { urlList } from './AnimatedCrousal';

const BAR_WIDTH = (SCREEN_WIDTH - ms(8) * (urlList.length - 1)) / urlList.length;

export const InstagramStoryProgress = () => {
	const theme = useTheme();
	const urlListRef = React.useRef<FlatList>(null);
	const [currentIndex, setCurrentIndex] = React.useState<number>(0);
	const [duration, setDuration] = React.useState<number>(5000);
	const barProgresses = Array.from({ length: urlList.length }, () => useSharedValue(0));

	const scrollToPosition = (index: number) => {
		urlListRef?.current?.scrollToIndex({
			index: index,
			animated: true,
		});
	};

	const animateToNext = (index: number) => {
		runOnJS(setCurrentIndex)(index === urlList.length - 1 ? index : index + 1);
		runOnJS(scrollToPosition)(index === urlList.length - 1 ? index : index + 1);
	};

	const animateIndex = (index: number) => {
		if (index < 0) return;
		if (currentIndex === 0) {
			barProgresses[currentIndex].value = withTiming(1, {
				duration: duration,
			});
		}
		barProgresses[index].value = withTiming(1, { duration: duration }, (isCompleted) => {
			if (isCompleted) {
				animateToNext(index);
			}
		});
	};

	const resetAll = () => {
		barProgresses.forEach((p) => (p.value = 0));
		setCurrentIndex(0);
		animateIndex(0);
		const item = urlList[0];
		setDuration(item.type === 'image' ? 5000 : item.duration);
	};

	React.useEffect(() => {
		animateIndex(currentIndex);
		scrollToPosition(currentIndex);
	}, [currentIndex, barProgresses]);

	if (barProgresses.length === 0) {
		return null;
	}

	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Instagram Story Progress' />
			<View style={{ flexDirection: 'row', paddingLeft: ms(3) }}>
				{barProgresses.map((p, index) => {
					const animatedStyle = useAnimatedStyle(() => ({
						width: interpolate(p.value, [0, 1], [0, BAR_WIDTH], 'clamp'),
						borderTopRightRadius: p.value >= 0.95 ? theme.radius.circle : 0,
						borderBottomRightRadius: p.value >= 0.95 ? theme.radius.circle : 0,
					}));
					return (
						<View
							key={index}
							style={{
								backgroundColor: theme.colors.backdrop,
								height: ms(10),
								marginRight: ms(3),
								marginVertical: ms(20),
								borderRadius: theme.radius.circle,
								width: BAR_WIDTH,
							}}
						>
							<Animated.View
								style={[
									{
										position: 'absolute',
										top: 0,
										backgroundColor: 'red',
										height: ms(10),
										borderTopLeftRadius: theme.radius.circle,
										borderBottomLeftRadius: theme.radius.circle,
									},
									animatedStyle,
								]}
							/>
						</View>
					);
				})}
			</View>
			<FlatList
				ref={urlListRef}
				data={urlList}
				keyExtractor={(item) => item.id.toString()}
				pagingEnabled
				horizontal
				scrollEnabled={false}
				contentContainerStyle={{
					height: CARD_HEIGHT,
				}}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => {
					return (
						<View
							style={{
								width: SCREEN_WIDTH,
								alignItems: 'center',
							}}
						>
							<InstaStoryItem
								item={item}
								index={index}
								setDuration={setDuration}
								currentIndex={currentIndex}
								setCurrentIndex={setCurrentIndex}
							/>
						</View>
					);
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: SCREEN_WIDTH,
					padding: ms(15),
				}}
			>
				<AnimatedLoaderButton
					width={SCREEN_WIDTH * 0.2}
					onPress={() => {
						if (currentIndex > 0) {
							const prev = currentIndex - 1;
							barProgresses[currentIndex].value = 0;
							barProgresses[prev].value = 0;
							setCurrentIndex(prev);
							scrollToPosition(prev);
							const item = urlList[prev];
							setDuration(item.type === 'image' ? 5000 : item.duration);
						}
					}}
					title='Prev'
				/>

				<AnimatedLoaderButton
					width={SCREEN_WIDTH * 0.4}
					onPress={resetAll}
					title='Restart'
				/>

				<AnimatedLoaderButton
					width={SCREEN_WIDTH * 0.2}
					onPress={() => {
						if (currentIndex < urlList.length - 1) {
							barProgresses[currentIndex].value = 1;
							const next = currentIndex + 1;
							barProgresses[next].value = 0;
							setCurrentIndex(next);
							scrollToPosition(next);
							const item = urlList[next];
							setDuration(item.type === 'image' ? 5000 : item.duration);
						}
					}}
					title='Next'
				/>
			</View>
		</FullScreenContainer>
	);
};
