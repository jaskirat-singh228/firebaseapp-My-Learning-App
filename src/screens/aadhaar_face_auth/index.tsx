import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseText from 'components/base_components/base_text';
import FullScreenContainer from 'components/hoc/full_screen_container';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { BackWithTitleHeader } from 'components/molecules/back_with_title_view';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Linking,
	Platform,
	ScrollView,
	Share,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import NativeAadhaarFaceAuth from 'specs/NativeAadhaarFaceAuth';
import { AppStackParamList } from 'types/navigation_types';
import { SCREEN_WIDTH } from 'utilities/constants';
import { ms, vs } from 'utilities/scale_utils';

export type AadhaarEnv = 'P';
export type AadhaarCamera = 'F' | 'B';
export type AadhaarLanguage = 'en' | 'hi' | 'bn' | 'mr' | 'kn' | 'ml' | 'or' | 'ta' | 'te';

export interface PidDataResponse {
	isSuccess: boolean;
	errCode: string;
	errInfo: string;
	friendlyMessage?: string;
	qScore: string;
	fCount: string;
	fType: string;
	rdsId: string;
	rdsVer: string;
	dpId: string;
	dc: string;
	mi: string;
	mc: string;
	skey: string;
	skeyCi: string;
	hmac: string;
	data: string;
	dataType: string;
	txnId: string;
	txnStatus: string;
	responseCode: string;
	rawXml: string;
}

export interface LocalMatchResponse {
	isSuccess: boolean;
	requestId: string;
	responseCode: string;
	dateTime: string;
	errCode: string;
	errInfo: string;
	friendlyMessage?: string;
	rawXml: string;
}

export const UIDAI_ERROR_MESSAGES: Record<string, string> = {
	'0': 'Success: Biometric captured / matched successfully.',
	'100': 'Invalid PidOptions input: XML does not strictly adhere to specification.',
	'101': 'Missing transaction ID (txnId/requestId).',
	'102': 'Duplicate transaction ID.',
	'103': "Incorrect PidOption's env value (must be 'P' or 'PP').",
	'106': 'Invalid encryption key (encKey).',
	'107': 'Callback URL is missing or not a fully qualified URL.',
	'108': 'Failed to post response to callback URL endpoint.',
	'110': 'Signature verification of signed intent failed.',
	'111': 'Entity is not authorised.',
	'112': 'Certificate used for signing is expired.',
	'120': 'Invalid value for fType.',
	'121': 'Invalid value for fCount.',
	'122': 'Invalid value for iType.',
	'123': 'Invalid value for iCount.',
	'124': 'Invalid value for pidVer.',
	'125': 'Invalid value for timeout.',
	'126': 'Invalid value for posh.',
	'127': 'Invalid value for pidFormat.',
	'128': 'Invalid demo structure.',
	'129': 'Protobuf format is not supported.',
	'730': 'Capture failed: Please improve lighting and try again.',
	'731': 'User aborted the capture operation.',
	'732': 'Capture failed: Please move to better lighting.',
	'733': 'Capture failed: Please improve lighting and hold still.',
	'734': 'Capture failed: Please check background.',
	'735': 'UserCapture failed: Please check background.',
	'736': 'Capture failed: Please blink during capture.',
	'737': 'Capture failed: Please improve lighting.',
	'738': 'Capture failed: Please focus towards the camera.',
	'760': 'Local face match failed: Face does not match target document photo.',
	'850': 'Unsupported application version: Please upgrade FaceRD app.',
	'860': 'FaceRD application seems corrupted: Please reinstall.',
	'864': 'FaceRD application seems corrupted: Please retry after a few hours.',
	'880': 'Application not allowed: Please upgrade Google Play Services.',
	'881': 'Unsupported Android version: Requires Android 9 (SDK 28) or higher.',
	'890': 'Application not allowed on this device due to low resources.',
	'891': 'Functionality not supported below Android 8 OS version.',
	'892': 'Security error: FaceRD will not work while USB Debugging is enabled.',
	'901': 'Device resource out of memory.',
	'902': 'Device not connected to the internet.',
	'903': 'Failed to connect with server (Connection timed out).',
	'904': 'Failed due to network related issues.',
};

export const getFriendlyErrorMessage = (code: string, fallbackInfo?: string): string => {
	if (UIDAI_ERROR_MESSAGES[code]) {
		return UIDAI_ERROR_MESSAGES[code];
	}
	const numCode = parseInt(code, 10);
	if (numCode >= 870 && numCode <= 879) {
		return `Application is not allowed to run on this device (${code}).`;
	}
	if (numCode >= 9701 && numCode <= 9999) {
		return `FaceRD app internal error (${code}).`;
	}
	return fallbackInfo || `Face authentication failed with error code: ${code || 'Unknown'}`;
};

type AadhaarFaceAuthScreenProps = NativeStackScreenProps<
	AppStackParamList,
	'AadhaarFaceAuthScreen'
>;

const LANGUAGES: { code: AadhaarLanguage; label: string }[] = [
	{ code: 'en', label: 'English' },
	{ code: 'hi', label: 'हिंदी (Hindi)' },
	{ code: 'bn', label: 'বাংলা (Bengali)' },
	{ code: 'mr', label: 'मराठी (Marathi)' },
	{ code: 'ta', label: 'தமிழ் (Tamil)' },
	{ code: 'te', label: 'తెలుగు (Telugu)' },
	{ code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
	{ code: 'ml', label: 'മലയാളം (Malayalam)' },
	{ code: 'or', label: 'ଓଡ଼ିଆ (Oriya)' },
];

const AadhaarFaceAuthScreen: React.FC<AadhaarFaceAuthScreenProps> = () => {
	const theme = useTheme();

	// Readiness state
	const [isFaceRDInstalled, setIsFaceRDInstalled] = useState<boolean | null>(null);
	const [isUsbDebugging, setIsUsbDebugging] = useState<boolean | null>(null);
	const [checkingStatus, setCheckingStatus] = useState<boolean>(false);

	// Configuration state
	const [env, setEnv] = useState<AadhaarEnv>('P');
	const [cameraUsage, setCameraUsage] = useState<AadhaarCamera>('F');
	const [language, setLanguage] = useState<AadhaarLanguage>('en');
	const [wadh, setWadh] = useState<string>('');
	const [otp, setOtp] = useState<string>('');

	// Local Match Document state
	const [docType, setDocType] = useState<'PHOTO' | 'AADHAAR'>('PHOTO');
	const [docBase64, setDocBase64] = useState<string>('');

	// Execution state
	const [isCapturing, setIsCapturing] = useState<boolean>(false);
	const [isMatching, setIsMatching] = useState<boolean>(false);
	const [captureResult, setCaptureResult] = useState<PidDataResponse | null>(null);
	const [matchResult, setMatchResult] = useState<LocalMatchResponse | null>(null);
	const [activeTab, setActiveTab] = useState<'capture' | 'match'>('capture');
	const [showRawXml, setShowRawXml] = useState<boolean>(false);

	useEffect(() => {
		checkDeviceReadiness();
	}, []);

	const checkDeviceReadiness = async () => {
		setCheckingStatus(true);
		try {
			if (Platform.OS !== 'android') {
				setIsFaceRDInstalled(false);
				setIsUsbDebugging(false);
				return;
			}
			const [installed, adbEnabled] = await Promise.all([
				NativeAadhaarFaceAuth.isFaceRDAppInstalled(),
				NativeAadhaarFaceAuth.isUsbDebuggingEnabled(),
			]);
			setIsFaceRDInstalled(installed);
			setIsUsbDebugging(adbEnabled);
		} catch (err) {
			console.warn('Error checking device readiness:', err);
		} finally {
			setCheckingStatus(false);
		}
	};

	const handleInstallFaceRD = async () => {
		if (Platform.OS === 'ios') {
			try {
				await Linking.openURL('itms-apps://apps.apple.com/search?term=aadhaarfacerd');
			} catch (err) {
				// Fallback for iOS Simulator which doesn't have the App Store
				Linking.openURL('https://www.apple.com/search/aadhaarfacerd');
			}
			return;
		}

		try {
			await NativeAadhaarFaceAuth.openFaceRDPlayStore();
		} catch (err) {
			Linking.openURL('https://play.google.com/store/apps/details?id=in.gov.uidai.facerd');
		}
	};

	const handleStartCapture = async () => {
		if (Platform.OS !== 'android') {
			Alert.alert(
				'Android Only',
				'UIDAI Aadhaar FaceRD app is only supported on Android devices (v9 / SDK 28+).',
			);
			return;
		}

		if (isFaceRDInstalled === false) {
			Alert.alert(
				'FaceRD App Required',
				'Aadhaar FaceRD service application is not installed on this device. Would you like to install it from the Google Play Store?',
				[
					{ text: 'Cancel', style: 'cancel' },
					{ text: 'Install App', onPress: handleInstallFaceRD },
				],
			);
			return;
		}

		if (isUsbDebugging === true) {
			Alert.alert(
				'USB Debugging Active',
				'FaceRD security guidelines mandate that USB debugging / ADB must be disabled. FaceRD app will exit with Error 892 if not disabled.\n\nPlease disable USB debugging in Developer Options.',
				[
					{ text: 'Cancel', style: 'cancel' },
					{
						text: 'Proceed Anyway',
						style: 'destructive',
						onPress: () => performFaceCapture(),
					},
				],
			);
			return;
		}

		await performFaceCapture();
	};

	const performFaceCapture = async () => {
		setIsCapturing(true);
		setCaptureResult(null);
		setMatchResult(null);

		try {
			const rawResult = (await NativeAadhaarFaceAuth.captureFace({
				env,
				cameraUsage,
				language,
				wadh: wadh.trim() || undefined,
				otp: otp.trim() || undefined,
			})) as any;

			const result: PidDataResponse = {
				...rawResult,
				friendlyMessage: getFriendlyErrorMessage(rawResult.errCode, rawResult.errInfo),
			};
			setCaptureResult(result);

			if (result.isSuccess) {
				Alert.alert(
					'Face Capture Succeeded',
					`Biometric live image captured successfully.\nTxn ID: ${result.txnId}\nQuality Score: ${result.qScore || 'Good'}`,
				);
			} else {
				Alert.alert(`Capture Failed (Code: ${result.errCode})`, result.friendlyMessage);
			}
		} catch (err: any) {
			Alert.alert('Capture Error', err?.message || 'Failed to capture face.');
		} finally {
			setIsCapturing(false);
		}
	};

	const handleLocalMatch = async () => {
		if (Platform.OS !== 'android') {
			Alert.alert(
				'Android Only',
				'UIDAI Aadhaar FaceRD is only supported on Android devices.',
			);
			return;
		}

		if (!docBase64.trim()) {
			Alert.alert(
				'Missing Document',
				'Please paste the base64 encoded user photo or UIDAI signed KYC XML document in the text box below.',
			);
			return;
		}

		setIsMatching(true);
		setCaptureResult(null);
		setMatchResult(null);

		try {
			const rawResult = (await NativeAadhaarFaceAuth.localFaceMatch({
				docType,
				doc1Base64: docBase64.trim(),
				language,
				enableAutoCapture: true,
			})) as any;

			const result: LocalMatchResponse = {
				...rawResult,
				friendlyMessage: getFriendlyErrorMessage(rawResult.errCode, rawResult.errInfo),
			};
			setMatchResult(result);

			if (result.isSuccess) {
				Alert.alert('Match Succeeded', 'Live face matched successfully with document!');
			} else {
				Alert.alert(`Match Failed (Code: ${result.errCode})`, result.friendlyMessage);
			}
		} catch (err: any) {
			Alert.alert('Local Match Error', err?.message || 'Local match failed.');
		} finally {
			setIsMatching(false);
		}
	};

	const copyToClipboard = async (text: string, label: string) => {
		try {
			await Share.share({
				message: text,
				title: label,
			});
		} catch (e) {
			Alert.alert(label, text);
		}
	};

	return (
		<FullScreenContainer>
			<BackWithTitleHeader title='Aadhaar Face Auth' />
			<ScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.contentContainer}
				keyboardShouldPersistTaps='handled'
			>
				{/* UIDAI Header Banner */}
				<View style={styles.headerBanner}>
					<View style={styles.tricolorStripe} />
					<View style={styles.bannerContent}>
						<BaseText style={styles.bannerTitle}>
							UIDAI Aadhaar FaceRD Integration
						</BaseText>
						<BaseText style={styles.bannerSubtitle}>
							API Specification v1.2 (rev 2) • Headless Android Service
						</BaseText>
					</View>
				</View>

				{/* Device Readiness Diagnostics Card */}
				<View style={styles.card}>
					<View style={styles.cardHeaderRow}>
						<BaseText style={styles.cardTitle}>Device & Service Diagnostics</BaseText>
						<TouchableOpacity
							onPress={checkDeviceReadiness}
							style={styles.refreshBadge}
						>
							<BaseText style={styles.refreshText}>
								{checkingStatus ? 'Checking...' : 'Refresh'}
							</BaseText>
						</TouchableOpacity>
					</View>

					<View style={styles.diagnosticRow}>
						<BaseText style={styles.diagnosticLabel}>FaceRD App Status:</BaseText>
						<View style={styles.statusPill}>
							<BaseText
								style={[
									styles.statusText,
									{
										color:
											isFaceRDInstalled === true
												? '#1b7e3f'
												: isFaceRDInstalled === false
													? '#d93025'
													: '#757575',
									},
								]}
							>
								{isFaceRDInstalled === true
									? 'Installed & Ready'
									: isFaceRDInstalled === false
										? 'Not Installed'
										: 'Unknown'}
							</BaseText>
						</View>
					</View>

					{isFaceRDInstalled === false && (
						<TouchableOpacity
							style={styles.installButton}
							onPress={handleInstallFaceRD}
						>
							<BaseText style={styles.installButtonText}>
								Download FaceRD from Google Play Store
							</BaseText>
						</TouchableOpacity>
					)}

					<View style={styles.diagnosticRow}>
						<BaseText style={styles.diagnosticLabel}>USB Debugging:</BaseText>
						<View style={styles.statusPill}>
							<BaseText
								style={[
									styles.statusText,
									{
										color: isUsbDebugging ? '#d93025' : '#1b7e3f',
									},
								]}
							>
								{isUsbDebugging === true
									? 'Enabled (Must be Disabled)'
									: isUsbDebugging === false
										? 'Disabled (Compliant)'
										: 'Checking...'}
							</BaseText>
						</View>
					</View>

					{isUsbDebugging === true && (
						<View style={styles.warningBox}>
							<BaseText style={styles.warningTitle}>⚠️ Security Requirement</BaseText>
							<BaseText style={styles.warningText}>
								UIDAI security policy blocks face capture if USB Debugging is ON
								(Error 892). Turn OFF USB Debugging in Developer Options before
								attempting face capture.
							</BaseText>
						</View>
					)}
				</View>

				{/* Flow Selection Tabs */}
				<View style={styles.tabContainer}>
					<TouchableOpacity
						style={[
							styles.tabButton,
							activeTab === 'capture' && styles.activeTabButton,
						]}
						onPress={() => setActiveTab('capture')}
					>
						<BaseText
							style={[
								styles.tabButtonText,
								activeTab === 'capture' && styles.activeTabText,
							]}
						>
							Online Auth (CAPTURE)
						</BaseText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tabButton, activeTab === 'match' && styles.activeTabButton]}
						onPress={() => setActiveTab('match')}
					>
						<BaseText
							style={[
								styles.tabButtonText,
								activeTab === 'match' && styles.activeTabText,
							]}
						>
							Local Match (OFFLINE)
						</BaseText>
					</TouchableOpacity>
				</View>

				{/* CAPTURE Intent Controls */}
				{activeTab === 'capture' ? (
					<View style={styles.card}>
						<BaseText style={styles.cardTitle}>Capture Configuration</BaseText>



						{/* Camera Selector */}
						<BaseText style={styles.fieldLabel}>Default Camera:</BaseText>
						<View style={styles.selectorRow}>
							<TouchableOpacity
								style={[
									styles.selectorOption,
									cameraUsage === 'F' && styles.selectorOptionSelected,
								]}
								onPress={() => setCameraUsage('F')}
							>
								<BaseText
									style={[
										styles.selectorOptionText,
										cameraUsage === 'F' && styles.selectorOptionTextSelected,
									]}
								>
									Front Camera (F)
								</BaseText>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.selectorOption,
									cameraUsage === 'B' && styles.selectorOptionSelected,
								]}
								onPress={() => setCameraUsage('B')}
							>
								<BaseText
									style={[
										styles.selectorOptionText,
										cameraUsage === 'B' && styles.selectorOptionTextSelected,
									]}
								>
									Back Camera (B)
								</BaseText>
							</TouchableOpacity>
						</View>

						{/* Language Selector */}
						<BaseText style={styles.fieldLabel}>FaceRD Instruction Language:</BaseText>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.langScroll}
						>
							{LANGUAGES.map((lang) => (
								<TouchableOpacity
									key={lang.code}
									style={[
										styles.langPill,
										language === lang.code && styles.langPillSelected,
									]}
									onPress={() => setLanguage(lang.code)}
								>
									<BaseText
										style={[
											styles.langPillText,
											language === lang.code && styles.langPillTextSelected,
										]}
									>
										{lang.label}
									</BaseText>
								</TouchableOpacity>
							))}
						</ScrollView>

						{/* Optional wadh / otp inputs */}
						<BaseText style={styles.fieldLabel}>
							Optional Target Hash (wadh for eKYC):
						</BaseText>
						<TextInput
							style={styles.input}
							placeholder='e.g. 256-bit SHA target hash'
							value={wadh}
							onChangeText={setWadh}
							autoCapitalize='none'
						/>

						<BaseText style={styles.fieldLabel}>
							Optional OTP (Face + OTP Auth):
						</BaseText>
						<TextInput
							style={styles.input}
							placeholder='e.g. 6-digit OTP'
							value={otp}
							onChangeText={setOtp}
							keyboardType='number-pad'
						/>

						{/* Action Button */}
						<View style={{ marginTop: vs(15) }}>
							<AnimatedLoaderButton
								title={isCapturing ? 'Starting FaceRD...' : 'Capture Live Face'}
								isLoading={isCapturing}
								onPress={handleStartCapture}
								width={SCREEN_WIDTH * 0.82}
								alignSelfCenter
							/>
						</View>
					</View>
				) : (
					/* LOCAL FACE MATCH Controls */
					<View style={styles.card}>
						<BaseText style={styles.cardTitle}>Local Face Match Configuration</BaseText>

						<BaseText style={styles.fieldLabel}>Document Type:</BaseText>
						<View style={styles.selectorRow}>
							<TouchableOpacity
								style={[
									styles.selectorOption,
									docType === 'PHOTO' && styles.selectorOptionSelected,
								]}
								onPress={() => setDocType('PHOTO')}
							>
								<BaseText
									style={[
										styles.selectorOptionText,
										docType === 'PHOTO' && styles.selectorOptionTextSelected,
									]}
								>
									Photo (Base64)
								</BaseText>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.selectorOption,
									docType === 'AADHAAR' && styles.selectorOptionSelected,
								]}
								onPress={() => setDocType('AADHAAR')}
							>
								<BaseText
									style={[
										styles.selectorOptionText,
										docType === 'AADHAAR' && styles.selectorOptionTextSelected,
									]}
								>
									Offline KYC XML
								</BaseText>
							</TouchableOpacity>
						</View>

						<BaseText style={styles.fieldLabel}>
							Target Document (Base64 Encoded):
						</BaseText>
						<TextInput
							style={[styles.input, styles.textArea]}
							placeholder='Paste Base64 encoded photo or signed offline KYC XML...'
							value={docBase64}
							onChangeText={setDocBase64}
							multiline
							numberOfLines={4}
							autoCapitalize='none'
						/>

						<View style={{ marginTop: vs(15) }}>
							<AnimatedLoaderButton
								title={isMatching ? 'Matching...' : 'Perform Local Face Match'}
								isLoading={isMatching}
								onPress={handleLocalMatch}
								width={SCREEN_WIDTH * 0.82}
								alignSelfCenter
							/>
						</View>
					</View>
				)}

				{/* Results Card */}
				{captureResult && (
					<View
						style={[
							styles.card,
							captureResult.isSuccess ? styles.cardSuccess : styles.cardFailure,
						]}
					>
						<View style={styles.resultHeader}>
							<BaseText style={styles.resultHeaderTitle}>
								{captureResult.isSuccess
									? '✅ Biometric Capture Successful'
									: `❌ Capture Failed (Code: ${captureResult.errCode})`}
							</BaseText>
						</View>

						<BaseText style={styles.friendlyMessage}>
							{captureResult.friendlyMessage}
						</BaseText>

						{captureResult.isSuccess ? (
							<View style={styles.resultDetails}>
								<View style={styles.infoRow}>
									<BaseText style={styles.infoKey}>Transaction ID:</BaseText>
									<BaseText style={styles.infoVal}>
										{captureResult.txnId}
									</BaseText>
								</View>
								<View style={styles.infoRow}>
									<BaseText style={styles.infoKey}>Quality Score:</BaseText>
									<BaseText style={styles.infoVal}>
										{captureResult.qScore || 'N/A'}
									</BaseText>
								</View>
								<View style={styles.infoRow}>
									<BaseText style={styles.infoKey}>Device Info:</BaseText>
									<BaseText style={styles.infoVal}>
										{captureResult.rdsId} v{captureResult.rdsVer}
									</BaseText>
								</View>
								<View style={styles.infoRow}>
									<BaseText style={styles.infoKey}>Status:</BaseText>
									<BaseText style={styles.infoVal}>
										{captureResult.txnStatus || 'PID_CREATED'}
									</BaseText>
								</View>

								<View style={styles.actionButtonGroup}>
									<TouchableOpacity
										style={styles.copyButton}
										onPress={() =>
											copyToClipboard(
												captureResult.rawXml,
												'Full PidData XML',
											)
										}
									>
										<BaseText style={styles.copyButtonText}>
											Copy Full XML
										</BaseText>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.copyButton}
										onPress={() =>
											copyToClipboard(
												captureResult.data,
												'Encrypted PID Data',
											)
										}
									>
										<BaseText style={styles.copyButtonText}>
											Copy Encrypted PID
										</BaseText>
									</TouchableOpacity>
								</View>
							</View>
						) : null}

						{captureResult.rawXml ? (
							<TouchableOpacity
								style={styles.toggleRawButton}
								onPress={() => setShowRawXml(!showRawXml)}
							>
								<BaseText style={styles.toggleRawText}>
									{showRawXml ? 'Hide Raw XML' : 'View Raw XML Response'}
								</BaseText>
							</TouchableOpacity>
						) : null}

						{showRawXml && captureResult.rawXml ? (
							<View style={styles.rawXmlBox}>
								<ScrollView horizontal>
									<BaseText style={styles.rawXmlText}>
										{captureResult.rawXml}
									</BaseText>
								</ScrollView>
							</View>
						) : null}
					</View>
				)}

				{matchResult && (
					<View
						style={[
							styles.card,
							matchResult.isSuccess ? styles.cardSuccess : styles.cardFailure,
						]}
					>
						<BaseText style={styles.resultHeaderTitle}>
							{matchResult.isSuccess
								? '✅ Face Match Succeeded'
								: `❌ Match Failed (Code: ${matchResult.errCode})`}
						</BaseText>
						<BaseText style={styles.friendlyMessage}>
							{matchResult.friendlyMessage}
						</BaseText>
						<View style={styles.infoRow}>
							<BaseText style={styles.infoKey}>Request ID:</BaseText>
							<BaseText style={styles.infoVal}>{matchResult.requestId}</BaseText>
						</View>
						<View style={styles.infoRow}>
							<BaseText style={styles.infoKey}>Date Time:</BaseText>
							<BaseText style={styles.infoVal}>{matchResult.dateTime}</BaseText>
						</View>
					</View>
				)}

				{/* Guidance & Best Practices */}
				<View style={[styles.card, { marginBottom: vs(40) }]}>
					<BaseText style={styles.cardTitle}>How FaceRD Works</BaseText>
					<BaseText style={styles.bulletPoint}>
						• <BaseText style={{ fontWeight: 'bold' }}>Eye Level</BaseText>: Hold phone
						straight at face level.
					</BaseText>
					<BaseText style={styles.bulletPoint}>
						• <BaseText style={{ fontWeight: 'bold' }}>Lighting</BaseText>: Ensure
						uniform lighting with no strong backlight (avoids errors 730, 732, 737).
					</BaseText>
					<BaseText style={styles.bulletPoint}>
						• <BaseText style={{ fontWeight: 'bold' }}>Blink</BaseText>: FaceRD liveness
						check requires blinking naturally during capture (code 736).
					</BaseText>
					<BaseText style={styles.bulletPoint}>
						• <BaseText style={{ fontWeight: 'bold' }}>Security</BaseText>: Biometrics
						are encrypted natively inside FaceRD using UIDAI PKI certificates.
					</BaseText>
				</View>
			</ScrollView>
		</FullScreenContainer>
	);
};

export default AadhaarFaceAuthScreen;

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
		backgroundColor: '#f5f6fa',
	},
	contentContainer: {
		padding: ms(16),
		gap: vs(14),
	},
	headerBanner: {
		backgroundColor: '#FFFFFF',
		borderRadius: ms(12),
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	tricolorStripe: {
		height: 6,
		backgroundColor: '#ff9933', // Saffron
		borderBottomWidth: 2,
		borderBottomColor: '#138808', // Green
	},
	bannerContent: {
		padding: ms(14),
	},
	bannerTitle: {
		fontSize: ms(18),
		fontWeight: '700',
		color: '#1e293b',
	},
	bannerSubtitle: {
		fontSize: ms(12),
		color: '#64748b',
		marginTop: vs(3),
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: ms(12),
		padding: ms(14),
		borderWidth: 1,
		borderColor: '#e2e8f0',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.04,
		shadowRadius: 3,
		elevation: 1,
	},
	cardSuccess: {
		borderColor: '#86efac',
		backgroundColor: '#f0fdf4',
	},
	cardFailure: {
		borderColor: '#fca5a5',
		backgroundColor: '#fef2f2',
	},
	cardHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: vs(10),
	},
	cardTitle: {
		fontSize: ms(15),
		fontWeight: '700',
		color: '#0f172a',
	},
	refreshBadge: {
		paddingHorizontal: ms(10),
		paddingVertical: vs(4),
		backgroundColor: '#e2e8f0',
		borderRadius: ms(6),
	},
	refreshText: {
		fontSize: ms(11),
		fontWeight: '600',
		color: '#334155',
	},
	diagnosticRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: vs(6),
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#f1f5f9',
	},
	diagnosticLabel: {
		fontSize: ms(13),
		color: '#475569',
		fontWeight: '500',
	},
	statusPill: {
		paddingHorizontal: ms(8),
		paddingVertical: vs(3),
		borderRadius: ms(6),
	},
	statusText: {
		fontSize: ms(12),
		fontWeight: '700',
	},
	installButton: {
		marginTop: vs(8),
		paddingVertical: vs(8),
		paddingHorizontal: ms(12),
		backgroundColor: '#2563eb',
		borderRadius: ms(8),
		alignItems: 'center',
	},
	installButtonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: ms(12),
	},
	warningBox: {
		marginTop: vs(10),
		padding: ms(10),
		backgroundColor: '#fef3c7',
		borderRadius: ms(8),
		borderLeftWidth: 4,
		borderLeftColor: '#f59e0b',
	},
	warningTitle: {
		fontSize: ms(12),
		fontWeight: '700',
		color: '#92400e',
		marginBottom: vs(2),
	},
	warningText: {
		fontSize: ms(11),
		color: '#78350f',
		lineHeight: vs(16),
	},
	tabContainer: {
		flexDirection: 'row',
		backgroundColor: '#e2e8f0',
		borderRadius: ms(8),
		padding: ms(3),
	},
	tabButton: {
		flex: 1,
		paddingVertical: vs(8),
		alignItems: 'center',
		borderRadius: ms(6),
	},
	activeTabButton: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	tabButtonText: {
		fontSize: ms(12),
		fontWeight: '600',
		color: '#64748b',
	},
	activeTabText: {
		color: '#0f172a',
		fontWeight: '700',
	},
	fieldLabel: {
		fontSize: ms(12),
		fontWeight: '600',
		color: '#475569',
		marginTop: vs(10),
		marginBottom: vs(4),
	},
	selectorRow: {
		flexDirection: 'row',
		gap: ms(8),
	},
	selectorOption: {
		flex: 1,
		paddingVertical: vs(8),
		paddingHorizontal: ms(10),
		borderRadius: ms(8),
		borderWidth: 1,
		borderColor: '#cbd5e1',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	selectorOptionSelected: {
		borderColor: '#2563eb',
		backgroundColor: '#eff6ff',
	},
	selectorOptionText: {
		fontSize: ms(12),
		color: '#475569',
		fontWeight: '500',
	},
	selectorOptionTextSelected: {
		color: '#1d4ed8',
		fontWeight: '700',
	},
	langScroll: {
		flexDirection: 'row',
		marginVertical: vs(4),
	},
	langPill: {
		paddingHorizontal: ms(10),
		paddingVertical: vs(6),
		borderRadius: ms(16),
		borderWidth: 1,
		borderColor: '#cbd5e1',
		marginRight: ms(6),
		backgroundColor: '#FFFFFF',
	},
	langPillSelected: {
		borderColor: '#2563eb',
		backgroundColor: '#2563eb',
	},
	langPillText: {
		fontSize: ms(11),
		color: '#475569',
		fontWeight: '500',
	},
	langPillTextSelected: {
		color: '#FFFFFF',
		fontWeight: '700',
	},
	input: {
		borderWidth: 1,
		borderColor: '#cbd5e1',
		borderRadius: ms(8),
		paddingHorizontal: ms(10),
		paddingVertical: vs(8),
		fontSize: ms(12),
		color: '#0f172a',
		backgroundColor: '#FFFFFF',
	},
	textArea: {
		height: vs(75),
		textAlignVertical: 'top',
	},
	resultHeader: {
		marginBottom: vs(6),
	},
	resultHeaderTitle: {
		fontSize: ms(14),
		fontWeight: '700',
		color: '#0f172a',
	},
	friendlyMessage: {
		fontSize: ms(12),
		color: '#334155',
		marginBottom: vs(10),
		lineHeight: vs(17),
	},
	resultDetails: {
		backgroundColor: 'rgba(255,255,255,0.7)',
		borderRadius: ms(8),
		padding: ms(10),
		gap: vs(6),
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: ms(8),
	},
	infoKey: {
		fontSize: ms(11),
		fontWeight: '600',
		color: '#64748b',
		flex: 1,
	},
	infoVal: {
		fontSize: ms(11),
		color: '#0f172a',
		flex: 2,
		textAlign: 'right',
	},
	actionButtonGroup: {
		flexDirection: 'row',
		gap: ms(8),
		marginTop: vs(8),
	},
	copyButton: {
		flex: 1,
		backgroundColor: '#0f172a',
		paddingVertical: vs(7),
		borderRadius: ms(6),
		alignItems: 'center',
	},
	copyButtonText: {
		color: '#FFFFFF',
		fontSize: ms(11),
		fontWeight: '600',
	},
	toggleRawButton: {
		marginTop: vs(8),
		alignSelf: 'center',
		paddingVertical: vs(4),
	},
	toggleRawText: {
		color: '#2563eb',
		fontSize: ms(11),
		fontWeight: '600',
		textDecorationLine: 'underline',
	},
	rawXmlBox: {
		marginTop: vs(6),
		backgroundColor: '#1e293b',
		padding: ms(10),
		borderRadius: ms(8),
		maxHeight: vs(150),
	},
	rawXmlText: {
		color: '#38bdf8',
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
		fontSize: ms(10),
	},
	bulletPoint: {
		fontSize: ms(12),
		color: '#475569',
		lineHeight: vs(18),
		marginTop: vs(4),
	},
});
