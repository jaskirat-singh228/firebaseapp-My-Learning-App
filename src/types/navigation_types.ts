export type AppStackParamList = {
	BottomTabDashboardScreen: undefined;
	TopTabDashboardScreen: undefined;
	TodoScreen: {
		id?: string;
	};
	NativeModuleScreen: undefined;
	ReducerScreen: undefined;
	KeyBoardControllerScreen: undefined;
	AppWelcomeAnimationScreen: undefined;
	AnimationDemoScreen: {
		animationType:
			| 'interpolate'
			| 'fade'
			| 'slide'
			| 'scroll_header'
			| 'range_bar'
			| 'pop_up'
			| 'repeat_&_sequence'
			| 'drag_box'
			| 'progress_bar'
			| 'animated_crousal';
	};
	ContactScreen: undefined;
	LocationScreen: undefined;
};

export type AuthenticationStackParamList = {
	LoginScreen: undefined;
	SignUpScreen: undefined;
	SplashScreen: undefined;
};

export type BottomTabNavigatorParamList = {
	HomeScreen: undefined;
	ProfileScreen: undefined;
	SettingsScreen: undefined;
};

export type TopTabNavigatorParamList = {
	TopTab1: undefined;
	TopTab2: undefined;
};
