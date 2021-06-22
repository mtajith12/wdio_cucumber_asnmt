@chrome @ie @COBRA @OIM @ViewUsersInOrg.feature
Feature: End to end tests for viewing Users under an Org 
  As a Bank User
  BankUser want to be able to view Users under an Org in CAAS Org details page

  @AAMS-2410
  Scenario: COBRA UI: View Users under Org in Org details page
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    	Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
			| applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
			| securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
		Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications    | EsandaNet;Institutional Insights;Online Trade |
			| securityDevices | ANZ Digital Key                               |
		Given "Default OIM Bankuser" creates "2" users with the "1st" created Org, without a Customer, and with:
      		| applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
			| securityDevices | ANZ Digital Key                               |
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search CAAS Orgs page
		Then BankUser search orgID of org created by API at no. 1 and verify results
		Then BankUser open the Org details page from search result
    	Then BankUser view the Org details with applications
		# AAMS-774
		Then check number of active Users under App "eMatching" is Blank
		Then check number of active Users under App "EsandaNet" is Blank
		Then check number of active Users under App "GCIS" is Blank
		Then check number of active Users under App "GCP" is Blank
		Then check number of active Users under App "Institutional Insights" is Blank
		Then check number of active Users under App "Internet Enquiry Access" is Blank
		Then check number of active Users under App "LM" is Blank
		Then check number of active Users under App "Online Trade" is Blank
		Then check number of active Users under App "SDP CTS" is Blank
		Then check number of active Users under App "Transactive Global" is Blank
		# AAMS-246#01,02
		Then BankUser views the Users tab and check all the API created Users displayed correctly except "Deleted" Users
		# AAMS-414#01
		Then BankUser double clicks on the "1st" API created User from Users tab
		Then check the details of the User displayed correctly in view User page
    	Then check the View User Applications screen elements for New User
		Then check the devices in the Selected Security Devices grid in View User page
    	Then BankUser logs out
		Given "Default users" logins in to COBRA using a valid password
		And BankUser navigates to search CAAS Orgs page
		Then BankUser search orgID of org created by API at no. 1 and verify results
		Then BankUser open the Org details page from search result
		# AAMS-246#01,02
		Then BankUser views the Users tab and check all the API created Users displayed correctly except "Deleted" Users
		# AAMS-414#01
		Then BankUser double clicks on the "1st" API created User from Users tab
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User creation confirmation message, then click on "Yes" button
    	Then check the Single User creation been approved successfully
		Then BankUser closes User details page
		# AAMS-246#01
		Then check the "1st" API created User in Users tab has status "Enabled" and workflow "Approved"
		# AAMS-774
		Then BankUser clicks on "Details & Applications" tab
		Then check number of active Users under App "eMatching" is Blank
		Then check number of active Users under App "EsandaNet" is 1
		Then check number of active Users under App "GCIS" is 1
		Then check number of active Users under App "GCP" is Blank
		Then check number of active Users under App "Institutional Insights" is 1
		Then check number of active Users under App "Internet Enquiry Access" is 1
		Then check number of active Users under App "LM" is Blank
		Then check number of active Users under App "Online Trade" is 1
		Then check number of active Users under App "SDP CTS" is Blank
		Then check number of active Users under App "Transactive Global" is 1
		Then BankUser clicks on "Users" tab
		Then BankUser double clicks on the "2nd" API created User from Users tab
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User creation confirmation message, then click on "Yes" button
    	Then check the Single User creation been approved successfully
		Then BankUser closes User details page
		# AAMS-246#01
		Then check the "2nd" API created User in Users tab has status "Enabled" and workflow "Approved"
		# AAMS-774
		Then BankUser clicks on "Details & Applications" tab
		Then check number of active Users under App "eMatching" is Blank
		Then check number of active Users under App "EsandaNet" is 2
		Then check number of active Users under App "GCIS" is 1
		Then check number of active Users under App "GCP" is Blank
		Then check number of active Users under App "Institutional Insights" is 2
		Then check number of active Users under App "Internet Enquiry Access" is 1
		Then check number of active Users under App "LM" is Blank
		Then check number of active Users under App "Online Trade" is 2
		Then check number of active Users under App "SDP CTS" is Blank
		Then check number of active Users under App "Transactive Global" is 1
		Then BankUser closes Org Details page
		#BR-CO-037, AAMS-774, AAMS-246
  		Given "Default users" approves the "3rd" created user
		Given "Default users" disables the "3rd" API created user
  		Given "Default users" approves the "4th" created user
  		Given "Default OIM Bankuser" deletes the "4th" API created user
		Given "Default users" approves the "4th" created user
		Then BankUser open the Org details page from search result
		Then BankUser views the Users tab and check all the API created Users displayed correctly except "Deleted" Users
		# AAMS-774
		Then BankUser clicks on "Details & Applications" tab
		Then check number of active Users under App "eMatching" is Blank
		Then check number of active Users under App "EsandaNet" is 2
		Then check number of active Users under App "GCIS" is 1
		Then check number of active Users under App "GCP" is Blank
		Then check number of active Users under App "Institutional Insights" is 2
		Then check number of active Users under App "Internet Enquiry Access" is 1
		Then check number of active Users under App "LM" is Blank
		Then check number of active Users under App "Online Trade" is 2
		Then check number of active Users under App "SDP CTS" is Blank
		Then check number of active Users under App "Transactive Global" is 1
		Then BankUser logs out