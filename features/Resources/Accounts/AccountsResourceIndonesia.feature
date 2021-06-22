Feature: To test as a bankuser we are able to register Resource for indonesia
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for accounts and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password

  @chrome @COBRA @dev @ONAR-2709
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for hostSystem <HostSystem>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<bicCode>" BICCode and "<AccountNumber>" accountNumber for "<Country>" country with "<accountCurrencyCode>" currency code
    Then Validate the "register" message for "accounts"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser edits the Account resource
    Then Validate the "modify" message for "accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Accounts"
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then validate against CA for "Verify" "deregister" workflow for "Accounts"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "deregister" workflow
    Then BankUser logs out

    Examples:
      | HostSystem | bicCode             | AccountNumber    | Country     | accountCurrencyCode |
      | EXT        | BBAIIDJAXXX         | 103705IDR00003   | Indonesia   | IDR                 |

  @chrome @COBRA @ONAR-2707
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<instance>" instance and "<AccountNumber>" accountNumber for "<Country>" country with "<accountCurrencyCode>" currency code
    Then Validate the "register" message for "accounts"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser edits the Account resource
    Then Validate the "modify" message for "accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Accounts"
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then validate against CA for "Verify" "deregister" workflow for "Accounts"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "deregister" workflow
    Then BankUser logs out
    Examples:
      | HostSystem | instance | AccountNumber  | Country   | accountCurrencyCode |
      | MDZ        | NZD      | 103705NZD00001 | Indonesia | AUD                 |
