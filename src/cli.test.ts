import { expect, test } from "@jest/globals"
import { execFileSync } from "child_process"
import { existsSync } from "fs"
import { join } from "path"
import { cwd, execPath } from "process"

const cliScript = join(cwd(), "dist", "cli.js")

const cliErrorRun = () => {
  try {
    execFileSync(execPath, [cliScript]).toString("utf-8")
  } catch (error) {
    console.log(error.message)

    return error.message.split("\n")[0]
  }
}

test("key checking corrects", async () => {
  expect(cliErrorRun()).toMatchSnapshot()

  expect(existsSync(join(cwd(), "key.json"))).toBe(true)

  expect(cliErrorRun()).toMatchSnapshot()
})
