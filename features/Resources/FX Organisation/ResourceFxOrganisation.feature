Feature: To test as a bankuser we are able to register Resource for FX Organisation
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for FX Organisation and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @COBRA  @ONAR-2585 @ONAR-3768 @ONAR-6110 @dev @qa2
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for FX Organisation for <HostSystem> hostSystem for <Country> country

    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resource
    And Register a Resource for "FX Organisation" for "<HostSystem>" Host system and "<Country>" country
    Then Validates the "register" message for "fx organisation"
    Then Search the FX Organisation in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "FX Organisation"
    Then executing additional CA validations for FX Organisation - "Create"
    |productsDB |
    |p_contractmgmt|
    Then BankUser edits the resource of Fx Organisation - "Resource Name"
    Then Validates the "modify" message for "fx organisation - edit Resource Name"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "modify1" workflow
    Then validate against CA for "Approve" "modify1" workflow for "FX Organisation"
    Then executing additional CA validations for FX Organisation - "Modify1"
    |productsDB |
    Then BankUser edits the resource of Fx Organisation - "Product entitlements"
    Then Validates the "modify" message for "fx organisation - edit Product Entitlements"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "modify2" workflow
    Then validate against CA for "Approve" "modify2" workflow for "FX Organisation"
    Then executing additional CA validations for FX Organisation - "Modify2"
    |productsDB |
    |p_contractmgmt|
    Then Search the FX Organisation in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for "FX Organisation"
    And Re-register the "FX Organisation" using the same CSS ID for "<HostSystem>" and "<Country>" country
    Then Validates the "register" message for "fx organisation"
    Then Search the FX Organisation in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "Re-register" workflow for "FX Organisation"
    Then BankUser logs out
    Examples:
      | HostSystem| Country      |
      | CSS       | Australia    |
      | CSS       | New Zealand  |
#      | CSS       | Singapore    |
#      | CSS       | Hong Kong    |


@chrome @COBRA  @ONAR-6040 @dev @qa2
  Scenario Outline: 02. Create/Register Resource for FX Organisation for <HostSystem> hostSystem for <Country> country and Modify/Approve/Reject for Remove Division
    Given create a "2" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resource
    And Register a Resource for "FX Organisation" for "<HostSystem>" Host system and "<Country>" country
    Then Validates the "register" message for "fx organisation"
    Then Search the FX Organisation in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "new" workflow
    Then BankUser edits the resource of Fx Organisation - "Remove Division"
    Then Validates the "modify" message for "fx organisation - Remove Division"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified division" notification messages for Fx Organisation
    Then Search the FX Organisation in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for Fx Organisation
    Then BankUser logs out
    Examples:
      | HostSystem| Country      |
      | CSS       | Australia    |


  @chrome @COBRA  @ONAR-6041 @dev @e2e
  Scenario Outline: 03. Validate Audit for FX Organisation with <HostSystem> hostSystem for <Country> country
    Given create a "2" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resource
    And Register a Resource for "FX Organisation" for "<HostSystem>" Host system and "<Country>" country
    Then Validates the "register" message for "fx organisation"
    Then Search the FX Organisation in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "new" workflow
    Then BankUser validates the Audit Scenarios for FX Organisation
    |Description                                        |Action   |
    |Record was created and submitted for approval.     |Created  |
    |Record was approved and created.                   |Approved |
    Then BankUser edits the resource of Fx Organisation - "Product entitlements"
    Then Validates the "modify" message for "fx organisation - Product Entitlements"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the FX Organisation in searchscreen and "Approve" "modified entitlements" workflow and validate against CA
    Then BankUser validates the Audit Scenarios for FX Organisation
    |Description                                        |Action  |
    |Changes to Record were approved.                   |Approved|
    |Record was modified and submitted for approval.    |Modified|
    Then BankUser logs out
 Examples:
    | HostSystem| Country      |
    | CSS       | Australia    |




