//@ts-nocheck
import j from 'jscodeshift';
import { Plugin } from 'rollup';
import { GameResourceInterface } from '../interfaces/game-resource.interface';

/**
 * Convert to PascalCase
 *
 * @param string
 * @return {string}
 */
function convertToReadableName(string) {
  return `${string.replace('/', '-')}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w+)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s) => s.toLowerCase());
}

/**
 * Analyse all files and transform all given modules to normal import
 * instead of named imports
 *
 * @param code
 * @param modules
 * @param config
 * @returns {{transform(*=, *): *}|*}
 */
function convert(code: string, modules: string[] = [], config: GameResourceInterface) {
  const modulesForConvert = modules || [];
  const moduleMap = [];
  const root = j(code);

  // Map all imports to moduleMap
  root.find(j.ImportDeclaration).map((path) => {
    const moduleName = path.value.source.value;
    moduleMap[moduleName] = [];

    if (moduleName.startsWith('.') || !modulesForConvert.includes(moduleName) || !path.node.specifiers.length) return;

    path.node.specifiers.forEach((specifier) => {
      if (specifier.type !== 'ImportSpecifier') return;

      moduleMap[moduleName].push(specifier.local.name);
    });

    j(path).replaceWith(`import ${!config.useStarImport ? '' : '* as'} ${convertToReadableName(moduleName)} from '${moduleName}';`);
  });

  // Call Expression
  root
    .find(j.CallExpression)
    .filter((mPath) => mPath.value.callee !== null)
    .map((mPath) => {
      const calleeName = mPath.value.callee.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(calleeName)) return;

        mPath.value.callee.name = `${convertToReadableName(key)}.${calleeName}`;
      });
    });

  // New Expression
  root
    .find(j.NewExpression)
    .filter((mPath) => mPath.value.callee !== null)
    .map((mPath) => {
      const calleeName = mPath.value.callee.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(calleeName)) return;

        mPath.value.callee.name = `${convertToReadableName(key)}.${calleeName}`;
      });
    });

  // Member Expression
  root
    .find(j.MemberExpression)
    .filter((mPath) => mPath.value.object !== null)
    .map((mPath) => {
      const objectName = mPath.value.object.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(objectName)) return;
        mPath.value.object.name = `${convertToReadableName(key)}.${objectName}`;
      });
    });

  // Class Expression
  root
    .find(j.ClassExpression)
    .filter((mPath) => mPath.value.superClass !== null)
    .map((mPath) => {
      const className = mPath.value.superClass.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(className)) return;
        mPath.value.superClass.name = `${convertToReadableName(key)}.${className}`;
      });
    });

  // Class Declaration
  root
    .find(j.ClassDeclaration)
    .filter((mPath) => mPath.value.superClass !== null)
    .map((mPath) => {
      const className = mPath.value.superClass.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(className)) return;
        mPath.value.superClass.name = `${convertToReadableName(key)}.${className}`;
      });
    });

  // Class Implementation
  root
    .find(j.ClassImplements)
    .filter((mPath) => mPath.value.superClass !== null)
    .map((mPath) => {
      const className = mPath.value.superClass.name;
      Object.keys(moduleMap).forEach((key) => {
        if (!moduleMap[key].includes(className)) return;
        mPath.value.superClass.name = `${convertToReadableName(key)}.${className}`;
      });
    });

  // Array Expression
  root
    .find(j.ArrayExpression)
    .filter((mPath) => mPath.value.elements.length)
    .map((mPath) => {
      mPath.value.elements.map((element) => {
        if (!element.arguments || !element.arguments.length) {
          const arrayName = element.name;
          Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(arrayName)) return;
            element.name = `${convertToReadableName(key)}.${arrayName}`;
          });
        } else {
          element.arguments.map((arg) => {
            const arrayName = arg.name;
            Object.keys(moduleMap).forEach((key) => {
              if (!moduleMap[key].includes(arrayName)) return;
              arg.name = `${convertToReadableName(key)}.${arrayName}`;
            });
          });
        }
      });
    });

  return root.toSource();
}

/**
 * Plugin for rollup
 *
 * @return {{transform: (function(*, *, *=): *)}}
 */
export default function (modules: string[] = [], config: GameResourceInterface): Plugin {
  return {
    transform(fileInfo) {
      return convert(fileInfo, modules, config);
    },
  };
}
