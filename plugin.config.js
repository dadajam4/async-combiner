const path = require('path');

module.exports = {
  entry: 'src/index.ts',
  babel: true,
  typescript: {
    tsconfigOverride: {
      include: [path.join(__dirname, 'src/**/*')],
      exclude: [path.join(__dirname, 'types')],
    },
  },
  // vue: true,
  // sass: true,
  // postcss: true,
  // autoprefixer: true,
  // external: ['vue'],
  // globals: {
  //   vue: 'Vue',
  // },
};
