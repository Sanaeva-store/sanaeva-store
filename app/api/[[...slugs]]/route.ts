import { api } from '@/server/server'
import { Elysia} from 'elysia'


export const app = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Nextjs')

export const GET = api.fetch
export const POST = api.fetch
export const PUT = api.fetch
export const DELETE = api.fetch
