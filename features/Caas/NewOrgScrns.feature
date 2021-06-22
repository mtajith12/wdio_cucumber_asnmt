@chrome @ie @COBRA @OIM @NewOrgScrns.feature
Feature: Screen validation tests for CAAS Org related pages
  As a Bank User
  BankUser want to be able to view and operate on the CAAS Org pages

  @AAMS-1440 @AAMS-1466
  Scenario: COBRA UI: Create Org screen validation - cancel creating org after entering data
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New CAAS Org" tile does exist in the onboarding page
    When BankUser navigates to "New CAAS Org" page
    Then BankUser fill in CAAS Org data on the create Org page
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on cancel button in confirmation dialog
    Then check entered org data are retained
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on confirm button in confirmation dialog
    Then check "New CAAS Org" tile does exist in the onboarding page

  @AAMS-1441 @AAMS-1466
  Scenario: COBRA UI: Create Org screen validation - cancel creating org before entering data
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser cancel creating Org before entering the org data
    Then check "New CAAS Org" tile does exist in the onboarding page

  @AAMS-1442 @AAMS-1466
  Scenario: COBRA UI: Create Org screen validation - Display/Add/Remove applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then check Applications grid displayed - No applications assigned
    Then BankUser clicks on Add applications button
    Then check all applications are displayed in Select Applications grid in alphabetic order
    Then BankUser add application "Institutional Insights"
    Then check "Institutional Insights" is displayed on the 1st row in the Selected Applications grid
    Then BankUser clicks on Remove applications button
    Then check notification message MSG036 is displayed
    Then BankUser dismiss the notification dialog
    Then BankUser clicks on Add applications button
    Then check "Institutional Insights" is NOT displayed in Select Applications dialog
    Then BankUser dismiss the Select Applications dialog
    Then BankUser clicks on Add applications button
    Then BankUser add application "eMatching"
    Then check "eMatching" is displayed on the 1st row in the Selected Applications grid
    Then check "Institutional Insights" is displayed on the 2nd row in the Selected Applications grid
    Then BankUser remove the 1st application
    Then check "Institutional Insights" is displayed on the 1st row in the Selected Applications grid
    Then BankUser clicks on Add applications button
    Then check "eMatching" is displayed on the 1st row in the Select Applications grid
    Then BankUser dismiss the Select Applications dialog
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on confirm button in confirmation dialog

  @AAMS-1443 @AAMS-1466
  Scenario: COBRA UI: Create Org screen validation - enable/disable, add/remove application options
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then check Add button is Enabled
    Then check Remove button is Disabled
    Then BankUser clicks on Add applications button
    Then BankUser add application "eMatching"
    Then check "eMatching" is displayed on the 1st row in the Selected Applications grid
    Then check Add button is Enabled
    Then check Remove button is Enabled
    Then BankUser add all applications from Select Applications dialog
    Then check all applications are displayed in Selected Applications grid in alphabetic order
    Then check Add button is Disabled
    Then check Remove button is Enabled
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on confirm button in confirmation dialog

  @AAMS-1444 @AAMS-1466
  Scenario Outline: COBRA UI: Create Org data validation - invalid special characters
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser fill in Org data with id "<orgId>", name "<orgName>" and bin "<bin>"
    Then BankUser clicks on submit button to create Org
    Then check "orgId" data validation error on Create Org screen
    Then check "orgName" data validation error on Create Org screen
    Then check "bin" data validation error on Create Org screen
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on confirm button in confirmation dialog
    Examples:
      | orgId       | orgName    | bin     |
      | abcd 1234   | abcd--6785 | ab-1234 |
      | idAbcd0123* | abcd 123;  | abc123* |
      | abcd#123    | id0123<    | ab123$  |
      | abcd%1234   | id0>123    | abc 123 |
      | abcd!1234   | id01/**/23 | Abc#123 |
      | abcd?1234   | id01©23    | Abc*123 |

  @AAMS-1445 @AAMS-1466
  Scenario: COBRA UI: Create Org data validation - blank mandatory fields
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser clicks on submit button to create Org
    Then check "orgId" mandatory field error on Create Org screen
    Then check "orgName" mandatory field error on Create Org screen
    Then check "bin" mandatory field error on Create Org screen
    Then BankUser cancel creating Org before entering the org data

  @AAMS-1446 @AAMS-1466
  Scenario: COBRA UI: Create Org data validation - maximum field lengths
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser fill in Org data with id, name and bin longer than allowed max lengths
    Then check "orgId" field has been truncated to the max allowed length
    Then check "orgName" field has been truncated to the max allowed length
    Then check "bin" field has been truncated to the max allowed length
    Then BankUser cancel creating Org after entering the org data
    Then BankUser clicks on confirm button in confirmation dialog

  @AAMS-1447 @AAMS-1466
  Scenario: COBRA UI: Search Org screen validation - expand/collapse search panel
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    Then check the default display on search Orgs page
    Then BankUser enters search Org criteria:
      | ID                          | ABcd#1234 |
      | Full Name                   | test      |
      | Business Identifying Number | 123456    |
      | Workflow                    | Approved  |
    Then BankUser collapse the search panel
    Then BankUser expand the search panel
    Then check entered search Org criterias have been retained:
      | ID                          | ABcd#1234 |
      | Full Name                   | test      |
      | Business Identifying Number | 123456    |
      | Workflow                    | Approved  |
    Then check Status field has its default value set on Search Org page

  @AAMS-1448 @AAMS-1466
  Scenario: COBRA UI: Search Org screen validation - non-existent org data
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    Then BankUser search for Org that does not exist in the system
    Then check MSG_007 is displayed in Search Org Results grid

  @AAMS-1449 @AAMS-1466
  Scenario: COBRA UI: Search Org screen validation - trim leading/trailing spaces in criterias
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    Then BankUser enters search Org criteria with leading/trailing spaces and click on search button:
      | ID                          | ABcd#1234 |
      | Full Name                   | aaa bb    |
      | Business Identifying Number | 123456    |
    Then check entered search Org criterias have been retained:
      | ID                          | ABcd#1234 |
      | Full Name                   | aaa bb    |
      | Business Identifying Number | 123456    |
    Then BankUser logs out

  @AAMS-5454 @AAMS-257
  Scenario: COBRA UI: Create Org data validation - uniqueness check same org name
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    When BankUser fills in Org data with same name as the "1st" API created org
    Then BankUser clicks on submit button to create Org
    Then verify the similar caas org record message
    Then click "No" on the similar caas org dialog
    Then BankUser clicks on submit button to create Org
    Then click "Yes" on the similar caas org dialog
    Then check "New CAAS Org" tile does exist in the onboarding page

  @AAMS-5455 @AAMS-257
  Scenario: COBRA UI: Create Org data validation - uniqueness check similar org name
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    When BankUser fills in Org data with similar name as the "1st" API created org
    Then BankUser clicks on submit button to create Org
    Then verify the similar caas org record message
    Then click "No" on the similar caas org dialog
    Then BankUser clicks on submit button to create Org
    Then click "Yes" on the similar caas org dialog
    Then check "New CAAS Org" tile does exist in the onboarding page    

  @AAMS-5456 @AAMS-257
  Scenario: COBRA UI: Create Org data validation - uniqueness check same org bin
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    When BankUser fills in Org data with same bin as the "1st" API created org
    Then BankUser clicks on submit button to create Org
    Then verify the similar caas org record message
    Then click "No" on the similar caas org dialog
    Then BankUser clicks on submit button to create Org
    Then click "Yes" on the similar caas org dialog
    Then check "New CAAS Org" tile does exist in the onboarding page

  @AAMS-5503 @AAMS-1232
  Scenario Outline: COBRA UI: Create Org - Existing OIM Org - Coexistence uniqueness check
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser fill in exact Org data with id "<orgId>", name "<orgName>" and bin "<bin>"
    Then BankUser clicks on submit button to create Org
    Then check error message for existing CAAS Org in OIM
    Examples:
    | orgId         | orgName       | bin         |
    | AAMS_3016_ORG | AAMS_3016_ORG | AAMS3016ORG | 