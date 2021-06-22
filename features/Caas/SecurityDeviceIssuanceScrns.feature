@chrome @ie @COBRA @OIM @SecurityDeviceIssuanceScrns.feature
Feature: Security Device Search and Issuance screens
	As a Security Device Officer 
	BankUser can view and operates on Security Device Search and Issuance screens

  @AAMS-3192 @AAMS-3194
	Scenario: COBRA UI: Security Device Issuance - search screen and issuance screen
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Given "Default users" approves the "2nd" created user
    Given "Security Device Officer" logins in to COBRA using a valid password
    # AAMS-1317
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1318, AAMS-1321#02
    Then check the default display on Security Device Issuance search screen
    Then check "Issue Security Device" button is "Disabled" in menu bar
    Then BankUser collapse the search panel
    Then BankUser expand the search panel
    Then BankUser searches Security Device by "User ID" with values from the "1st" API created user
    # AAMS-1320, AAMS-1321#03
    Then check the display of search Security Device results summary grid headers
    Then check the search Security Device results are sorted by Date Requested in ascending order
    Then check "Issue Security Device" button is "Disabled" in menu bar
    Then check tokens are displayed correctly in search results for the "1st" API created User
    # AAMS-1317, AAMS-1321#01
    Then BankUser selects the "1st" entry
    Then check "Issue Security Device" button is "Enabled" in menu bar
    # Then check "Issue Security Device" option is "Enabled" for the "1st" entry in the Context Menu
    Then check "Issue Security Device" options are "Enabled" in Context Menu for the selected entry/entries
    Then BankUser reset search
    Then BankUser searches Security Device by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-1321#04
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Issue Security Device" button is "Disabled" in menu bar
    # AAMS-1344, AAMS-1321#05
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    Then check Security Device Issuance screen display
    Then check the details in Security Device Issuance page against the search result entry
    # AAMS-1369
    Then BankUser closes Security Device Issuance page by clicking on Cancel button
    # AAMS-1344, AAMS-1321#06
    Then BankUser opens the "2nd" entry from search Security Devices results by right clicking in context menu
    Then check the details in Security Device Issuance page against the search result entry
    # AAMS-1368#02,04
    Then BankUser enters Token Serial Number "1111111111" and clicks on Submit button
    Then check submit Security Device Issuance confirmation message
    Then BankUser cancels submitting Security Device Issuance
    Then check entered Serial Number is retained    
    Then BankUser logs out

  @AAMS-3193 @AAMS-3194
  Scenario: COBRA UI: Security Device Issuance - Serial Number input validation
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser searches for Security Devices with "Blank" criteria
    Then Bankuser dismisses pagination message if it pops up
    # AAMS-1321#06
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1367#01,02, #AAMS-3179, # AAMS-1368#01
    Then BankUser enters Token Serial Number "" and clicks on Submit button
    Then check Serial Number mandatory field error message is displayed
    Then BankUser enters Token Serial Number "123abc" and clicks on Submit button
    Then check Serial Number length error message is displayed
    Then BankUser enters Token Serial Number "*" and clicks on Submit button
    Then check Serial Number length error message is displayed
    Then BankUser enters Token Serial Number "  123 abc " and clicks on Submit button
    Then check entered Serial Number is trimmed of leading / trailing spaces
    Then check Serial Number data validation error message is displayed
    Then BankUser enters Token Serial Number with a random special character and clicks on Submit button
    Then check Serial Number data validation error message is displayed
    Then BankUser enters Token Serial Number "12345678900878736438746"
    Then check Serial Number field takes 10 digits as a maximum
    Then BankUser logs out
