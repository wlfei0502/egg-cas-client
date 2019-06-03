'use strict';

const url = require('url');

const _ = require('lodash');
const HttpStatus = require('http-status-codes');

const authentication = require('./authentication');
const serviceValidate = require('./serviceValidate');

class CasClient {
    constructor (options){
        this.config = options;
    }

    /**
     * sign in
     * @return {Function}
     */
    login () {
        const config = this.config;

        return async (ctx, next) => {
            if (!config.host && !config.hostname)
                throw new Error('host or hostname is not specified!');

            if (!ctx.session){
                throw new Error('session middleware is required!');
            }

            let sessionStore = ctx.app.sessionStore;

            // session store
            if (!sessionStore){
                throw new Error('session store is required!');
            }
			
			if (ctx.session.cas && ctx.session.cas.username){
                await next();
                return ;
            }
			
			
            let ticket = ctx.query.ticket;
            let authenticated = ctx.query.authenticated;
            
            if (!ticket){
                if (!authenticated) {
                    await authentication(ctx, config);
                } else {
                    await next();
                }
                return;
            }

            const msg = await serviceValidate(ctx, config);
            if (msg.code == HttpStatus.OK){
                await next();
            } else {
                ctx.status = msg.code;
                ctx.body = msg.message;
            }
        }
    }

    /**
     * sign out
     * @return {Function}
     */
    logout () {
        const config = this.config;

        return async (ctx, next) => {
            if (!ctx.session)
                return next();
            // destroy session
            ctx.session = null;

            // cas server logout request, then redirect to home page
            const urlObj = _.cloneDeep(config);
            urlObj.pathname = urlObj.paths.logout;
            urlObj.query = {
                service: ctx.origin
            }

            return ctx.redirect(url.format(urlObj));
        }
    }

    /**
     * single sign out
     * @param ctx
     * @param next
     * @return {Promise<void>}
     */
    async sso (ctx, next) {

        const sessionStore = ctx.app.sessionStore;
        if (ctx.method != 'POST' || !sessionStore) {
            await next();
            return;
        }

        let body = '';
        ctx.req.on('data', chunk => {
            body = body + chunk;
        });

        ctx.req.on('end', async () => {
			
			body = decodeURIComponent(body);
			
            if (!/<samlp:SessionIndex>(.*)<\/samlp:SessionIndex>/.exec(body)) {
                await next();
                return;
            }

            let st = RegExp.$1;
			
			let sessionId = await ctx.app.sessionStore.get(st);
			
			if (sessionId){
				// destroy session by sessionId
				await ctx.app.sessionStore.destroy(sessionId);
			}
                
            // destroy sessionId by st
            await ctx.app.sessionStore.destroy(st);
			
			ctx.body = {
                message:'logout success!';
            }
        });
    }
}

module.exports = CasClient;