import { helper } from 'src/Helper';
import { cobracustomer } from 'src/CreateCustomerPage';
import * as faker from 'faker';
import { expect } from 'chai';
import { getLogger } from 'log4js';
import { selectors } from 'src/Selectors';
import { MenuBar } from 'src/MenuBarPage';
import { DBConnection } from 'src/DBConnection';
import * as jp from 'jsonpath';
import { users } from 'src/Users';
import { createResource } from 'src/CreateResources';
import { CreateLoanDealResource } from 'src/CreateResourceLoanDealEntity';
import { CreateBillingEntityResource } from 'src/CreateResourceBillingEntity';
import { CreateFxOrganisationResource } from 'src/CreateResourceFxOrganisation';
import { CreateLegalEntityResource } from 'src/CreateResourceLegalentity';
import { createResourceGroup } from 'src/CreateResourceGroup';
const logger = getLogger();

const { Then, When } = require('cucumber');


Then(/^selects "([^"]*)" as basecurrency$/, async (basecurrency) => {
  await cobracustomer.selectBaseCurrency(basecurrency);
});

Then(/^click on continue and select the products$/, async function () {
  await cobracustomer.continue();
  await cobracustomer.selectingProductSettings(this.Customer.productSettings);
});

Then(/^Register the user$/, async () => {
  await cobracustomer.confirm();
});

Then(/^Bankuser onboards new Customer with "([^"]*)" the necessary information and selects the "([^"]*)" products and "([^"]*)" jurisdiction$/, async function (adminModel, products, jurisdiction) {
  const productArray = products.split(',');
  const jurisdictionArray = jurisdiction.split(',');
  let customerData;
  if (jurisdictionArray.includes('Australia') || jurisdictionArray.includes('New Zealand') || jurisdictionArray.includes('China') || jurisdictionArray.includes('Hong Kong') || jurisdictionArray.includes('Singapore')) {
    customerData = {
      customerName: faker.name.findName(),
      customerId: faker.random.alphaNumeric(7),
      adminModel,
      products: products.length > 0 ? productArray : ['Cash Management', 'Commercial Cards', 'Customer Administration', 'FX Services', 'FX Overlay'],
      jurisdiction: jurisdiction.length > 0 ? jurisdictionArray : ['Australia', 'China', 'Hong Kong', 'Singapore', 'New Zealand'],
      productSettings: {
        cashManagementProductSettings: productArray.includes('Cash Management') ? {
          payments: {
            domestic: jurisdictionArray.includes('New Zealand') ? ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', 'NZ Domestic (Direct Credit)', 'NZ Domestic (SCP)', jurisdictionArray.includes('China') ? 'CN Domestic (BEPS & HVPS)' : ''] : ['AU Domestic (Direct Credit)', 'AU Domestic (Osko)', 'AU Domestic (RTGS)', jurisdictionArray.includes('China') ? 'CN Domestic (BEPS & HVPS)' : ''],
            otherPayments: ['AU BPAY', 'Multibank Payments', 'International Payments', 'Transfers'],
            historical: ['ANZ Transactive - AU & NZ: Payments'],
          },
          balanceNTransactionReporting: ['Reporting - Accounts', 'Reporting - Term Deposits'],
          receivables: {
            directDebit: jurisdictionArray.includes('New Zealand') ? ['AU Domestic (Direct Debit)', 'NZ Domestic (Direct Debit)'] : ['AU Domestic (Direct Debit)'],
            OtherReceivables: ['PayID Management'],
          },
          serviceRequest: {
            Fulfilment: ['Fulfilment'],
            Services: ['Services', 'Open Acccount (Paper)', 'Amend Billing Details', 'Manage Bank Feeds', 'Backdate Transaction', 'Manage BPAY', 'Manage Bureau', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Add Loan Deal', 'Amend Channel Details', 'Channel User Maintenance', 'Order Cheque Books', 'Close Account', 'Close Channel', 'Order Deposit Books', 'Manage Direct Debits (Payments)', 'Reverse Duplicate Payment (DE)', 'Fix Encoding Error', 'General Enquiries', 'Amend Group Mandate', 'Amend Legal Entity', 'Manage Liquidity Mgmt Product', 'Missing Deposit', 'Manage Periodical Payments', 'Recall Payment', 'Return Fund', 'Manage Authorised Person', 'Amend Statement Address', 'Stop Cheques', 'Trace Transaction', 'Upload Documents'],
          },

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
  } else {
    customerData = {
      customerName: faker.name.findName(),
      customerId: faker.random.alphaNumeric(7),
      adminModel,
      products: products.length > 0 ? productArray : ['Cash Management', 'Commercial Cards'],
      jurisdiction: jurisdiction.length > 0 ? jurisdictionArray : ['India', 'Vietnam', 'Fiji'],
      productSettings: {
        cashManagementProductSettings: productArray.includes('Cash Management') ? {
          balanceNTransactionReporting: ['Reporting - Accounts'],
          // customerProductLimits: 'Customer Override',
        } : undefined,
        customerProductSettings: productArray.includes('Customer Administration') ? ['Administration', 'Division Management', 'User Management', 'Role Management', 'Resource Management', 'Resource Group Management', 'Panel Management', 'Confidential Data Group Management'] : undefined,
      },
    };
  }
  this.queryCustomer = `select * from CA_OWNER.ORGANISATION WHERE ORGANISATION_BIZ_ID='${customerData.customerId}'`;

  this.CustomerName = `${customerData.customerName} (${customerData.customerId})`;
  this.Customer = JSON.parse(JSON.stringify(customerData));

  this.Customer1 = (customerData);
  this.Customer2 = (JSON.stringify(customerData));

  logger.info(JSON.stringify(customerData));
  await helper.waitForElementToAppear('#onBoardCustomer', 10000);
  await helper.click('#onBoardCustomer');
  const customerID = await cobracustomer.createCustomer(customerData);
  await cobracustomer.selectData(customerData);
  await cobracustomer.selectJurisdiction(customerData);
  this.data = {
    customerId: `${await customerID.customerId}`,
  };
  logger.info(this.data);
});

Then(/^Bankuser onboards new Customer with "([^"]*)" admin model and selects "([^"]*)" product family, "([^"]*)" products and "([^"]*)" jurisdictions$/, async function (adminModel, productfamily, products, jurisdiction) {
  const productFamilyArray = productfamily.split(',');
  const productArray = products.split(',');
  const jurisdictionArray = jurisdiction.split(',');
  const customerData = {
    customerName: faker.name.findName(),
    customerId: faker.random.alphaNumeric(7),
    adminModel,
    // productfamily,
    products,
    basecurrency: 'AUD',
    // jurisdiction,
    productfamily: productfamily.length > 0 ? productFamilyArray : undefined,
    jurisdiction: jurisdiction.length > 0 ? jurisdictionArray : undefined,
    productSettings: {
      cashManagementProductSettings: productfamily.includes('Cash Management') ? {
        balanceNTransactionReporting: ['Reporting - Accounts'],
        customerProductLimits: 'Customer Override',
      } : undefined,
      commercialCardsProductSettings: productfamily.includes('Commercial Cards') ? productArray : undefined,
      // commercialCardsProductSettings: productfamily.includes('Commercial Cards') ? ['CC_Reporting and Self-Service', 'CC_Administration'] : undefined,
      // customerProductSettings: productfamily.includes('Customer Administration') ? ['Administration', 'Division Management', 'User Management', 'Role Management', 'Resource Management', 'Resource Group Management', 'Panel Management', 'Confidential Data Group Management'] : undefined,
      customerProductSettings: productfamily.includes('Customer Administration') ? productArray : undefined,
      PilotProducts: productfamily.includes('Pilot Products') ? productArray : undefined,
    },
  };

  this.queryCustomer = `select * from CA_OWNER.ORGANISATION WHERE ORGANISATION_BIZ_ID='${customerData.customerId}'`;
  this.CustomerName = `${customerData.customerName} (${customerData.customerId})`;
  this.Customer = JSON.parse(JSON.stringify(customerData));

  logger.info(JSON.stringify(jurisdictionArray));
  logger.info(JSON.stringify(productArray));
  logger.info(JSON.stringify(customerData));
  const customerID = await cobracustomer.createCustomer1(customerData);
  await cobracustomer.selectProdctFamily(customerData);
  await cobracustomer.selectJurisdiction(customerData);
  this.data = {
    customerId: `${await customerID.customerId}`,
  };
  await cobracustomer.selectBaseCurrency(customerData.basecurrency);
  await cobracustomer.continue();
  await cobracustomer.selectingProductSettings(this.Customer.productSettings);
  logger.info(this.data);
  await cobracustomer.confirm();

});

Then(/^Delete the customer and check the error message$/, async function () {
  await cobracustomer.searchUsers(this.data);
  const actionDelete = {
    message: `This will submit Customer: ${this.CustomerName} to be deleted.`,
    errornotificationMessage: 'Customer cannot be deleted as it is associated to one or more Auth Panels.',
    action: selectors.searchGrid.gridElementRightClick.deregisterBtn,
  };
  await helper.waitForDisplayed(selectors.searchGrid.gridFirstElement);
  await helper.click(selectors.searchGrid.gridFirstElement);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, actionDelete.action).then(async () => {
    const message = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);
    logger.info(message);
    expect(message).to.be.oneOf([actionDelete.message, '']);
    await cobracustomer.approvecustomerFromGrid();
  });
  const errorNotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.errormessage3);
  logger.info(errorNotificationMessage);
  expect(errorNotificationMessage).to.be.oneOf([actionDelete.errornotificationMessage, '']);
});

Then(/^Search the customer in searchscreen and "([^"]*)" "([^"]*)" workflow$/, async function (action, userAction) {
  if (action === 'Approve' && userAction === 'modify') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 1000);
    const actionPendingApproveModified = {
      message: `Approve changes to Customer: ${this.CustomerName}.`,
      notificationMessage: `Changes to Customer: ${this.CustomerName} have been approved.`,
      action: selectors.searchGrid.gridElementRightClick.approveBtn,
      flag: true,
      db: {
        QUERY: this.queryCustomer,
        version: '2',
      },
    };
    await cobracustomer.searchUsersNValidateWorkFlow(this.Customer, 'Approved', actionPendingApproveModified);
  } else if (action === 'Verify' && userAction === 'disable') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Customer ${this.CustomerName} to be disabled`,
      notificationMessage: `Customer ${this.CustomerName} has been disabled.`,
      action: selectors.searchGrid.gridElementRightClick.disableBtn,
      flag: true,
      db: {
        QUERY: this.queryCustomer,
        version: '3',
      },
    };
    await cobracustomer.searchUsersNValidateWorkFlow(this.Customer, 'View', actionDeregister);
  } else if (action === 'Verify' && userAction === 'View') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionView = {
      action: selectors.searchGrid.gridElementRightClick.viewBtn,
    };
    await cobracustomer.searchUsersNView(this.Customer, 'View', actionView);
  } else if (action === 'Verify' && userAction === 'enable') {
    await helper.waitForElementToDisAppear(selectors.searchGrid.approvalPopUp.NotificationMessage, 10000);
    const actionDeregister = {
      message: `This will submit Customer ${this.CustomerName} to be enabled`,
      notificationMessage: `Customer ${this.CustomerName} has been enabled.`,
      action: selectors.searchGrid.gridElementRightClick.enableBtn,
      flag: true,
      db: {
        QUERY: this.queryCustomer,
        version: '4',
      },
    };
    await cobracustomer.searchUsersNValidateWorkFlow(this.Customer, 'Enabled', actionDeregister);
  }
  await helper.screenshot(`Approve -${action}`);
});
Then(/^validate against CA for "([^"]*)" "([^"]*)" "([^"]*)" workflow$/, { wrapperOptions: { retry: 20 } }, async function (resource1, action, userAction) {
  if (action === 'Approve' && userAction === 'modify') {
    const actionPendingApproveModified = {
      flag: true,
      db: {
        QUERY: resource1 === 'Customer' ? this.queryCustomer : this.queryDivision,
        version: '2',
      },
    };
    if (resource1 === 'Customer' || resource1 === 'Division') { await cobracustomer.db(actionPendingApproveModified); }
  } else if (action === 'Verify' && userAction === 'disable') {
    const actionDeregister = {

      flag: true,
      db: {
        QUERY: resource1 === 'Customer' ? this.queryCustomer : this.queryDivision,
        version: '3',
      },
    };
    if (resource1 === 'Customer' || resource1 === 'Division') { await cobracustomer.db(actionDeregister); }
  } else if (action === 'Verify' && userAction === 'enable') {
    const actionDeregister = {

      flag: true,
      db: {
        QUERY: resource1 === 'Customer' ? this.queryCustomer : this.queryDivision,
        version: '4',
      },
    };
    if (resource1 === 'Customer' || resource1 === 'Division') { await cobracustomer.db(actionDeregister); }
  }
  await helper.screenshot(`Approve -${action}`);
});
Then(/^Validate the "([^"]*)" message for customer$/, async function (status) {
  if (status === 'register') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf(['Request Submitted Successfully.', '']);
  } else if (status === 'modify') {
    const message1 = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.message1);

    logger.info(message1);
    expect(message1).to.be.oneOf([`This will submit Customer: ${this.CustomerName} to be modified.`, '']);
    //

    await cobracustomer.approvecustomerFromGrid();
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
    expect(NotificationMessage).to.be.oneOf([`Customer: ${this.CustomerName} is now pending approval to be modified.`, '']);

    // Validate on the UI
  } else if (status === 'deregister') {
    const NotificationMessage = await helper.getElementTextIfPresent(selectors.searchGrid.approvalPopUp.NotificationMessage);

    logger.info(NotificationMessage);
  }
  await helper.screenshot(`Validate -${status}`);
});
Then(/^BankUser edits the customer with "([^"]*)" and "([^"]*)" jurisdiction$/, async function (product, jurisdiction) {
  logger.info(this.Customer);
  await cobracustomer.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await helper.scrollToElement(selectors.Customers.jurisdiction.btrJurisdictsion);
  await cobracustomer.selectJurisdictionOnText([jurisdiction]);
  // await browser.debug();
  // console.log('Jurisdiction is', +jurisdiction);
  // await helper.scrollToElement(selectors.Customers.productSettings.labelNames);
  await cobracustomer.editProductFamily(product);
  // await helper.pause(2);
});
Then(/^BankUser edits the customer with Retail Customer option as "([^"]*)"$/, async function (radiobutton) {
  logger.info(this.Customer);
  await cobracustomer.searchUsers(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
  await helper.scrollToElement(selectors.Customers.RetailCustomer.yes);
  await cobracustomer.editRetailCustomer(radiobutton);
  // await helper.pause(3);
});
When(/^bankUser verifies the created customer$/, async function () {
  await cobracustomer.searchUsers(this.data);
  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.productsTab);
  const customerData = {
    customerId: this.data.customerId,
    accounts: this.accountNumberArray,
    divisions: this.divisionapi,
    businessIdNumber: this.legalEntityName,
    resourceGroupName: this.resourceGroupName,
    productSettings: {
      cashManagementProductSettings: {
        payments: {
          domestic: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Credit)\')]') ? 'AU Domestic (Direct Credit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Osko)\')]') ? 'AU Domestic (Osko)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (RTGS)\')]') ? 'AU Domestic (RTGS)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'CN Domestic (BEPS & HVPS)\')]') ? 'CN Domestic (BEPS & HVPS)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Credit)\')]') ? 'NZ Domestic (Direct Credit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (SCP)\')]') ? 'NZ Domestic (SCP)' : undefined],
          otherPayments: [
            await helper.ifElementDisplayed('//label[contains(text(),\'AU BPAY\')]') ? 'AU BPAY' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'Multibank Payments\')]') ? 'Multibank Payments' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'International Payments\')]') ? 'International Payments' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'Transfers\')]') ? 'Transfers' : undefined,
          ],
          historical: ['ANZ Transactive - AU & NZ: Payments'],
        },
        balanceNTransactionReporting: [await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Accounts\')]') ? 'Reporting - Accounts' : undefined,
          await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Term Deposits\')]') ? 'Reporting - Term Deposits' : undefined],
        receivables: {
          directDebit: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Debit)\')]') ? 'AU Domestic (Direct Debit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Debit)\')]') ? 'NZ Domestic (Direct Debit)' : undefined],
          OtherReceivables: [await helper.ifElementDisplayed('//label[contains(text(),\'PayID Management\')]') ? 'PayID Management' : undefined],

        },
        serviceRequest: {
          Fulfilment: [await helper.ifElementDisplayed('//label[contains(text(),\'Fulfilment\')]') ? 'Fulfilment' : undefined],
          Services: ['Services', 'Order Deposit Books', 'Amend Billing Details', 'Amend Channel Details', 'Amend Group Mandate', 'Amend Legal Entity', 'Amend Statement Address', 'Backdate Transaction', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Channel User Maintenance', 'Close Account', 'Close Channel', 'Fix Encoding Error', 'General Enquiries', 'Add Loan Deal', 'Manage Authorised Person', 'Manage BPAY', 'Manage Bureau', 'Manage Direct Debits (Payments)', 'Manage Liquidity Mgmt Product', 'Manage Periodical Payments', 'Missing Deposit', 'Open Acccount (Paper)', 'Order Cheque Books', 'Recall Payment', 'Return Fund', 'Reverse Duplicate Payment (DE)', 'Stop Cheques', 'Trace Transaction'],
        },

        // customerProductLimits: 'Customer Override',
      },
    },
  };
  this.Customer = JSON.parse(JSON.stringify(customerData));
  logger.info(JSON.stringify((this.Customer)));
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click('#onboarding');
});
When(/^bankUser verifies the existing customer$/, async function () {
  await cobracustomer.searchUsers(this.userData);
  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.productsTab);
  const customerData = {
    customerId: this.userData.customerId,
    productSettings: {
      cashManagementProductSettings: {
        payments: {
          domestic: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Credit)\')]') ? 'AU Domestic (Direct Credit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Osko)\')]') ? 'AU Domestic (Osko)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (RTGS)\')]') ? 'AU Domestic (RTGS)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'CN Domestic (BEPS & HVPS)\')]') ? 'CN Domestic (BEPS & HVPS)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Credit)\')]') ? 'NZ Domestic (Direct Credit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (SCP)\')]') ? 'NZ Domestic (SCP)' : undefined],
          otherPayments: [
            await helper.ifElementDisplayed('//label[contains(text(),\'AU BPAY\')]') ? 'AU BPAY' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'Multibank Payments\')]') ? 'Multibank Payments' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'International Payments\')]') ? 'International Payments' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'Transfers\')]') ? 'Transfers' : undefined,
          ],
          historical: ['ANZ Transactive - AU & NZ: Payments'],
        },
        balanceNTransactionReporting: [await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Accounts\')]') ? 'Reporting - Accounts' : undefined,
          await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Term Deposits\')]') ? 'Reporting - Term Deposits' : undefined],
        receivables: {
          directDebit: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Debit)\')]') ? 'AU Domestic (Direct Debit)' : undefined,
            await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Debit)\')]') ? 'Reporting - Term Deposits' : undefined],
          OtherReceivables: [await helper.ifElementDisplayed('//label[contains(text(),\'PayID Management\')]') ? 'PayID Management' : undefined],

        },
        serviceRequest: {
          Fulfilment: [await helper.ifElementDisplayed('//label[contains(text(),\'Fulfilment\')]') ? 'Fulfilment' : undefined],
          Services: ['Services', 'Order Deposit Books', 'Amend Billing Details', 'Amend Channel Details', 'Amend Group Mandate', 'Amend Legal Entity', 'Amend Statement Address', 'Backdate Transaction', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Channel User Maintenance', 'Close Account', 'Close Channel', 'Fix Encoding Error', 'General Enquiries', 'Add Loan Deal', 'Manage Authorised Person', 'Manage BPAY', 'Manage Bureau', 'Manage Direct Debits (Payments)', 'Manage Liquidity Mgmt Product', 'Manage Periodical Payments', 'Missing Deposit', 'Open Acccount (Paper)', 'Order Cheque Books', 'Recall Payment', 'Return Fund', 'Reverse Duplicate Payment (DE)', 'Stop Cheques', 'Trace Transaction'],
        },

        // customerProductLimits: 'Customer Override',
      },
    },
  };
  this.Customer = JSON.parse(JSON.stringify(customerData));
  logger.info(JSON.stringify((this.Customer)));
});

// When(/^bankUser verifies the created customer$/, async function () {
//   await cobracustomer.searchUsers(this.data);
//   await helper.doubleClick(selectors.searchGrid.gridFirstElement);
//   await helper.waitForDisplayed(selectors.Customers.productsTab);
//   await helper.click(selectors.Customers.productsTab);
//   const customerData = {
//     customerId: this.data.customerId,
//     accounts: this.accountNumberArray,
//     divisions: this.divisionapi,
//     businessIdNumber: this.legalEntityName,
//     resourceGroupName: this.resourceGroupName,
//     productSettings: {
//       cashManagementProductSettings: {
//         payments: {
//           domestic: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Credit)\')]') ? 'AU Domestic (Direct Credit)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Osko)\')]') ? 'AU Domestic (Osko)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (RTGS)\')]') ? 'AU Domestic (RTGS)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'CN Domestic (BEPS & HVPS)\')]') ? 'CN Domestic (BEPS & HVPS)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Credit)\')]') ? 'NZ Domestic (Direct Credit)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (SCP)\')]') ? 'NZ Domestic (SCP)' : undefined],
//           otherPayments: [
//             await helper.ifElementDisplayed('//label[contains(text(),\'AU BPAY\')]') ? 'AU BPAY' : undefined,
//             await helper.ifElementDisplayed('//label[contains(text(),\'Multibank Payments\')]') ? 'Multibank Payments' : undefined,
//             await helper.ifElementDisplayed('//label[contains(text(),\'International Payments\')]') ? 'International Payments' : undefined,
//             await helper.ifElementDisplayed('//label[contains(text(),\'Transfers\')]') ? 'Transfers' : undefined,
//           ],
//           historical: ['ANZ Transactive - AU & NZ: Payments'],
//         },
//         balanceNTransactionReporting: [await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Accounts\')]') ? 'Reporting - Accounts' : undefined,
//         await helper.ifElementDisplayed('//label[contains(text(),\'Reporting - Term Deposits\')]') ? 'Reporting - Term Deposits' : undefined],
//         receivables: {
//           directDebit: [await helper.ifElementDisplayed('//label[contains(text(),\'AU Domestic (Direct Debit)\')]') ? 'AU Domestic (Direct Debit)' : undefined,
//           await helper.ifElementDisplayed('//label[contains(text(),\'NZ Domestic (Direct Debit)\')]') ? 'NZ Domestic (Direct Debit)' : undefined],
//           OtherReceivables: [await helper.ifElementDisplayed('//label[contains(text(),\'PayID Management\')]') ? 'PayID Management' : undefined],

//         },
//         serviceRequest: {
//           Fulfilment: [await helper.ifElementDisplayed('//label[contains(text(),\'Fulfilment\')]') ? 'Fulfilment' : undefined],
//           Services: ['Services', 'Order Deposit Books', 'Amend Billing Details', 'Amend Channel Details', 'Amend Group Mandate', 'Amend Legal Entity', 'Amend Statement Address', 'Backdate Transaction', 'Channel Account Maintenance', 'Channel Legal Entity Maintenance', 'Channel User Maintenance', 'Close Account', 'Close Channel', 'Fix Encoding Error', 'General Enquiries', 'Add Loan Deal', 'Manage Authorised Person', 'Manage BPAY', 'Manage Bureau', 'Manage Direct Debits (Payments)', 'Manage Liquidity Mgmt Product', 'Manage Periodical Payments', 'Missing Deposit', 'Open Acccount (Paper)', 'Order Cheque Books', 'Recall Payment', 'Return Fund', 'Reverse Duplicate Payment (DE)', 'Stop Cheques', 'Trace Transaction'],
//         },

//         // customerProductLimits: 'Customer Override',
//       },
//     },
//   };
//   this.Customer = JSON.parse(JSON.stringify(customerData));
//   logger.info(JSON.stringify((this.Customer)));
//   await helper.click('#onboarding');
// });

Then(/^validate the elements present in the Customer screen$/, async () => {
  await helper.waitForDisplayed(MenuBar.selectors.customer, 10000);
  await helper.click(MenuBar.selectors.customer);
  await helper.waitForDisplayed(selectors.Users.customerId);

  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerId)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.customerName)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.jurisdiction)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.workflow)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.status)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.searchBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.saveBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.resetBtn)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusNew)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.searchGrid.statusEnabled)).to.equal(true);
  const country = ['CN', 'NZ', 'SG', 'HK', 'KH', 'IN', 'ID', 'PH', 'TW', 'TH', 'VN', 'CK', 'FJ', 'KI', 'LA', 'MM', 'PG', 'WS', 'SB', 'TL', 'TO', 'VU', 'GB', 'US', 'AU'];
  const countrylist = ['China', 'New Zealand', 'Singapore', 'Hong Kong', 'Cambodia', 'India', 'Indonesia', 'Philippines', 'Taiwan', 'Thailand', 'Vietnam', 'Cook Islands', 'Fiji', 'Kiribati', '', 'Lao Peoples Deomocratic Republic', 'Myanmar', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Timor-Leste', 'Tonga', 'Vanuatu', 'United Kingdom', 'United States Of America', 'Australia'];
  for (const i in country) {
    await helper.scrollToElement(selectors.searchGrid.jurisdiction);
    await helper.inputText(selectors.searchGrid.jurisdiction, country[i]);
    // await helper.pause(2);
    await helper.click(selectors.searchGrid.hostSystemDiv);
    const a = await $$('//span[@class="Select-value-label"]/span[1]');
    expect(await a[i].getText()).to.be.oneOf(countrylist);
  }
  await helper.screenshot('validate screen- Customer');
});

Then(/^Reject the changes and validate the "([^"]*)" notification messages for the Customer$/, async function (action) {
  await cobracustomer.searchUsers(this.Customer);
  await helper.waitForDisplayed(selectors.Users.gridFirstElement);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedReject).then(async () => {
    if (action === 'modified') {
      // await helper.pause(3)
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to Customer: ${this.CustomerName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing DB verification');
          const caowner = await DBConnection.run(this.queryCustomer);
          const jsoncaowner = await caowner;
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
        await helper.click(selectors.Customers.closePreview);
      });
    }
    if (action === 'delete') {
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      // expect(registerUserNotificationMessage).to.be.oneOf([`Deletion of Customer ${this.CustomerName} was rejected.`, '']);
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn).then(async () => {
        if ((process.env.DB_CHECK).toString() === 'true') {
          logger.info('Executing DB verification');
          const caowner = await DBConnection.run(this.queryCustomer);
          const jsoncaowner = await caowner;
          const version = jp.query(await jsoncaowner, '$..VERSION').toString();
          const deleteflag = jp.query(jsoncaowner, '$..DELETE_FLAG').toString();
          expect(jp.query(jsoncaowner, '$..VERSION').toString()).to.equal(version);
          expect(jp.query(jsoncaowner, '$..DELETE_FLAG').toString()).to.equal(deleteflag);
          logger.info('No change in CA');
        }
        await helper.click(selectors.Customers.closePreview);
      });
    }
    await helper.screenshot(`Reject Customer ${action}`);
  });
});

Then(/^BankUser validated the Audit Scenarios for Customer$/, async function (details) {
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
  await helper.waitForDisplayed(MenuBar.selectors.customer);
  await helper.click(MenuBar.selectors.customer);
  await cobracustomer.searchUsers(this.Customer);
  await cobracustomer.selectCustomerFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  logger.info(this.Customer1.customerId);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'customer-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      await helper.doubleClick(auditvalidations[i].description);
      // await helper.pause(2);
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await cobracustomer.auditValidation(await x, this.Customer1);
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Customer-Approved');
      logger.info('Validated Audit-Approved Customer');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
});

Then(/^View the entities from the Customer screen$/, { wrapperOptions: { retry: 3 } }, async function () {
  await cobracustomer.searchUsers(this.data);
  await helper.doubleClick(selectors.searchGrid.gridFirstElement);

  await helper.waitForDisplayed(selectors.Customers.divisionsTab);
  await helper.click(selectors.Customers.divisionsTab);
  await helper.pause(1);
  await helper.doubleClick(selectors.Customers.searchGrid.gridDivisionFirstRecord);
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Division ${this.CustomerName}`);
  await helper.screenshot('validate screen-divisions');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.resourceTab);
  await helper.click(selectors.Customers.resourceTab);
  await helper.pause(1);
  await helper.doubleClick(selectors.Customers.searchGrid.gridResourceFirstRecord);
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Account ${this.CustomerName}`);
  await helper.screenshot('validate screen-Account');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.resourceTab);
  await helper.click(selectors.Customers.resourceTab);
  await helper.pause(1);
  await helper.doubleClick('//div[contains(text(),\'Billing Entity\')]');
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Billing Entity ${this.CustomerName}`);
  await helper.screenshot('validate screen-Billing Entity');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);


  await helper.waitForDisplayed(selectors.Customers.resourceTab);
  await helper.click(selectors.Customers.resourceTab);
  await helper.pause(1);
  await helper.doubleClick('//div[contains(text(),\'Legal Entity\')]');
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Legal Entity ${this.CustomerName}`);
  await helper.screenshot('validate screen-Legal Entity');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.resourceTab);
  await helper.click(selectors.Customers.resourceTab);
  await helper.pause(1);
  await helper.doubleClick('//div[contains(text(),\'Term Deposit\')]');
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Term Deposit ${this.CustomerName}`);
  await helper.screenshot('validate screen-Term Deposit');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.resourceGroupTab);
  await helper.click(selectors.Customers.resourceGroupTab);
  await helper.pause(1);
  await helper.doubleClick(selectors.Customers.searchGrid.gridResGroupFirstRecord);
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`ResourceGroup ${this.CustomerName}`);
  await helper.screenshot('validate screen-ResourceGroups');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.usersTab);
  await helper.click(selectors.Customers.usersTab);
  await helper.pause(1);
  await helper.doubleClick(selectors.Customers.searchGrid.gridUsersFirstRecord);
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Users ${this.CustomerName}`);
  await helper.screenshot('validate screen-Users');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);

  await helper.waitForDisplayed(selectors.Customers.rolesTab);
  await helper.click(selectors.Customers.rolesTab);
  await helper.pause(1);
  await helper.doubleClick(selectors.Customers.searchGrid.gridRolesFirstRecord);
  await helper.pause(1);
  expect(await helper.ifElementDisplayedAfterTime(`//a[contains(text(),\'${this.CustomerName}\')]`)).to.be.equal(true);
  logger.info(`Role ${this.CustomerName}`);
  await helper.screenshot('validate screen-Roles');
  await helper.click(`//a[contains(text(),\'${this.CustomerName}\')]`);
  // await helper.click(selectors.Customers.closePreview);
});
