import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FullScreenContainer from 'components/hoc/full_screen_container';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import React from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import {
	KeyboardAvoidingView,
	useKeyboardHandler,
	useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { AppStackParamList } from 'types/navigation_types';
import { SCREEN_WIDTH } from 'utilities/constants';

type KeyBoardControllerScreenProps = NativeStackScreenProps<
	AppStackParamList,
	'KeyBoardControllerScreen'
>;

const KeyBoardControllerScreen: React.FC<KeyBoardControllerScreenProps> = () => {
	const { height, progress } = useReanimatedKeyboardAnimation();

	const animatedBoxStyle = useAnimatedStyle(() => {
		const scale = interpolate(progress.value, [0, 1], [1, 1.3]);
		return {
			transform: [{ translateY: -height.value }, { scale }],
		};
	});

	useKeyboardHandler(
		{
			onMove: (e) => {
				progress.value = e.progress;
				height.value = e.height;
			},
			onEnd: (e) => {
				progress.value = e.progress;
				height.value = e.height;
			},
		},
		[],
	);

	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Keyboard Controller' />

			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<KeyboardAvoidingView
					behavior='padding'
					keyboardVerticalOffset={80}
					style={styles.container}
				>
					<Animated.View style={[styles.box, animatedBoxStyle]} />

					<TextInput
						style={styles.input}
						placeholder='Type here...'
						placeholderTextColor='#333'
						returnKeyType='done'
					/>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</FullScreenContainer>
	);
};

export default KeyBoardControllerScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: 30,
	},
	box: {
		width: 70,
		height: 70,
		backgroundColor: '#17fc03',
		borderRadius: 15,
		marginBottom: 20,
	},
	input: {
		width: SCREEN_WIDTH * 0.9,
		height: 50,
		backgroundColor: '#CBCBCB',
		borderRadius: 10,
		paddingHorizontal: 10,
		fontSize: 16,
	},
});
