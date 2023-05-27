import { Accessor, Show, createSignal } from "solid-js"
import { createRouteAction, useNavigate, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { ReCaptchaInstance, load } from "recaptcha-v3"
import { isServer } from "solid-js/web"

export function routeData() {
    return createServerData$(async () => { return process.env.SITE_KEY })()
}

export default function Home() {
    const siteKey = useRouteData<typeof routeData>()!
    let recaptchaPromise: Promise<ReCaptchaInstance>
    if(!isServer) {
        recaptchaPromise = load(siteKey, {
            useRecaptchaNet: true,
            autoHideBadge: true
        })
    }
    const [newLink, setNewLink] = createSignal("")
    const [error, setError] = createSignal(false)
    const [errorMsg, setErrorMsg] = createSignal<string | undefined>(undefined)
    const [_, { Form }] = createRouteAction(async (data: FormData) => {
        if(!isServer) {
            const recaptcha = await recaptchaPromise
            const token = await recaptcha.execute("postURL")
            const response = await fetch(
                "/api/createAlias", 
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        token: token,
                        urlToAlias: data.get("toAlias")!.toString(),
                        aliasPath: data.get("newURL")!.toString(),
                        dayExpiry: data.get("expiry")!.valueOf() as number,
                    })
                }
            )
            const json = await response.json()
            if(!response.ok || json.success == false) {
                setError(true)
                setErrorMsg(json.message)
            } else {
                setError(false)
                setErrorMsg(undefined)
                window.location.assign(`/success/${data.get("newURL")!.toString()}`)
            }
        }
    })
    function LinkPreview(props: {
        link: Accessor<string>
    }) {
        return (
            <Show 
                when={props.link().trim().length != 0}
                fallback={
                    <p class="text-gray-400 dark:text-[#5a5a5a] mb-6">Please customize your link.</p>
                }
            >
                <p class="text-gray-400 dark:text-[#5a5a5a] mb-6">Your URL will appear as <span class="font-mono"> https://go.gsn.bz/{props.link()}</span>.</p>
            </Show>
        )
    }
    return (
        <main class="text-center mx-auto p-4 flex flex-col justify-center items-center h-screen">
            <h1 class="max-6-xs text-4xl lg:text-5xl mb-12 font-bold">go.gsn.bz</h1>
            <Form class="w-3/4 md:w-4/6 lg:w-[30rem] text-left">
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-black dark:text-white">URL to alias</label>
                <input type="url" name="toAlias" spellcheck={false} class={`font-mono bg-gray-300 text-black text-sm block w-full p-2.5 mb-4 dark:bg-[#1c1c1c] border ${error() ? "border-red-600" : "border-transparent"} placeholder-gray-500 dark:placeholder-[#5a5a5a] dark:text-white`}
                placeholder="https://gsn.bz" autoCapitalize="off" autocomplete="off" autocorrect="off" required={true} onKeyPress={(event) => {
                    if(/[^a-zA-Z0-9\.~_-]|\s/g.test(event.key)) event.preventDefault()
                }} onChange={(event) => {
                    event.currentTarget.value?.replaceAll(/[^a-zA-Z0-9\.~_-]|\s/g, "")
                }} onPaste={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replaceAll(/[^a-zA-Z0-9\.~_-]|\s/g, "").substring(0, 32)
                }}/>
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-black dark:text-white">Customize your link (max 32 chars)</label>
                <input type="text" name="newURL" class={`font-mono bg-gray-300 text-black text-sm block w-full p-2.5 mb-4 dark:bg-[#1c1c1c] border ${error() ? "border-red-600" : "border-transparent"} placeholder-gray-500 dark:placeholder-[#5a5a5a] dark:text-white`}
                placeholder="helloWorld" autoCapitalize="off" autocomplete="off" autocorrect="off" required={true} spellcheck={false} onKeyPress={(event) => {
                    if(/[^a-zA-Z0-9\.~_-]|\s/g.test(event.key) || event.currentTarget.value.length >= 32) {
                        event.preventDefault()
                        return
                    }
                }} onChange={(event) => {
                    event.currentTarget.value?.replaceAll(/[^a-zA-Z0-9\.~_-]|\s/g, "")
                    setNewLink(event.currentTarget.value ?? "")
                }} onPaste={(event) => {
                    event.currentTarget.value = event.currentTarget.value.replaceAll(/[^a-zA-Z0-9\.~_-]|\s/g, "").substring(0, 32)
                }}/>
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-black dark:text-white">Select your link's lifetime</label>
                <select name="expiry" required={true} class={`bg-gray-300 text-black text-sm w-full p-2.5 mb-4 dark:bg-[#1c1c1c] border ${error() ? "border-red-600" : "border-transparent"} dark:text-white`}>
                    <option value={1} selected>1 day</option>
                    <option value={5}>5 days</option>
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                    <option value={28}>4 weeks</option>
                </select>
                <Show when={true}>
                    <p class="text-red-700 dark:text-red-500 mb-3">{errorMsg()}</p>
                </Show>
                <LinkPreview link={newLink}/>
                <input type="submit" class="bg-blue-700 hover:bg-blue-600 disabled:hover:cursor-default disabled:bg-blue-800 disabled:text-gray-400 disabled:hover:bg-blue-800 transition-colors duration-150 text-sm p-[0.625rem] w-full text-center text-white hover:cursor-pointer" value="Alias URL"/>
                <p class="text-sm mt-4 text-gray-400 dark:text-[#5a5a5a]">This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" class="text-blue-500 border-b border-transparent hover:border-blue-500 transition duration-150">Privacy Policy</a> and <a href="https://policies.google.com/terms" class="text-blue-500 border-b border-transparent hover:border-blue-500 transition duration-150">Terms of Service</a> apply.</p>
            </Form>
        </main>
    )
}