@chrome @ie @COBRA @OIM @UserSecurityDeviceMaintenance.feature
Feature: End to end tests for User Security Device Maintenance

	@AAMS-4818 @AAMS-3484
	Scenario: COBRA UI - Submit User Modification - Promote DA User with Security Devices - Positive
		#01 Submit User MOdifications - DA User assigned with Security Devices
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Security Devices tab
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "ANZ Digital Key"
		Then BankUser clicks "Ok" button on add security device page
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "Token Digipass 270"
		Then BankUser clicks "Ok" button on add security device page
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
		Then BankUser clicks "Ok" button on add security device page
		Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
		Then check error message when "1st" DA User is promoted with security devices and clicks "No" on the confirmation
		Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
		Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
		Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
		#04 Existing DA submit asigned with Security Devices - User confirms promotion
		Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
		Then check error message when "1st" DA User is promoted with security devices and clicks "Yes" on the confirmation
		Then check User status is "Enabled" and workflow is "Pending Approval - Modified" in view User page
		Then check ANZ Managed is "True"
		Then BankUser logs out
		#03 - New DA User assigned with Security Devices - User confirms promotion
		Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "2nd" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Security Devices tab
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "ANZ Digital Key"
		Then BankUser clicks "Ok" button on add security device page
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "Token Digipass 270"
		Then BankUser clicks "Ok" button on add security device page
		Then click "Add" button on Modify User Security Device screen
		Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
		Then BankUser clicks "Ok" button on add security device page
		Then BankUser clicks on "Submit" button for User Modification for the "2nd" API created User, then clicks "Yes" on the confirmation
		Then check error message when "2nd" DA User is promoted with security devices and clicks "Yes" on the confirmation
		Then check User status is "New" and workflow is "Pending Approval - Create" in view User page
		Then check ANZ Managed is "True"

	@AAMS-4847 @AAMS-3491
	Scenario: Cobra UI - Reject User Enablement - Security Devices - Positive
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
			| securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
		Given "Default users" approves the "1st" created user
		Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
		Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
		Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
			| question                              | answer  |
			| What was the name of your first pet?  | answer1 |
			| What is your father's place of birth? | answer2 |
		Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
		Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
		Given "Default users" disables the "1st" API created user
		Then "Default users" enables the "1st" API created user
		Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And Bankuser clicks Security Devices tab
		Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
		Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
		Then BankUser clicks on "Reject" button on the User details page
		Then check Reject Acknowledgement dialog displayed with empty reason
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | reject user modifications from user details page |
		Then check the Single User modification been rejected successfully
		And Bankuser clicks Security Devices tab
		Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
		Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
		Then check User status is "Disabled" and workflow is "Approved" in view User page
		Then BankUser logs out
		Then check User status is "Disabled" in CA for the "1st" API created User

    @AAMS-4851 @AAMS-2856-01 @AAMS-2881-03 @AAMS-4556
    Scenario: COBRA UI: User Security Device Maintenance - Delete User with 'ImplicitDisabled' tokens
        Given "Default users" creates "1" organisations with all applications
        Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
            | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
        Given "Default OIM Bankuser" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer |
            | What was the name of your first pet?  | test1  |
            | What is your father's place of birth? | test2  |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Default OIM Bankuser" disables the "1st" API created user
        Then check the Tokens of the "1st" API created User are in "ImplicitDisabled" status in IDM
        Given "Registration Officer (Pilot)" deletes the "1st" API created user
        When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to Pending Approvals page
        Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
        Then check the "1st" row is grey-ed out
        And BankUser opens the "1st" entry from Pending Approvals grid
        Then check User status is "Disabled" and workflow is "Pending Approval - Deleted" in view User page
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User deletion confirmation message, then click on "Yes" button
        Then check the Single User deletion been approved successfully
        Then check User status is "Deleted" and workflow is "Approved" in view User page
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
        Then BankUser logs out
        Then check that the User has been removed from IDM for the "1st" API created User
        Then check that all application links have been removed from IDM for the "1st" API created User
        Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
        Then check the Tokens of the "1st" API created User are in "Removed" status in IDM

    @AAMS-4849 @AAMS-2856-01 @AAMS-2881-03 @AAMS-4556
    Scenario: COBRA UI: User Security Device Maintenance - Delete Enabled User with 'Disabled' and 'Removed' tokens
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 276 (China Compliant) |
		Given "Default users" approves the "1st" created user
        Then check that "Token Digipass 270" for the "1st" created user is "Disabled" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Removed" status from IDM Linked View
        Given "Registration Officer (Pilot)" deletes the "1st" API created user
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then check User status is "Disabled" and workflow is "Pending Approval - Deleted" in view User page
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device revoked"
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User deletion confirmation message, then click on "Yes" button
        Then check the Single User deletion been approved successfully
        Then check User status is "Deleted" and workflow is "Approved" in view User page
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device revoked"
        Then BankUser logs out
        Then check that the User has been removed from IDM for the "1st" API created User
        Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
        Then check the Tokens of the "1st" API created User are in "Removed" status in IDM
