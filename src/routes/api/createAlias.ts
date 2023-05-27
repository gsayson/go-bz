import { kv } from "@vercel/kv"
import { APIEvent, json } from "solid-start"

export async function POST(apiEvent: APIEvent) {
    const data = await (await new Response(apiEvent.request.body).json() as Promise<{
        token: string,
        urlToAlias: string,
        aliasPath: string
    }>)
    if(!data.token) {
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
        await kv.set(data.aliasPath, data.urlToAlias)
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