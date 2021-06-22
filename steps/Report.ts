
import { cobraReportPage } from 'src/UserReports';

import { Then } from 'cucumber';
import { helper } from 'src/Helper';


Then(/^Run Report "([^"]*)" "([^"]*)" for the created customer$/, async function (report, format) {
  let bankuser;
  let formats;
  switch (report) {
    default:
      await cobraReportPage.SelectReport(report, format);
      await cobraReportPage.selectCustomer(this.data);
      break;
    case 'Bank User Activity Report':
      if (format.includes(',')) {
        bankuser = this.bankuserDefault.lanId;
        formats = format.split(',')[0];
      } else {
        bankuser = 'Default';
        formats = format;
      }
      await cobraReportPage.SelectReport(report, formats);
      await cobraReportPage.selectBankuser(bankuser);
      break;
  }
});
Then(/^Download Report "([^"]*)" for the created customer$/, async (report) => {
  await cobraReportPage.DownloadReport(report);
});
Then(/^Download Report "([^"]*)" for the created customer using Download hyperlink$/, async (report) => {
  await cobraReportPage.DownloadReportHyperlink(report);
});
Then(/^Validate the "([^"]*)" "([^"]*)" Report content$/, async function (report, format) {
  switch (report) {
    default:
    case 'Customer Division Detail Report':
    case 'Authorisation Matrix Report':
    case 'Customer User Details Report':
      console.log(this.userData);
      await cobraReportPage.validateReport(this.Customer, this.userData, null, report, format);
      break;
    case 'Customer Role Detail Report':
      await cobraReportPage.validateReport(this.roleData, this.userData, null, report, format);
      break;
    case 'Bank User Activity Report,Created':
      await cobraReportPage.validateReport(this.Customer, this.userData, null, report, format);
      break;
    case 'Bank User Activity Report':
      await cobraReportPage.validateReport(undefined, undefined, null, report, format);
      break;
    case 'DE User ID Report':
      await cobraReportPage.validateReport(this.Customer, this.deuseriddetails, null, report, format);
      break;
    case 'Customer User Details Report - VAM':
    case 'Customer Division Detail Report - VAM':
      await cobraReportPage.validateReport(this.Customer, this.userData, this.resourceData, report, format);
      break;
    case 'Manage-Resources':
      await cobraReportPage.validateExport(this.Customer, this.accountNumber, null, report, format);
      break;
  }
});
Then(/^Validate the "([^"]*)" "([^"]*)" Report content for "([^"]*)"$/, async function (report, format, productFamily) {
  switch (productFamily) {
    default:
    case 'Pilot Products':
    case 'Commercial Cards':
    case 'Customer Administration':
    case 'Cash Management':
    case 'Clearing Services':
    case 'FX Overlay':
    case 'FX Services':
    case 'Institutional Insights':
    case 'Omni Demo App':
      await cobraReportPage.validateReport1(this.Customer, this.userData, null, report, format);
      break;
  }
});
// ${customer.accounts[0]}
