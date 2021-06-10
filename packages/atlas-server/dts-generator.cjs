module.exports = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.typings.json',
    followSymlinks: false
  },
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts',
      output: {
        inlineDeclareGlobals: false,
        sortNodes: true,
        inlineDeclareExternals: true
      }
    },
    {
      filePath: './src/helpers.ts',
      outFile: './helpers.d.ts'
    }
  ]
};
