
module.exports =  {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['test'],
    collectCoverageFrom: ["src/**/*.ts"],
    reporters: ['default'],
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                "tsconfig": {
                    "allowJs": true
                },
                useESM: true,
            },
        ],
    },
    "transformIgnorePatterns": [
        "<rootDir>/node_modules/(?!scats)"
    ],
};
