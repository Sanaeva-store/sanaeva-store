import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { elysiaHelmet } from "elysiajs-helmet"


export const createApp = () => { 
    new Elysia()
    .use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        })
    )
    .use(
        elysiaHelmet()
    )
    return new Elysia()
}