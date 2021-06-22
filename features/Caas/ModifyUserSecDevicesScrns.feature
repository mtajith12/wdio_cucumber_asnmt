@chrome @ie @COBRA @OIM @ModifyUserSecDevicesScrns.feature
Feature: Screen validations for User Security Device Maintenance

    @AAMS-4711 @AAMS-4556 @AAMS-3159-04 @AAMS-3159-05 @AAMS-3161 @AAMS-3163 @AAMS-3164 @AAMS-3165 @AAMS-3168 @AAMS-3169-01 @AAMS-3170 @AAMS-3104-01 @AAMS-3104-03 @AAMS-3104-04 @AAMS-3104-05 @AAMS-3106
    Scenario: COBRA UI: Security Device Maintenance - Enabled User - Enable 'Add, Remove, Enable and Disable' buttons
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        Given "Default users" approves the "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        #AAMS-3159-05
        Then BankUser clicks on "Cancel" button for User Modification and clicks "Yes" on the confirmation
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        #AAMS-3159-04
        Then check "No Record Found" is displayed on empty security devices grid
        Then check "Add" button is "Enabled" on Modify User Security Device screen
        #AAMS-3163
        Then click "Add" button on Modify User Security Device screen
        Then BankUser clicks "Cancel" button on add security device page
        #AAMS-3161-01,02,03,05,06 AAMS-3164 AAMS-3165
        Then click "Add" button on Modify User Security Device screen
        Then check "ANZ Digital Key" is an available option in Security Devices dropdown
        Then check "Token Digipass 270" is an available option in Security Devices dropdown
        Then check "Token Digipass 276 (China Compliant)" is an available option in Security Devices dropdown
        Then check that "ANZ Digital Key" is the "1st" device in Security Devices dropdown
        Then check that "Token Digipass 270" is the "2nd" device in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "3rd" device in Security Devices dropdown
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check "ANZ Digital Key" is NOT an available option in Security Devices dropdown
        Then check that "Token Digipass 270" is the "1st" device in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "2nd" device in Security Devices dropdown
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check "Token Digipass 270" is NOT an available option in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "1st" device in Security Devices dropdown
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then check "Add" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-02
        Then check "Remove" button is "Disabled" on Modify User Security Device screen
        Then BankUser clicks on "Token Digipass 270" device in Security Devices Grid
        #AAMS-3170-05
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-01
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
        Then BankUser closes User details page
        Given "Default users" approves the "1st" created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        Then check "Add" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-02
        Then check "Remove" button is "Disabled" on Modify User Security Device screen
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Provisioning" and Description "Device awaiting issuance"
        #AAMS-3170-05 #AAMS-3170-06
        Then BankUser selects "Token Digipass 270" with Status "Provisioning" and Description "Device awaiting issuance" in Security Devices grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-01
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then BankUser clicks on "Cancel" button for User Modification and clicks "Yes" on the confirmation
        Then BankUser closes User details page
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Security Device Officer" issues "Token Digipass 276 (China Compliant)" for "1st" created user
        And BankUser opens the "1st" entry from search User results
        #AAMS-3104-04
        Then Bankuser clicks Security Devices tab
        Then BankUser selects "Token Digipass 270" with Status "Pending activation" and Description "Device awaiting activation" in Security Devices grid
        Then check "Disable" button is disabled on Security Devices tab
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        Then check "Add" button is "Enabled" on Modify User Security Device screen
        Then click "Add" button on Modify User Security Device screen
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then check "Token Digipass 270" is an available option in Security Devices dropdown
        Then check "Token Digipass 276 (China Compliant)" is an available option in Security Devices dropdown
        Then BankUser clicks "Cancel" button on add security device page
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
        Then BankUser selects "Token Digipass 270" with Status "Pending activation" and Description "Device awaiting activation" in Security Devices grid
        #AAMS-3170-05 #AAMS-3170-06
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-01
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then BankUser clicks on "Cancel" button for User Modification and clicks "Yes" on the confirmation
        Then BankUser closes User details page
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 276 (China Compliant)" for "1st" created user
        And BankUser opens the "1st" entry from search User results
        Then Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status "Enabled" and Description "Device active"
        #AAMS-3104-05
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant)" in Security Devices grid
        Then check "Disable" button is disabled on Security Devices tab
        Then BankUser selects "Token Digipass 270" with Status "Enabled" and Description "Device active" in Security Devices grid
        Then check "Disable" button is enabled on Security Devices tab
        Then BankUser clicks "Disable" security device button
        #AAMS-3106
        Then check security device disable message and click on "No" button
        Then BankUser clicks "Disable" security device button
        Then check security device disable message and click on "Yes" button
        Then check device disabled confirmation message and confirm
        #AAMS-3104-03
        Then check "Disable" button is disabled on Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then BankUser closes User details page
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then check "Add" button is "Enabled" on Modify User Security Device screen
        Then click "Add" button on Modify User Security Device screen
        Then check "Token Digipass 270" is an available option in Security Devices dropdown
        Then check "Token Digipass 276 (China Compliant)" is an available option in Security Devices dropdown
        Then BankUser clicks "Cancel" button on add security device page
        #AAMS-3170-02
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        Then BankUser selects "Token Digipass 270" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        #AAMS-3170-01
        Then check "Enable" button is "Enabled" on Modify User Security Device screen
        #AAMS-3168-01 AAMS-3169-01
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        #AAMS-3168-03
        Then check "Remove" button is "Disabled" on Modify User Security Device screen
        #AAMS-3170-05 #AAMS-3170-06
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Enabled" and Description "Device active" in Security Devices grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-01
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        #AAMS-3168-03
        Then check "Remove" button is "Disabled" on Modify User Security Device screen


    @AAMS-4712 @AAMS-4556 @AAMS-3161 @AAMS-3163-01 @AAMS-3164 @AAMS-3165 @AAMS-3168-01
    Scenario: COBRA UI: Security Device Maintenance - Add Security Device - Enable 'Add and Remove' buttons when user is New
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        #AAMS-3161 AAMS-3163-01 AAMS-3164 AAMS-3165
        Then check "Add" button is "Enabled" on Modify User Security Device screen
        Then click "Add" button on Modify User Security Device screen
        Then check "ANZ Digital Key" is an available option in Security Devices dropdown
        Then check "Token Digipass 270" is an available option in Security Devices dropdown
        Then check "Token Digipass 276 (China Compliant)" is an available option in Security Devices dropdown
        Then check that "ANZ Digital Key" is the "1st" device in Security Devices dropdown
        Then check that "Token Digipass 270" is the "2nd" device in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "3rd" device in Security Devices dropdown
        Then check Add Security Device dialog displays "ANZ Digital Key"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "ANZ Digital Key" with status "New" is the "1st" item in Devices grid
        Then check "ANZ Digital Key" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check "ANZ Digital Key" is NOT an available option in Security Devices dropdown
        Then check that "Token Digipass 270" is the "1st" device in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "2nd" device in Security Devices dropdown
        Then check Add Security Device dialog displays "Token Digipass 270"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 270" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status New
        Then click "Add" button on Modify User Security Device screen
        Then check "Token Digipass 270" is NOT an available option in Security Devices dropdown
        Then check that "Token Digipass 276 (China Compliant)" is the "1st" device in Security Devices dropdown
        Then check Add Security Device dialog displays "Token Digipass 276 (China Compliant)"
        Then BankUser clicks "Ok" button on add security device page
        Then check Security Device "Token Digipass 276 (China Compliant)" with status "New" is the "1st" item in Devices grid
        Then check "Token Digipass 276 (China Compliant)" is displayed correctly in Security Devices tab with Status New
        Then check "Add" button is "Disabled" on Modify User Security Device screen
        #AAMS-3168-01
        Then BankUser clicks on "ANZ Digital Key" device in Security Devices Grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then BankUser clicks on "Token Digipass 270" device in Security Devices Grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then BankUser clicks on "Token Digipass 276 (China Compliant)" device in Security Devices Grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen
        Then check "Remove" button is "Enabled" on Modify User Security Device screen

    @AAMS-4713 @AAMS-4556 @AAMS-3161-05 @AAMS-3169-02 @AAMS-3169-04
    Scenario: COBRA UI: Security Device Maintenance - Add Security Device - Disable 'Add' option when new user is assigned all devices
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu;ANZ Digital Key |
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        #AAMS-3161-05
        Then check "Add" button is "Disabled" on Modify User Security Device screen
        Then select "Token Digipass 270,Token Digipass 276 (China Compliant),ANZ Digital Key" in Security Devices grid
        Then check "Remove" button is "Enabled" on Modify User Security Device screen
        Then click "Remove" button on Modify User Security Device screen
        #AAMS-3169-02 AAMS-3169-04
        Then check remove security device message and click "No"
        Then click "Remove" button on Modify User Security Device screen
        Then check remove security device message and click "Yes"
        Then check "No Record Found" is displayed on empty security devices grid

    @AAMS-4714 @AAMS-4556 @AAMS-3161-04
    Scenario: COBRA UI: Security Device Maintenance - Add Security Device - Disable 'Add' option when user is Disabled
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
            | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
        Given "Default users" approves the "1st" created user
        Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
            | question                              | answer  |
            | What was the name of your first pet?  | answer1 |
            | What is your father's place of birth? | answer2 |
        Then "Security Device Officer" issues "Token Digipass 270" for "1st" created user
        Then "Helpdesk Officer (Pilot)" activates "Token Digipass 270" for "1st" created user
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then Bankuser clicks Security Devices tab
        Then BankUser selects "Token Digipass 270" with Status "Enabled" and Description "Device active" in Security Devices grid
        Then BankUser clicks "Disable" security device button
        Then check security device disable message and click on "Yes" button
        Then check device disabled confirmation message and confirm
        Then check "Token Digipass 270" is displayed correctly in Security Devices tab with Status "Disabled" and Description "Device disabled"
        Then BankUser clicks on "Disable" button in User details page for the "1st" API created User, then clicks "Yes" on the confirmation
        Then check the "1st" API created User has been disabled successfully
        And BankUser clicks on "Edit" button on User Details page
        Then Bankuser clicks Security Devices tab
        #AAMS-3161-04
        Then check "Add" button is "Disabled" on Modify User Security Device screen
        #AAMS-3170-04
        Then BankUser selects "Token Digipass 270" with Status "Disabled" and Description "Device disabled" in Security Devices grid
        Then check "Enable" button is "Disabled" on Modify User Security Device screen


    @AAMS-4715 @AAMS-4556 @AAMS-3159 @AAMS-3160 @3104-02
    Scenario: COBRA UI: Display Modify User Security Device Screen - Modify Rights - Limited View / Modification Mode
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
        #AAMS-3160
        Given "Implementation Manager" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        Then Bankuser clicks Security Devices tab
        #AAMS-3104-02 #AAMS-3159-02
        Then BankUser selects "Token Digipass 276 (China Compliant)" with Status "Enabled" and Description "Device active" in Security Devices grid
        Then check "Disable" button is disabled on Security Devices tab
        And BankUser clicks on "Edit" button on User Details page
        Then check the User Security Devices Tab elements in "View" Mode
        Then BankUser logs out
        #AAMS-3159-01
        Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search User page
        And BankUser searches Users by "User ID" with values from the "1st" API created user
        And BankUser opens the "1st" entry from search User results
        And BankUser clicks on "Edit" button on User Details page
        Then check the User Security Devices Tab elements in "Modify" Mode
        #AAMS-3159-05
        Then BankUser clicks on "Cancel" button for User Modification and clicks "No" on the confirmation
        Then BankUser clicks on "Cancel" button for User Modification and clicks "Yes" on the confirmation
