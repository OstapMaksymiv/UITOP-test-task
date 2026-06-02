import type { Config } from "jest";
import nextJest from "next/jest";

// Point next/jest at the app to load next.config + .env files during tests.
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Mirror the "@/*" path alias from tsconfig.json.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

export default createJestConfig(config);
