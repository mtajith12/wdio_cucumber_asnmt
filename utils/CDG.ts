// const _ = require('lodash');


import * as faker from 'faker';
import { getLogger } from 'log4js';
import { creationviaapi } from 'src/customerCreation';
const RequestHelper = require('utils/Api');
const data = require('src/DataReader');
const platformServiceCGDURL = data.getData('platformServiceCDG');
const tokenServiceCDGURL = data.getData('tokenServiceTestURL');
const logger = getLogger();

const CDGvalues = {
  confidentialDataGroupName: `CDG Name ${faker.random.alphaNumeric(6)}`,
  confidentialDataGroupDesc: `CDG Description ${faker.name.firstName()}`,
};
const CDGname = CDGvalues.confidentialDataGroupName;
const CDGdesc = CDGvalues.confidentialDataGroupDesc;


export { CDGname };

class ConfidentialDataGroup {
  async getTokenCDGAPI() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await RequestHelper.sendRequest(tokenServiceCDGURL, 'GET', undefined, undefined, headers);
    return response;
  }

  async runCDG(customerId, data1, uSer) {
    const x = await creationviaapi.createDAUser(data1, uSer);
    await creationviaapi.approveUser(x);
    const token = await this.getTokenCDGAPI();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const body =			{
      customerId: `${customerId}`,
      customerUid: `${data1.customerUid}`,
			  confidentialDataGroupName: `${CDGname}`,
			  confidentialDataGroupDesc: `${CDGdesc}`,
    };

    const response = await RequestHelper.sendRequestCDG(platformServiceCGDURL, 'POST', JSON.stringify(body), undefined, headers);
    return response;
  }
}
const ConfidentialDataGroups = new ConfidentialDataGroup();
export { ConfidentialDataGroups };
