import { kv } from "@vercel/kv"
import { A, Navigate, redirect, useNavigate, useParams, useRouteData } from "solid-start"
import server$, { createServerData$ } from "solid-start/server"
import Error404 from "./[...404]"
import { createRenderEffect, createSignal } from "solid-js"

export function routeData() {
    return createServerData$(async () => { return await kv.get<string>(useParams().link) })()
}

export default function Link() {
    const url = useRouteData<typeof routeData>()
    if(!url) {
        return <Error404/>
    }
    const [count, setCount] = createSignal(500)
    setInterval(() => { if(count() > 0) setCount(count() - 1) }, 10)
    createRenderEffect(() => {
        if(count() == 0) {
            console.log("hi")
            window.location.assign(url)
        }
    })
    return (
        <main class="text-center mx-auto p-4 flex flex-col justify-center items-center h-screen">
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-64 h-px my-8 border-0 bg-gray-400 dark:bg-[#5a5a5a]"/>
                <span class="absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 dark:bg-[#0b0b0b] font-mono select-none text-gray-400 dark:text-[#5a5a5a]">//</span>
            </div>
            <p class="text-gray-400 dark:text-[#5a5a5a]">You will be redirected in</p>
            <h1 class={`max-6-xs text-5xl lg:text-6xl mt-4 mb-2 font-mono ${count() == 0 ? "text-blue-500" : ""}`}>{(count() / 100).toFixed(2)}</h1>
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-64 h-px my-8 border-0 bg-gray-400 dark:bg-[#5a5a5a]"/>
                <span class="absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 dark:bg-[#0b0b0b] font-mono select-none text-gray-400 dark:text-[#5a5a5a]">//</span>
            </div>
            <p class="max-6-xs text-lg mt-4 text-gray-400 dark:text-[#5a5a5a]">Your destination is <A href={url} class="font-mono text-blue-500 hover:underline">{url}</A>.</p>
        </main>
    )
}