@chrome @ie @COBRA @OIM @UserSecDevicesAssignScrn.feature
Feature: User Security Devices Assignment Screen validations

  @AAMS-2597 @AAMS-2600
  Scenario: COBRA UI: Assigning security devices when creating User - default screen displays and cancel buttons
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    #AAMS-1204#01
    Then check Add Security Devices page default display
    #AAMS-1213#03, AAMS-1390#01, AAMS-1391#01, AAMS-1397#01,02, AAMS-1398#01
    Then BankUser clicks on Add Security Devices button
    Then check Add Security Device dialog default display
    Then check Issuance Location options and default values for all device types
    #AAMS-1390#02
    Then BankUser clicks on "Cancel" button in the Add Security Device dialog
    #AAMS-1399#01
    Then BankUser adds Security Device "Token Digipass 270" with Location "AUSTRALIA, Melbourne"
    Then BankUser adds Security Device "Token Digipass 276 (China Compliant)" with Location "CHINA, Chengdu"
    Then BankUser adds Security Device "ANZ Digital Key" with Location ""
    #AAMS-1204#02
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "No" in the cancel creation confirmation dialog
    Then check all entered Security Devices are retained on the grid
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "Yes" in the cancel creation confirmation dialog
    Then check "New User" tile does exist in the onboarding page
    Then BankUser logs out

  @AAMS-2598 @AAMS-2600
  Scenario: COBRA UI: Assigning security devices when creating User - add/remove devices
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
		Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    #AAMS-1213#01, AAMS-1386#02
    Then check "Add" Security Device option is "Enabled"
    Then check "Remove" Security Device option is "Disabled"
    #AAMS-1399#01
    Then BankUser adds Security Device "Token Digipass 270" with Location "AUSTRALIA, Melbourne"
    Then check Selected Devices Grid header columns
    Then check new Security Device "Token Digipass 270" has been added in Selected Devices grid correctly
    #AAMS-1213#01, AAMS-1386#02
    Then check "Add" Security Device option is "Enabled"
    Then check "Remove" Security Device option is "Disabled"
    #AAMS-1391#01,02
    Then BankUser clicks on Add Security Devices button
    Then check "Token Digipass 276 (China Compliant)" is an available option in Security Devices dropdown
    Then check "ANZ Digital Key" is an available option in Security Devices dropdown
    Then check "Token Digipass 270" is NOT an available option in Security Devices dropdown
    Then BankUser clicks on "Cancel" button in the Add Security Device dialog
    #AAMS-1399#01
    Then BankUser adds Security Device "Token Digipass 276 (China Compliant)" with Location "NEW ZEALAND, Wellington"
    Then check new Security Device "Token Digipass 276 (China Compliant)" has been added in Selected Devices grid correctly
    #AAMS-1391#01,02
    Then BankUser clicks on Add Security Devices button
    Then check "ANZ Digital Key" is an available option in Security Devices dropdown
    Then check "Token Digipass 270" is NOT an available option in Security Devices dropdown
    Then check "Token Digipass 276 (China Compliant)" is NOT an available option in Security Devices dropdown
    Then BankUser clicks on "Cancel" button in the Add Security Device dialog
    #AAMS-1399#01
    Then BankUser adds Security Device "ANZ Digital Key" with Location ""
    Then check new Security Device "ANZ Digital Key" has been added in Selected Devices grid correctly
    #AAMS-1213#02
    Then check "Add" Security Device option is "Disabled"
    #AAMS-1386#01,03
    Then BankUser selects Security Device "Token Digipass 270" in the grid
    Then check "Remove" Security Device option is "Enabled"
    Then BankUser attempts removing Security Device "Token Digipass 270" and cancels it
    Then check all entered Security Devices are retained on the grid
    Then BankUser attempts removing Security Device "Token Digipass 270" and confirms it
    Then check Security Device "Token Digipass 270" has been removed from Security Devices grid
    Then BankUser attempts removing Security Device "Token Digipass 276 (China Compliant)" and confirms it
    Then check Security Device "Token Digipass 276 (China Compliant)" has been removed from Security Devices grid
    Then BankUser attempts removing Security Device "ANZ Digital Key" and confirms it
    Then check Security Device "ANZ Digital Key" has been removed from Security Devices grid
    #AAMS-1386#04
    Then check "Remove" Security Device option is "Disabled"
    Then check "No Security Devices Selected" message is displayed in the Security Device grid
    Then BankUser logs out

  @AAMS-2599 @AAMS-2600
  Scenario: COBRA UI: Assigning security devices when creating User - continue without Customer assigned
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
    Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
		Then BankUser enters "userID" as "TestUser" and "null" as "null" to add "GCIS" and clicks OK
		Then BankUser enters "CRN" as "12345" and "null" as "null" to add "Internet Enquiry Access" and clicks OK
    Then BankUser adds "Online Trade" application to user
		Then BankUser adds "Institutional Insights" application to user
    Then BankUser moves from Applications page to Security Devices page
    Then BankUser adds Security Device "Token Digipass 270" with Location "INDONESIA, Jakarta"
    Then BankUser adds Security Device "Token Digipass 276 (China Compliant)" with Location "PHILIPPINES, Manila"
    Then BankUser adds Security Device "ANZ Digital Key" with Location ""
    Then BankUser clicks on "Continue" button
    #AAMS-1389#01,02
    Then check BankUser is directed to "User Notifications" page
    #AAMS-1388#01
    Then BankUser clicks on "Back" button
    Then check BankUser is directed to "Assign Security Devices" page
    Then check all entered Security Devices are retained on the grid
    Then BankUser clicks on "Back" button
    Then check BankUser is directed to "Assign Applications" page
    Then checks "EsandaNet" application is available in the application table
    Then checks "GCIS" application is available in the application table
    Then checks "Internet Enquiry Access" application is available in the application table
    Then checks "Online Trade" application is available in the application table
    Then checks "Institutional Insights" application is available in the application table
    Then BankUser logs out

  @AAMS-2850 @AAMS-2600 @AAMS-2840
  Scenario: COBRA UI: Assigning security devices when creating User - continue with a Customer assigned
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    Then BankUser adds Security Device "ANZ Digital Key" with Location ""
    Then BankUser adds Security Device "Token Digipass 270" with Location "TAIWAN, Taipei"
    Then BankUser adds Security Device "Token Digipass 276 (China Compliant)" with Location "VIETNAM, Ho Chi Minh City"
    Then BankUser clicks on "Continue" button
    #AAMS-1389#01,02
    Then check BankUser is directed to "Assign Entitlements" page
    #AAMS-1388#01
    Then BankUser clicks on "Back" button
    Then check BankUser is directed to "Assign Security Devices" page
    Then check all entered Security Devices are retained on the grid
    Then BankUser clicks on "Back" button
    Then check BankUser is directed to "Assign Applications" page
    #AAMS-1731#01
    Then check "Transactive Global" has been assigned on Add Application page by default
    Then BankUser logs out

  @AAMS-2615 @AAMS-2600
  Scenario: COBRA UI: User email and mobile number required for ADK
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org, without email and mobile number, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    Then BankUser adds Security Device "ANZ Digital Key" with Location ""
    #AAMS-1800
    Then BankUser clicks on "Continue" button
    Then check "User's Email Address and Mobile Number must be provided for ANZ Digital Key to be assigned." message is displayed
    Then BankUser logs out
