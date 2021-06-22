Feature: To test as a bankuser we are able to register Resource for Term Deposit
  As a Bank User
  I want to be able to Register/Approve/Search/Edit/Deregister Resource for Term Deposit and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api

  @chrome @COBRA @ONAR-3334 @ONAR-6180 @dev
  Scenario Outline: 01. Create/Modify/Register/Approve/verify Audit for Resource Term Deposit for <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    Then Validate the "register" message for "Term Deposit"
    Then Search the "Term Deposit" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for Term Deposit
    Then BankUser edits the resource of Term Deposit - "Remove Division"
    Then Validate the "modify" message for "Term Deposit"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify division" workflow for Term Deposit
    Then BankUser validates the Audit Scenarios for Term Deposit
      | Description                                     | Action   |
      | Record was created and submitted for approval.  | Created  |
      | Record was approved and created.                | Approved |
      | Record was modified and submitted for approval. | Modified |
      | Changes to Record were approved.                | Approved |
    Then Search the "Term Deposit" in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for Term Deposit
    Then BankUser logs out
    Examples:
      | HostSystem | ClientId | Country |
      | CMM        | 123470   | AU      |
      | F10        | 90004    | HK      |
    @e2e @chrome @COBRA
    Examples:
      | HostSystem | ClientId | Country |
      | CMM        | 123470   | AU      |

  @chrome @COBRA @ONAR-6194 @ONAR-6769 @dev
  Scenario Outline: 02. Create/Modify/Register/Reject Resource for Term Deposit for <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given create a term deposit for "<HostSystem>" hostSystem "<ClientId>" client Id and "<Country>" country using api and "do not approve"
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for Term Deposit
    Then BankUser edits the resource of Term Deposit - "Remove Division"
    Then Validate the "modify" message for "Term Deposit"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for the Resource
    Then Search the "Term Deposit" in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Resource
    Then BankUser logs out
    Examples:
      | HostSystem | ClientId | Country |
      | CMM        | 123470   | AU      |
      | F10        | 90004    | HK      |
    # | F10        | 900033     | IN      |
    # | SYS        | 0000132740 | NZ      |
    # | F10        | 9000609    | TW      |
    # | INT        | 900047     | VN      |
    # | MDZ        | 203315     | CN      |

    @e2e @chrome @COBRA
    Examples:
      | HostSystem | ClientId | Country |
      | CMM        | 123470   | AU      |

  @chrome @COBRA @ONAR-6768 @dev
  Scenario Outline: 03. Create/Modify/De-Register Resource for Term Deposit for <HostSystem> <Country>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Create a Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    Then Validate the "register" message for "Term Deposit"
    Then Search the "Term Deposit" in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for Term Deposit
    Then BankUser edits the resource of Term Deposit - "Remove Division"
    Then Validate the "modify" message for "Term Deposit"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify division" workflow for Term Deposit
    Then Search the "Term Deposit" in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the "Term Deposit" in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for Term Deposit
    Then BankUser logs out

    Examples:
      | HostSystem | ClientId | Country   |
      | MDZ        | 201236   | SG |


 @chrome @COBRA @ONAR-6928 @dev
  Scenario Outline: 04.  Register Term Deposit - Change of Country - Non-Singapore to Non-Singapore
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Enter the fields for register Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    When User selects "China" from "country dropdown" in register Term deposit page
    Then The system must show values on host system dropdown for "China"
    Then The termdeposit details section disappears and client id value is cleared
    Examples:
      | HostSystem | ClientId | Country   |
      | CMM        | 120134   | Australia |

  @chrome @COBRA @ONAR-6928 @dev
  Scenario Outline: 05.  Register Term Deposit - Change of Country - Non-Singapore to Singapore
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Enter the fields for register Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    When User selects "Singapore" from "country dropdown" in register Term deposit page
    Then The system must show values on host system dropdown for "Singapore"
    Then The termdeposit details section appears as manual entry and client id value is cleared with disappeared search icon
    Examples:
      | HostSystem | ClientId | Country   |
      | CMM        | 120134   | Australia |

  @chrome @COBRA @ONAR-6928 @dev
  Scenario Outline: 06.  Register Term Deposit - Change of Country - Singapore to Non-Singapore
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Enter the fields for register Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    Then The termdeposit details section appears as manual entry and client id value is cleared with disappeared search icon
    When User selects "Australia" from "country dropdown" in register Term deposit page
    Then The system must show values on host system dropdown for "Australia"
    Then The termdeposit details section disappears and client id value is cleared
    Examples:
      | HostSystem | ClientId | Country   |
      | MDZ        | 120134   | Singapore |

  @chrome @COBRA @ONAR-6928 @dev
  Scenario Outline: 07.  Register Term Deposit - Change of Host System - Non-Singapore
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Enter the fields for register Resource for Term Deposit for "<HostSystem>" Host system with "<ClientId>" client ID for "<Country>" country
    When User selects "DLD" from "hostsystem dropdown" in register Term deposit page
    Then The system must show values on host system dropdown for "Australia"
    Then The termdeposit details section disappears and client id value is cleared
    Examples:
      | HostSystem | ClientId | Country   |
      | CMM        | 120134   | Australia |
    
  