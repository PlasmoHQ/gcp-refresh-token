# Google Cloud Platform Refresh Token

`gcp-refresh-token` is a cli util from [plasmo](https://www.plasmo.com/) to retrieve a refresh token as specified in [Google's OAuth 2.0 Refresh Token Flow](https://developers.google.com/identity/protocols/oauth2/native-app#programmatic-extraction).

The key usecase is to leverage GCP in an external CI pipeline. The original goal of this package is to resolve [`chrome-webstore-api`](https://github.com/PlasmoHQ/chrome-webstore-api)'s [#12](https://github.com/PlasmoHQ/chrome-webstore-api/issues/12), with further discussion [here](https://github.com/fregante/chrome-webstore-upload/issues/59). However, it can be extended for other usecases (by adding an option for more scopes).

## Usage

1. [Configure a GCP project](https://developer.chrome.com/docs/webstore/using_webstore_api/#enable-cws-api) for the CI process
1. Create an OAuth client key following [this guide](https://developer.chrome.com/docs/webstore/using_webstore_api/#get-keys).
1. Download the JSON key file and store it as `key.json` file.
1. Run `gcp-refresh-token`, replacing `pnpm dlx` with your preferred package manager equivalent (`npx` or `yarn dlx`):

```sh
## *** DO NOT PUSH key.json TO GIT ***
# If no key file is found, it will generate a sample key.json file for you to fill out or replace
pnpm dlx gcp-refresh-token
```

The resulted refresh token will be written into the `key.json` under the `chrome` property, ready to be used in your CI pipeline. If you use [`bpp`](https://www.browser.market), simply copy it:

```json
{
  "installed": {},
  "chrome": {
    "clientId": "etc",
    "clientSecret": "etc",
    "refreshToken": "etc"
  }
}
```

> You can also install and use it globally:

```sh
pnpm add -g gcp-refresh-token

gcp-refresh-token # or gcprt
```

> For custom scope, add a `scope` property to the `key.json`:

```json
{
  "installed": {},
  "scope": ["https://www.googleapis.com/auth/chromewebstore"]
}
```

## Development

### Terminal 1:

```sh
# install deps
pnpm i

# link global
pnpm link --global

# run dev server
pnpm dev
```

### Terminal 2:

```
gcprt help
```

## Publish process

1. Commit any changes to the repository.
2. `pnpm version patch | minor | major`
3. `pnpm publish`

# Support

Join the [Discord channel](https://discord.browser.market)!

# Acknowledgment

- [@daneroo/get-me-a-googleapi-refresh-token](https://github.com/daneroo/get-me-a-googleapi-refresh-token)

# License

[MIT](./LICENSE) 🖖 [Plasmo Corp.](https://plasmo.com)
