import swc from "rollup-plugin-swc";
import pkg from './package.json';
import pkgRoot from '../../package.json';
import builtinModules from "builtin-modules";

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs'
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm'
            }
        ],
        plugins: [
            swc({
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        dynamicImport: true,
                        decorators: true,
                    },
                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true,
                    },
                    loose: true,
                    target: 'es2020',
                    keepClassNames: true,
                },
                minify: true,
            })
        ],
        external: [
            ...builtinModules,
            ...Object.keys(pkg.devDependencies || {}),
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {}),
            ...Object.keys(pkgRoot.devDependencies || {}),
            ...Object.keys(pkgRoot.dependencies || {}),
            ...Object.keys(pkgRoot.peerDependencies || {}),
        ]
    },
]
