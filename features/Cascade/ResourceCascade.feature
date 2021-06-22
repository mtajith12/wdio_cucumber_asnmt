Feature: To test as a bankuser data is cascading for Resource
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"

  @chrome @ie @COBRA @ONAR-3428 @dev @e2e
  Scenario: 01. Verify the cascade Resource for Resource -Action-Removal of product
    Given create a Account "CAP" "015208"-"285414708" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add All Entitlements with "Selected,Add" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "AU Domestic (Direct Credit)" "Product" of Resource and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then verify "Users" with "All Entitlements" entitlement if the "AU Domestic (Direct Credit)" "Resource" are "removed"
    And BankUser logs out

  @chrome @ie @COBRA @ONAR-6020 @dev
    Scenario: 02. Verify the cascade Resource for Resource -Action-Un-Assign from Division
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add All Entitlements with "Selected,Add,Division,1" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "un-Assign" "1" "Division" of Resource and approve the changes
   Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then verify "Users" with "All Entitlements" entitlement if the "AU Domestic (Direct Credit)" "Resource" are "removed"
    Then verify 1 "Divisions" if "Resource" is "removed"
    And BankUser logs out

