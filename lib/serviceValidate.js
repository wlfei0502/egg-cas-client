const url = require('url');
const HttpStatus = require('http-status-codes');

const { removeTicket, parseXml2Json} = require('./util');

async function validateService(ctx, url, msg) {
    const result = await ctx.curl(url);

    if (result.status != HttpStatus.OK){
        msg.code = HttpStatus.UNAUTHORIZED;
        msg.message = 'Unauthorized!';
        return msg;
    }

    // convert xml to json
    const authenticationSuccess = await parseXml2Json (result.data.toString());
    // authentication failed
    if (!authenticationSuccess){
        msg.code = HttpStatus.UNAUTHORIZED;
        msg.message = 'authentication failed';
        return msg;
    }
    // user information
    const user = authenticationSuccess[0].user;
    ctx.session.cas = {
        username:user[0]
    }
}

module.exports = async (ctx, config) => {
    const msg = {
        code:HttpStatus.OK,
        message:''
    }
    const ticket = ctx.query.ticket;
    // if the ticket is valid or not
    // if (!(ctx.session && ctx.session.st && (ctx.session.st === ticket))) {
        //  full serviceValidate url
        let urlObj = {
            ...config,
            pathname: config.paths.serviceValidate,
            query:{
                service:removeTicket(ctx),
                ticket
            }
        }

        await validateService(ctx, url.format(urlObj), msg);

        if (msg.code === HttpStatus.OK) {
            ctx.session.st = ticket;
            let sessionId = ctx.cookies.get('SESSIONID', ctx.sessionOptions);
            // store sessionId to redis
            await ctx.app.sessionStore.set(ticket, sessionId);
        }
    // }

    return msg;
}