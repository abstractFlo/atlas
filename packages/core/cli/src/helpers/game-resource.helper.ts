import { cfgFromObject, renderTemplateFromString } from '@abstractflo/atlas-devtools';
import {
  atlasResourceJson,
  clientEntryFileTemplate,
  ejsClassTemplate,
  gameResource,
  moduleClass,
  serverEntryFileTemplate
} from './file-object-stubs';

/**
 * Gameresource installer file setup array
 *
 * @param {string} resourceName
 * @param {boolean} isStandalone
 * @return {Promise<({file: string, name: string} | {file: string, name: string} | {file: string, name: string} | {file: string, name: string, standalone: boolean} | {file: string, name: string} | {file: string, name: string} | {file: string, name: string} | {file: string, name: string, standalone: boolean} | {file: {isGameResource: boolean, name: string}, name: string} | {file: string, name: string, standalone: boolean})[]>}
 */
export const gameResourceInstallerFiles = async (resourceName: string, isStandalone: boolean) => ([
  { name: 'server/components/.gitkeep', file: 'empty' },
  { name: 'server/services/.gitkeep', file: 'empty' },
  {
    name: 'server/server.module.ts',
    file: await renderTemplateFromString(ejsClassTemplate, { className: 'ServerModule', ...moduleClass })
  },
  { name: 'server/index.ts', file: serverEntryFileTemplate(resourceName), standalone: true },
  { name: 'client/components/.gitkeep', file: 'empty' },
  { name: 'client/services/.gitkeep', file: 'empty' },
  {
    name: 'client/client.module.ts',
    file: await renderTemplateFromString(ejsClassTemplate, { className: 'ClientModule', ...moduleClass })
  },
  { name: 'client/index.ts', file: clientEntryFileTemplate(resourceName), standalone: true },
  { name: 'atlas-resource.json', file: atlasResourceJson(resourceName, isStandalone) },
  { name: 'assets/resource.cfg', file: cfgFromObject(gameResource), standalone: true }
]);
