export default function Link() {
    return (
        <main class="text-center mx-auto p-4 flex flex-col justify-center items-center h-screen">
            <h1 class="max-6-xs text-lg mt-16 text-gray-400 dark:text-[#5a5a5a]">Your destination is</h1>
            <h1 class="max-6-xs text-5xl lg:text-6xl mt-2 mb-2 font-mono">www.gsn.bz</h1>
            <div class="inline-flex items-center justify-center w-full">
                <hr class="w-64 h-px my-8 border-0 bg-gray-400 dark:bg-[#5a5a5a]"/>
                <span class="absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 dark:bg-[#0b0b0b] font-mono select-none text-gray-400 dark:text-[#5a5a5a]">//</span>
            </div>
            <p class="text-gray-400 dark:text-[#5a5a5a]">You will be redirected in 13 seconds.</p>
        </main>
    )
}