@chrome @ie @COBRA @OIM @CreateAndApproveUsers.feature
Feature: End to end tests for creating CAAS New User 
  As a Bank User
  BankUser want to be able to create new users

  @AAMS-1415 @AAMS-1468 @OIMcore @AAMS-1769
  Scenario: COBRA UI: Create User without customer, search/view user, single approval from User details page
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#07, AAMS-435#06, AAMS-437#01, AAMS-305, AAMS-1410, AAMS-1704 , AAMS-809, AAMS-810, AAMS-811
    Then BankUser creates User with the created Org, without a Customer, and with:
      |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;eMatching;GCP;LM         |
      |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu | 
    Then check User has been created successfully
    # AAMS-327#01
    Then BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches the UI created User by "CAAS User ID"
    # AAMS-395#01,05, BR-UM-016#2
    Then check "Source System" set to "COBRA" in the "1st" entry in search results
    Then BankUser opens the "1st" entry from search User results
    # AAMS-10#01,03, AAMS-919, AAMS-4229
    Then check the details of the User displayed correctly in view User page
    # AAMS-312#01,02
    Then check the View User Applications screen elements for New User
    # AAMS-1401#01,02
    Then check the Security Devices tab default display in View User page
    Then check the devices in the Selected Security Devices grid in View User page
    # AAMS-354#04, AAMS-496#04
    Then check the "Approve" option is NOT displayed on the view User page
    Then check the "Reject" option is NOT displayed on the view User page
    # AAMS-3646
    Then check User.DA Modifiable has been set to FALSE
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser selects the "1st" entry
    # AAMS-17#01, AAMS-495#01
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then BankUser reset search
    Then BankUser searches the UI created User by "User ID"
    Then BankUser opens the "1st" entry from search User results
    # AAMS-354#01, #AAMS-496#01
    Then check the "Approve" option is displayed on the view User page
    Then check the "Reject" option is displayed on the view User page
    Then BankUser clicks on "Approve" button on the User details page
    # AAMS-328#01,02,03,04
    Then check Approve Single User creation confirmation message, then click on "No" button
    Then check the system retain the user on the View User Details screen
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
    # AAMS-2725-01
    Then check User.DA Modifiable has been set to TRUE
    Then check User Status set to Enabled and Workflow to Approved on View User details page
    #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the View User Applications screen elements for Enabled User
    #AAMS-1515, AAMS-1529, AAMS-1530
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser logs out
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser opens the "1st" entry from search User results
    # AAMS-354#03, AAMS-496#03
    Then check the "Approve" option is NOT displayed on the view User page
    Then check the "Reject" option is NOT displayed on the view User page
    Then BankUser closes User details page
    # AAMS-17#03, AAMS-495#03
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser logs out
    Then check the UI created User exists in LDS under the "1st" API created Org
    # AAMS-329#01, #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the UI created User is linked under the assigned Applications with correct attribute values
    # AAMS-1530, AAMS-1529, AAMS-1515
    Then check the Security Devices of the UI created User are in "Provisioning/Pending" status from IDM Linked View
    # AAMS-1769
    Then check non-integrated application "GCIS" links for the UI created User
		Then check non-integrated application "Institutional Insights" links for the UI created User
		Then check non-integrated application "Internet Enquiry Access" links for the UI created User
    Then check non-integrated application "Online Trade" links for the UI created User
    Then check integrated application "GCP" links for the UI created User
    Then check integrated application "LM" links for the UI created User
		Then check integrated application "SDP CTS" links for the UI created User
    Then check integrated application "eMatching" links for the UI created User
    Then check non-integrated application "EsandaNet" links for the UI created User
    Then check the applications in CA for the UI created User

    

  @AAMS-1417 @AAMS-1468 @OIMcore
  Scenario: COBRA UI: Create User with customer associated, search/view user, and approve from Pending approvals page
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#07, AAMS-435#06, AAMS-437#01, AAMS-1410, AAMS-809, AAMS-810, AAMS-811
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | applications    | GCIS;Institutional Insights;Online Trade;SDP CTS;GCP;eMatching;LM                                  |
      | securityDevices | Token Digipass 270:NEW ZEALAND, Wellington;Token Digipass 276 (China Compliant):INDONESIA, Jakarta |
    # AAMS-296#03
    Then check User has been created successfully
    Then BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches the UI created User by "User ID"
    # AAMS-395#01
    Then check "Source System" set to "COBRA" in the "1st" entry in search results
    Then BankUser opens the "1st" entry from search User results
    # AAMS-10#01,03, AAMS-1401#02
    Then check the details of the User displayed correctly in view User page
    Then check the View User Applications screen elements for New User
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    Then BankUser selects the "1st" entry
    # AAMS-647#01, AAMS-656#01
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    # AAMS-660#01,03,04
    Then BankUser reset search
    Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    Then BankUser approves the "1st" entry from "Actions" menu
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
    Then BankUser logs out
    Then check the UI created User exists in LDS under the "1st" API created Org
    # AAMS-329#01, #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the UI created User is linked under the assigned Applications with correct attribute values
    # AAMS-1530, AAMS-1529, AAMS-1515
    Then check the Security Devices of the UI created User are in "Provisioning/Pending" status from IDM Linked View

  @AAMS-1418 @AAMS-1468
  Scenario: COBRA UI: Create User - allowed special characters, search/view user, and reject from Pending Approvals page
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page  
    # AAMS-357#01, AAMS-1410
    Then BankUser creates new User with allowed special characters in user data, and with:
      | applications    |                                   |
      | securityDevices | Token Digipass 270:TAIWAN, Taipei |
    # AAMS-296#03
    Then check User has been created successfully
    Then BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches the UI created User by "CAAS Org ID"
    # AAMS-395#01,05, BR-UM-016#2
    Then check "Source System" set to "COBRA" in the "1st" entry in search results
    Then BankUser opens the "1st" entry from search User results
    # AAMS-10#01,03
    Then check the details of the User displayed correctly in view User page
    # AAMS-1401#02
    Then check the devices in the Selected Security Devices grid in View User page
    # AAMS-312#03
    Then check View User applications screen when no applications have been assigned
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    # AAMS-660#01,03,04
    Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    Then BankUser rejects the "1st" entry from "Actions" menu
    # AAMS-665#01,02,03,04
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Cancel" button:
      | rejectReason | first time input reason for user rejection |
    Then check Reject Acknowledgement dialog closed
    Then BankUser rejects the "1st" entry from "Context" menu
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | User is rejected for testing purpose |
    Then check the Single User creation been rejected successfully
    Then BankUser logs out
    Then check the UI created User does NOT exist in LDS

  @AAMS-1470 @AAMS-1468
  Scenario: COBRA UI: Create User - trim leading/trailing spaces, search/view user, single reject from User Details page
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-296-01, AAMS-1410
    Then BankUser creates new User with leading/trailing spaces in user data, and with:
      | applications    | EsandaNet;Online Trade |
      | securityDevices |                        |
    # AAMS-296#03
    Then check User has been created successfully
    Then BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches the UI created User by "CAAS Org Name"
    # AAMS-395#01
    Then check "Source System" set to "COBRA" in the "1st" entry in search results
    Then BankUser opens the "1st" entry from search User results
    # AAMS-10#01,03, AAMS-312#02, AAMS-1401#03
    Then check the details of the User displayed correctly in view User page
    Then check the View User Applications screen elements for New User
    Then check the "No Record Found" message in Selected Security Devices grid
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser opens the "1st" entry from search User results
    # AAMS-497#01,02,03
    Then BankUser clicks on "Reject" button on the User details page
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Cancel" button:
      | rejectReason | first time reject from View User page |
    Then check Reject Acknowledgement dialog closed
    Then BankUser clicks on "Reject" button on the User details page
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | User is rejected on View User page |
    Then check the Single User creation been rejected successfully
    Then BankUser logs out
    Then check the UI created User does NOT exist in LDS

  @AAMS-1419 @AAMS-1468 @OIMcore @ignoreForDev2
  Scenario Outline: COBRA UI: Create User - user details in other languages, search/view user, single approve user from search user page
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#07, AAMS-435#06, AAMS-437#01, AAMS-1410
    Then BankUser creates User with the created Org and language locale "<locale>", and with:
      | applications    | <applications>    |
      | securityDevices | <securityDevices> |
    Then check User has been created successfully
    Then BankUser navigates to search User page
    # AAMS-393#05,07
    Then BankUser searches the UI created User by "<criteria>"
    Then BankUser finds the User in the search results and double clicks on it
    # AAMS-10#01,03
    Then check the details of the User displayed correctly in view User page
    # AAMS-1401#02
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser logs out
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    # AAMS-660#01,03,04
    Then BankUser approves the "1st" entry from "Context" menu
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
    Then BankUser logs out
    Then check the UI created User exists in LDS under the "1st" API created Org
    # AAMS-329#01, #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the UI created User is linked under the assigned Applications with correct attribute values
    Examples:
      | language            | locale | criteria             | applications                                                               | securityDevices                                     |
      | Simplified Chinese  | zh_CN  | First Name,Last Name | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS  | ANZ Digital Key                                     |
      | Traditional Chinese | zh_TW  | CAAS Org ID          | GCIS;Institutional Insights                                                | Token Digipass 270:AUSTRALIA, Melbourne             |
      | Vietnamese          | vi     | CAAS User ID         | Internet Enquiry Access                                                    | Token Digipass 276 (China Compliant):CHINA, Chengdu |

  @AAMS-1812 @AAMS-1468 @OIMcore
  Scenario: COBRA UI: Approve multiple users - User summary grid, Actions menu
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;Internet Enquiry Access;SDP CTS                                               |
      | securityDevices | ANZ Digital Key;Token Digipass 276 (China Compliant):VIETNAM, Ho Chi Minh City |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-630#01, AAMS-631#01
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    #AAMS-660#01,02,03,04
    Then BankUser reset search
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
    Then check Approve Multiple Users creation confirmation message, then click on "No" button
    Then check the system retain the users on the grid
    Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
    Then check Approve Multiple Users creation confirmation message, then click on "Yes" button
    Then check the Multiple Users creation been approved successfully
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-630#03, AAMS-631#03
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Disabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from search User results
    Then check the details of the API created User displayed correctly in view User page
    Then check the View User Applications screen elements for Enabled User
    #AAMS-1515, AAMS-1529, AAMS-1530
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser closes User details page
    Then BankUser opens the "2nd" entry from search User results
    Then check the details of the API created User displayed correctly in view User page
    Then check the View User Applications screen elements for Enabled User
    #AAMS-1515, AAMS-1529, AAMS-1530
    Then check the devices in the Selected Security Devices grid in View User page
    Then BankUser logs out
    #AAMS-660#03
    Then check the API created Users exist in LDS under the "1st" API created Org
    # AAMS-329#01, #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the API created Users are linked under the assigned Applications with correct attribute values
    # AAMS-1515, AAMS-1529, AAMS-1530
    Then check the Security Devices of the API created Users are in "Provisioning/Pending" status from IDM Linked View

  @AAMS-2273 @AAMS-1468
  Scenario: COBRA UI: Reject multiple users - User summary grid, Context menu
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade |
      | securityDevices | ANZ Digital Key;Token Digipass 270:VIETNAM, Ho Chi Minh City               |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" and "2nd" entries
    #AAMS-665#01,02,03
    Then BankUser rejects the "1st" and "2nd" entries from "Context" menu
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Cancel" button:
      | rejectReason | reject from search User grid |
    Then check the system retain the users on the grid
    Then BankUser rejects the "1st" and "2nd" entries from "Context" menu
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | testing |
    Then check the Multiple Users creation been rejected successfully
    Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then check "No Record Found" message returned in search results grid
    Then BankUser logs out
    #AAMS-665#03
    Then check the API created Users do NOT exist in LDS

  @AAMS-1814 @AAMS-1468 @OIMcore
  Scenario: COBRA UI: Approve multiple users - Pending approvals page, Context menu
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | GCIS;Institutional Insights;Internet Enquiry Access;SDP CTS                                                               |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):PHILIPPINES, Manila |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    #AAMS-295#01
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    #AAMS-657#01, AAMS-658#01
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    #AAMS-660#01,03,04
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser approves the "1st" and "2nd" entries from "Context" menu
    Then check Approve Multiple Users creation confirmation message, then click on "Yes" button
    Then check the Multiple Users creation been approved successfully
    Then BankUser logs out
#AAMS-660#03
    Then check the API created Users exist in LDS under the "1st" API created Org
    # AAMS-329#01, #AAMS-1380 #AAMS-1381 #AAMS-1382 #AAMS-1383 #AAMS-1384 #AAMS-812
    Then check the API created Users are linked under the assigned Applications with correct attribute values
    # AAMS-1769
    Then check the applications in CA for the "1st" API created User
    Then check the applications in CA for the "2nd" API created User
   	Then check non-integrated application "GCIS" links for the "1st" API created User
		Then check non-integrated application "Institutional Insights" links for the "1st" API created User
		Then check non-integrated application "Internet Enquiry Access" links for the "1st" API created User
		Then check integrated application "SDP CTS" links for the "1st" API created User
   	Then check non-integrated application "GCIS" links for the "2nd" API created User
		Then check non-integrated application "Institutional Insights" links for the "2nd" API created User
		Then check non-integrated application "Internet Enquiry Access" links for the "2nd" API created User
		Then check integrated application "SDP CTS" links for the "2nd" API created User

  @AAMS-2274 @AAMS-1468 @OIMcore
  Scenario: COBRA UI: Reject multiple users - Pending approvals page, Actions menu
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;Internet Enquiry Access;Online Trade                                                              |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    #AAMS-295#01
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    #AAMS-665#01,02,03
    Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
    Then check Reject Acknowledgement dialog displayed with empty reason
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | reject from Pending Approvals grid |
    Then check the Multiple Users creation been rejected successfully
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then check "No Record Found" message returned in search results grid
    Then BankUser logs out
    #AAMS-665#03
    Then check the API created Users do NOT exist in LDS

  @AAMS-1471 @AAMS-1468
  Scenario: COBRA UI: Create User - select available address from address dropdown
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;Internet Enquiry Access;Online Trade                                                              |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default users" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New User" tile does exist in the onboarding page
    When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check Org is selected and displayed correctly
    # AAMS-1354#01
    Then check the "4" options in Address dropdown
    Then BankUser clears the entered Org ID
    Then BankUser selects the "1st" available address and creates User
    Then check User has been created successfully
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser opens the "1st" entry from search User results
    Then check the details of the User displayed correctly in view User page
    Then BankUser logs out

@AAMS-5502 @AAMS-1232
Scenario: COBRA UI: Create User - Approving an existing OIM User - Coexistence uniqueness check
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with value "AAMS_1231_OIM_2"
    Then BankUser opens the "1st" entry from search User results
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check error message for approving existing CAAS OIM user