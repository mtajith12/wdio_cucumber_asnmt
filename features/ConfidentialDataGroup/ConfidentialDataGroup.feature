Feature: To test as a bankuser we are able to register Resource for Confidential Data Group
  As a Bank User
  I want to be able to create/Search/View/Deregister Register Resource for CDG and changes to be reflected in CA

  Background: Create Confidential Data Group
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given Create Resource Confidential Data Group via API

  @chrome @COBRA  @ONAR-3332  @cit
  Scenario: 01. As a Bank Administrator, I want to register/Approve/Search/View/Modify a confidential data group
    Given "Default users" logins in to COBRA using a valid password
    Then Search the Resource CDG in searchscreen and check "Approved" workflow and validate it against CA
    When BankUser verifies the existing customer for CDG
    And BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Modify the user by Modifying "All Entitlements" entitlement with "Selected,Add" Confidential Data Group Resource
    Then Validate the "modify" message
    And BankUser logs out

