import { Dimensions, Platform } from 'react-native';
import { MD3CustomTheme } from 'react-native-paper';
import { OrderStatus } from './enums';
import { ms } from './scale_utils';

export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');
export const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

export const FONT_REGULAR = 'Roboto-Regular';
export const FONT_SEMI_BOLD = 'Roboto-Medium';
export const FONT_BOLD = 'Roboto-Bold';

export const BottomTabBarIconSize = ms(24);
export const BottomTabBarLabelSize = ms(12);

export const isThemeButtonShown = true;
export const isLanguageButtonShown = true;

export const APP_DATE_FORMAT = 'DD MMM YYYY';
export const APP_DATE_TIME_FORMAT = 'DD MMM YYYY, hh:mm A';

export const MaterialIcon = {
	SEARCH: 'magnify',
	HOME: 'home',
	HOME_OUTLINE: 'home-outline',
	CLIPBOARD: 'clipboard',
	CLIPBOARD_OUTLINE: 'clipboard-outline',
	PASSWORD_VISIBLE: 'eye',
	PASSWORD_HIDDEN: 'eye-off',
	MAP_MARKER: 'map-marker',
	MAP_MARKER_OUTLINE: 'map-marker-outline',
	ORBIT_VARIENT: 'orbit-variant',
	CHEVRON_UP: 'chevron-up',
	CHEVRON_DOWN: 'chevron-down',
	CHEVRON_LEFT: 'chevron-left',
	CHEVRON_RIGHT: 'chevron-right',
	EMAIL_OUTLINE: 'email-outline',
	CLOCK_8_OUTLINE: 'clock-time-eight-outline',
	CLOCK_3_OUTLINE: 'clock-time-three-outline',
	CELLPHONE_CHECK: 'cellphone-check',
	PENCIL_OULINE: 'pencil-outline',
	FACE_AGENT: 'face-agent',
	QUESTION_OUTLINE: 'help-circle-outline',
	SETTINGS: 'cog',
	SETTINGS_OUTLINE: 'cog-outline',
	BRIGHTNESS: 'brightness-6',
	CREDIT_CARD_OUTLINE: 'credit-card-outline',
	STAR: 'star',
	STAR_OUTLINE: 'star-outline',
	MEDAL_OUTLINE: 'medal-outline',
	WALLET_OUTLINE: 'wallet-outline',
	TEXT_BOX_OUTLINE: 'text-box-outline',
	DELETE: 'delete',
	SHARE_VARIANT: 'share-variant',
	SEND: 'send',
	EYE: 'eye',
	EYE_OFF: 'eye-off',
	FILE_SEARCH_OUTLINE: 'file-search-outline',
	CHECK_BOLD: 'check-bold',
	CHECK_CIRCLE: 'check-circle',
	ALERT_CIRCLE_OUTLINE: 'alert-circle-outline',
	ALERT_TRIANGLE_OUTLINE: 'alert',
	INFORMATION_OUTLINE: 'information',
	ACCOUNT: 'account',
	ACCOUNT_OUTLINE: 'account-outline',
	CART_OUTLINE: 'cart-outline',
	MAGNIFY: 'magnify',
	DIRECTIONS: 'directions',
	ADD: 'plus',
	CLOSE: 'close',
	THREE_DOTS_VERTICAL: 'dots-vertical',
	MOBILE: 'phone-outline',
	CALENDAR_MONTH: 'calendar-month',
	CHECKBOX_BLANK: 'checkbox-blank-outline',
	CHECKBOX_MARKED: 'checkbox-marked',
	DOWNLOAD: 'download',
	NEWSPAPER_VARIENT: 'newspaper-variant',
	TRUCK_CHECK: 'truck-check',
	PACKAGE_CHECK_CLOSED: 'package-variant-closed',
	HOME_ACCOUNT: 'home-account',
	CANCEL: 'cancel',
	TIMER_SAND: 'timer-sand',
	PROGRESS_CLOCK: 'progress-clock',
	LOCK: 'lock',
};

export const RAZORPAY_KEY = 'rzp_test_S2va5o3zko0xcK';

export const TAX_RATES = {
	CGST: 9,
	SGST: 9,
	IGST: 0,
};

export const DEFAULT_DISCOUNT_PERCENTAGE = 30;

export const RATE_PER_SQFT = 0;

export const getFullAddress = (data: any) => {
	const item = data;

	const addressParts = [
		item?.FlatHouseBuilding,
		item?.AreaStreetSector,
		item?.LandMark,
		item?.CityName,
		item?.StateName,
		item?.PinCode,
	];

	// Remove empty, null, undefined values
	const fullAddress = addressParts
		.filter((part) => part && part.toString().trim() !== '')
		.join(', ');

	return fullAddress;
};

export const getOrderStatusText = (status: number) => {
	switch (status) {
		case OrderStatus.Pending:
			return 'Pending';
		case OrderStatus.Active:
			return 'Active';
		case OrderStatus.Inactive:
			return 'Inactive';
		case OrderStatus.Deleted:
			return 'Deleted';
		case OrderStatus.Approved:
			return 'Approved';
		case OrderStatus.Rejected:
			return 'Rejected';
		case OrderStatus.InProgress:
			return 'In Progress';
		case OrderStatus.Completed:
			return 'Completed';
		case OrderStatus.Cancelled:
			return 'Cancelled';
		case OrderStatus.Assigned:
			return 'Assigned';
		default:
			return '';
	}
};

export const getOrderStatusBgColor = (status: number, theme: MD3CustomTheme) => {
	switch (status) {
		case OrderStatus.Approved:
			return theme.colors.successContainer;
		case OrderStatus.Active:
			return theme.colors.successContainer;
		case OrderStatus.Completed:
			return theme.colors.successContainer;
		case OrderStatus.Pending:
			return theme.colors.primaryContainer;
		case OrderStatus.InProgress:
			return theme.colors.infoContainer;
		case OrderStatus.Rejected:
		case OrderStatus.Cancelled:
		case OrderStatus.Deleted:
		case OrderStatus.Inactive:
			return theme.colors.errorContainer;
		case OrderStatus.Assigned:
			return theme.colors.commonColor.darkBlue;
		default:
			return theme.colors.surfaceVariant;
	}
};

export const getOrderStatusTextColor = (status: number, theme: MD3CustomTheme) => {
	switch (status) {
		case OrderStatus.Approved:
			return theme.colors.textColor.success;
		case OrderStatus.Active:
			return theme.colors.textColor.success;
		case OrderStatus.Completed:
			return theme.colors.textColor.success;
		case OrderStatus.Pending:
			return theme.colors.textColor.primary;
		case OrderStatus.InProgress:
			return theme.colors.info;
		case OrderStatus.Rejected:
		case OrderStatus.Cancelled:
		case OrderStatus.Deleted:
		case OrderStatus.Inactive:
			return theme.colors.textColor.white;
		case OrderStatus.Assigned:
			return theme.colors.textColor.success;
		default:
			return theme.colors.textColor.regular;
	}
};

export const getBookingReferenceNumber = (bookingType: string, bookingId: number) => {
	if (bookingType === 'SURVEY') {
		return '#SUR_' + '000' + bookingId;
	} else {
		return '#SER_' + '000' + bookingId;
	}
};

export const calculateServiceCharges = (
	approxSize: number,
	serviceRate: number,
	paidSurveyCharges: number,
) => {
	return approxSize * serviceRate - paidSurveyCharges;
};
// export const formatDate = (dateString?: string | null): string => {
// 	if (!dateString) return '';

// 	const date = new Date(dateString);
// 	if (isNaN(date.getTime())) return '';

// 	return date.toLocaleDateString('en-GB', {
// 		day: 'numeric',
// 		month: 'long',
// 		year: 'numeric',
// 	});
// };
export const formatDateToShort = (dateString: string | null | undefined): string => {
	if (!dateString) return '';

	const isoRegex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

	if (!isoRegex.test(dateString)) {
		return dateString;
	}

	const date: Date = new Date(dateString);

	if (isNaN(date.getTime())) return dateString;

	return date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
};
export const calculateRoundOff = (amt: number) => {
	const rounded = Math.round(amt);
	const roundOff = +(rounded - amt).toFixed(2);

	return roundOff || 0;
};

export const getUnitShortName = (unitName: string): string => {
	const units: Record<string, string> = {
		'Square Foot': 'sq ft',
		'Square Feet': 'sq ft',
		'Square Meter': 'sq m',
		'Square Yard': 'sq yd',
		Meter: 'm',
		Kilometer: 'km',
		Centimeter: 'cm',
		Millimeter: 'mm',
		Foot: 'ft',
		Inch: 'in',
	};

	return units[unitName] ?? unitName;
};

const convertToArray = (value: string): string[] => {
	return value.split(',').map((item) => item.trim().replace(/^'|'$/g, ''));
};

export const calculateGstRates = (
	stateName: string,
	pcsCenterStateName: string,
	gstPercentage: number,
) => {
	let isSameState = false;
	let cgstRate = 0;
	let sgstRate = 0;
	let igstRate = 0;
	let totalGstRate = 0;

	console.log('stateName', stateName);
	console.log('pcsCenterStateName', pcsCenterStateName);
	console.log('gstPercentage', gstPercentage);

	if (
		stateName &&
		pcsCenterStateName &&
		stateName.trim().toLowerCase() === pcsCenterStateName.trim().toLowerCase()
	) {
		isSameState = true;
		cgstRate = gstPercentage / 2;
		sgstRate = gstPercentage / 2;
		totalGstRate = cgstRate + sgstRate;
	} else {
		isSameState = false;
		igstRate = gstPercentage;
		totalGstRate = igstRate;
	}

	return { isSameState, cgstRate, sgstRate, igstRate, totalGstRate };
};

export const numberToIndianWords = (amount: number): string => {
	const ones = [
		'',
		'One',
		'Two',
		'Three',
		'Four',
		'Five',
		'Six',
		'Seven',
		'Eight',
		'Nine',
		'Ten',
		'Eleven',
		'Twelve',
		'Thirteen',
		'Fourteen',
		'Fifteen',
		'Sixteen',
		'Seventeen',
		'Eighteen',
		'Nineteen',
	];

	const tens = [
		'',
		'',
		'Twenty',
		'Thirty',
		'Forty',
		'Fifty',
		'Sixty',
		'Seventy',
		'Eighty',
		'Ninety',
	];

	const convertBelowThousand = (num: number): string => {
		let word = '';

		if (num >= 100) {
			word += ones[Math.floor(num / 100)] + ' Hundred ';
			num %= 100;
		}

		if (num >= 20) {
			word += tens[Math.floor(num / 10)] + ' ';
			num %= 10;
		}

		if (num > 0) {
			word += ones[num] + ' ';
		}

		return word.trim();
	};

	const convertNumber = (num: number): string => {
		let result = '';

		if (num >= 10000000) {
			result += convertBelowThousand(Math.floor(num / 10000000)) + ' Crore ';
			num %= 10000000;
		}

		if (num >= 100000) {
			result += convertBelowThousand(Math.floor(num / 100000)) + ' Lakh ';
			num %= 100000;
		}

		if (num >= 1000) {
			result += convertBelowThousand(Math.floor(num / 1000)) + ' Thousand ';
			num %= 1000;
		}

		if (num > 0) {
			result += convertBelowThousand(num);
		}

		return result.trim();
	};

	if (amount === 0) return 'Zero Rupees Only';

	const [rupees, paisa] = amount.toFixed(2).split('.');

	const rupeeWords = convertNumber(parseInt(rupees));

	let finalWords = `Rupees ${rupeeWords}`;

	if (parseInt(paisa) > 0) {
		const paisaWords = convertBelowThousand(parseInt(paisa));
		finalWords += ` and ${paisaWords} Paisa`;
	}

	finalWords += ' Only';

	return finalWords;
};

export const generateTransactionNumber = (): string => {
	const now = new Date();

	const pad = (num: number, size: number = 2) => num.toString().padStart(size, '0');

	const datePart = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
	const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
	const ms = pad(now.getMilliseconds(), 3);
	const random = Math.floor(100 + Math.random() * 900); // 3 digit

	return `${datePart}${timePart}${ms}${random}`;
};

export const roundOff = (value: number, decimals: number = 2): number => {
	const factor = Math.pow(10, decimals);
	return Math.round((value + Number.EPSILON) * factor) / factor;
};
