import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TopTabNavigator from 'navigation/top_tab_navigator';
import React from 'react';
import { AppStackParamList } from 'types/navigation_types';

type TopTabDashboardScreenProps = NativeStackScreenProps<
	AppStackParamList,
	'TopTabDashboardScreen'
>;

const TopTabDashboardScreen: React.FC<TopTabDashboardScreenProps> = () => {
	return <TopTabNavigator />;
};

export default TopTabDashboardScreen;
