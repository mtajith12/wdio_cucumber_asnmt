import { Then } from 'cucumber';
import * as _ from 'lodash';
import { newOnboardingPage } from 'src/NewOnboardingPage';
import { searchPage } from 'src/SearchPage';
import { cobracustomer } from 'src/CreateCustomerPage';
import { MenuBar } from 'src/MenuBarPage';
import { expect } from 'chai';
import { helper } from 'src/Helper';
import { getLogger } from 'log4js';
import { searchSecurityDevicePage } from 'src/SearchSecurityDevicePage';
const logger = getLogger();
logger.level = 'info';

Then(/^check "(New CAAS Org|New User)" tile does( NOT|) exist in the onboarding page$/, async function(name, isDisplayed) {
  await helper.waitForDisplayed(newOnboardingPage.selectors.onBoardingPage);
  logger.info(`Check ${name} tile does${isDisplayed} exist on onboarding page`);
  let tileSelector = (name === 'New CAAS Org') ? newOnboardingPage.selectors.newCaasOrg : newOnboardingPage.selectors.newUser;
  expect((await helper.isElementPresent(tileSelector))).to.equal((isDisplayed === ' NOT' ? false : true));
  if (isDisplayed === '') expect((await helper.getElementText(tileSelector)).trim()).to.equal(name);
});

Then(/^check (Onboarding|Pending Approvals) page is NOT displayed$/, async function(page) {
  await helper.waitForDisplayed(MenuBar.selectors.signOut);
  logger.info(`Check ${page} page is not displayed`);
  const selector = (page === 'Onboarding') ? newOnboardingPage.selectors.onBoardingPage : MenuBar.selectors.pendingApproval;
  expect(await helper.ifElementDisplayed(selector)).to.equal(false);
});

Then(/^check "(CAAS Orgs|Users|Security Device Issuance)" menu item does( NOT|) exist in the Navigation menu$/, async function(name, isDisplayed) {
  logger.info(`Check ${name} menu item does${isDisplayed} exist in the Navigation menu`);
  const itemSelector = (name === 'Security Device Issuance') ? MenuBar.selectors.securityDeviceIssuance : (name === 'CAAS Orgs') ? MenuBar.selectors.caasOrgs : MenuBar.selectors.users;
  expect(await helper.ifElementDisplayed(itemSelector)).to.equal((isDisplayed === ' NOT' ? false : true));
});

Then(/^Bankuser clicks on (continue|submit) button on create Customer page$/, async function(button) {
  button === 'continue' ? await cobracustomer.continue() : await cobracustomer.submit();
});

// options parameter are passed in splitting by ",",
// For Actions Menu, it could take one or more values from "Register User, New User, View, Edit, Enalbe, Disable, Delete, Approve, Reject, Deregister",
// for Context Menu, one or more values from "View, Edit, Enalbe, Disable, Delete, Approve, Reject, Deregister, Issue Security Device". 
Then(/^check "(.*)" options are "(Enabled|Disabled)" in (Actions|Context) Menu(| for the selected entry\/entries)$/, async function(options, status, menu, entrySelected) {
  const opts = options.split(',');
  const expected = (status === 'Enabled') ? false : true;

  if (menu === 'Actions') {
    await helper.click(MenuBar.selectors.actionsMenu.menuButton);
    await helper.waitForDisplayed(MenuBar.selectors.actionsMenu.view);
  } else {
    const row = await searchPage.getRowNumberOfActiveEntry(5);
    await helper.rightClickOn(searchPage.getSelectorOfNthItemInSearchResultsGrid(row));
    // await helper.waitForDisplayed(searchPage.selectors.contextMenu.view);
  }

  for (let option of opts) {
    option = option.trim();
    let selector; 
    if (menu === 'Actions') {
      selector = (option === 'Register User') ? MenuBar.selectors.actionsMenu.registerUser :
                 (option === 'New User') ? MenuBar.selectors.actionsMenu.newUser :
                 (option === 'Approve') ? MenuBar.selectors.actionsMenu.approve :
                 (option === 'Reject') ? MenuBar.selectors.actionsMenu.reject : 
                 (option === 'Edit') ? MenuBar.selectors.actionsMenu.edit : 
                 (option === 'Enable') ? MenuBar.selectors.actionsMenu.enable :
                 (option === 'Disable') ? MenuBar.selectors.actionsMenu.disable :
                 (option === 'Delete') ? MenuBar.selectors.actionsMenu.delete :
                 MenuBar.selectors.actionsMenu.deregister;
    } else {
      selector = (option === 'Issue Security Device') ? searchPage.selectors.contextMenu.issueSecurityDeviceOption :
                 (option === 'Approve') ? searchPage.selectors.contextMenu.approve :
                 (option === 'Reject') ? searchPage.selectors.contextMenu.reject :
                 (option === 'Edit') ? searchPage.selectors.contextMenu.edit :
                 (option === 'Enable') ? searchPage.selectors.contextMenu.enable :
                 (option === 'Disable') ? searchPage.selectors.contextMenu.disable :
                 (option === 'Delete') ? searchPage.selectors.contextMenu.delete :
                 searchPage.selectors.contextMenu.deregister;
    }
    logger.info(`Check ${option} option is ${status} in the ${menu} menu`);
    expect(await helper.isElementDisabled(selector)).to.equal(expected);
  }
  await helper.screenshot(`Options${status}-${menu}Menu`);
  if (menu === 'Actions') await helper.click(MenuBar.selectors.actionsMenu.menuButton);
});

Then(/^BankUser clicks on "(Register User|New User)" option in Actions Menu and checks the "(Register User|New User)" screen is opened$/, async function(option, screen) {
  await helper.click(MenuBar.selectors.actionsMenu.menuButton);
  const selector = (option === 'Register User') ? MenuBar.selectors.actionsMenu.registerUser : MenuBar.selectors.actionsMenu.newUser;
  const openedScreenHeaderText = (option === 'Register User') ? 'Register User' : 'Create User';
  logger.info(`Clicks on ${option} menu option and check ${screen} screen is opened corrrectly`);
  await helper.click(selector);
  await helper.waitForDisplayed('h1');
  expect(await helper.getElementText('h1')).to.equal(openedScreenHeaderText);

  logger.info(`Close the ${screen} page`);
  await helper.click(MenuBar.selectors.cancel);
  await helper.waitForDisplayed(MenuBar.selectors.confirmDialog.confirmationMsg);
  await helper.click(MenuBar.selectors.confirmDialog.confirmButton);
});

Then(/^check \"Issue Security Device\" button is "(Enabled|Disabled)" in menu bar$/, async function(status) {
  const expected = (status === 'Enabled') ? false : true;
  await helper.waitForEnabled(searchSecurityDevicePage.selectors.issueSecurityDeviceBtn);
  logger.info(`Check "Issue Security Device" button is ${status} in the menu bar`);
  expect(await helper.isElementDisabled(searchSecurityDevicePage.selectors.issueSecurityDeviceBtn)).to.equal(expected);
});
