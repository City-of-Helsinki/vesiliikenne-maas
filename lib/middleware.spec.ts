import { authenticateApiKey } from './middleware'
import bcrypt from 'bcryptjs'

const generateHash = async (string: string) => await bcrypt.hash(string, 10)

const mockRequest = (apikeyContent: string) => ({
  headers: {
    'x-api-key': apikeyContent,
  },
})

describe('api key authentication', () => {
  it('returns false with wrong token', async () => {
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest('wrongsecret'), hash)
    expect(result).toBe(false)
  })

  it('returns true with right token', async () => {
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest('secret'), hash)
    expect(result).toBe(true)
  })

  it('returns false if headers is empty object', async () => {
    const mockRequest = {
      headers: {},
    }
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest, hash)
    expect(result).toBe(false)
  })

  it('returns false if hash is empty string', async () => {
    const result = await authenticateApiKey(mockRequest('secret'), '')
    expect(result).toBe(false)
  })

  it('returns false if header x-api-key is empty string', async () => {
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest(''), hash)
    expect(result).toBe(false)
  })
})
