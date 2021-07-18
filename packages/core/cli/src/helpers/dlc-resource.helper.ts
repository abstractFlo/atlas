import { camelCase, cfgFromObject, pascalCase, sanitizedCfg, snakeCase } from '@abstractflo/atlas-devtools';
import { dlcResource, streamCfg } from './file-object-stubs';
import { interproxiesMeta, pedMeta, tattooMeta, tattooOverlayXml } from './dlc-xml-meta';

/**
 * Base data for dlc
 *
 * @param {string} name
 * @param {string} type
 * @param {boolean} assetsFolder
 * @return {({file: string, name: string} | {file: {name: string}, name: string})[]}
 */
export function baseData(name: string, type: string, assetsFolder: boolean = true) {
  const base = [
    { name: 'altas-resource.json', file: { name: camelCase(`${type} ${name}`) } },
    { name: 'resource.cfg', file: sanitizedCfg(cfgFromObject(dlcResource)) }
  ];

  if (assetsFolder) {
    base.push({ name: 'stream/assets/.gitkeep', file: 'empty' });
  }

  return base;
}

/**
 * Vehicel Tmp Files
 */
export function vehicleTmpFiles(name: string) {
  return [
    { name: 'stream/vehicles.meta', file: 'empty' },
    { name: 'stream/carvariations.meta', file: 'empty' },
    { name: 'stream/handling.meta', file: 'empty' },
    { name: 'stream/carcols.meta', file: 'empty' },
    { name: `stream/audio/sfx/dlc_${name}`, file: 'empty' },
    { name: `stream/audio/${name}_amp.dat10`, file: 'empty' },
    { name: `stream/audio/${name}_amp.dat10.nametable`, file: 'empty' },
    { name: `stream/audio/${name}_amp.dat10.rel`, file: 'empty' },
    { name: `stream/audio/${name}_game.dat151`, file: 'empty' },
    { name: `stream/audio/${name}_game.dat151.nametable`, file: 'empty' },
    { name: `stream/audio/${name}_game.dat151.rel`, file: 'empty' },
    { name: `stream/audio/${name}_sounds.dat54`, file: 'empty' },
    { name: `stream/audio/${name}_sounds.dat54.nametable`, file: 'empty' },
    { name: `stream/audio/${name}_sounds.dat54.rel`, file: 'empty' }
  ];
};

/**
 * Vehicle streamcfg meta
 */
export function vehicleStreamCfg(name: string) {
  return {
    ...streamCfg,
    meta: {
      'stream/vehicles.meta': 'VEHICLE_METADATA_FILE',
      'stream/carvariations.meta': 'VEHICLE_VARIATION_FILE',
      'stream/handling.meta': 'HANDLING_FILE',
      'stream/carcols.meta': 'CARCOLS_FILE',
      [`stream/audio/sfx/dlc_${name}`]: 'AUDIO_WAVEPACK',
      [`stream/audio/${name}_game.dat`]: 'AUDIO_GAMEDATA',
      [`stream/audio/${name}_sounds.dat`]: 'AUDIO_SOUNDDATA',
      [`stream/audio/${name}_amp.dat`]: 'AUDIO_SYNTHDATA'
    }
  };
}

/**
 * Weapon Tmp Files
 * @param {string} name
 */
export function weaponTmpFiles(name: string) {
  return [
    { name: `stream/assets/${name}.ydr`, file: 'empty' },
    { name: `stream/assets/${name}.ytd`, file: 'empty' },
    { name: `stream/weapon${name}.meta`, file: 'empty' },
    { name: `stream/weaponarchetypes.meta`, file: 'empty' },
    { name: `stream/weaponanimations.meta`, file: 'empty' }
  ];
}

/**
 * Weapon streamcfg
 * @param {string} name
 */
export function weaponStreamCfg(name: string) {
  return {
    ...streamCfg,
    meta: {
      [`stream/weapon${name}.meta`]: 'WEAPONINFO_FILE',
      'stream/weaponanimations.meta': 'WEAPON_ANIMATIONS_FILE',
      'stream/weaponarchetypes.meta': 'WEAPON_METADATA_FILE'
    }
  };
}

/**
 * MLO Tmp Files
 * @param {string} name
 */
export function mloTmpFiles(name: string) {
  return [
    { name: `stream/assets/basev/${name}.ydr`, file: 'empty' },
    { name: `stream/assets/basev/${name}.ybn`, file: 'empty' },
    { name: `stream/assets/basev/${name}.ydd`, file: 'empty' },
    { name: `stream/assets/collisions/${pascalCase(name)}.ydd`, file: 'empty' },
    { name: `stream/assets/models/${name}.ydr`, file: 'empty' },
    { name: `stream/assets/textures/${name}.ytd`, file: 'empty' },
    { name: `stream/_manifest.ymf`, file: 'empty' },
    { name: `stream/${name}.ytyp`, file: 'empty' },
    { name: `stream/${name}.ymap`, file: 'empty' },
    { name: `stream/${name}_milo_.ymap`, file: 'empty' }
  ];
}

/**
 * InteriorProxies Tmp Files
 * @param {string} name
 */
export function interiorProxiesTmpFiles(name: string) {
  return [{ name: `stream/interiorproxies.meta`, file: interproxiesMeta(name) }];
}

/**
 * InteriorProxies streamcfg
 */
export function interiorProxiesStreamCfg() {
  return {
    ...streamCfg,
    meta: {
      'stream/interiorproxies.meta': 'INTERIOR_PROXY_ORDER_FILE'
    }
  };
}

/**
 * clothes streamcfg
 * @param {string} name
 */
export function clothesStreamCfg(name: string) {
  return {
    ...streamCfg,
    files: [
      'stream/ped_male.rpf/*',
      'stream/ped_female.rpf/*'
    ],
    meta: {
      [`stream/mp_m_freemode_01_mp_m_${name}.meta`]: 'SHOP_PED_APPAREL_META_FILE',
      [`stream/mp_f_freemode_01_mp_f_${name}.meta`]: 'SHOP_PED_APPAREL_META_FILE'
    }
  };
}

/**
 * Clothes Tmp Files
 * @param {string} name
 */
export function clothesTmpFiles(name: string) {
  return [
    { name: `stream/ped_male.rpf/mp_m_freemode_01_mp_m_${name}/example.ydd`, file: 'empty' },
    { name: `stream/ped_male.rpf/mp_m_freemode_01_mp_m_${name}/example.ytd`, file: 'empty' },
    { name: `stream/ped_female.rpf/mp_f_freemode_01_mp_f_${name}/example.ydd`, file: 'empty' },
    { name: `stream/ped_female.rpf/mp_f_freemode_01_mp_f_${name}/example.ytd`, file: 'empty' },
    { name: `stream/mp_m_freemode_01_mp_m_${name}.meta`, file: 'empty' },
    { name: `stream/mp_f_freemode_01_mp_f_${name}.meta`, file: 'empty' }
  ];
}


/**
 * Sounds streamcfg
 */
export function soundStreamCfg() {
  return {
    ...streamCfg,
    files: [],
    meta: {
      'stream/x64/audio/sfx/resident': 'AUDIO_WAVEPACK',
      'stream/x64/audio/sfx/weapons_player': 'AUDIO_WAVEPACK',
      'stream/x64/audio/sfx/animals': 'AUDIO_WAVEPACK'
    }
  };
}

/**
 * Sounds Tmp Files
 */
export function soundTmpFiles() {
  return [
    { name: `stream/x64/audio/sfx/resident/example_sirens.awc`, file: 'empty' },
    { name: `stream/x64/audio/sfx/animals/example_animal.awc`, file: 'empty' },
    { name: `stream/x64/audio/sfx/weapons_player/example_smg_sound.awc`, file: 'empty' }
  ];
}

/**
 * Ped streamcfg
 */
export function pedStreamCfg() {
  return {
    ...streamCfg,
    files: [],
    meta: {
      'stream/x64/audio/sfx/resident': 'AUDIO_WAVEPACK',
      'stream/x64/audio/sfx/weapons_player': 'AUDIO_WAVEPACK',
      'stream/x64/audio/sfx/animals': 'AUDIO_WAVEPACK'
    }
  };
}

/**
 * Ped Tmp Files
 */
export function pedTmpFiles(name: string) {
  return [
    { name: `stream/models/${name}.ydd`, file: 'empty' },
    { name: `stream/models/${name}.ytd`, file: 'empty' },
    { name: `stream/models/${name}.ymt`, file: 'empty' },
    { name: `stream/models/${name}.yft`, file: 'empty' },
    { name: `stream/female_${name}.meta`, file: pedMeta('female', name) },
    { name: `stream/male_${name}.meta`, file: pedMeta('male', name) }
  ];
}

/**
 * Tattoo streamcfg
 */
export function tattooStreamCfg(name: string) {
  return {
    ...streamCfg,
    meta: {
      [`stream/${snakeCase(name)}_overlays.xml`]: 'PED_OVERLAY_FILE',
      'stream/shop_tattoo.meta': 'TATTOO_SHOP_DLC_FILE'
    }
  };
}

/**
 * Tattoo Tmp Files
 */
export function tattooTmpFiles(name: string) {
  return [
    { name: `stream/assets/${pascalCase(name)}_000.ytd`, file: 'empty' },
    { name: `stream/${snakeCase(name)}.xml`, file: tattooOverlayXml(name) },
    { name: `stream/shop_tattoo.meta`, file: tattooMeta(name) }
  ];
}

/**
 * Return setup for dlc file generation
 * @param {{name: string, file?: string}[]} tmpFiles
 * @param {object} streamConfig
 * @param baseData
 * @return {({name: string, file?: string} | {file: string, name: string})[]}
 */
export function generateDirAndFileSetup(
    tmpFiles: { name: string, file?: string }[],
    streamConfig: object,
    baseData: { name: string, file?: string | object }[]
) {
  const cfgTmp = cfgFromObject(streamConfig);
  const streamFileContent = sanitizedCfg(cfgTmp)
      .replace(/'/g, '');

  return [
    ...baseData,
    ...tmpFiles,
    {
      name: 'stream.cfg',
      file: streamFileContent
    }
  ];
}
