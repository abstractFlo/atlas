import jscodeshift from 'jscodeshift';

/**
 * Convert snakeCase to CamelCase
 *
 * @param str
 * @returns {*}
 */
const snakeToCamel = (str) => {
  return str
      .split('/')
      .pop().replace(
          /([-_.][a-z])/g,
          (group) => group.toUpperCase()
              .replace('-', '')
              .replace('_', '')
              .replace('.', ''),
      );
};

/**
 * Analyse all files and transform all given modules to normal import
 * instead of named imports. You can work the way you like, only
 * the build process is changed for the files
 *
 * @param options
 * @returns {{transform(*=, *): *}|*}
 */
export function convertNamedImports(options = {}) {

  const modulesForConvert = options.modules || [];

  return {
    transform(code) {
      const j = jscodeshift;
      let root = j(code);

      const moduleMap = [];

      // Map all imports to moduleMap
      root.find(j.ImportDeclaration).map((path) => {
        const moduleName = path.value.source.value;
        moduleMap[moduleName] = [];

        if (!moduleName.startsWith('.') &&
            modulesForConvert.includes(moduleName) &&
            path.node.specifiers.length) {
          path.node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier') {
              moduleMap[moduleName].push(specifier.local.name);
            }
          });

          j(path)
              .replaceWith(
                  `import ${snakeToCamel(moduleName)} from '${moduleName}';`);
        }
      });

      // CallExpression
      root.find(j.CallExpression)
          .filter(mPath => mPath.value.callee !== null)
          .map((mPath) => {
            const calleeName = mPath.value.callee.name;
            Object.keys(moduleMap).forEach((key) => {
              if (moduleMap[key].includes(calleeName)) {
                mPath.value.callee.name = `${snakeToCamel(key)}.${calleeName}`;
              }
            });
          });

      // NewExpression
      root.find(j.NewExpression)
          .filter(mPath => mPath.value.callee !== null)
          .map((mPath) => {
            const calleeName = mPath.value.callee.name;
            Object.keys(moduleMap).forEach((key) => {
              if (moduleMap[key].includes(calleeName)) {
                mPath.value.callee.name = `${snakeToCamel(key)}.${calleeName}`;
              }
            });
          });

      // Member Expression
      root.find(j.MemberExpression)
          .filter(mPath => mPath.value.object !== null)
          .map((mPath) => {
            const objectName = mPath.value.object.name;
            Object.keys(moduleMap).forEach((key) => {
              if (moduleMap[key].includes(objectName)) {
                mPath.value.object.name = `${snakeToCamel(key)}.${objectName}`;
              }
            });
          });

      // ClassExpression
      root.find(j.ClassExpression)
          .filter(mPath => mPath.value.superClass !== null)
          .map((mPath) => {
            const className = mPath.value.superClass.name;
            Object.keys(moduleMap).forEach((key) => {
              if (moduleMap[key].includes(className)) {
                mPath.value.superClass.name = `${snakeToCamel(
                    key)}.${className}`;
              }
            });
          });

      // ArrayExpression
      root.find(j.ArrayExpression)
          .filter(mPath => mPath.value.elements.length)
          .map((mPath) => {
            mPath.value.elements.map((element) => {
              if (element.arguments && element.arguments.length) {
                element.arguments.map((arg) => {
                  const arrayName = arg.name;
                  Object.keys(moduleMap).forEach((key) => {
                    if (moduleMap[key].includes(arrayName)) {
                      arg.name = `${snakeToCamel(key)}.${arrayName}`;
                    }
                  });
                });
              } else {
                const arrayName = element.name;

                Object.keys(moduleMap).forEach((key) => {
                  if (moduleMap[key].includes(arrayName)) {
                    element.name = `${snakeToCamel(key)}.${arrayName}`;
                  }
                });
              }
            });
          });

      return root.toSource();
    },
  };

}
