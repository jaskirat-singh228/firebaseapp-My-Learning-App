import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BottomTabNavigator from 'navigation/bottom_tab_navigator';
import React from 'react';
import { AppStackParamList } from 'types/navigation_types';

type BottomTabDashboardScreenProps = NativeStackScreenProps<
	AppStackParamList,
	'BottomTabDashboardScreen'
>;

const BottomTabDashboardScreen: React.FC<BottomTabDashboardScreenProps> = () => {
	return <BottomTabNavigator />;
};

export default BottomTabDashboardScreen;
