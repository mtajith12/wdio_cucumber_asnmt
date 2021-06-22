@chrome @ie @COBRA @OIM @SearchUser.feature
Feature: As a bankuser we are able to search for a User with various search criterias
  As a Bank User
  BankUser want to be able to search for Users with various search criterias

  @AAMS-1664 @AAMS-1674
  Scenario: COBRA UI: Search User - display Search User screen, collapse/expand search panel
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    # AAMS-327#01
    And BankUser navigates to search User page
    # AAMS-6#01
    Then check the default display on search User page
    # AAMS-6#02,03
    Then BankUser enters search User criteria:
      | User ID       | testUser#123              |
      | CAAS User ID  | testUser                  |
      | Last Name     | Smith                     |
      | First Name    | Daniel                    |
      | Status        | New                       |
      | Workflow      | Pending Approval - Create |
      | CAAS Org ID   | testOrg123                |
      | CAAS Org Name | ABCD Bank Group           |
      | Source System | COBRA                     |
    Then BankUser collapse the search panel
    Then BankUser expand the search panel
    Then check entered search User criterias have been retained and trimmed of leading / trailing spaces

  @AAMS-1665 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - blank/wildcard search, search result pagination
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#02,06
    Then BankUser searches for Users with "<searchBy>" criteria
    # AAMS-394#01
    Then check the search results are paginated
    # AAMS-393#07
    Then check the display of search Users results summary grid
    Then check the search results are sorted by User ID in alphabetical order
    # AAMS-394#02
    Then BankUser goes to the "Next" page of search results
    # AAMS-394#03
    Then BankUser goes to the "Previous" page of search results
     Examples:
      | searchBy |
      | Blank    |
      | *        |

  @AAMS-1666 @AAMS-1674
  # Single criteria search by "User ID", "CAAS User ID", "First Name", "Last Name", "CAAS Org ID", and "CAAS Org Name" are covered in the E2E scenarios in NewUser.feature
  Scenario Outline: COBRA UI: Search User - single search criteria multiple results
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches Users by "<searchBy>" with value "<value>"
    Then Bankuser dismisses pagination message if it pops up
    Then check the User entries are returned and displayed match the search criteria value
    Examples:
      | searchBy      | value                     |
      | Status        | New                       |
      | Status        | Enabled                   |
      | Workflow      | Approved                  |
      | Workflow      | Pending Approval - Create |
      | Source System | COBRA                     |
      | Source System | CAAS                      |

  @AAMS-1667 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - multiple criterias, 'AND' logic by seach Criteria <searchBy>
    Given "Default users" creates "2" organisations with a unique random string in orgData
    Given "Default users" creates "2" users with the "1st" created Org
    Given "Default users" creates "2" users with the "2nd" created Org
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#03,05,07
    Then BankUser searches Users by "<searchBy>" with values from the "1st" API created user
    Then check the "<n>" User entries are returned and displayed correctly in the search result grid
    Examples:
      | searchBy                     | n |
      | CAAS Org ID,First Name       | 1 |
      | CAAS Org Name,Last Name      | 1 |
      | User ID,Status               | 1 |
      | CAAS Org Name, Workflow      | 2 |
      | CAAS Org Name, Source System | 2 |

  @AAMS-1668 @AAMS-1674 @OIMcore
  Scenario Outline: COBRA UI: Search User - by comma separated partial text, 'Contains' and 'Or' logic <searchBy>
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#02,04,05
    Then BankUser searches Users by "<searchBy>" with value "<value>"
    Then Bankuser dismisses pagination message if it pops up
    Then check the returned Users meet the "Contains", "Or" and "And" logic
    Examples:
      | searchBy      | value                              |
      | User ID       | testUser,001                       |
      | CAAS User ID  | test,ab,ne                         |
      | Last Name     | Heath,Thom                         |
      | First Name    | Amy,Be                             |
      | Status        | New,Enabled,Disabled               |
      | Workflow      | Approved,Pending Approval - Create |
      | CAAS Org ID   | Org,001A                           |
      | CAAS Org Name | org,1b                             |

  @AAMS-1669 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - multiple criterias, comma separated partial texts, 'And', 'Contains' and 'Or' logic
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#03,04,05
    Then BankUser enters search User criteria and clicks on search button:
      | User ID       | <userId>       |
      | CAAS User ID  | <caasUserId>   |
      | Last Name     | <lastName>     |
      | First Name    | <firstName>    |
      | Status        | <status>       |
      | Workflow      | <workflow>     |
      | CAAS Org ID   | <caasOrgId>    |
      | CAAS Org Name | <caasOrgName>  |
      | Source System | <sourceSystem> |
    Then Bankuser dismisses pagination message if it pops up
    Then check the returned Users meet the "Contains", "Or" and "And" logic
    Examples:
      | userId   | caasUserId | lastName | firstName | status      | workflow                           | caasOrgId | caasOrgName | sourceSystem |
      | test,1a  | user,1M    | Wa,Sm    | A,Te      | New         | Pending Approval - Create          | org,ab    | search      | COBRA        |
      | 01,admin |            |          | test      | New,Enabled | Approved,Pending Approval - Create | 001,org   |             | CAAS,COBRA   |
      |          | user,admin | R,B      |           | New,Enabled |                                    |           | 01,A        | CAAS,COBRA   |

  @AAMS-1670 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - no matching record
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#08
    Then BankUser enters search User criteria and clicks on search button:
      | User ID       | <userId>       |
      | CAAS User ID  | <caasUserId>   |
      | Last Name     | <lastName>     |
      | First Name    | <firstName>    |
      | Status        | <status>       |
      | Workflow      | <workflow>     |
      | CAAS Org ID   | <caasOrgId>    |
      | CAAS Org Name | <caasOrgName>  |
      | Source System | <sourceSystem> |
    Then check "No Record Found" message returned in search results grid
    Examples:
      | userId                | caasUserId | lastName | firstName | status      | workflow | caasOrgId | caasOrgName     | sourceSystem |
      | abcdefghijk1234567890 |            |          |           |             |          |           |                 | COBRA        |
      |                       | 陳，李     |          |           |             |          |           |                 |              |
      | abcd*jioeuoijt        |            |          |           | New,Enabled |          |           |                 |              |
      | *                     |            | ABCD     | 1234      |             | Aprpoved |           | eijei/**/eurqbi | CAAS         |
      |                       | 000000000  |          |           |             |          | abdi&3976 |                 |              |

  @AAMS-1671 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - in other languages
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "2" users with the "1st" created Org in language "<locale>"
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#05
    Then BankUser searches Users by "<searchBy>" with values from the "1st" API created user
    Then check the returned Users meet the "Contains", "Or" and "And" logic
    Examples:
      | language            | locale | searchBy             |
      | Simplified Chinese  | zh_CN  | First Name           |
      | Traditional Chinese | zh_TW  | Last Name            |
      | Vietnamese          | vi     | First Name,Last Name |

  @AAMS-1672 @AAMS-1674
  Scenario Outline: COBRA UI: Search User - trim leading/trailing spaces in search criteria
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-393#01
    Then BankUser enters search User criteria with leading / trailing spaces and clicks on search button:
      | User ID       | <userId>       |
      | CAAS User ID  | <caasUserId>   |
      | Last Name     | <lastName>     |
      | First Name    | <firstName>    |
      | Status        | <status>       |
      | Workflow      | <workflow>     |
      | CAAS Org ID   | <caasOrgId>    |
      | CAAS Org Name | <caasOrgName>  |
      | Source System | <sourceSystem> |
    Then Bankuser dismisses pagination message if it pops up
    Then check entered search User criterias have been retained and trimmed of leading / trailing spaces
    Then check the search User results do not contain leading / trailing spaces
      Examples:
      | userId  | caasUserId | lastName | firstName | status      | workflow                           | caasOrgId | caasOrgName | sourceSystem |
      | test,1a | user       | S        |           | New         | Pending Approval - Create          | org,ab    | search      | COBRA        |
      |         | user,a     |          | a,b       | New,Enabled | Approved,Pending Approval - Create |           | 01,A        | CAAS,COBRA   |

  @AAMS-1673 @AAMS-1674
  Scenario: COBRA UI: Search User - search and view "CAAS" user
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    # AAMS-395#02
    Then BankUser searches Users by "Source System" with value "CAAS"
    Then Bankuser dismisses pagination message if it pops up
    Then check "Source System" set to "CAAS" in the "1st" entry in search results
    Then BankUser opens the "1st" entry from search User results from Context Menu
    Then check "View Customer User" page is opened to view user details

  @AAMS-2979 @AAMS-1674
  Scenario: COBRA UI: View User - Link to View Customer
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser enters search User criteria and clicks on search button:
      | Customer ID   | *     |
      | Source System | COBRA |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search User results
    Then check the details of the User displayed correctly in view User page
    #AAMS-2853
    Then BankUser clicks Customer Name link to view Customer page

  @AAMS-2980 @AAMS-1674
  Scenario: COBRA UI: View User - Link to View CAAS Org
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser enters search User criteria and clicks on search button:
      | Workflow      | Approved |
      | Source System | COBRA    |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search User results
    Then check the details of the User displayed correctly in view User page
    #AAMS-2854
    Then BankUser clicks CAAS Org Name link to view CAAS Org page

  @AAMS-3587
  Scenario: COBRA UI: Search User - Hide 'Deregistered' CAAS Users
    Given create a CAASUSER using CAAS api
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches the UI created User by "User ID"
    Then check "No Record Found" message returned in search results grid
    Then BankUser reset search
    Then create a customer using api
		Then register a CAAS User using api
    And BankUser navigates to search User page
		And BankUser searches the UI created User by "User ID"
    Then check the User entries are returned and displayed match the search criteria value
    