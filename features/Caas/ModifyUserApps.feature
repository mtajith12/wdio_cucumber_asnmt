@chrome @ie @COBRA @OIM
Feature: End to end flows of Modifying User Applications, submit, approve and reject the changes

	@AAMS-3761 @AAMS-1096 @AAMS-1705 @AAMS-1124 @AAMS-1768 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - New User - single approval from User details page
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM |
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Applications tab
		And BankUser adds application "eMatching" for the API created User
		And BankUser adds application "Transactive Global" for the API created User
		And BankUser removes applications "GCIS;LM" then clicks on "Yes" for the API created User
		And BankUser edits application "Internet Enquiry Access" for the API created User
		And BankUser edits application "EsandaNet" for the API created User
		Then BankUser submits changes to User for the API created User
		Then BankUser logs out
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		Then check the View User Applications screen elements for New User
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User creation and modification confirmation message, then click on "Yes" button
		Then check the Single User creation been approved successfully
		Then check the View User Applications screen elements for Enabled User
		Then check Removed applications are no longer displayed on the applications list
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User
		Then check the applications in CA for the "1st" API created User
		Then check integrated application "eMatching" links for the "1st" API created User
		Then check non-integrated application "EsandaNet" links for the "1st" API created User
		Then check non-integrated application "Institutional Insights" links for the "1st" API created User
		Then check non-integrated application "Internet Enquiry Access" links for the "1st" API created User
		Then check non-integrated application "Online Trade" links for the "1st" API created User
		Then check integrated application "SDP CTS" links for the "1st" API created User
		Then check integrated application "GCP" links for the "1st" API created User
		Then check non-integrated application "Transactive Global" links for the "1st" API created User
		Then check application "GCIS" links are not present for the "1st" API created User
		Then check application "LM" links are not present for the "1st" API created User


	@AAMS-3796 @AAMS-1096 @AAMS-1705 @AAMS-1130 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - New User - single reject from User details page
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | eMatching;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
		Given "Default users" modifies user applications of the "1st" API created user:
			| add    | EsandaNet                                         |
			| remove | eMatching;Online Trade;GCIS;LM;Transactive Global |
			| edit   | Internet Enquiry Access                           |
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		Then check the View User Applications screen elements for New User
		Then BankUser clicks on "Reject" button on the User details page
		Then check Reject Acknowledgement dialog displayed with empty reason
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | reject user modifications from user details page |
		Then check the Single User creation been rejected successfully
		Then check "No Record Found" message returned in search results grid
		Then BankUser logs out
		Then check the "1st" API created User has NOT been published to CA


	@AAMS-3762 @AAMS-1096 @AAMS-1705 @AAMS-1124 @AAMS-1768 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - Enabled User - single approval from User details page
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | eMatching;EsandaNet;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
		Given "Default OIM Bankuser" approves the "1st" created user
		Then check the version number is "1" in CA for the "1st" API created User
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check the Modify User Applications screen elements for Enabled User
		And BankUser removes applications "Online Trade" then clicks on "Yes" for the API created User
		And BankUser edits application "EsandaNet" for the API created User
		And BankUser edits application "Internet Enquiry Access" for the API created User
		And BankUser disables applications "eMatching;SDP CTS;Institutional Insights;LM" then clicks on "Yes" for the API created User
		And BankUser removes applications "SDP CTS;GCP" then clicks on "Yes" for the API created User
		And BankUser enables applications "LM" then clicks on "Yes" for the API created User
		And BankUser adds application "GCIS" for the API created User
		Then BankUser submits changes to User for the API created User
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		Then check the View User Applications screen elements for Enabled User
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
		Then check the View User Applications screen elements for Enabled User
		Then check Removed applications are no longer displayed on the applications list
		Then BankUser logs out
		Then check the version number is "2" in CA for the "1st" API created User
		Then check the applications in CA for the "1st" API created User
		Then check integrated application "eMatching" links for the "1st" API created User
		Then check non-integrated application "EsandaNet" links for the "1st" API created User
		Then check non-integrated application "Institutional Insights" links for the "1st" API created User
		Then check non-integrated application "Internet Enquiry Access" links for the "1st" API created User
		Then check integrated application "LM" links for the "1st" API created User
		Then check non-integrated application "GCIS" links for the "1st" API created User
		Then check non-integrated application "Transactive Global" links for the "1st" API created User
		Then check application "GCP" links are not present for the "1st" API created User
		Then check application "SDP CTS" links are not present for the "1st" API created User
		Then check application "Online Trade" links are not present for the "1st" API created User

	@AAMS-4694 @AAMS-4399 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - when application is disabled
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | eMatching;EsandaNet;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
		Given "Default OIM Bankuser" approves the "1st" created user
		Then check the version number is "1" in CA for the "1st" API created User
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check the Modify User Applications screen elements for Enabled User
		And BankUser disables applications "EsandaNet" then clicks on "Yes" for the API created User
		Then BankUser submits changes to User for the API created User
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		Then check the View User Applications screen elements for Enabled User
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
		Then check the View User Applications screen elements for Enabled User
		And BankUser clicks on "Edit" button on User Details page
		Then check the Modify User Applications screen elements for Enabled User
		And BankUser enables applications "EsandaNet" then clicks on "Yes" for the API created User
		And BankUser edits application "EsandaNet" for the API created User
		And BankUser disables applications "EsandaNet" then clicks on "Yes" for the API created User
		Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
		Then check MSG085 error message is displayed

	@AAMS-3763 @AAMS-1096 @AAMS-1705 @AAMS-1130 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - "Pending Approval - Modified" User - single reject from User details page
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
			| applications | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;GCP;Transactive Global |
		Given "Default OIM Bankuser" approves the "1st" created user
		Then check the version number is "1" in CA for the "1st" API created User
		Given "Default users" modifies user applications of the "1st" API created user:
			| add     | LM                      |
			| remove  | Online Trade            |
			| disable | GCIS;EsandaNet          |
			| edit    | Internet Enquiry Access |
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check the Modify User Applications screen elements for Enabled User
		And BankUser removes applications "GCIS;eMatching" then clicks on "Yes" for the API created User
		And BankUser removes applications "Institutional Insights" then clicks on "Yes" for the API created User
		And BankUser enables applications "EsandaNet" then clicks on "Yes" for the API created User
		And BankUser disables applications "Internet Enquiry Access;GCP;Transactive Global" then clicks on "Yes" for the API created User
		And BankUser adds application "SDP CTS" for the API created User
		Then BankUser submits changes to User for the API created User
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser clicks on "Reject" button on the User details page
		Then check Reject Acknowledgement dialog displayed with empty reason
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | reject user modifications from user details page |
		Then check the Single User modification been rejected successfully
		Then check the View User Applications screen elements for Enabled User
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User


	@AAMS-3797 @AAMS-1096 @AAMS-1705 @AAMS-1124 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps - multi approval from search User results grid
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
			| applications | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;GCP;Transactive Global;LM;SDP CTS |
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;GCP |
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" approves the "2nd" created user
		Given "Default users" modifies user applications of the "1st" API created user:
			| remove  | EsandaNet;Institutional Insights;GCP                      |
			| disable | eMatching;Internet Enquiry Access;Online Trade;LM;SDP CTS |
			| edit    | GCIS                                                      |
		Given "Default users" modifies user applications of the "2nd" API created user:
			| add     | Transactive Global                   |
			| remove  | Internet Enquiry Access;Online Trade |
			| disable | EsandaNet;GCIS                       |
		Then check the version number is "1" in CA for the "1st" API created User
		Then check the version number is "1" in CA for the "2nd" API created User
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
		Then check Approve Multiple Users modification confirmation message, then click on "Yes" button
		Then check the Multiple Users modification been approved successfully
		Then BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then check Removed applications are no longer displayed on the applications list
		Then BankUser closes User details page
		Then BankUser opens the "2nd" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then check Removed applications are no longer displayed on the applications list
		Then BankUser logs out
		Then check the version number is "2" in CA for the "1st" API created User
		Then check the version number is "2" in CA for the "2nd" API created User
		Then check the applications in CA for the "1st" API created User
		Then check the applications in CA for the "2nd" API created User
		Then check integrated application "eMatching" links for the "1st" API created User
		Then check integrated application "SDP CTS" links for the "1st" API created User
		Then check integrated application "LM" links for the "1st" API created User
		Then check non-integrated application "GCIS" links for the "1st" API created User
		Then check non-integrated application "Internet Enquiry Access" links for the "1st" API created User
		Then check non-integrated application "Online Trade" links for the "1st" API created User
		Then check non-integrated application "Transactive Global" links for the "1st" API created User
		Then check application "EsandaNet" links are not present for the "1st" API created User
		Then check application "Institutional Insights" links are not present for the "1st" API created User
		Then check application "GCP" links are not present for the "1st" API created User
		Then check integrated application "eMatching" links for the "2nd" API created User
		Then check integrated application "GCP" links for the "2nd" API created User
		Then check non-integrated application "EsandaNet" links for the "2nd" API created User
		Then check non-integrated application "Institutional Insights" links for the "2nd" API created User
		Then check non-integrated application "GCIS" links for the "2nd" API created User
		Then check non-integrated application "Transactive Global" links for the "2nd" API created User
		Then check application "Internet Enquiry Access" links are not present for the "2nd" API created User
		Then check application "Online Trade" links are not present for the "2nd" API created User


	@AAMS-3798 @AAMS-1096 @AAMS-1705 @AAMS-1130 @ModifyUserApps.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps and Submit - "Enabled" User - multi reject from Pending Approvals page
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
			| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;GCP;LM;Transactive Global |
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" approves the "2nd" created user
		Given "Default users" modifies user applications of the "1st" API created user:
			| add     | eMatching                                 |
			| remove  | GCIS;Institutional Insights;GCP;EsandaNet |
			| disable | Transactive Global;LM                     |
			| edit    | Internet Enquiry Access                   |
		Given "Default users" modifies user applications of the "2nd" API created user:
			| add     | Online Trade                               |
			| remove  | Internet Enquiry Access;Transactive Global |
			| disable | GCP;GCIS                                   |
			| edit    | EsandatNet                                 |
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		Then BankUser navigates to Pending Approvals page
		Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
		Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | reject multiple user app modifications from pending approvals page |
		Then check the Multiple Users modification been rejected successfully
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		Then BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser closes User details page
		Then BankUser opens the "2nd" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser logs out
		Then check the version number is "1" in CA for the "1st" API created User
		Then check the version number is "1" in CA for the "2nd" API created User


	@AAMS-4400 @AAMS-1533 @AAMS-1534 @AAMS-1535 @AAMS-1536 @AAMS-1537
	Scenario: COBRA UI: Modify User Applications - Disable, Enable and Removing Apps
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default users" modifies user applications of the "1st" API created user:
			| disable | EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser closes User details page
		Then check all applications for the "1st" created user have application status "Disabled" in IDM
		Then check applications for the "1st" created user has last provisioning status is "Disabled Successfully" in cobra for:
			| applications |EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default users" modifies user applications of the "1st" API created user:
			| enable | EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default OIM Bankuser" approves the "1st" created user
		And BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser closes User details page
		Then check all applications for the "1st" created user have application status "Enabled" in IDM
		Then check applications for the "1st" created user has last provisioning status is "Enabled Successfully" in cobra for:
			| applications | EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default users" modifies user applications of the "1st" API created user:
			| edit | EsandaNet;GCIS;Internet Enquiry Access |
		Given "Default OIM Bankuser" approves the "1st" created user
		And BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser closes User details page
		Then check all applications for the "1st" created user have application status "Enabled" in IDM
		Then check applications for the "1st" created user has last provisioning status is "Modified Successfully" in cobra for:
			| applications | EsandaNet;GCIS;Internet Enquiry Access |
		Given "Default users" modifies user applications of the "1st" API created user:
			| remove | EsandaNet;GCIS;Internet Enquiry Access;Institutional Insights;Online Trade;eMatching;Transactive Global;SDP CTS;LM;GCP |
		Given "Default OIM Bankuser" approves the "1st" created user
		And BankUser opens the "1st" entry from search User results
		Then check the View User Applications screen elements for Enabled User
		Then BankUser closes User details page
		Then check that all application links have been removed from IDM for the "1st" API created User

	@AAMS-4401 @AAMS-1533-05 @AAMS-1534-05 @AAMS-1536-05
	Scenario: COBRA UI: Modify User App Attributes and Disabling Application
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | EsandaNet;GCIS;Internet Enquiry Access |
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Default users" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Applications tab
		And BankUser edits application "Internet Enquiry Access" for the API created User
		And BankUser edits application "EsandaNet" for the API created User
		And BankUser edits application "GCIS" for the API created User
		And BankUser disables applications "Internet Enquiry Access;EsandaNet;GCIS" then clicks on "Yes" for the API created User
		Then BankUser submits changes to User for the API created User
		Then BankUser logs out
		When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
		Then check the View User Applications screen elements for Enabled User
		Then check all applications for the "1st" created user have application status "Disabled" in IDM
		Then check applications for the "1st" created user has last provisioning status is "Disabled Successfully" in cobra for:
			| applications | EsandaNet;GCIS;Internet Enquiry Access |
