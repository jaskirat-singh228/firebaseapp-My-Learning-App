import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import BaseTextInput from 'components/base_components/base_text_input';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import React from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { TopTabNavigatorParamList } from 'types/navigation_types';

type TopTab1Props = MaterialTopTabScreenProps<TopTabNavigatorParamList, 'TopTab1'>;

const TopTab1: React.FC<TopTab1Props> = () => {
	const [value, setValue] = React.useState('');

	return (
		<KeyboardAvoidingView
			behavior={'padding'}
			style={{
				flex: 1,
				alignItems: 'center',
			}}
		>
			<ScrollView
				style={{
					flex: 1,
					width: '100%',
				}}
				contentContainerStyle={{ paddingBottom: ms(100) }}
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
			</ScrollView>
			<AnimatedLoaderButton title='Press' onPress={() => {}} />
		</KeyboardAvoidingView>
	);
};

export default TopTab1;
