Feature: To test as a bankuser we are able to register an user with all options
  As a Bank User
  I want to be able to register/approve/register/approve/reject the customer user with CM 'Approve'and  CC 'Authorised Signatory' Role and  and the changes to be reflected in CA

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api

  @chrome @ie @COBRA @ONAR-3284 @dev @ONAR-3633 @ONAR-6318
  Scenario Outline: 01. Create/Modify/Register/Reject customer user for <admin> role Customer
    Given create a customer using api
    Given create a "1" Division using api

    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ-1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ-2-AccountNumber>" and country "AU" using api and "approve"
    Given create a legal entity using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ-CN-AccountNumber>" and country "CN" using api and "approve"
    Given create a Account "SYS" ""-"<SYS-AccountNumber>" and country "NZ" using api and "approve"
    Given create a Account "EXT" "<EXT-BICCODE>"-"<EXT-AccountNumber>" and country "AU" using api and "approve"
    Given create a resource group using api
    Given create a Role using api
    Given "Default approvers" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
 #   Note: if the daily limit is already set for the User , the value will not be edited , only the fields with no Value set would be editied.
    Then add All Entitlements with "All" Resources with Daily limit "250000" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
 #  Modify with selected accounts and approve
    Then modify the user by Modifying "All Entitlements" entitlement with "Selected,Add" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then modify the user by Modifying "All Entitlements" entitlement with "existing" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then validate the "modify" message
    And BankUser logs out
    When  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then modify the user by Modifying "All Entitlements" entitlement with "Selected,Add Resource Group" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then modify the user by Adding "Custom Role" entitlement with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    And BankUser logs out
    When  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then modify the user by Adding "Service Request - Appoint" entitlement with "Selected,Add Legal Entity" Resources
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And BankUser logs out
    Examples:
      |admin |CAP-AccountNumber|CAP-BSB |EXT-BICCODE|EXT-AccountNumber |MDZ-1-AccountNumber  |MDZ-2-AccountNumber |MDZ-CN-AccountNumber |SYS-AccountNumber |
      |Dual  |181097963        |012294  |ABNAAU2BXXX|5199625728        |948794AUD00001       |197921USD00001      |381335CNY40640       |11-8576-0035173-03|
    @chrome @ie @COBRA @TC-ONAR-3284
    Examples:
      |admin |CAP-AccountNumber|CAP-BSB |EXT-BICCODE|EXT-AccountNumber|MDZ-1-AccountNumber |MDZ-2-AccountNumber|MDZ-CN-AccountNumber |SYS-AccountNumber |
      |Dual  |181097963        |012294  |ABNAAU2BXXX|5199625728       |948794AUD00001      |197921USD00001     |381335CNY40640       |11-8576-0035173-03|

@chrome @ie @COBRA @ONAR-6182 @e2e
  Scenario Outline: 02. Create/Modify/Register customer user for <admin> role Customer with term deposit resource
    Given create a customer using api
    Given create a "1" Division using api
    Given create a term deposit for "CMM" hostSystem "127128" client Id and "AU" country using api and "approve"
    Then Register CAAS User using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Modifying "All Entitlements" entitlement with "Selected,Add Term Deposit" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    And BankUser logs out
    Examples:
      |admin |
      |Dual  |
    
    
    @chrome @ie @COBRA @ONAR-7007 @e2e
    Scenario Outline: 02. Create/Modify/Register customer user for <admin> role Customer with term deposit resource - Modify entitlement
    Given create a customer using api
    Given create a "1" Division using api
    Then Register CAAS User using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Create a Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId1>" client ID for "<Country>" country
    Then Validate the "register" message for "Term Deposit"
    Then Search the "Term Deposit" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
      Given "Default users" logins in to COBRA using a valid password
 #  Modify with selected accounts and approve
    Then modify the user by Modifying "All Entitlements" entitlement with "Selected,Add Term Deposit" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    And BankUser logs out
    Examples:
      |admin | HostSystem | ClientId | Country   |ClientId1|
      |Dual  | MDZ        | 201236   | SG |201237         |
  
  
  @chrome @ie @COBRA @dev @ONAR-6197
  Scenario Outline: 03. Create/verify that existing resource is not added when non-existing Resource is searched.
    Given create a customer using api
    Given create a "1" Division using api
    Then Register CAAS User using api
    Given create a Account "CAP" "013350"-"199625728" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then modify the user by Modifying "All Entitlements" entitlement with "Selected,Add non-existing Account" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    And BankUser logs out
    Examples:
      | admin  |
      | Single |

@chrome @ie @COBRA @ONAR-6576 @dev
  Scenario Outline: 04. Register/dergister customer user for <admin> role and register again to same customer
    Given create a customer using api
    Given create a "1" Division using api
    Then Register CAAS User using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Modifying "All Entitlements" entitlement with "All" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    When bankUser verifies the created customer
    And validate the user is created in CA for "<admin>" adminModel
    And BankUser logs out
    Examples:
     |admin |
     |Dual  |
