import { Accessor, createSignal } from "solid-js"
import { createRouteAction } from "solid-start"

export default function Home() {
    const [newLink, setNewLink] = createSignal("")
    const [error, setError] = createSignal(false)
    const [_, { Form }] = createRouteAction(async (data: FormData) => {
        console.log(data.get("toAlias")?.toString())
        setError(true)
    })
    let ref: HTMLParagraphElement
    function LinkPreview(props: {
        link: Accessor<string>
    }) {
        return (
            <p class="text-gray-400 dark:text-[#5a5a5a] mb-6">Your URL will appear as <span class="font-mono"> https://go.gsn.bz/{props.link().trim().length != 0 ? props.link() : "<random ID>"}</span>.</p>
        )
    }
    return (
        <main class="text-center mx-auto p-4 flex flex-col justify-center items-center h-screen">
            <h1 class="max-6-xs text-4xl lg:text-5xl mb-12 font-bold">go.gsn.bz</h1>
            <Form class="w-3/4 md:w-4/6 lg:w-[30rem] text-left">
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL to alias</label>
                <input type="url" name="toAlias" spellcheck={false} class={`font-mono bg-gray-300 text-gray-900 text-sm block w-full p-2.5 mb-4 dark:bg-[#1c1c1c] border ${error() ? "border-red-600" : "border-transparent"} placeholder-gray-500 dark:placeholder-[#5a5a5a] dark:text-white`}
                placeholder="https://gsn.bz" autoCapitalize="off" autocomplete="off" autocorrect="off" required={true} onKeyPress={(event) => {
                    if(/\s/g.test(event.key)) event.preventDefault()
                }} onChange={(event) => {
                    event.target.textContent?.replaceAll(/\s/g, "")
                }}/>
                <label for="input-group-1" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customize your link</label>
                <input type="text" name="newURL" class={`font-mono bg-gray-300 text-gray-900 text-sm block w-full p-2.5 mb-4 dark:bg-[#1c1c1c] border ${error() ? "border-red-600" : "border-transparent"} placeholder-gray-500 dark:placeholder-[#5a5a5a] dark:text-white`}
                placeholder="helloWorld" autoCapitalize="off" autocomplete="off" autocorrect="off" required={true} spellcheck={false} onKeyPress={(event) => {
                    if(/\s/g.test(event.key)) {
                        event.preventDefault()
                        return
                    }
                }} onChange={(event) => {
                    event.target.textContent?.replaceAll(/\s/g, "")
                    setNewLink(event.currentTarget.value ?? "")
                }}/>
                <LinkPreview link={newLink}/>
                <input type="submit" class="bg-blue-700 hover:bg-blue-600 transition-colors duration-150 text-sm p-[0.625rem] w-full text-center text-white hover:cursor-pointer" value="Shorten URL"/>
            </Form>
        </main>
    )
}