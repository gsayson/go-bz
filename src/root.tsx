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
                        <footer class="sticky bottom-4 left-4 text-gray-400 dark:text-[#5a5a5a] p-4 bg-white dark:bg-[#0b0b0b] rounded-xl">
                            <p class="font-mono"><A href="/" class="hover:underline">go.gsn.bz</A> {(process.env.VERCEL_GIT_COMMIT_SHA as string ?? "gitSHA").substring(0, 6)}</p>
                            <p class="font-mono">{process.env.VERCEL_ENV ?? "development"} build</p>
                        </footer>
                    </ErrorBoundary>
                </Suspense> 
                <Scripts/>
            </Body>
        </Html>
    )
}
