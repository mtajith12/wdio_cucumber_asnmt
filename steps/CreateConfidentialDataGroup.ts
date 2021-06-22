import { Then, When } from 'cucumber';
import * as _ from 'lodash';
import * as jp from 'jsonpath';
import { helper } from 'src/Helper';
import { expect } from 'chai';
import { MenuBar } from 'src/MenuBarPage';
import { getLogger } from 'log4js';
import { selectors } from 'src/Selectors';
import { CreateResourceCDG } from 'src/CreateResourceCDG';
import { DBConnection } from 'src/DBConnection';
import { ConfidentialDataGroups, CDGname } from 'src/CDG';

import { users } from 'src/Users';
import { cobracustomer } from 'src/CreateCustomerPage';
const data = require('src/DataReader');
const logger = getLogger();


Then(/^Create Resource Confidential Data Group via API$/, async function () {
  const data = {
    customerUid: this.data1.customerUid,
    id: this.data1.customerUid,

  };
  const user = { userId: this.userData.userId };
  const CDGcreated = await ConfidentialDataGroups.runCDG(this.data1.customerId, data, user);
  this.CDGdata = await CDGcreated;
  logger.info(this.CDGdata);
});

Then(/^Search the Resource CDG in searchscreen and check "Approved" workflow and validate it against CA$/, { wrapperOptions: { retry: 20 } }, async function () {
  await CreateResourceCDG.searchCDG(this.CDGdata.confidentialDataGroupName);
});

When(/^BankUser verifies the existing customer for CDG$/, async function () {
  await cobracustomer.searchUsers(this.data);
  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.productsTab);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.productsTab);
  await helper.waitForDisplayed(selectors.Customers.product.customerAdministration);
  await helper.click(selectors.Customers.product.customerAdministration);
  // const CDG=await helper.ifElementDisplayed('//label[contains(text(),\'Confidential Data Group Management\')]') ? 'Confidential Data Group' : undefined
  const customerDataCDG = {
    custID: this.data.customerId,
    productSettings: {
      customerProductSettings: {
        productSettings: await helper.ifElementDisplayed('//label[contains(text(),\'Confidential Data Group Management\')]') ? 'Confidential Data Group' : undefined,
      },
    },
  };
  // console.log('Printing the Existing Customer Data');
  this.Customer1 = JSON.parse(JSON.stringify(customerDataCDG));
  // console.log(JSON.stringify((this.Customer1)));
});

Then(/^Modify the user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Confidential Data Group Resource$/, async function (change, data, resource) {
  let resources;
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  helper.pause(5);
  // console.log(CDGname);
  await helper.click(MenuBar.selectors.users);
  await helper.inputText(selectors.searchGrid.userId, this.userData.userId);
  await helper.inputText(selectors.searchGrid.customerId, this.data1.customerId);
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickEditBtn);
  // console.log('Existing customer data');
  // console.log(JSON.stringify((this.Customer1)));
  await CreateResourceCDG.editEntitlementCDG(this.Customer1, data, resources, change, CDGname);
  // console.log('View and Verify the CDG resource to entitlement');
  await users.verifyEntitlement(this.Customer1, data);
  if (resource === 'Selected') {
    await helper.scrollToElement('#confidentialDataGroupResourceGrid_wrap');
  }
  await helper.scrollToElement('label[for=\'confidentialDataGroup_selection\']');
  // // await helper.pause(4);
  await helper.click('button[class*=\'dialog__control__node_modules\']');
});


Then(/^Validate the "([^"]*)" message$/, async (status) => {
  if (status === 'modify') {
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    //    expect(registerUserNotificationMessage).to.be.oneOf([`User: ${dataCDG.firstName} ${dataCDG.lastName} (${dataCDG.userID}) is now pending approval to be modified.`, '']);
    const editScreenExclamationTriangle = await helper.getElementTextIfPresent(selectors.Users.editScreenExclamationTriangle);
    logger.info(editScreenExclamationTriangle);
    expect(editScreenExclamationTriangle).to.be.oneOf(['This User record has been modified and is pending approval', '']);
    // await helper.click(selectors.Users.closeButton)
    await helper.screenshot(`validate ${status}`);
  }
});

Then(/^approve the changes and validate the "([^"]*)" notification messages$/, async (action) => {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);
  await helper.inputText(selectors.Users.userId, this.userData.userId);
  browser.keys('Enter');
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickApproveBtn);
  if (action === 'modified') {
    // console.log('Approving Changes to CDG - Customer User');
    await users.approveUserFromGrid();
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    //    expect(registerUserNotificationMessage).to.be.oneOf([`Changes to User: ${dataCDG.firstName} ${dataCDG.lastName} (${dataCDG.userID}) have been approved.`, '']);
  }
  await helper.screenshot('changes to CDG entitlement');
});
