module.exports = {
	presets: ['module:@react-native/babel-preset'],
	env: {
		production: {
			plugins: ['react-native-paper/babel'],
		},
	},
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				alias: {
					api: './src/api',
					assets: './src/assets',
					components: './src/components',
					context: './src/context',
					local_storage: './src/local_storage',
					navigation: './src/navigation',
					screens: './src/screens',
					hooks: './src/hooks',
					specs: './src/specs',
					store: './src/store',
					types: './src/types',
					utilities: './src/utilities',
					i18n: './src/i18n',
				},
			},
		],
		'react-native-worklets/plugin',
	],
};
