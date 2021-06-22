import { Then } from 'cucumber';
import { getLogger } from 'log4js';
import { searchPage } from 'src/SearchPage';
import {helper} from "src/Helper";
import { expect } from "chai";
const logger = getLogger();

/*
 * This file contains the comman steps on search Org/User/Security Devices pages
 */

Then(/^BankUser reset search$/, async function() {
  logger.info('Click on Reset button on Search screen');
  await searchPage.resetSearch();
  await helper.waitForDisplayed(searchPage.selectors.searchNoteMessage);
});

Then(/^BankUser (collapse|expand) the search panel$/, async function(action) {
  logger.info(`Click on search control to ${action} the search panel`);
  await helper.click(searchPage.selectors.searchControl);
  if (action === 'collapse') {
    expect((await helper.ifElementDisplayed(searchPage.selectors.searchBar))).to.equal(false);
  } else {
    expect((await helper.ifElementDisplayed(searchPage.selectors.searchBar))).to.equal(true);
  }
});

Then(/^check the search results are paginated$/, async function() {
  logger.info('Wait for pagination message to pop up');
  await helper.waitForElementToAppear(searchPage.selectors.dialog.notificationMsg, 10);
  expect(await helper.getElementText(searchPage.selectors.dialog.notificationMsg)).to.equal(searchPage.paginationMsg);
  await helper.screenshot('searchResultPaginated');

  logger.info('Dismiss pagination message');
  await helper.click(searchPage.selectors.dialog.okBtnInConfirmDlg);

  logger.info('Check "Previous Page" button disable, while "Next Page" button enabled');
  expect(await helper.isElementDisabled(searchPage.selectors.previousPageBtn)).to.equal(true);
  expect(await helper.isElementDisabled(searchPage.selectors.nextPageBtn)).to.equal(false);
  await helper.screenshot('searchPaginationPreviousNextButtons');
});

Then(/^Bankuser dismisses pagination message if it pops up$/, async function() {
  await searchPage.dismissPaginationMsgIfPopedUp();
});

Then(/^BankUser goes to the "(Next|Previous)" page of search results$/, async function(direction) {
  logger.info(`Click on "${direction} Page button`);
  const clickOnButton = (direction === 'Next') ? searchPage.selectors.nextPageBtn : searchPage.selectors.previousPageBtn;
  const theOtherButton = (direction === 'Next') ? searchPage.selectors.previousPageBtn : searchPage.selectors.nextPageBtn;

  logger.info(`Go to ${direction} page and check the "${(direction === 'Next') ? 'Previous' : 'Next'} page" button is enabled`);
  await helper.click(clickOnButton);
  await helper.waitForElementToAppear(searchPage.selectors.loadingSpinner, 2);
  await helper.waitForElementToDisAppear(searchPage.selectors.loadingSpinner, 10);
  await helper.waitForDisplayed(searchPage.selectors.gridelement1);
  expect(await helper.isElementDisabled(theOtherButton)).to.equal(false);
});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" entry$/, { wrapperOptions: { retry: 1} }, async function(n) {
  await helper.waitUntilTextInElement(searchPage.selectors.resultGridRow, 20);

  logger.info(`Click row ${n} in the search results`);
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(n));
  await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class', 'active', 2);
});

Then(/^BankUser selects the "(\d+)(?:st|nd|rd|th)" and "(\d+)(?:st|nd|rd|th)" entries$/, { wrapperOptions: { retry: 2} }, async function(i, j) {
  await helper.waitUntilTextInElement(searchPage.selectors.resultGridRow, 20);

  logger.info(`Select item ${i} and ${j} from the search results grid`);
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(i));
  await helper.pressCtrlKeyDown();
  await helper.pause(.5);
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(j));
  await helper.pause(1);
  // 'active" only appears in the latest selection of row.
  await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(j), 'class', 'active', 2);
  await helper.releaseCtrlKey();
  await helper.screenshot('multi-select');
});

Then(/^BankUser selects all the entries$/, { wrapperOptions: { retry: 2} }, async function() {
  await helper.waitUntilTextInElement(searchPage.selectors.resultGridRow, 20);
  const count = await searchPage.getNumberOfResultEntries();
  await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(1));
  if (count >= 2) {
    await helper.pressCtrlKeyDown();
    await helper.pause(0.5);
    for (let i = 2; i <= count; i++) {
      await helper.click(searchPage.getSelectorOfNthItemInSearchResultsGrid(i));
      await helper.pause(0.5);
    }
    await helper.releaseCtrlKey();
  }
});

Then(/^check \"No Record Found\" message returned in search results grid$/, async function() {
  logger.info('Check "No Record Found" in search results');
  expect(await helper.getElementText(searchPage.selectors.noRecordFoundLabel)).to.equal(searchPage.msg007);
});

Then(/^check the "(\d+)(?:st|nd|rd|th)" row (is|is NOT) grey-ed out$/, async function(n, yesNo) {
  logger.info(`Check the row ${yesNo} grey-ed out`);
  if (yesNo === 'is') {
    await helper.waitForTextInAttribute(searchPage.getSelectorOfNthItemInSearchResultsGrid(n), 'class', 'disabled-row', 5);
    await helper.screenshot(`row-${n}-greyed-out`);
  } else {
    expect(await searchPage.isRowGreyedOut(n)).to.equal(false);
  }
});
