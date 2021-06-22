@chrome @ie @COBRA @OIM
Feature: User Application Maintenance Screen Validations

    @AAMS-2380 @AAMS-311-01 @AAMS-311-02 @AAMS-556-01 @AAMS-651-01 @AAMS-652-01 @AAMS-652-02 @AAMS-759-01 @AAMS-883-04 @UserAppMaintenanceScrns.feature
    Scenario: COBRA UI: Modify Application Attributes screen validation - Verify screen elements for IEA, eMatching, EsandaNet and GCIS
    Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
        Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
        Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
        Then BankUser adds "eMatching" application to user
        Then BankUser checks the data is retained for "GCIS" app and screen elements on Edit Application page and clicks Cancel
        Then BankUser checks the data is retained for "Internet Enquiry Access" app and screen elements on Edit Application page and clicks Cancel
        Then BankUser checks the data is retained for "EsandaNet" app and screen elements on Edit Application page and clicks Cancel
        Then BankUser checks the data is retained for "eMatching" app and screen elements on Edit Application page and clicks Cancel


    @AAMS-2381 @AAMS-311-01 @UserAppMaintenanceScrns.feature
    Scenario: COBRA UI: Modify Application Attributes screen validation - Verify screen elements for applications without attributes
    Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser adds "GCP" application to user
        Then BankUser adds "Institutional Insights" application to user
        Then BankUser adds "LM" application to user
        Then BankUser adds "Online Trade" application to user
        Then BankUser adds "SDP CTS" application to user
        Then BankUser adds "Transactive Global" application to user
        Then BankUser edits "GCP" app and checks Edit Application screen elements
        Then BankUser edits "Institutional Insights" app and checks Edit Application screen elements
        Then BankUser edits "LM" app and checks Edit Application screen elements
        Then BankUser edits "Online Trade" app and checks Edit Application screen elements
        Then BankUser edits "SDP CTS" app and checks Edit Application screen elements
        Then BankUser edits "Transactive Global" app and checks Edit Application screen elements


    @AAMS-2382 @AAMS-557-01 @UserAppMaintenanceScrns.feature
    Scenario: COBRA UI: Modify Application Attributes screen validation - verify modified attributes
    Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
        Then BankUser enters "iSeriesUserID" as "updatedUID" and "userRegion" as "Victoria, Tasmania" to edit "EsandaNet" and clicks OK
    	Then checks "EsandaNet" application appears in the app table with its attributes
    	Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
    	Then BankUser enters "userID" as "updatedTest" and "null" as "null" to edit "GCIS" and clicks OK
    	Then checks "GCIS" application appears in the app table with its attributes
    	Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
        Then BankUser enters "CRN" as "67890" and "null" as "null" to edit "Internet Enquiry Access" and clicks OK
    	Then checks "Internet Enquiry Access" application appears in the app table with its attributes


    @AAMS-2384 @AAMS-558-01 @UserAppMaintenanceScrns.feature
    Scenario: COBRA UI: Modify Application Attributes data validation - Verify data validation for special characters in application attributes
    Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
        Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
        Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
        Then BankUser try to edit "EsandaNet" app with special chars in "iSeriesUserID" and check "iSeries User ID has invalid format or type or size" error message
        Then BankUser try to edit "GCIS" app with special chars in "userID" and check "GCIS User ID has invalid format or type or size" error message
        Then BankUser try to edit "Internet Enquiry Access" app with special chars in "CRN" and check "Customer Registration Number has invalid format or type or size" error message


    @AAMS-2385 @AAMS-558-02 @UserAppMaintenanceScrns.feature
    Scenario: COBRA UI: Modify Application Attributes data validation - Verify the error messages for mandatory fields
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
        Then BankUser enters "iSeriesUserID" as " " and "userRegion" as "NSW, ACT" to edit "EsandaNet" and clicks OK
        Then BankUser checks "iSeries User ID is mandatory" error message is displayed
        Then BankUser clicks on CancelAddAppDialog button on Add Application page
        Then BankUser enters "iSeriesUserID" as "TestID" and "userRegion" as " " to edit "EsandaNet" and clicks OK
        Then BankUser checks "User Region is mandatory" error message is displayed
        Then BankUser clicks on CancelAddAppDialog button on Add Application page
        Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
        Then BankUser enters "userID" as " " and "null" as "null" to edit "GCIS" and clicks OK
        Then BankUser checks "GCIS User ID is mandatory" error message is displayed
        Then BankUser clicks on CancelAddAppDialog button on Add Application page
        Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
        Then BankUser enters "CRN" as " " and "null" as "null" to edit "Internet Enquiry Access" and clicks OK
        Then BankUser checks "Customer Registration Number is mandatory" error message is displayed
        Then BankUser clicks on CancelAddAppDialog button on Add Application page


    @AAMS-2386 @AAMS-558-01 @UserAppMaintenanceScrns.feature
    Scenario Outline: COBRA UI: Modify Application Assignment data validation - Verify data validation business rules for GCIS/Esanda/IEA attributes
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
        Then BankUser enters "<attribute1Name>" as "<initialVal>" and "<attribute2Name>" as "<attribute2Val>" to add "<appName>" and clicks OK
        Then BankUser enters "<attribute1Name>" as "<attribute1Val>" and "<attribute2Name>" as "<attribute2Val>" to edit "<appName>" and clicks OK
        Then BankUser checks "<errMsg>" error message is displayed

        Examples:
            | Test case name                                         | appName                 | attribute1Name | initialVal | attribute1Val | attribute2Val | attribute2Name | errMsg                                                                           |
            | Add EsandaNet application with space in iSeriesUserID  | EsandaNet               | iSeriesUserID  | test       | test val      | NSW, ACT      | userRegion     | iSeries User ID has invalid format or type or size                               |
            | Add GCIS application with space                        | GCIS                    | userID         | test       | test val      | null          | null           | GCIS User ID has invalid format or type or size                                  |
            | Add Internet Enquiry Access application with space     | Internet Enquiry Access | CRN            | 12345      | 99 22         | null          | null           | Customer Registration Number has invalid format or type or size                  |
            | Add GCIS application with 2 chars                      | GCIS                    | userID         | test       | te            | NA            | NA             | GCIS User ID has 2 characters, which is less than the required minimum length: 3 |
            | Add GCIS application with 1 chars                      | GCIS                    | userID         | test       | t             | null          | null           | GCIS User ID has 1 characters, which is less than the required minimum length: 3 |
            | Add Internet Enquiry Access application with alphabets | Internet Enquiry Access | CRN            | 12345      | test          | null          | null           | Customer Registration Number has invalid format or type or size                  |
