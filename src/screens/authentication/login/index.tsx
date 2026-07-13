import { useNetInfo } from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BaseTextInput from 'components/base_components/base_text_input';
import AnimatedLoaderButton from 'components/molecules/animated_loader_button';
import { useFirebaseGoogleSignIn } from 'hooks/firebase/authentication/useFirebaseGoogleSignUp';
import { useFirebaseLogin } from 'hooks/firebase/authentication/useFirebaseLogin';
import { useTranslation } from 'hooks/useTranslation';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { AuthenticationStackParamList } from 'types/navigation_types';
import { ms, vs } from 'utilities/scale_utils';

type LoginScreenProps = NativeStackScreenProps<AuthenticationStackParamList, 'LoginScreen'>;

export type TFormData = {
	email: string;
	password: string;
};

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { isConnected } = useNetInfo();
	const { isGoogleSignInLoading, signInWithGoogle } = useFirebaseGoogleSignIn(
		isConnected ?? false,
	);
	const { isLoginLoading, firebaseLogin } = useFirebaseLogin(isConnected ?? false);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const {
		control,
		handleSubmit,
		setValue,
		setError,
		formState: { errors },
	} = useForm<TFormData>();

	React.useEffect(() => {
		GoogleSignin.configure({
			webClientId: '681853484837-gguo2m441emk29ach713obahsda2ebnn.apps.googleusercontent.com',
		});
	}, []);

	return (
		<ScrollView contentContainerStyle={style.scrollContentContainer}>
			<KeyboardAvoidingView
				behavior={'padding'}
				keyboardVerticalOffset={vs(30)}
				style={{
					width: '100%',
					paddingHorizontal: ms(15),
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Controller
					control={control}
					name={'email'}
					rules={{ required: t('validation.emailRequired') }}
					render={({ field: { onBlur, value } }) => (
						<BaseTextInput
							value={value}
							onChangeText={(text) => {
								setValue('email', text);
								setError('email', { message: '' });
							}}
							onBlur={onBlur}
							outlineColor={theme.colors.borderColor.regular}
							labelValue={t('common.email')}
							placeholder={t('common.emailPlaceholder')}
							errorValue={errors?.email?.message ?? ''}
						/>
					)}
				/>
				<Controller
					control={control}
					name={'password'}
					rules={{ required: t('validation.passwordRequired') }}
					render={({ field: { onBlur, value } }) => (
						<BaseTextInput
							value={value}
							onChangeText={(text) => {
								setValue('password', text);
								setError('password', { message: '' });
							}}
							onBlur={onBlur}
							outlineColor={theme.colors.borderColor.regular}
							labelValue={t('common.password')}
							placeholder={t('common.passwordPlaceholder')}
							secureTextEntry={!showPassword}
							right={
								<TextInput.Icon
									icon={showPassword ? 'eye-off' : 'eye'}
									onPress={() => setShowPassword((prev) => !prev)}
								/>
							}
							errorValue={errors?.password?.message ?? ''}
						/>
					)}
				/>

				<AnimatedLoaderButton
					isLoading={isLoginLoading}
					title={t('common.login')}
					onPress={handleSubmit(firebaseLogin)}
				/>
				<AnimatedLoaderButton
					title={t('authentication.signUp')}
					onPress={() => props.navigation.navigate('SignUpScreen')}
				/>
				<AnimatedLoaderButton
					isLoading={isGoogleSignInLoading}
					title={t('authentication.loginWithGoogle')}
					onPress={signInWithGoogle}
					disabled={isGoogleSignInLoading}
				/>
			</KeyboardAvoidingView>
		</ScrollView>
	);
};

export default LoginScreen;

const style = StyleSheet.create({
	scrollContentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		height: '100%',
		width: '100%',
	},
});
