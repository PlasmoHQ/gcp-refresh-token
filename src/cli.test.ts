import { expect, test } from "@jest/globals"
import { execFileSync } from "child_process"
import { existsSync } from "fs"
import { rm } from "fs/promises"
import { join } from "path"
import { cwd, execPath } from "process"

import { getKeyFilePath } from "~index"

const cliScript = join(cwd(), "dist", "cli.js")

const cliErrorRun = () => {
  try {
    execFileSync(execPath, [cliScript]).toString("utf-8")
  } catch (error) {
    return error.message.split("\n")[1]
  }
}

test("key checking corrects", async () => {
  const keyFilePath = getKeyFilePath()
  if (existsSync(keyFilePath)) {
    await rm(keyFilePath)
  }

  expect(cliErrorRun()).toMatchSnapshot()

  expect(existsSync(keyFilePath)).toBe(true)

  expect(cliErrorRun()).toMatchSnapshot()
})
