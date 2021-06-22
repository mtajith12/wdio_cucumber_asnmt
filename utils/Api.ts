import { getLogger } from 'log4js';
const request = require('request');
const logger = getLogger();
module.exports = {
  /**
	 *
	 * @param url
	 * @param methodType
	 * @param body
	 * @param queryString
	 * @returns {Promise<Promise<any>>}
	 */
  sendRequest: (url, methodType, body, queryString, headers) => {
    try {
      return new Promise((resolve, reject) => {
        const options = {
          method: methodType,
          headers,
          body,
          rejectUnauthorized: false,
        };
        if (body) {
          options.body = body;
          options.headers = headers;
        }
        // request.debug = true;
        request.defaults(options)(url, (err, res, bodyPayload) => {
          if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
            resolve(bodyPayload);
          } else {
			      logger.info(err.stack);
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error();
    }
  },


  /**
	 *
	 * @param url
	 * @param methodType
	 * @param body
	 * @param queryString
	 * @param headers
	 * @returns {Promise<Promise<any>>}
	 */
  sendRequestHeaders: (url, methodType, formType, headers, body, agentOptions) => {
    try {
      return new Promise((resolve, reject) => {
        const options = {
          method: methodType,
          headers,
          form: formType,
          json: true,
          body,
          agentOptions,
        };
        if (body) {
          options.body = body;
          options.headers = {
            'Content-Type': 'application/json',
          };
        }
        request.defaults(options)(url, (err, res, bodyPayload) => {
          if (!err && res.statusCode === 200) {
            resolve(bodyPayload);
          } else {
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error(e);
    }
  },
  /**
	 *
	 * @param url
	 * @param methodType
	 * @param body
	 * @param queryString
	 * @returns {Promise<Promise<any>>}
	 */
  sendRequestCDG: (url, methodType, body, queryString, headers) => {
    try {
      return new Promise((resolve, reject) => {
        const options = {
          method: methodType,
          body,
          headers,
        };
        console.log(options);
        if (body) {
          options.body = body;
          options.headers = headers;
        }
        // console.log(options)
        // request.debug = true;
        request.defaults(options)(url, (err, res, bodyPayload) => {
          if (!err && res.statusCode === 201) {
            resolve(bodyPayload);
          } else {
            // console.log(err.stack)
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error();
    }
  },
  /**
	 *
	 * @param url
	 * @param formData
	 * @param headers
	 * @returns {Promise<Promise<any>>}
	 */
  async postFormData(url, formData, headers) {
    try {
      return await new Promise((resolve, reject) => {
        const options = {
          url,
          formData,
          headers,
          rejectUnauthorized: false,
        };
        // request.debug = true;
        request.post(options, (err, res) => {
          if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
            resolve(res);
          } else {
            // console.log(err.stack);
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error();
    }
  },
  /**
   * Send request with .p12 SSL authentication
	 * @param url
	 * @param methodType
	 * @param body
	 * @param queryString
	 * @param headers
   * @param pfx
	 * @returns {Promise<Promise<any>>}
	 */
  sendRequestSSL: (url, methodType, body, headers, pfx, passphrase) => {
    try {
      return new Promise((resolve, reject) => {
        const options = {
          method: methodType,
          headers,
          agentOptions: {
            pfx: pfx,
            passphrase: passphrase,
          },
          body,
          rejectUnauthorized: false
        };
        if (body) {
          options.body = body;
          options.headers = headers;
        }
        // request.debug = true;
        request.defaults(options)(url, (err, res, bodyPayload) => {
          if (!err && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 404)) {
            resolve(bodyPayload);
          } else {
            // console.log(err.stack)
            reject(err);
          }
        });
      });
    } catch (e) {
      throw new Error();
    }
  }
};
