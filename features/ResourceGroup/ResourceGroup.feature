Feature: As a Bank Administrator, i want to Register/Approve/Search/View/Modify a Resource Group for Customer
  As a Bank User

  I want to be able to Register/Approve/Search/View/Modify a Resource Group for Customer and changes to be reflected in CA

  @chrome @COBRA @ONAR-3361 @ONAR-3768 @ONAR-3737 @dev @ONAR-6658
  Scenario: 01.Register/Approve/Search/View/Modify/Reject a Resource Group for Customer with all <HostSystem> hostSystem
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "999996AUD00001" with bsb "" and country "Australia" and approves it
    Then Bankuser registers a resource with "EXT" hostSystem with AccountNumber "999995AUD00001" with bsb "" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "123456789" with bsb "013148" and country "Australia" and approves it
    Then Bankuser registers a resource with "VAM" hostSystem with AccountNumber "9810001000001" with bsb "" and country "Singapore" and approves it
    Then Bankuser registers a resource with "VAM" hostSystem with AccountNumber "9810001000002" with bsb "" and country "Hong Kong" and approves it
    # Then Bankuser registers a resource with "SYS" hostSystem with AccountNumber "01-0071-0108553-52" with bsb "" and country "New Zealand" and approves it
    # Then Bankuser registers a resource with "OBK" hostSystem with AccountNumber "095134140" with bsb "" and country "Australia" and approves it
    # Then Bankuser registers a resource with "V2P" hostSystem with AccountNumber "095134145" with bsb "" and country "Australia" and approves it
    # Then Bankuser registers a resource with "XBK" hostSystem with AccountNumber "1234561234567890" with bsb "" and country "New Zealand" and approves it
    # Then Bankuser registers a resource with "NZM" hostSystem with AccountNumber "097133145" with bsb "" and country "New Zealand" and approves it

    Given "Default users" logins in to COBRA using a valid password
    And BankUser creates a resource group
    Then Validate the "register" message for "Accounts"
    Then Search the Resource Group in searchscreen and "Verify" "new" workflow
    Then Validate the added Accounts in the Resource Group
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource Group in searchscreen and "Approve" "new" workflow
    Then Validate the added Accounts in the Resource Group
    Then validate against CA for "Approve" "new" workflow for "Resource Group"
    Then executing additional CA validations for Resource Group - "Create"
    Then BankUser edits the resource group
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for Resource Group
    Then BankUser edits the resource group
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource Group in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Resource Group"
    Then executing additional CA validations for Resource Group - "Modify"
    Then BankUser logs out


@chrome @COBRA @ONAR-6031 @dev 
  Scenario Outline: 03.Register/Approve/Search/View/Modify/validate Audit for a Resource Group with all <HostSystem> hostSystem
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    And Bankuser registers a resource with "<HostSystem>" hostSystem with AccountNumber "<AccountNumber>" with bsb "<BSB>" and country "<Country>" and approves it

    Given "Default users" logins in to COBRA using a valid password
    And BankUser creates a resource group
    Then Validate the "register" message for "Accounts"
    Then Search the Resource Group in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource Group in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Resource Group"
    Then BankUser edits the resource group
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource Group in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Resource Group"
    Then BankUser validates the Audit Scenarios for Resource Group
    |Description                                        |Action   |
    |Record was created and submitted for approval.     |Created  |
    |Record was approved and created.                   |Approved |
    |Record was modified and submitted for approval.    |Modified |
    |Changes to Record were approved.                   |Approved |
    Then BankUser logs out

 Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 999996AUD00001 | Australia |

  @e2e @chrome @COBRA
  Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 157818USD00300 | Australia |



  @chrome @ie @COBRA @dev @e2e @ONAR-6032 
  Scenario: To verify the Manage Summary grid of Resource Group entity
    Given "Default approvers" logins in to COBRA using a valid password
    Then validate the elements present in the Resource Group screen
    And BankUser logs out





