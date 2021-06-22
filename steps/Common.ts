import {
  After, Given, Then, When,
} from 'cucumber';
import * as faker from 'faker';
import { expect } from "chai";
import { getLogger } from 'log4js';
import * as jp from 'jsonpath';
import { cobraloginPage } from 'src/Login';
import { cobracustomer } from 'src/CreateCustomerPage';
import { MenuBar } from 'src/MenuBarPage';
import { creationviaapi } from 'src/customerCreation';
import { helper } from 'src/Helper';
import _ = require('lodash');
const logger = getLogger();
let accountNumberArray = [];
let accountNumberArray1 = [];
const divisionArray = [];
const userArray = [];

let legalEntityArray = [];
let legalentityResourceId = [];
let resourceGroupArray = [];


let id = [];
let accountsArray =[];
let idCap = [];
let idMdz = [];
let idCmm = [];
const billingid = [];
const userData = {
  customerName: faker.name.findName(),
  customerId: faker.random.alphaNumeric(12),
  adminModel: 'Single',
  products: ['Cash Management', 'Commercial Cards', 'Customer Administration'],
  jurisdiction: ['Australia', 'China'],
  productSettings: {
    cashManagementProductSettings: {
      payments: {
        domestic: ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)'],
        otherPayments: ['AU BPAY', 'Multibank Payments', 'International Payments', 'Transfers'],
        historical: ['ANZ Transactive - AU & NZ: Payments'],
      },
      balanceNTransactionReporting: ['Reporting - Accounts', 'Reporting - Term Deposits'],
      receivables: {
        directDebit: ['AU Domestic (Direct Debit)'],
        OtherReceivables: ['PayID Management'],

      },
      serviceRequest: ['Fulfilment', 'Services'],
      // otherSettings: 'No',
      // customerProductLimits: 'Customer Override',
    },
    commercialCardsProductSettings: ['CC_Reporting and Self-Service', 'CC_Administration'],
    customerProductSettings: ['Administration', 'Division Management', 'User Management', 'Role Management', 'Resource Management', 'Resource Group Management', 'Panel Management', 'Confidential Data Group Management'],

  },
};
Then(/^register customer$/, async () => {
  await cobracustomer.continue();
  await cobracustomer.selectingProductSettings(userData);
  await cobracustomer.confirm();
});
Given(/^BankUser lands on cobra login page$/, () => {

});
Given(/^BankUser logs out$/, async () => {
  // await helper.pause(2);
  await MenuBar.signOut();
  // to work around AAMS-2196
  await helper.waitForDisplayed(cobraloginPage.elements.userName);
});
Then(/^take screenshot "(.*)"$/, async (name) => {
  await helper.screenshot(name);
});
Given(/^create a customer using api$/, { wrapperOptions: { retry: 3 } }, async function () {
  this.customerapi = await creationviaapi.createCustomer();
  logger.info(JSON.stringify(this.customerapi));
  this.data = {
    customerId: `${await this.customerapi.customerId}`,
  };
  this.data1 = {
    customerId: `${await this.customerapi.customerId}`,
    customerUid: `${await this.customerapi.id}`,

  };
  logger.info(this.data);
  this.CustomerName = `${this.customerapi.customerName} (${this.customerapi.customerId})`;
  this.CustomerName1 = this.customerapi.customerName;
});

Given(/^create AuthPanel using api$/, { wrapperOptions: { retry: 3 } }, async function () {
  const AuthPaneldata = {
    customerUid: this.customerapi.id,
  };
  this.authPanel = await creationviaapi.createAuthPanel(AuthPaneldata);
});
Given(/^create a "([^"]*)" Division using api$/, { wrapperOptions: { retry: 3 } }, async function (count) {
  const divisiondata = {
    customerUid: this.customerapi.id,
    billingSystemId: `${this.customerapi.customerId}-${count}`,
    divisionName: `${this.customerapi.customerId}-${count}`,
  };
  divisionArray.push(await creationviaapi.createDivision(divisiondata));
  this.divisionapi = divisionArray;

  logger.info(JSON.stringify(this.divisionapi));
});

Given(/^create a "([^"]*)" OIM User using api$/, { wrapperOptions: { retry: 3 } }, async function (data) {
  const oimuserdata = {
    customerUid: this.customerapi.id,
    customerId: this.customerapi.customerId,
    entitlements: [{
      roleUid: this.roleUid,
    }],
    caasOrgCd: this.orgs[0].orgId,
    caasOrgUid: this.orgs[0].id,
  };
  console.log(oimuserdata);
  userArray.push(await creationviaapi.createOimUser(oimuserdata));
  this.userapi = userArray;

  logger.info(JSON.stringify(this.userapi));
});

Given(/^create a Account "([^"]*)" "([^"]*)"-"([^"]*)" and country "([^"]*)" using api and "([^"]*)"$/, { wrapperOptions: { retry: 6 } }, async function (host, bsb, account, country, status) {
  if (host === 'CAP' && country === 'AU') {
    const resourceData = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      bsbCode: process.env.TESTENV.toLowerCase().includes('dev') ? '013148' : bsb,
      accountNumber: account,

    };
    const resourceapi = await creationviaapi.createCAPaccount(resourceData, status);
    accountNumberArray.push(`${resourceapi.accountNumber}`);
    accountNumberArray1.push(`${resourceapi.accountNumber}`);
    id.push({
      id: resourceapi.id,
    });
    idCap.push({
      id: resourceapi.id,
    });
    logger.info(JSON.stringify(resourceapi));
  } else if (host === 'MDZ' && country === 'AU') {
    const resourceData2 = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accountNumber: account,

    };
    const mdzapi = await creationviaapi.createMDZaccountAU(resourceData2, status);
    accountNumberArray.push(`${mdzapi.accountNumber}`);
    accountNumberArray1.push(`${mdzapi.accountNumber}`);
    id.push({
      id: mdzapi.id,
    });
    idMdz.push({
      id: mdzapi.id,
    });
    logger.info(JSON.stringify(mdzapi));
  }
  else if (host === 'MDZ' && country === 'CN') {
    const resourceData2 = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? account : '199075CNY00002',

    };
    const mdzapi = await creationviaapi.createMDZaccountCN(resourceData2, status);
    accountNumberArray.push(`${mdzapi.accountNumber}`);
    accountNumberArray1.push(`${mdzapi.accountNumber}`);
    id.push({
      id: mdzapi.id,
    });
    idMdz.push({
      id: mdzapi.id,
    });
    logger.info(JSON.stringify(mdzapi));
  }
  else if (host === 'EXT' && country === 'AU') {
    const resourceData2 = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accountNumber: account,
      bicCode: bsb,

    };
    const extapi = await creationviaapi.createEXTaccount(resourceData2, status);
    accountNumberArray.push(`${extapi.accountNumber}`);
    accountNumberArray1.push(`${extapi.accountNumber}`);
    id.push({
      id: extapi.id,
    });
    logger.info(JSON.stringify(extapi));
  }
  else if (host === 'SYS' && country === 'NZ') {
    const resourceData2 = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? account : '01-0129-0941306-19',
    };
    const sysapi = await creationviaapi.createSYSaccountNZ(resourceData2, status);
    accountNumberArray.push(`${sysapi.accountNumber}`);
    accountNumberArray1.push(`${sysapi.accountNumber}`);
    id.push({
      id: sysapi.id,
    });
    logger.info(JSON.stringify(sysapi));
  }
  else if (host === 'VAM') {
    const resourceData2 = {
      divisions: this.divisionapi,
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? account : '14130619',
      countryCode: country
    };
    const vamapi = await creationviaapi.createVAMaccount(resourceData2, status);
    accountNumberArray.push(`${vamapi.accountNumber}`);
    accountNumberArray1.push(`${vamapi.accountNumber}`);
    id.push({
      id: vamapi.id,
    });
    logger.info(JSON.stringify(vamapi));
  }
  this.resourceData = {
    customerId: this.customerapi.customerId,
    accountNumber: account,
    hostSystem: host,
    country: country
  }
  this.accountNumberArray = accountNumberArray;
  this.accountNumber = accountNumberArray;
  this.account = accountNumberArray1;

  this.ids = id;
  this.capids = idCap;
  this.mdzids = idMdz;
  this.legalentityResourceId = id;
  console.log(`Account created: ${JSON.stringify(this.resourceData)}`);
});

Given(/^create Account using api with below details$/,{ wrapperOptions: { retry: 6 } }, async function (details)
{
  const accdata = details.hashes();
  const accountsApidata = [];
  
  for (const act1 of accdata) {
    accountsApidata.push({
      index: `${act1.AccountIndex}`,
      host: `${act1.AccountHost}`,
      hostindex: `${act1.HostIndex}`,
      division: `${act1.Division}`,
      bsb: `${act1.BSB}`,
      account: `${act1.AccountNumber}`,
      country: `${act1.Country}`,
      status: `${act1.Action}`,
    });
  }
  for (const i in accountsApidata) {

    if (accountsApidata[i].host === 'CAP' && accountsApidata[i].country === 'AU') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData = {
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        bsbCode: process.env.TESTENV.toLowerCase().includes('dev') ? '013148' : accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
      };

      const resourceapi = await creationviaapi.createCAPaccount(resourceData, accountsApidata[i].status);
      accountNumberArray.push(`${resourceapi.accountNumber}`);
      accountNumberArray1.push(`${resourceapi.accountNumber}`);
      id.push({
        id: resourceapi.id,
      });
      idCap.push({
        index: accountsApidata[i].hostindex,
        id: resourceapi.id,
        host :accountsApidata[i].host,
        accountNumber : accountsApidata[i].account,
      });
      accountsArray.push({
      index: accountsApidata[i].index,
      host: accountsApidata[i].host,
      hostIndex:accountsApidata[i].hostindex,
      division : resourceapi.divisions,
      bsb: accountsApidata[i].bsb,
      accountNumber: accountsApidata[i].account,
      country: accountsApidata[i].country,
      status: accountsApidata[i].status,
      })
      logger.info(JSON.stringify(resourceapi));
    } else if (accountsApidata[i].host === 'MDZ' && accountsApidata[i].country === 'AU') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData2 = {
        // divisions: this.divisionapi,
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        accountNumber: accountsApidata[i].account,
  
      };
      const mdzapi = await creationviaapi.createMDZaccountAU(resourceData2, accountsApidata[i].status);
      accountNumberArray.push(`${mdzapi.accountNumber}`);
      accountNumberArray1.push(`${mdzapi.accountNumber}`);
      id.push({
        id: mdzapi.id,
      });
      idMdz.push({
        index: accountsApidata[i].hostindex,
        id: mdzapi.id,
        host :accountsApidata[i].host,
        accountNumber : accountsApidata[i].account,
      });
      accountsArray.push({
        index: accountsApidata[i].index,
        host: accountsApidata[i].host,
        hostIndex:accountsApidata[i].hostindex,
        division : mdzapi.divisions,
        bsb: accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
        country: accountsApidata[i].country,
        status: accountsApidata[i].status,
        })
      logger.info(JSON.stringify(mdzapi));
    }
    else if (accountsApidata[i].host === 'MDZ' && accountsApidata[i].country === 'CN') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData2 = {
        // divisions: this.divisionapi,
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? accountsApidata[i].account : '199075CNY00002',
      };
      const mdzapi = await creationviaapi.createMDZaccountCN(resourceData2, accountsApidata[i].status);
      accountNumberArray.push(`${mdzapi.accountNumber}`);
      accountNumberArray1.push(`${mdzapi.accountNumber}`);
      id.push({
        id: mdzapi.id,
      });
      idMdz.push({
        id: mdzapi.id,
        index: accountsApidata[i].hostindex,
        host :accountsApidata[i].host,
        accountNumber : accountsApidata[i].account,
      });
      accountsArray.push({
        index: accountsApidata[i].index,
        host: accountsApidata[i].host,
        hostIndex:accountsApidata[i].hostindex,
        division : mdzapi.divisions,
        bsb: accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
        country: accountsApidata[i].country,
        status: accountsApidata[i].status,
        })
      logger.info(JSON.stringify(mdzapi));
    }
    else if (accountsApidata[i].host === 'EXT' && accountsApidata[i].country === 'AU') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData2 = {
        // divisions: this.divisionapi,
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        accountNumber: accountsApidata[i].account,
        bicCode: accountsApidata[i].bsb,
      };
      const extapi = await creationviaapi.createEXTaccount(resourceData2, accountsApidata[i].status);
      accountNumberArray.push(`${extapi.accountNumber}`);
      accountNumberArray1.push(`${extapi.accountNumber}`);
      id.push({
        id: extapi.id,
      });
      accountsArray.push({
        index: accountsApidata[i].index,
        host: accountsApidata[i].host,
        hostIndex:accountsApidata[i].hostindex,
        division : extapi.divisions,
        bsb: accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
        country: accountsApidata[i].country,
        status: accountsApidata[i].status,
        })
      logger.info(JSON.stringify(extapi));
    }
    else if (accountsApidata[i].host === 'SYS' && accountsApidata[i].country === 'NZ') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData2 = {
        // divisions: this.divisionapi,
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? accountsApidata[i].account : '01-0129-0941306-19',
      };
      const sysapi = await creationviaapi.createSYSaccountNZ(resourceData2, accountsApidata[i].status);
      accountNumberArray.push(`${sysapi.accountNumber}`);
      accountNumberArray1.push(`${sysapi.accountNumber}`);
      id.push({
        id: sysapi.id,
      });
      accountsArray.push({
        index: accountsApidata[i].index,
        host: accountsApidata[i].host,
        hostIndex:accountsApidata[i].hostindex,
        division : sysapi.divisions,
        bsb: accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
        country: accountsApidata[i].country,
        status: accountsApidata[i].status,
        })
      logger.info(JSON.stringify(sysapi));
    }
    else if (accountsApidata[i].host === 'VAM') {
      const n = `${_.toInteger(accountsApidata[i].division) - 1}`
      let div =[] 
      div.push(this.divisionapi[n])
      const resourceData2 = {
        // divisions: this.divisionapi,
        divisions: accountsApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
        customerName: this.customerapi.customerName,
        customerId: this.customerapi.customerId,
        customerUid: this.customerapi.id,
        accountNumber: process.env.TESTENV.toLowerCase().includes('dev') ? accountsApidata[i].account : '14130619',
        countryCode: accountsApidata[i].country
      };
      const vamapi = await creationviaapi.createVAMaccount(resourceData2, accountsApidata[i].status);
      accountNumberArray.push(`${vamapi.accountNumber}`);
      accountNumberArray1.push(`${vamapi.accountNumber}`);
      id.push({
        id: vamapi.id,
      });
      accountsArray.push({
        index: accountsApidata[i].index,
        host: accountsApidata[i].host,
        hostIndex:accountsApidata[i].hostindex,
        division : vamapi.divisions,
        bsb: accountsApidata[i].bsb,
        accountNumber: accountsApidata[i].account,
        country: accountsApidata[i].country,
        status: accountsApidata[i].status,
        })
      logger.info(JSON.stringify(vamapi));
    }
    this.resourceData = {
      customerId: this.customerapi.customerId,
      accountNumber: accountsApidata[i].account,
      hostSystem: accountsApidata[i].host,
      country: accountsApidata[i].country
    }
    this.accountNumberArray = accountNumberArray;
    this.accountNumber = accountNumberArray;
    this.account = accountNumberArray1;
    this.accountsArray = accountsArray;

    this.ids = id;
    this.capids = idCap;
    this.mdzids = idMdz;
  
    this.legalentityResourceId = id;
    console.log(`Account created: ${JSON.stringify(this.resourceData)}`);
  }
  console.log(JSON.parse(JSON.stringify(accountsArray)));
})

Given(/^create billing entity using api and approve$/, { wrapperOptions: { retry: 6 } }, async function () {
  const resourceData = {
    divisions: this.divisionapi,
    customerName: this.customerapi.customerName,
    customerId: this.customerapi.customerId,
    customerUid: this.customerapi.id,

  };
  const resourceapi = await creationviaapi.createBillingEntity(resourceData);
  logger.info(JSON.stringify(resourceapi));
  billingid.push(resourceapi.billentNumber);
  this.billentNumber = billingid;
  logger.info(JSON.stringify(this.billentNumber));
});
Given(/^create a legal entity using api and "([^"]*)"$/, { wrapperOptions: { retry: 3 } }, async function (action) {
  const legalEntityData = {
    divisions: this.divisionapi,
    customerName: this.customerapi.customerName,
    customerId: this.customerapi.customerId,
    customerUid: this.customerapi.id,

    accounts: this.ids,
  };
  // console.log(legalEntityData);
  const legalEntityapi = await creationviaapi.createDefaultLegalEntity(legalEntityData, action);
  this.legalEntityName = [legalEntityapi.businessIdNumber];
  logger.info(JSON.stringify(this.legalEntityName));
  this.resourceData = {
    customerId: this.customerapi.customerId,
    businessIdNumber: this.legalEntityName
  }
  this.legalEntityArray = legalEntityArray
  console.log(legalEntityArray)
});
Given(/^create a legal entity using api for below details$/, { wrapperOptions: { retry: 3 } }, async function (details) {
  // Sample data to execute logic
  // let mdzids = [{ index: 1, id: '483893', host: 'MDZ' }, { index: 2, id: '483896', host: 'MDZ' }, { index: 3, id: '483897', host: 'MDZ' }]
  // let capids = [{ index: 1, id: '483892', host: 'CAP' }, { index: 2, id: '483894', host: 'CAP' }, { index: 3, id: '483895', host: 'CAP' }]

  const ledata = details.hashes();
  const legalEntityApidata = [];
  
  for (const act1 of ledata) {
    legalEntityApidata.push({
      index: `${act1.Index}`,
      products: `${act1.Product}`,
      division : `${act1.Division}`,
      accounthost: `${act1.AccountHost}`,
      action: `${act1.Action}`,
    });
  }
  for (const i in legalEntityApidata) {
    
    let acct, a,b
    let acctsToAdd = []
    acct = legalEntityApidata[i].accounthost
    
    if (acct.includes(';')) {
      b = acct.split(';')
    } else {
      b = [acct]
    }
    for (const j in b) {
      if (b[j].includes(',')) {
        a = b[j].split(',')
      } else {
        a = b[j]
      }

      if (a[1].includes('&')) {
        a[1] = a[1].split('&')
      }
      else {
        a[1] = a[1].split()
      }
      acctsToAdd.push({
        host: a[0],
        indexes: a[1]
      })
    }
    const addActs = JSON.parse(JSON.stringify(acctsToAdd))
  
    let y = []
    let leAccountNumbers =[]
    for (const k in addActs) {
      for (const m in addActs[k].indexes) {
        if (addActs[k].host == 'MDZ') {
          // to fetch the whole row's values print this : (this.mdzids.find(item => item.index == acc[k].indexes[m]))
          y.push({ id: this.mdzids.find(item => item.index == addActs[k].indexes[m]).id })
        } else if (addActs[k].host == 'CAP') {
          y.push({ id: this.capids.find(item => item.index == addActs[k].indexes[m]).id })
        }
      }
      for (const m in addActs[k].indexes) {
        if (addActs[k].host == 'MDZ') {
          // print only this to see the whole row's values : (this.mdzids.find(item => item.index == addActs[k].indexes[m]))
          leAccountNumbers.push( this.mdzids.find(item => item.index === addActs[k].indexes[m]).accountNumber )
        } else if (addActs[k].host == 'CAP') {
          leAccountNumbers.push(this.capids.find(item => item.index === addActs[k].indexes[m]).accountNumber)
        }
      }
    }
    let accountsToAdd = JSON.parse(JSON.stringify(y))
    // console.log(accountsToAdd);
    const n = `${_.toInteger(legalEntityApidata[i].division) - 1}`
    let div =[] 
    div.push(this.divisionapi[n])
    const legalEntityData = {
      // divisions: this.divisionapi,
      divisions: legalEntityApidata[i].division == 'All' ? this.divisionapi : JSON.parse(JSON.stringify(div)),
      customerName: this.customerapi.customerName,
      customerId: this.customerapi.customerId,
      customerUid: this.customerapi.id,
      accounts: accountsToAdd,
    };
    const legalEntityapi = await creationviaapi.createLegalEntity(legalEntityData, legalEntityApidata[i],leAccountNumbers);
    const legalEntityName = [legalEntityapi.businessIdNumber];
    logger.info(JSON.stringify(legalEntityName));
    this.resourceData = {
      customerId: this.customerapi.customerId,
      division : '',
      businessIdNumber: legalEntityName,
      index:legalEntityApidata[i].index,
    }
    legalEntityArray.push(legalEntityapi)
    this.legalEntityName = legalEntityName
  }
  this.legalEntityArray = legalEntityArray
  console.log(legalEntityArray)
});

Given(/^create loan deals using api$/, { wrapperOptions: { retry: 3 } }, async function () {
  const loanDealData = {
    divisions: this.divisionapi,
    customerName: this.customerapi.customerName,
    customerId: this.customerapi.customerId,
    customerUid: this.customerapi.id,
  };
  const loanDealapi = await creationviaapi.createLoanDeals(loanDealData);
  this.dealResourceId = loanDealapi.id;

  logger.info(loanDealapi);
});

Given(/^create fx organisation for country "([^"]*)" using api$/, { wrapperOptions: { retry: 3 } }, async function (country) {
  const fxOrganisationData = {
    divisions: this.divisionapi,
    customerName: this.customerapi.customerName,
    customerId: this.customerapi.customerId,
    customerUid: this.customerapi.id,
    countryCode: country
  };
  const fxOrganisationapi = await creationviaapi.createFxOrganisation(fxOrganisationData);
  this.fxOrgResourceId = fxOrganisationapi.id;
  logger.info(fxOrganisationapi);
});

Given(/^create a term deposit for "([^"]*)" hostSystem "([^"]*)" client Id and "([^"]*)" country using api and "([^"]*)"$/, { wrapperOptions: { retry: 3 } }, async function (hostSystem, tdclientId, country, action) {
  const termDepositData = {
    divisions: this.divisionapi,
    customerName: this.customerapi.customerName,
    customerId: this.customerapi.customerId,
    customerUid: this.customerapi.id,
  };

  const termDepositapi = await creationviaapi.createTermDeposit(termDepositData, hostSystem, tdclientId, country, action);

  this.tdResourceId = termDepositapi.id;
  this.termDeposit = tdclientId;
  logger.info(termDepositapi);
  this.resourceData = {
    customerId: this.customerapi.customerId,
    clientId: tdclientId,
    resouceType: 'TERM_DEPOSIT',
    hostSystem: hostSystem,

    country: country
  }
  this.termDepositName = `${termDepositapi.legalEntityName}(${tdclientId})`;

  console.log(this.termDepositName);
});

Given(/^create a resource group using api$/, { wrapperOptions: { retry: 3 } }, async function () {
  const resourceGroupData = {
    customerUid: this.customerapi.id,

    resources: this.ids,

  };
  const resourcegroupapi = await creationviaapi.createDefaultResourceGroup(resourceGroupData);
  this.resourceGroupName = [resourcegroupapi.resourceGroupName];
  logger.info(JSON.stringify(this.resourceGroupName));

});

Given(/^create resource group using api for below details$/, { wrapperOptions: { retry: 3 } }, async function (details) {
  const resgroupdata = details.hashes();
  const resGroupApidata = [];
  
  for (const act1 of resgroupdata) {
    resGroupApidata.push({
      index: `${act1.Index}`,
      accounthost: `${act1.AccountHost}`,
      action: `${act1.Action}`,
    });
  }
  for (const i in resGroupApidata) {
    let acct, a, b
    let acctsToAdd = []
    acct = resGroupApidata[i].accounthost
    
    if (acct.includes(';')) {
      b = acct.split(';')
    } else {
      b = [acct]
    }
    for (const j in b) {
      if (b[j].includes(',')) {
        a = b[j].split(',')
      } else {
        a = b[j]
      }

      if (a[1].includes('&')) {
        a[1] = a[1].split('&')
      }
      else {
        a[1] = a[1].split()
      }
      acctsToAdd.push({
        host: a[0],
        indexes: a[1]
      })
    }
    const addActs = JSON.parse(JSON.stringify(acctsToAdd))
    // console.log(addActs)
    let y = []
    let rgAccountNumbers = []
    for (const k in addActs) {
      for (const m in addActs[k].indexes) {
        if (addActs[k].host == 'MDZ') {
          // print only this to see the whole row's values : (this.mdzids.find(item => item.index == addActs[k].indexes[m]))
          y.push({ id: this.mdzids.find(item => item.index == addActs[k].indexes[m]).id })
        } else if (addActs[k].host == 'CAP') {
          y.push({ id: this.capids.find(item => item.index == addActs[k].indexes[m]).id })
        }
      }
      for (const m in addActs[k].indexes) {
        if (addActs[k].host == 'MDZ') {
          // print only this to see the whole row's values : (this.mdzids.find(item => item.index == addActs[k].indexes[m]))
          rgAccountNumbers.push( this.mdzids.find(item => item.index === addActs[k].indexes[m]).accountNumber )
        } else if (addActs[k].host == 'CAP') {
          rgAccountNumbers.push(this.capids.find(item => item.index === addActs[k].indexes[m]).accountNumber)
        }
      }
    }
    let accountsToAdd = JSON.parse(JSON.stringify(y))
    // console.log(accountsToAdd);

  const resourceGroupData = {
    customerUid: this.customerapi.id,
    resources: accountsToAdd,
  };
  const resourcegroupapi = await creationviaapi.createResourceGroup(resourceGroupData,resGroupApidata[i],rgAccountNumbers);
  this.resourceGroupName = [resourcegroupapi.resourceGroupName];
  logger.info(JSON.stringify(this.resourceGroupName));
  resourceGroupArray.push(resourcegroupapi)
} this.resourceGroupArray = resourceGroupArray
console.log(resourceGroupArray)

});

Given(/^create a Role using api$/, { wrapperOptions: { retry: 3 } }, async function () {
  const roleData = {
    customerUid: this.customerapi.id,
    customerId: this.customerapi.customerId,
    customerName: this.customerapi.customerName
  };
  this.rolesapi = await creationviaapi.createRoles(roleData);
  this.roleName = this.rolesapi.roleName;
  logger.info(JSON.stringify(this.rolesapi));
});

Then(/^set the local storage$/, async function () {
  browser.execute(() => localStorage.clear());
  await browser.setLocalStorage('customer', this.Customer.customerId);
  await browser.setLocalStorage('account', this.resourceData.accountNumber);
  await browser.setLocalStorage('resourceGroupName', this.resourceGroupName);
  await browser.setLocalStorage('legalEntityName', this.legalEntityName);
  await browser.setLocalStorage('roleName', this.roleName);
  logger.info(await browser.getLocalStorageItem('customer'));
  logger.info(await browser.getLocalStorageItem('account'));
  logger.info(await browser.getLocalStorageItem('resourceGroupName'));
  logger.info(await browser.getLocalStorageItem('legalEntityName'));
  logger.info(await browser.getLocalStorageItem('roleName'));
});
When(/^BankUser navigates to (Onboarding|Pending Approvals) page$/, async (name) => {
  const menuOption = (name === 'Onboarding') ? MenuBar.selectors.onboarding : MenuBar.selectors.pendingApproval;
  await helper.click(menuOption);
});

Then(/^BankUser selects to hide preview$/, async () => {
  await MenuBar.hidePreview();
});

Then(/^BankUser clicks on "(Continue|Cancel|Back|Submit)" button$/, async function (name) {
  logger.info(`Bankuser clicks on ${name} button`);
  if (name === 'Continue') {
    await helper.click(MenuBar.selectors.continue);
  } else if (name === 'Cancel') {
    await helper.click(MenuBar.selectors.cancel);
    await helper.waitForDisplayed(MenuBar.selectors.confirmDialog.confirmationMsg);
    console.log(await helper.getElementText(MenuBar.selectors.confirmDialog.confirmationMsg))
    expect(await helper.getElementText(MenuBar.selectors.confirmDialog.confirmationMsg)).to.equal(MenuBar.msg_051);
  } else if (name === 'Submit') {
    await helper.click(MenuBar.selectors.submit);
  } else {
    await helper.click(MenuBar.selectors.back);
  }
});

Then(/^BankUser selects "(No|Yes)" in the cancel (creation|modify) confirmation dialog$/, async function (button, action) {
  logger.info(`User clicks on ${button} button in the confirmation dialog`);
  if (button === 'No') {
    await helper.click(MenuBar.selectors.confirmDialog.cancelButton);
  } else {
    await helper.click(MenuBar.selectors.confirmDialog.confirmButton);
  }
});

Then(/^BankUser exists Modify (User|Org) mode$/, async function (entity) {
  logger.info('Bankuser exits modify mode');
  await helper.click(MenuBar.selectors.cancel);
  await helper.waitForTextInElement(MenuBar.selectors.confirmDialog.confirmationMsg, MenuBar.msg_051);
  await helper.click(MenuBar.selectors.confirmDialog.confirmButton);
});

After(async () => {
  accountNumberArray = [];
  accountNumberArray1 = [];

  id = [];
  idCap = [];
  idMdz = [];
  accountsArray = [];
  resourceGroupArray =[];
  legalEntityArray=[];
});
