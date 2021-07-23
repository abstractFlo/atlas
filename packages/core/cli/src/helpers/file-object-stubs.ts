/**
 * Config for docker-compose yml
 */
export const dockerCompose = {
  version: '3.3',
  services: {
    altv: {
      build: {
        context: '.docker',
        args: ['BRANCH=${SERVER_BRANCH:-release}']
      },
      image: 'altv:latest',
      env_file: ['.env'],
      container_name: 'altv',
      working_dir: '/altv',
      volumes: [
        '${ATLAS_PROJECT_PATH}env:/altv/.env',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/package.json:/altv/package.json',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/resources:/altv/resources',
        '${ATLAS_PROJECT_PATH}/docker-data/server.log:/altv/server.log',
        '${ATLAS_PROJECT_PATH}/node_modules:/altv/node_modules',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/server.cfg:/altv/server.cfg',
        '/etc/localtime:/etc/localtime:ro'
      ],
      ports: ['7788:7788', '7788:7788/udp'],
      tty: true
    }
  }
};

/**
 * Stub for game resource
 */
export const gameResource = {
  type: 'js',
  main: 'server.js',
  'client-main': 'client.js',
  'client-files': [],
  deps: []
};

/**
 * Stub for stream resource
 */
export const dlcResource = {
  type: 'dlc',
  main: 'stream.cfg',
  'client-files': ['stream/*']
};

/**
 * Stub for stream resource
 */
export const streamCfg = {
  files: ['stream/assets/*'],
  meta: [],
  gxt: []
};

/**
 * Stub for stream resource
 */
export const assetPackResource = {
  type: 'asset-pack',
  'client-files': ['assets/*']
};

/**
 * TSConfig
 */
export const tsConfig = {
  'compilerOptions': {
    'target': 'esnext',
    'module': 'esnext',
    'moduleResolution': 'node',
    'lib': [
      'es6',
      'esnext'
    ],
    'typeRoots': [
      './node_modules/@types',
      './node_modules/@altv',
      './node_modules/@abstractflo'
    ],
    'esModuleInterop': true,
    'resolveJsonModule': true,
    'allowJs': true,
    'importHelpers': false,
    'sourceMap': false,
    'experimentalDecorators': true,
    'emitDecoratorMetadata': true,
    'allowSyntheticDefaultImports': true,
    'baseUrl': '.'
  }
};

/**
 * TS Eslint Config
 */
export const tsEslint = {
  'extends': './tsconfig.json',
  'include': ['resources/**/*.ts']
};

/**
 * package.json Example
 */
export const pkgJson = {
  'name': '',
  'private': true,
  'version': '1.0.0',
  'description': '',
  'type': 'module',
  'scripts': {
    'build': 'atlas build',
    'watch': 'atlas build --watch'
  },
  'keywords': [],
  'author': '',
  'license': 'MIT',
  'devDependencies': {
    '@abstractflo/atlas-cli': '^1.1.0',
    '@altv/types-client': '^1.7.6',
    '@altv/types-natives': '^1.4.2',
    '@altv/types-server': '^1.9.6'
  },
  'dependencies': {
    '@abstractflo/atlas-client': '^3.1.0',
    '@abstractflo/atlas-server': '^3.1.0',
    '@abstractflo/atlas-shared': '^3.1.0'
  }
};

/**
 * Base Environment File
 */
export const baseEnv = {
  atlasProduction: false,
  atlasBuildOutput: 'dist',
  atlasClearBeforeBuild: true,
  atlasClearPreserver: null,
  atlasProjectPath: '.',
  atlasRetailFolder: 'retail'
};

/**
 * atlas.json stub
 *
 * @type {{}}
 */
export const atlasJson = {};

/**
 * atlas-resurce.json stub
 *
 * @param {string} name
 * @param {boolean} standalone
 * @return {{isGameResource: boolean, name: string}}
 */
export const atlasResourceJson = (name: string, standalone: boolean) => ({
  name,
  isGameResource: standalone
});

/**
 * Template for base server.cfg
 *
 * @type {{}}
 */
export const serverCfgBase = {
  name: 'New alt:V Server powered by Atlas',
  host: '0.0.0.0',
  port: 7788,
  players: 10,
  '#password': '',
  announce: false,
  '#token': 'noToken',
  gamemode: 'unknown',
  website: 'https://atlas.abstractmedia.de',
  language: 'English',
  description: 'A new awesome gamemode written in TypeScript powered by Atlas',
  debug: true,
  '#streamingDistance': '',
  '#migrationDistance': 150,
  '#timeout': 1,
  modules: ['js-module'],
  resources: ['gamemode'],
  '#voice': {
    '#bitrate': 64000,
    '#externalSecret': '',
    '#externalHost': 'localhost',
    '#externalPort': 7798,
    '#externalPublicHost': '',
    '#externalPublicPort': 7799
  },
  tags: [
    'atlas',
    'typescript',
    'oop'
  ],
  '#useEarlyAuth': false,
  '#earlyAuthUrl': 'https://your.url.de',
  '#useCdn': false,
  '#cdnUrl': 'https://your.url.de'
};

/**
 * ModuleClass Stub
 * @type {string[]}
 */
export const moduleClass = {
  fileImports: 'import { Module } from \'@abstractflo/atlas-shared\'',
  decorator: '@Module({})'
};

/**
 * ComponenteClass Stub
 * @type {string[]}
 */
export const componentClass = {
  fileImports: 'import { Component } from \'@abstractflo/atlas-shared\'',
  decorator: '@Component'
};


/**
 * ServiceClass Stub
 * @type {string[]}
 */
export const serviceClass = {
  fileImports: 'import { Singleton } from \'@abstractflo/atlas-shared\'',
  decorator: '@Singleton'
};

/**
 * Class Template
 *
 * @type {string[]}
 */
export const ejsClassTemplate = [
  '<%- fileImports; %>\n' +
  '\n' +
  '<%- decorator; %>\n' +
  'export class <%- className; %> {}\n'
].join('');

/**
 * Server Entry File
 *
 * @param {string} name
 * @return {string[]}
 */
export const serverEntryFileTemplate = (name: string) => ([
  'import \'@abstractflo/atlas-server\';',
  'import { app, LoaderService, UtilsService } from \'@abstractflo/atlas-shared\';',
  'import { ServerModule } from \'./server.module\';\n',
  'const loaderService = app.resolve(LoaderService);\n',
  'loaderService',
  '\t.bootstrap(ServerModule)',
  '\t.done(() => {',
  `\t\tUtilsService.log(\`~g~${name} loaded~w~\`);`,
  '\t});'
].join('\n'));

/**
 * Client Entry File
 *
 * @param {string} name
 * @return {string[]}
 */
export const clientEntryFileTemplate = (name: string) => ([
  'import { EventService } from \'@abstractflo/atlas-client\';',
  'import { app, LoaderService, UtilsService } from \'@abstractflo/atlas-shared\';',
  'import { ClientModule } from \'./client.module\';\n',
  'const loaderService = app.resolve(LoaderService);\n',
  'loaderService',
  '\t.waitFor(\'connectionComplete\')',
  '\t.bootstrap(ClientModule)',
  '\t.done(() => {',
  `\t\tconst eventService = app.resolve(EventService);`,
  `\t\teventService.emitServer('playerConnected')`,
  `\t\tUtilsService.log(\`~g~${name} loaded~w~\`);`,
  '\t});'
].join('\n'));
