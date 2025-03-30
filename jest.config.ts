import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend'], 
}