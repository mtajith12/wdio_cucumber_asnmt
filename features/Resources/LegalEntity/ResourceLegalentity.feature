Feature: To test as a bankuser we are able to register Resource for legal Entity
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for legal Entity and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @COBRA @ONAR-3340 @dev @ONAR-3974  @ONAR-3768 @TC-ONAR-5990
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for legal entity

    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP2-BSB>"-"<CAP2-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP3-BSB>"-"<CAP3-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP,CAP,MDZ"
    Then Validate the "register" message for "legal entity"
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Legal Entity"
    And Check the Legal Entity Name in Audit
    Then executing additional CA validations for Legal Entity - "Create"
      | productsDB          |
      | p_fulfil, p_service |
    Then BankUser edits the resource of Legal Entity by adding host system "MDZ,CAP,MDZ"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Legal Entity"
    Then Search the Legal Entity in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for "Legal Entity"
    Then BankUser logs out
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB | MDZ            |
      | 123456799         | 013148  | 123456911          | 013148   | 1234567912         | 013148   | 1234567193         | 013148   | 999996AUD09001 |
    # @chrome @COBRA @ONAR-3340
    # Examples:
    #   | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB | MDZ            |
    #   | 954581643         | 012301  | 955648176          | 012201   | 952774142          | 012556   | 954411089          | 012571   | 999995THB00001 |

  @chrome @COBRA  @TC-ONAR-5990 @dev
  Scenario Outline: 01. Create  Resource for legal entity for MDZ accounts
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ1>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ2>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ3>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ4>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,MDZ"
    Then Validate the "register" message for "legal entity"
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    Examples:
      | MDZ1           | MDZ2           | MDZ3           | MDZ4           | MDZ            |
      | 999996AUD09004 | 999996AUD09061 | 999996AUD09045 | 999996AUD59001 | 999996AUD09001 |

  @chrome @COBRA @dev @TC-ONAR-5990
  Scenario Outline: 01. Create  Resource for legal entity for CAP accounts
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP2-BSB>"-"<CAP2-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP3-BSB>"-"<CAP3-AccountNumber>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "CAP,CAP"
    Then Validate the "register" message for "legal entity"
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB |
      | 123456799         | 013148  | 123456911          | 013148   | 1234567912         | 013148   | 1234567193         | 013148   |
    @qa2 @chrome @COBRA
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB |
      | 239814022         | 012695  | 249988106          | 012006   | 259984942          | 014550   | 269974633          | 016620   |


  @chrome @COBRA @ONAR-3747 @dev @ONAR-3974
  Scenario Outline: 02. Add an Account already linked to a different Legal Entity
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP2-BSB>"-"<CAP2-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "register" message for "legal entity"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "error" message for "legal entity"
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | MDZ            |
      | 123456789         | 013148  | 123456711          | 013148   | 1234567212         | 013148   | 999996AUD00001 |

  @chrome @COBRA @ONAR-6042 @dev
  Scenario Outline: 03. Create/Modify/Reject Resource for legal entity
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "register" message for "legal entity"
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Legal Entity"
    Then BankUser edits the resource of Legal Entity
    Then Validate the "modify" message for "legal entity"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for the Legal Entity
    Then executing additional CA validations for Legal Entity - "Modify-Reject"
      | productsDB |
      |p_fulfil,p_service|
    Then Search the Legal Entity in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Legal Entity
    Then BankUser logs out
    Examples:

      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB | MDZ            |
      | 123456789         | 013148  | 123456711          | 013148   | 1234567212         | 013148   | 1234567112         | 013148   | 999996AUD00001 |


  @chrome @COBRA @ONAR-6043 @dev
  Scenario Outline: 04. Validate Audit for Legal Entity resource
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "register" message for "legal entity"
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Legal Entity"
    Then BankUser validates the Audit Scenarios for Legal Entity
      | Description                                    | Action   |
      | Record was created and submitted for approval. | Created  |
      | Record was approved and created.               | Approved |
    Then BankUser edits the resource of Legal Entity
    Then Validate the "modify" message for "legal entity"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Legal Entity"
    Then executing additional CA validations for Legal Entity - "Modify"
      | productsDB |
      | p_fulfil   |
    Then BankUser validates the Audit Scenarios for Legal Entity
      | Description                                     | Action   |
      | Record was modified and submitted for approval. | Modified |
      | Changes to Record were approved.                | Approved |
    Then BankUser logs out
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB | MDZ            |
      | 123456799         | 013148  | 123456911          | 013148   | 1234567912         | 013148   | 1234567192         | 013148   | 999996AUD09001 |
    @chrome @COBRA  @e2e
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB | MDZ            |
      | 181097963         | 012294  | 107429632          | 013510   | 180055024          | 014125   | 109991012          | 013516   | 101956USD00001 |


 @chrome @COBRA @ONAR-6079 @ONAR-6280 @dev
  Scenario Outline: 04. Validate serviceRequestLegalEntity field in accounts under Legal Entity resource
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"<MDZ>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "register" message for "legal entity"
    Then Search the Resource in searchscreen and "View" "None" field
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Legal Entity"
    Then Search the Resource in searchscreen and "View" "serviceRequestLegalEntity" field
    Then Search the Legal Entity in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Legal Entity in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for "Legal Entity"
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    Then Validate the "register" message for "legal entity"
    Then Search the Resource in searchscreen and "View" "None" field
    Then Search the Legal Entity in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | MDZ            |
      | 123456799         | 013148  | 123456911          | 013148   | 1234567912         | 013148   | 999996AUD09001 |
