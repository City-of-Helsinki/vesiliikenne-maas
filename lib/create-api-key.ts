import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

const saltRounds = 10

const main = async () => {
  // No promises version is available of randomBytes, so I
  // opted to go for the synchronous version for readability.
  //
  // Produces a 64-character long random hex string
  const randomString = randomBytes(32).toString('hex')

  const hash = await bcrypt.hash(randomString, saltRounds)

  console.log(`API Key to send to the MaaS provider: ${randomString}`)
  console.log('Line to copy to .env file:')

  // If $ are not escaped, when loading the variable from the .env
  // file, next.js will intepret them as environment variable substitution
  // resulting in an incorrect hash being loaded
  const re = new RegExp('$')
  console.log(`MAAS_API_KEY_HASH="${hash.replace(/\$/g, '\\$')}"`)
}

if (require.main === module) {
  void main()
}
