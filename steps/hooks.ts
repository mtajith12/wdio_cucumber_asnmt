import { After, Before, BeforeAll } from 'cucumber';
import { getLogger } from 'log4js';
import { helper } from 'src/Helper';
import { MenuBar } from 'src/MenuBarPage';
import { cobraloginPage } from 'src/Login';

const logger = getLogger();
logger.level = 'error';

BeforeAll(() => {
});

Before(() => {
//   browser.setTimeout({ pageLoad: 600000 });

  // await helper.openURL("/home/channel/login.html");
});

After(async (scenario) => {
  // // // await helper.pause(500000);
  if (scenario.result.status === 'failed') {
    try {
//      const scenarioName = scenario.pickle.name !== undefined ? scenario.pickle.name.replace(/\//g, '') : '-';
      const filename = `failed - ${
        encodeURIComponent(new Date().toDateString().replace(/\s/g, ''))
				 }-${
				 encodeURIComponent(browser.capabilities.browserName.replace(/\s/g, ''))}`;
      browser.saveScreenshot(`./screen-shots/${filename}.png`);

      // make sure COBRA UI is logged out to work around ONAR-3997
      if (await helper.isElementPresent(MenuBar.selectors.signOut)) {
        await MenuBar.signOut();
        await helper.waitForDisplayed(cobraloginPage.elements.userName);
      }
    } catch (err) {
      logger.error(err);
      browser.saveScreenshot(
        `./screen-shots/${
				 new Date().toDateString().replace(/\s/g, '')
				 }.png`,
      );
    }

    //await MenuBar.signOut();
  }
});
