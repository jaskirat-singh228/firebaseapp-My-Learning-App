import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomTabView from 'components/organisms/bottom_tab_bar';
import React from 'react';
import HomeScreen from 'screens/bottom_tab_dashboard/home';
import ProfileScreen from 'screens/bottom_tab_dashboard/profile';
import SettingsScreen from 'screens/bottom_tab_dashboard/settings';
import { BottomTabNavigatorParamList } from 'types/navigation_types';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			tabBar={(props) => <BottomTabView {...props} />}
			screenOptions={{
				headerShown: false,
			}}
		>
			<Tab.Screen name={'HomeScreen'} component={HomeScreen} />
			<Tab.Screen name={'ProfileScreen'} component={ProfileScreen} />
			<Tab.Screen name={'SettingsScreen'} component={SettingsScreen} />
		</Tab.Navigator>
	);
};

export default BottomTabNavigator;
