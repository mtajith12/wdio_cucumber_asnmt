import { Given, Before, Then } from 'cucumber';
import { creationviaapi } from 'src/customerCreation';
import { DBConnection } from 'src/DBConnection';
import { expect } from 'chai';
import * as jp from 'jsonpath';
import { Logger } from 'log4js';
const data = require('src/DataReader');
const RequestHelper = require('utils/Api');
import _ = require('lodash');
Given(/^Connect to rabbitmq with Username and password$/, async function () {
  this.rabbitmq = data.getData('rabbitmq')
  this.accessToken = `Basic ${Buffer.from(`${data.getData('mqusername')}:${data.getData('mqPassword')}`).toString('base64')}`;
});
Then(/^publish to "([^"]*)" with$/, async function (datass, sample) {
  let resourceData;
  const x = creationviaapi.getPacrdm2AccountRabbitMq();
  const roles = sample.hashes();
  for (const act of roles) {
    resourceData = {
      accountNumber: act.acctNumber,
    };
    let y;
    if (act.AccountType === 'MDZ') {
      y = await creationviaapi.PacrdmMDZ(resourceData);
    } else {
      y = await creationviaapi.PacrdmCAP(resourceData);
    }
    console.log(JSON.stringify(y));
    let samplex;
    console.log(act.acctName);
    if (act.acctName !== undefined) {
      samplex = {
        headers:
        {
          'axon-message-id': `${this.ids[0].id}`,
          'axon-message-aggregate-seq': 10,
          'axon-message-type': 'com.anz.pacrdm.events.AccountChangedEvent',
          'axon-message-aggregate-id': `${this.ids[0].id}`,
        },
        properties: {
          delivery_mode: 1,
          headers:
          {
            'axon-message-id': `${this.ids[0].id}`,
            'axon-message-aggregate-seq': 10,
            'axon-message-type': 'com.anz.pacrdm.events.AccountChangedEvent',
            'axon-message-aggregate-id': `${this.ids[0].id}`,
          },
        },
        payload: `{"acctName": "${act.acctName}","restrictedFlag": "${y[0].restrictedFlag}", "bsbCode": "${y[0].bsbCode}", "subProductCode": "${act.subProductCode}",  "acctSysCode": "${y[0].cbs.acctSys}",    "sysAcctId": "${y[0].sysAcctId}",    "acctNumber": "${y[0].acctNumber}",    "acctCcy": "${y[0].acctCcy}",    "cbsCode": "${y[0].cbs.cbsCode}",    "branchCode": "${y[0].branchCode}",    "countryCode":"${y[0].cbs.countryCode}",   "productCode":  "${y[0].productCode}",    "address1": "${act.AccountAddress}",    "addressCountryCode": "AU",    "acctStatus":  "${act.acctStatus}", "bicCode":"${act.bicCode}","changeType": "UPDATED","loadId": 1207}`,
      };
    } else {
      console.log(act.bsbCode);
      console.log(act.acctSysCode);
      samplex = {
        headers:
        {
          'axon-message-id': `${this.ids[0].id}`,
          'axon-message-aggregate-seq': 6,
          'axon-message-type': 'com.anz.pacrdm.events.AccountChangedEvent',
          'axon-message-aggregate-id': `${this.ids[0].id}`,
        },
        properties: {
          delivery_mode: 1,
          headers:
          {
            'axon-message-id': `${this.ids[0].id}`,
            'axon-message-aggregate-seq': 6,
            'axon-message-type': 'com.anz.pacrdm.events.AccountChangedEvent',
            'axon-message-aggregate-id': `${this.ids[0].id}`,
          },
        },
        payload: `{"acctName": "${y[0].acctName}","restrictedFlag": "${y[0].restrictedFlag}", "bsbCode": "${act.bsbCode}", "subProductCode": "${act.subProductCode}",  "acctSysCode": "${act.acctSysCode}",    "sysAcctId": "${y[0].sysAcctId}",    "acctNumber": "${y[0].acctNumber}",    "acctCcy": "${y[0].acctCcy}",    "cbsCode": "${act.cbsCode}",    "branchCode": "${act.bsbCode}",    "countryCode":"${y[0].cbs.countryCode}",   "productCode":  "${y[0].productCode}",    "address1": "${y[0].address1} ",    "addressCountryCode": "AU",    "acctStatus":  "${y[0].acctStatus}", "bicCode":"${y[0].cbs.bicCode}","changeType": "UPDATED","loadId": 1207}`,
      };
    }
    const ResourceData = JSON.stringify(_.merge({}, x, samplex));
    console.log(_.merge({}, x, samplex));
    const url = `${this.rabbitmq}/api/exchanges/%2F/amq.default/publish`;
    const headers = {
      Authorization: `${this.accessToken}`,
      'Content-Type': 'application/json',
    };
    let responseBody;
    try {
      responseBody = await RequestHelper.sendRequest(url, 'POST', ResourceData, undefined, headers);
    } catch (e) {
      throw (
        e
      );
    }

    console.log(responseBody);
  }
});
Then(/^Validate the changes in CA$/, async function (sample) {
  if ((process.env.DB_CHECK).toString() === 'true') {
  const jsoncaowner = await DBConnection.run(`select * from CA_OWNER.ACCOUNT where CA_OWNER.ACCOUNT.ORG_BIZ_ID = '${this.Customer.customerId}'`);
  console.log(jsoncaowner);
  const roles = sample.hashes();
  for (const act of roles) {
    if (act.acctName !== undefined) {
      expect(jp.query(await jsoncaowner, '$..ACCOUNT_NAME').toString()).to.equal(act.acctName);
      expect(jp.query(await jsoncaowner, '$..ADDRESS1').toString()).to.equal(act.AccountAddress);
      expect(jp.query(await jsoncaowner, '$..BIC_CODE').toString()).to.equal(act.bicCode);
      expect(jp.query(await jsoncaowner, '$..STATUS').toString()).to.equal(act.acctStatus);
      expect(jp.query(await jsoncaowner, '$..SUB_PRODUCT_CODE').toString()).to.equal(act.subProductCode);
    } else if (act.acctSysCode !== undefined) {
      expect(jp.query(await jsoncaowner, '$..CBS_CODE').toString()).to.equal(act.cbsCode);
      expect(jp.query(await jsoncaowner, '$..ACCOUNTING_SYSTEM_CODE').toString()).to.equal(act.acctSysCode);
      expect(jp.query(await jsoncaowner, '$..SUB_PRODUCT_CODE').toString()).to.equal(act.subProductCode);
    } else {
      expect(jp.query(await jsoncaowner, '$..BRANCH_CODE').toString()).to.equal(act.bsbCode);
      expect(jp.query(await jsoncaowner, '$..BSB').toString()).to.equal(act.bsbCode);
      expect(jp.query(await jsoncaowner, '$..DISPLAY_ACCOUNT_NUMBER').toString()).to.equal(`${act.bsbCode}-${act.acctNumber}`);
      expect(jp.query(await jsoncaowner, '$..SUB_PRODUCT_CODE').toString()).to.equal(act.subProductCode);
    }
  }
}
});
