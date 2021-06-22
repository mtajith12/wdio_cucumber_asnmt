@chrome @ie @COBRA @OIM @OIMcore @BankuserEntilements.feature
Feature: To test bankuser entitlements to CAAS Orgs and Users based on roles
    As a Bank User
    BankUser is able to create/search/view entities per his assigned roles, based on "Product Classification v2.58 (20.5 Release)"
    # https://confluence.service.anz/display/WDCDT/Product+Classification
    # Note that a change in the testing of Registration Officer (Pilot) has been introduced in 20.4 per suggestion from BAs, that test bankusers of role "Registration Officer (Pilot)"
    # is always assigned together with "Registration Officer" role, so that the "Registration Officer (Pilot)" can have access to Customer/Customer Users.

  @AAMS-1405 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Helpdesk Officer (Pilot) searches/views Orgs and Users
  	Given "Default users" creates "1" organisations with all applications
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    #AAMS-321#01
    Then check Onboarding page is NOT displayed
    #AAMS-323#01
    Then check "CAAS Orgs" menu item does exist in the Navigation menu
    #AAMS-327#01
    Then check "Users" menu item does exist in the Navigation menu
    #AAMS-1317
    Then check "Security Device Issuance" menu item does NOT exist in the Navigation menu
    Then BankUser navigates to search CAAS Orgs page
    Then BankUser search orgID of org created by API at no. 1 and verify results
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Org results
    Then check the details of the Org displayed correctly in view Org details page
    Then BankUser navigates to search User page
    Then BankUser enters search User criteria and clicks on search button:
      | Status        | New                                                            |
      | Workflow      | Approved,Pending Approval - Create,Pending Approval - Modified |
      | Source System | COBRA                                                          |
    Then Bankuser dismisses pagination message if it pops up
    #AAMS-393#05
    Then check the returned Users meet the "Contains", "Or" and "And" logic
    Then BankUser opens the "1st" entry from search User results
    Then check the details of the User displayed correctly in view User page
    #AAMS-10#02
    Then check DoB of the User is NOT masked in view User page
    Then BankUser logs out

  @AAMS-1810 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Helpdesk Officer (Pilot) NOT entitled to Register/Create/Approve users
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "2" users with the "1st" created Org
    Given "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    #AAMS-295#01
    Then check Pending Approvals page is NOT displayed
    Then BankUser navigates to search User page
    #AAMS-1371#01, AAMS-1372#01
    Then check "Register User, New User" options are "Disabled" in Actions Menu
    Then check "Register User, New User" options are "Disabled" in Actions Menu
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-17#02, #AAMS-495#02
    Then BankUser selects the "1st" entry
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    #AAMS-630#02, #AAMS-631#02
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser opens the "1st" entry from search User results by double clicking
    #AAMS-354#02, #AAMS-496#02
    Then check the "Approve" option is NOT displayed on the view User page
    Then check the "Reject" option is NOT displayed on the view User page
    Then BankUser closes User details page
    Then BankUser reset search
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser logs out

  @AAMS-1416 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Registration Officer (Pilot) is entitled to create/search/view Orgs and Users
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    #AAMS-321#01, AAMS-323#01, AAMS-327#01, AAMS-1317
    Then check "New CAAS Org" tile does exist in the onboarding page
    Then check "New User" tile does exist in the onboarding page
    Then check "CAAS Orgs" menu item does exist in the Navigation menu
    Then check "Users" menu item does exist in the Navigation menu
    Then check "Security Device Issuance" menu item does NOT exist in the Navigation menu
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with all applications
    Then check CAAS Org has been created successfully
    Then BankUser navigates to search CAAS Orgs page
    #AAMS-387#06
    Then BankUser search CAAS Org by ID
    Then BankUser open the Org details page from search result
    Then BankUser view the Org details with applications
    When BankUser navigates to Onboarding page
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, without a Customer, and with:
      |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade                                  |
      |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu | 
    Then check User has been created successfully
    Then BankUser navigates to search User page
    #AAMS-1371#01, AAMS-1372#01,02
    Then check "Register User, New User" options are "Enabled" in Actions Menu
    Then BankUser clicks on "New User" option in Actions Menu and checks the "New User" screen is opened
    #AAMS-393#05
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser opens the "1st" entry from search User results
    # AAMS-10#01
    Then check DoB of the User is NOT masked in view User page
    Then check the details of the User displayed correctly in view User page
    Then BankUser logs out

  @AAMS-1811 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Disable Approve option for Users - when bankuser is maker of the latest changes
    Given "Registration Officer (Pilot)" creates "1" organisations with a unique random string in orgData
    Given "Registration Officer (Pilot)" creates "2" users with the "1st" created Org
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-17#04, #AAMS-495#04
    Then BankUser selects the "1st" entry
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    #AAMS-630#04, #AAMS-631#04
    Then BankUser reset search
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    #AAMS-647#03, #AAMS-656#03
    Then BankUser selects the "1st" entry 
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    #AAMS-657#02, #AAMS-658#02
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser reset search
    Then "Default OIM Bankuser" approves the "1st" created user
    Then "Registration Officer (Pilot)" modifies user details of "1st" API created user
    Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser logs out

  @AAMS-1824 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Disable Approve option for multiple selections - when bankuser is entitled to one User entry but not the other
    Given "Registration Officer (Pilot)" creates "1" organisations with a unique random string in orgData
    Given "Registration Officer (Pilot)" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    # AAMS-630#04, #AAMS-658#02
    Then BankUser selects the "1st" entry
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then BankUser reset search
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    #AAMS-657#02, #AAMS-658#02
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser logs out
  @AAMS-1772 @AAMS-1775
  Scenario: COBRA UI: Entitlements - Registration Officer views DoB as masked
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Registration Officer" logins in to COBRA using a valid password
    #AAMS-321#01, AAMS-323#01, AAMS-327#01
    Then check "New CAAS Org" tile does NOT exist in the onboarding page
    Then check "New User" tile does NOT exist in the onboarding page
    Then check "CAAS Orgs" menu item does NOT exist in the Navigation menu
    Then check "Users" menu item does exist in the Navigation menu
    Then BankUser navigates to search User page
    #AAMS-1371#01,02
    Then check "Register User" options are "Enabled" in Actions Menu
    Then BankUser clicks on "Register User" option in Actions Menu and checks the "Register User" screen is opened
    Then BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from search User results
    #AAMS-10#02
    Then check DoB of the User is masked in view User page
    Then BankUser logs out

  # Todo: below test are currently ignored due to bug AAMS-1771
  @AAMS-1773 @AAMS-1775 @ignore
  #BR-UM-016#2: Where a User is not registered under a Customer, the User record will only be returned if the user has no Restricted Countries selected as part of their Bank User Role(s). 
  Scenario Outline: COBRA UI: Entitlements - User not registered under a Customer, the User record will NOT be returned when Bankuser has Restricted Countries. 
    Given the "<role>" is set up with Jurisdictions "<jurisdictions>" and Restricted Countries "<restrictedCountries>"
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "<role>" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    #AAMS-393#05
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then check "No Record Found" message returned in search results grid
    Then BankUser logs out
    Then make sure the "<role>" is reset to have All Jurisdictions and No Restricted Countries
    Examples:
      | role                         | jurisdictions                                   | restrictedCountries |
      | Registration Officer (Pilot) | Australia,China,New Zealand,Singapore,Hong Kong | Japan,Cambodia      |
      | Helpdesk Officer (Pilot)     | Australia,China,Hong Kong,New Zealand,Singapore | Taiwan              |
      | Helpdesk Officer (Pilot)     | Australia,New Zealand,Singapore,Hong Kong       | China               |
      
  # Todo: below test are currently ignored due to bug AAMS-1771
  @AAMS-1774 @AAMS-1775 @ignore
  #BR-UM-016#1: Where a User is registered under a Customer, the User record will only be returned in the search results if the associated Customer has been assigned at least one Jurisdiction to which the user is entitled as part of their Bank User Role(s).
  Scenario Outline: COBRA UI: Entitlements - User registered under a Customer, the User record will be returned when the Customer is in the Jurisdictions of the Bankuser. 
    Given the "<role>" is set up with Jurisdictions "<bankuserJurisdictions>" and Restricted Countries ""
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then Register the user
    When BankUser navigates to "New CAAS Org" page
    Then BankUser onboards new CAAS Org with all applications
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade                                  |
      |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu | 
    Then BankUser logs out
    Given "<role>" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    #AAMS-393#05
    Then BankUser searches the UI created User by "User ID"
    Then check the search User results is "<searchUserResults>"
    Then BankUser logs out
    Examples:
      | role                         | customerJurisdictions | bankuserJurisdictions                           | searchUserResults |
      | Registration Officer (Pilot) | China,New Zealand     | Australia,China,Hong Kong,Singapore,New Zealand | Found             |
      | Helpdesk Officer (Pilot)     | Hong Kong,New Zealand | Australia,Singapore,New Zealand                 | Not Found         |
