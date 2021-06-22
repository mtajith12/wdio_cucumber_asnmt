Feature: To test as a bankuser data is cascading for ResourceGroup
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature
  CA

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create a Account "CAP" "015208"-"285414708" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"948794AUD00001" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"197921USD00001" and country "AU" using api and "approve" 
    Given create a resource group using api

  @chrome @ie @COBRA  @ONAR-3430 @dev @e2e
    Scenario: 01. Verify the cascade Resource for  Resource Group -Action-Assign/delete resource
    Given "Default approvers" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add All Entitlements with "Selected,Add Resource Group" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then Bankuser "Removes" "1" "Account" of "ResourceGroup" and approve the changes
    Then verify "Users" with "All Entitlements" entitlement if the "1" "Resource Group" are "removed"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "Adds" "1" "Account" of "ResourceGroup" and approve the changes
    Then verify "Users" with "All Entitlements" entitlement if the "1" "Resource Group" are "added"
    Then BankUser logs out

#
#  @chrome @ie @COBRA @ONAR-2266 @ONAR-3221 @dev @e2e
#  Scenario: 01. Create/Modify/Register/Reject customer user with All Entitlements and approve entitlements with Selected resources for adminRole Customer
#
#    Given "Default approvers" logins in to COBRA using a valid password
#    When bankUser verifies the created customer
#    Then search for created user in cobra
#    Then add Service Request - Appoint with "Selected,Add Legal Entity" Resources and register the customeruser
#    Then validate the "register" message
#    Then Bankuser verifies the User details for Service Request - Appoint
#    Then BankUser logs out
#    When "Default users" logins in to COBRA using a valid password
#    Then Approve the changes and validate the "register" notification messages
#    Then Bankuser "Removes" "1" "Account" of LegalEntity and approve the changes
#    Then verify "Users" with "Service Request - Appoint" entitlement if the "1" "Legal Entity" are "removed"
#    Then BankUser logs out

