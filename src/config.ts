import dotenv from 'dotenv';

import type { EnvironmentConfig } from './types';

dotenv.config();

export const environmentConfig = process.env as unknown as EnvironmentConfig;
