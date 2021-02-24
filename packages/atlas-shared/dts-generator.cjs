module.exports = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.json',
  },
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts'
    },
    {
      filePath: './src/helpers.ts',
      outFile: './dist/helpers.d.ts'
    },
    {
      filePath: './src/build/resource-manager.ts',
      outFile: './dist/resource-manager.d.ts'
    }
  ]
};
