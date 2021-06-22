import { Given, Then, When } from 'cucumber';
import { expect } from 'chai';
import * as _ from 'lodash';
import { selectors } from 'src/Selectors';
import { CDGname } from 'src/CDG';
import * as jp from 'jsonpath';
import { helper } from 'src/Helper';
import { users } from 'src/Users';
import { getLogger } from 'log4js';
import { MenuBar } from 'src/MenuBarPage';
import { createResource } from 'src/CreateResources';
// import { cobracustomer } from 'pages/CreateCustomerPage';
import { creationviaapi } from 'src/customerCreation';
import { cobracustomer } from 'src/CreateCustomerPage';
import { CreateRole } from 'src/CreateRole';
import { searchPage } from 'src/SearchPage';


let resources;
const users1 = [];
const logger = getLogger();

Given(/^create a CAASUSER using CAAS api$/, async function () {
  const caasuser = await helper.createCAASUser();
  this.userData = {
    userId: `${await caasuser}`,
    firstName: 'ABCD',
    lastName: 'XYZ',
    statusUncheck: 'N',
  };
  this.query2 = `select * from CA_OWNER.USR where SRC_SYS_LOGIN_ID = '${this.userData.userId}'`;
  logger.info(this.query2);
  console.log(`CAASUser created: ${JSON.stringify(this.userData)}`);
});


Given(/^create "(\d)" CAASUSER using CAAS api$/, async function (number) {
  for (let i = 0; i < number; i += 1) {
    const caasuser = await helper.createCAASUser();
    users1.push({ userId: await caasuser });
  }
  this.Userslist = users1;
  console.log(this.Userslist);
});

Then(/^register a CAAS User using api$/, async function () {
  const data = {
    customerUid: this.data1.customerUid,
    id: this.data1.customerUid,

  };
  await creationviaapi.createDAUser(data, this.userData);
  console.log(JSON.stringify(this.userData));
});

Then(/^Register "(\d)" CAAS User using api$/, async function (number) {
  const data = {
    customerUid: this.data1.customerUid,
    id: this.data1.customerUid,

  };
  for (let i = 0; i < number; i += 1) {
    await creationviaapi.createDAUser(data, this.Userslist[i]);
  }
});


Then(/^Register CAAS User using api$/, async function () {
  const data = {
    customerUid: this.data1.customerUid,
    id: this.data1.customerUid,
    resources: this.ids,
  };
  const UserID = (this.userData == undefined) ? this.Userslist[0] : this.userData;
  await creationviaapi.createUser(data, UserID);
  this.userData = {
    userId: UserID.userId,
    firstName: 'ABCD',
    lastName: 'XYZ',
  };
  console.log(`${this.userData.userId} is now Registered and Approved.`);
});

Then(/^Bulk approve "(\d)" entities and validate the "([^"]*)" notification messages$/, async function (n, action) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await cobracustomer.searchByCustomerID(this.data);
  await users.selectMultipleUsersFromGrid(n);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickApproveBtn);
  if (action === 'register') {
    const UserApprovalConfirmationMessage = await helper.getElementTextIfPresent(selectors.Users.UserApprovalConfirmationMessage);
    logger.info(UserApprovalConfirmationMessage);

    await helper.screenshot(` Bulk Approve ${action}`);
    await users.approveUserFromGrid();
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
  }
});


Given(/^get user information$/, async function () {
  const existingdata = await users.DBvalidations('SELECT DISTINCT CA_OWNER.USR.SRC_SYS_LOGIN_ID, CA_OWNER.USR.ORG_BIZ_ID ,CA_OWNER.USR.VERSION FROM CA_OWNER.usr join CA_OWNER.ENTITLEMENT on CA_OWNER.ENTITLEMENT.party_id=CA_OWNER.usr.USER_ID JOIN CA_OWNER.ENTITLEMENT_PRODUCT  ON CA_OWNER.ENTITLEMENT_PRODUCT.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID JOIN CA_OWNER.ENTITLEMENT_RESOURCE  ON CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID  JOIN CA_OWNER.ORGANISATION ON CA_OWNER.USR.ORG_BIZ_ID= CA_OWNER.ORGANISATION.ORGANISATION_BIZ_ID AND CA_OWNER.ORGANISATION.STATUS=\'E\' WHERE CA_OWNER.USR.STATUS=\'E\'');
  this.existingdata = _.sample(existingdata);
  this.userData = {
    userId: this.existingdata.SRC_SYS_LOGIN_ID,
    customerId: this.existingdata.ORG_BIZ_ID,
  };
});


Then(/^search for created user in cobra$/, async function () {
  await helper.waitForDisplayed('#registerUser');
  await helper.click('#registerUser');
  await users.registerUsers(this.data, this.userData);
  await helper.screenshot('search for created user');
});


Then(/^verify if the FR users are present in search grid of CAAS Organisation$/, async function () {
  await helper.waitForDisplayed('#registerUser');
  await helper.click('#registerUser');
  await users.verifyUsers(this.data, this.userData);
  await helper.screenshot('search for created user');
});


Then(/^Approve the changes and validate the "([^"]*)" notification messages$/, async function (action) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickApproveBtn);
  if (action === 'register') {
    const UserApprovalConfirmationMessage = await helper.getElementTextIfPresent(selectors.Users.UserApprovalConfirmationMessage);
    logger.info(UserApprovalConfirmationMessage);

    expect(UserApprovalConfirmationMessage).to.equal(`On approval User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) will be registered.`);

    await users.approveUserFromGrid();
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    // expect(registerUserNotificationMessage).to.be.oneOf([`User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) has been registered.`, '']);
    // await helper.click(selectors.Users.closeButton);
  } else if (action === 'modified') {
    await users.approveUserFromGrid();

    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    // expect(registerUserNotificationMessage).to.be.oneOf([`Changes to User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) have been approved.`, '']);
  }
  if (action === 'deregister') {
    const UserApprovalConfirmationMessage = await helper.getElementTextIfPresent(selectors.Users.UserApprovalConfirmationMessage);
    logger.info(UserApprovalConfirmationMessage);
    expect(UserApprovalConfirmationMessage).to.equal(`On approval User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) will be de-registered.`);
    await users.approveUserFromGrid();
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    //	 expect(registerUserNotificationMessage).to.be.oneOf([`User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) has been de-registered.`, '']);
  }
  await helper.screenshot(`Approve ${action}`);
});


Then(/^Approve the (caas|cobra) user changes and validate the "([^"]*)" notification messages$/, async function (usrtype, action) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  if (usrtype == 'cobra') await users.searchManageUsers(this.COBRAuserData);
  else await users.searchManageUsers(this.userData);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickApproveBtn);
  if (action === 'register') {
    const UserApprovalConfirmationMessage = await helper.getElementTextIfPresent(selectors.Users.UserApprovalConfirmationMessage);
    logger.info(UserApprovalConfirmationMessage);

    //    expect(UserApprovalConfirmationMessage).to.equal(`On approval User: ${this.COBRAuserData.firstName} ${this.COBRAuserData.Surname} (${this.userData.userId.toUpperCase()}) will be registered.`);

    // await users.approveUserFromGrid();
    await helper.waitForDisplayed(selectors.Users.UserApprovalConfirmationYesButton);
    await helper.click(selectors.Users.UserApprovalConfirmationYesButton);
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    //    expect(registerUserNotificationMessage).to.be.oneOf([`User: ${this.COBRAuserData.firstName} ${this.COBRAuserData.lastName} (${this.COBRAuserData.userId}) has been registered.`, '']);
    // await helper.click(selectors.Users.closeButton);
  } else if (action === 'modified') {
    await users.approveUserFromGrid();

    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    // expect(registerUserNotificationMessage).to.be.oneOf([`Changes to User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) have been approved.`, '']);
  }
  await helper.screenshot(`Approve ${action}`);

});


async function addEntitlements(Customer, accountNumber, resourceGroupName, data, resource, daily, batch, transaction, legalEntityName, termDeposit) {
  let entitlement;
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  if (data.includes(',')) {
    entitlement = data.split(',');
  } else {
    entitlement = data;
  }

  if (Array.isArray(entitlement)) {
    for (const i in entitlement) {
      await users.addEntitlement(Customer, entitlement[i], resources, daily, batch, transaction, accountNumber, resourceGroupName, legalEntityName, CDGname, termDeposit);
    }
  } else if (entitlement !== 'None') {
    await users.addEntitlement(Customer, entitlement, resources, daily, batch, transaction, accountNumber, resourceGroupName, legalEntityName, CDGname, termDeposit);
  }
  await users.submit();
  await helper.screenshot('add entitlement');
}
Then(/^add "([^"]*)" with "([^"]*)" Resources and register the customeruser$/, async function (noncustomeradmin, resource) {
  if (noncustomeradmin === 'CC03_Authorised Signatory' || noncustomeradmin === 'All Institutional Insights') {
    this.accountNumber = this.divisionapi.divisionId;
    this.resourceGroupName = this.billentNumber;
  }
  await addEntitlements(this.Customer, this.accountNumber, this.resourceGroupName, noncustomeradmin, resource, null, null, null, this.legalEntityName, null);
});

Then(/^add DSS Entitlements with Account groups and Resources and register the customeruser with :$/, async function (data) {
  const userData = data.hashes();
  const entitlementDetailList = [];
  await users.setresourcesarray(this.accountsArray, this.legalEntityArray, this.resourceGroupArray);
  // console.log(this.legalEntityArray)
  // console.log(this.accountsArray)
  // console.log(this.resourceGroupArray)
  // this.legalEntityArray = [{ index: '1', id: '315719', businessIdNumber: 'iqqbhjd4yiz' },
  // { index: '2', id: '315720', businessIdNumber: '3mah4xrk8u7' },
  // { index: '3', id: '315721', businessIdNumber: '6iuvdsrk8u7' }]
  // this.resourceGroupArray = [{ index: '1', id: '315721', resourceGroupName: 'ns07u7ftp1s' },
  // { index: '2', id: '315722', resourceGroupName: 'qb4wucb6dlq' }]
  // this.accountsArray = [{ hostIndex: '1', host: 'CAP', accountNumber: '1ns07u7ftp1s' },
  // { hostIndex: '2', host: 'CAP', accountNumber: '2ns07u7ftp1s' },
  // { hostIndex: '1', host: 'MDZ', accountNumber: '3ns07u7ftp1s' },
  // { hostIndex: '2', host: 'MDZ', accountNumber: '4ns07u7ftp1s' }]

  for (const act1 of userData) {
    const LegalEntityArray = [];
    const ResourceGroupArray = [];
    const AccountArray = [];
    // these arrays have to be declared inside this loop because we have multiple rows in datatable

    const legalEntity = act1.AddLegalEntity.includes(',') ? act1.AddLegalEntity.replace(/ /g, '').split(',') : [act1.AddLegalEntity];
    for (const i in legalEntity) {
      LegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === legalEntity[i] ? item.businessIdNumber : undefined))[0]);
    }
    // console.log(LegalEntityArray)

    const resourceGroup = act1.AddResourceGroup.includes(',') ? act1.AddResourceGroup.replace(/ /g, '').split(',') : [act1.AddResourceGroup];
    for (const i of resourceGroup) {
      ResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === i ? item.resourceGroupName : undefined))[0]);
    }
    // console.log(ResourceGroupArray)

    const account = act1.AddAccount.includes('&') ? act1.AddAccount.replace(/ /g, '').split('&') : [act1.AddAccount];
    for (const i in account) {
      const a = account[i].includes(',') ? account[i].split(',') : [account[i]];
      const hostSystem = a.shift();
      console.log(a);
      console.log(hostSystem);

      for (const j in a) {
        AccountArray.push(_.compact(this.accountsArray.map((item) => item.host === hostSystem && item.hostIndex === a[j] ? item.accountNumber : undefined))[0]);
      }
    }
    // console.log(ResourceGroupArray)
    const orderList = act1.Order.includes(',') ? act1.Order.split(',') : [act1.Order];

    entitlementDetailList.push({
      entitlement: act1.RoleName.toString(),
      account: AccountArray,
      legalEntity: LegalEntityArray,
      resourceGroup: ResourceGroupArray,
      order: _.compact(orderList),
    });
  }
  console.log(_.compact(entitlementDetailList));
  for (const act in entitlementDetailList) {
    console.log(('Entitlement added here'));
    if (entitlementDetailList[act].order.includes(',')) {
      entitlementDetailList[act].order = entitlementDetailList[act].order.split(',');
    } else {
      entitlementDetailList[act].order = entitlementDetailList[act].order;
    }
    await users.addEntitlement(this.Customer, entitlementDetailList[act].entitlement, entitlementDetailList[act].order, null, null, null, entitlementDetailList[act].account, entitlementDetailList[act].resourceGroup, entitlementDetailList[act].legalEntity, null, null);
  }
  await users.submit();
});

Then(/^add ([^"]*) with "([^"]*)" Resources with Daily limit "([^"]*)" , Batch limit "([^"]*)",Transaction limit "([^"]*)" and register the customeruser$/, async function (data, resource, daily, batch, transaction) {
  await addEntitlements(this.Customer, this.accountNumber, this.resourceGroupName, data, resource, daily, batch, transaction, this.legalEntityName, this.termDeposit);
});
Then(/^Add the user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Resources with Daily limit "([^"]*)" , Batch limit "([^"]*)",Transaction limit "([^"]*)"$/, async function (change, data, resource, daily, batch, transaction) {
  if (data === 'Custom Role') {
    data = this.roleName;
  }
  await addEntitlements(this.Customer, null, null, data, resource, daily, batch, transaction, null, null);
});


Then(/^validate the user is created in CA for "([^"]*)" adminModel$/, { wrapperOptions: { retry: 20 } }, async function (ADMIN_MODEL) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    const caOwner = await users.DBvalidations(this.query2);

    const jsoncaowner = caOwner;
    logger.info(jsoncaowner);
    expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.be.oneOf(['2', '4']);
    expect(jp.query(await jsoncaowner, '$..STATUS').toString()).to.equal('E');
    expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.equal('N');
    expect(jp.query(await jsoncaowner, '$..ADMIN_MODEL').toString()).to.equal(ADMIN_MODEL);
    this.ufirstName = `${(jp.query(await jsoncaowner, '$..FIRST_NAME').toString())}`;
    this.ulastName = `${(jp.query(await jsoncaowner, '$..SURNAME').toString())}`;
  }
});

Then(/^view the user Applications$/, async () => {
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.view);
  logger.info('Validating Action buttons');
  await helper.pause(2);


  await helper.click(selectors.Users.applicationsTab);
  await helper.waitForTextInElement(selectors.Users.applicationsOptions.appName, 'Transactive Global');
  expect(await helper.ifElementExists('.//*[@id="preview"]/div/div/div[2]/div/ul/li[2]/div/div/div[2]/div/div/div/div[2]/div/div/div[1]')).to.equal(true);


  await helper.click(selectors.Users.applicationsTab);
  await helper.doubleClickbasedonText('Transactive Global', selectors.Users.applicationsOptions.appName);
  await helper.pause(2);
  await helper.screenshot('Validated User Applications');
  logger.info('Validated User Applications');
});

Then(/^View the "([^"]*)" User and its entitlements to verify Restricted country resource$/, async function (system) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);

  if (system === 'Cobra') {
    await helper.inputText(selectors.Users.userId, this.COBRAuserData.userId);
    await helper.click(selectors.Users.searchBtn);
    await users.selectUsersFromGrid();
    await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);

    await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
    await helper.click(selectors.Users.cobrauserentitlementtab);
  } else {
    await helper.inputText(selectors.Users.userId, this.userData.userId);
    await helper.click(selectors.Users.searchBtn);
    await users.selectUsersFromGrid();
    await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.edit);

    logger.info('Validating Action buttons');


    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'View\')]')).to.be.not.equal(true);
    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Edit\')]')).to.equal(true);
    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Approve\')]')).to.equal(true);
    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Reject\')]')).to.equal(true);
    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Delete\')]')).to.equal(true);
    expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Deregister\')]')).to.be.not.equal(true);
    await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);


    expect(await helper.ifElementExists('button[title=\'Edit User Entitlements\']')).to.be.not.equal(true);
    expect(await helper.ifElementDisplayed('button[title=\'Deregister User Record\']')).to.equal(true);

    await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
    await helper.click(selectors.Users.editEntitlementsTab);
  }
  await helper.pause(3);
  await helper.doubleClickbasedonText('All Entitlements', selectors.Users.entitlementOptions.selected);
  await helper.pause(2);
  console.log(await helper.ifElementDisplayed('.//div[contains(text(),\'XXXXXXXX\')]'));

  const a = await $$('.//div[contains(text(),\'XXXXXXXX\')]');


  expect(await a[1].isDisplayed()).to.equal(true);
  await helper.screenshot('Validated Restricted Country - User Entitlement');
  logger.info('Validated Restricted Country - User Entitlement');
  await helper.click('button[class*=\'dialog__control__node_modules\']');
});

Then(/^View the Resource to validate Restricted Country$/, async function () {
  await helper.click(MenuBar.selectors.resource);
  await helper.waitForDisplayed(selectors.searchGrid.customerId);
  await helper.inputText(selectors.searchGrid.customerId, this.data.customerId);
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  expect(await helper.ifElementDisplayed(`.//div[contains(text(),'${this.accountNumber}')]`)).to.be.not.equal(true);
  expect(await helper.ifElementDisplayed('.//div[contains(text(),\'XXXXXXXX\')]')).to.equal(true);
  await helper.scrollToElement('.//div[contains(text(),\'XXXXXXXX\')]');
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
  // await helper.pause(2);
  logger.info('Validating Action buttons');
  expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'View\')]')).to.equal(true);
  expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Edit\')]')).to.equal(true);
  expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Approve\')]')).to.equal(true);
  expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Reject\')]')).to.equal(true);
  expect(await helper.ifElementExists('.//button[contains(@class, \'disabled\')]/span[contains(text(), \'Deregister\')]')).to.equal(true);
  await helper.screenshot('Validated Restricted Country - Resource Grid');
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
  logger.info('Validated Restricted Country - Resource Grid');
});

Then(/^modify the user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Resources with Daily limit "([^"]*)" , Batch limit "([^"]*)",Transaction limit "([^"]*)"$/, async function (change, data, resource, daily, batch, transaction) {
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  if (await helper.ifElementExists(selectors.Users.registerUserNotificationMessage)) {
    await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  } else {
    await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
    await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
    await users.searchManageUsers(this.userData);
    await users.selectUsersFromGrid();
  }
  await users.editUsersviaActions(); // Actions>Edit
  if (data === 'Custom Role') {
    // eslint-disable-next-line no-param-reassign
    data = this.roleName;
  }
  await users.editEntitlement(this.Customer, data, resources, daily, batch, transaction, this.accountNumberArray, this.resourceGroupName, change, this.legalEntityName, this.CDGname, this.termDeposit);
  await users.submit();
});

Then(/^modify the cobra user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Resources with Daily limit "([^"]*)" , Batch limit "([^"]*)",Transaction limit "([^"]*)"$/, async function (change, data, resource, daily, batch, transaction) {
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  if (await helper.ifElementExists(selectors.Users.registerUserNotificationMessage)) {
    await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  } else {
    await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
    await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
    await users.searchManageUsers(this.userData);
    await users.selectUsersFromGrid();
  }
  await users.editUsersviaActions(); // Actions>Edit
  if (data === 'Custom Role') {
    // eslint-disable-next-line no-param-reassign
    data = this.roleName;
  }
  await users.editcobrauserEntitlement(this.Customer, data, resources, daily, batch, transaction, this.accountNumberArray, this.resourceGroupName, change, this.legalEntityName, this.CDGname, this.termDeposit);
  await users.submit();
});

Then(/^validate the user is modified in CA for "([^"]*)" adminModel$/, { wrapperOptions: { retry: 20 } }, async function (ADMIN_MODEL) {
  if ((process.env.DB_CHECK).toString() === 'true') {
    const caOwner = await users.DBvalidations(this.query2);
    const jsoncaowner = await caOwner;
    logger.info(jsoncaowner);
    expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.equal('3');
    expect(jp.query(await jsoncaowner, '$..STATUS').toString()).to.equal('E');
    expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.equal('N');
    expect(jp.query(await jsoncaowner, '$..ADMIN_MODEL').toString()).to.equal(ADMIN_MODEL);
  }
});
Then(/^validate the user is modified in CA for "([^"]*)" adminModel with "([^"]*)" modify$/, async function (ADMIN_MODEL, modify) {
  // await helper.pause(5);
  if ((process.env.DB_CHECK).toString() === 'true') {
    const caOwner = await users.DBvalidations(this.query2);
    const jsoncaowner = await caOwner;
    logger.info(jsoncaowner);
    if (modify === '1') {
      expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.equal('3');
    }
    if (modify === '2') {
      expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.equal('4');
    }
    if (modify === '3') {
      expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.equal('5');
    }
    expect(jp.query(await jsoncaowner, '$..STATUS').toString()).to.equal('E');
    expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.equal('N');
    expect(jp.query(await jsoncaowner, '$..ADMIN_MODEL').toString()).to.equal(ADMIN_MODEL);
  }
});
Then(/^deregister the user$/, async function () {
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickDeregisterBtn);
  const UserApprovalConfirmationMessage = await helper.getElementTextIfPresent(selectors.Users.UserApprovalConfirmationMessage);
  logger.info(UserApprovalConfirmationMessage);

  expect(UserApprovalConfirmationMessage).to.be.oneOf([`This will submit User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) to be de-registered.`, '']);

  await users.approveUserFromGrid();
  await helper.screenshot('Deregister user');
});
Then(/^validate the user is deregistered in CA$/, { wrapperOptions: { retry: 20 } }, async function () {
  // await helper.pause(5);
  if ((process.env.DB_CHECK).toString() === 'true') {
    const caOwner = await users.DBvalidations(this.query2);
    const jsoncaowner = await caOwner;
    logger.info(jsoncaowner);
  }
});
Then(/^reject the changes and validate the "([^"]*)" notification messages$/, async function (action) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.UserPendingModifiedRejectButton).then(async () => {
    if (action === 'modified') {
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`Changes to User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) was rejected.`, '']);
    }
    if (action === 'deregister') {
      await users.rejectPendingModifiedApprovalFromGrid();
      const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
      logger.info(registerUserNotificationMessage);
      expect(registerUserNotificationMessage).to.be.oneOf([`De-registration of User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) was rejected.`, '']);
    }
    await helper.screenshot(`Reject ${action}`);
  });
});
Then(/^validate the "([^"]*)" message$/, async function (status) {
  if (status === 'register') {
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    expect(registerUserNotificationMessage).to.be.oneOf([`User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) has been submitted and is pending approval.`, '']);
    // await helper.click(selectors.Users.closeButton)
  } else if (status === 'modify') {
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    expect(registerUserNotificationMessage).to.be.oneOf([`User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) is now pending approval to be modified.`, '']);
    const editScreenExclamationTriangle = await helper.getElementTextIfPresent(selectors.Users.editScreenExclamationTriangle);
    logger.info(editScreenExclamationTriangle);
    expect(editScreenExclamationTriangle).to.be.oneOf(['This User record has been modified and is pending approval', '']);
  } else if (status === 'deregister') {
    const registerUserNotificationMessage = await helper.getElementTextIfPresent(selectors.Users.registerUserNotificationMessage);
    logger.info(registerUserNotificationMessage);
    expect(registerUserNotificationMessage).toBe([`User: ${this.userData.firstName} ${this.userData.lastName} (${this.userData.userId}) is now pending approval to be de-registered.`, '']);
  }
  await helper.screenshot(`validate ${status}`);
});
Then(/^validate the elements present in the User screen$/, async () => {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 10000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.customerId);


  expect(await helper.ifElementExists(selectors.Users.customerId)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.divisionId)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.userId)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.lastName)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.firstName)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.workflow)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.status)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.searchBtn)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.saveBtn)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.resetBtn)).to.equal(true);
  expect(await helper.ifElementExists(selectors.Users.advanceSearchGrid)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Users.statusDisabled)).to.equal(true);
  expect(await helper.ifElementDisplayed(selectors.Users.statusEnabled)).to.equal(true);
  await helper.screenshot('validate screen');
});
Then(/^modify the user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Resources$/, async function (change, entitlement, resource) {
  let entitlements;
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  if (entitlement.includes(',')) {
    entitlements = entitlement.split(',');
  } else {
    entitlements = entitlement;
  }
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  const legalEntityName = await this.legalEntityName;
  if (Array.isArray(entitlements)) {
    for (const i in entitlements) {
      await users.editEntitlement(this.Customer, entitlements[i], resources, undefined, undefined, undefined, this.accountNumber, this.accountName, change, await legalEntityName, this.CDGname, this.termDepositName);
    }
  } else {
    await users.editEntitlement(this.Customer, entitlement, resources, undefined, undefined, undefined, this.accountNumber, this.accountName, change, await legalEntityName, this.CDGname, this.termDepositName);
  } await users.submit();
  await helper.screenshot('add entitlement');
});
Then(/^modify the cobra user by ([^"]*) "([^"]*)" entitlement with "([^"]*)" Resources$/, async function (change, entitlement, resource) {
  let entitlements;
  if (resource.includes(',')) {
    resources = resource.split(',');
  } else {
    resources = resource;
  }
  if (entitlement.includes(',')) {
    entitlements = entitlement.split(',');
  } else {
    entitlements = entitlement;
  }
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  const legalEntityName = await this.legalEntityName;
  if (Array.isArray(entitlements)) {
    for (const i in entitlements) {
      await users.editcobrauserEntitlement(this.Customer, entitlements[i], resources, undefined, undefined, undefined, this.accountNumber, this.accountName, change, await legalEntityName, this.CDGname, this.termDepositName);
    }
  } else {
    await users.editcobrauserEntitlement(this.Customer, entitlement, resources, undefined, undefined, undefined, this.accountNumber, this.accountName, change, await legalEntityName, this.CDGname, this.termDepositName);
  } await users.submit();
  await helper.screenshot('add entitlement');
});
When(/^bankUser verifies the existing User$/, async function () {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);
  await helper.inputText(selectors.Users.userId, this.userData.userId);
  await helper.inputText(selectors.Users.customerId, this.userData.customerId);
  await browser.keys('Enter');
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
});

Then(/^validate the user is created in CA for single adminModel with ([^"]*)$/, { wrapperOptions: { retry: 20 } }, async function (entity) {
  if (entity === 'legal entity') {
    const queryLegal = `SELECT DISTINCT * FROM CA_OWNER.usr join CA_OWNER.ENTITLEMENT on CA_OWNER.ENTITLEMENT.party_id=CA_OWNER.usr.USER_ID JOIN CA_OWNER.ENTITLEMENT_RESOURCE  ON CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID and  CA_OWNER.ENTITLEMENT_RESOURCE.RESOURCE_TYPE = 'legalentity' WHERE CA_OWNER.USR.STATUS='E' and CA_OWNER.USR.USER_BIZ_ID= '${this.userData.userId}'`;

    logger.info(queryLegal);
    if ((process.env.DB_CHECK).toString() === 'true') {
      const caOwner = await users.DBvalidations(queryLegal);

      const jsoncaowner = await caOwner;
      logger.info(this.legalentityResourceId);
      expect(jp.query(await jsoncaowner, '$..PRODUCT_ID').toString()).to.include('p_fulfil', 'p_service');
      expect(jp.query(await jsoncaowner, '$..RESOURCE_ID').toString()).to.include(this.legalentityResourceId);

      expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.include('N');
      expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.include('2');
    }
  } else if ((process.env.DB_CHECK).toString() === 'true') {
    const queryaccount = `SELECT DISTINCT * FROM CA_OWNER.usr join CA_OWNER.ENTITLEMENT on CA_OWNER.ENTITLEMENT.party_id=CA_OWNER.usr.USER_ID JOIN CA_OWNER.ENTITLEMENT_RESOURCE  ON CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID and  CA_OWNER.ENTITLEMENT_RESOURCE.RESOURCE_TYPE = 'legalentityaccount' WHERE CA_OWNER.USR.STATUS='E' and CA_OWNER.USR.USER_BIZ_ID= '${this.userData.userId}'`;

    logger.info(queryaccount);
    const caOwner = await users.DBvalidations(queryaccount);

    const jsoncaowner = await caOwner;
    logger.info(this.legalentityResourceId);
    expect(jp.query(await jsoncaowner, '$..PRODUCT_ID').toString()).to.include('p_fulfil', 'p_service');
    expect(jp.query(await jsoncaowner, '$..RESOURCE_ID').toString()).to.include(this.accountResourceId);

    expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.include('N');
    expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.include('2');
  }
});
Then(/^validate the user is modified in CA for single adminModel with ([^"]*)$/, { wrapperOptions: { retry: 20 } }, async function (entity) {
  if (entity === 'legal entity') {
    if ((process.env.DB_CHECK).toString() === 'true') {
      const queryLegal = `SELECT DISTINCT * FROM CA_OWNER.usr join CA_OWNER.ENTITLEMENT on CA_OWNER.ENTITLEMENT.party_id=CA_OWNER.usr.USER_ID JOIN CA_OWNER.ENTITLEMENT_RESOURCE  ON CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID and  CA_OWNER.ENTITLEMENT_RESOURCE.RESOURCE_TYPE = 'legalentity' WHERE CA_OWNER.USR.STATUS='E' and CA_OWNER.USR.USER_BIZ_ID= '${this.userData.userId}'`;

      logger.info(queryLegal);
      const caOwner = await users.DBvalidations(queryLegal);

      const jsoncaowner = await caOwner;
      logger.info(this.legalentityResourceId);
      expect(jp.query(await jsoncaowner, '$..PRODUCT_ID').toString()).to.include('p_fulfil', 'p_service');
      expect(jp.query(await jsoncaowner, '$..RESOURCE_ID').toString()).to.include(this.legalentityResourceId);

      expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.include('N');
      expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.include('3');
    }
  } else if ((process.env.DB_CHECK).toString() === 'true') {
    const queryaccount = `SELECT DISTINCT * FROM CA_OWNER.usr join CA_OWNER.ENTITLEMENT on CA_OWNER.ENTITLEMENT.party_id=CA_OWNER.usr.USER_ID JOIN CA_OWNER.ENTITLEMENT_RESOURCE  ON CA_OWNER.ENTITLEMENT_RESOURCE.ENTITLEMENT_ID = CA_OWNER.ENTITLEMENT.ID and  CA_OWNER.ENTITLEMENT_RESOURCE.RESOURCE_TYPE = 'legalentityaccount' WHERE CA_OWNER.USR.STATUS='E' and CA_OWNER.USR.USER_BIZ_ID= '${this.userData.userId}'`;

    logger.info(queryaccount);
    const caOwner = await users.DBvalidations(queryaccount);

    const jsoncaowner = await caOwner;
    logger.info(this.legalentityResourceId);
    expect(jp.query(await jsoncaowner, '$..PRODUCT_ID').toString()).to.include('p_fulfil', 'p_service');
    expect(jp.query(await jsoncaowner, '$..RESOURCE_ID').toString()).to.include(this.accountResourceId);

    expect(jp.query(await jsoncaowner, '$..DELETE_FLAG').toString()).to.include('N');
    expect(jp.query(await jsoncaowner, '$..VERSION').toString()).to.include('3');
  }
});

Then(/^Bankuser verifies the CAAS User details for DSS Account Groups$/, async function (data) {
  logger.info(`Verifying the Entitlements Added for : CAAS User`);
  const userData = data.hashes();
  const entitlementDetailList = [];

  for (const act1 of userData) {
    const sLegalEntityArray = [];
    const fLegalEntityArray = [];
    const sResourceGroupArray = [];
    const fResourceGroupArray = [];
    const sAccountArray = [];
    const fAccountArray = [];
    
    // these arrays have to be declared inside this loop because we have multiple rows in datatable

    // Accounts
    const fact = act1.Account_Fufil ? (act1.Account_Fufil.includes(',') ? act1.Account_Fufil.replace(/ /g, '').split(',') : [act1.Account_Fufil]) : undefined;
    const sact = act1.Account_Service ? (act1.Account_Service.includes(',') ? act1.Account_Service.replace(/ /g, '').split(',') : [act1.Account_Service]) : undefined;
    for (const i in fact) {
      fAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === fact[i] ? item.accountNumber : undefined))[0]);
    }
    for (const i in sact) {
      sAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === sact[i] ? item.accountNumber : undefined))[0]);
    }
    // Legal Entity
    const fle = act1.LegalEntity_Fulfil ? (act1.LegalEntity_Fulfil.includes(',') ? act1.LegalEntity_Fulfil.replace(/ /g, '').split(',') : [act1.LegalEntity_Fulfil]) : undefined;
    const sle = act1.LegalEntity_Service ? (act1.LegalEntity_Service.includes(',') ? act1.LegalEntity_Service.replace(/ /g, '').split(',') : [act1.LegalEntity_Service]) : undefined;
    for (const i in fle) {
      fLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === fle[i] ? item.legalEntityName : undefined))[0]);
    }
    for (const i in sle) {
      sLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === sle[i] ? item.legalEntityName : undefined))[0]);
    }

    // Resource Groups
    const frg = act1.ResourceGroup_Fulfil ? (act1.ResourceGroup_Fulfil.includes(',') ? act1.ResourceGroup_Fulfil.replace(/ /g, '').split(',') : [act1.ResourceGroup_Fulfil]) : undefined;
    const srg = act1.ResourceGroup_Service ? (act1.ResourceGroup_Service.includes(',') ? act1.ResourceGroup_Service.replace(/ /g, '').split(',') : [act1.ResourceGroup_Service]) : undefined;
    for (const i in frg) {
      fResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === frg[i] ? item.resourceGroupName : undefined))[0]);
    }
    for (const i in srg) {
      sResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === srg[i] ? item.resourceGroupName : undefined))[0]);
    }

    entitlementDetailList.push({
      entitlement: act1.RoleName.toString(),
      faccount: fAccountArray,
      flegalEntity: fLegalEntityArray,
      fresourceGroup: fResourceGroupArray,
      saccount: sAccountArray,
      slegalEntity: sLegalEntityArray,
      sresourceGroup: sResourceGroupArray,
    });
  }
  console.log(_.compact(entitlementDetailList));

  await helper.pause(2);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);
  // await users.verifyEntitlement(this.Customer, entitlementDetailList[k].entitlement);
  
  await helper.pause(1);
  await helper.waitForDisplayed('#entitlementTab');
  await helper.click('#entitlementTab');
  await helper.screenshot('entitlement Screen');


  for (const i in entitlementDetailList) {
    await helper.doubleClickbasedonText(entitlementDetailList[i].entitlement, selectors.Users.entitlementOptions.selected);
    console.log(`verifying ${entitlementDetailList[i].entitlement}`);

    // Verifies Accounts
    console.log('---Accounts---');

   if (entitlementDetailList[i].faccount.length > 0) {
     await helper.pause(1);
     expect(await helper.ifElementDisplayed('//div[@id=\'p_fulfilResourceAccountsGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].faccount) {
       logger.info('Verifying - f_account ');
       await helper.pause(2);
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceAccountsGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].faccount[j]}\')]`)).to.equal(true);
     }
   } if (entitlementDetailList[i].saccount.length > 0) {
     await helper.pause(1);
     logger.info('Verifying - s_account ');
     expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceAccountsGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].saccount) {
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceAccountsGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].saccount[j]}\')]`)).to.equal(true);
     }
   }
   console.log('---ResourceGroup---');
   // Verifies Resource Group
   if (entitlementDetailList[i].fresourceGroup.length > 0) {
     await helper.pause(1);
     expect(await helper.ifElementDisplayedAfterTime('//div[@id=\'p_fulfilResourceGroupGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].fresourceGroup) {
       await helper.pause(1);
       logger.info('Verifying - f_resourcegroup ');
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].fresourceGroup[j]}\')]`)).to.equal(true);
       await helper.doubleClick(`//div[@id=\'p_fulfilResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].fresourceGroup[j]}\')]`);
       await helper.pause(2);
       await users.verifyResourceGroup('Fulfilment', entitlementDetailList[i].fresourceGroup[j]);
       await helper.screenshot('ResourceGroups Screen');
       await helper.click('.//button[contains(text(),\'OK\')]');
     }
   } if (entitlementDetailList[i].sresourceGroup.length > 0) {
     expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceGroupGrid_wrap\']')).to.equal(true);
     for (const j in entitlementDetailList[i].sresourceGroup) {
       await helper.pause(1);
       logger.info('Verifying - s_resourcegroup ');
       expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].sresourceGroup[j]}\')]`)).to.equal(true);
       await helper.doubleClick(`//div[@id=\'p_serviceResourceGroupGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].sresourceGroup[j]}\')]`);
       await helper.pause(1);
       await users.verifyResourceGroup('Services', entitlementDetailList[i].sresourceGroup[j]);
       await helper.screenshot('ResourceGroups Screen');
       await helper.click('.//button[contains(text(),\'OK\')]');
     }
   }
    console.log('---LegalEntity---');
    // Verifies Legal Entity
       if (entitlementDetailList[i].flegalEntity.length > 0) {
         await helper.pause(1);
         logger.info('Verifying - f_legalEntity ');
         expect(await helper.ifElementDisplayed('//div[@id=\'p_fulfilResourceGrid_wrap\']')).to.equal(true);
         for (const j in entitlementDetailList[i].flegalEntity) {
           expect(await helper.ifElementDisplayed(`//div[@id=\'p_fulfilResourceGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].flegalEntity[j]}\')]`)).to.equal(true);
         }
       } if (entitlementDetailList[i].slegalEntity.length > 0) {
         await helper.pause(1);
         logger.info('Verifying - s_legalEntity ');
         expect(await helper.ifElementDisplayed('//div[@id=\'p_serviceResourceGrid_wrap\']')).to.equal(true);
         for (const j in entitlementDetailList[i].slegalEntity) {
           expect(await helper.ifElementDisplayed(`//div[@id=\'p_serviceResourceGrid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'${entitlementDetailList[i].slegalEntity[j]}\')]`)).to.equal(true);
         }
       }
       await helper.pause(1);
       await helper.click('button[class*=\'dialog__control__node_modules\']');
  }
});

Then(/^Bankuser verifies the User details for ([^"]*)$/, async function (data) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);

  await helper.inputText(selectors.Users.userId, this.userData.userId);
  await helper.inputText(selectors.Users.customerId, this.userData.customerId);

  await helper.click(selectors.Users.searchBtn);

  await users.selectUsersFromGrid();

  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await users.verifyEntitlement(this.Customer1, data);
  if (resources.includes('Add Account')) {
    expect(await helper.ifElementDisplayed('#p_fulfilResourceAccountsGrid')).to.equal(true);
    expect(await helper.ifElementDisplayed('#p_serviceResourceAccountsGrid')).to.equal(true);
  } else {
    expect(await helper.ifElementDisplayed('#p_fulfilResourceGrid')).to.equal(true);
    expect(await helper.ifElementDisplayed('#p_serviceResourceGrid')).to.equal(true);
  }
  await helper.click('button[class*=\'dialog__control__node_modules\']');
});
Then(/^Bankuser verifies the details are cascaded for ([^"]*)$/, async function (data) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);

  await helper.inputText(selectors.Users.userId, this.userData.userId);
  await helper.inputText(selectors.Users.customerId, this.userData.customerId);

  browser.keys('Enter');
  await helper.click(selectors.Users.searchBtn);

  await users.selectUsersFromGrid();

  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await users.verifyEntitlement(this.Customer1, data);
  if (resources.includes('Add Account')) {
    expect(await helper.ifElementDisplayed('#p_fulfilResourceAccountsGrid')).to.equal(true);
    expect(await helper.ifElementDisplayed('#p_serviceResourceAccountsGrid')).to.equal(true);
  } else {
    expect(await helper.ifElementDisplayed('#p_fulfilResourceGrid')).to.equal(true);
    expect(await helper.ifElementDisplayed('#p_serviceResourceGrid')).to.equal(true);
  }
  await helper.click('button[class*=\'dialog__control__node_modules\']');
});
Then(/^add below entitlements with Resources and register the customeruser$/, async function (details) {

  const Entitlements = details.hashes();

  for (const act of Entitlements) {
    if (act.entitlement === 'Custom Role') {
      act.entitlement = this.roleName;
    }
    if (act.entitlement === 'CC03_Authorised Signatory' || act.entitlement === 'All Institutional Insights') {
      this.accountNumber = this.divisionapi.divisionId;
      this.resourceGroupName = this.billentNumber;
    }
    console.log(act.entitlement);
    if (act.Resources.includes(',')) {
      act.Resources = act.Resources.split(',');
    }
    if (act.entitlement === 'replicate') {
      await users.replicate(this.userData);
    } else {
      await users.addEntitlement(this.Customer, act.entitlement, act.Resources, null, null, null, this.accountNumber, this.resourceGroupName, this.legalEntityName, null, null);
      //      await users.authorisation('C');
    }
  }

  await users.submit();
});

Then(/^modify and add below entitlements with Resources and register the customeruser$/, async function (details) {
  // if (await helper.ifElementExists(selectors.Users.registerUserNotificationMessage)) {
  //   await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  // } else {
  //   await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  //   await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  //   await users.searchManageUsers(this.userData);
  //   await users.selectUsersFromGrid();
  // }
  await users.editUsersviaActions();

  const Entitlements = details.hashes();
  for (const act of Entitlements) {
    if (act.entitlement === 'Custom Role') {
      act.entitlement = this.roleName;
    }
    if (act.entitlement === 'CC03_Authorised Signatory' || act.entitlement === 'All Institutional Insights') {
      this.accountNumber = this.divisionapi.divisionId;
      this.resourceGroupName = this.billentNumber;
    }
    console.log(act.entitlement);
    if (act.Resources.includes(',')) {
      act.Resources = act.Resources.split(',');
    }
    if (act.entitlement === 'replicate') {
      await users.replicate(this.userData);
    } else {
      await helper.click(selectors.Users.editEntitlementsTab);
      await users.addEntitlement(this.Customer, act.entitlement, act.Resources, null, null, null, this.accountNumber, this.resourceGroupName, this.legalEntityName, null, null);
      //      await users.authorisation('C');
    }
  }

  await users.submit();
});


Then(/^modify and remove below entitlements with Resources and register the customeruser$/, async (entitlement) => {
  await users.editUsersviaActions();
  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  const Entitlements = entitlement.hashes();
  for (const act of Entitlements) {
    await helper.pressCtrlKeyDown();
    await helper.pause(2);
    await helper.ClickbasedonText(act.entitlement, selectors.Users.entitlementOptions.selected);
    await helper.releaseCtrlKey();
    await helper.pause(2);
    await helper.click(selectors.Users.registerUserRemoveEntitlements);
    await helper.click(selectors.Users.confirmEntitlements);
  // await users.removeEntitlement(this.Customer, entitlement);
  //      await users.authorisation('C');
  // }
  }
  await users.submit();
});

Then(/^modify and add below entitlements with Resources to COBRAuser$/, async function (details) {
  // if (await helper.ifElementExists(selectors.Users.registerUserNotificationMessage)) {
  //   await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  // } else {
  //   await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  //   await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  //   await users.searchManageUsers(this.userData);
  //   await users.selectUsersFromGrid();
  // }
  await users.editUsersviaActions();
  const Entitlements = details.hashes();
  for (const act of Entitlements) {
    if (act.entitlement === 'Custom Role') {
      act.entitlement = this.roleName;
    }
    if (act.entitlement === 'CC03_Authorised Signatory' || act.entitlement === 'All Institutional Insights') {
      this.accountNumber = this.divisionapi.divisionId;
      this.resourceGroupName = this.billentNumber;
    }
    console.log(act.entitlement);
    if (act.Resources.includes(',')) {
      act.Resources = act.Resources.split(',');
    }
    if (act.entitlement === 'replicate') {
      await users.replicate(this.userData);
    } else {
      await helper.click(selectors.Users.cobrauserentitlementtab);
      await users.addEntitlement(this.Customer, act.entitlement, act.Resources, null, null, null, this.accountNumber, this.resourceGroupName, this.legalEntityName, null, null);
      //      await users.authorisation('C');
    }
  }

  await users.submit();
});



Then(/^modify and remove below entitlements with Resources and register the COBRAuser$/, async (entitlement) => {
  await users.editUsersviaActions();
  await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
  await helper.click(selectors.Users.cobrauserentitlementtab);
  const Entitlements = entitlement.hashes();
  for (const act of Entitlements) {
    await helper.pressCtrlKeyDown();
    await helper.pause(2);
    await helper.ClickbasedonText(act.entitlement, selectors.Users.entitlementOptions.selected);
    await helper.releaseCtrlKey();
    await helper.pause(2);
    await helper.click(selectors.Users.registerUserRemoveEntitlements);
    await helper.click(selectors.Users.confirmEntitlements);
    // await users.removeEntitlement(this.Customer, entitlement);
    //      await users.authorisation('C');
    // }
  }
  await users.submit();
});


Then(/^modify below DSS entitlements with Resources to (CAASuser|COBRAuser)$/, async function (usrtype, details) {
  if (await helper.ifElementDisplayedAfterTime(selectors.Users.registerUserNotificationMessage, 100))
  {
    await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  }
  await helper.pause(2)
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);
  if (usrtype == 'COBRAuser') await users.searchManageUsers(this.COBRAuserData);
  else await users.searchManageUsers(this.userData);
  await users.selectUsersFromGrid();
  await helper.pause(1)
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickEditBtn);
  await helper.pause(2);
  // await users.editUsersviaActions();
  const userData = details.hashes();
  const entitlementDetailList = [];
  for (const act1 of userData) {
    const LegalEntityArray = [];
    const ResourceGroupArray = [];
    const AccountArray = [];
    // these arrays have to be declared inside this loop because we send multiple rows
    const legalEntity = act1.AddLegalEntity.includes(',') ? act1.AddLegalEntity.replace(/ /g, '').split(',') : [act1.AddLegalEntity];
    for (const i in legalEntity) {
      LegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === legalEntity[i] ? item.businessIdNumber : undefined))[0]);
    }
    // console.log(LegalEntityArray)

    const resourceGroup = act1.AddResourceGroup.includes(',') ? act1.AddResourceGroup.replace(/ /g, '').split(',') : [act1.AddResourceGroup];
    for (const i of resourceGroup) {
      ResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === i ? item.resourceGroupName : undefined))[0]);
    }
    // console.log(ResourceGroupArray)

    const account = act1.AddAccount.includes('&') ? act1.AddAccount.replace(/ /g, '').split('&') : [act1.AddAccount];
    for (const i in account) {
      const a = account[i].includes(',') ? account[i].split(',') : [account[i]];
      const hostSystem = a.shift();
      // console.log(a)
      // console.log(hostSystem)
      for (const j in a) {
        AccountArray.push(_.compact(this.accountsArray.map((item) => item.host === hostSystem && item.hostIndex === a[j] ? item.accountNumber : undefined))[0]);
      }
    }
    // console.log(ResourceGroupArray)
    const orderList = act1.Order.includes(',') ? act1.Order.split(',') : [act1.Order];

    entitlementDetailList.push({
      entitlement: act1.RoleName ? act1.RoleName : undefined,
      account: AccountArray,
      legalEntity: LegalEntityArray,
      resourceGroup: ResourceGroupArray,
      order: _.compact(orderList),
    });
  }
  console.log(_.compact(entitlementDetailList));
  for (const j in entitlementDetailList) {
    if ((entitlementDetailList[j].order).includes('remove')) {
      console.log((entitlementDetailList[j].order));
      if (usrtype === 'COBRAuser') {
        await helper.pause(1);
        await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
        await helper.click(selectors.Users.cobrauserentitlementtab);
      } else {
        await helper.pause(1);
        await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.editEntitlementsTab);
      }

      await helper.pause(1);
      await helper.selectElementBasedOnTexts(entitlementDetailList[j].entitlement, selectors.Users.entitlementOptions.selected);
      await helper.pause(2)
      await helper.click(selectors.Users.registerUserRemoveEntitlements);
      await helper.pause(1)
      await helper.click(selectors.Users.confirmEntitlements);
      // await helper.pause(2)
    } else {
      if (usrtype === 'COBRAuser') {
        await helper.pause(2);
        await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
        await helper.click(selectors.Users.cobrauserentitlementtab);
      } else {
        await helper.pause(2);
        await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.editEntitlementsTab);
      }
      if (entitlementDetailList[j].order.includes(',')) {
        entitlementDetailList[j].order = entitlementDetailList[j].order.split(',');
      } else {
        entitlementDetailList[j].order = entitlementDetailList[j].order;
      }
      await helper.pause(2);
      await users.addEntitlement(this.Customer, entitlementDetailList[j].entitlement.toString(), entitlementDetailList[j].order, null, null, null, entitlementDetailList[j].account, entitlementDetailList[j].resourceGroup, entitlementDetailList[j].legalEntity, null, null);
    }
  }
  await users.submit();
});


Then(/^modify by removing below individual Resources from DSS entitlements of COBRAuser$/, async function (details) {
  // await helper.pause(2);
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.waitForDisplayed(selectors.Users.userId);
  await users.searchManageUsers(this.COBRAuserData);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickEditBtn);
  await helper.pause(2);

  const userData = details.hashes();
  const entitlementDetailList = [];

  for (const act1 of userData) {
    const sLegalEntityArray = [];
    const fLegalEntityArray = [];
    const sResourceGroupArray = [];
    const fResourceGroupArray = [];
    const sAccountArray = [];
    const fAccountArray = [];

    // these arrays have to be declared inside this loop because we have multiple rows in datatable

    // Accounts
    const fact = act1.Account_Fufil ? (act1.Account_Fufil.includes(',') ? act1.Account_Fufil.replace(/ /g, '').split(',') : [act1.Account_Fufil]) : undefined;
    const sact = act1.Account_Service ? (act1.Account_Service.includes(',') ? act1.Account_Service.replace(/ /g, '').split(',') : [act1.Account_Service]) : undefined;
    for (const i in fact) {
      fAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === fact[i] ? item.accountNumber : undefined))[0]);
    }
    for (const i in sact) {
      sAccountArray.push(_.compact(this.accountsArray.map((item) => item.index === sact[i] ? item.accountNumber : undefined))[0]);
    }
    console.log(fAccountArray);
    // Legal Entity
    const fle = act1.LegalEntity_Fulfil ? (act1.LegalEntity_Fulfil.includes(',') ? act1.LegalEntity_Fulfil.replace(/ /g, '').split(',') : [act1.LegalEntity_Fulfil]) : undefined;
    const sle = act1.LegalEntity_Service ? (act1.LegalEntity_Service.includes(',') ? act1.LegalEntity_Service.replace(/ /g, '').split(',') : [act1.LegalEntity_Service]) : undefined;
    for (const i in fle) {
      fLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === fle[i] ? item.legalEntityName : undefined))[0]);
    }
    for (const i in sle) {
      sLegalEntityArray.push(_.compact(this.legalEntityArray.map((item) => item.index === sle[i] ? item.legalEntityName : undefined))[0]);
    }
    console.log(sLegalEntityArray);
    // Resource Groups
    const frg = act1.ResourceGroup_Fulfil ? (act1.ResourceGroup_Fulfil.includes(',') ? act1.ResourceGroup_Fulfil.replace(/ /g, '').split(',') : [act1.ResourceGroup_Fulfil]) : undefined;
    const srg = act1.ResourceGroup_Service ? (act1.ResourceGroup_Service.includes(',') ? act1.ResourceGroup_Service.replace(/ /g, '').split(',') : [act1.ResourceGroup_Service]) : undefined;
    for (const i in frg) {
      fResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === frg[i] ? item.resourceGroupName : undefined))[0]);
    }
    for (const i in srg) {
      sResourceGroupArray.push(_.compact(this.resourceGroupArray.map((item) => item.index === srg[i] ? item.resourceGroupName : undefined))[0]);
    }
    console.log(sResourceGroupArray);

    entitlementDetailList.push({
      entitlement: act1.RoleName.toString(),
      p_fulfilResourceAccounts: fAccountArray,
      p_fulfilResource: fLegalEntityArray,
      p_fulfilResourceGroup: fResourceGroupArray,
      p_serviceResourceAccounts: sAccountArray,
      p_serviceResource: sLegalEntityArray,
      p_serviceResourceGroup: sResourceGroupArray,
    });
  }
  // console.log(_.compact(entitlementDetailList));
  for (const j in entitlementDetailList) {
    await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
    await helper.click(selectors.Users.cobrauserentitlementtab);
    await helper.pause(1);
    await helper.doubleClickbasedonText(entitlementDetailList[j].entitlement, selectors.Users.entitlementOptions.selected);

    const res = ['p_fulfilResourceAccounts', 'p_fulfilResource', 'p_fulfilResourceGroup', 'p_serviceResourceAccounts', 'p_serviceResource', 'p_serviceResourceGroup'];
    for (const i in res) {
      const grid_wrap = `//div[@id=\'${res[i].toString()}Grid_wrap\']`;
      const selector = `//div[@id=\'${res[i].toString()}Grid\']//*[@class=\'grid-canvas\']//div[contains(text(),\'obj\')]`;
      let product;
      console.log(grid_wrap);
      console.log(selector);
      const r = res[i].toString();
      let array;

      switch (r) {
        default: console.log('1'); break;
        case 'p_fulfilResourceAccounts':
          array = entitlementDetailList[j].p_fulfilResourceAccounts; break;
        case 'p_serviceResourceAccounts':
          array = entitlementDetailList[j].p_serviceResourceAccounts; break;
        case 'p_fulfilResource':
          array = entitlementDetailList[j].p_fulfilResource; break;
        case 'p_serviceResource':
          array = entitlementDetailList[j].p_serviceResource; break;
        case 'p_serviceResourceGroup':
          array = entitlementDetailList[j].p_serviceResourceGroup; break;
        case 'p_fulfilResourceGroup':
          array = entitlementDetailList[j].p_fulfilResourceGroup; break;
      }
      console.log(array);
      logger.info(i);
      product = res[i].includes('p_fulfil') ? 'Fulfilment' : 'Services';
      console.log((product));
      if (array.length > 0) {
        console.log((array));
        await helper.pause(1);
        expect(await helper.ifElementDisplayed(grid_wrap)).to.equal(true);
        for (const k in array) {
          logger.info(`Removing - ${array[k]}`);
          const a = await helper.ClickReturnbasedonText(array[k], selector);
          console.log(a);
          await helper.ClickbasedonText(product, selectors.Users.entitlementOptions.Remove);
          expect(await helper.ifElementDisplayed(a)).to.equal(false);
        }
      }
    }
    await users.ok();
  }
  await users.submit();
});

Then(/^add below entitlements with {2}Resources and modify the customeruser$/, async function (details) {
  const Entitlements = details.hashes();

  for (const act of Entitlements) {
    if (act.entitlement === 'Custom Role') {
      act.entitlement = this.roleName;
    }
    if (act.entitlement === 'CC03_Authorised Signatory' || act.entitlement === 'All Institutional Insights') {
      this.accountNumber = this.divisionapi.divisionId;
      this.resourceGroupName = this.billentNumber;
    }

    console.log(this.resourceGroupName);
    if (act.Resources.includes(',')) {
      act.Resources = act.Resources.split(',');
    }

    if (act.entitlement === 'replicate') {
      await users.replicate(this.userData);
    }
  }
  //  await users.authorisation('C');
  await users.submit();
});


Then(/^validate the Summary Grid for FR users$/, async () => {
  logger.info('Validating for Status, Workflow and Status ');
  await helper.waitForDisplayed(MenuBar.selectors.onboarding, 15000);
  await helper.waitForDisplayed(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.users);
  await helper.waitForDisplayed(selectors.searchGrid.resetBtn);
  await helper.click(selectors.searchGrid.resetBtn);
  const workflowList = ['Approved', 'Pending Approval - Create', 'Pending Approval - Register'];
  const sourceList = ['CAAS', 'COBRA', 'COBRA,CAAS'];
  const statusList = ['New'];
  for (const k in sourceList) {
    for (const i in workflowList) {
      console.log(`Workflow : ${workflowList[i]}`);

      for (const j in statusList) {
        await helper.waitForDisplayed(selectors.searchGrid.resetBtn);
        await helper.click(selectors.searchGrid.resetBtn);
        await helper.scrollToElement(selectors.searchGrid.status);
        await helper.inputText(selectors.searchGrid.status, statusList[j]);

        await helper.click(selectors.searchGrid.hostSystemDiv);
        console.log(`Status : ${statusList[j]}`);
        await helper.scrollToElement(selectors.searchGrid.workflow);
        if (workflowList[i] === 'Approved') {
          await helper.inputText(selectors.searchGrid.workflow, workflowList[i]);

          await helper.click(selectors.searchGrid.hostSystemDiv);
        } else if (workflowList[i] === 'Pending Approval - Create' || 'Pending Approval - Register') {
          await helper.inputText(selectors.searchGrid.workflow, 'Pendin');

          await helper.click(`//span[contains(text(),\'${workflowList[i]}\')]`);
        }
        if (sourceList[k] == 'COBRA,CAAS') {
          await helper.scrollToElement(selectors.searchGrid.sourceSystem);
          await helper.inputText(selectors.searchGrid.sourceSystem, 'CAAS');

          await helper.click(selectors.searchGrid.hostSystemDiv);

          await helper.scrollToElement(selectors.searchGrid.sourceSystem);
          await helper.inputText(selectors.searchGrid.sourceSystem, 'COBRA');

          await helper.click(selectors.searchGrid.hostSystemDiv);
          console.log('Source System : COBRA & CAAS');
        } else {
          await helper.scrollToElement(selectors.searchGrid.sourceSystem);
          await helper.inputText(selectors.searchGrid.sourceSystem, sourceList[k]);

          await helper.click(selectors.searchGrid.hostSystemDiv);
          console.log(`Source System : ${sourceList[k]}`);
        }
        await helper.waitForDisplayed(selectors.searchGrid.searchBtn);
        await helper.click(selectors.searchGrid.searchBtn);
        if (await helper.ifElementDisplayedAfterTime('#confirmButton')) {
          await helper.click('#confirmButton');
        }
        const a = await helper.ifElementDisplayedAfterTime('//div[contains(@class,\'grid-canvas\')]/div');
        logger.info(a);
        if (!a) {
          logger.info('No record found');
          await helper.click(selectors.searchGrid.resetBtn);
        } else {
          expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div//div[contains(text(),\'${statusList[j]}\')]`)).to.be.equal(true);
          expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div//div[contains(text(),\'${workflowList[i]}\')]`)).to.be.equal(true);
          if (sourceList[k] == 'COBRA,CAAS' && workflowList[i] == 'Pending Approval - Register') {
            expect(await helper.ifElementDisplayedAfterTime('//div[contains(@class,\'grid-canvas\')]/div//div[contains(text(),\'CAAS\')]')).to.be.equal(true);
          } else if (sourceList[k] == 'COBRA,CAAS' && workflowList[i] == 'Pending Approval - Create') {
            expect(await helper.ifElementDisplayedAfterTime('//div[contains(@class,\'grid-canvas\')]/div//div[contains(text(),\'COBRA\')]')).to.be.equal(true);
          } else {
            expect(await helper.ifElementDisplayedAfterTime(`//div[contains(@class,'grid-canvas')]/div//div[contains(text(),\'${sourceList[k]}\')]`)).to.be.equal(true);
          }
          logger.info(`Successfully Validated,  ${statusList[j]} : ${workflowList[i]} : ${sourceList[k]}`);
        }
      }
    }
  }
});

Then(/^BankUser validated the Audit Scenarios for Customer User$/, async function (details) {
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
  await helper.waitForEnabled(MenuBar.selectors.onboarding);
  await helper.click(MenuBar.selectors.onboarding);
  await helper.waitForDisplayed(MenuBar.selectors.users);
  await helper.click(MenuBar.selectors.users);

  await helper.inputText(selectors.searchGrid.customerId, this.data.customerId);
  await helper.click(selectors.Users.searchBtn);
  await users.selectUsersFromGrid();
  // await cobracustomer.searchUsers(this.customer);
  // await cobracustomer.selectCustomerFromGrid();
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  await helper.pause(2);
  logger.info(this.customerId);
  await helper.click(selectors.Users.auditTab);
  await helper.waitForDisplayed('div[id=\'user-audit-grid\']', 1500);
  for (const i in auditvalidations) {
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].description)).to.be.equal(true);
    expect(await helper.ifElementDisplayedAfterTime(auditvalidations[i].action)).to.be.equal(true);
    if (auditvalidations[i].action.includes('Created') || auditvalidations[i].action.includes('Modified')) {
      const x = await auditvalidations[i].action.includes('Created');
      await helper.doubleClick(auditvalidations[i].description);
      await helper.pause(2);
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await users.userAuditValidation(await x);
    } else if (auditvalidations[i].action.includes('Deregistered')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Customer User-Deregistered');
      logger.info('Validated Audit-Deregistered Customer User');
      await helper.click('//i[@class=\'fa fa-times\']');
    } else if (auditvalidations[i].action.includes('Approved')) {
      logger.info(await helper.getElementText(auditvalidations[i].description));
      await helper.doubleClick(auditvalidations[i].description);
      await helper.screenshot('Audit-Customer User-Approved');
      logger.info('Validated Audit-Approved Customer User');
      await helper.click('//i[@class=\'fa fa-times\']');
    }
  }
});

Then(/^Compare the entitlements between COBRA and CAAS$/, async function () {
  const x = [];
  const y = [];
  if ((process.env.DB_CHECK).toString() === 'true') {
    const CAAS = `Select *  from table ( CA_OWNER.CUSTUSERENT.getent('${this.userData.userId}', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'N'))`;
    const CAASOwner = await users.DBvalidations(CAAS);
    const COBRA = `Select *  from table ( CA_OWNER.CUSTUSERENT.getent('${this.COBRAuserData.userId.toUpperCase()}', NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'N'))`;
    const COBRAOwner = await users.DBvalidations(COBRA);
    for (const i in COBRAOwner) {
      x.push(`${jp.query(await COBRAOwner[i], '$..PRODUCT_FAMILY_ID')},${jp.query(await COBRAOwner[i], '$..PRODUCT_ID')},${jp.query(await COBRAOwner[i], '$..PRODUCT_FEATURE')},${jp.query(await COBRAOwner[i], '$..PERMISSION')},${jp.query(await COBRAOwner[i], '$..PRODUCT_CATEGORY')}`);
    }
    for (const i in CAASOwner) {
      y.push(`${jp.query(await CAASOwner[i], '$..PRODUCT_FAMILY_ID')},${jp.query(await CAASOwner[i], '$..PRODUCT_ID')},${jp.query(await CAASOwner[i], '$..PRODUCT_FEATURE')},${jp.query(await CAASOwner[i], '$..PERMISSION')},${jp.query(await CAASOwner[i], '$..PRODUCT_CATEGORY')}`);
    }

    expect(x).to.have.members(y);
  }
  logger.info('No DB validation skipping this step');
});

Then(/^Validate "([^"]*)" functionality$/, async (action) => {
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.oneOf(['No Entitlements are selected, Please select at least one to proceed.', '']);
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.click('//i[@class=\'fa fa-times fa-fw\']');
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.click('//i[@class=\'fa fa-times fa-fw\']');
});
Then(/^Validate cobra user "([^"]*)" functionality$/, async (action) => {
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
  await helper.click(selectors.Users.cobrauserentitlementtab);
  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.oneOf(['No Entitlements are selected, Please select at least one to proceed.', '']);
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.click('//i[@class=\'fa fa-times fa-fw\']');
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.click('//i[@class=\'fa fa-times fa-fw\']');
});
Then(/^modify the user by Removing entitlements "([^"]*)"$/, async (data) => {
  let entitlements;
  if (data.includes(',')) {
    entitlements = data.split(',');
  } else {
    entitlements = data;
  }
  // await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.equal('No Entitlements are selected, Please select at least one to proceed.');
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.pressCtrlKeyDown();
  for (const i in entitlements) {
    await helper.ClickbasedonText(entitlements[i], selectors.Users.entitlementOptions.selected);
  }
  await helper.releaseCtrlKey();

  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.equal('This will remove the selected entitlements for the user.');
  await helper.click(selectors.Users.confirmEntitlements);
});
Then(/^modify the cobra user by Removing entitlements "([^"]*)"$/, async (data) => {
  let entitlements;
  if (data.includes(',')) {
    entitlements = data.split(',');
  } else {
    entitlements = data;
  }
  await helper.waitForElementToDisAppear(selectors.Users.registerUserNotificationMessage, 100);
  await users.editUsersviaActions();

  await helper.waitForDisplayed(selectors.Users.cobrauserentitlementtab);
  await helper.click(selectors.Users.cobrauserentitlementtab);
  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.equal('No Entitlements are selected, Please select at least one to proceed.');
  await helper.click(selectors.Users.confirmEntitlements);
  await helper.pressCtrlKeyDown();
  for (const i in entitlements) {
    await helper.ClickbasedonText(entitlements[i], selectors.Users.entitlementOptions.selected);
  }
  await helper.releaseCtrlKey();

  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.BankUsers.notifactionDialogue)).to.be.equal('This will remove the selected entitlements for the user.');
  await helper.click(selectors.Users.confirmEntitlements);
});


When(/^remove below entitlements for the customeruser$/, async function (entitlements) {
  const roles = entitlements.hashes();
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']', 15000);
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);
  await users.selectUsersFromGrid();
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickEditBtn);
  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  for (const role of roles) {
    const entitlement = await selectors.Users.entitlementsGridElement.replace('value', role.entitlement);
    await users.selectEntitlementFromGrid(entitlement);
    await helper.pause(2);
    await helper.click(selectors.Users.registerUserRemoveEntitlements);
    expect(await helper.getElementTextIfPresent(selectors.Users.confirmationEntitlementsMessage)).to.include(

      'This will remove the selected entitlements for the user.',
    );

    await helper.click(selectors.Users.confirmEntitlements);
  }
});


Then(/^validate remove entitlement message with no entitlements$/, async () => {
  await helper.click(selectors.Users.registerUserRemoveEntitlements);
  expect(await helper.getElementTextIfPresent(selectors.Users.notificationEntitlementsMessage)).to.equal(
    'No Entitlements are selected, Please select at least one to proceed.',
  );
  await helper.click(selectors.Users.confirmEntitlements);
});

Then(/^validate the user with$/, async function (details) {
  const Entitlements = details.hashes();
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);

  await helper.click(selectors.Users.gridFirstElement);
  await helper.rightClick(selectors.Users.gridFirstElement, selectors.Users.gridElementRightClickViewBtn);

  // await helper.pause(2);
  await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
  await helper.click(selectors.Users.editEntitlementsTab);
  for (const act of Entitlements) {
    await helper.doubleClickbasedonText(act.entitlements, selectors.Users.entitlementOptions.selected);
    if (act.Type === 'Resource') {
      for (const i in this.Customer.accounts) {
        const entitlement2 = `.//label[contains(node(), '${act.Product}')]/../following-sibling::div/div[2]/div/div[3]/div/div/div/div[6]/div/div/div[contains(text(), '${this.Customer.accounts[i]}')]`;
        if (await helper.ifElementDisplayed(entitlement2)) {
          await helper.scrollToElement(entitlement2);
        }
        expect(await helper.ifElementDisplayed(entitlement2)).to.equal(true);
      }
      await helper.click('button[class*=\'dialog__control__node_modules\']');
    }
  }

});
