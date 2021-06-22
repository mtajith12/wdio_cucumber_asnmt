Feature: To test as a bankuser we are able to Reject the changes requested for a customer user
  As a Bank User
  I want to be able to register/approve/register/approve/reject the customer user and the changes to be reflected in CA

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
  @chrome @ie @COBRA @ONAR-2253  @dev @e2e
  Scenario: To verify the Manage Summary grid of Users entity
    Given "Default approvers" logins in to COBRA using a valid password
    Then validate the elements present in the User screen
    And BankUser logs out

 @chrome @COBRA @ONAR-2453 @ONAR-3221 @dev
  Scenario Outline: 02.To Reject the modification of newly created Users record with All Entitlements and approve entitlements with Selected resources for   <admin> adminRole Customer
   Given create a customer using api
   Given create a "1" Division using api
   Given create a Account "CAP" "012010"-"954527647" and country "AU" using api and "approve"
   Given "Default users" logins in to COBRA using a valid password
   When bankUser verifies the created customer
   Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "Selected,Add" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
#    And validate the user is created in CA
    Then modify the user by Modifying "All Entitlements" entitlement with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then validate the "modify" message
    And BankUser logs out
    Given BankUser lands on cobra login page
    Then  "Default approvers" logins in to COBRA using a valid password
    Then reject the changes and validate the "modified" notification messages
    And BankUser logs out
    Examples:
      |admin|
      |Single|
  @chrome @COBRA @ONAR-2461  @dev @e2e
  Scenario Outline: 03.To Reject the Deregisteration of newly created Users record with All Entitlements and approve entitlements with Selected resources for   <admin> adminRole Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
#    And validate the user is created in CA
    Then deregister the user
    And BankUser logs out
    Given BankUser lands on cobra login page
    Then  "Default approvers" logins in to COBRA using a valid password
    Then reject the changes and validate the "deregister" notification messages
    And BankUser logs out
    Examples:
      |admin|
      |Dual|


