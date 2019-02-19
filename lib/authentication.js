const url = require('url');

const HttpStatus = require('http-status-codes');

const { removeTicket } = require('./util');

module.exports = async (ctx, config) => {
    if (ctx.session && ctx.session.st){
        return {
            code: HttpStatus.OK
        };
    }

    let urlObj = {
        ...config,
        pathname: config.paths.login,
        query:{
            service: removeTicket(ctx)
        }
    }

    return ctx.redirect(url.format(urlObj));
}