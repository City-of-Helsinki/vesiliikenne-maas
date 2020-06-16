import {
  random64CharacterHexString,
  formatHashToEnvVariable,
} from './create-api-key'

describe('create-api-key', () => {
  it('escapes $ characters correctly', async () => {
    const input = '$2b$10$1kNzj33tdxCzCH6BpczXpuccDW6.0/l$RCH9XNMxPsUh3IB3iT2ke'
    const expected =
      '\\$2b\\$10\\$1kNzj33tdxCzCH6BpczXpuccDW6.0/l\\$RCH9XNMxPsUh3IB3iT2ke'

    expect(formatHashToEnvVariable(input)).toEqual(expected)
  })

  it('generates a hex string of length 64', async () => {
    expect(random64CharacterHexString().length).toBe(64)
  })
})
