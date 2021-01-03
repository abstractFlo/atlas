const outDir = process.env.OUTPUT_LOCAL
    ? ['../../../gamemode/local_modules/@abstractFlo', '../../../gui/local_modules/@abstractFlo']
    : ['../../dist'];

export default outDir;
