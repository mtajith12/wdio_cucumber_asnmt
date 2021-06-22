@chrome @ie @COBRA @OIM
Feature: End to end flows of Modifying User Security Devices, submit, approve and reject the changes

    @AAMS-4696 @AAMS-3196-01 @AAMS-3180-01 @AAMS-3197 @AAMS-3010-01 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - New User - Add Devices - Submit and Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User creation confirmation message, then click on "Yes" button
        Then check the Single User creation been approved successfully
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        #AAMS-3197
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User


    @AAMS-4697 @AAMS-3180-01 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - New User - Add Devices - Submit and Reject
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User creation been rejected successfully
        Then check "No Record Found" message returned in search results grid
        Then BankUser logs out


    @AAMS-4698 @AAMS-3196-01 @AAMS-3180-01 @AAMS-3197 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Add Devices - Submit, Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        Given "Default users" approves the "1st" created user
        #AAMS-3197
        Then check User Credential is "Password" in CA for the "1st" API created User
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        #AAMS-3197
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User


    @AAMS-4699 @AAMS-3180-01 @AAMS-3242-01 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Add Devices - Submit, Reject
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        Given "Default users" approves the "1st" created user
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User modification been rejected successfully
        And Bankuser clicks Security Devices tab
        Then check "No Record Found" is displayed on empty security devices grid
        Then BankUser logs out


    @AAMS-4700 @AAMS-3169-03 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - New User - Remove devices
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu;ANZ Digital Key |
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant),ANZ Digital Key" in Security Devices grid
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then check "No Record Found" is displayed on empty security devices grid
        Then BankUser logs out


    @AAMS-4701 @AAMS-3168-01 @AAMS-3169-01 @AAMS-3169-04 @AAMS-3196-02 @AAMS-3180-02 @AAMS-3197 @AAMS-3010-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Devices in Provisioning Status - Submit, Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant)" in Security Devices grid
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        Then check "Remove" button is "Disabled" on Modify User Security Device screen
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Provisioning - pending remove"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Provisioning - pending remove"
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        And Bankuser clicks Security Devices tab
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device request cancelled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device request cancelled"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then check that "Token Digipass 270" for the "1st" created user is "Removed" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Removed" status from IDM Linked View
        Then check User Credential is "Password" in CA for the "1st" API created User
        Then BankUser logs out


    @AAMS-4702 @AAMS-3242-02 @AAMS-3180-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Devices in Provisioning Status - Submit, Reject
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant)" in Security Devices grid
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Provisioning - pending remove"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Provisioning - pending remove"
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User modification been rejected successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check that "Token Digipass 270" for the "1st" created user is "Provisioning" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Provisioning" status from IDM Linked View
        Then BankUser logs out


    @AAMS-4703 @AAMS-3197 @AAMS-3169-01 @AAMS-3169-04 @AAMS-3196-02  @AAMS-3180-02 @AAMS-3197 @AAMS-3010-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Devices in Pending Activation Status - Submit, Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:PENDING;Token Digipass 276 (China Compliant):PENDING |
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Pending activation - pending remove"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Pending activation - pending remove"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device never activated"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device never activated"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then check that "Token Digipass 270" for the "1st" created user is "Removed" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Removed" status from IDM Linked View
        Then check User Credential is "Password" in CA for the "1st" API created User
        Then BankUser logs out


    @AAMS-4704 @AAMS-3242-02 @AAMS-3180-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Devices in Pending Activation Status - Submit, Reject
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:PENDING;Token Digipass 276 (China Compliant):PENDING |
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Pending activation - pending remove"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Pending activation - pending remove"
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User modification been rejected successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        Then BankUser logs out


    @AAMS-4705 @AAMS-3197 @AAMS-3169-01 @AAMS-3169-04 @AAMS-3196-02 @AAMS-3180-02 @AAMS-3197 @AAMS-3106-03 @AAMS-3010-02 @AAMS-3009-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Enabled and Disabled Devices Submit and Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        #AAMS-3106-03
        Then check that "Token Digipass 270" for the "1st" created user is "Disabled" status from IDM Linked View
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:DISABLED;Token Digipass 276 (China Compliant):ENABLED |
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then Bankuser clicks Security Devices tab
        Then BankUser selects "Token Digipass 270" with Status "Removed" and Description "Disabled - pending remove" in Security Devices grid
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Removed" and Description "Enabled - pending remove" in Security Devices grid
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "Disabled device revoked"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "Device revoked"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then check that "Token Digipass 270" for the "1st" created user is "Removed" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Removed" status from IDM Linked View
        Then check User Credential is "Password" in CA for the "1st" API created User
        Then BankUser logs out


    @AAMS-4707 @AAMS-3242-02 @AAMS-3180-02 @AAMS-3106-03 @AAMS-3009-02 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Enabled User - Remove Enabled and Disabled Devices Submit and Reject
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        #AAMS-3106-03
        Then check that "Token Digipass 270" for the "1st" created user is "Disabled" status from IDM Linked View
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:DISABLED;Token Digipass 276 (China Compliant):ENABLED |
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User modification been rejected successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser logs out

    @AAMS-5206 @AAMS-3169-04 @AAMS-3196-02
    Scenario: COBRA UI: Modify User Security Devices - Disabled User - Remove Implicitly Disabled Devices Submit and Approve
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Default users" disables the "1st" API created user
        Then check that "Token Digipass 270" for the "1st" created user is "ImplicitDisabled" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "ImplicitDisabled" status from IDM Linked View
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:IMPLICITDISABLED;Token Digipass 276 (China Compliant):IMPLICITDISABLED |
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then Bankuser clicks Security Devices tab
        Then BankUser selects "Token Digipass 270" with Status "Removed" and Description "System disabled - pending remove" in Security Devices grid
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Removed" and Description "System disabled - pending remove" in Security Devices grid
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog   
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Removed" and Description "System disabled device revoked"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Removed" and Description "System disabled device revoked"
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "View Token Function" dialog is displayed with "No values to display" message
        Then BankUser closes "View Token Function" dialog
        Then check that "Token Digipass 270" for the "1st" created user is "Removed" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Removed" status from IDM Linked View
        Then check User Credential is "Password" in CA for the "1st" API created User
        Then BankUser logs out


    @AAMS-4708 @AAMS-3172 @AAMS-3197 @AAMS-3170-03 @AAMS-3196-03 @AAMS-3180-03 @AAMS-3197 @AAMS-3009-01 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Disable and Enable devices - Approve Enable devices
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        #AAMS-3170-03
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        Then BankUser selects "Token Digipass 270" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        Then click "Enable" button on Modify User Security Device screen
        Then check security device enable message and click on "No" button
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then click "Enable" button on Modify User Security Device screen
        Then check security device enable message and click on "Yes" button
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        Then click "Enable" button on Modify User Security Device screen
        Then check security device enable message and click on "Yes" button
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        And Bankuser clicks Security Devices tab
        Then BankUser double clicks on "Token Digipass 270" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 270" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then BankUser double clicks on "Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "View Token Function" dialog is displayed for "Token Digipass 276 (China Compliant)" for the "1st" API created User
        Then check "Token Function" table content with default values
        Then BankUser closes "View Token Function" dialog
        Then check that "Token Digipass 270" for the "1st" created user is "Disabled" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Disabled" status from IDM Linked View
        Then BankUser logs out
        Then "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then BankUser clicks on "Approve" button on the User details page
        Then check Approve Single User modification confirmation message, then click on "Yes" button
        Then check the Single User modification been approved successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
        Then check that "Token Digipass 270" for the "1st" created user is "Enabled" status from IDM Linked View
        Then check that "Token Digipass 276 (China Compliant)" for the "1st" created user is "Enabled" status from IDM Linked View
        Then check User Credential is "Security Device & Password" in CA for the "1st" API created User
        Then BankUser logs out


    @AAMS-4709 @AAMS-3172 @AAMS-3180-03 @AAMS-3242-03 @AAMS-4556
    Scenario: COBRA UI: Modify User Security Devices - Disable and Enable devices - Reject Enable devices
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then BankUser closes User details page
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | enable | Token Digipass 270;Token Digipass 276 (China Compliant) |
        And BankUser opens the "1st" entry from search User results
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Disabled - pending enable"
        Then BankUser clicks on "Reject" button on the User details page
        Then check Reject Acknowledgement dialog displayed with empty reason
        Then BankUser enters Reject reason then clicks on "Ok" button:
            | rejectReason | reject user modifications from user details page |
        Then check the Single User modification been rejected successfully
        And Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then BankUser logs out

    @AAMS-4819 @AAMS-3171
    Scenario: Enable security device - display message when another device of same type is enabled
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 270" for "1st" created user
        Then "Registration Officer (Pilot)" disables "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | add | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        Given "Default OIM Bankuser" modifies user security devices of the "1st" API created user:
            | remove | Token Digipass 270:ENABLED |
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        Then click "Enable" button on Modify User Security Device screen
        Then verify the message for another device of the same type is displayed and click OK
        Then BankUser selects "Token Digipass 270" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        Then click "Enable" button on Modify User Security Device screen
        Then verify the message for another device of the same type is displayed and click OK