import type { Config } from '@jest/types';

const Config: Config.InitialOptions = {
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend'], 
}