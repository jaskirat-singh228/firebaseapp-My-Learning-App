import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FullScreenContainerCompProps = {
	children?: React.ReactNode;
	paddingBottom?: number;
	paddingTop?: number;
	headerColor?: string;
	footerColor?: string;
	style?: StyleProp<ViewStyle>;
};

const FullScreenContainerComp: React.FC<FullScreenContainerCompProps> = (props) => {
	const theme = useTheme();
	const {
		children,
		paddingBottom,
		paddingTop,
		headerColor = theme.colors.background,
		footerColor,
		style,
	} = props;
	const { top, bottom } = useSafeAreaInsets();

	const headerHeight = top + (paddingTop ?? 0);
	const footerPadding = paddingBottom ?? bottom;

	return (
		<View
			style={{
				flex: 1,
				width: '100%',
			}}
		>
			{headerHeight > 0 && (
				<View
					style={{
						backgroundColor: headerColor,
						width: '100%',
						height: headerHeight,
					}}
				/>
			)}
			<View style={[{ flex: 1, width: '100%' }, style]}>{children}</View>
			{footerPadding > 0 && (
				<View
					style={{
						backgroundColor: footerColor ?? theme.colors.background,
						width: '100%',
						height: footerPadding,
					}}
				/>
			)}
		</View>
	);
};

const FullScreenContainer = React.memo(FullScreenContainerComp);
export default FullScreenContainer;
