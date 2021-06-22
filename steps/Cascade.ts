import { helper } from 'src/Helper';
import { expect } from 'chai';
import { getLogger } from 'log4js';
import { selectors } from 'src/Selectors';
import { MenuBar } from 'src/MenuBarPage';
import { CreateDivision } from 'src/CreateDivisionPage';
import { cascade } from 'src/Cascadeentities';
import { users } from 'src/Users';
import { CreateRole } from 'src/CreateRole';
import _ = require('lodash');
import {cobracustomer} from "src/CreateCustomerPage";
const logger = getLogger();
let accounts;
const { Then, When } = require('cucumber');

// Then(/^click on continue and select the products$/, async function () {
//	logger.info(this);
//	await cobracustomer.continue();
//	await cobracustomer.selectingProductSettings(this.Customer.productSettings);
// });


When(/^Bankuser verifies division doesnt have "([^"]*)" "([^"]*)"$/, async function (list, Action) {
  logger.info('am here');
  await cascade.Cascade(this.Customer, list, Action, null, 'removes', 'Division');
});
When(/^Bankuser verifies division doesnt have "([^"]*)" "([^"]*)" from "([^"]*)"$/, async function (list, Action, productFamily) {
  await cascade.Cascade(this.Customer, list, Action, productFamily, 'removes', 'Division');
});

Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" of Division and approve the changes$/, async function (Action2, list, Action) {
  await cascade.Cascade(this.Customer, list, Action, null, Action2, 'Division');
});
Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" of Resource and approve the changes$/, async function (Action2, list, Action) {
  await cascade.Cascade(this.Customer, list, Action, null, Action2, 'Resource');
});
Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" from "([^"]*)" of Division and approve the changes$/, async function (Action2, list, Action, productFamily) {
  await cascade.Cascade(this.Customer, list, Action, productFamily, Action2, 'Division');
});
Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" of customer and approve the changes$/, async function (Action2, list, Action) {
  await cascade.Cascade(this.Customer, list, Action, null, Action2, 'Customer');
});
Then(/^modify the Division for the created User with entitlement "([^"]*)"$/, async function (entitlement) {
  await users.editUsersviaActions();
  await helper.click(selectors.Users.editEntitlementsTab);
  await helper.screenshot('entitlement Screen');
  await helper.doubleClickbasedonText(entitlement, selectors.Users.entitlementOptions.selected);
  await helper.waitForDisplayed("//select[@name='divisionUid']");
  await helper.selectByVisibleText("//select[@name='divisionUid']", `${this.divisionapi[0].divisionId} (${this.divisionapi[0].divisionId})`);
  await users.ok();
  await users.submit();
});

Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" from "([^"]*)" of Customer and approve the changes$/, async function (Action2, list, Action, productFamily) {
  await cascade.Cascade(this.Customer, list, Action, productFamily, Action2, 'Customer');
});
Then(/^verify "([^"]*)" with "([^"]*)" entitlement if the "([^"]*)" "([^"]*)" are "([^"]*)"$/, async function (role, data2, entilement, type, Action2) {
  if (data2 === 'Custom Role') {
    // eslint-disable-next-line no-param-reassign
    data2 = this.roleName;
  }
  if (role === 'Users') {
    await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
    await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
    await users.searchManageUsers(this.userData);

    if (Action2 === 'removed') {
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
      // await helper.pause(2);
      await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
      await helper.click(selectors.Users.editEntitlementsTab);
      if (type === 'Product Family') {
        const entitlement1 = `//div[contains(text(),'${data2}')]`;
        expect(await helper.ifElementDisplayed(entitlement1)).to.not.equal(true);
        await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
        await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
        await helper.click(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.registerUserAddEntitlements);
        const entitlement2 = `//optgroup[@label='${entilement}']`;
        // expect(await helper.ifElementDisplayed(entitlement2)).to.not.equal(true);
        await helper.click('button[class*=\'dialog__control__node_modules\']');
        await helper.waitForDisplayed('//button[@id=\'confirmButton\']');

        await helper.click('//button[@id=\'confirmButton\']');
      } else if (type === 'Feature') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        // await helper.pause(2);
        const entitlement1 = `//div[contains(text(),'${entilement}')]`;
        // logger.info(entitlement1)
        expect(await helper.ifElementDisplayed(entitlement1)).to.not.equal(true);
        await helper.click('button[class*=\'dialog__control__node_modules\']');
        // await helper.pause(2);
      } else if (type === 'Product') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        //        const entitlement1 = `//label[contains(text(),'${entilement}')]`;
        //        expect(await helper.ifElementDisplayed(entitlement1)).to.not.equal(true);
        if (type === 'Product') {
          const data3 = await cascade.cascadeData(this.Customer, entilement);
          for (const i in data3) {
            const x = `//label[contains(text(),'${data3[i]}')]`;
            expect(await helper.ifElementExists(x)).to.not.equal(true);
          }
        }
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else if (type === 'Resource') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        for (const i in this.Customer.accounts) {
          const entitlement2 = `.//label[contains(node(), '${entilement}')]/../following-sibling::div/div[2]/div/div[3]/div/div/div/div[6]/div/div/div[contains(text(), '${this.Customer.accounts[i]}')]`;
          expect(await helper.ifElementDisplayed(entitlement2)).to.not.equal(true);
        }
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else if (type === 'Legal Entity') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        await helper.doubleClick('//*[@id=\'p_fulfilResourceGrid\']/div[@class=\'slick-viewport\']/div/div/div[1]');
        // await helper.pause(2);
        accounts = await helper.getElementText('//div[@id=\'legalEntityAccountLookupGrid\']/div[@class=\'slick-viewport\']/div');

        expect(await accounts.includes(this.Customer.accounts[_.toInteger(entilement) - 1])).to.not.equal(true);
        await helper.click('.//button[contains(text(),\'OK\')]');
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else if (type === 'Resource Group') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        await helper.doubleClick('//*[@id=\'p_dompay-au-dcResourceGroupGrid\']/div[@class=\'slick-viewport\']/div/div/div[1]');
        // await helper.pause(2);
        accounts = await helper.getElementText('//div[@id=\'resourceDetailGrid\']/div[@class=\'slick-viewport\']/div');

        expect(await accounts.includes(this.Customer.accounts[_.toInteger(entilement) - 1])).to.not.equal(true);
        await helper.click('.//button[contains(text(),\'OK\')]');
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else if (type === 'Approval Discretions') {
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);

        expect(await helper.ifElementDisplayed('label[for="pg_payment_discretion"]')).to.not.equal(true);
        //  await helper.click('.//button[contains(text(),\'OK\')]');
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      }
    } else if (Action2 === 'added') {
      if (type === 'Resource Group') {
        await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
        // await helper.pause(2);
        await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.editEntitlementsTab);
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        await helper.doubleClick('//*[@id=\'p_dompay-au-dcResourceGroupGrid\']/div[@class=\'slick-viewport\']/div/div/div[1]');
        // await helper.pause(2);
        accounts = await helper.getElementText('//div[@id=\'resourceDetailGrid\']/div[@class=\'slick-viewport\']/div');

        expect(await accounts.includes(this.Customer.accounts[_.toInteger(entilement) - 1])).to.equal(true);
        await helper.click('.//button[contains(text(),\'OK\')]');
        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else if (type === 'Feature') {
        await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
        // await helper.pause(2);
        await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.editEntitlementsTab);
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        // await helper.pause(2);
        const entitlement1 = `//label[contains(text(),'${entilement}')]`;
        // logger.info(entitlement1)
        expect(await helper.ifElementDisplayed(entitlement1)).to.equal(true);
        await helper.click('button[class*=\'dialog__control__node_modules\']');
        // await helper.pause(2);
      } else if (type === 'Product') {
        await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
        // await helper.pause(2);
        await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
        await helper.click(selectors.Users.editEntitlementsTab);
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);
        // await helper.pause(2);
        //        const entitlement1 = `//label[contains(text(),'${entilement}')]`;
        //        expect(await helper.ifElementDisplayed(entitlement1)).to.not.equal(true);
        const data3 = await cascade.cascadeData(this.Customer, entilement);
        for (const i in data3) {
          let x;
          if (entilement === 'Transaction Banking Insights' || entilement === 'Supply Chain Finance') {
            x = `.//div[contains(text(),'${data3[i]}')]`;
          } else {
            x = `.//label[contains(text(),'${data3[i]}')]`;
          }
          logger.info(x);
          logger.info(await helper.ifElementDisplayed(x));
          expect(await helper.ifElementDisplayed(x)).to.be.equal(true);
        }


        await helper.click('button[class*=\'dialog__control__node_modules\']');
      } else {
        await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.editBtn);
        await helper.click(selectors.Users.editEntitlementsTab);
        // await helper.pause(2);
        await helper.doubleClickbasedonText(data2, selectors.Users.entitlementOptions.selected);

        await cascade.User(data2, this.Customer, entilement, type);
      }
    }
  }
  // await helper.pause(2);
});
Then(/^verify ([^"]*) "([^"]*)" if "([^"]*)" is "([^"]*)"$/, async function (number, entity, entityremoved, action) {
  if (entity === 'Divisions') {
    await helper.waitForDisplayed(MenuBar.selectors.division);
    await helper.click(MenuBar.selectors.division);
    await CreateDivision.searchUsers(this.Customer);
    const name = await helper.getElementText(selectors.searchGrid.gridFirstElement);
    const Division = this.Customer.divisions[_.toInteger(number) - 1].divisionId;
    if (name.includes(Division)) {
      await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
      if (entityremoved === 'Resource') {
        await helper.click('//button[@id=\'resourceTab\']');
        if (action === 'removed') {
          expect(await helper.ifElementDisplayed(`//div[contains(text,'${this.Customer.accounts[0]}')]`)).to.not.equal(true);
        }
      }
    }
  }
});
Then(/^Bankuser "([^"]*)" "([^"]*)" "([^"]*)" of "([^"]*)" and approve the changes$/, async function (Action2, list, Action, entity) {
  await cascade.Cascade(this.Customer, list, Action, null, Action2, entity);
});
Then(/^verify "([^"]*)" is deleted$/, async function (entity) {
  if (entity === 'roles') {
    await CreateRole.searchRoles(this.Customer);
    expect(await helper.ifElementDisplayed('#noResultsMessage')).to.be.equal(true);
    expect(await helper.getElementText('#noResultsMessage')).to.be.equal('No Record Found.');
  }
});
Then(/^verify Roles if the "([^"]*)" Product are "([^"]*)"$/, async function (entilement, Action2) {
  await CreateRole.searchRoles(this.Customer);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
   await helper.pause(2);
  const data4 = await cascade.cascadeData(this.Customer, entilement);
  logger.info(data4);
  for (const i in data4) {
    const y = `.//div[contains(text(),'${data4[i]}')]`;
    if (Action2 === 'removed') {
      expect(await helper.ifElementDisplayed(y)).to.not.equal(true);
    } else {
      expect(await helper.ifElementDisplayed(y)).to.be.equal(true);
    }
  }
});
Then(/^Verify the roles tab to contain "([^"]*)" in customer$/, async function (division) {
let divisions;
  if (division.includes(',')) {
    divisions = division.split(',');
  }
  await cobracustomer.searchUsers(this.data);
  await helper.doubleClick(selectors.searchGrid.gridFirstElement);
  await helper.waitForDisplayed(selectors.Customers.productsTab);
  await helper.click(selectors.Customers.rolesTab);
  await helper.click('//div[@id=\'customer-roles-grid\']//div[@class=\'grid-canvas\']/div/div/i');
  await helper.pause(2)
  for (const i in divisions) {
    expect(await helper.ifElementDisplayed(`//div[contains(text(),'${divisions[i]}')]`)).to.be.equal(true);
  } await helper.click('//button[contains(@class,\'dialog__control\')]/i[contains(@class,\'fa fa-times\')]')
});
Then(/^verify "([^"]*)" with "([^"]*)" entitlement is "([^"]*)"$/, async function (role, entilement, Action2) {
  await helper.waitForDisplayed('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await helper.click('div[class*=\'TreeNavigation\'] a[id=\'user\']');
  await users.searchManageUsers(this.userData);
  await helper.rightClick(selectors.searchGrid.gridFirstElement, selectors.searchGrid.gridElementRightClick.viewBtn);
  // await helper.pause(2);
  if (Action2 === 'removed') {
    await helper.waitForDisplayed(selectors.Users.editEntitlementsTab);
    await helper.click(selectors.Users.editEntitlementsTab);
    const entitlement1 = `//div[contains(text(),'${entilement}')]`;
    expect(await helper.ifElementDisplayed(entitlement1)).to.not.equal(true);
  }
});
