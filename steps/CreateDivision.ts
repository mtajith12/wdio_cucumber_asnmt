import { Then } from 'cucumber';
import { CreateDivision } from 'src/CreateDivisionPage';
import { helper } from 'src/Helper';
import { cobracustomer } from 'src/CreateCustomerPage';
import { getLogger } from 'log4js';
import { MenuBar } from 'src/MenuBarPage';
import { expect } from 'chai';
import { selectors } from 'src/Selectors';
import { DBConnection } from 'src/DBConnection';
import * as jp from 'jsonpath';
import { users } from 'src/Users';
import _ = require('lodash');
const logger = getLogger();

Then(/^create "([^"]*)" division$/, async function (data) {
  await CreateDivision.createDefaultDivision(data, this.Customer);
});
Then(/^create division with "([^"]*)" with "([^"]*)", "([^"]*)" DEuserId & DDcode and Authorisation Model Settings with "([^"]*)" model with "([^"]*)" FX settings$/, async function (data, fileFormats, deUserIds, authorisationModelSettings, fxSettings) {
  const productArray = data.split(',');
  const d = deUserIds.split(',');
  this.deUserId = d[0];
  this.queryDivision = `select * from CA_OWNER.DIVISION WHERE ORGANISATION_BIZ_ID='${this.Customer.customerId}'`;
  const DivisionData = {
    customerId: this.Customer.customerId,
    customername: this.Customer.customerName,
    products: data.length > 0 ? productArray : ['Cash Management', 'Commercial Cards', 'Customer Administration'],
    jurisdiction: this.Customer.jurisdiction,
    fileFormat: productArray.includes('Cash Management') && fileFormats.length > 0 ? 'GCPFIXPAY (Fixed length payment file)' : undefined,
    deUserId: productArray.includes('Cash Management') && deUserIds.length > 0 ? deUserIds : undefined,
    authorisationModel: productArray.includes('Cash Management') && authorisationModelSettings.length > 0 ? authorisationModelSettings : undefined,
    fxSettingCountry: productArray.includes('Cash Management') && fxSettings.length > 0 ? fxSettings : undefined,
    productSettings: {
      cashManagementProductSettings: productArray.includes('Cash Management') ? {
        payments: {
          domestic: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)', 'NZ Domestic (Direct Credit)', 'NZ Domestic (SCP)'] : ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)'],
          otherPayments: ['AU BPAY', 'Multibank Payments', 'International Payments', 'Transfers'],
          historical: ['ANZ Transactive - AU & NZ: Payments'],
        },
        balanceNTransactionReporting: ['Reporting - Accounts', 'Reporting - Term Deposits'],
        receivables: {
          directDebit: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Debit)', 'NZ Domestic (Direct Debit)'] : ['AU Domestic (Direct Debit)'],
          OtherReceivables: ['PayID Management'],

        },
        serviceRequest: {
          Fulfilment: ['Fulfilment'],
          Services: ['Services', 'Open Acccount (Paper)', 'Amend Billing Details', 'Manage Bank Feeds', 'Backdate Transaction', 'Manage BPAY', 'Manage Bureau', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Add Loan Deal', 'Amend Channel Details', 'Channel User Maintenance', 'Order Cheque Books', 'Close Account', 'Close Channel', 'Order Deposit Books', 'Manage Direct Debits (Payments)', 'Reverse Duplicate Payment (DE)', 'Fix Encoding Error', 'General Enquiries', 'Amend Group Mandate', 'Amend Legal Entity', 'Manage Liquidity Mgmt Product', 'Missing Deposit', 'Manage Periodical Payments', 'Recall Payment', 'Return Fund', 'Manage Authorised Person', 'Amend Statement Address', 'Stop Cheques', 'Trace Transaction', 'Upload Documents'],
        },
        otherSettings: ['Approval Required for Payee List Items (Payments)', 'Approval Required for Templates', 'Disable Beneficiary Bank changes for Payments created from Templates', 'Disable Beneficiary Bank changes for Payments created from File Imports', 'Allow Masking of Payroll Confidential Fields', 'Approval Required for Payer List Items (Direct Debits)', 'Allow Intermediary Bank Usage for International Payments'],

        // customerProductLimits: 'Customer Override',
      } : undefined,
      commercialCardsProductSettings: productArray.includes('Commercial Cards') ? ['CC_Reporting and Self-Service', 'CC_Administration'] : undefined,
      ClearingServicesProductSettings: productArray.includes('Clearing Services') ? ['Clearing Services'] : undefined,
      loans: productArray.includes('Loans') ? ['Loans Reporting'] : undefined,
      customerProductSettings: productArray.includes('Customer Administration') ? ['Administration', 'Division Management', 'User Management', 'Role Management', 'Resource Management', 'Resource Group Management', 'Panel Management', 'Confidential Data Group Management'] : undefined,
      FXOverlay: productArray.includes('FX Overlay') ? ['FX Overlay'] : undefined,
      FXServices: productArray.includes('FX Services') ? ['Contract Management'] : undefined,
      InstitutionalInsightsProductSettings: productArray.includes('Institutional Insights') ? {
        TransactionBankingInsights: ['Balance', 'Engagement', 'Fees & Charges', 'Service Levels', 'Transactions'],
        RetailAnalytics: ['Competitor Analysis', 'Customer Analysis', 'Hot Spot Analysis', 'Journey Analysis', 'Payment Mix Analysis'],
        EconomicInsights: ['Economic Pulse', 'Housing Analysis'],
        SupplyChainFinance: ['Payable Modeller', 'Supplier Explorer'],
      } : undefined,
      PilotProducts: productArray.includes('Pilot Products') ? ['Pilot - Report Centre', 'Pilot - Periodical Direct Debit', 'Pilot - Trade Finance', 'Pilot - Pacific Payments'] : undefined,
      OmniDemoApp: productArray.includes('Omni Demo App') ? ['Omni Demo App'] : undefined,
    },
  };
  this.DivisionName = `${this.Customer.customerName} (${this.Customer.customerId}-1)`;
  this.Division1 = JSON.parse(JSON.stringify(DivisionData));
  await CreateDivision.createdivision(JSON.parse(JSON.stringify(DivisionData)));
});

Then(/^create division with "([^"]*)" and "([^"]*)" with "([^"]*)", "([^"]*)" DEuserId & DDcode and Authorisation Model Settings with "([^"]*)" model with "([^"]*)" FX settings$/, async function (data, products, fileFormats, deUserIds, authorisationModelSettings, fxSettings) {
  const productFamilArray = data.split(',');
  const d = deUserIds.split(',');
  const productArray = products.split(',');
  this.deUserId = d[0];
  this.queryDivision = `select * from CA_OWNER.DIVISION WHERE ORGANISATION_BIZ_ID='${this.Customer.customerId}'`;
  const DivisionData = {
    customerId: this.Customer.customerId,
    customername: this.Customer.customerName,
    divisionName: `${this.Customer.customerId}-1`,
    products: data.length > 0 ? productFamilArray : ['Cash Management', 'Commercial Cards', 'Customer Administration'],
    jurisdiction: this.Customer.jurisdiction,
    fileFormat: productFamilArray.includes('Cash Management') && fileFormats.length > 0 ? 'GCPFIXPAY (Fixed length payment file)' : undefined,
    deUserId: productFamilArray.includes('Cash Management') && deUserIds.length > 0 ? deUserIds : undefined,
    authorisationModel: productFamilArray.includes('Cash Management') && authorisationModelSettings.length > 0 ? authorisationModelSettings : undefined,
    fxSettingCountry: productFamilArray.includes('Cash Management') && fxSettings.length > 0 ? fxSettings : undefined,
    productSettings: {
      cashManagementProductSettings: productFamilArray.includes('Cash Management') ? {
        payments: {
          domestic: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)', 'NZ Domestic (Direct Credit)', 'NZ Domestic (SCP)'] : ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)'],
          otherPayments: ['AU BPAY', 'Multibank Payments', 'International Payments', 'Transfers'],
          historical: ['ANZ Transactive - AU & NZ: Payments'],
        },
        balanceNTransactionReporting: ['Reporting - Accounts', 'Reporting - Term Deposits'],
        receivables: {
          directDebit: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Debit)', 'NZ Domestic (Direct Debit)'] : ['AU Domestic (Direct Debit)'],
          OtherReceivables: ['PayID Management'],

        },
        serviceRequest: {
          Fulfilment: ['Fulfilment'],
          Services: ['Services', 'Open Acccount (Paper)', 'Amend Billing Details', 'Manage Bank Feeds', 'Backdate Transaction', 'Manage BPAY', 'Manage Bureau', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Add Loan Deal', 'Amend Channel Details', 'Channel User Maintenance', 'Order Cheque Books', 'Close Account', 'Close Channel', 'Order Deposit Books', 'Manage Direct Debits (Payments)', 'Reverse Duplicate Payment (DE)', 'Fix Encoding Error', 'General Enquiries', 'Amend Group Mandate', 'Amend Legal Entity', 'Manage Liquidity Mgmt Product', 'Missing Deposit', 'Manage Periodical Payments', 'Recall Payment', 'Return Fund', 'Manage Authorised Person', 'Amend Statement Address', 'Stop Cheques', 'Trace Transaction', 'Upload Documents'],
        },
        otherSettings: ['Approval Required for Payee List Items (Payments)', 'Approval Required for Templates', 'Disable Beneficiary Bank changes for Payments created from Templates', 'Disable Beneficiary Bank changes for Payments created from File Imports', 'Allow Masking of Payroll Confidential Fields', 'Approval Required for Payer List Items (Direct Debits)', 'Allow Intermediary Bank Usage for International Payments'],

        // customerProductLimits: 'Customer Override',
      } : undefined,
      commercialCardsProductSettings: productFamilArray.includes('Commercial Cards') ? productArray : undefined,
      ClearingServicesProductSettings: productFamilArray.includes('Clearing Services') ? productArray : undefined,
      loans: productFamilArray.includes('Loans') ? productArray : undefined,
      customerProductSettings: productFamilArray.includes('Customer Administration') ? productArray : undefined,
      FXOverlay: productFamilArray.includes('FX Overlay') ? productArray : undefined,
      FXServices: productFamilArray.includes('FX Services') ? productArray : undefined,
      InstitutionalInsightsProductSettings: productFamilArray.includes('Institutional Insights') ? {
        TransactionBankingInsights: ['Balance', 'Engagement', 'Fees & Charges', 'Service Levels', 'Transactions'],
        RetailAnalytics: ['Competitor Analysis', 'Customer Analysis', 'Hot Spot Analysis', 'Journey Analysis'],
        EconomicInsights: ['Economic Pulse', 'Housing Analysis'],
        SupplyChainFinance: ['Payable Modeller', 'Supplier Explorer'],
      } : undefined,
      PilotProducts: productFamilArray.includes('Pilot Products') ? productArray : undefined,
      OmniDemoApp: productFamilArray.includes('Omni Demo App') ? productArray : undefined,
    },
  };
  this.DivisionName = `${this.Customer.customerName} (${this.Customer.customerId}-1)`;
  this.Division1 = JSON.parse(JSON.stringify(DivisionData));
  this.divisionapi = {
    divisionId: `${this.Customer.customerId}-1`,
  };
  this.Customer = _.merge({}, this.Customer, {
    divisions: this.divisionapi,
  });
  console.log(JSON.stringify(this.Customer));
  await CreateDivision.createdivision1(JSON.parse(JSON.stringify(DivisionData)));
});
Then(/^create child division with "([^"]*)" with "([^"]*)", "([^"]*)" DEuserId & DDcode and Authorisation Model Settings with "([^"]*)" model with "([^"]*)" FX settings$/, async function (data, fileFormats, deUserIds, authorisationModelSettings, fxSettings) {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 15000);
  // await helper.pause(2)
  const productArray = data.split(',');
  this.queryDivision = `select * from CA_OWNER.DIVISION WHERE DIVISION_BIZ_ID='${this.Customer.customerId}-2'`;
  const DivisionData = {

    customerId: this.Customer.customerId,
    products: data.length > 0 ? productArray : ['Cash Management', 'Commercial Cards', 'Customer Administration'],
    jurisdiction: this.Customer.jurisdiction,
    fileFormat: productArray.includes('Cash Management') && fileFormats.length > 0 ? 'GCPFIXPAY (Fixed length payment file)' : undefined,
    deUserId: productArray.includes('Cash Management') && deUserIds.length > 0 ? deUserIds : undefined,
    authorisationModel: productArray.includes('Cash Management') && authorisationModelSettings.length > 0 ? authorisationModelSettings : undefined,
    fxSettingCountry: productArray.includes('Cash Management') && fxSettings.length > 0 ? fxSettings : undefined,
    productSettings: {
      cashManagementProductSettings: productArray.includes('Cash Management') ? {
        payments: {
          domestic: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)', 'NZ Domestic (Direct Credit)', 'NZ Domestic (SCP)'] : ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'CN Domestic (BEPS & HVPS)'],
          otherPayments: ['AU BPAY', 'Multibank Payments', 'International Payments', 'Transfers'],
          historical: ['ANZ Transactive - AU & NZ: Payments'],
        },
        balanceNTransactionReporting: ['Reporting - Accounts', 'Reporting - Term Deposits'],
        receivables: {
          directDebit: this.Customer.jurisdiction.includes('New Zealand') ? ['AU Domestic (Direct Debit)', 'NZ Domestic (Direct Debit)'] : ['AU Domestic (Direct Debit)'],
          OtherReceivables: ['PayID Management'],

        },
        serviceRequest: {
          Fulfilment: ['Fulfilment'],
          Services: ['Services', 'Order Deposit Books', 'Amend Billing Details', 'Amend Channel Details', 'Amend Group Mandate', 'Amend Legal Entity', 'Amend Statement Address', 'Backdate Transaction', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Channel User Maintenance', 'Close Account', 'Close Channel', 'Fix Encoding Error', 'General Enquiries', 'Add Loan Deal', 'Manage Authorised Person', 'Manage BPAY', 'Manage Bureau', 'Manage Direct Debits (Payments)', 'Manage Liquidity Mgmt Product', 'Manage Periodical Payments', 'Missing Deposit', 'Open Acccount (Paper)', 'Order Cheque Books', 'Recall Payment', 'Return Fund', 'Reverse Duplicate Payment (DE)', 'Stop Cheques', 'Trace Transaction'],
        },
        otherSettings: ['Approval Required for Payee List Items (Payments)', 'Approval Required for Templates', 'Disable Beneficiary Bank changes for Payments created from Templates', 'Disable Beneficiary Bank changes for Payments created from File Imports', 'Allow Masking of Payroll Confidential Fields', 'Approval Required for Payer List Items (Direct Debits)', 'Allow Intermediary Bank Usage for International Payments'],


        // customerProductLimits: 'Customer Override',
      } : undefined,
      commercialCardsProductSettings: productArray.includes('Commercial Cards') ? ['CC_Reporting and Self-Service', 'CC_Administration'] : undefined,
      ClearingServicesProductSettings: productArray.includes('Clearing Services') ? ['Clearing Services'] : undefined,
      loans: productArray.includes('Loans') ? ['Loans Reporting'] : undefined,
      customerProductSettings: productArray.includes('Customer Administration') ? ['Administration', 'Division Management', 'User Management', 'Role Management', 'Resource Management', 'Resource Group Management', 'Panel Management', 'Confidential Data Group Management'] : undefined,
      FXOverlay: productArray.includes('FX Overlay') ? ['FX Overlay'] : undefined,
      FXServices: productArray.includes('FX Services') ? ['Contract Management'] : undefined,
      InstitutionalInsightsProductSettings: productArray.includes('Institutional Insights') ? {
        TransactionBankingInsights: ['Balance', 'Engagement', 'Fees & Charges', 'Service Levels', 'Transactions'],
        RetailAnalytics: ['Competitor Analysis', 'Customer Analysis', 'Hot Spot Analysis', 'Journey Analysis', 'Payment Mix Analysis'],
        EconomicInsights: ['Economic Pulse', 'Housing Analysis'],
      } : undefined,
      PilotProducts: productArray.includes('Pilot Products') ? ['Pilot - Report Centre', 'Pilot - Periodical Direct Debit', 'Pilot - Trade Finance', 'Pilot - Pacific Payments'] : undefined,
      OmniDemoApp: productArray.includes('Omni Demo App') ? ['Omni Demo App'] : undefined,
    },
  };
  this.DivisionName = `${this.Customer.customerName} (${this.Customer.customerId}-1)`;

  await CreateDivision.createParentDivision(JSON.parse(JSON.stringify(DivisionData)));
});
Then(/^Validate the "([^"]*)" message for division$/, async function (status) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

    logger.info(message1);
    expect(message1).to.be.oneOf([`This will submit Division: ${this.DivisionName} to be modified.`, '']);
    //

    await cobracustomer.approvecustomerFromGrid();
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf([`Division: ${this.DivisionName} is now pending approval to be modified.`, '']);

    // Validate on the UI
  } else if (status === 'deregister') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
  }
  await helper.screenshot(`Validate -${status}`);
});
Then(/^Search the division in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Division: ${this.DivisionName}.`,
      notificationMessage: `Changes to Division: ${this.DivisionName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
    };
    await CreateDivision.searchUsersNValidateWorkFlow(this.Customer, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'View') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionView = {
      action: selectors.searchGrid.gridElementRightClick.viewBtn,
    };
    await CreateDivision.searchUsersNView(this.Customer, 'View', actionView);
  } else if (action === 'Verify' && userAction === 'disable') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Division ${this.DivisionName} to be disabled`,
      notificationMessage: `Division ${this.DivisionName} has been disabled.`,
      action: selectors.searchGrid.gridElementRightClick.disableBtn,
    };
    await CreateDivision.searchUsersNValidateWorkFlow(this.Customer, 'Disabled', actionDeregister);
  } else if (action === 'Verify' && userAction === 'enable') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Division ${this.DivisionName} to be enabled`,
      notificationMessage: `Division ${this.DivisionName} has been enabled.`,
      action: selectors.searchGrid.gridElementRightClick.enableBtn,
    };
    await CreateDivision.searchUsersNValidateWorkFlow(this.Customer, 'Enabled', actionDeregister);
  }
  await helper.screenshot(`Approve -${action}`);
});
Then(/^BankUser edits the division with "([^"]*)"$/, async function (product) {
  await CreateDivision.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await cobracustomer.editProductFamily(product);
  // await helper.pause(3);
});
Then(/^BankUser edits the parent division$/, async function () {
  await CreateDivision.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridSecondElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await CreateDivision.selectParentDivision(0);
  await helper.click(selectors.Customers.submit);
  await helper.waitForDisplayed(selectors.Division.confirmationBtn, 10000);
  await helper.click(selectors.Division.confirmationBtn);
});
Then(/^Search the parent division in searchscreen and "([^"]*)" "([^"]*)" workflow and validate against CA$/, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Division: ${this.DivisionName}.`,
      notificationMessage: `Changes to Division: ${this.DivisionName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      flag: true,
      db: {
        QUERY: this.queryDivision,
        version: '2',
      },
    };
    await CreateDivision.searchUsersNValidateWorkFlowParentDivision(this.Customer, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'disable') {
    await CreateDivision.searchUsers(this.Customer);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Division ${this.DivisionName} to be disabled`,
      notificationMessage: `Division ${this.DivisionName} has been disabled.`,
      action: selectors.searchGrid.gridElementRightClick.disableBtn,
      flag: true,
      db: {
        QUERY: this.queryDivision,
        version: '3',
      },
    };
    await CreateDivision.searchUsersNValidateWorkFlowParentDivision(this.Customer, 'Disabled', actionDeregister);
  } else if (action === 'Verify' && userAction === 'enable') {
    await CreateDivision.searchUsers(this.Customer);
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Division ${this.DivisionName} to be enabled`,
      notificationMessage: `Division ${this.DivisionName} has been enabled.`,
      action: selectors.searchGrid.gridElementRightClick.enableBtn,
      flag: true,
      db: {
        QUERY: this.queryDivision,
        version: '4',
      },
    };
    await CreateDivision.searchUsersNValidateWorkFlowParentDivision(this.Customer, 'Enabled', actionDeregister);
  }
  await helper.screenshot(`Approve -${action}`);
});
Then(/^validate the elements present in the Division screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.division, 10000);
  await helper.click(MenuBar.selectors.division);
  await helper.waitForDisplayed(selectors.Users.customerId);

  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.divisionId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.divisionName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.jurisdiction)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.workflow)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.status)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusNew)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusEnabled)).to.equal(true);
  await helper.screenshot('validate screen- Division');
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for the Division$/, async function (action) {
  await CreateDivision.searchUsers(this.Customer);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Division: ${this.DivisionName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryCustomer);
          const jsoncaowner = await caowner;
          //  Getting Existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in DB');
        }
        await helper.click(selectors.Division.closePreview);
      });
    }
    if (action === 'delete') {
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      // expect(registerUserNotificationMessage).to.be.oneOf([`Deletion of Division ${this.DivisionName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          const caowner = await DBConnection.run(this.queryCustomer);
          const jsoncaowner = await caowner;
          //  Getting Existing DB Values
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          logger.info('Executing DB verification');
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in DB');
        }
        await helper.click(selectors.Division.closePreview);
      });
    }
    await helper.screenshot(`Reject Division ${action}`);
  });
});

Then(/^Obtain the details of De User ID$/, async function () {
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.division);
  await helper.click(MenuBar.selectors.division);
  await CreateDivision.searchUsers(this.Customer);
  await cobracustomer.selectCustomerFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.productsTab);
  await helper.scrollToElement('//div[contains(text(),\'DE User ID\')]');
  await helper.getElementTextIfPresent(`//div[contains(text(),\'${this.deUserId}\')]`);
  const deuserId = this.deUserId;
  const shortName = await helper.getElementTextIfPresent(`//div[contains(text(),\'${this.deUserId}\')]/following-sibling::div[1]`);
  const fullName = await helper.getElementTextIfPresent(`//div[contains(text(),\'${this.deUserId}\')]/following-sibling::div[2]`);
  const transactionCodeSet = await helper.getElementTextIfPresent(`//div[contains(text(),\'${this.deUserId}\')]/following-sibling::div[3]`);
  const deType = await helper.getElementTextIfPresent(`//div[contains(text(),\'${this.deUserId}\')]/following-sibling::div[4]`);
  this.deuseriddetails = {
    deuserId, shortName, fullName, transactionCodeSet, deType,
  };
  logger.info(this.deuseriddetails);
});

Then(/^BankUser validated the Audit Scenarios for Division$/, async function (details) {
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
  await helper.waitForDisplayed(MenuBar.selectors.division);
  await helper.click(MenuBar.selectors.division);
  await CreateDivision.searchUsers(this.Customer);
  await cobracustomer.selectCustomerFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.pause(2);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'division-audit-grid\']', 1500);

  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      await helper.doubleClick(auditvalidations[i].description);
      await CreateDivision.auditValidation(await x, this.Division1);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Division-Approved');
      logger.info('Validated Audit-Approved Division');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
});
Then(/^BankUser edits the division by removing entitilement "([^"]*)"$/, async function (Feature) {
  await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 15000);
  await CreateDivision.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  const FeatureArray = Feature.split(',');
  await cobracustomer.editProductFeature(FeatureArray);
  // await helper.pause(3);
});
