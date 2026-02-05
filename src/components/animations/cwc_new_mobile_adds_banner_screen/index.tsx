import BaseText from 'components/base_components/base_text';
import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	Image,
	ImageSourcePropType,
	ListRenderItem,
	NativeScrollEvent,
	NativeSyntheticEvent,
	TouchableOpacity,
	View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { ms, vs } from 'react-native-size-matters';
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

const AUTO_SCROLL_INTERVAL = 4000;

type CWCPCSMobileNewAddsBannerScreenCompProps = {};

const CWCPCSMobileNewAddsBannerScreenComp: React.FC<
	CWCPCSMobileNewAddsBannerScreenCompProps
> = () => {
	const theme = useTheme();
	const styles = style(theme);
	const flatListRefAutoScroll = useRef<FlatList<TBannerImage>>(null);
	const autoScrollRef = useRef<number | null>(null);
	const [activeScrollIndex, setActiveScrollIndex] = useState(0);
	const [containerWidth, setContainerWidth] = useState(0);

	const realIndex = activeScrollIndex;

	const isUserScroll = useRef(false);

	useEffect(() => {
		autoScrollRef.current = setInterval(() => {
			setActiveScrollIndex((prevIndex) => {
				const nextIndex = prevIndex === bannerImagesList.length - 1 ? 0 : prevIndex + 1;

				flatListRefAutoScroll.current?.scrollToIndex({
					index: nextIndex,
					animated: true,
				});

				return nextIndex;
			});
		}, AUTO_SCROLL_INTERVAL);

		return () => {
			if (autoScrollRef.current) clearInterval(autoScrollRef.current);
		};
	}, []);

	const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const index = Math.round(event.nativeEvent.contentOffset.x / containerWidth);

		setActiveScrollIndex(index);
	};

	useEffect(() => {
		if (containerWidth > 0) {
			setTimeout(() => {
				flatListRefAutoScroll.current?.scrollToIndex({
					index: 0,
					animated: false,
				});
			}, 0);
		}
	}, [containerWidth]);

	const renderItem: ListRenderItem<TBannerImage> = ({ item }) => (
		<View style={{ width: containerWidth, alignItems: 'center' }}>
			<Image source={item.image} style={styles.bannerImage} resizeMode='cover' />
			<TouchableOpacity style={styles.bookNowOverlay} activeOpacity={0.6}>
				<View
					style={{
						backgroundColor: '#1E1E1E',
						borderRadius: theme.radius.regular,
						overflow: 'hidden',
						borderWidth: ms(1),
						borderColor: theme.colors.primary,
					}}
				>
					<View
						style={{
							padding: ms(12),
							gap: vs(2),
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<View>
							<BaseText
								variant='titleSmall'
								style={{ color: theme.colors.textColor.white, textAlign: 'center' }}
							>
								{'hello'}
							</BaseText>

							<BaseText
								variant='labelSmall'
								style={{ color: theme.colors.textColor.white, textAlign: 'center' }}
							>
								{'hello'}

								<BaseText
									variant='labelSmall'
									style={{
										color: theme.colors.textColor.white,
										textAlign: 'center',
									}}
								>
									{'hello'}
								</BaseText>
							</BaseText>
						</View>
					</View>

					<View
						style={{
							backgroundColor: theme.colors.primary,
							paddingVertical: vs(1),
							alignItems: 'center',
						}}
					>
						<BaseText
							variant='labelLarge'
							style={{ color: theme.colors.textColor.white }}
						>
							{'hello'}
						</BaseText>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);

	return (
		<View
			style={styles.container}
			onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
		>
			{containerWidth > 0 && (
				<FlatList
					ref={flatListRefAutoScroll}
					data={bannerImagesList}
					renderItem={renderItem}
					keyExtractor={(_, index) => index.toString()}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					getItemLayout={(_, index) => ({
						length: containerWidth,
						offset: containerWidth * index,
						index,
					})}
					onMomentumScrollEnd={onMomentumScrollEnd}
					onScrollBeginDrag={() => {
						isUserScroll.current = true;
					}}
					onScrollEndDrag={() => {
						isUserScroll.current = false;
					}}
				/>
			)}

			<View style={styles.paginationDots}>
				{bannerImagesList.map((_, index) => (
					<View
						key={index}
						style={[
							styles.dot,
							{
								backgroundColor:
									index === realIndex
										? theme.colors.primary
										: theme.colors.onSurfaceVariant,
							},
						]}
					/>
				))}
			</View>
		</View>
	);
};

export const CWCPCSMobileNewAddsBannerScreen = React.memo(CWCPCSMobileNewAddsBannerScreenComp);
