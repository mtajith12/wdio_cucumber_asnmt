import { Given } from 'cucumber';
import { cobraloginPage } from 'src/Login';
import { helper } from 'src/Helper';
const data = require('src/DataReader');
import { expect } from 'chai';
import { MenuBar } from 'src/MenuBarPage';


Given(/^"([^"]*)" logins in to COBRA using a ([^"]*) password$/, { wrapperOptions: { retry: 4 } }, async function (username, password) {
  await helper.openURL(data.getData('urlDomain'));

  const Username = (username === 'Default users') ? data.getData('cobraUserName') : 
    (username === 'Default approvers' ? data.getData('cobraApprover') : 
    (username === 'created bankuserDefault') ? this.bankuserDefault.lanId : 
    (username === 'created bankuserApprover') ? this.bankuserApprover.lanId : 
    (username === 'Default OIM Bankuser') ? data.getData('oimUserName') : 
    (username === 'Helpdesk Officer (Pilot)') ? data.getData('helpdeskOfficerPilot') : 
    (username === 'Registration Officer (Pilot)') ? data.getData('registrationOfficerPilot') : 
    (username === 'Registration Officer (Pilot) 2') ? data.getData('registrationOfficerPilot2') : 
    (username === 'Registration Officer') ? data.getData('registrationOfficer') : 
    (username === 'Implementation Manager') ? data.getData('implementationManager') : 
    (username === 'Security Device Officer') ? data.getData('securityDeviceOfficer') : 
    username);

  const Password = (username === 'Default users' || username === 'Default OIM Bankuser' || username === 'Helpdesk Officer (Pilot)' || username === 'Registration Officer (Pilot)' || username === 'Registration Officer' || username === 'Security Device Officer') ? data.getData('password') : (username === 'Default approvers' ? data.getData('passwordApprover') : password);

  await cobraloginPage.enterUserName(Username);
  await cobraloginPage.enterPassword(Password);
  await cobraloginPage.clickSubmit();
  try {

    await helper.waitForDisplayed('//div[@id=\'user\']', 30);
    const x = Username.toUpperCase();
    const login = `//span[contains(text(),'${x}')]`;
    expect(await helper.ifElementExists(login)).to.be.equal(true);
  } catch (error) {
    await MenuBar.signOut();
    throw error;
  }
});
