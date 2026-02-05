import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import BaseBottomSheetModal from 'components/base_components/base_bottom_sheet_modal';
import BaseText from 'components/base_components/base_text';
import BounceView from 'components/molecules/bounce_view';
import React, { ReactNode, useEffect, useRef } from 'react';
import { FlatList, Keyboard, TouchableOpacity, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcon } from 'utilities/constants';
import { ms } from 'utilities/scale_utils';
import { style } from './style';

export type DropDownItem = {
	id: string;
	label: string;
};

type BookServiceDropDownProps = {
	placeholder: string;
	label?: string;
	headerTitle: string;
	data: DropDownItem[];
	listEmptyMsg?: string;
	onSelect?: (item: DropDownItem) => void;
	borderRadius?: number;
	selectedServiceType?: string;
};

const DropDownComp: React.FC<BookServiceDropDownProps> = (props) => {
	const {
		label,
		headerTitle,
		data,
		listEmptyMsg,
		onSelect,
		placeholder,
		borderRadius,
		selectedServiceType,
	} = props;
	const theme = useTheme();
	const styles = style(theme);
	const insets = useSafeAreaInsets();
	const bottomSheetRef = useRef<BottomSheetModal>(null);
	const [selectedItem, setSelectedItem] = React.useState<DropDownItem | null>(null);

	useEffect(() => {
		if (!selectedServiceType) return;

		// Check if item already exists
		const existingItem = data.find((item) => item.label === selectedServiceType);

		if (existingItem) {
			setSelectedItem(existingItem);
			return;
		}
	}, [selectedServiceType]);

	const onPressItem = (item: DropDownItem) => {
		setSelectedItem(item);
		onSelect && onSelect(item);
		bottomSheetRef.current?.close();
	};

	return (
		<View style={styles.container}>
			{label && (
				<BaseText style={{ color: theme.colors.textColor.regular }}>{label}</BaseText>
			)}
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					bottomSheetRef.current?.present();
					Keyboard.dismiss();
				}}
				style={[
					styles.selectedItemConatiner,
					{ borderRadius: borderRadius ?? theme.radius.small },
				]}
			>
				<BaseText
					variant='bodyLarge'
					style={{
						color: selectedItem
							? theme.colors.textColor.regular
							: theme.colors.textInput.placeholder,
					}}
				>
					{selectedItem?.label ?? placeholder}
				</BaseText>
				<Icon source={MaterialIcon.CHEVRON_DOWN} size={ms(20)} />
			</TouchableOpacity>
			<BaseBottomSheetModal showHeader={false} reff={bottomSheetRef}>
				<BottomSheetView style={styles.listContainer}>
					<ModalHeader
						title={headerTitle}
						onClose={() => bottomSheetRef.current?.dismiss()}
					/>

					<FlatList
						data={data}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item }: { item: DropDownItem }) => (
							<TouchableOpacity
								onPress={() => onPressItem(item)}
								style={styles.listItem}
							>
								<BaseText variant='bodyMedium'>{item.label}</BaseText>
							</TouchableOpacity>
						)}
						contentContainerStyle={{ paddingBottom: insets?.bottom ?? 0, gap: ms(10) }}
						ListEmptyComponent={
							<BaseText
								variant='titleMedium'
								style={{
									alignSelf: 'center',
								}}
							>
								{listEmptyMsg}
							</BaseText>
						}
					/>
				</BottomSheetView>
			</BaseBottomSheetModal>
		</View>
	);
};
export const DropDown = DropDownComp as typeof DropDownComp;

export type ModalHeaderCompProps = {
	title: string;
	onClose: () => void;
	isInput?: ReactNode;
	isPadding?: boolean;
	iconBgColor?: string;
	marginBottom?: number;
};

const ModalHeader: React.FC<ModalHeaderCompProps> = (props) => {
	const theme = useTheme();
	const {
		title,
		onClose,
		isPadding = false,
		isInput,
		iconBgColor = theme.colors.primary,
		marginBottom,
	} = props;

	const viewStyle = style(theme);

	return (
		<View>
			<View
				style={[
					viewStyle.mainConatiner,
					{
						paddingHorizontal: isPadding ? ms(16) : 0,
						marginBottom: marginBottom,
					},
				]}
			>
				<BaseText variant='titleSmall'>{title}</BaseText>
				<BounceView
					style={[viewStyle.closeIcon, { backgroundColor: iconBgColor }]}
					onPress={() => {
						onClose();
						Keyboard.dismiss();
					}}
				>
					<Icon
						source={'close'}
						size={ms(18)}
						color={
							iconBgColor === theme.colors.primary
								? theme.colors.iconColor.white
								: theme.colors.textColor.regular
						}
					/>
				</BounceView>
			</View>
			{isInput && isInput}
		</View>
	);
};
