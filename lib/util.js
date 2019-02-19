const qs = require('querystring');
const url = require("url");
const xml2js = require('xml2js');
const stripPrefix = require('xml2js/lib/processors').stripPrefix;

exports.removeTicket = ctx => {
    let query = ctx.query;
    if (query.ticket)
        delete query.ticket;
    let queryString = qs.stringify(query);
    return ctx.origin + url.parse(ctx.originalUrl).pathname + (queryString ? '?' + queryString : '');
};

exports.parseXml2Json = async function parseXml2Json(xmlData) {
    return new Promise(resolve => {
        const parser = new xml2js.Parser();
        xml2js.parseString(xmlData.toString(), {explicitRoot: false, tagNameProcessors: [stripPrefix]}, (err, xmlJson) => {
            if (err){
                resolve();
                return;
            }

            resolve(xmlJson.authenticationSuccess);
        });
    });
}