import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

// Types
type ScreenSize = {
	width: number;
	height: number;
};

// Guideline bases (mutable)
let guidelineBaseWidth = 390;
let guidelineBaseHeight = 844;

// Current screen dimensions
let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

function setAdaptiveGuidelines({ width, height }: ScreenSize) {
	const aspectRatio = height / width;

	if (width >= 600) {
		// Tablet / Foldable open
		guidelineBaseWidth = 600;
		guidelineBaseHeight = 960;
	} else if (aspectRatio < 1.6) {
		// Landscape / foldable
		guidelineBaseWidth = 480;
		guidelineBaseHeight = 800;
	} else {
		// Regular phone (portrait)
		guidelineBaseWidth = 390;
		guidelineBaseHeight = 844;
	}
}

function updateDimensions(window: ScaledSize) {
	width = window.width;
	height = window.height;
	setAdaptiveGuidelines({ width, height });
}

// Call initially
setAdaptiveGuidelines({ width, height });

// --- Scale helpers recalc fresh every time ---
export const scale = (size: number): number => {
	const shortDimension = Math.min(width, height);
	return PixelRatio.roundToNearestPixel((shortDimension / guidelineBaseWidth) * size);
};

export const verticalScale = (size: number): number => {
	const longDimension = Math.max(width, height);
	return PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size);
};

export const moderateScale = (size: number, factor = 0.5): number =>
	size + (scale(size) - size) * factor;

export const moderateVerticalScale = (size: number, factor = 0.5): number =>
	size + (verticalScale(size) - size) * factor;

// Aliases
export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;

// Listen to orientation / fold changes
Dimensions.addEventListener('change', ({ window }) => updateDimensions(window));
