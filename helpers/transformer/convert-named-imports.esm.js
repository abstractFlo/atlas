import j from 'jscodeshift';
import { pascalCase } from 'change-case';

/* eslint-disable */
/**
 * Analyse all files and transform all given modules to normal import
 * instead of named imports
 *
 * @param {string} code
 * @param {string[]} modules
 * @param {GameResourceModel} config
 * @return {any}
 */
function convert(code, modules = [], config) {
    const modulesForConvert = modules || [];
    const moduleMap = [];
    const root = j(code);
    // Map all imports to moduleMap
    root.find(j.ImportDeclaration).map((path) => {
        let moduleName = path.value.source.value;
        moduleMap[moduleName] = [];
        if (moduleName.startsWith('.') || !modulesForConvert.includes(moduleName) || !path.node.specifiers.length)
            return;
        path.node.specifiers.forEach((specifier) => {
            if (specifier.type !== 'ImportSpecifier')
                return;
            moduleMap[moduleName].push(specifier.local.name);
        });
        j(path).replaceWith(`import ${!config.useStarImport ? '' : '* as'} ${pascalCase(moduleName)} from '${moduleName}';`);
    });
    // Call Expression
    root.find(j.CallExpression)
        .filter((mPath) => mPath.value.callee !== null)
        .map((mPath) => {
        const calleeName = mPath.value.callee.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(calleeName))
                return;
            mPath.value.callee.name = `${pascalCase(key)}.${calleeName}`;
        });
    });
    // New Expression
    root.find(j.NewExpression)
        .filter((mPath) => mPath.value.callee !== null)
        .map((mPath) => {
        const calleeName = mPath.value.callee.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(calleeName))
                return;
            mPath.value.callee.name = `${pascalCase(key)}.${calleeName}`;
        });
    });
    // Member Expression
    root.find(j.MemberExpression)
        .filter((mPath) => mPath.value.object !== null)
        .map((mPath) => {
        const objectName = mPath.value.object.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(objectName))
                return;
            mPath.value.object.name = `${pascalCase(key)}.${objectName}`;
        });
    });
    // Class Expression
    root.find(j.ClassExpression)
        .filter((mPath) => mPath.value.superClass !== null)
        .map((mPath) => {
        const className = mPath.value.superClass.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(className))
                return;
            mPath.value.superClass.name = `${pascalCase(key)}.${className}`;
        });
    });
    // Class Declaration
    root.find(j.ClassDeclaration)
        .filter((mPath) => mPath.value.superClass !== null)
        .map((mPath) => {
        const className = mPath.value.superClass.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(className))
                return;
            mPath.value.superClass.name = `${pascalCase(key)}.${className}`;
        });
    });
    // Class Implementation
    root.find(j.ClassImplements)
        .filter((mPath) => mPath.value.superClass !== null)
        .map((mPath) => {
        const className = mPath.value.superClass.name;
        Object.keys(moduleMap).forEach((key) => {
            if (!moduleMap[key].includes(className))
                return;
            mPath.value.superClass.name = `${pascalCase(key)}.${className}`;
        });
    });
    // Variable Declarator
    root.find(j.VariableDeclarator)
        .filter((mPath) => mPath.value.init)
        .map((mPath) => {
        const exists = Object.keys(moduleMap).filter((key) => moduleMap[key].includes(mPath.value.init.name));
        if (exists) {
            mPath.value.init.name = `${exists}.${mPath.value.init.name}`;
        }
    });
    // Array Expression
    root.find(j.ArrayExpression)
        .filter((mPath) => mPath.value.elements.length)
        .map((mPath) => {
        mPath.value.elements.map((element) => {
            if (!element.arguments || !element.arguments.length) {
                const arrayName = element.name;
                Object.keys(moduleMap).forEach((key) => {
                    if (!moduleMap[key].includes(arrayName))
                        return;
                    element.name = `${pascalCase(key)}.${arrayName}`;
                });
            }
            else {
                element.arguments.map((arg) => {
                    const arrayName = arg.name;
                    Object.keys(moduleMap).forEach((key) => {
                        if (!moduleMap[key].includes(arrayName))
                            return;
                        arg.name = `${pascalCase(key)}.${arrayName}`;
                    });
                });
            }
        });
    });
    return root.toSource();
}
/**
 * Plugin for rollup
 */
function convertNamedImports (modules = [], config) {
    return {
        transform(fileInfo) {
            return convert(fileInfo, modules, config);
        }
    };
}
/**
 * Named Export
 *
 * @param {string[]} modules
 * @param {GameResourceConfigModel} config
 * @return {Plugin}
 */
function convertNamedImports$1(modules = [], config) {
    return {
        transform(fileInfo) {
            return convert(fileInfo, modules, config);
        }
    };
}

export default convertNamedImports;
export { convertNamedImports$1 as convertNamedImports };
