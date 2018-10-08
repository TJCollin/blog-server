'use strict'
// 中间件集合
import bodyParser from'koa-bodyparser' // post body 解析
import helmet from 'koa-helmet' // 安全相关
// import cors from 'koa-cors'
import Interceptor from './interceptors'

const middlewares = (app) => {
	app.use(async (ctx, next) => {
		const start = new Date();
		await next();
		const duration = new Date() - start
		console.log(`${ctx.method} ${ctx.url} - ${duration}ms`)
	})
	app.use(Interceptor)
	app.use(helmet())
	app.use(bodyParser({
		jsoinLimit: '10mb',
		formLimit: '10mb',
		textLimit: '10mb'
	}))

	app.use(async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			ctx.body = { error }
		}
		if (ctx.status === 404 || ctx.status === 405) {
			ctx.body = { code: 0, message: '无效的api请求'}
		}
	})
}

export default middlewares