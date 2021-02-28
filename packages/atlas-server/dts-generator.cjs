module.exports = {
  compilationOptions: {
    preferredConfigPath: './tsconfig.typings.json',
  },
  entries: [
    {
      filePath: './src/index.ts',
      outFile: './dist/index.d.ts',
    }
  ],
};
