  @chrome @ie @COBRA @OIM @SearchOrg.feature
  Feature: As a bankuser we are able to search for a CAAS Org with various search criterias
      As a Bank User
      BankUser want to be able to search for the CAAS organisation with various search criterias

  @AAMS-1450 @AAMS-1467 @OIMcore
  Scenario: COBRA UI: Search Org - search with Org ID only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID of org created by API at no. 2 and verify results

  @AAMS-1451 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with Org Name only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgName of org created by API at no. 2 and verify results

  @AAMS-1452 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with BIN only
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search BIN of org created by API at no. 2 and verify results

  @AAMS-1453 @AAMS-1467 
  Scenario: COBRA UI: Search Org - search with Org ID and Org Name only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID and orgName of org created by API at no. 2 and verify results

  @AAMS-1454 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with Org ID and BIN only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID and BIN of org created by API at no. 2 and verify results

  @AAMS-1455 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with Org Name and BIN only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password 
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgName and BIN of org created by API at no. 2 and verify results

  @AAMS-1456 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with Org ID, Org Name and BIN only
    Given "Default users" creates "2" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID, orgName and BIN of org created by API at no. 2 and verify results

  @AAMS-1457 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with blank parameters 
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search without any search criteria and verify top 3 results for existance

  @AAMS-1458 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with partial text of Org ID only
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search with partial text in ID and verify results and verify top 3 results for partial text

  @AAMS-1459 @AAMS-1467 @OIMcore
  Scenario: COBRA UI: Search Org - search with partial text of Org Name only
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search with partial text in Name and verify results and verify top 3 results for partial text

  @AAMS-1460 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with partial text of BIN only
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search with partial text in BIN and verify results and verify top 3 results for partial text

  @AAMS-1461 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with special char in Org ID only
    Given "Default users" creates "3" organisations with a unique random string and a special char in ID and name
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID of org created by API at no. 1 and verify results

  @AAMS-1462 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with special char in Org Name only
    Given "Default users" creates "3" organisations with a unique random string and a special char in ID and name
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser search orgName of org created by API at no. 1 and verify results

  @AAMS-1463 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with comma separated values in Org ID
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser Search orgs with comma separated values in ID and verify results

  @AAMS-1464 @AAMS-1467 
  Scenario: COBRA UI: Search Org - search with comma separated values in Org Name
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser Search orgs with comma separated values in Name and verify results

  @AAMS-1465 @AAMS-1467
  Scenario: COBRA UI: Search Org - search with comma separated values in BIN
    Given "Default users" creates "3" organisations with a unique random string in orgData
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And check "New CAAS Org" tile does exist in the onboarding page
    And BankUser navigates to search CAAS Orgs page
    Then BankUser Search orgs with comma separated values in BIN and verify results
