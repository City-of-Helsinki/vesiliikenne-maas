module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': '<rootDir>/node_modules/babel-jest',
  },
  testRegex: '^.+\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'json', 'node'],
}
