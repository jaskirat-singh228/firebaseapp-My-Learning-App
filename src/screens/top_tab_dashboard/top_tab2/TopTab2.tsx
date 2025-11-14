import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import BaseText from 'components/base_components/base_text';
import React from 'react';
import { ScrollView } from 'react-native';
import { TopTabNavigatorParamList } from 'types/navigation_types';

type TopTab2Props = MaterialTopTabScreenProps<TopTabNavigatorParamList, 'TopTab2'>;

const TopTab2: React.FC<TopTab2Props> = () => {
	return (
		<ScrollView>
			<BaseText>TopTab2</BaseText>
		</ScrollView>
	);
};

export default TopTab2;
