import { bool, cleanEnv, str } from 'envalid';

export const env = cleanEnv(
  {
    NODE_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
    NEXT_PUBLIC_ENABLE_TESTNETS: process.env.NEXT_PUBLIC_ENABLE_TESTNETS,
    NEXT_PUBLIC_ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    NEXT_PUBLIC_INFURA_KEY: process.env.NEXT_PUBLIC_INFURA_KEY,
    NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID:
      process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID,

    NEXT_PUBLIC_APP_PASSWORD: process.env.NEXT_PUBLIC_APP_PASSWORD,
  },
  {
    NODE_ENV: str({
      default: 'development',
      choices: ['development', 'test', 'staging', 'preview', 'production'],
    }),
    NEXT_PUBLIC_ENABLE_TESTNETS: bool({ default: true }),
    NEXT_PUBLIC_ALCHEMY_KEY: str({
      default: 'bmT5y7LvGee8XYaMuSWw-z5zzKF3FIeA',
    }),
    NEXT_PUBLIC_INFURA_KEY: str({ default: '' }),
    NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID: str({
      default: '3fa385371e38bcf765fdceb706ad337c',
    }),
    NEXT_PUBLIC_APP_PASSWORD: str({ default: '' }),
  }
);
