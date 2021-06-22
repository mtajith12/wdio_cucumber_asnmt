@Chrome @ie @COBRA @OIM @CustomerAssignment.feature
Feature: End to end tests for viewing Customers tab under an CAAS ORG
	As a Bank User
	BankUser want to be able to view Customers assigned to CAAS

	@AAMS-3254
  Scenario: COBRA UI: View Users under Org in Org details page
	Given "Default OIM Bankuser" creates "1" organisations with all applications
	Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
		| applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
		| securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
	Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
	    | applications    | EsandaNet;Institutional Insights;Online Trade |
		| securityDevices | ANZ Digital Key                               |
	Given "Default OIM Bankuser" logins in to COBRA using a valid password
	And BankUser navigates to search CAAS Orgs page
	Then BankUser search orgID of org created by API at no. 1 and verify results
	Then BankUser open the Org details page from search result
	Then BankUser clicks on "Customers" tab
	Then BankUser views Customers tab and checks screen tab elements are correct
	
	@AAMS-3256
  Scenario: COBRA UI: Display Customers under Org in Org details page
	Given "Default OIM Bankuser" creates "1" organisations with all applications
	Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
		| applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
		| securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
	Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
	    | applications    | EsandaNet;Institutional Insights;Online Trade |
		| securityDevices | ANZ Digital Key                               |
	Given "Default OIM Bankuser" logins in to COBRA using a valid password
	And BankUser navigates to search CAAS Orgs page
	Then BankUser search orgID of org created by API at no. 1 and verify results
	Then BankUser open the Org details page from search result
	Then BankUser view the Org Customers tab and verify the Customers

	@AAMS-3255
Scenario: No Customer associated with Cass ORG:
	Given "Default OIM Bankuser" creates "1" organisations with all applications
	Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
	    | applications    | EsandaNet;Institutional Insights;Online Trade |
		| securityDevices | ANZ Digital Key                               |
			Given "Default OIM Bankuser" logins in to COBRA using a valid password
	And BankUser navigates to search CAAS Orgs page
	Then BankUser search orgID of org created by API at no. 1 and verify results
	Then BankUser open the Org details page from search result
	Then BankUser clicks on "Customers" tab
	Then BankUser views the Customers tab and check "No Record Found" is displayed
