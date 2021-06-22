@chrome @ie @COBRA @OIM @UserMaintenanceScrns.feature
Feature: Screen validations on Enable, Disable, and Delete User options

  @AAMS-4091 @AAMS-2413 @AAMS-2426 @AAMS-2427 @AAMS-2483 @AAMS-2486 @AAMS-2487 @AAMS-2745 @AAMS-2544 @AAMS-2545 @AAMS-2547 @AAMS-2548 @AAMS-2549 @AAMS-2564 @AAMS-2565 @AAMS-2786 @AAMS-2745 @AAMS-2746 @AAMS-2764 @AAMS-2765 @AAMS-3742 @AAMS-3743 @AAMS-3902 @AAMS-4141 @AAMS-1775
	Scenario: COBRA UI: Enable, Disable, Delete, Approve and Reject options - "New" and "Enabled" Users
		Given "Default users" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "2" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | eMatching;GCIS;Transactive Global                                                                                                                    |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne                                          |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Reporting:All Divisions:All |
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    # "New" & "Pending Approval - Create" users
		Then BankUser selects the "1st" entry
    #AAMS-3742-01
    Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		Then BankUser opens the "1st" entry from search User results
    Then check the "Edit" options are displayed on User Details page
    Then check the "Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Then BankUser selects the "1st" and "2nd" entries
    #AAMS-3742-07
    Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" approves the "2nd" created user
    # "Enabled" & "Approved" users
    Then BankUser reset search
    And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    #AAMS-3742-01
    Then check "Edit, Disable, Delete" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Edit, Disable, Delete" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Enable" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Edit, Disable, Delete" options are displayed on User Details page
    Then check the "Enable" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Edit, Disable, Enable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
    Then check "Edit, Disable, Enable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    # "Enabled" & "Pending Approval - Modidifed" users
    Given "Default OIM Bankuser" modifies user applications of the "1st" API created user:
    			| remove  | GCIS |
    Then BankUser reset search
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    #AAMS-3742-01
    Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Edit" options are displayed on User Details page
    Then check the "Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Given "Default users" approves the "1st" created user
    Given "Default users" deletes the "1st" API created user
    Given "Default users" deletes the "2nd" API created user
    # "Disabled" & "Pending Approval - Deleted" users
    Then BankUser reset search
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    #AAMS-3742-06
    Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
  	And BankUser opens the "1st" entry from search User results
    Then check the "Edit, Disable, Enable, Delete" options are NOT displayed on User Details page
    Then check the "Approve, Reject" options are displayed on User Details page
    Then BankUser closes User details page
    Then BankUser logs out


  @AAMS-4119 @AAMS-2413 @AAMS-2426 @AAMS-2483 @AAMS-2486 @AAMS-2487 @AAMS-2745 @AAMS-2544 @AAMS-2545 @AAMS-2546 @AAMS-2547 @AAMS-2548 @AAMS-2549 @AAMS-2564 @AAMS-2565 @AAMS-2786 @AAMS-2746 @AAMS-2764 @AAMS-2765 @AAMS-2766 @AAMS-2767 @AAMS-2768 @AAMS-2769 @AAMS-3902 @AAMS-1775 @AAMS-2872 @AAMS-2873  @AAMS-4141
	Scenario: COBRA UI: Enable, Disable, Delete, Approve and Reject options - "Disabled" Users
		Given "Default users" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "2" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                           |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Reporting:All Divisions:All |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" approves the "2nd" created user
    Given "Default users" disables the "1st" API created user
    Given "Default users" disables the "2nd" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
    And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    # "Disabled" & "Approved" users
    Then BankUser selects the "1st" entry
    #AAMS-3742-01,07
    Then check "Edit, Enable, Delete" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Delete" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Disable" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Disable" options are "Disabled" in Actions Menu for the selected entry/entries
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Edit, Disable, Enable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    Then check "Edit, Disable, Enable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
    Then BankUser reset search
    And BankUser searches Users by "CAAS User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check the "Disable" options are NOT displayed on User Details page
    Then check the "Edit, Enable, Delete" options are displayed on User Details page
    Then BankUser clicks on "Enable" button in User details page for the "1st" API created User, then clicks "No" on the confirmation
    Then BankUser clicks on "Enable" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check enabling "1st" API created User has been submitted successfully
    Given "Default OIM Bankuser" enables the "2nd" API created user
    Then BankUser logs out
    When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		Then BankUser selects the "1st" entry
    # "Disabled" & "Pending Approval - Enable" users
    #AAMS-3742-06
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Approve, Reject" options are displayed on User Details page
    Then check the "Edit,Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Then BankUser reset search
    And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then check the "1st" row is grey-ed out
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser selects the "1st" and "2nd" entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | reject multiple users from Pending Approvals page |
    Then check the Multiple Users enablement been rejected successfully
    Then BankUser logs out
    Given "Default OIM Bankuser" deletes the "1st" API created user
    Given "Default OIM Bankuser" deletes the "2nd" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
		And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    # "Disabled" & "Pending Approval - Deleted" users
    Then BankUser selects the "1st" entry
    #AAMS-3742-06
    Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
  	And BankUser opens the "1st" entry from search User results
    Then check the "Edit, Disable, Enable, Delete" options are NOT displayed on User Details page
    Then check the "Approve, Reject" options are displayed on User Details page
    Then BankUser closes User details page
    Given "Default users" approves the "1st" created user
    Given "Default users" approves the "2nd" created user
    # "Deleted" & "Approved" users
    Then BankUser reset search
		And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    #AAMS-3742-05, AAMS-3743-05
    Then BankUser selects the "1st" entry
    Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit, Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
    And BankUser opens the "1st" entry from search User results
    Then check the "Edit, Disable, Enable, Delete" options are NOT displayed on User Details page
    Then BankUser logs out

  @AAMS-4092 @AAMS-2546 @AAMS-2549 @AAMS-2564 @AAMS-2565 @AAMS-3902 @AAMS-1775 @AAMS-2766 @AAMS-2769
	Scenario: COBRA UI: Approve/Reject options on multiple users with different status and workflow
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "4" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                           |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" approves the "2nd" created user
    Given "Default OIM Bankuser" modifies user applications of the "2nd" API created user:
    			| remove  | GCIS |
    Given "Default OIM Bankuser" approves the "3rd" created user
    Given "Default OIM Bankuser" approves the "4th" created user
    Given "Default OIM Bankuser" disables the "3rd" API created user
    Given "Default OIM Bankuser" enables the "3rd" API created user
    Given "Default OIM Bankuser" deletes the "4th" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
    And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser selects all the entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser selects all the entries
    Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
    Then BankUser logs out

  @AAMS-4093 @AAMS-2413 @AAMS-2426 @AAMS-2483 @AAMS-2486 @AAMS-2745 @AAMS-2746 @AAMS-3742 @AAMS-3743 @AAMS-3902 @AAMS-1775 @AAMS-4141
	Scenario: COBRA UI: User Maintenance - Helpdesk Officer Pilot Edit/Disable/Enable/Delete rights
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
		When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    #AAMS-3742-04
    Then check "Disable" options are "Enabled" in Context Menu for the selected entry/entries
    Then check "Disable" options are "Enabled" in Actions Menu for the selected entry/entries
    Then check "Enable, Delete, Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Delete, Edit" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Disable" options are displayed on User Details page
    Then check the "Enable, Delete, Edit" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Given "Default OIM Bankuser" disables the "1st" API created user
    Then BankUser reset search
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then check "Enable, Disble, Delete, Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disble, Delete, Edit" options are "Disabled" in Actions Menu for the selected entry/entries
    And BankUser opens the "1st" entry from search User results
    Then check the "Enable, Disable, Delete, Edit" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Then BankUser logs out

  @AAMS-3774 @AAMS-2413 @AAMS-2426 @AAMS-2483 @AAMS-2486 @AAMS-2745 @AAMS-2746 @AAMS-3902 @AAMS-1775
	Scenario: COBRA UI: Hide Edit, Enable, Disable, Delete options - bankuser not entitled
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications | eMatching |
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Implementation Manager" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		Then BankUser selects the "1st" entry
    Then check "Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Given "Default OIM Bankuser" disables the "1st" API created user
    Then BankUser reset search
    And BankUser searches Users by "User ID" with values from the "1st" API created user
		Then BankUser selects the "1st" entry
    Then check "Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser logs out

  @AAMS-4094 @AAMS-2413 @AAMS-2426 @AAMS-2483 @AAMS-2486 @AAMS-2745 @AAMS-2746 @AAMS-3742 @AAMS-3902 @AAMS-1775 
	Scenario: COBRA UI: Enable, Disable, Delete options - Source system is "CAAS"
    Given create a CAASUSER using CAAS api
    Then create a customer using api
    Then register a CAAS User using api
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches the UI created User by "User ID"
    And BankUser selects the "1st" entry
    Then check "Enable, Disable, Delete" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Enable, Disable, Delete" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Enable, Disable, Delete" options are NOT displayed on User Details page
    Then BankUser closes User details page
    Then BankUser logs out

  @AAMS-4160 @AAMS-2225 @AAMS-3742 @AAMS-3743 @AAMS-4141
  Scenario: COBRA UI: Edit User option - "Modify-limited" right
    Given "Default users" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | eMatching;GCIS;Transactive Global                                                                   |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne                                             |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Reporting:All Divisions:All |
    Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | EsandaNet;Institutional Insights                        |
      | securityDevices | ANZ Digital Key;Token Digipass 276:AUSTRALIA, Melbourne |
    When "Implementation Manager" logins in to COBRA using a valid password
		And BankUser navigates to search User page
    #AAMS-3742-03
		And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Edit" options are displayed on User Details page
    Then BankUser closes User details page
    #AAMS-3742-02
    Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "2nd" API created user
    And BankUser selects the "1st" entry
    Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Edit" options are displayed on User Details page
    Then BankUser closes User details page