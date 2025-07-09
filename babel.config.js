module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // já está correto
    plugins: [
      'react-native-reanimated/plugin', // mantenha esse
    ],
  };
};
