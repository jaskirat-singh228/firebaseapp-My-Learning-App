import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';
import { IS_IOS } from 'utilities/constants';

const useKeyboard = () => {
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

	useEffect(() => {
		const showEvent = IS_IOS ? 'keyboardWillShow' : 'keyboardDidShow';
		const hideEvent = IS_IOS ? 'keyboardWillHide' : 'keyboardDidHide';

		const keyboardShowListener = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
			setKeyboardVisible(true);
			setKeyboardHeight(e.endCoordinates?.height ?? 0);
		});
		const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
			setKeyboardVisible(false);
			setKeyboardHeight(0);
		});

		return () => {
			keyboardHideListener.remove();
			keyboardShowListener.remove();
		};
	}, []);

	return { isKeyboardVisible, keyboardHeight };
};

export default useKeyboard;
