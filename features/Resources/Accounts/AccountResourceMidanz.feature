Feature: To test as a bankuser we are able to register Resource for midanz accounts
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for accounts and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api

  @dev @chrome @COBRA @ONAR-2577 @ONAR-3301
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for <HostSystem> hostSystem for Country <Country>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
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
    Then validate against CA for "Approve" "deregister" workflow for "Accounts"
    Then BankUser logs out
    Examples:
      | HostSystem | instance | AccountNumber  | Country   | accountCurrencyCode |
      | MDZ        |          | 999995AUD00001 | Australia |                     |
      | MDZ        | AUA      | 103705CNY01005 | China        | USD                  |
   #  | MDZ        | NZW      | 103705NZD01007 | New Zealand  | USD                 |
    @e2e @chrome @COBRA
    Examples:
      | HostSystem | instance | AccountNumber  | Country   | accountCurrencyCode |tag|
      | MDZ        |          | 197921USD00001 | Australia |                     |@TC-ONAR-2577|
      @qa2 @chrome @COBRA
    Examples:
      | HostSystem | instance | AccountNumber  | Country   | accountCurrencyCode |tag|
      | MDZ        |          | 999995AUD00001 | Australia |                     |@TC-ONAR-2577|
  @dev @chrome @COBRA @ONAR-2577 @ONAR-3301
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for Finacle hostSystem for Country <Country>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<SolID>" instance and "<AccountNumber>" accountNumber for "<Country>" country with "<Address>" currency code
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
    Then validate against CA for "Approve" "deregister" workflow for "Accounts"
    Then BankUser logs out
    Examples:
      | HostSystem | SolID | AccountNumber  | Country   |Address |
      | F10        |     1 | 999995AUD00001 | Hong Kong |           Sample          |
