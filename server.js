const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const koaBody = require('koa-body')
const auth = require('./server/auth')
const RedisSessionStore = require('./server/session-store')
const api = require('./server/api')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const atob = require('atob')

// 創建 redis client
const redis = new Redis()

// 設置 nodejs 全局增加一個 atob 方法
global.atob = atob

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()
    server.keys = ['luke develop Github App']
    server.use(koaBody())
    const SESSION_CONFIG = {
        key: 'jid',
        store: new RedisSessionStore(redis),
    }
    server.use(session(SESSION_CONFIG, server))

    // 配置處理Github OAuth的登錄
    auth(server)
    api(server)
    
    router.get('/a/:id', async(ctx) => {
        const id = ctx.params.id
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: { id }
        })
        ctx.respond = false
    })
    router.get('/api/user/info', async(ctx) => { 
        const user =ctx.session.userInfo // Github 獲取到的 token 還有 user 訊息
        if (!user) {
            ctx.status = 401
            ctx.body = 'Need Login'
        }else {
            ctx.body = user
            ctx.set('Content-Type', 'application/json')
        }
    })
    server.use(router.routes())
    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        await next() // 要寫這個不然只會執行到這一個不會執行後面
    })
    server.use(async (ctx, next) => {
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })
    server.listen(3000, ()=> {
        console.log('koa server listening on 3000')
    })
})