Feature: To test as a bankuser we are able to register Resource for Loan Deal
  As a Bank User
  I want to be able to Register/Approve/Search/Edit/Deregister Resource for Loan Deal and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @COBRA @ONAR-3333 @dev  @ONAR-2739 @ONAR-3768 @qa2
  Scenario Outline: 01. Create/Modify/Register/Approve Resource for Deal for <HostSystem> hostSystem

    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Deal" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "Deal"
    Then Search the "Deal" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Deal" in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Deals"
    Then BankUser edits the resource of Deal - "Deal Name"
    Then Validate the "modify" message for "Deal"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the "Deal" in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Deals"
    Then executing additional CA validations for "Deal"
    |productsDB|
    Then Search the "Deal" in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Deal" in searchscreen and "Approve" "deregister" workflow
    Then BankUser logs out
    Examples:
      | HostSystem | Country   |
      | LIQ        | Australia |


  @chrome @COBRA @ONAR-3701 @dev @ONAR-6038  @qa2
  Scenario Outline: 02. Create/Register/Modify/De-register/Reject Resource for Deal for <HostSystem> hostSystem by modifying Remove Division
    Given create a "2" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Deal" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "Deal"
    Then Search the "Deal" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Deal in searchscreen and "Approve" "new" workflow and validate against CA
    Then BankUser edits the resource of Deal - "Remove Division"
    Then Validate the "modify" message for "Deal"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for the Resource
    Then BankUser edits the resource of Deal - "Remove Division"
    Then Validate the "modify" message for "Deal"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Deal in searchscreen and "Approve" "modified division" workflow and validate against CA
    Then Search the Deal in searchscreen and "Verify" "deregister" workflow and validate against CA
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Resource
    Then BankUser logs out
    Examples:
      | HostSystem | Country   |
      | LIQ        | Australia |


  @chrome @COBRA @dev @e2e @ONAR-6039 
  Scenario Outline: 03. Validate Audit  for for Loan Deals resource with <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Deal" for "<HostSystem>" Host system for "<Country>" country
    Then Validate the "register" message for "Deal"
    Then Search the "Deal" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Deal" in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Deals"
    Then BankUser validates the Audit Scenarios for Deal
      | Description                                    | Action   |
      | Record was created and submitted for approval. | Created  |
      | Record was approved and created.               | Approved |
    Then BankUser edits the resource of Deal - "Deal Name"
    Then Validate the "modify" message for "Deal"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the "Deal" in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Deals"
    Then BankUser validates the Audit Scenarios for Deal
      | Description                                     | Action   |
      | Changes to Record were approved.                | Approved |
      | Record was modified and submitted for approval. | Modified |
    Then BankUser logs out
    Examples:
      | HostSystem | Country   |
      | LIQ        | Australia |
