@chrome @ie @COBRA @OIM
Feature: Screen validations on Modify Applications screens in Edit User

	@AAMS-3751 @AAMS-2654 @ModifyUserAppsScrn.feature @AAMS-3756
	Scenario: COBRA UI: Modify User Apps - Display User Apps Screen in View mode - New/Enabled User - Modify (Limited) right
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;eMatching;Transactive Global |
		When "Implementation Manager" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check the View User Applications screen elements for New User
		Then check Applications tab is displayed in View mode
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "Yes" in the cancel modify confirmation dialog
		Then BankUser closes User details page
        Given "Default OIM Bankuser" approves the "1st" created user
		Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Applications tab
		Then check Applications tab is displayed in View mode


    @AAMS-3752 @AAMS-1056 @AAMS-1057 @AAMS-1058 @AAMS-1059 @AAMS-1060 @AAMS-1061 @ModifyUserAppsScrn.feature @AAMS-3756
	Scenario: COBRA UI: Modify User App - New User - Modify right
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications    | eMatching;EsandaNet;GCIS;GCP;Institutional Insights;Internet Enquiry Access;LM;Online Trade;SDP CTS|
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check the Modify User Applications screen elements for New User
		#AAMS-1056-01,02, AAMS-1057-01, AAMS-1058-03, AAMS-1059-03, AAMS-1060-02, AAMS-1061-03
		Then checks the applications in the table are sorted alphabetically in Modify User mode
		Then check "Add" button is "Enabled" on Modify User App screen
		Then check "Remove" button is "Disabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1057-02,05
		Then BankUser clicks on "Add" application button and checks the display of Add application screen
		Then BanUser closes Add/Edit App dialog
		Then BankUser adds application "Transactive Global" for the API created User
		Then check "Add" button is "Disabled" on Modify User App screen
		#AAMS-1058-01, AAMS-1059-01,04, AAMS-1060-02, AAMS-1061-02
		Then BankUser selects applications "GCIS" in the applications grid
		Then check "Remove" button is "Enabled" on Modify User App screen
		Then check "Edit" button is "Enabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		Then BankUser selects applications "GCIS;GCP" in the applications grid
		Then check "Remove" button is "Enabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1059-05, 06
		Then BankUser selects "SDP CTS" application to edit, and checks the display of Edit screen
		Then BanUser closes Add/Edit App dialog
		Then BankUser selects "Institutional Insights" application to edit by double clicking, and checks the display of Edit screen
		Then BanUser closes Add/Edit App dialog
		Then BankUser edits application "EsandaNet" for the API created User
		#AAMS-1057-05,AAMS-1058-05, AAMS-1705-02
		Then BankUser removes applications "LM" then clicks on "No" for the API created User 
		Then BankUser removes applications "eMatching" then clicks on "Yes" for the API created User 
		Then BankUser removes applications "Online Trade" then clicks on "Yes" for the API created User 
		Then check "Add" button is "Enabled" on Modify User App screen
		Then BankUser adds application "eMatching" for the API created User
		#AAMS-1056-05
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "No" in the cancel modify confirmation dialog
		Then check modified applications data are retained on modify applications screen
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "Yes" in the cancel modify confirmation dialog
		Then check changes to applications are discarded for the API created User


    @AAMS-3753 @AAMS-1057 @AAMS-1058 @AAMS-1059 @AAMS-1060 @AAMS-1061 @ModifyUserAppsScrn.feature @AAMS-3756
	Scenario: COBRA UI: Modify User App - Enabled User - Modify right
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" disables the "1st" API created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Applications tab
		#AAMS-1057-04
		Then check "Add" button is "Disabled" on Modify User App screen
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "Yes" in the cancel modify confirmation dialog
		Then BankUser closes User details page
		Given "Default users" enables the "1st" API created user
		Given "Default OIM Bankuser" approves the "1st" created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Applications tab
		#AAMS-1056-01, AAMS-1057-01, AAMS-1058-02, AAMS-1059-03, AAMS-1060-02, AAMS-1061-03
		Then checks the applications in the table are sorted alphabetically in Modify User mode
		Then check "Add" button is "Enabled" on Modify User App screen
		Then check "Remove" button is "Disabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1057-02, AAMS-1705-01
		Then BankUser adds application "eMatching" for the API created User
		Then check "Add" button is "Disabled" on Modify User App screen
		#AAMS-1058-01, AAMS-1059-01, AMS-1060-02, AAMS-1061-02, app in "New" status
		Then BankUser selects applications "eMatching" in the applications grid
		Then check "Remove" button is "Enabled" on Modify User App screen
		Then check "Edit" button is "Enabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1058-01, AAMS-1059-01, AAMS-1061-01, app in "Enabled" status
		Then BankUser selects applications "EsandaNet" in the applications grid
		Then check "Remove" button is "Enabled" on Modify User App screen
		Then check "Edit" button is "Enabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Enabled" on Modify User App screen
		#AAMS-1058-05
		Then BankUser removes applications "EsandaNet" then clicks on "Yes" for the API created User
		#AAMS-1058-02, AAMS-1061-02, app in "Removed" status
		Then BankUser selects applications "EsandaNet" in the applications grid
		Then check "Remove" button is "Disabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1061-04
		Then BankUser disables applications "Internet Enquiry Access" then clicks on "No" for the API created User
		Then BankUser disables applications "Internet Enquiry Access;Online Trade" then clicks on "Yes" for the API created User
		#AAMS-1060-01, AAMS-1061-02, app in "Disabled" status
		Then BankUser selects applications "Online Trade" in the applications grid
		Then check "Remove" button is "Enabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Enabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1060-03
		Then BankUser enables applications "Internet Enquiry Access" then clicks on "No" for the API created User
		Then BankUser enables applications "Internet Enquiry Access" then clicks on "Yes" for the API created User 
		#AAMS-1058-01,04,05, AAMS-1061-02
		Then BankUser removes applications "GCIS;GCP" then clicks on "Yes" for the API created User
		Then BankUser selects applications "GCIS" in the applications grid
		Then check "Disable" button is "Disabled" on Modify User App screen
		#AAMS-1060-02
		Then BankUser selects applications "EsandaNet;Online Trade" in the applications grid
		Then check "Enable" button is "Disabled" on Modify User App screen		
		Then BankUser edits application "SDP CTS" for the API created User
		#AAMS-1096
		Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "No" on the confirmation


    @AAMS-3754 @AAMS-1056 @AAMS-1057 @AAMS-1061 @ModifyUserAppsScrn.feature @AAMS-3756
	Scenario: COBRA UI: Modify User App - CAAS Org has no applications
		Given "Default users" creates "1" organisations with no applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
			| applications | |
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Applications tab
		#AAMS-1057-03, AAMS-1056-04
		Then check "Add" button is "Disabled" on Modify User App screen
		Then check "Remove" button is "Disabled" on Modify User App screen
		Then check "Edit" button is "Disabled" on Modify User App screen
		Then check "Enable" button is "Disabled" on Modify User App screen
		Then check "Disable" button is "Disabled" on Modify User App screen
		Then check "No Record Found" is displayed on empty applications grid


	@AAMS-3755 @AAMS-1058 @ModifyUserAppsScrn.feature  @AAMS-3756
	Scenario: COBRA UI: Modify User Apps - TG cannot be removed when Customer is associated with the User
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
    	Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
			| applications    | EsandaNet;Transactive Global |
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And Bankuser clicks Applications tab
		Then BankUser selects applications "Transactive Global" in the applications grid
		Then check "Remove" button is "Disabled" on Modify User App screen
		Then BankUser exists Modify User mode
		Then BankUser closes User details page
        Given "Default OIM Bankuser" approves the "1st" created user
		Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Applications tab
		Then BankUser selects applications "Transactive Global" in the applications grid
		Then check "Remove" button is "Disabled" on Modify User App screen
