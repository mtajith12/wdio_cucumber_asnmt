@chrome @ie @COBRA @OIM @SecurityDeviceIssuanceSearch.feature
Feature: Security Device Issuance Search functions
	As a Security Device Officer 
	BankUser can search Security Device Issuance

  @AAMS-3189 @AAMS-3194
  Scenario Outline: COBRA UI: Security Device Issuance Search - <searchBy> search, search result pagination
    When "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1323, AAMS-1319#05, AAMS-1320-01
    Then BankUser searches for Security Devices with "<searchBy>" criteria
    Then check the search results are paginated
    Then BankUser goes to the "Next" page of search results
    Then BankUser goes to the "Previous" page of search results
    Then BankUser logs out
    Examples:
      | searchBy |
      | Blank    |
      | *        |

  @AAMS-3190 @AAMS-3194
	Scenario: COBRA UI: Security Device Issuance - search by IDs or names
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS                                                                                     |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | Transactive Global                      |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Given "Default users" approves the "2nd" created user
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1319, AAMS-1320#01
    Then BankUser searches Security Device by "User ID" with values from the "1st" API created user
    Then check the "2" Security Device entries are returned
    Then check tokens are displayed correctly in search results for the "1st" API created User
    Then BankUser reset search
    Then BankUser searches Security Device by "CAAS Org ID" with values from the "1st" API created user
    Then check the "3" Security Device entries are returned
    Then check tokens are displayed correctly in search results for the "1st" API created User
    Then check tokens are displayed correctly in search results for the "2nd" API created User
    Then BankUser reset search
    Then BankUser searches Security Device by "CAAS Org Full Name,First Name,Last Name" with values from the "2nd" API created user
    Then check the "1" Security Device entries are returned
    Then check tokens are displayed correctly in search results for the "2nd" API created User
    Then BankUser logs out

  @AAMS-3191 @AAMS-3194
  Scenario: COBRA UI: Search User - search by comma separated multiple criterias
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1319, AAMS-1320#01
    Then BankUser enters search Security Device criteria and click on search button:
      | User ID           | ab,12               |
      | Device Type       | Token Digipass 270  |
    Then Bankuser dismisses pagination message if it pops up
    Then check the returned Security Device entries meet the search criteria and "Contains/Or/And" logic
    Then BankUser reset search
    Then BankUser enters search Security Device criteria and click on search button:
      | CAAS Org ID       | 2,1,y,w,a                     |
      | Issuance Location | CHINA, Chengdu;TAIWAN, Taipei |
    Then Bankuser dismisses pagination message if it pops up
    Then check the returned Security Device entries meet the search criteria and "Contains/Or/And" logic
    Then BankUser logs out

  @AAMS-3233 @AAMS-3194
  Scenario: COBRA UI: Search User - trim leading/trailing spaces in search criteria
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1319#01, AAMS-1320#01
    Then BankUser enters search Security Device criteria with leading/trailing spaces and click on search button:
      | User ID            | user    |
      | CAAS User ID       | user    |
      | First Name         | a       |
      | Last Name          | th      |
      | CAAS Org ID        | testOrg |
      | CAAS Org Full Name | Test    |
    Then Bankuser dismisses pagination message if it pops up
    Then check entered search Security Device criterias have been retained and trimmed of leading / trailing spaces
    Then check the search Security Device results do not contain leading / trailing spaces
    Then BankUser logs out

  @AAMS-3234 @AAMS-3194
  Scenario: COBRA UI: Search User - no matching record found
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    # AAMS-1320#02
    Then BankUser enters search Security Device criteria with leading/trailing spaces and click on search button:
      | User ID     | 948584975nkejr8o3irjugr4ip3484549o5409u5jflpork3o |
      | CAAS Org ID | 93843874jleiroeirljfur93poi4jkgjo34i34jiur        |
    Then check "No Record Found" message returned in search results grid
    Then BankUser logs out
