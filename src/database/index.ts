import { createConnection, getConnectionOptions } from 'typeorm'

const connection = async () => {
  const defaultOptions = await getConnectionOptions()

  const database =
    process.env.NODE_ENV === 'test'
      ? './src/database/database.test.sqlite'
      : defaultOptions.database

  return createConnection(Object.assign(defaultOptions, { database }))
}

export default connection
