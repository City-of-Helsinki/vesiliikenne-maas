import { authenticateApiKey } from './middleware'
import bcrypt from 'bcrypt'

const generateHash = async (string: string) => await bcrypt.hash(string, 10)

describe('api key authentication', () => {
  it('returns false with wrong token', async () => {
    const mockRequest = {
      headers: {
        'x-api-key': 'wrongsecret',
      },
    }
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest, hash)
    expect(result).toBe(false)
  })

  it('returns true with right token', async () => {
    const mockRequest = {
      headers: {
        'x-api-key': 'secret',
      },
    }
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest, hash)
    expect(result).toBe(true)
  })

  it('returns false if header is empty object', async () => {
    const mockRequest = {
      headers: {},
    }
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest, hash)
    expect(result).toBe(false)
  })

  it('returns false if hash is empty string', async () => {
    const mockRequest = {
      headers: {
        'x-api-key': 'secret',
      },
    }
    const result = await authenticateApiKey(mockRequest, '')
    expect(result).toBe(false)
  })

  it('returns false if header x-api-key is empty string', async () => {
    const mockRequest = {
      headers: {
        'x-api-key': '',
      },
    }
    const hash = await generateHash('secret')
    const result = await authenticateApiKey(mockRequest, hash)
    expect(result).toBe(false)
  })
})
