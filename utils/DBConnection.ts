// const _ = require('lodash');
const data = require('src/DataReader');
const RequestHelper = require('utils/Api');
const platformServiceURL = data.getData('platformServiceURL');
const tokenServiceURL = data.getData('tokenServiceURL');
const tokenServiceTestURL = data.getData('tokenServiceTestURL');


class DBConnect {
  getTokenAPI() {
    const agentOptions = {
      rejectUnauthorized: false,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      CAAS_LOGONMETHOD: 'access_token',
      CAAS_AUTHLEVEL: '5',
      SM_USERDN: 'CN=1rgjsk0im2g0000000000',
      SM_SERVERSESSIONID: 'DFSAFDSAFASDFA',
    };
    const form = {
      grant_type: 'authorization_code',
      client_id: 'fxtg-app',
      state: 'jijda',
      redirect_uri: 'http://fxtg-app/callback',
    };
    const response = RequestHelper.sendRequestHeaders(tokenServiceURL, 'POST', form, headers, undefined, agentOptions);
    const userStr = JSON.stringify(response);
    const mytoken = JSON.parse(userStr);
    return mytoken.access_token;
  }

  async getTokenTestAPI() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await RequestHelper.sendRequest(tokenServiceTestURL, 'GET', undefined, undefined, headers);

    return response;
  }

  async run(queryParam) {
    const token = await this.getTokenTestAPI();
    const bearer = `Bearer ${token}`;
    const agentOptions = {
      rejectUnauthorized: false,
    };
    const headers = {
      accept: 'application/json',
      Authorization: bearer,
      'Content-Type': 'application/json',
      'X-B3-TraceId': '89b7fe72db29f5e6225ba02770da98d6',
      'X-B3-SpanId': '89b7fe72db29f5e6225ba02770da98d6',
      'X-B3-ParentSpanId': '3837dc3ba8fb342d70abf6454f27390d',
    };
    const body = {
      query: `${queryParam}`,
    };

    const response = await RequestHelper.sendRequestHeaders(platformServiceURL, 'POST', undefined, headers, body, agentOptions);
    return response;
  }
}

const DBConnection = new DBConnect();
export { DBConnection };
