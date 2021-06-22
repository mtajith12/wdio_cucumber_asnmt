@chrome @ie @COBRA @OIM @SecurityDeviceUnblockScrns.feature
Feature: Security Device Maintenance - Unblock Token screens

  @AAMS-4461 @AAMS-2981-01 @AAMS-2986-01
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Enable Unblock option - Token in 'Pending' status
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer  |
      | What was the name of your first pet?  | answer1 |
      | What is your father's place of birth? | answer2 |
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check token activation confirmation message is displayed

  @AAMS-4462 @AAMS-2981-02 @AMS-2991-02 @AAMS-2991-03
  Scenario Outline: COBRA UI: Security Device Maintenance - Unblock Token - Enable Unblock option - Token in 'Enabled' status
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global      |
      | securityDevices | <deviceType>:<issuanceLocation> |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "<deviceType>" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "<deviceType>" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "<deviceType>" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then select "<deviceType>" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token screen elements
    Then BankUser enters "1234567" in Unblock Code field and clicks Generate Activation Code button
    Then verify Activation Code value is generated and displayed
    Then verify Generate Activation Code button is disabled
    Then BankUser clicks "Close" button
    Then verify Unblock Token dialog screen is closed

    Examples:
      | deviceType                           | issuanceLocation     |
      | Token Digipass 270                   | AUSTRALIA, Melbourne |
      | Token Digipass 276 (China Compliant) | CHINA, Chengdu       |

  @AAMS-4463 @AAMS-2981-03
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - bank user is not entitled
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4464 @AAMS-2981-06
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - token is not in correct state
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4465 @AAMS-2981-04
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - user is 'Disabled'
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Default OIM Bankuser" disables the "1st" API created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4466 @AAMS-2981-04
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - user is 'Deleted'
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Default OIM Bankuser" deletes the "1st" API created user
    Given "Default users" approves the "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4467 @AAMS-2981-05
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - device is not a token
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global |
      | securityDevices | ANZ Digital Key            |
    Given "Default users" approves the "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then select "ANZ Digital Key" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4468 @AAMS-2981-05
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Disable Unblock option - multiple devices selected
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global                                                                  |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270,Token Digipass 276 (China Compliant)" in Security Devices grid
    Then check "Unblock" button is disabled on Security Devices tab

  @AAMS-4469 @AAMS-2984-01
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Display error message when user is unverified
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token error message "MSG067" is displayed


  @AAMS-4470 @AAMS-2984-02
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Display error message when user does not have at least 2 C&R - Device Pending
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then delete the user's "1st" KBA in IDM for the "1st" API created User
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token error message "MSG068" is displayed

  @AAMS-4471 @AAMS-2984-02
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Display error message when user does not have at least 2 C&R - Device Active
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Then delete the user's "1st" KBA in IDM for the "1st" API created User
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token error message "MSG068" is displayed

  @AAMS-4472 @AAMS-2986-02
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Token Activation - select 'No'
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer  |
      | What was the name of your first pet?  | answer1 |
      | What is your father's place of birth? | answer2 |
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check token activation confirmation message is displayed
    Then BankUser clicks "No" button
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"

  @AAMS-4473 @AAMS-2986-03
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Token Activation - select 'Yes'
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer  |
      | What was the name of your first pet?  | answer1 |
      | What is your father's place of birth? | answer2 |
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check token activation confirmation message is displayed
    Then BankUser clicks "Yes" button
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then check Unblock Token screen elements

  @AAMS-4474 @AAMS-2991-01 @AAMS-2992-01 @AAMS-2992-02
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Generate activation code errors - field validations
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token screen elements
    Then BankUser enters "" in Unblock Code field and clicks Generate Activation Code button
    Then verify Unblock Code mandatory field error message
    Then BankUser enters "1" in Unblock Code field and clicks Generate Activation Code button
    Then verify Unblock Code incorrect length error message
    Then BankUser enters "123456" in Unblock Code field and clicks Generate Activation Code button
    Then verify Unblock Code incorrect length error message
    Then BankUser enters "123456789" in Unblock Code field and clicks Generate Activation Code button

  @AAMS-4475 @AAMS-2992-03
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Generate activation code errors - invalid unblock code
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then check the Security Devices tab default display in View User page
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then select "Token Digipass 270" in Security Devices grid
    Then check "Unblock" button is enabled on Security Devices tab
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token screen elements
    Then BankUser enters "abcdefg" in Unblock Code field
    Then verify that the Unblock Code field does not accept non-numeric characters
    Then BankUser enters "0000000" in Unblock Code field and clicks Generate Activation Code button
    Then verify Unblock Code invalid error message

  @AAMS-4476 @AAMS-2985-01
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Display message when another token is already activated
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks on "Edit" button on User Details page
    Then Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then BankUser adds Security Device "Token Digipass 270" with Location "AUSTRALIA, Melbourne"
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then BankUser logs out
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then BankUser selects "Token Digipass 270" with Status "Pending activation" and Description "Device awaiting activation" in Security Devices grid
    Then BankUser clicks "Unblock" security device button
    Then check Unblock Token error message "MSG069" is displayed

  @AAMS-4477 @AAMS-2985-02
  Scenario: COBRA UI: Security Device Maintenance - Unblock Token - Display message when another token is already activated - Device in Pending remove status
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global              |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks on "Edit" button on User Details page
    Then Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then BankUser adds Security Device "Token Digipass 270" with Location "AUSTRALIA, Melbourne"
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Given "Default users" approves the "1st" created user
    And BankUser navigates to search User page
    Then BankUser reset search
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks on "Edit" button on User Details page
    Then Bankuser clicks Security Devices tab
    Then BankUser selects "Token Digipass 270" with Status "Enabled" and Description "Device active" in Security Devices grid
    Then BankUser clicks on Remove Security Devices button and confirms
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then BankUser logs out
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then Bankuser clicks Security Devices tab
    Then BankUser selects "Token Digipass 270" with Status "Pending activation" and Description "Device awaiting activation" in Security Devices grid
    Then BankUser clicks "Unblock" security device button
    Then check token activation confirmation message is displayed
    Then BankUser clicks "Yes" button
    Then check Unblock Token error notification "MSG069" is displayed