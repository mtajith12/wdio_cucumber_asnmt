Feature: To test as a bankuser we are able to register Resource for accounts
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Resource for accounts(CAP,CMM,OBK,GL,XBK,syematics,mantec) and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @dev  @chrome @COBRA @ONAR-2550  @ONAR-2715 @ONAR-2730 @ONAR-2733 @ONAR-2581 @ONAR-2579 @ONAR-2753  @ONAR-2662 @ONAR-6303
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for accounts for <HostSystem> hostSystem

    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
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
    Then executing additional CA validations for "Accounts"
      | productsDB |
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then validate against CA for "Verify" "deregister" workflow for "Accounts"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "deregister" workflow
    Then validate against CA for "Approve" "deregister" workflow for "Accounts"
    Then BankUser logs out
    Examples:

      | HostSystem | BSB    | AccountNumber      | Country           |
      | CAP        | 012787 | 954100484          | Australia         |
      # | CAP        | 013148 | 9780219            | Australia         |
      | OBK        | 033112 | 000111249          | Australia         |
      | GL         | 014306 | 009695888          | Australia         |
      | NZM        |        | 000001AUD00002     | New Zealand       |
      | SYS        |        | 01-0071-0108653-52 | New Zealand       |
      | INT        |        | 2387732423         | Cook Islands, The |
      | V2P        |        | 963623             | Australia         |
    @e2e @chrome @COBRA
    Examples:
      | HostSystem | BSB    | AccountNumber      | Country     |
      | CAP        | 012204 | 009797271          | Australia   |
      # | CAP        | 012201 | 955648176          | Australia   |
      | OBK        | 084571 | 199918344          | Australia   |
      | NZM        |        | 148593USD00001     | New Zealand |
      | SYS        |        | 11-8995-0998907-96 | New Zealand |
      | V2P        | 012141 | 199999826          | Australia   |

    @qa2 @chrome @COBRA
    Examples:
      | HostSystem | BSB    | AccountNumber      | Country     | zypherTag     |
      | CAP        | 012204 | 009797271          | Australia   | @TC-ONAR-2550 |
      | OBK        | 084571 | 199918344          | Australia   | @TC-ONAR-2730 |
      | NZM        |        | 148593USD00001     | New Zealand | @TC-ONAR-2581 |
      | SYS        |        | 11-8995-0998907-96 | New Zealand | @TC-ONAR-2579 |
      | V2P        | 012141 | 199999826          | Australia   | @TC-ONAR-2662 |


  @chrome @COBRA @dev @qa2   @ONAR-3404 @ONAR-3768
  Scenario Outline: 02. As a Bank Administrator, I want to Modify Account(remove product) and approve/reject <zypherTag>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
    Then Validate the "register" message for "accounts"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then executing additional CA validations for "Accounts"
      | productsDB                                                                                                                      |
      | p_rep-account, p_bpay-au, p_dompay-au-dc, p_dompay-au-npp, p_dompay-au-rtgs, p_intpay, p_transfer, p_domrecv-au-dd, p_payidmgmt |
    Then BankUser edits the resource and remove "AU BPAY" product
    Then Validate the "modify" message for "accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Accounts"
    Then executing additional CA validations for "Accounts"
      | productsDB |
      | p_bpay-au  |
    Then BankUser logs out
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   | zypherTag     |
      | CAP        | 013148 | 9780218       | Australia | @TC-ONAR-3768 |
  # | CAP        | 012787 | 954100484          | Australia    |@TC-ONAR-3404|
  # | CAP        | 015627 | 689011104          | Australia    |@TC-ONAR-3404|
  # | CAP        | 013148 | 9780218            | Australia    |@TC-ONAR-2550|
  # | OBK        | 033112 | 000111259          | Australia    |@TC-ONAR-2550|
  #    |GL        |014306|009699888    |Australia|General Ledger|@TC-ONAR-2550|
  # | NZM        |        | 000001AUD00001     | New Zealand  |@TC-ONAR-2550|
  # | SYS        |        | 01-0071-0108553-52 | New Zealand  |@TC-ONAR-2550|
  # | INT        |        | 2387732123         | Cook Islands |@TC-ONAR-2550|
  # |V2P         |        | 963423             | Australia    |@TC-ONAR-2550|
  # |V2P         |        | 668912             | Australia    |@TC-ONAR-2550|


  @dev @chrome @COBRA   @ONAR-6033
  Scenario Outline: 03. Create/Modify/Register/Reject Resource for accounts for <HostSystem> hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
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
    Then Reject the changes and validate the "modified" notification messages for the Resource
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then validate against CA for "Verify" "deregister" workflow for "Accounts"
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Reject the changes and validate the "deregister" notification messages for the Resource
    Then BankUser logs out
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   |
      | CAP        | 012787 | 954100484     | Australia |
    @chrome @COBRA  @e2e
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   |
      | CAP        | 012204 | 009797271     | Australia |
    @chrome @COBRA  @qa2
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   |
      | CAP        | 013745 | 199988799     | Australia |


  @dev  @chrome @COBRA @ONAR-6034
  Scenario Outline: 04. Create/Modify/Validate the Accounts resource for <HostSystem> hostSystem <zypherTag>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
    # Then Validate the "register" message for "accounts"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser validates the Audit Scenarios for Accounts
      | Description                                    | Action   |
      | Record was created and submitted for approval. | Created  |
      | Record was approved and created.               | Approved |
    Then BankUser edits the Account resource
    Then Validate the "modify" message for "accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Accounts"
    Then BankUser validates the Audit Scenarios for Accounts
      | Description                                     | Action   |
      | Changes to Record were approved.                | Approved |
      | Record was modified and submitted for approval. | Modified |
    Then BankUser logs out
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   |
       | CAP        | 015627 | 689011104          | Australia  |

 @dev  @chrome @COBRA @ONAR-6575
  Scenario Outline: 05. Create/deregister the Accounts resource for <HostSystem> hostSystem and re-register same account <zypherTag>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Verify" "deregister" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "deregister" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser logs out
   
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   |
       | CAP       | 015627 | 689011104     | Australia  |


  @chrome @ie @COBRA @dev @e2e @ONAR-6035 @qa2
  Scenario: To verify the Manage Summary grid of Resource entity
    Given "Default approvers" logins in to COBRA using a valid password
    Then validate the elements present in the Resource screen
    And BankUser logs out


@chrome @ie @COBRA @ONAR-6301  @dev
  Scenario Outline: 05. Create/Search/View an Account with HostSystem <hostSystem> and Verify using the Bankuser with restricted country <country>
    Given create a Account "<hostSystem>" "<BSB>"-"<AccountNumber>" and country "<country>" using api and "do not approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction          | jurisdriction         | productFamily | restrictedCountries                         |
      | Registration Officer   | Australia,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Registration Team Lead | Australia,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then View the account in Customer, Division ResourceTab and pending approval screen ""
    And BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then View the account in Customer, Division ResourceTab and pending approval screen "checkForMasking"
    Then View the Resource to validate Restricted Country
    Then Verify "Resource" if "Singapore" "Country" is displayed
    And BankUser logs out
    Examples:
      | hostSystem |country  |BSB   | AccountNumber|
      | VAM        |SG       |013350|  12362572    |

 @chrome @COBRA @dev @ONAR-6303
  Scenario Outline: 06. As a Bank Administrator, I want to Modify Account(Update legal entity name and remove product) and approve/reject <zypherTag>
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
    Then Validate the "register" message for "accounts"
    Then Search the Resource in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Then validate against CA for "Approve" "new" workflow for "Accounts"
    Then BankUser edits the Account resource and remove "Reporting - Accounts" product
    Then Validate the "modify" message for "accounts"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Approve" "modify" workflow for "Accounts"
    Then BankUser logs out
    Examples:
      | HostSystem | BSB    | AccountNumber | Country   | zypherTag     |
      | VAM        | 013350 | 12362572      | Singapore | @TC-ONAR-6303 |