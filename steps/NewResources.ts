/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
import { Before, Then } from 'cucumber';
import * as _ from 'lodash';
import * as faker from 'faker';
import { helper } from 'src/Helper';
import { expect } from 'chai';
import { createResource } from 'src/CreateResources';

import { MenuBar } from 'src/MenuBarPage';
import { getLogger } from 'log4js';
import * as luhn from 'luhn-generator';
import { CreateBillingEntityResource } from 'src/CreateResourceBillingEntity';
import { cobraloginPage } from 'src/Login';
import { CreateLoanDealResource } from 'pages/CreateResourceLoanDealEntity';
import { selectors } from 'src/Selectors';
import { CreateFxOrganisationResource } from 'src/CreateResourceFxOrganisation';
import { CreateLegalEntityResource } from 'src/CreateResourceLegalentity';
import { createResourceGroup } from 'src/CreateResourceGroup';

import { CreateTermDepositResource } from 'src/CreateResourceTermDeposit';

import { DBConnection } from 'src/DBConnection';
import * as jp from 'jsonpath';
import { searchUserPage } from 'src/SearchUserPage';
import { cobracustomer } from 'src/CreateCustomerPage';
import { AuthPanelPage } from 'src/AuthPanelPage';
import { users } from 'src/Users';
import { CreateDivision } from 'src/CreateDivisionPage';

const data = require('src/DataReader');

const logger = getLogger();
let accountNumberArray = [];
let modifiedDealName;
let modifiedTermDeposit;
let resourceidarray = [];
Then(/^Click on regsiter resources$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.resource, 15000);
  await helper.click(MenuBar.selectors.resource);
});
Then(/^Register an Resource for account for "([^"]*)" Host system with "([^"]*)" BSB and "([^"]*)" accountNumber for "([^"]*)" country$/, async function (hostSystem, bsb, accountNumber, country) {
  const accountDetails = {
    country,
    hostSystem,
    bsb: process.env.TESTENV.toLowerCase().includes('dev') ? '013148' : bsb,
    accountNumber,
  };
  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: 'AFP Only',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));
  const number = accountDetails.accountNumber.toString().replace(/[-]/g, '');
  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${number}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}' and DELETE_FLAG = 'DelFlag'`;
  this.queryResourceProduct = `select * FROM CA_OWNER.PARTY_RESOURCE_PRODUCT where CA_OWNER.PARTY_RESOURCE_PRODUCT.RESOURCE_ID
  in (select CA_OWNER.ACCOUNT.RESOURCE_ID FROM CA_OWNER.ACCOUNT where CA_OWNER.ACCOUNT.ORG_BIZ_ID ='${this.resourceData.customerId}')`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  logger.info(this.accountName);
  this.accountNumberArray = [`${accountDetails.bsb}-${accountDetails.accountNumber}`];
  await helper.screenshot(`Register resource for -${hostSystem}`);
});
Then(/^Bankuser checks the accounts$/, () => {
  this.accountNumberArray = [];
  this.legalEntityName = [];
  accountNumberArray = [];
});
Then(/^Validate the "([^"]*)" message for "([^"]*)"$/, async function (status, resource) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'error') {
    if (resource === 'legal entity') {
      const message1 = await helper.getElementTextFromJSExecutor(selectors.searchGrid.approvalPopUp.errormessage3);

      logger.info(message1);
      const Account = this.account;
      const customerName = `${this.data.customerId} ${this.CustomerName1.toUpperCase()}`;
      const customerName1 = `${this.data.customerId} (${this.CustomerName1})`;
      const aliasname = this.legalEntityName.split('(');
      for (const i in Account) {
        //        expect(message1).to.include(`This account ${Account[i]} is already linked to a Legal Entity
        // under the customer ${customerName}`);
      }
      expect(message1).to.include(`This resource ${this.resourceData.businessIdNumber} (${aliasname[0].replace(/ +$/, '')}) is already registered under the customer ${customerName1}`);
      //     expect(message1).to.include(`This Client ID t6rh1x6t25d11 and Host System CAP is already registered
      // under the customer 9m5fl1m (Hannah Farrell)`);
    }
  } else if (status === 'modify') {
    if (resource === 'billing entity') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

      logger.info(message1);
      expect(message1).to.be.oneOf([`This will submit Billing Entity: ${this.billingEntityName} to be modified.`, '']);
      //

      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.billingEntityName} is now pending approval to be modified.`, '']);
    } else if (resource === 'legal entity') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

      logger.info(message1);
      expect(message1).to.be.oneOf([`This will submit Legal Entity: ${this.legalEntityName} to be modified.`, '']);
      //

      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.legalEntityName} is now pending approval to be modified.`, '']);
    } else if (resource === 'Deal') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

      logger.info(message1);
      expect(message1).to.be.oneOf([`This will submit Deal: ${this.loanDealName} to be modified.`, '']);
      //

      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.loanDealName} is now pending approval to be modified.`, '']);
    } else if (resource === 'Term Deposit') {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);
      logger.info(this.termDepositName);
      expect(message1).to.be.oneOf([`This will submit Term Deposit: ${this.termDepositName} to be modified.`, '']);

      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      expect(NotificationMessage).to.be.oneOf([`Resource ${this.termDepositName} is now pending approval to be modified.`, '']);
    } else {
      const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);
      //      logger.info("iam here");
      //      expect(message1).to.be.oneOf([`This will submit Accounts: ${this.accountName} to be modified.`,
      // '']);

      await createResource.approveResourceFromGrid();
      const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

      logger.info(NotificationMessage);
      //      expect(NotificationMessage).to.be.oneOf([`Resource ${this.accountName} is now pending approval to
      // be modified.`, '']);
    }
    // Validate on the UI
  } else if (status === 'deregister') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
  }
  await helper.screenshot(`Validate -${status}`);
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for the Resource$/, async function (action) {
  await createResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //  expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Resource: ${this.resourceName} was
      // rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((
          process.env.DB_CHECK
        ).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    }
    if (action === 'deregister') {
      await createResource.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      //  expect(registerUserNotificationMessage).to.be.oneOf([`De-registration of Resource ${this.resourceName}
      // was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((
          process.env.DB_CHECK
        ).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryResource);
          const jsoncaowner = await caowner;
          // To get existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
      });
    }
    await helper.click(selectors.Resource.closePreview);
    await helper.screenshot(`Reject Resource ${action}`);
  });
});

Then(/^Search the Resource in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.accountName} will be registered.`,
      notificationMessage: `Resource: ${this.accountName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    logger.info(actionApprove);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'None', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.accountName}.`,
      notificationMessage: `Changes to Resource: ${this.accountName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceData.bsb}-${this.resourceData.accountNumber} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.accountName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Resource: ${this.accountName} will be de-registered.`,
      notificationMessage: `Resource: ${this.accountName} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  }
  await helper.screenshot(`Approve -${action}`);
});

Then(/^Search the Resource in searchscreen and export data$/, async function () {
  await createResource.searchResources(this.resourceData);
  await helper.click(selectors.Resource.export); 
  await helper.pause(2);
});

Then(/^Search the Resource in searchscreen and "([^"]*)" "([^"]*)" field$/, async function (action, userAction) {
  if (action === 'View' && userAction === 'None') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    await createResource.viewResources(this.resourceData, 'Approved', null);
    expect(await helper.ifElementExists(selectors.Resource.dataHeading.accountDetailsAtrb.serviceRequestLegalEntityLabel)).to.equal(false);
  } else if (action === 'View' && userAction === 'serviceRequestLegalEntity') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    await createResource.viewResources(this.resourceData, 'Approved', null);
    await helper.waitForTextInElement(selectors.Resource.dataHeading.accountDetailsAtrb.serviceRequestLegalEntityLabel, 'Service Request Legal Entity');
    expect(await helper.ifElementExists(selectors.Resource.dataHeading.accountDetailsAtrb.serviceRequestLegalEntityLabel)).to.equal(true);
  }
});

Then(/^BankUser edits the Account resource$/, async function () {
  await createResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  const newCustAccAliasName = (
    `CHANGED ${faker.random.alphaNumeric(6)}`
  );
  await createResource.editCustomerAccountNameAlias(newCustAccAliasName);
  this.newCustAccAliasName = newCustAccAliasName;
  // await helper.pause(2);
});
Then(/^BankUser edits the resource and remove "([^"]*)" product$/, async (product) => {

  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await createResource.editProductEntitlement(product);
  // await helper.pause(2);

});
Then(/^BankUser edits the Account resource and remove "([^"]*)" product$/, async function (product) {
  await createResource.searchUsers(this.resourceData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  const newCustAccAliasName = (
    `CHANGED ${faker.random.alphaNumeric(6)}`
  );
  await createResource.editCustomerAcctNameAlias(newCustAccAliasName);
  this.newCustAccAliasName = newCustAccAliasName;
  // await helper.pause(2);
  await createResource.editProductEntitlement(product);
});
Then(/^Register an Resource for account for "([^"]*)" Host system with "([^"]*)" BICCode and "([^"]*)" accountNumber for "([^"]*)" country with "([^"]*)" currency code$/, async function (hostSystem, bicCode, accountNumber, country, accountCurrencyCode) {
  const accountDetails = {
    country,
    hostSystem,
    bicCode,
    accountNumber,
    accountCurrencyCode,
    accountStatus: 'Active',
    accountAddressCountry: country,
  };


  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: 'AFP_ONLY',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${accountDetails.accountNumber}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}'`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  logger.info(this.accountName);
  await helper.screenshot(`Register resource for -${hostSystem}`);
});
Then(/^Register an Resource for account for "([^"]*)" Host system with "([^"]*)" instance and "([^"]*)" accountNumber for "([^"]*)" country with "([^"]*)" currency code$/, async function (hostSystem, instance, accountNumber, country, accountCurrencyCode) {
  const accountDetails = {
    country,
    hostSystem,
    accountNumber,
    accountCurrencyCode,
    instance,
  };


  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: 'AFP Only',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));

  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${(
    accountDetails.accountNumber
  )}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}'`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  logger.info(this.accountName);

  await helper.screenshot(`Register resource for -${hostSystem}`);
});
Then(/^Register an Resource for "([^"]*)" for "([^"]*)" Host system for "([^"]*)" country$/, async function (resource, hostSystem, country) {
  if (resource === 'Billing Entity') {
    const billingEntity = {
      country,
      hostSystem,
      resouceType: 'BILLING_ENTITY',
      billingEntityNumber: country === 'Australia' ? luhn.random(16) : '1234567890123456789',
    };
    this.resourceData = _.merge(this.data, billingEntity);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.BILLING_ENTITY where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.billingEntityName = await CreateBillingEntityResource.registerResources(this.resourceData, resource, billingEntity);
    logger.info(this.billingEntityName);
    await helper.screenshot(`Register resource for -${hostSystem}`);

  } else if (resource === 'Term Deposit') {
    const TermDeposit = {
      country,
      hostSystem,
      resouceType: 'TERM_DEPOSIT',
      ClientID: '12345',
    };
    this.resourceData = _.merge(this.data, TermDeposit);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.billingEntityName = await CreateTermDepositResource.registerResources(this.resourceData, resource, TermDeposit);
    logger.info(this.billingEntityName);
    await helper.screenshot(`Register resource for -${hostSystem}`);

  } else {
    // let data = loanDeals;
    const loanDeals = {
      country,
      hostSystem,
      resouceType: 'LOAN_DEALS',
      dealTrackingNumber: 123456789012,
    };
    this.resourceData = _.merge(this.data, loanDeals);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.LOAN_DEAL where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.loanDealName = await CreateLoanDealResource.registerResources(this.resourceData, resource, loanDeals);
    logger.info(this.loanDealName);
    await helper.screenshot(`Register resource for -${hostSystem}`);
  }
});
Then(/^Register an Resource for Term Deposit for "([^"]*)" Host system with "([^"]*)" client ID for "([^"]*)" country$/, async function (hostSystem, clientId, country) {
  if (country === 'HK') {
    const TermDeposit = {
      country,
      auditCountry: 'Hong Kong',
      hostSystem,
      resouceType: 'TERM_DEPOSIT',
      clientId,
      legalEntityName: 'DAYAL PUBLIC CLEANING GENERAL',
      bankName: 'ANZ Bank, Hong Kong',
    };
    this.resourceData = _.merge(this.data, TermDeposit);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.termDepositName = await CreateTermDepositResource.registerResources(this.resourceData, 'Term Deposit', TermDeposit);
    await helper.screenshot(`Register resource for -${hostSystem}`);
  } else {
    const TermDeposit = {
      country,
      hostSystem,
      resouceType: 'TERM_DEPOSIT',
      auditCountry: 'Australia',
      clientId,
      legalEntityName: 'MCMILLAN GENERAL SPECIALIST GENERAL',
      bankName: 'ANZ Bank, Australia',
    };
    this.resourceData = _.merge(this.data, TermDeposit);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.termDepositName = await CreateTermDepositResource.registerResources(this.resourceData, 'Term Deposit', TermDeposit);
    await helper.screenshot(`Register resource for -${hostSystem}`);
  }
});
Then(/^Create a Resource for Term Deposit for "([^"]*)" Host system with "([^"]*)" client ID for "([^"]*)" country$/, async function (hostSystem, clientId, country) {
  const TermDeposit = {
    country,
    hostSystem,
    resouceType: 'TERM_DEPOSIT',
    clientId,
    legalEntityName: 'Corporate 01581',
    ledgerInstance: 'cnb',
    bankName: 'ANZ Singapore',
  };
  this.resourceData = _.merge(this.data, TermDeposit);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
  this.termDepositName = await CreateTermDepositResource.registerTDResources(this.resourceData, 'Term Deposit', TermDeposit);
  await helper.screenshot(`Register resource for -${hostSystem}`);
  this.termDeposit = clientId;

});
Then(/^BankUser edits the resource of Billing Entity$/, async function () {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);

  const newBillentNamealias = faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '');

  await CreateBillingEntityResource.editCustomerBillingEntityNameAlias(newBillentNamealias);
  this.newBillentNamealias = newBillentNamealias;
  await helper.pause(2);


});
Then(/^Enter the fields for register Resource for Term Deposit for "([^"]*)" Host system with "([^"]*)" client ID for "([^"]*)" country$/, async function (hostSystem, clientId, country) {
  if (country === 'Hong Kong') {
    const TermDeposit = {
      country,
      hostSystem,
      resouceType: 'TERM_DEPOSIT',
      clientId,
      legalEntityName: 'DAYAL PUBLIC CLEANING GENERAL',
      bankName: 'ANZ Bank, Hong Kong',
    };
    this.resourceData = _.merge(this.data, TermDeposit);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.termDepositName = await CreateTermDepositResource.enterRegisterResources(this.resourceData, 'Term Deposit', TermDeposit);
    await helper.screenshot(`Register resource for -${hostSystem}`);
  } else {
    const TermDeposit = {
      country,
      hostSystem,
      resouceType: 'TERM_DEPOSIT',
      clientId,
      legalEntityName: 'MCMILLAN GENERAL SPECIALIST GENERAL',
      bankName: 'ANZ Bank, Australia',
    };
    this.resourceData = _.merge(this.data, TermDeposit);
    logger.info(JSON.stringify(this.resourceData));
    this.queryResource = `select * from CA_OWNER.TD_CUSTOMER where ORG_BIZ_ID = '${this.resourceData.customerId}'`;
    this.termDepositName = await CreateTermDepositResource.enterRegisterResources(this.resourceData, 'Term Deposit', TermDeposit);
    await helper.screenshot(`Register resource for -${hostSystem}`);
  }
});

Then(/^User selects "([^"]*)" from "([^"]*)" in register Term deposit page$/, async (val, drpdwn) => {
  const element = {
    'country dropdown': selectors.Resource.dataHeading.findAccountDetails.findCountry,
    'hostsystem dropdown': selectors.Resource.dataHeading.findAccountDetails.findHostSystem,
  };
  await helper.selectByVisibleText(element[drpdwn], val);
}); 

Then(/^The termdeposit details section disappears and client id value is cleared$/, async () => {
  expect(await helper.ifElementDisplayedAfterTime('.//*[@for="clientId"]/parent::div/parent::div/parent::div')).to.be.equal(false);
  expect(await helper.getElementValue(selectors.Resource.TermDepositResource.findTermDeposit.depositID)).to.be.equal('');
  
}); 

Then(/^The termdeposit details section appears as manual entry and client id value is cleared with disappeared search icon$/, async () => {
  expect(await helper.ifElementDisplayedAfterTime('input[name="legalEntityName"]')).to.be.equal(true);
  expect(await helper.ifElementDisplayedAfterTime('input[name="ledgerInstance"]')).to.be.equal(true);
  expect(await helper.getElementValue('[name="clientId"]')).to.be.equal('');
  expect(await helper.ifElementDisplayedAfterTime('[title="Search Client ID"]')).to.be.equal(false);
  
});

Then(/^The system must show values on host system dropdown for "([^"]*)"$/, async (country) => {
  switch (country) {
    case 'Singapore':
    case 'China': {
      expect(await helper.ifElementDisplayedAfterTime('[value="MDZ"]')).to.be.equal(true);
      break;
    }
    case 'Australia': {
      expect(await helper.ifElementDisplayedAfterTime('[value="CMM"]')).to.be.equal(true);
      expect(await helper.ifElementDisplayedAfterTime('[value="DLD"]')).to.be.equal(true);
      break;
    }
  }

  
}); 

Then(/^BankUser edits the resource of Deal - "([^"]*)"$/, async function (editAction) {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);

  if (editAction === 'Deal Name') {
    // await
    // CreateLoanDealResource.editLoanDealName(faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g,
    // ''));
    modifiedDealName = await CreateLoanDealResource.editLoanDealName(faker.name.findName().toString().replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ''));
    this.newdealname = modifiedDealName;
    // await helper.pause(3);
  } else if (editAction === 'Remove Division') {
    await CreateLoanDealResource.editRemoveDivision();
    // await helper.pause(2);
  }
});
Then(/^Search the Deal in searchscreen and "([^"]*)" "([^"]*)" workflow and validate against CA$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    logger.info(this.loanDealName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.loanDealName} will be registered.`,
      notificationMessage: `Resource: ${this.loanDealName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1,1',
        deleteflag: 'N,N',
      },
    };
    logger.info(actionApprove);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);

    await CreateLoanDealResource.db(actionApprove, this.resourceData);

  } else if (action === 'Approve' && userAction === 'modified division') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.loanDealName}.`,
      notificationMessage: `Changes to Resource: ${this.loanDealName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      flagdiv: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'N,Y',
      },
    };
    logger.info(actionPendingApproveModified);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
    await CreateLoanDealResource.db(actionPendingApproveModified, this.resourceData);
  } else if (action === 'Verify' && userAction === 'deregister') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.loanDealName} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.loanDealName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'N,Y',
      },
    };
    logger.info(actionDeregister);
    await CreateFxOrganisationResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
    await CreateLoanDealResource.db(actionDeregister, this.resourceData);
  }
  await helper.screenshot(`Approve Deal -${action}`);
});
Then(/^BankUser edits the resource of Term Deposit - "([^"]*)"$/, async (editAction) => {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  if (editAction === 'Remove Division') {
    await CreateTermDepositResource.editRemoveDivision();
    await helper.pause(2);
  }
  if (editAction === 'Add Division') {
    await CreateTermDepositResource.editAddTermDepositDivision();
    await helper.pause(2);
  }
});
Then(/^Search the "([^"]*)" in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (resource, action, userAction) {
  if (action === 'Verify' && userAction === 'new' && resource === 'billing entity') {
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new' && resource === 'billing entity') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.billingEntityName} will be registered.`,
      notificationMessage: `Resource: ${this.billingEntityName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify' && resource === 'billing entity') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.billingEntityName}.`,
      notificationMessage: `Changes to Resource: ${this.billingEntityName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister' && resource === 'billing entity') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceData.billingEntityNumber} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.billingEntityName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'new' && resource === 'Deal') {
    logger.info(this.loanDealName);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.loanDealName} will be registered.`,
      notificationMessage: `Resource: ${this.loanDealName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Verify' && userAction === 'deregister' && resource === 'Deal') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.resourceData.dealTrackingNumber} from the Customer ${this.resourceData.customerId}`,
      // notificationMessage: `Resource ${modifiedDealName} (${this.resourceData.dealTrackingNumber}) is now
      // pending approval to be deregistered.`,
      notificationMessage: `Resource ${this.loanDealName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister' && resource === 'Deal') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Deal: ${modifiedDealName} (${this.resourceData.dealTrackingNumber}) will be de-registered.`,
      notificationMessage: `Resource: ${modifiedDealName} (${this.resourceData.dealTrackingNumber}) has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: false,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  } else if (action === 'Approve' && userAction === 'modify' && resource === 'Deal') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${modifiedDealName} (${this.resourceData.dealTrackingNumber})`,
      notificationMessage: `Changes to Resource: ${modifiedDealName} (${this.resourceData.dealTrackingNumber}) have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    logger.info(actionPendingApproveModified);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Approve' && userAction === 'deregister' && resource === 'billing entity') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Resource: ${this.billingEntityName} will be de-registered.`,
      notificationMessage: `Resource: ${this.billingEntityName} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: false,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  } else if (action === 'Approve' && userAction === 'new' && resource === 'Term Deposit') {
    helper.pause(2);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      message: `On approval Resource: ${this.termDepositName} will be registered.`,
      notificationMessage: `Resource: ${this.termDepositName} has been registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1',
      },
    };
    logger.info(actionApprove);
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  } else if (action === 'Approve' && userAction === 'modify' && resource === 'Term Deposit') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Resource: ${this.termDepositName}.`,
      notificationMessage: `Changes to Resource: ${this.termDepositName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'deregister' && resource === 'Term Deposit') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will deregister ${this.termDepositName} from the Customer ${this.resourceData.customerId}`,
      notificationMessage: `Resource ${this.termDepositName} is now pending approval to be deregistered.`,
      action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Deregister', actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister' && resource === 'Term Deposit') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionDeregisterApprove = {
      message: `On approval Resource: ${this.termDepositName} will be de-registered.`,
      notificationMessage: `Resource: ${this.termDepositName} has been de-registered.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      hostSystem: `${this.resourceData.hostSystem}`,
      flag: false,
      db: {
        QUERY: this.queryResource,
        version: '2',
      },
    };
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionDeregisterApprove);
  }
  await helper.screenshot(`Approve-${resource} -${action}`);
});

Then(/^validate against CA for "([^"]*)" "([^"]*)" workflow for Term Deposit$/, async function (action, userAction) {
  if (action === 'Verify' && userAction === 'new') {
    await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Pending Approval - Register', undefined);
  } else if (action === 'Approve' && userAction === 'new') {
    helper.pause(2);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '1,1',
        deleteflag: 'N,N',
      },
    };
    logger.info(actionApprove);
    await CreateTermDepositResource.db(actionApprove);
  } else if (action === 'Approve' && userAction === 'modified division') {
    const actionPendingApproveModified = {
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'N,Y',
      },
    };
    await CreateTermDepositResource.db(actionPendingApproveModified);

  } else if (action === 'Verify' && userAction === 'deregister') {
    const actionDeregister = {
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'Y,Y',
      },
    };
    await CreateTermDepositResource.db(actionDeregister);
  } else if (action === 'Approve' && userAction === 'deregister') {
    const actionDeregister = {
      flag: false,
      db: {
        QUERY: this.queryResource,
        version: '2,1',
        deleteflag: 'Y,Y',
      },
    };
    await CreateTermDepositResource.db(actionDeregister);
  }
  await helper.screenshot(`Approve Term Deposit -${action}`);
});

Then(/^Bankuser registers a restricted country "([^"]*)" resource hostSystem "([^"]*)" and approves it$/, async function (restrictedCountry, hostSystem) {
  // await helper.pause(2);
  await helper.click(MenuBar.selectors.resource);
  // await helper.pause(2);
  const accountDetails = {
    country: restrictedCountry,
    hostSystem,
    accountNumber: process.env.TESTENV.toLowerCase().includes('cit') && (restrictedCountry == 'China') ? '195271CNY00002' : '123456789',
  };
  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: hostSystem.includes('VAM') ? '' : 'AFP_ONLY',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${(
    accountDetails.accountNumber
  )}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}'`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  this.accountNumber = `${accountDetails.accountNumber}`;
  logger.info(this.accountName);
  await MenuBar.signOut();
  await helper.waitForDisplayed(cobraloginPage.elements.userName);
  // await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  const actionApprove = {
    message: `On approval Resource: ${this.accountName} will be registered.`,
    notificationMessage: `Resource: ${this.accountName} has been registered.`,
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    hostSystem: `${this.resourceData.hostSystem}`,
    flag: true,
    db: {
      QUERY: this.queryResource,
      version: '1',
    },
  };
  logger.info(actionApprove);
  await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
});

Then(/^Bankuser registers a resource and approves it$/, async function () {
  await helper.click(MenuBar.selectors.resource);
  const accountDetails = {
    country: 'Australia',
    hostSystem: 'CAP',
    bsb: '015211',
    accountNumber: '672020901',
  };

  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: 'AFP_ONLY',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));
  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${(
    accountDetails.accountNumber
  )}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}'`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  this.accountNumber = `${accountDetails.bsb}-${accountDetails.accountNumber}`;
  this.accountNumberArray = this.accountNumber;
  logger.info(this.accountName);
  await MenuBar.signOut();
  await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  const actionApprove = {
    message: `On approval Resource: ${this.accountName} will be registered.`,
    notificationMessage: `Resource: ${this.accountName} has been registered.`,
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    hostSystem: `${this.resourceData.hostSystem}`,
    flag: true,

    db: {
      QUERY: this.queryResource,
      version: '1',
    },
  };
  logger.info(actionApprove);
  await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
});
Then(/^Bankuser registers a resource with "([^"]*)" hostSystem with AccountNumber "([^"]*)" with bsb "([^"]*)" and country "([^"]*)" and approves it$/, { wrapperOptions: { retry: 6 } }, async function (hostSystem, accountNumber, bsb, country) {
  await helper.openURL(data.getData('urlDomain'));
  const Usernamedefault = data.getData('cobraUserName');
  const PasswordDefault = data.getData('password');
  await cobraloginPage.enterUserName(Usernamedefault);
  await cobraloginPage.enterPassword(PasswordDefault);
  await cobraloginPage.clickSubmit();
  // // await helper.pause(10);
  await helper.waitForDisplayed(MenuBar.selectors.resource, 15000);
  // await helper.pause(2);
  await helper.click(MenuBar.selectors.resource);
  const accountDetails = {
    country,
    hostSystem,
    bsb: process.env.TESTENV.toLowerCase().includes('dev') ? '013148' : bsb,
    accountNumber,
    instance: '',
    bicCode: 'AAMNAU21XXX',
    accountCurrencyCode: 'AUD',
    accountStatus: 'Active',
    accountAddressCountry: country,
  };

  const AccountInfo = {
    accountType: 'Current',
    fundingMethod: 'AFP Only',
  };
  this.resourceData = _.merge(this.data, accountDetails);
  logger.info(JSON.stringify(this.resourceData));
  const number = accountDetails.accountNumber.toString().replace(/[-]/g, '');
  this.queryResource = `select * from CA_OWNER.ACCOUNT where ACCOUNT_NUMBER = '${(
    number
  )}' and CUSTOMER_NUMBER = '${this.resourceData.customerId}' and ACCOUNTING_SYSTEM_CODE ='${(
    accountDetails.hostSystem
  )}'`;
  this.accountName = await createResource.registerResources(this.resourceData, 'Accounts', accountDetails, AccountInfo);
  accountNumberArray.push(`${accountDetails.accountNumber}`);
  logger.info(this.accountName);
  await MenuBar.signOut();

  await helper.pause(2);

  await helper.openURL(data.getData('urlDomain'));
  const Username = data.getData('cobraApprover');
  const Password = data.getData('passwordApprover');
  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  // // await helper.pause(10);
  const actionApprove = {
    message: `On approval Resource: ${this.accountName} will be registered.`,
    notificationMessage: `Resource: ${this.accountName} has been registered.`,
    action: selectors.searchGrid.gridElementRightClick.approveBtn,
    hostSystem: `${this.resourceData.hostSystem}`,
    flag: true,

    db: {
      QUERY: this.queryResource,
      version: '1',
    },
  };
  logger.info(actionApprove);
  await createResource.searchUsersNValidateWorkFlow(this.resourceData, 'Approved', actionApprove);
  resourceidarray.push(await createResource.db(actionApprove, this.resourceData));


  await MenuBar.signOut();
  await helper.pause(2);
  this.accountNumberArray = accountNumberArray;
  this.accountNumber = accountNumberArray;
  this.accountResourceId = resourceidarray;
});

Before(async () => {
  accountNumberArray = [];
  resourceidarray = [];
});
Then(/^validate the elements present in the Resource screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.resource, 10000);
  await helper.click(MenuBar.selectors.resource);
  await helper.waitForDisplayed(selectors.Resource.custID);

  expect(await helper.ifElementDisplayed(selectors.Resource.custID)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.diviID)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.resource_type)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.hostSystem)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.ledgerInstance)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.resourceId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.currency)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.resourceName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Resource.country)).to.equal(true);
  await helper.screenshot('validate screen- Resource');
});

// // Then validate Service Request Legal Entity field not exist for account "<CAP-BSB>"-"<CAP-AccountNumber>"

// Then(/^Validate Service Request Legal Entity field not exist for account "([^"]*)"$/, async (accountNumber) => {


//   await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
//   await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);

//   await helper.waitForDisplayed(MenuBar.selectors.resource, 10000);
//   await helper.click(MenuBar.selectors.resource);
//   await helper.waitForDisplayed(selectors.Resource.custID);

//   expect(await helper.ifElementDisplayed(selectors.Resource.custID)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.diviID)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.resource_type)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.hostSystem)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.ledgerInstance)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.resourceId)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.currency)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.searchBtn)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.saveBtn)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.resetBtn)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.resourceName)).to.equal(true);
//   expect(await helper.ifElementDisplayed(selectors.Resource.country)).to.equal(true);
//   await helper.screenshot('validate screen- Resource');
// });
Then(/^validate against CA for "([^"]*)" "([^"]*)" workflow for "([^"]*)"$/, { wrapperOptions: { retry: 20 } }, async function (action, userAction, resource) {
  if (action === 'Approve' && userAction === 'new') {
    
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionApprove = {
      flag: true,
      db: {
        QUERY: resource === 'Resource Group' ? this.queryGroup : this.queryResource.replace('DelFlag', 'N'),
        version: '1',
        deleteflag: 'N',
      },
    };
    logger.info(actionApprove);

    if (resource === 'Accounts') { await createResource.db(actionApprove, this.resourceData); }
    if (resource === 'Deals') { await CreateLoanDealResource.db(actionApprove, this.resourceData); }
    if (resource === 'Billing Entity') { await CreateBillingEntityResource.db(actionApprove, this.resourceData); }
    if (resource === 'FX Organisation') { await CreateFxOrganisationResource.db(actionApprove, this.resourceData); }
    if (resource === 'Legal Entity') { await CreateLegalEntityResource.db(actionApprove); }
    if (resource === 'Resource Group') { await createResourceGroup.db(actionApprove); }

  } else if (action === 'Approve' && userAction === 'modify' || userAction === 'modify1') {
    const actionPendingApproveModified = {

      flag: true,
      hostSystem: `${this.resourceData.hostSystem}`,
      country: `${this.resourceData.country}`,
      db: {
        QUERY: resource === 'Resource Group' ? this.queryGroup : this.queryResource.replace('DelFlag', 'N'),
        version: '2',
        deleteflag: 'N',
      },
    };
    if (resource === 'Accounts') { await createResource.db(actionPendingApproveModified, this.resourceData); }
    if (resource === 'Deals') { await CreateLoanDealResource.db(actionPendingApproveModified, this.resourceData); }
    if (resource === 'Billing Entity') { await CreateBillingEntityResource.db(actionPendingApproveModified, this.resourceData); }
    if (resource === 'FX Organisation') { await CreateFxOrganisationResource.db(actionPendingApproveModified, this.resourceData); }
    if (resource === ' Legal Entity') { await CreateLegalEntityResource.db(actionPendingApproveModified); }
    if (resource === 'Resource Group') { await createResourceGroup.db(actionPendingApproveModified); }
  } else if (action === 'Approve' && userAction === 'modify2') {
    const actionPendingApproveModified = {

      flag: true,
      hostSystem: `${this.resourceData.hostSystem}`,
      country: `${this.resourceData.country}`,
      db: {
        QUERY: resource === 'Resource Group' ? this.queryGroup : this.queryResource,
        version: '3',
        deleteflag: 'N',
      },
    };
    if (resource === 'FX Organisation') { await CreateFxOrganisationResource.db(actionPendingApproveModified, this.resourceData); }
  } else if (action === 'Approve' && userAction === 'deregister') {
    const actionDeregisterApprove = {
      flag: false,
      hostSystem: `${this.resourceData.hostSystem}`,
      country: `${this.resourceData.country}`,
      db: {
        QUERY: resource === 'Resource Group' ? this.queryGroup : this.queryResource.replace('DelFlag', 'Y'),
        version: resource === 'FX Organisation' ? '3' : '2',
      },
    };
    if (resource === 'Accounts') { await createResource.db(actionDeregisterApprove, this.resourceData); }
    if (resource === 'Deals') { await CreateLoanDealResource.db(actionDeregisterApprove, this.resourceData); }
    if (resource === 'Billing Entity') { await CreateBillingEntityResource.db(actionDeregisterApprove, this.resourceData); }
    if (resource === 'FX Organisation') { await CreateFxOrganisationResource.db(actionDeregisterApprove, this.resourceData); }
    if (resource === ' Legal Entity') { await CreateLegalEntityResource.db(actionDeregisterApprove); }

    // await helper.pause(2);
  } else if (action === 'Approve' && userAction === 'Re-register' && resource === 'FX Organisation') {

    const actionReregisterApprove = {
      flag: true,
      hostSystem: `${this.resourceData.hostSystem}`,
      country: `${this.resourceData.country}`,
      db: {
        QUERY: this.queryResource,
        version: ['1,3', '3,1'],
        deleteflag: ['N,Y', 'Y,N'],
      },
    };
    if ((
      process.env.DB_CHECK
    ).toString() === 'true') {
      const caowner = await DBConnection.run(actionReregisterApprove.db.QUERY);
      const jsoncaowner = await caowner;
      expect(await actionReregisterApprove.db.version).includes(jp.query(await jsoncaowner, '$..VERSION').toString());
      expect(await actionReregisterApprove.db.deleteflag).includes(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString());
    }
  } else if (action === 'Approve' && userAction === 'Re-register' && resource === 'FX Organisation') {
    const actionReregisterApprove = {
      flag: true,
      db: {
        QUERY: this.queryResource,
        version: ['1,3', '3,1'],
        deleteflag: ['N,Y', 'Y,N'],
      },
    };
    if ((process.env.DB_CHECK).toString() === 'true') {
      const caowner = await DBConnection.run(actionReregisterApprove.db.QUERY);
      const jsoncaowner = await caowner;
      expect(await actionReregisterApprove.db.version).includes(jp.query(await jsoncaowner, '$..VERSION').toString());
      expect(await actionReregisterApprove.db.deleteflag).includes(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString());
    }
  }
});

Then(/^executing additional CA validations for "([^"]*)"$/, { wrapperOptions: { retry: 3 } }, async function (resource, details) {
  logger.info(`Executing additional CA Validation for : ${this.newBillentNamealias}`);
  if ((
    process.env.DB_CHECK
  ).toString() === 'true') {
    const jsoncaowner = await DBConnection.run(this.queryResource);
    switch (resource) {
      case 'Billing Entity': {
        logger.info('Billing Entity');

        //         expect(jp.query(await jsoncaowner, '$..SHORT_NAME').toString()).to.be.equal(await this.newBillentNameAlias);
        logger.info(`Validated Modified Billing Entity Short Name - ${this.newBillentNameAlias}`);

        break;
      }
      case 'Deal': {
        logger.info('Loan Deal');
        expect(jp.query(await jsoncaowner, '$..DEAL_NAME').toString()).to.be.equal(this.newdealname);
        logger.info(`Validated Modified Loan Deal Name - ${this.newdealname}`);
        break;
      }
      case 'Accounts': {
        logger.info('Accounts');
        if (`${this.resourceData.hostSystem}` == 'CAP') {
          const partyProductResource = details.hashes();
          const products = (
            jp.query(await partyProductResource, '$..productsDB').toString()
          ).split(' ').join('').split(',');
          const p = Array.from(products);
          const jsoncaowner1 = await DBConnection.run(this.queryResourceProduct);
          if ((
            partyProductResource
          ).toString() == [] && this.newCustAccAliasName) {
            expect(jp.query(await jsoncaowner, '$..NICKNAME').toString()).to.be.equal(this.newCustAccAliasName);
            logger.info(`Validated Modified Account Alias Name - ${this.newCustAccAliasName} `);
          } else if (p.length == 9) {

            const productsAdded = (
              jp.query(await partyProductResource, '$..productsDB').toString()
            ).split(' ').join('').split(',');
            for (const i in productsAdded) {
              expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).to.include(productsAdded[i]);
            }
            logger.info('Validated Added Products');
          } else if (p.length == 1) {

            const productRemoved = (
              jp.query(await partyProductResource, '$..productsDB').toString()
            );
            expect(jp.query(await jsoncaowner1, '$..PRODUCT_ID').toString()).not.to.include(productRemoved);
            logger.info(productRemoved);
            logger.info('Validated Product Removed');
          }

          await helper.click(selectors.Resource.closePreview);


        } else {
          logger.info("Hostsystem is not 'CAP'");
        }
        break;
      }
      default:
        logger.info('Error Resource Type');
        break;
    }
  }

});

Then(/^BankUser validates the Audit Scenarios for Accounts$/, async function (details) {
  const audit = details.hashes();
  const auditvalidations = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  // console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  await createResource.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  logger.info(this.resourceData);
  const res = 'ACCOUNTS';
  const div = (
    JSON.parse(JSON.stringify(this.divisionapi))
  )[0].divisionId;
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await createResource.auditValidation(await res, await x, this.resourceData, this.newCustAccAliasName, div);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Resource-Account-Approved');
      logger.info('Validated Audit-Approved-Account-Resource');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});

Then(/^BankUser validates the Audit Scenarios for Billing Entity$/, async function (details) {
  const audit = details.hashes();
  const auditvalidations = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  // console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  await createResource.searchUsers(this.Customer);
  logger.info(this.resourceData);
  const div = (
    JSON.parse(JSON.stringify(this.divisionapi))
  )[0].divisionId;
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  const res = 'BILLING_ENTITY';
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await createResource.auditValidation(await res, await x, this.resourceData, this.newBillentNamealias, div);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Resource-Billent-Approved');
      logger.info('Validated Audit-Approved-Billent-Resource');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});

Then(/^BankUser validates the Audit Scenarios for Deal$/, async function (details) {
  const audit = details.hashes();
  const auditvalidations = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  // console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  await createResource.searchUsers(this.Customer);
  logger.info(this.resourceData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  const res = (
    this.resourceData.resouceType
  );
  const div = await (
    JSON.parse(JSON.stringify(this.divisionapi))
  )[0].divisionId;
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);

      await createResource.auditValidation(await res, await x, this.resourceData, this.newdealname, await div);

    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Resource-Deal-Approved');
      logger.info('Validated Audit-Approved-Page-Deal');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
  await helper.click(selectors.Resource.closePreview);
});

Then(/^BankUser validates the Audit Scenarios for Term Deposit$/, async function (details) {
  await helper.pause(2);
  const audit = details.hashes();
  const auditvalidations = [];
  const count = [];
  for (const act1 of audit) {
    auditvalidations.push({
      description: `//div[contains(text(),'${act1.Description}')]`,
      action: `//div[contains(text(),'${act1.Action}')]`,
    });
  }
  console.log(auditvalidations);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.resource);
  await helper.click(MenuBar.selectors.resource);
  const divisionid = jp.query(await this.divisionapi, '$..divisionId');
  await CreateTermDepositResource.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.pause(2);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'resource-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await CreateTermDepositResource.auditValidation(await x, this.resourceData, divisionid);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      logger.info('Validated Approved TermDeposit');
      await helper.screenshot('Audit-TermDeposit-Approved');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
});
Then(/^Verify the Accounts Screen with$/, async function (validation) {
  const audit = validation.hashes();
  let validations;

  for (const act1 of audit) {

    await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
    await helper.waitForDisplayed(MenuBar.selectors.onboarding);
    await helper.click(MenuBar.selectors.onboarding);
    await helper.waitForDisplayed(MenuBar.selectors.resource);
    await helper.click(MenuBar.selectors.resource);
    await createResource.searchUsers(this.Customer);
    await helper.waitForDisplayed(selectors.searchGrid.gridFirstElement);
    if (act1.hostSystem) {
      expect(await helper.ifElementDisplayed(`//div[contains(text(),'${act1.hostSystem}')]`)).to.be.equal(true);
    }
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
    await helper.pause(2);
    if (act1.acctName !== undefined) {
      validations = {
        accountName: `//div[contains(text(),'${act1.acctName}')]`,
        AccountAddress: `//div[contains(text(),'${act1.AccountAddress}')]`,
        AccountStatus: `//div[contains(text(),'${act1.acctStatus}')]`,
      };
      expect(await helper.ifElementDisplayed(validations.accountName)).to.be.equal(true);
      expect(await helper.ifElementDisplayed(validations.AccountAddress)).to.be.equal(true);
      expect(await helper.ifElementDisplayed(validations.AccountStatus)).to.be.equal(true);
      await helper.click('//i[@class=\'fa fa-edit fa-fw\']');
      await helper.pause(2);

      expect(await helper.ifElementDisplayed('//div[contains(text(),\'Account Legal Entity Name is modified from PACRDM\')]')).to.be.equal(true);
      expect(await helper.ifElementDisplayed('//div[contains(text(),\'Account Status is modified from PACRDM\')]')).to.be.equal(true);
      expect(await helper.ifElementDisplayed('//div[contains(text(),\'Address is modified from PACRDM\')]')).to.be.equal(true);
    } else if (act1.bsbCode !== undefined) {

      expect(await helper.ifElementDisplayed(`//div[contains(text(),'${act1.bsbCode}-${act1.acctNumber}')]`)).to.be.equal(true);
      logger.info(`${act1.bsbCode}-${act1.acctNumber}`);
      await helper.click('//i[@class=\'fa fa-edit fa-fw\']');
      await helper.pause(2);
      logger.info(act1.bsbCode);
      expect(await helper.ifElementDisplayed('//div[contains(text(),\'BSB/Account Number is modified from PACRDM\')]')).to.be.equal(true);
    }
  }
});

Then(/^Verify the Resource Group Screen with$/, async function (validation) {
  const expected = validation.hashes();
  let validations;

  for (const act1 of expected) {

    await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
    await helper.waitForDisplayed(MenuBar.selectors.onboarding);
    await helper.click(MenuBar.selectors.onboarding);
    await helper.waitForDisplayed(MenuBar.selectors.resourceGroup);
    await helper.click(MenuBar.selectors.resourceGroup);
    await createResourceGroup.searchUsers(this.Customer);
    await helper.waitForDisplayed(selectors.searchGrid.gridFirstElement);
    await helper.pause(2);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
    await helper.pause(2);
    await helper.waitForDisplayed('//div[@id=\'resourceGroupResourceGrid\']', 15000);
    await helper.scrollToElement('//div[@id=\'resourceGroupResourceGrid\']');
    if (act1.acctSysCode !== undefined) {
      expect(await helper.ifElementDisplayed(`//div[@id=\'resourceGroupResourceGrid\']//div[contains(text(),\'${act1.acctSysCode}\')]`)).to.be.equal(true);
      logger.info(act1.acctSysCode);
    }

    if (act1.bsbCode !== undefined) {
      await helper.waitForDisplayed('//div[@id=\'resourceGroupResourceGrid\']', 15000);
      validations = {
        AccountNumber: `//div[contains(text(),\'${act1.bsbCode}-${act1.acctNumber}\')]`,
      };
      expect(await helper.ifElementDisplayed(validations.AccountNumber)).to.be.equal(true);
      logger.info(validations.AccountNumber);
    }
  }
});

Then(/^Verify the Legal Entity Screen with$/, async function (validation) {
  const expected = validation.hashes();
  let validations;

  for (const act1 of expected) {
    await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
    await helper.waitForDisplayed(MenuBar.selectors.onboarding);
    await helper.click(MenuBar.selectors.onboarding);
    await helper.waitForDisplayed(MenuBar.selectors.resource);
    await helper.click(MenuBar.selectors.resource);
    await CreateLegalEntityResource.searchUsers(this.Customer);
    await helper.waitForDisplayed(selectors.searchGrid.gridFirstElement);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
    await helper.pause(2);
    await helper.waitForDisplayed('//div[@id=\'AccountsResourceGroupGrid\']', 15000);
    await helper.scrollToElement('//div[@id=\'AccountsResourceGroupGrid\']');
    if (act1.acctSysCode !== undefined) {
      expect(await helper.ifElementDisplayed(`//div[@id=\'AccountsResourceGroupGrid\']//div[contains(text(),\'${act1.acctSysCode}\')]`)).to.be.equal(true);
      logger.info(act1.acctSysCode);
    }
    if (act1.bsbCode !== undefined) {
      validations = {
        AccountNumber: `//div[contains(text(),\'${act1.bsbCode}-${act1.acctNumber}\')]`,
      };
      expect(await helper.ifElementDisplayed(validations.AccountNumber)).to.be.equal(true);
      logger.info(validations.AccountNumber);
    }
  }
});

Then(/^Verify the Customer Users Screen with$/, async function (validation) {
  const expected = validation.hashes();
  let validations;

  for (const act1 of expected) {
    await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
    await helper.waitForDisplayed(MenuBar.selectors.onboarding);
    await helper.click(MenuBar.selectors.onboarding);
    await helper.waitForDisplayed(MenuBar.selectors.users);
    await helper.click(MenuBar.selectors.users);
    await users.searchManageUsers(this.Userslist[0]);
    await users.selectUsersFromGrid();
    await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
    await helper.pause(2);
    await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
    await helper.click(selectors.Users.editEntitlementsTab);
    await helper.doubleClickbasedonText('All Entitlements', selectors.Users.entitlementOptions.selected);
    if (act1.acctSysCode !== undefined) {
      expect(await helper.ifElementDisplayed(`//div[contains(text(),\'${act1.acctSysCode}\')]`)).to.be.equal(true);
      logger.info(act1.acctSysCode);
    } else if (act1.bsbCode !== undefined) {
      validations = {
        AccountNumber: `//div[contains(text(),\'${act1.bsbCode}-${act1.acctNumber}\')]`,
      };
      expect(await helper.ifElementDisplayed(validations.AccountNumber)).to.be.equal(true);
      logger.info(validations.AccountNumber);
    }
    const a = await $$('//i[@class=\'fa fa-times\']');
    await a[0].click();
  }
});

Then(/^View the account in Customer, Division ResourceTab and pending approval screen "([^"]*)"$/, async function (masking) {
  // Customer Screen
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await cobracustomer.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.pause(1);
  await helper.waitForDisplayed(selectors.Customers.resourceTab);
  await helper.click(selectors.Customers.resourceTab);
  await helper.waitForDisplayed(selectors.Customers.searchGrid.gridResourceFirstRecord);
  expect(await helper.ifElementDisplayedAfterTime(`//div[contains(text(),\'${this.resourceData.hostSystem}\')]`)).to.be.equal(true);
  await helper.screenshot('validate Customer-screen-Account');
  await helper.pause(1);
  if (masking === 'checkForMasking') {
    expect(await helper.ifElementDisplayedAfterTime('.//div[contains(text(),\'XXXXXXXX\')]')).to.be.equal(true);
  } else {
    await helper.doubleClick(selectors.Customers.searchGrid.gridResourceFirstRecord);
    await helper.pause(1);
    expect(await helper.ifElementDisplayedAfterTime(`//div[contains(text(),\'${this.resourceData.accountNumber}\')]`)).to.be.equal(true);
  }
  logger.info(`Account ${this.resourceData.hostSystem} verified on customer screen`);

  // Division Screen
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.pause(1);
  await CreateDivision.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.pause(1);
  await helper.waitForDisplayed(selectors.Division.resourceTab);
  await helper.click(selectors.Division.resourceTab);
  await helper.waitForDisplayed(selectors.Division.gridResourceFirstRecord);
  expect(await helper.ifElementDisplayedAfterTime(`//div[contains(text(),\'${this.resourceData.hostSystem}\')]`)).to.be.equal(true);
  await helper.screenshot('validate Dvision-screen-Account');
  await helper.pause(1);
  if (masking === 'checkForMasking') {
    expect(await helper.ifElementDisplayedAfterTime('.//div[contains(text(),\'XXXXXXXX\')]')).to.be.equal(true);
  } else {
    await helper.doubleClick(selectors.Division.gridResourceFirstRecord);
    await helper.pause(1);
    expect(await helper.ifElementDisplayedAfterTime(`//div[contains(text(),\'${this.resourceData.accountNumber}\')]`)).to.be.equal(true);
  }
  logger.info(`Account ${this.resourceData.hostSystem} verified on Division screen`);

  // Pending Approval Screen
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.pause(1);
  await helper.waitForDisplayed(MenuBar.selectors.pendingApproval);
  await helper.click(MenuBar.selectors.pendingApproval);
  await cobracustomer.searchByCustomerID(this.Customer);
  await cobracustomer.selectCustomerFromGrid();
  if (masking === 'checkForMasking') {
    expect(await helper.ifElementDisplayedAfterTime('.//div[contains(text(),\'XXXXXXXX\')]')).to.be.equal(true);
    await helper.click(selectors.searchGrid.actionsBtn);
    expect(await helper.isElementDisabled('#view')).to.be.equal(true);
  } else {
    expect(await helper.ifElementDisplayedAfterTime(`.//div[contains(text(),\'${this.resourceData.accountNumber}\')]`)).to.be.equal(true);
    await helper.click(selectors.searchGrid.actionsBtn);
    expect(await helper.ifElementEnabled('#view')).to.be.equal(true);
  }
  logger.info(`Account ${this.resourceData.hostSystem} verified on Pending Approval screen`);
});


Then(/^Verify the Auth Panel Screen with$/, async function (validation) {
  const expected = validation.hashes();
  let validations;

  for (const act1 of expected) {
    await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
    await helper.waitForDisplayed(MenuBar.selectors.onboarding);
    await helper.click(MenuBar.selectors.onboarding);
    await helper.waitForDisplayed(MenuBar.selectors.authPanel);
    await helper.click(MenuBar.selectors.authPanel);
    await helper.waitForDisplayed(selectors.searchGrid.customerId);
    await helper.inputText(selectors.searchGrid.customerId, this.Customer.customerId);
    await helper.waitForDisplayed(selectors.AuthPanel.authPanel_Name);
    await helper.inputText(selectors.AuthPanel.authPanel_Name, this.authPanel.authPanelName);
    await helper.waitForDisplayed(selectors.searchGrid.searchBtn);
    await helper.click(selectors.searchGrid.searchBtn);
    await createResource.selectCustomerFromGrid();
    await helper.waitForDisplayed(selectors.searchGrid.gridFirstElement);
    await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
    await helper.pause(2);
    await helper.waitForDisplayed('//div[@id=\'resourceId_0ResourceGrid\']', 15000);
    await helper.scrollToElement('//div[@id=\'resourceId_0ResourceGrid\']');
    if (act1.acctSysCode !== undefined) {
      logger.info(act1.acctSysCode);
      expect(await helper.ifElementDisplayed(`//div[contains(text(),\'${act1.acctSysCode}\')]`)).to.be.equal(true);
    }
    if (act1.bsbCode !== undefined) {
      validations = {
        AccountNumber: `//div[contains(text(),\'${act1.bsbCode}-${act1.acctNumber}\')]`,
      };
      logger.info(validations.AccountNumber);

      expect(await helper.ifElementDisplayed(validations.AccountNumber)).to.be.equal(true);
    }
  }
});
