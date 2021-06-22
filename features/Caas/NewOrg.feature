@chrome @ie @COBRA @OIM @NewOrg.feature
Feature: To test as a bankuser we are able to create a new CAAS Org, search org by ID and view org details
  As a Bank User
  BankUser want to be able to create/search/view the CAAS organisation

  @AAMS-1402 @AAMS-1432 @AAMS-250 @AAMS-251 @AAMS-416
  Scenario: COBRA UI: Create Org - no applications assigned, search and view the org
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New CAAS Org" tile does exist in the onboarding page
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with 0 applications
    Then check CAAS Org has been created successfully
    Then BankUser navigates to search CAAS Orgs page
    Then BankUser search CAAS Org by ID
    Then BankUser open the Org details page from search result
    Then BankUser view the Org details without applications
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                           | Action  |
      | Record was created and auto-approved. | Created |
    Then BankUser logs out
    Then check CAAS Org has been created in LDS

  @AAMS-1403 @AAMS-1432 @AAMS-250 @AAMS-251 @AAMS-416
  Scenario: COBRA UI: Create Org - 2 applications assigned, search and view the org
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New CAAS Org" tile does exist in the onboarding page
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with 2 applications
    Then check CAAS Org has been created successfully
    Then BankUser navigates to search CAAS Orgs page
    Then BankUser search CAAS Org by ID
    Then BankUser open the Org details page from search result
    Then BankUser view the Org details with applications
    # AAMS-246#03
    Then BankUser views the Users tab and check "No Record Found" is displayed
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                           | Action  |
      | Record was created and auto-approved. | Created |
    Then BankUser logs out
    Then check CAAS Org has been created in LDS with the assigned Apps

  @AAMS-1404 @AAMS-1432 @OIMcore @AAMS-250 @AAMS-251 @AAMS-416
  Scenario: COBRA UI: Create Org - all applications assigned, search and view the org
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New CAAS Org" tile does exist in the onboarding page
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with All applications
    Then check CAAS Org has been created successfully
    Then BankUser navigates to search CAAS Orgs page
    Then BankUser search CAAS Org by ID
    Then BankUser open the Org details page from search result
    Then BankUser view the Org details with applications
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                           | Action  |
      | Record was created and auto-approved. | Created |
    Then BankUser logs out
    Then check CAAS Org has been created in LDS with the assigned Apps

  @AAMS-1406 @AAMS-1432
  Scenario: COBRA UI: Create Org - trimmed leading/trailing spaces
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with leading/trailing spaces in orgData, with a success
    Then BankUser navigates to search CAAS Orgs page
    Then BankUser search CAAS Org by ID
    Then BankUser logs out
    Then check CAAS Org has been created in LDS

  @AAMS-1407 @AAMS-1432 @OIMcore
  Scenario: COBRA UI: Create Org - allowed special characters
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to "New CAAS Org" page
    When BankUser onboards new CAAS Org with allowed special characters in orgData
    Then check CAAS Org has been created successfully
    Then BankUser logs out
    Then check CAAS Org has been created in LDS

  @AAMS-1408 @AAMS-1432
  Scenario: COBRA UI: Create Org - failure due to Org ID already exists
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with 1 applications
    Then check CAAS Org has been created successfully
    Then BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with same ID
    Then check Org ID already exists error notification
    Then BankUser logs out
