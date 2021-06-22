@chrome @ie @COBRA @OIM @UserMaintenance.feature
Feature: End to end flows of Enabling, Disabling, and Deleting Users

  @AAMS-4086 @AAMS-2427 @AAMS-2884-01 @AAMS-2785 @AAMS-3009-01 @AAMS-3902 @AAMS-4556
  Scenario: COBRA UI: User Maintenance - Disable User
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then BankUser clicks on "Disable" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check the "1st" API created User has been disabled successfully
    Then check User status is "Disabled" and workflow is "Approved" in view User page
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
    Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
    Then check "Token Function" table content with default values
    Then BankUser closes "View Token Function" dialog
    Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
    Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
    Then check "Token Function" table content with default values
    Then BankUser closes "View Token Function" dialog
    Then BankUser closes User details page
    Then check the "1st" row is grey-ed out
    Then check User status is "Disabled" in CA for the "1st" API created User
    Then check the Tokens of the "1st" API created User are in "ImplicitDisabled" status in IDM
    Then BankUser logs out

  @AAMS-4087 @AAMS-2487 @AAMS-2927 @AAMS-2550 @AAMS-2785 @AAMS-3902 @AAMS-2566 @AAMS-4556
  Scenario: COBRA UI: User Maintenance - Enable User and single approve the enablement
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Default OIM Bankuser" disables the "1st" API created user
    Then check the Tokens of the "1st" API created User are in "ImplicitDisabled" status in IDM
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then check the "1st" row is grey-ed out
    And BankUser opens the "1st" entry from search User results
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then BankUser clicks on "Enable" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check enabling "1st" API created User has been submitted successfully
    Then check User status is "Disabled" and workflow is "Pending Approval - Enable" in view User page
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
    Then BankUser closes User details page
    Then check the "1st" row is grey-ed out
    Then BankUser logs out
    When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from Pending Approvals grid
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User enablement confirmation message, then click on "Yes" button
    Then check the Single User enablement been approved successfully
    Then check User status is "Enabled" and workflow is "Approved" in view User page
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
    Then BankUser logs out
    Then check User status is "Enabled" in CA for the "1st" API created User
    Then check the Tokens of the "1st" API created User are in "Enabled" status in IDM

  @AAMS-4088 @AAMS-2487 @AAMS-2927 @AAMS-2559 @AAMS-3902 @AAMS-4556
  Scenario: COBRA UI: User Maintenance - Enable User and single reject the enablement
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Default OIM Bankuser" disables the "1st" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser enables the "1st" API created User from "Actions" menu
    Then check enabling "1st" API created User has been submitted successfully
    And BankUser opens the "1st" entry from search User results
    Then check User status is "Disabled" and workflow is "Pending Approval - Enable" in view User page
    Then BankUser closes User details page
    Then BankUser logs out
    When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from Pending Approvals grid
    Then BankUser clicks on "Reject" button on the User details page
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | reject test 123 |
    Then check the Single User enablement been rejected successfully
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then check User status is "Disabled" and workflow is "Approved" in view User page
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then BankUser logs out
    Then check User status is "Disabled" in CA for the "1st" API created User
    Then check the Tokens of the "1st" API created User are in "ImplicitDisabled" status in IDM

  @AAMS-4089 @AAMS-2553 @AAMS-2927 @AAMS-3902
  Scenario: COBRA UI: User Maintenance - Approve multiple users' enablement
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" approves the "2nd" created user
    Given "Default OIM Bankuser" disables the "1st" API created user
    Given "Default OIM Bankuser" disables the "2nd" API created user
    Given "Default users" enables the "1st" API created user
    Given "Default users" enables the "2nd" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
    Then BankUser approves the "1st" and "2nd" entries from "Context" menu
    Then check Approve Multiple Users creation confirmation message, then click on "Yes" button
    Then check the Multiple Users enablement been approved successfully
    Then BankUser logs out
    Then check User status is "Enabled" in CA for the "1st" API created User
    Then check User status is "Enabled" in CA for the "2nd" API created User

  @AAMS-4090 @AAMS-2561 @AAMS-3902
  Scenario: COBRA UI: User Maintenance - Reject multiple users' enablement
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" approves the "2nd" created user
    Given "Default OIM Bankuser" disables the "1st" API created user
    Given "Default OIM Bankuser" disables the "2nd" API created user
    Given "Default users" enables the "1st" API created user
    Given "Default users" enables the "2nd" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
    Then BankUser enters Reject reason then clicks on "Ok" button:
      | rejectReason | reject multiple users |
    Then check the Multiple Users enablement been rejected successfully
    Then BankUser logs out
    Then check User status is "Disabled" in CA for the "1st" API created User
    Then check User status is "Disabled" in CA for the "2nd" API created User

  @AAMS-4212 @AAMS-2747-01 @AAMS-2747-02 @AAMS-2747-04 @AAMS-2747-05 @AAMS-2773 @AAMS-2817 @AAMS-2775 @AAMS-2882-01 @AAMS-2881-01 @AAMS-2856-01 @AAMS-4556 @AAMS-4233
  Scenario: COBRA UI: User Maintenance - Delete Enabled User with "Enabled" tokens - Approve from User Details page
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
    Given "Default OIM Bankuser" approves the "1st" created user
    Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
    Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer |
      | What was the name of your first pet?  | test1  |
      | What is your father's place of birth? | test2  |
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
    Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
    Given "Default users" modifies user applications of the "1st" API created user:
      | edit   | Internet Enquiry Access               |
      | disable | EsandaNet;GCIS                       |
    Given "Default OIM Bankuser" approves the "1st" created user
    Then check the Tokens of the "1st" API created User are in "Enabled" status in IDM
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then check User status is "Enabled" and workflow is "Approved" in view User page
    Then BankUser clicks on "Delete" button in User details page for the "1st" API created User, then clicks "No" on the confirmation
    Then BankUser clicks on "Delete" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check deleting "1st" API created User has been submitted successfully
    Then check User status is "Disabled" and workflow is "Pending Approval - Deleted" in view User page
    Then check the application status in applications grid
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "User disabled"
    Then BankUser closes User details page
    Then check the "1st" row is grey-ed out
    Then check the Tokens of the "1st" API created User are in "ImplicitDisabled" status in IDM
    Then BankUser logs out
    When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    Then check the "1st" row is grey-ed out
    And BankUser opens the "1st" entry from search User results
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User deletion confirmation message, then click on "No" button
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User deletion confirmation message, then click on "Yes" button
    Then check the Single User deletion been approved successfully
    Then check User Status set to Deleted and Workflow to Approved on View User details page
    And Bankuser clicks Security Devices tab
    Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
    Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
    Then check the User application grid is empty
    Then BankUser closes User details page
    Then BankUser logs out
    Then check that the User has been removed from IDM for the "1st" API created User
    Then check that all application links have been removed from IDM for the "1st" API created User
    Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
    Then check the Tokens of the "1st" API created User are in "Removed" status in IDM

@AAMS-4213 @AAMS-2747-01 @AAMS-2747-02 @AAMS-2747-03 @AAMS-2747-05 @AAMS-2773 @AAMS-2817 @AAMS-2775 @AAMS-2856-01 @AAMS-2881-03 @AAMS-4556 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete Disabled User with "Provisiong" and "Pending" tokens - Approve from User Details page
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
  Given "Default OIM Bankuser" disables the "1st" API created user
  Then check that "Token Digipass 270" for the "1st" created user is "Provisioning" status from IDM Linked View
  Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Pending" status from IDM Linked View
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  And BankUser navigates to search User page
  And BankUser searches Users by "User ID" with values from the "1st" API created user
  And BankUser opens the "1st" entry from search User results
  Then check User status is "Disabled" and workflow is "Approved" in view User page
  Then BankUser clicks on "Delete" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
  Then check deleting "1st" API created User has been submitted successfully
  Then check User status is "Disabled" and workflow is "Pending Approval - Deleted" in view User page
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check the application status in applications grid
  And Bankuser clicks Security Devices tab
  Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
  Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
  Then BankUser closes User details page
  Then check the "1st" row is grey-ed out
  Then BankUser logs out
  When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
  And BankUser navigates to Pending Approvals page
  Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
  Then check the "1st" row is grey-ed out
  And BankUser opens the "1st" entry from Pending Approvals grid
  Then BankUser clicks on "Approve" button on the User details page
  Then check Approve Single User deletion confirmation message, then click on "Yes" button
  Then check the Single User deletion been approved successfully
  And Bankuser clicks Security Devices tab
  Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
  Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "User deleted"
  Then BankUser logs out
  Then check that the User has been removed from IDM for the "1st" API created User
  Then check that all application links have been removed from IDM for the "1st" API created User
  Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
  Then check the Tokens of the "1st" API created User are in "Removed" status in IDM

@AAMS-4214 @AAMS-2787-01 @AAMS-2787-03 @AAMS-2787-04 @AAMS-2817 @AAMS-2775 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Approve Multiple users with Pending Approval - Deleted Workflow from Pending approvals page
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" deletes the "1st" API created user
  Given "Default OIM Bankuser" deletes the "2nd" API created user
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check User status is "Disabled" in CA for the "2nd" API created User
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to Pending Approvals page
  Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
  Then check the "1st" row is grey-ed out
  Then check the "2nd" row is grey-ed out
  Then BankUser approves the "1st" and "2nd" entries from "Context" menu
  Then check Approve Multiple Users deletion confirmation message, then click on "No" button
  Then BankUser approves the "1st" and "2nd" entries from "Context" menu
  Then check Approve Multiple Users deletion confirmation message, then click on "Yes" button
  Then check the Multiple Users deletion been approved successfully
  Then BankUser logs out
  Then check that the User has been removed from IDM for the "1st" API created User
  Then check that the User has been removed from IDM for the "2nd" API created User
  Then check that all application links have been removed from IDM for the "1st" API created User
  Then check that all application links have been removed from IDM for the "2nd" API created User
  Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
  Then check User DELETE_FLAG is "Y" in CA for the "2nd" API created User

@AAMS-4215 @AAMS-2787-01 @AAMS-2787-03 @AAMS-2787-04 @AAMS-2817 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Approve Multiple users with Pending Approval - Deleted Workflow from User Summary Grid
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" deletes the "1st" API created user
  Given "Default OIM Bankuser" deletes the "2nd" API created user
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check User status is "Disabled" in CA for the "2nd" API created User
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to search User page
  And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
  Then check the "1st" row is grey-ed out
  Then check the "2nd" row is grey-ed out
  Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
  Then check Approve Multiple Users deletion confirmation message, then click on "No" button
  Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
  Then check Approve Multiple Users deletion confirmation message, then click on "Yes" button
  Then check the Multiple Users deletion been approved successfully
  Then check the "2" "Deleted" User statuses and workflow are updated in the User Summary Grid
  Then BankUser logs out
  Then check that the User has been removed from IDM for the "1st" API created User
  Then check that the User has been removed from IDM for the "2nd" API created User
  Then check that all application links have been removed from IDM for the "1st" API created User
  Then check that all application links have been removed from IDM for the "2nd" API created User
  Then check User DELETE_FLAG is "Y" in CA for the "1st" API created User
  Then check User DELETE_FLAG is "Y" in CA for the "2nd" API created User


@AAMS-4216 @AAMS-2747-01 @AAMS-2747-02 @AAMS-2747-04 @AAMS-2747-05 @AAMS-2865 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Reject single from User Details page
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  And BankUser navigates to search User page
  And BankUser searches Users by "User ID" with values from the "1st" API created user
  And BankUser opens the "1st" entry from search User results
  Then BankUser clicks on "Delete" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
  Then check deleting "1st" API created User has been submitted successfully
  Then check User status is "Disabled" and workflow is "Pending Approval - Deleted" in view User page
  Then check the application status in applications grid
  Then BankUser closes User details page
  Then check the "1st" row is grey-ed out
  Then BankUser logs out
  When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
  And BankUser navigates to search User page
  And BankUser searches Users by "User ID" with values from the "1st" API created user
  And BankUser opens the "1st" entry from search User results
  Then BankUser clicks on "Reject" button on the User details page
  Then BankUser enters Reject reason then clicks on "Cancel" button:
    | rejectReason | reject test 123 |
  Then BankUser clicks on "Reject" button on the User details page
  Then BankUser enters Reject reason then clicks on "Ok" button:
    | rejectReason | reject test 123 |
  Then check the Single User deletion been rejected successfully
  Then check the application status in applications grid
  Then check User status is "Disabled" and workflow is "Approved" in view User page
  Then BankUser logs out
  Then check User status is "Disabled" in CA for the "1st" API created User

@AAMS-4217 @AAMS-2747-01 @AAMS-2747-02 @AAMS-2747-04 @AAMS-2747-05 @AAMS-2862 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Reject Multiple users with Pending Approval - Deleted Workflow from Pending Approvals page
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" deletes the "1st" API created user
  Given "Default OIM Bankuser" deletes the "2nd" API created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to Pending Approvals page
  Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
  Then BankUser rejects the "1st" and "2nd" entries from "Context" menu
  Then BankUser enters Reject reason then clicks on "Cancel" button:
    | rejectReason | reject test 123 |
  Then BankUser rejects the "1st" and "2nd" entries from "Context" menu
  Then BankUser enters Reject reason then clicks on "Ok" button:
    | rejectReason | reject test 123 |
  Then check the Multiple Users deletion been rejected successfully
  Then BankUser logs out
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check User status is "Disabled" in CA for the "2nd" API created User

@AAMS-4218 @AAMS-2747-01 @AAMS-2747-02 @AAMS-2747-04 @AAMS-2747-05 @AAMS-2862 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Reject Multiple users with Pending Approval - Deleted Workflow from User Summary Grid
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "1st" created user
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" deletes the "1st" API created user
  Given "Default OIM Bankuser" deletes the "2nd" API created user
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check User status is "Disabled" in CA for the "2nd" API created User
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to search User page
  And BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
  Then check the "1st" row is grey-ed out
  Then check the "2nd" row is grey-ed out
  Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
  Then BankUser enters Reject reason then clicks on "Ok" button:
    | rejectReason | reject test 123 |
  Then check the Multiple Users deletion been rejected successfully
  Then check the "2" "Disabled" User statuses and workflow are updated in the User Summary Grid
  Then BankUser logs out
  Then check User status is "Disabled" in CA for the "1st" API created User
  Then check User status is "Disabled" in CA for the "2nd" API created User

@AAMS-4219 @AAMS-2787-02 @AAMS-2787-04 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Approve Users with Combination of Workflows from User Summary Grid
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "4" users with the "1st" created Org, without a Customer, and with:
    | applications | EsandaNet;GCIS;Transactive Global |
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" modifies user applications of the "2nd" API created user:
    | remove | GCIS |
  Given "Default OIM Bankuser" approves the "3rd" created user
  Given "Default OIM Bankuser" approves the "4th" created user
  Given "Default OIM Bankuser" disables the "3rd" API created user
  Given "Default OIM Bankuser" enables the "3rd" API created user
  Given "Default OIM Bankuser" deletes the "4th" API created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to search User page
  Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
  Then BankUser approves the combination of all users from the "Actions" menu
  Then check Approve Multiple Users combination confirmation message, then click on "Yes" button
  Then BankUser logs out

@AAMS-4220 @AAMS-2787-02 @AAMS-2787-04 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Approve users with Combination of Workflows - from Pending Approvals Screen
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "4" users with the "1st" created Org, without a Customer, and with:
    | applications | EsandaNet;GCIS;Transactive Global |
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" modifies user applications of the "2nd" API created user:
    | remove | GCIS |
  Given "Default OIM Bankuser" approves the "3rd" created user
  Given "Default OIM Bankuser" approves the "4th" created user
  Given "Default OIM Bankuser" disables the "3rd" API created user
  Given "Default OIM Bankuser" enables the "3rd" API created user
  Given "Default OIM Bankuser" deletes the "4th" API created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to Pending Approvals page
  Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
  Then BankUser approves the combination of all users from the "Actions" menu
  Then check Approve Multiple Users combination confirmation message, then click on "Yes" button
  Then BankUser logs out


@AAMS-4221 @AAMS-2862-01 @AAMS-2862-03 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Reject users with Combination of Workflows - from User Summary Grid
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "4" users with the "1st" created Org, without a Customer, and with:
    | applications    | eMatching;EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;SDP CTS;GCP;LM;Transactive Global |
    | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu            |
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" modifies user applications of the "2nd" API created user:
    | remove | GCIS |
  Given "Default OIM Bankuser" approves the "3rd" created user
  Given "Default OIM Bankuser" approves the "4th" created user
  Given "Default OIM Bankuser" disables the "3rd" API created user
  Given "Default OIM Bankuser" enables the "3rd" API created user
  Given "Default OIM Bankuser" deletes the "4th" API created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to search User page
  Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
  Then BankUser rejects the combination of all users from the "Actions" menu
  Then BankUser enters Reject reason then clicks on "Ok" button:
    | rejectReason | reject test 123 |
  Then check the Multiple Users combination been rejected successfully
  Then BankUser logs out

@AAMS-4222 @AAMS-2862-01 @AAMS-2862-03 @AAMS-4233 
Scenario: COBRA UI: User Maintenance - Delete User - Reject users with Combination of Workflows - from Pending Approvals Screen
  Given "Default users" creates "1" organisations with all applications
  Given "Default users" creates "4" users with the "1st" created Org, without a Customer, and with:
    | applications    | EsandaNet;GCIS;Transactive Global                                                                           |
    | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
  Given "Default OIM Bankuser" approves the "2nd" created user
  Given "Default OIM Bankuser" modifies user applications of the "2nd" API created user:
    | remove | GCIS |
  Given "Default OIM Bankuser" approves the "3rd" created user
  Given "Default OIM Bankuser" approves the "4th" created user
  Given "Default OIM Bankuser" disables the "3rd" API created user
  Given "Default OIM Bankuser" enables the "3rd" API created user
  Given "Default OIM Bankuser" deletes the "4th" API created user
  When "Registration Officer (Pilot)" logins in to COBRA using a valid password
  Then BankUser navigates to Pending Approvals page
  Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
  Then BankUser rejects the combination of all users from the "Actions" menu
  Then BankUser enters Reject reason then clicks on "Ok" button:
    | rejectReason | reject test 123 |
  Then check the Multiple Users combination been rejected successfully
  Then BankUser logs out

@AAMS-4789 @AAMS-4228 @AAMS-4230 @AAMS-4231
Scenario: COBRA UI: User Maintenance - Set User.Locked and User.Force Password Change Attributes in LDS 
  #AAMS-4228 Approve User Creation - Set User Account attributes in LDS
  Given "Default users" creates "1" organisations with all applications
  Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
  Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
    | applications    | SDP CTS;Transactive Global                                                                  |
    | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
  Given "Default users" approves the "1st" created user
  Then check anzpwddisabled value is "16777216" for the "1st" user
  #AAMS-4230 New User Activation - Send User Account Attributes to COBRA
  When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
  And BankUser navigates to search User page
  And BankUser searches Users by "User ID" with values from the "1st" API created user
  And BankUser selects the "1st" entry
  And BankUser opens the "1st" entry from search User results
  And BankUser clicks "Verify" button
  And BankUser selects "English" in challenge language
  And selects "What is the name of your first teacher?" in challengeQuestion1, "Where did you go on your first holiday?" in challengeQuestion2 and "" in challengeQuestion3
  And enters "test value1" in response1 textbox "test value2" in response2 textbox and "" in response3 textbox
  And BankUser clicks "Submit" button
  Then BankUser clicks "Generate Password" button
  Then BankUser clicks "Yes" button
  And verifies the text in "userVerified" is "Yes"
  And BankUser verifies the time stamp in Verified On with user as "Helpdesk Officer (Pilot)"
  Then BankUser clicks "Close" button
  Then check anzpwddisabled value is "16777216" for the "1st" user
  #AAMS-4231 Reset Password - Send User Account Attributes to COBRA  
  Then BankUser clicks "Generate Password" button
  Then BankUser clicks "Yes" button
  Then BankUser clicks "Close" button
  Then check anzpwddisabled value is "16777216" for the "1st" user