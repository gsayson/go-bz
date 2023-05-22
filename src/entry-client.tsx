import { mount, StartClient } from "solid-start/entry-client"
import { load } from "recaptcha-v3"

console.log(process.env)

mount(() => <StartClient/>, document)