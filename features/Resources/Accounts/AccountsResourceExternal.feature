Feature: To test as a bankuser we are able to register Resource  for external and cross bank accounts
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for accounts and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api

  @dev @chrome @COBRA @ONAR-2709 @ONAR-2660 @ONAR-3302 @ONAR-2590
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for hostSystem <HostSystem> and country <Country>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<bicCode>" BICCode and "<AccountNumber>" accountNumber for "<Country>" country with "<accountCurrencyCode>" currency code
    Then Validate the "register" message for "accounts"
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
    Then validate against CA for "Approve" "deregister" workflow for "Accounts"
    Then BankUser logs out

    Examples:

      | HostSystem | bicCode             | AccountNumber    | Country         | accountCurrencyCode |
      | EXT        | AAMNAU21XXX         | 999995AUD00004   | Australia       | AUD                 |
      | EXT        | AACCGB21XXX         | 34567EUR567805   | United Kingdom  | EUR                 |
      | EXT        | AMCLNZ21XXX         | 834567NZD54781   | New Zealand     | NZD                 |
      | EXT        | AAMCUS41XXX         | 214567USD54783   | United States Of America, The | USD        |
      | EXT        | ANZBPGPXXXX         | 456754PAG75702   | Papua New Guinea| PGK                 |

    @e2e @chrome @COBRA
    Examples:
      | HostSystem | bicCode             | AccountNumber    | Country         | accountCurrencyCode |Tag|
      | EXT        | AAMNAU21XXX         | 999995AUD00001   | Australia       | AUD                 |@ONAR-2709|
