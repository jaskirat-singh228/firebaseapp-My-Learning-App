import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import BounceView from 'components/molecules/bounce_view';
import React, { ReactNode } from 'react';
import { DimensionValue, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { MaterialIcon } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { style } from './style';

type BackWithTitleCompProps = {
	title?: string;
	onBackPress?: () => void;
	backgroundColor?: string;
	iconColor?: string;
	width?: DimensionValue | undefined;
	isRightComp?: ReactNode;
};

const BackWithTitleComp: React.FC<BackWithTitleCompProps> = (props) => {
	const theme = useTheme();
	const {
		title = true,
		onBackPress,
		backgroundColor = theme.colors.primary,
		iconColor = theme.colors.textColor.white,
		width = '100%',
		isRightComp,
	} = props;
	const navigation = useNavigation<NativeStackNavigationProp<any>>();

	const onBackIconPress = () => {
		onBackPress && onBackPress();
		navigation.goBack();
	};

	return (
		<View
			style={[style(theme).mainContainer, { backgroundColor: backgroundColor, width: width }]}
		>
			<View style={style(theme).iconAndTextContainer}>
				<BounceView
					onPress={onBackIconPress}
					style={style(theme).backButtonAndTextContainer}
				>
					<Icon source={MaterialIcon.CHEVRON_LEFT} size={ms(30)} color={iconColor} />
					<BaseText
						style={{ color: theme.colors.textColor.white }}
						numberOfLines={1}
						variant='titleMedium'
					>
						{title}
					</BaseText>
				</BounceView>

				{isRightComp && isRightComp}
			</View>
		</View>
	);
};

export const BackWithTitleHeader = React.memo(BackWithTitleComp);
