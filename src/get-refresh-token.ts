import { OAuth2Client } from "google-auth-library"

import { getCode } from "~get-code"

export const getRefreshToken = async ({
  port = 0,
  clientId = "",
  clientSecret = "",
  redirectUri = "",
  scope = [""]
}) => {
  const client = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri
  })

  const authUrl = client.generateAuthUrl({
    prompt: "consent",
    access_type: "offline",
    scope
  })

  const code = await getCode({
    port,
    authUrl,
    redirectUri
  })

  console.log("Code retrieved, redeeming for token...")

  const { tokens } = await client.getToken(code)

  return tokens.refresh_token
}
