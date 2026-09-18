import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
	isFaceRDAppInstalled(): Promise<boolean>;
	isUsbDebuggingEnabled(): Promise<boolean>;
	openFaceRDPlayStore(): Promise<boolean>;
	captureFace(options: Object): Promise<Object>;
	localFaceMatch(options: Object): Promise<Object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAadhaarFaceAuth');
