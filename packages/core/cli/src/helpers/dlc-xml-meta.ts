import { pascalCase, snakeCase } from '@abstractflo/atlas-devtools';

/**
 * Meta Data for ped model example
 * @type {string}
 */
export const pedMeta = (type: string, modelName: string) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<CPedModelInfo__InitDataList>',
  '\t<InitDatas>',
  '\t\t<Item>',
  `\t\t\t<Name>${modelName}</Name>`,
  '\t\t\t<ClipDictionaryName>move_m@generic</ClipDictionaryName>',
  `\t\t\t<ExpressionSetName>expr_set_ambient_${type}</ExpressionSetName>`,
  `\t\t\t<Pedtype>CIV${type.toUpperCase()}</Pedtype>`,
  '\t\t\t<MovementClipSet>move_m@business@c</MovementClipSet>',
  '\t\t\t<StrafeClipSet>move_ped_strafing</StrafeClipSet>',
  '\t\t\t<MovementToStrafeClipSet>move_ped_to_strafe</MovementToStrafeClipSet>',
  '\t\t\t<InjuredStrafeClipSet>move_strafe_injured</InjuredStrafeClipSet>',
  '\t\t\t<FullBodyDamageClipSet>dam_ko</FullBodyDamageClipSet>',
  '\t\t\t<AdditiveDamageClipSet>dam_ad</AdditiveDamageClipSet>',
  '\t\t\t<DefaultGestureClipSet>ANIM_GROUP_GESTURE_M_GENERIC</DefaultGestureClipSet>',
  `\t\t\t<FacialClipsetGroupName>facial_clipset_group_gen_${type}</FacialClipsetGroupName>`,
  '\t\t\t<DefaultVisemeClipSet>ANIM_GROUP_VISEMES_M_LO</DefaultVisemeClipSet>',
  '\t\t\t<PoseMatcherName>Male</PoseMatcherName>',
  '\t\t\t<PoseMatcherProneName>Male_prone</PoseMatcherProneName>',
  '\t\t\t<GetupSetHash>NMBS_SLOW_GETUPS</GetupSetHash>',
  '\t\t\t<CreatureMetadataName>ambientPed_upperWrinkles</CreatureMetadataName>',
  '\t\t\t<DecisionMakerName>DEFAULT</DecisionMakerName>',
  '\t\t\t<MotionTaskDataSetName>STANDARD_PED</MotionTaskDataSetName>',
  '\t\t\t<DefaultTaskDataSetName>STANDARD_PED</DefaultTaskDataSetName>',
  `\t\t\t<PedCapsuleName>STANDARD_${type.toUpperCase()}</PedCapsuleName>`,
  '\t\t\t<RelationshipGroup>CIVMALE</RelationshipGroup>',
  '\t\t\t<NavCapabilitiesName>STANDARD_PED</NavCapabilitiesName>',
  '\t\t\t<PerceptionInfo>DEFAULT_PERCEPTION</PerceptionInfo>',
  '\t\t\t<DefaultBrawlingStyle>BS_AI</DefaultBrawlingStyle>',
  '\t\t\t<DefaultUnarmedWeapon>WEAPON_UNARMED</DefaultUnarmedWeapon>',
  '\t\t\t<Personality>SERVICEMALES</Personality>',
  '\t\t\t<CombatInfo>DEFAULT</CombatInfo>',
  '\t\t\t<VfxInfoName>VFXPEDINFO_HUMAN_GENERIC</VfxInfoName>',
  '\t\t\t<AmbientClipsForFlee>FLEE</AmbientClipsForFlee>',
  '\t\t\t<AbilityType>SAT_NONE</AbilityType>',
  '\t\t\t<ThermalBehaviour>TB_WARM</ThermalBehaviour>',
  '\t\t\t<SuperlodType>SLOD_HUMAN</SuperlodType>',
  '\t\t\t<ScenarioPopStreamingSlot>SCENARIO_POP_STREAMING_NORMAL</ScenarioPopStreamingSlot>',
  '\t\t\t<DefaultSpawningPreference>DSP_NORMAL</DefaultSpawningPreference>',
  '\t\t\t<IsStreamedGfx value="false" />',
  '\t\t</Item>',
  '\t</InitDatas>',
  '</CPedModelInfo__InitDataList>'
].join('\n');

/**
 * InterproxieMeta File
 *
 * @param {string} name
 * @return {string}
 */
export const interproxiesMeta = (name: string) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<SInteriorOrderData>',
  '\t<startFrom value="2000"/>',
  '\t<proxies>',
  `\t\t<Item>vespucci_${name}_milo_</Item>`,
  '\t</proxies>',
  '</SInteriorOrderData>'
].join('\n');

/**
 * Custom Tattoo Meta
 *
 * @param {string} name
 * @return {string}
 */
export const tattooMeta = (name: string) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<TattooShopItemArray>',
  '\t<TattooShopItems>',
  '\t\t<Item>',
  '\t\t\t<id value="0"/>',
  '\t\t\t<cost value="0"/>',
  `\t\t\t<textLabel>${pascalCase(name)}_000</textLabel>`,
  `\t\t\t<collection>${snakeCase(name)}_overlays</collection>`,
  `\t\t\t<preset>${pascalCase(name)}_000_M</preset>`,
  '\t\t\t<zone>ZONE_RIGHT_ARM</zone>',
  '\t\t\t<updateGroup>ARM_RIGHT_UPPER_SLEEVE</updateGroup>',
  '\t\t\t<eFaction>TATTOO_MP_FM</eFaction>',
  '\t\t\t<eFacing>TATTOO_RIGHT</eFacing>',
  '\t\t\t<lockHash />',
  '\t\t</Item>',
  '\t\t<Item>',
  '\t\t\t<id value="0"/>',
  '\t\t\t<cost value="0"/>',
  `\t\t\t<textLabel>${pascalCase(name)}_000</textLabel>`,
  `\t\t\t<collection>${snakeCase(name)}_overlays</collection>`,
  `\t\t\t<preset>${pascalCase(name)}_000_F</preset>`,
  '\t\t\t<zone>ZONE_RIGHT_ARM</zone>',
  '\t\t\t<updateGroup>ARM_RIGHT_UPPER_SLEEVE</updateGroup>',
  '\t\t\t<eFaction>TATTOO_MP_FM_F</eFaction>',
  '\t\t\t<eFacing>TATTOO_RIGHT</eFacing>',
  '\t\t\t<lockHash />',
  '\t\t</Item>',
  '\t</TattooShopItems>',
  '</TattooShopItemArray>'
].join('\n');

/**
 * Custom Tattoo Overlay XML
 *
 * @param {string} name
 * @return {string}
 */
export const tattooOverlayXml = (name: string) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<PedDecorationCollection>',
  '\t<bRequiredForSync value="true" />',
  '\t<presets>',
  '\t\t<Item>',
  '\t\t\<uvPos x="0.580000" y="0.900000" />',
  '\t\t\<scale x="0.040000" y="0.040000" />',
  '\t\t\<rotation value="0.000000" />',
  `\t\t\<nameHash>${pascalCase(name)}_000_M</nameHash>`,
  `\t\t\<txdHash>${pascalCase(name)}_000</txdHash>`,
  `\t\t\<txtHash>${pascalCase(name)}_000</txtHash>`,
  '\t\t\<zone>ZONE_RIGHT_ARM</zone>',
  '\t\t\<type>TYPE_TATTOO</type>',
  '\t\t\<faction>FM</faction>',
  '\t\t\<garment>All</garment>',
  '\t\t\<gender>GENDER_MALE</gender>',
  '\t\t\<award />',
  '\t\t\<awardLevel />',
  '\t\t</Item>',
  '\t\t<Item>',
  '\t\t\t<uvPos x="0.480000" y="0.900000" />',
  '\t\t\t<scale x="0.040000" y="0.040000" />',
  '\t\t\t<rotation value="0.000000" />',
  `\t\t\t<nameHash>${pascalCase(name)}_000_F</nameHash>`,
  `\t\t\t<txdHash>${pascalCase(name)}_000</txdHash>`,
  `\t\t\t<txtHash>${pascalCase(name)}_000</txtHash>`,
  '\t\t\t<zone>ZONE_RIGHT_ARM</zone>',
  '\t\t\t<type>TYPE_TATTOO</type>',
  '\t\t\t<faction>FM</faction>',
  '\t\t\t<garment>All</garment>',
  '\t\t\t<gender>GENDER_FEMALE</gender>',
  '\t\t\t<award />',
  '\t\t\t<awardLevel />',
  '\t\t</Item>',
  '\t</presets>',
  `\t<nameHash>${snakeCase(name)}_overlays</nameHash>`,
  '\t<medalLocations content="vector2_array">',
  '\t\t0.140000 0.070000',
  '\t\t0.370000 0.070000',
  '\t\t0.600000 0.070000',
  '\t\t0.835000 0.070000',
  '\t\t0.140000 0.150000',
  '\t\t0.370000 0.150000',
  '\t\t0.600000 0.150000',
  '\t\t0.835000 0.150000',
  '\t\t0.140000 0.230000',
  '\t\t0.370000 0.230000',
  '\t\t0.600000 0.230000',
  '\t\t0.835000 0.230000',
  '\t\t0.100000 0.700000',
  '\t\t0.300000 0.700000',
  '\t\t0.500000 0.700000',
  '\t\t0.700000 0.700000',
  '\t</medalLocations>',
  '\t<medalScale x="0.240000" y="0.100000" />',
  '</PedDecorationCollection>'
].join('\n');
