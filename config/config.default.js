'use strict';

/**
 * egg-cas-client default config
 * @member Config#casClient
 * @property {String} SOME_KEY - some description
 */
exports.casClient = {
    protocol: 'https',
    host: '',
    hostname: '',
    port: 443,
    pathname:'',
    paths: {
        serviceValidate: '/serviceValidate',
        login: '/login',
        logout: '/logout'
    }
};
