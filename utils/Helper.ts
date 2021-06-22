import { assert } from 'chai';
import { getLogger } from 'log4js';
import { XMLHttpRequest } from 'xmlhttprequest';
import cucumberJson from 'wdio-cucumberjs-json-reporter';
import * as xml from './xmlParser';
const data = require('src/DataReader');

const logger = getLogger();
logger.level = 'error';

class Helper {
  async appTitle() {
    return browser.getTitle();
  }

  async getElementText(selector) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    const elementText = await elem.getText();
    return elementText;
  }

  async getElementValue(selector) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    const value = await elem.getValue();
    return value;
  }

  async getElementAttribute(selector, attribute) {
    const elem = await $(selector);
    const attributeVal = await elem.getAttribute(attribute);
    return attributeVal;
  }

  async getElementTextIfPresent(selector) {
    try {
      await this.waitForDisplayed(selector);
      const elem = await $(selector);
      if (elem.isExisting()) {
        const elementText = await elem.getText();
        return elementText;
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  openURL(url) {
    logger.info('Inside helper', url);
    browser.url(url);
    browser.maximizeWindow();
  }

  async scrollToElement(selector) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    await elem.scrollIntoView();
  }

  async ifElementEnabled(selector) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    return elem.isEnabled();
  }

  async ifElementDisplayed(selector) {
    const elem = await $(selector);

    return elem.isDisplayed();
  }

  async isElementPresent(selector) {
    const elem = await $(selector);
    return elem.isDisplayed();
  }

  async ifElementExists(selector) {
    const elem = await $(selector);
    const isExists = await elem.isExisting();
    return isExists;
  }

  async isElementDisabled(selector) {
    return (await helper.getElementAttribute(selector, 'class')).includes('disabled');
  }

  // NOTE ONLY USE WHEN UTMOST NECCESSARY (CONSIDER USING waitfordisplayed, waitforenabled methods)
  async pause(time) {
    await browser.pause(time * 1000);
  }

  async waitForEnabled(selector, timeout?) {
    const elem = await $(selector);
    await elem.waitForEnabled({ timeout: timeout ? timeout * 1000 : 15000 });
  }


  async waitForDisplayed(selector, timeout?, reverse?) {
    if (process.env.SKIP_OIM || process.env.SKIP_OIM.toString() === 'true') {
      await browser.pause(2000);
    }
    const elem = await $(selector);
    await elem.waitForDisplayed({

      timeout: timeout ? timeout * 1000 : 4000,

      reverse: reverse || false,
    });
  }

  async switchFrame(frame) {
    await this.waitForDisplayed(frame);
    await browser.switchToFrame($(frame));
  }

  async switchToParentFrame() {
    await browser.switchToParentFrame();
  }

  async selectByIndex(selector, value) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    await elem.selectByIndex(value);
  }

  async ifElementDisplayedAfterTime(selector, timeout?) {
    try {
      const elem = await $(selector);
      await elem.waitForDisplayed({ timeout: timeout ? timeout * 1000 : 15000 });
      await elem.scrollIntoView();
      return true;
    } catch (err) {
      return false;
    }
  }

  async waitForElementToDisAppear(selector, timeout) {
    if (browser.capabilities.browserName === 'internet explorer') {
      await helper.pause(2);
    } else {
      await browser.waitUntil(
        () => $(selector).isDisplayed() === false,
        {
          timeout: timeout * 1000,
          timeoutMsg: 'Element Still Present',
          interval: 500,
        },
      );
    }
  }

  async waitForElementToAppear(selector, timeout) {
    if (browser.capabilities.browserName === 'internet explorer') {
      await helper.pause(2);
    } else {
      await browser.waitUntil(
        () => $(selector).isDisplayed() === true,
        {
          timeout: timeout * 1000,
          timeoutMsg: 'Element Still not Present',
          interval: 500,
        },
      );
    }
  }

  async waitForDisplayedAndSetValue(elemen, value: string) {
    const element = await $(elemen);
    await element.waitForDisplayed();
    await element.scrollIntoView();
    await element.setValue(value);
  }

  async waitForExist(selector, timeout?, reverse?) {
    const elem = await $(selector);
    await elem.waitForExist({ timeout: timeout ? timeout * 1000 : 15000, reverse });
  }

  async inputText(selector, text) {
    const elem = await $(selector);
    await elem.waitForDisplayed();
    await elem.clearValue();
    await elem.setValue(text);
  }

  async doubleClick(selector) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    await elem.doubleClick();
  }

  async getElementTextFromJSExecutor(selector) {
    try {
      // this.waitForExist(selector);
      const text = await browser.execute((elem) => document.querySelector(elem).textContent, selector);
      logger.info(`TEXT: ${JSON.stringify(text)}`);
      return text;
    } catch (err) {
      logger.info(`ERROR GETTING TEXT FROM JS EXECUTOR: ${err}`);
      return err;
    }
  }

  async getElementTdisplayed(selector) {
    try {
      // eslint-disable-next-line no-return-await
      const text = await browser.execute(async (elem) => await document.querySelector(elem).isEnabled(), selector);
      return await text;
    } catch (err) {
      logger.info(`ERROR GETTING  FROM JS EXECUTOR: ${err}`);
      return err;
    }
  }

  async verifyTextUntilPresent(selector, text, timeout) {
    try {
      if (browser.capabilities.browserName === 'internet explorer') {
        await browser.waitUntil(
          () => this.getElementTextFromJSExecutor(selector) === text,
          {
            timeout: timeout * 1000,
            timeoutMsg: 'Not Matched',
            interval: 10,
          },
        );
      } else {
        await browser.waitUntil(
          () => {
            this.waitForDisplayed(selector);
            return (
              $(selector)
                .getText()
                .trim() === text
            );
          },
          {
            timeout: timeout * 1000,
            timeoutMsg: 'Not Matched',
          },
        );
      }
    } catch (err) {
      assert.fail('NOT MATHCED IN CATCH BLOCK');
    }
  }

  async selectByAttribute(selector, attribute, value) {
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    await elem.selectByAttribute(attribute, value);
  }

  async rightClick(selector, value) {
    // await this.waitForEnabled(selector);
    await this.waitForDisplayed(selector);
    const elem = await $(selector);
    await elem.click({ button: 'right' });
    const xpath = await $(value);
    await browser.execute((elem1) => elem1.click(), xpath);
  }

  async selectByVisibleText(selector, text) {
    await this.waitForElementToAppear(selector, 1000);
    const elem = await $(selector);

    await elem.selectByVisibleText(text);
  }

  async getNumberOfNestedElements(selector) {
    const elem = await $$(selector);
    return elem.length;
  }

  async getNestedElements(selector) {
    const elem = await $$(selector);
    return elem;
  }

  async click(selector) {
    const elem = await $(selector);
    await elem.waitForDisplayed();
    await elem.click();
  }

  async clickInMultiple(selector, number) {
    if (browser.capabilities.browserName === 'internet explorer') {
      await browser.execute(
        `document.querySelectorAll("${selector}")[${number}].click()`,
      );
    } else {
      // $$(selector)[number].click();
      await browser.execute(
        `document.querySelectorAll("${selector}")[${number}].click()`,
      );
    }
  }


  async reloadSession() {
    await browser.reloadSession();
  }


  async createCAASUser() {
    const request = new XMLHttpRequest();

    let body = await xml.XmlParser.readXml('./data/createUser.xml');
    body = await xml.XmlParser.updateXml(body, 'PNVUSRNP01234', xml.XmlParser.uniqueString());
    const url = data.getData('caasHostName');
    request.open('POST', url, false);
    request.setRequestHeader('Content-Type', 'text/xml');
    request.onload = function () {
      if (this.status !== 200) {
        logger.info(`ERROR:${this.responseText}`);
      }
    };
    request.send(body);
    const key = await this.parseUserId(request.responseText.toString());
    return key;
  }

  async parseUserId(response) {
    const substring = await response.substr(response.indexOf('psoID ID="') + 10);
    return substring.substr(0, substring.indexOf('"'));
  }

  async uncheckAllCheckBoxes() {
    const checkboxs = await $$('input[type=\'checkbox\']');
    new Promise((resolve) => {
      checkboxs.forEach(async (checkbox, i) => {
        const xcheckbox = await checkbox.getProperty('checked').valueOf();
        if (await xcheckbox === true) {
          this.pause(1);
          await checkbox.click();
        }
        if (i === checkboxs.length - 1) {
          resolve();
        }
      });
    });
  }

  async checkIfBoxIsChecked(selector) {
    await this.scrollToElement(selector);
    const checkbox = await $(selector);
    const xcheckbox = await checkbox.getProperty('checked').valueOf();
    return xcheckbox;
  }

  async selectElementBasedOnTexts(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);

    const checkbox = await $(xelement);
    const xcheckbox = await checkbox.getProperty('checked').valueOf();

    if (await xcheckbox !== true) {
      await this.scrollToElement(xelement);
      await checkbox.click();
    }
  }

  async ClickbasedonText(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);


    const checkbox = await $(xelement);

    await this.scrollToElement(xelement);
    await this.waitForDisplayed(xelement);
    await checkbox.click();
  }

  async ClickReturnbasedonText(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);


    const checkbox = await $(xelement);

    await this.scrollToElement(xelement);
    await this.waitForDisplayed(xelement);
    await checkbox.click();
    return xelement
  }

  async doubleClickbasedonText(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);

    const checkbox = await $(xelement);
    await this.waitForDisplayed(xelement)
    await this.scrollToElement(xelement);
    await checkbox.doubleClick();
  }

  async selectRadioButtonBasedOnTexts(objElement: any, labelNames: string, value: string) {
    const xelement1 = await labelNames.replace('option', objElement);
    const xelement = await xelement1.replace('value', value);
    const radio = await $(xelement);
    await radio.scrollIntoView();
    await radio.click();
  }

  async checkboxIsDisplayed(objElement: any, labelNames: string, value: string) {
    const xelement1 = await labelNames.replace('option', objElement);
    const xelement = await xelement1.replace('value', value);
    const radio = await $(xelement);


    return await radio.isDisplayed();
  }

  async selectDropDownBasedOnTexts(objElement: any, labelNames: string, value: string) {
    const xelement1 = await labelNames.replace('obj', objElement);
    const dropDown = await $(xelement1);

    await dropDown.selectByVisibleText(value);
  }

  async inputTextBasedOnTexts(objElement: any, labelNames: string, value: string) {
    const xelement1 = await labelNames.replace('option', objElement);
    const xelement = await xelement1.replace('value', value);
    await this.scrollToElement(xelement);
    await this.waitForDisplayed(xelement);
    const text = await $(xelement);
    const value1 = await text.getProperty('value').valueOf().toString();
    if (value !== '') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (let i = 0; i < value1.length; i++) {
        await text.setValue('Backspace');
      }

      await text.setValue(value);
    }
  }

  async unSelectElementBasedOnTexts(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);

    const checkbox = await $(xelement);
    const xcheckbox = await checkbox.getProperty('checked').valueOf();

    if (xcheckbox !== false) {
      await checkbox.click();
    }
  }

  async enterReturnFromKeyboard() {
    await browser.keys('\uE007');
  }

  async enterTabFromKeyboard() {
    await browser.keys('\uE004');
  }

  async doesElementAppear(selector, timeout) {
    try {
      await this.waitForDisplayed(selector, timeout);
      return true;
    } catch (err) {
      //   console.log(err)
      if (err.toString().includes('still not displayed')) {
        return false;
      }
      throw err;
    }
  }

  async waitForTextInAttribute(selector, attribute, text, timeout?) {
    await browser.waitUntil(
      () => $(selector).getAttribute(attribute).includes(text),
      {
        timeout: timeout * 1000,
        timeoutMsg: 'Attribute Still not contain text',
        interval: 500,
      },
    );
  }

  async waitForTextToDisappearInAttribute(selector, attribute, text, timeout?) {
    await browser.waitUntil(
      () => $(selector).getAttribute(attribute).includes(text) === false,
      {
        timeout: timeout * 1000,
        timeoutMsg: 'Attribute Still contains text',
        interval: 500,
      },
    );
  }

  async waitForTextInElement(selector, text, timeout?) {
    await browser.waitUntil(
      () => $(selector).getText().includes(text),
      {
        timeout: timeout * 1000,
        timeoutMsg: 'Element still not display text',
        interval: 500,
      },
    );
  }

  async inputTextIfNotNull(selector, value) {
    if (value !== undefined) {
      await helper.inputText(selector, value);
    }
  }

  async pressCtrlKeyDown() {
    browser.performActions([
      {
        type: 'key',
        id: 'keyboard',
        actions: [{ type: 'keyDown', value: '\uE009' }],
      },
    ]);
  }

  async releaseCtrlKey() {
    browser.performActions([
      {
        type: 'key',
        id: 'keyboard',
        actions: [{ type: 'keyUp', value: '\uE009' }],
      },
    ]);
  }

  async rightClickOn(selector) {
    await this.waitForEnabled(selector);
    const elem = await $(selector);
    await elem.click({ button: 'right' });
  }

  async Checkifdisabled(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);

    const checkbox = await $(xelement);
    const xcheckbox = await checkbox.getProperty('disabled');


    return xcheckbox;
  }

  async Checkifchecked(objElement: any, labelNames: string) {
    const xelement = await labelNames.replace('obj', objElement);

    const checkbox = await $(xelement);
    const xcheckbox = await checkbox.getProperty('checked');


    return xcheckbox;
  }

  //   getSlickAttributes(elerowLocator: any, elecolumnLocator: any) {
  //   const columnNames =   this.getElementTextFromJSExecutor(elecolumnLocator);
  //   const rowNodes =   $$(elerowLocator);
  //   const results = [];
  //   rowNodes.forEach(  (rowNode) => {
  //     const rowData = browser.executeAsync((rn) => {
  //       const rows = Array.from(rn.querySelectorAll('div'));
  //       return rows.map((row) => row.textContent);
  //     }, rowNode);
  //     const searchObject = _.zipObject(columnNames, rowData);
  //     logger.info(searchObject);
  //     results.push(searchObject);
  //   });
  //   return results;
  // }
  //   searchElement(elerowLocator, elecolumnLocator) {
  //   this.waitForEnabled(elerowLocator);
  //   this.waitForEnabled(elecolumnLocator);
  //   const searchObject = this.getSlickAttributes(elerowLocator, elecolumnLocator);
  //   return searchObject;
  // };
  async screenshot(name) {
    try {
      const filename =			`${encodeURIComponent(new Date().toISOString().replace(/\s/g, ''))
      }-${
        name
      }-${
        encodeURIComponent(browser.capabilities.browserName.replace(/\s/g, ''))}`;
      await browser.saveScreenshot(`./screen-shots/${filename}.png`);
    } catch (err) {
      logger.error(err);
      await browser.saveScreenshot(
        `./screen-shots/${
          new Date().toDateString().replace(/\s/g, '')
        }.png`,
      );
    }
  }

  async ifDisabledAttributeExist(selector) {
    const attr = await helper.getElementAttribute(selector, 'disabled');
    return !(attr === null);
  }

  async isRadioButtonChecked(selector) {
    const attr = await helper.getElementAttribute(selector, 'checked');
    return !(attr === null);
  }

  async clearInput(selector) {
    const elem = await $(selector);
    await elem.waitForDisplayed();
    await elem.addValue(['Control', 'a']);
    await elem.addValue(['Backspace']);
  }

  async isInputTagExist(selector) {
    if (selector.nodeName === 'INPUT' || selector.nodeName === 'TEXTAREA') {
      return true;
    }
    return false;
  }

  async waitUntilTextInElement(selector, timeout?) {
    await browser.waitUntil(
      () => $(selector).getText() && $(selector).getText() !== null && $(selector).getText().trim() !== '',
      {
        timeout: timeout * 1000,
        timeoutMsg: 'Element still not display text',
        interval: 500,
      },
    );
  }

  async getSelectedOptionTextInDropdown(selector) {
    const optionIdx = await helper.getElementAttribute(selector, 'value');
    const option = `${selector} option[value="${optionIdx}"]`;
    return (await helper.getElementText(option)).trim();
  }
}


const helper = new Helper();
export { helper };
