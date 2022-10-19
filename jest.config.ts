import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['test'],
    collectCoverage: true,
    detectOpenHandles: true,
    collectCoverageFrom: ['src/**/*.ts'],
    reporters: ['default', 'jest-junit'],
};
export default config;
