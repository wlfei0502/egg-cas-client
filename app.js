'use strict';

module.exports = app => {
    // ajust middleware sort, ['session', 'singleSignOut', 'bodyParser']
    let sessionIdx = app.config.coreMiddleware.findIndex(middleware => {
        return middleware == 'session';
    });

    app.config.coreMiddleware.splice(sessionIdx, 1);

    let bodyParserIdx = app.config.coreMiddleware.findIndex(middleware => {
        return middleware == 'bodyParser';
    });

    app.config.coreMiddleware.splice(bodyParserIdx, 0, 'session', 'singleSignOut');
};