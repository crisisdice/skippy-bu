import { authorization } from './auth'

async function main() {
  const secureClient = await authorization()
  console.log('authorized!')
}

main()
