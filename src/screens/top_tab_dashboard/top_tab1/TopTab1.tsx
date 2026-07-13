import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import BaseTextInput from 'components/base_components/base_text_input';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { TopTabNavigatorParamList } from 'types/navigation_types';

type TopTab1Props = MaterialTopTabScreenProps<TopTabNavigatorParamList, 'TopTab1'>;

const TopTab1: React.FC<TopTab1Props> = () => {
	const [value, setValue] = React.useState('');
	const theme = useTheme();
	const insets = useSafeAreaInsets();

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<KeyboardAwareScrollView
				style={{
					width: '100%',
				}}
				contentContainerStyle={{ paddingBottom: ms(16) }}
				bottomOffset={ms(16)}
				showsVerticalScrollIndicator={false}
			>
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
				<BaseTextInput placeholder='Enter...' value={value} onChangeText={setValue} />
			</KeyboardAwareScrollView>
			<View
				style={{
					backgroundColor: '#ffffff',
					width: '100%',
					padding: ms(16),
					borderTopWidth: ms(1),
					borderTopColor: theme.colors.borderColor.regular,
					paddingBottom: insets.bottom ? insets.bottom + ms(16) : ms(16),
				}}
			>
				<AnimatedLoaderButton alignSelfCenter title='Press' onPress={() => {}} />
			</View>
		</View>
	);
};

export default TopTab1;
