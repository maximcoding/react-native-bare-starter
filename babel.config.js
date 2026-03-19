module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@assets': './assets',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
}
