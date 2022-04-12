import { createServer } from "http"
import type { Socket } from "net"
import open from "open"

const makePage = (content: string) => `
<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Plasmo | GCP Refresh Token</title>
    <link rel="icon" type="image/svg+xml" href="https://plasmo.com/favicon-light.svg" sizes="any"/>
    <style>
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 90vh;
        font-family: Inter, sans-serif;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <main>
    ${content}
    </main>
  </body>
</html>
`

export const getCode = ({ port = 3000, authUrl = "", redirectUri = "" }) =>
  new Promise<string>((resolve, reject) => {
    const connections: Socket[] = []
    console.log("Looking for the code on port:", port)

    const server = createServer(async (req, res) => {
      const incomingURL = new URL(req.url, redirectUri)

      const code = incomingURL.searchParams.get("code")

      if (!code) {
        const error = new Error(
          "Code not found in callback 🛑 Close this tab and try again in the console"
        )
        res.end(makePage(error.message))
        server.close()
        reject(error)
        return
      }

      res.end(
        makePage(
          `Code retrieved 🚀 on port: ${port}. Please close this tab and return to the console.`
        )
      )
      server.close()
      resolve(code)
    })

    server.on("connection", (conn) => {
      connections.push(conn)
    })

    server.on("close", () => {
      connections.forEach((connection) => connection.destroy())
    })

    server.listen(port, () => {
      console.log(`Starting the auth flow, opening the browser to: ${authUrl}`)
      open(authUrl, { wait: false }).then((cp) => cp.unref())
    })
  })
