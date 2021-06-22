import * as fs from 'fs';
import { getLogger } from 'log4js';
const logger = getLogger();

function getData(dataName) {
  try {
    const data = fs.readFileSync(
      './data/data.json',
      'utf8',
    );
    const calls = JSON.parse(data);
    const value = calls[process.env.TESTENV || 'e2e'][dataName];
    return value;
  } catch (err) {
    logger.error(
      `Invalid data: ${dataName} to read for test env: ${process.env.TESTENV}` || 'e2e',
    );
    logger.error(err);
    return '';
  }
}

function getBankUser(user) {
  const username = (user === 'Default users') ? getData('cobraUserName') : 
  (user === 'Default approvers') ? getData('cobraApprover') : 
  (user === 'Default OIM Bankuser') ? getData('oimUserName') : 
  (user === 'Helpdesk Officer (Pilot)') ? getData('helpdeskOfficerPilot') : 
  (user === 'Registration Officer (Pilot)') ? getData('registrationOfficerPilot') : 
  (user === 'Registration Officer') ? getData('registrationOfficer') : 
  (user === 'Security Device Officer') ? getData('securityDeviceOfficer') :
  user;
  const password = (username === 'Default users' || username === 'Helpdesk Officer (Pilot)' || username === 'Registration Officer (Pilot)') ? getData('password') : (username === 'Default approvers' ? getData('passwordApprover') : 'Password@123');
  return {
    'username': username,
    'password': password,
  };
}

module.exports = {
  getData,
  getBankUser,
};
