import { kv } from "@vercel/kv"
import { APIEvent, json } from "solid-start"

export async function POST(apiEvent: APIEvent) {
    const data = await (await new Response(apiEvent.request.body).json() as Promise<{
        token: string,
        urlToAlias: string,
        aliasPath: string,
        dayExpiry: number
    }>)
    if(
        !data.token || !data.aliasPath || !data.urlToAlias || !data.dayExpiry
        || data.aliasPath == "api" || data.aliasPath == "success" || /[^a-zA-Z0-9\.~_-]/g.test(data.aliasPath)
    ) {
        return json({
            success: false
        }, {
            status: 400
        })
    }
    const resp = await (await fetch(
        "https://www.recaptcha.net/recaptcha/api/siteverify", 
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${process.env.RECAPTCHA_SECRET ?? "unknown"}&response=${data.token}`
        }
    )).json()
    if(resp.success && resp.action == "postURL" && resp.hostname == "localhost" && resp.score >= 0.675) {
        await kv.set(data.aliasPath, data.urlToAlias, {
            ex: 86400 * data.dayExpiry
        })
        return json({
            success: true
        }, {
            status: 200
        })
    } else {
        return json({
            success: false
        }, {
            status: 503
        })
    }
}