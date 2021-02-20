const outDir = process.env.OUTPUT_LOCAL
    ? ['../../../gamemode/local_modules/@abstractflo', '../../../gui/local_modules/@abstractflo']
    : ['dist'];

export default outDir;
