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

    /**
     * first: if authentication request require gateway parameter or not, then will be replaced by 'authenticated'.
     * authenticated: the flag that authentication request was sent.
     */
    const {first, authenticated} = ctx.query;

    if (authenticated) {
        return {
            code: HttpStatus.OK
        };
    }

    if (first){
        urlObj.query.gateway = true;
        urlObj.query.service = ctx.href.replace('first', 'authenticated');
    }

    return ctx.redirect(url.format(urlObj));
}