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
      filePath: './src/build/resource-manager.ts',
      outFile: './resource-manager.d.ts'
    }
  ]
};
