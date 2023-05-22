// @refresh reload
import { Suspense } from "solid-js"
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"
import "./root.css"

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>gsnGO</Title>
                <Meta charset="utf-8"/>
                <Meta name="viewport" content="width=device-width, initial-scale=1"/>
            </Head>
            <Body class="bg-white text-black dark:bg-[#0b0b0b] dark:text-white">
                <Suspense>
                    <ErrorBoundary>
                        <Routes>
                            <FileRoutes/>
                        </Routes>
                        <footer class="absolute bottom-4 left-4 text-gray-400 dark:text-[#5a5a5a]">
                            <p class="font-mono"><A href="/" class="hover:underline">go.gsn.bz</A> 1.0.0</p>
                        </footer>
                    </ErrorBoundary>
                </Suspense> 
                <Scripts/>
            </Body>
        </Html>
    )
}
