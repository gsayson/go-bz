import { kv } from "@vercel/kv"
import { A, Head, Title, useParams, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"

export function routeData() {
    return createServerData$(async () => { return await kv.ttl(useParams().link) })()
}

export default function Success() {
    const exp = ((useRouteData<typeof routeData>() ?? 0) / 86400).toFixed(2)
    return (
        <>
            <Head>
                <Title>gsnGO - Success!</Title>
            </Head>
            <main class="text-center mx-auto p-4 flex flex-col justify-center items-center h-screen">
                <h1 class="max-6-xs text-lg mt-16 text-gray-400 dark:text-[#5a5a5a]">Your new link is:</h1>
                <h1 class="max-6-xs text-4xl lg:text-5xl mt-2 mb-2 font-mono">https://go.gsn.bz/{useParams().link}</h1>
                <h1 class="max-6-xs text-lg mt-4 text-gray-400 dark:text-[#5a5a5a]">It expires in {exp} day(s).</h1>
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-64 h-px my-8 border-0 bg-gray-400 dark:bg-[#5a5a5a]"/>
                    <span class="absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 dark:bg-[#0b0b0b] font-mono select-none text-gray-400 dark:text-[#5a5a5a]">//</span>
                </div>
                <A class="text-blue-500 border-b border-transparent hover:border-blue-500 transition duration-150" href="/">Go back to homepage</A>
            </main>
        </>
    )
}