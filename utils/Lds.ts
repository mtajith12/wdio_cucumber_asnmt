var ldap = require('ldapjs');
const data = require('src/DataReader');
import { assert } from 'chai';

module.exports = {
  /*
   * To work around the error "Error: read ECONNRESET, at TCP.onStreamRead (internal/stream_base_commons.js:111:27)" when running the feature files in parallel,
   * which was caused by LDAP connection time-out in case of failed step therefore LDAP connection wasn't torn down properly, the bind and destroy are done in the
   * search method to ensure stableness. 
   * More info related to this connection time-out refer to https://github.com/ldapjs/node-ldapjs/issues/498
   */
  search: (base, opts) => {
    try {
      return new Promise((resolve, reject) => {
        const client = ldap.createClient({
          url: `ldap://${data.getData('ldsHost')}:${data.getData('ldsPort')}`,
          reconnect: true
        });
        client.bind(data.getData('ldsUser'), data.getData('ldsPassword'), function(err) {
          assert.ifError(err);
        });

        var results = [];
        client.search(base, opts, (err, res) => {
          if (!err) {
            res.on('searchEntry', function(entry) {
              console.log('entry: ' + JSON.stringify(entry.object));
              results.push(entry.object);
            });
            res.on('searchReference', function(referral) {
              console.log('referral: ' + referral.uris.join());
            });
            res.on('error', (err) => {
              console.error('error: ' + err.message);
            });
            res.on('end', function(result) {
              console.log('status: ' + result.status);
              client.destroy();
              resolve(results);
            });            
          } else {
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  },
};