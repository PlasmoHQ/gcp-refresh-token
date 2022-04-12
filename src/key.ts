import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import { resolve } from "path"
import { cwd } from "process"

export const defaultKey = {
  installed: {
    client_id: "",
    client_secret: "",
    project_id: "",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    redirect_uris: ["http://localhost"]
  },
  scope: ["https://www.googleapis.com/auth/chromewebstore"],
  chrome: {
    clientId: "",
    refreshToken: ""
  }
}

export type Key = typeof defaultKey

const keyFileName = "key.json"

export const getKeyFilePath = () => resolve(cwd(), keyFileName)

export const getKey = async (createDefaultKey = false) => {
  const keyFilePath = getKeyFilePath()

  if (!existsSync(keyFilePath)) {
    if (createDefaultKey) {
      await writeFile(keyFilePath, JSON.stringify(defaultKey, null, 2))
      throw new Error(
        "No key.json found, a default key was created. Follow the readme for more info: https://github.com/plasmo-corp/gcp-refresh-token"
      )
    } else {
      throw new Error("No key.json found.")
    }
  }

  return {
    key: JSON.parse(await readFile(keyFilePath, "utf8")) as Key,
    keyFilePath
  }
}

const requiredFields = ["client_id", "client_secret", "redirect_uris"]

export const validateKey = (key: Key) => {
  if (requiredFields.some((field) => !key.installed[field])) {
    throw new Error(
      `key.json is missing one or more of the required fields: ${requiredFields.join(
        ", "
      )}`
    )
  }
}
