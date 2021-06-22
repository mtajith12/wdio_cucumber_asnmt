@chrome @ie @COBRA @OIM
Feature: User Application Assignment Screen Validations
	As a Bank User
	BankUser want to be able to add app to users

	@AAMS-2349 @AAMS-2373 @AAMS-308-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - verify display of create user applications screen
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		And checks the objects on Add Application page


	@AAMS-2849 @AAMS-2373 @AAMS-2840 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - verify TG is assigned by default when Customer is linked to User
		Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		# AAMS-1731-01
		Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
		Then check "Transactive Global" has been assigned on Add Application page by default


	@AAMS-2350 @AAMS-2373 @AAMS-308-02 @AAMS-310-02 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the Cancel button functionality
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
		Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
		Then BankUser clicks on Cancel button on Add Application page
		Then BankUser selects "No" in the cancel creation confirmation dialog
		Then checks "EsandaNet" application appears in the app table with its attributes
		Then checks "GCIS" application appears in the app table with its attributes
		Then checks "Internet Enquiry Access" application appears in the app table with its attributes
		Then BankUser clicks on Cancel button on Add Application page
		Then BankUser selects "Yes" in the cancel creation confirmation dialog
		Then check "New User" tile does exist in the onboarding page


	@AAMS-2351 @AAMS-2373 @AAMS-531-01 @AAMS-531-02 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify state of Add button when adding applications
		Given "Default OIM Bankuser" creates "1" organisations with EsandaNet,LM applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser checks Add button on Add App page is Enabled
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser checks Add button on Add App page is Enabled
		Then BankUser adds "LM" application to user
		Then BankUser checks Add button on Add App page is Disabled


	@AAMS-2352 @AAMS-2373 @AAMS-531-03 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify state of Add button when no applications assigned to org
		Given "Default OIM Bankuser" creates "1" organisations with no applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser checks Add button on Add App page is Disabled


	@AAMS-2353 @AAMS-2373 @AAMS-310-01 @AAMS-531-04 @AAMS-553-01 @AAMS-554-01 @AAMS-648-01 @AAMS-649-01 @AAMS-650-01 @AAMS-650-02 @AAMS-758-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify display of Add Application popup screen
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then checks the objects on Add Application dialog
		And checks the add application screen attributes for:
			| GCIS                    |
			| EsandaNet               |
			| Internet Enquiry Access |
			| eMatching               |


	@AAMS-2354 @AAMS-2373 @AAMS-535-02 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment data validation - Verify the error messages for mandatory fields
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as " " and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser checks "iSeries User ID is mandatory" error message is displayed
		Then BankUser clicks on CancelAddAppDialog button on Add Application page
		Then BankUser enters "userID" as " " and "null" as "null" to add "GCIS" and clicks OK
		Then BankUser checks "GCIS User ID is mandatory" error message is displayed
		Then BankUser clicks on CancelAddAppDialog button on Add Application page
		Then BankUser enters "CRN" as " " and "null" as "null" to add "Internet Enquiry Access" and clicks OK
		Then BankUser checks "Customer Registration Number is mandatory" error message is displayed
		Then BankUser clicks on CancelAddAppDialog button on Add Application page
		Then BankUser enters "iSeriesUserID" as "TestID" and "userRegion" as " " to add "EsandaNet" and clicks OK
		Then BankUser checks "User Region is mandatory" error message is displayed


	@AAMS-2355 @AAMS-2373 @AAMS-552-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the Continue button functionality on add application page
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
		Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
		And BankUser clicks on Continue button on Add Application page
		Then BankUser checks Continue button on Add App page is Enabled
		Then BankUser clicks on Back button on Add Application page
		Then checks "Internet Enquiry Access" application appears in the app table with its attributes
		And checks "EsandaNet" application appears in the app table with its attributes
		And checks "GCIS" application appears in the app table with its attributes


	@AAMS-2356 @AAMS-2373 @AAMS-553-02 @AAMS-555-01 @UserAppAssignmentScrns.feature
	Scenario Outline: COBRA UI: New User Application Assignment screen validation - Verify the 'Add Application' flow for applications without attributes individually
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser adds "<appName>" application to user
		Then checks "<appName>" application appears in the app table with its attributes
		Then checks "<appName>" application is not available in the application select list

		Examples:
			| appName                |
			| eMatching              |
			| GCP                    |
			| Institutional Insights |
			| LM                     |
			| Online Trade           |
			| SDP CTS                |
			| Transactive Global     |


	@AAMS-2357 @AAMS-2373 @AAMS-553-02 @AAMS-555-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the Add Application flow for EsandaNet/GCIS/Internet Enquiry Access application
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then checks "EsandaNet" application appears in the app table with its attributes
		Then checks "EsandaNet" application is not available in the application select list
		Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
		Then checks "GCIS" application appears in the app table with its attributes
		Then checks "GCIS" application is not available in the application select list
		Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
		Then checks "Internet Enquiry Access" application appears in the app table with its attributes
		Then checks "Internet Enquiry Access" application is not available in the application select list


	@AAMS-2358 @AAMS-2373 @AAMS-555-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the applications in Application table are sorted in alphabetical order
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		And BankUser adds all of available applications to user
		Then checks the applications in the table are sorted alphabetically in Create User mode


	@AAMS-2359 @AAMS-2373 @AAMS-883-01 @AAMS-883-02 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the 'Edit' button behaviour
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		And BankUser checks Edit button on Add App page is Disabled
		Then BankUser selects the "1st" item in the applications table
		And BankUser checks Edit button on Add App page is Enabled


	@AAMS-2360 @AAMS-2373 @AAMS-882-03 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the 'Remove Application' flow
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser adds "LM" application to user
		Then BankUser initiates and accepts the removal of LM application
		And checks "LM" application is not available in the application table
		Then checks "LM" application is available in the application select list


	@AAMS-2361 @AAMS-2373 @AAMS-553-01 @AAMS-882-03 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the that data is retained when Remove flow is cancelled
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser adds "LM" application to user
		Then BankUser initiates and rejects the removal of LM application
		And checks "LM" application is available in the application table


	@AAMS-2362 @AAMS-2373 @AAMS-553-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify that only applications assigned to the org are available to add to user
		Given "Default OIM Bankuser" creates "1" organisations with LM,GCP,GCIS applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then checks "LM" application is available in the application select list
		And checks "GCP" application is available in the application select list
		And checks "GCIS" application is available in the application select list
		And checks "eMatching" application is not available in the application select list
		And checks "EsandaNet" application is not available in the application select list
		And checks "Institutional Insights" application is not available in the application select list
		And checks "Online Trade" application is not available in the application select list
		And checks "Internet Enquiry Access" application is not available in the application select list
		And checks "SDP CTS" application is not available in the application select list


	@AAMS-2363 @AAMS-2373 @AAMS-534-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify the Back button functionality
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
		Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
		Then BankUser clicks on Back button on Add Application page
		Then check the entered User data are retained
		Then BankUser clicks on Continue button on Add Application page
		Then checks "Internet Enquiry Access" application appears in the app table with its attributes
		Then checks "EsandaNet" application appears in the app table with its attributes
		Then checks "GCIS" application appears in the app table with its attributes


	@AAMS-2364 @AAMS-2373 @AAMS-535-01 @UserAppAssignmentScrns.feature
	Scenario Outline: COBRA UI: New User Application Assignment data validation - verify data validation for special characters in application attributes
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser try to add "<application>" app with special chars in "<attributeName>" and check "<errMsg>" error message

		Examples:
			| application             | attributeName | errMsg                                                          |
			| EsandaNet               | iSeriesUserID | iSeries User ID has invalid format or type or size              |
			| GCIS                    | userID        | GCIS User ID has invalid format or type or size                 |
			| Internet Enquiry Access | CRN           | Customer Registration Number has invalid format or type or size |


	@AAMS-2365 @AAMS-2373 @AAMS-535-01 @UserAppAssignmentScrns.feature
	Scenario Outline: COBRA UI: New User Application Assignment data validation - Verify data validation business rules for GCIS/Esanda/Internet Enquiry Access attributes
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "<attribute1Name>" as "<attribute1Val>" and "<attribute2Name>" as "<attribute2Val>" to add "<appName>" and clicks OK
		Then BankUser checks "<errMsg>" error message is displayed

		Examples:
			| Test case name                                         | appName                 | attribute1Name | attribute1Val | attribute2Val | attribute2Name | errMsg                                                                           |
			| Add EsandaNet application with space in iSeriesUserID  | EsandaNet               | iSeriesUserID  | test val      | NSW, ACT      | userRegion     | iSeries User ID has invalid format or type or size                               |
			| Add GCIS application with space                        | GCIS                    | userID         | test val      | null          | null           | GCIS User ID has invalid format or type or size                                  |
			| Add Internet Enquiry Access  application with space    | Internet Enquiry Access | CRN            | 99 22         | null          | null           | Customer Registration Number has invalid format or type or size                  |
			| Add GCIS application with 2 chars                      | GCIS                    | userID         | te            | NA            | NA             | GCIS User ID has 2 characters, which is less than the required minimum length: 3 |
			| Add GCIS application with 1 chars                      | GCIS                    | userID         | t             | null          | null           | GCIS User ID has 1 characters, which is less than the required minimum length: 3 |
			| Add Internet Enquiry Access application with alphabets | Internet Enquiry Access | CRN            | test          | null          | null           | Customer Registration Number has invalid format or type or size                  |


	@AAMS-2366 @AAMS-2373 @AAMS-535-01 @UserAppAssignmentScrns.feature
	Scenario Outline: COBRA UI: New User Application Assignment data validation - Verify the max field length truncation for GCIS/Esanda/Internet Enquiry Access attributes
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "<attribute1Name>" as "<attribute1Val>" and "<attribute2Name>" as "<attribute2Val>" to add "<appName>"
		Then checks the values in "<attribute1Name>" is "<valueRetained>"

		Examples:
			| Test case name                         | appName                 | attribute1Name | attribute1Val                                                 | attribute2Name | attribute2Val | valueRetained                                                |
			| Add EsandaNet application with max+1   | EsandaNet               | iSeriesUserID  | QWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOPLKJHGFDSAZXCVBNM123456789 | userRegion     | NSW, ACT      | QWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOPLKJHGFDSAZXCVBNM12345678 |
			| Add Internet Enquiry Access with max+1 | Internet Enquiry Access | CRN            | 0123456789                                                    | NA             | NA            | 012345678                                                    |
			| Add GCIS application with max+1        | GCIS                    | userID         | test1234567890te                                              | NA             | NA            | test1234567890t                                              |


	@AAMS-2367 @AAMS-2373 @AAMS-553-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify applications list in Add Application is displayed in alphabetical order
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser checks the sorting of apps in list is in alphabetical order


	@AAMS-2368 @AAMS-2373 @AAMS-882-01 @AAMS-882-02 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify removal of multi-selected application
		Given "Default OIM Bankuser" creates "1" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		And BankUser checks Remove button on Add App page is Disabled
		Then BankUser adds "LM" application to user
		Then BankUser adds "eMatching" application to user
		Then BankUser adds "GCP" application to user
		And BankUser checks Remove button on Add App page is Disabled
		Then BankUser selects LM and GCP applications
		And BankUser checks Remove button on Add App page is Enabled
		And BankUser checks Edit button on Add App page is Disabled
		Then BankUser clicks on Remove button on Add Application page
		And BankUser selects "Yes" in the remove application confirmation dialog
		And checks "LM" application is not available in the application table
		And checks "GCP" application is not available in the application table


	@AAMS-2369 @AAMS-2373 @AAMS-882-03 @AAMS-882-04 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify removal of applications individually
		Given "Default OIM Bankuser" creates "1" organisations with LM,GCP applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser adds "LM" application to user
		Then BankUser adds "GCP" application to user
		Then BankUser initiates and accepts the removal of LM application
		And checks "LM" application is not available in the application table
		Then checks "LM" application is available in the application select list
		Then BankUser initiates and accepts the removal of GCP application
		And checks "GCP" application is not available in the application table
		Then checks "GCP" application is available in the application select list
		And BankUser checks Remove button on Add App page is Disabled
		And BankUser checks Edit button on Add App page is Disabled


	@AAMS-2370 @AAMS-2373 @AAMS-883-05 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify double-click to edit application
		Given "Default OIM Bankuser" creates "1" organisations with LM,GCP applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		And BankUser checks Edit button on Add App page is Disabled
		Then BankUser adds "LM" application to user
		Then BankUser double click on LM application and checks the display of Edit screen
		And checks the application select list is disabled


	@AAMS-2371 @AAMS-2373 @AAMS-883-03 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify Edit application is disabled when multiple applications are selected
		Given "Default OIM Bankuser" creates "1" organisations with LM,GCP applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		And BankUser checks Edit button on Add App page is Disabled
		Then BankUser adds "LM" application to user
		Then BankUser adds "GCP" application to user
		Then BankUser selects LM and GCP applications
		And BankUser checks Edit button on Add App page is Disabled


	@AAMS-2372 @AAMS-2373 @AAMS-1414-01 @UserAppAssignmentScrns.feature
	Scenario: COBRA UI: New User Application Assignment screen validation - Verify that selected applications are cleared when user org is changed
		Given "Default OIM Bankuser" creates "2" organisations with all applications
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
		Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser clicks on Back button on Add Application page
		Then BankUser clears the entered Org ID
		Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
		Then BankUser enters randomised address then clicks on "Ok" button
    	Then BankUser fills in User details data:
      		| mobileCountry | 61        |
      		| mobileNumber  | 401980652 |
    	Then BankUser clicks on "Continue" button
		And checks "EsandaNet" application is not available in the application table