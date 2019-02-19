const casClient = require('../../lib/casClient')

const CAS_CLIENT = Symbol('Application#casClient');

module.exports = {
    get casClient () {
        if (!this[CAS_CLIENT]) {
            this[CAS_CLIENT] = new casClient(this.config.casClient);
        }

        return this[CAS_CLIENT];
    }
}
