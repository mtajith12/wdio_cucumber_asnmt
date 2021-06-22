import { Given, Then } from 'cucumber';
import { userRegService } from 'src/UserRegService';
const data = require('src/DataReader');
import { getLogger } from 'log4js';
const logger = getLogger();

/*
 * Update the jurisdictions / restricted countries of a bankuser, and approve the change. 
 * @param role: currently "Registration Officer (Pilot)", "Helpdesk Officer (Pilot)", for which bankusers have been defined in data.json file. 
 * @param values: for jurisdictions, list of items from 'AU', 'CN', 'HK', 'NZ', and 'SG';
 *                for restricted countries, list of items from 'TW', 'PH', 'HK', 'ID', 'SG', 'JP', 'CN' and 'KH'.
 */
Given(/^the "(.*)" is set up with Jurisdictions "(.*)" and Restricted Countries "(.*)"$/, async function(role, jurisdictions, restrictedCountries) {
  const cobraUser = data.getBankUser('Default users');
  const cobraApprover = data.getBankUser('Default approvers');
  const lanId = data.getBankUser(role).username;
  const jurisdictionList = (jurisdictions && jurisdictions !== '') ? jurisdictions.split(',') : undefined;
  const countryList = (restrictedCountries && restrictedCountries !== '') ? restrictedCountries.split(',') : undefined;
  await userRegService.updateAndApproveJurisdictionAndCountry(cobraUser, cobraApprover, lanId, role, jurisdictionList, countryList);
});

Then(/^make sure the "(.*)" is reset to have All Jurisdictions and No Restricted Countries$/, async function(role) {
  const cobraUser = data.getBankUser('Default users');
  const cobraApprover = data.getBankUser('Default approvers');
  const lanId = data.getBankUser(role).username;
  const jurisdictions = ['Australia', 'China', 'New Zealand', 'Singapore' ,'Hong Kong'];
  const restrictedCountries = undefined;
  await userRegService.updateAndApproveJurisdictionAndCountry(cobraUser, cobraApprover, lanId, role, jurisdictions, restrictedCountries);
});

