Feature: To test as a bankuser we are able Publish results to Pacrdm
  As a Bank User
  I want to be able to Publish PACRDM via rabbitMQ

  Background: Create CAAS user
    Given create a customer using api
    Given create a "1" Division using api

  @chrome @ie @COBRA @ONAR-6201 @dev2 
  Scenario: 01. Publish Pacrdm Account name, address, acctStatus and BIC code changes and Verify on Accounts View page
    Given create a Account "CAP" "013380"-"009783523" and country "AU" using api and "approve"
    Given Connect to rabbitmq with Username and password
    Then publish to "Pacrdm2Account" with
      | acctNumber | acctName         | AccountAddress             | acctStatus | bicCode     | subProductCode |
      | 009783523  | TODOROVA TRADING | 24 Lonsdale MARYS NSW 2760 | C          | ANZAUB7MXXX | 01             |
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then Verify the Accounts Screen with
      | acctNumber | acctName         | AccountAddress             | acctStatus |
      | 009783523  | TODOROVA TRADING | 24 Lonsdale MARYS NSW 2760 | CLOSED     |
    Then BankUser logs out
    Then Validate the changes in CA
      | acctNumber | acctName         | AccountAddress             | acctStatus | bicCode     | subProductCode |
      | 009783523  | TODOROVA TRADING | 24 Lonsdale MARYS NSW 2760 | C          | ANZAUB7MXXX | 01             |



  @chrome @ie @COBRA @ONAR-6201 @dev2 
  Scenario: 02. Publish Pacrdm Host System changes and validate Cascade
    Given create a Account "CAP" "013148"-"009783520" and country "AU" using api and "approve"
    Given create a legal entity using api and "approve"
    Given create a resource group using api
    Given create AuthPanel using api
    Given create "1" CAASUSER using CAAS api
    Then Register CAAS User using api
    Given Connect to rabbitmq with Username and password
    Then publish to "Pacrdm2Account" with
      | acctSysCode | bsbCode | acctNumber |subProductCode|cbsCode|
      | CMM         | 013148  | 009783520  |01            |CMMAU|
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer

    Then Verify the Accounts Screen with
      | acctNumber |hostSystem|
      | 009783520  |CMM|

    Then Validate the changes in CA
      | acctNumber | bsbCode | acctSysCode | cbsCode |subProductCode|
      | 009783520  | 013148  | CMM         | CMMAU   |01|

 Then Verify the Legal Entity Screen with
      | acctNumber | acctSysCode |
      | 009783520  | CMM         |

    Then Verify the Resource Group Screen with
      | acctNumber | acctSysCode |
      | 009783520  | CMM         |

    Then Verify the Customer Users Screen with
      | acctNumber | acctSysCode |
      | 009783520  | CMM         |

    Then Verify the Auth Panel Screen with
      | acctNumber | acctSysCode |
      | 009783520  | CMM         |

    Then BankUser logs out



@chrome @ie @COBRA @ONAR-6205 @dev2 
  Scenario: 03. Publish Pacrdm BSB code changes and validate Cascade
    Given create a Account "CAP" "013380"-"009783521" and country "AU" using api and "approve"
    Given create a legal entity using api and "approve"
    Given create a resource group using api
    Given create AuthPanel using api
    Given create "1" CAASUSER using CAAS api
    Then Register CAAS User using api
  Given Connect to rabbitmq with Username and password
    Then publish to "Pacrdm2Account" with
      | bsbCode | acctNumber |subProductCode|acctSysCode|cbsCode|
      | 013381  | 009783521  |01            |CAP        |CAPAU  |
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then Verify the Accounts Screen with
      | acctNumber | bsbCode |
      | 009783521  | 013381  |

    Then Validate the changes in CA
      | acctNumber | bsbCode |subProductCode|
      | 009783521  | 013381  | 01|

    Then Verify the Legal Entity Screen with
      | acctNumber | bsbCode |
      | 009783521  | 013381  |

    Then Verify the Resource Group Screen with
      | acctNumber | bsbCode |
      | 009783521  | 013148  |

    Then Verify the Customer Users Screen with
      | acctNumber | bsbCode |
      | 009783521  | 013148  |

    Then Verify the Auth Panel Screen with
      | acctNumber | bsbCode |
      | 009783521  | 013148  |

    Then BankUser logs out




#    @chrome @ie @COBRA @ONAR-6201 @dev2 @e2e
#  Scenario: 04. Publish Pacrdm BSB code, BIC code, Account name and address For "MDZ" Accounts changes and Validate cascade for same
#    Given Connect to rabbitmq with Username and password
#    Then publish to "Pacrdm2Account" with
#      |acctName          |AccountType|bsbCode|AccountAddress            |bicCode    |acctNumber    |
#      |TODOROVA TRADING  |MDZ        |013381 |24 Lonsdale MARYS NSW 2760|ANZAUB3MXXX|197921USD00001|
#    Given "Default users" logins in to COBRA using a valid password
#    When bankUser verifies the created customer
#    Then BankUser logs out
#    Given "Default users" logins in to COBRA using a valid password
#    Then Verify the Accounts Screen with
#      |acctName        |acctNumber     |bsbCode   |AccountAddress            |
#      |TODOROVA TRADING|197921USD00001 |013381    |24 Lonsdale MARYS NSW 2760|
#    Then BankUser logs out
#    Then Validate the changes in CA
#      |acctName        |acctNumber     |bsbCode|AccountAddress             |bicCode    |
#      |TODOROVA TRADING|197921USD00001 |013381 |24 Lonsdale MARYS NSW 2760 |ANZAUB3MXXX|




#  @dev2  @chrome @COBRA
#  Scenario Outline: 05. Create/Modify/Register/Validate Cascading of Resource for accounts for <HostSystem> hostSystem
#    Given "Default users" logins in to COBRA using a valid password
#    When bankUser verifies the created customer
#    Then BankUser logs out
#    Given "Default users" logins in to COBRA using a valid password
#    Then Click on regsiter resources
#    And Register an Resource for account for "<HostSystem>" Host system with "<BSB>" BSB and "<AccountNumber>" accountNumber for "<Country>" country
#    Then Validate the "register" message for "accounts"
#    Then BankUser logs out
#    When "Default approvers" logins in to COBRA using a valid password
#    Then Search the Resource in searchscreen and "Approve" "new" workflow
#    Then BankUser logs out
#    Examples:
#
#      | HostSystem | BSB    | AccountNumber      | Country           |
#      | GL         | 014306 | 009695888          | Australia         |
