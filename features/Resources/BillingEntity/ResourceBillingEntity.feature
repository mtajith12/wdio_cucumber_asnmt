Feature: To test as a bankuser we are able to register Resource for Billing Entity
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for Billing Entity and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @COBRA @dev @cit @ONAR-2724 @ONAR-3331 @qa2 
  Scenario Outline: 01. Create/Modify/Register/Approve/Reject Resource for Billing entity for <Country> country
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Billing Entity" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "billing entity"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Billing Entity"
    Then BankUser edits the resource of Billing Entity
    Then Validate the "modify" message for "billing entity"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Billing Entity"
    Then executing additional CA validations for "Billing Entity"
    |productsDB|
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Resource
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for "Billing Entity"
    Then BankUser logs out
    Examples:
      | HostSystem | Country     |
      |            | Australia   |
      |            | New Zealand |


  @chrome @COBRA @dev @cit @ONAR-6036  @qa2
  Scenario Outline: 02. Create/De-register/Reject Resource for Billing entity for <Country> country
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Billing Entity" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "billing entity"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Resource
    Then BankUser logs out
    Examples:
      | HostSystem | Country   |
      |            | Australia |


  @chrome @COBRA @dev @ONAR-6037 @ONAR-3768 @e2e
  Scenario Outline: 03. Validate Audit for Billing Entity resource with <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Billing Entity" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "billing entity"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Billing Entity"
    Then BankUser validates the Audit Scenarios for Billing Entity
      | Description                                    | Action   |
      | Record was created and submitted for approval. | Created  |
      | Record was approved and created.               | Approved |
    Then BankUser edits the resource of Billing Entity
    Then Validate the "modify" message for "billing entity"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Billing Entity"
    Then BankUser validates the Audit Scenarios for Billing Entity
      | Description                                     | Action   |
      | Changes to Record were approved.                | Approved |
      | Record was modified and submitted for approval. | Modified |
    Then BankUser logs out
    Examples:
      | HostSystem | Country   |
      |            | Australia |


