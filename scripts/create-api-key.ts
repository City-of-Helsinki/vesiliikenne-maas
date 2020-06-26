import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const saltRounds = 10

export const random64CharacterHexString = () => {
  return randomBytes(32).toString('hex')
}

export const formatHashToEnvVariable = (hash: string) => {
  return hash.replace(/\$/g, '\\$')
}

const main = async () => {
  const randomString = random64CharacterHexString()

  const hash = await bcrypt.hash(randomString, saltRounds)

  console.log(`API Key to send to the MaaS provider: ${randomString}`)
  console.log('Line to copy to .env file:')
  console.log(`MAAS_API_KEY_HASH="${formatHashToEnvVariable(hash)}"`)
}

if (require.main === module) {
  void main()
}
