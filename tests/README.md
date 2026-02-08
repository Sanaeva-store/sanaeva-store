# Unit Test Structure

This project uses Vitest for unit tests.

## Folders

- `tests/setup/`: global test setup files.
- `tests/unit/lib/`: unit tests for utility and pure logic modules.
- `tests/unit/components/`: unit tests for UI components.
- `tests/vitest.d.ts`: global test type references.

## Naming

- Use `*.test.ts` for logic tests.
- Use `*.test.tsx` for React component tests.

## Commands

- `npm run test`: run all unit tests once.
- `npm run test:watch`: run tests in watch mode.
- `npm run test:coverage`: run tests with coverage output.
