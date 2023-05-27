import { kv } from "@vercel/kv"
import { APIEvent, json } from "solid-start"

const ERROR_MESSAGES = {
    alreadyTaken: "The alias is already taken.",
    badRequest: "bad request lol",
    unavailable: "The service is unavailable."
}

export async function POST(apiEvent: APIEvent) {
    const data = await (await new Response(apiEvent.request.body).json() as Promise<{
        token: string,
        urlToAlias: string,
        aliasPath: string,
        dayExpiry: number
    }>)
    if(
        !data.token || !data.aliasPath || !data.urlToAlias || !data.dayExpiry
        || data.aliasPath == "api" || data.aliasPath == "success" || /[^a-zA-Z0-9\.~_-]|\s/g.test(data.aliasPath)
        || data.aliasPath > 32
    ) {
        return json({
            success: false,
            message: ERROR_MESSAGES.badRequest
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
    if(resp.success && resp.action == "postURL" && resp.score >= 0.675) {
        const response = await kv.set(data.aliasPath, data.urlToAlias, {
            ex: 86400 * data.dayExpiry,
            nx: true
        })
        console.log("Response is: " + response)
        return json({
            success: response == "OK",
            message: response == "OK" ? undefined : ERROR_MESSAGES.alreadyTaken
        }, {
            status: response == "OK" ? 200 : 409
        })
    } else {
        return json({
            success: false,
            message: ERROR_MESSAGES.unavailable
        }, {
            status: 503
        })
    }
}