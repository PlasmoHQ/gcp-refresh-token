#!/usr/bin/env node
import { writeFile } from "fs/promises"
import getPort from "get-port"

import { getRefreshToken } from "~get-refresh-token"
import { defaultKey, getKey, validateKey } from "~key"

async function main() {
  try {
    const { key, keyFilePath } = await getKey(true)

    validateKey(key)

    const port = await getPort({ port: 1701 }) // 🖖

    // MAYBE: Add a param flag to specify host if needed (for internal vpc)
    const baseHost = `localhost`

    const redirectUri = `http://${baseHost}:${port}`

    const refreshToken = await getRefreshToken({
      port,
      clientId: key.installed.client_id,
      clientSecret: key.installed.client_secret,
      redirectUri,
      scope: key.scope || defaultKey.scope
    })

    console.log("Refresh token retrieved, writing into key.json file...")

    await writeFile(
      keyFilePath,
      JSON.stringify(
        {
          ...key,
          chrome: {
            clientId: key.installed.client_id,
            clientSecret: key.installed.client_secret,
            refreshToken
          }
        },
        null,
        2
      )
    )

    console.log(`🚀 `, "Success")

    process.exit(0)
  } catch (error) {
    console.error(`🛑`, error)
    process.exit(1)
  }
}

main()
