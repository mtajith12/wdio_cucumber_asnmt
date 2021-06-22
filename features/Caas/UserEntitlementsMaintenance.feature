@chrome @ie @COBRA @OIM @UserEntitlementsMaintenance.feature
Feature: End to end flows of editing User entitlements

  @AAMS-4162 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add, Remove and Modify User Entitlements - New user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
    Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                                            |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu                  |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;CC01_Reporting Officer;Admin Reporting:All Divisions |
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then check Entitlements tab of User Details page in Edit mode
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role              | CM02_Create (Adhoc & from Bene/Templates) & Reporting |
      | division          | All Divisions                                         |
      | paymentPurpose    | Payroll                                               |
      | reportingAccounts | Selected                                              |
    And Bankuser modifies entitlement with role as "CC01_Reporting Officer" to "Commercial Cards" Entitlement with data:
      | role           | CC02_Authorized to Enquire |
    Then Bankuser removes entitlement with role as "CM01_Create (All Initiation Methods) & Reporting"
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "New" user
    Then check User status is "New" and workflow is "Pending Approval - Create" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User creation confirmation message, then click on "Yes" button
		Then check the Single User creation been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
    Then check the version number is "1" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User
    

  @AAMS-4163 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add, Remove and Modify User Entitlements - "Enabled" & "Approved" user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                                               |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu                     |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;CC02_Authorized to Enquire;Customer Admin:All Divisions |
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then check Entitlements tab of User Details page in Edit mode
    Then Bankuser removes entitlement with role as "Customer Admin"
    And Bankuser modifies entitlement with role as "CM01_Create (All Initiation Methods) & Reporting" to "Cash Management" Entitlement with data:
      | role           | CM03_Create (from Upload & Bene/Templates) & Reporting |
      | paymentPurpose | Payroll                                                |
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role              | CM02_Create (Adhoc & from Bene/Templates) & Reporting |
      | division          | All Divisions                                         |
      | paymentPurpose    | Payroll                                               |
      | reportingAccounts | Selected                                              |
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Enabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
		Then check the version number is "2" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User

 
  @AAMS-4164 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add, Remove and Modify User Entitlements - "Enabled" & "Pending Approval - Modified" user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                                              |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne                                                                        |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;CC03_Authorised Signatory;Customer Admin:All Divisions |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" modifies user applications of the "1st" API created user:
    			| remove  | GCIS |
    When "Implementation Manager" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then Bankuser adds "FX Overlay" Entitlement with data:
      | role     | FX Overlay    |
      | division | All Divisions |
    And Bankuser modifies entitlement with role as "CM01_Create (All Initiation Methods) & Reporting" to "Cash Management" Entitlement with data:
      | role           | CM05_Create (from Bene/Templates) & Reporting |
      | division       | All Divisions                                 |
      | paymentPurpose | Payroll                                       |
    And Bankuser modifies entitlement with role as "CC03_Authorised Signatory" to "Commercial Cards" Entitlement with data:
      | role           | CC02_Authorized to Enquire |
    Then Bankuser removes entitlement with role as "Customer Admin"
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Enabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
    Then check the version number is "2" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User


  @AAMS-4165 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add, Remove and Modify User Entitlements - "Disabled" & "Approved" user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                       |
      | securityDevices | Token Digipass 276 (China Compliant):CHINA, Chengdu     |
      | entitlements    | CC02_Authorized to Enquire;Customer Admin:All Divisions |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default users" disables the "1st" API created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then check Entitlements tab of User Details page in Edit mode
    And Bankuser modifies entitlement with role as "CC02_Authorized to Enquire" to "Commercial Cards" Entitlement with data:
      | role     | CC05_Identification Officer |
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role              | CM01_Create (All Initiation Methods) & Reporting |
      | division          | All Divisions                                    |
      | paymentPurpose    | Standard                                         |
      | reportingAccounts | Selected                                         |
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Disabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
    Then check the version number is "3" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User


  @AAMS-4166 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add, Remove and Modify User Entitlements - "Disabled" & "Pending Approval - Modified" user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                   |
      | securityDevices | Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default users" disables the "1st" API created user
    Given "Default OIM Bankuser" modifies user applications of the "1st" API created user:
    	| remove  | GCIS |
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role           | CM01_Create (All Initiation Methods) & Reporting |
      | division       | All Divisions                                    |
      | paymentPurpose | Standard                                         |
    Then Bankuser adds "Commercial Cards" Entitlement with data:
      | role           | CC02_Authorized to Enquire |
    Then Bankuser adds "Customer Administration" Entitlement with data:
      | role     | Customer Admin |
      | division | All Divisions  |
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Disabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
		Then check the version number is "3" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User


  @AAMS-4185 @AAMS-2225 @AAMS-4141
  Scenario: COBRA UI: Display entitlements tab in "View" mode to Bankuser with restricted country China when User has Entitlements with 'Selected' resources from China - Modify right
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction                | jurisdriction                             | productFamily | restrictedCountries                         |
      | Registration Officer (Pilot) | Australia,Singapore,Hong Kong,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Registration Officer         | Australia,Singapore,Hong Kong,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then Bankuser registers a restricted country "China" resource hostSystem "MDZ" and approves it
    Then BankUser logs out
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | securityDevices | Token Digipass 270:NEW ZEALAND, Wellington;Token Digipass 276 (China Compliant):INDONESIA, Jakarta                                      |
      | entitlements    | FX Overlay:FX Overlay:All Divisions:All;Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Payroll:Selected |
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
		And BankUser opens the "1st" entry from search User results
    And BankUser clicks on "Edit" button on User Details page
    Then check Entitlements tab of User Details page in Edit mode
    And BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    Then check Entitlements tab of User Details page in View mode
    And BankUser logs out


  @AAMS-4186 @AAMS-3742 @AAMS-3743 @AAMS-4141
  Scenario: COBRA UI: Disable "Edit" option for Bankuser with restricted country China when User has Entitlements with 'Selected' resources from China - Modify-limited right
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction                  | jurisdriction                             | productFamily                                                                                                                                               | restrictedCountries                         |
      | Implementation Manager         | Australia,Singapore,Hong Kong,New Zealand | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Implementation Manager (Pilot) | Australia,Singapore,Hong Kong,New Zealand |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then Bankuser registers a restricted country "China" resource hostSystem "MDZ" and approves it
    Then BankUser logs out
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | securityDevices | Token Digipass 270:NEW ZEALAND, Wellington                                                       |
      | entitlements    | Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard:Selected |
    Then check User has been created successfully
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    Then check Entitlements tab of User Details page in Edit mode
    And BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to Pending Approvals page
    Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    Then BankUser approves the "1st" entry from "Actions" menu
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    And BankUser selects the "1st" entry
    Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries
		And BankUser opens the "1st" entry from search User results
    Then check the "Edit" options are NOT displayed on User Details page
    And BankUser logs out

  @AAMS-4235 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-2231 @AAMS-2234 @AAMS-4141
	Scenario: COBRA UI: Add Custom role when editing User entitlements
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"948794AUD00001" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"924837AUD00001" and country "AU" using api and "approve"
    Given create a legal entity using api and "approve"
    Given create a Account "SYS" ""-"11-8576-0035173-03" and country "NZ" using api and "approve"
    Given create a Account "EXT" "ABNAAU2BXXX"-"5199625728" and country "AU" using api and "approve"
    Given create a resource group using api
    Given create a Role using api
    Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                                           |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role              | Customized Role |
      | paymentPurpose    | Payroll         |
      | reportingAccounts | Selected        |
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Enabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
		Then check the version number is "2" in CA for the "1st" API created User
    Then check the User entitlements in CA for the "1st" API created User
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    Then check Entitlements tab of User Details page in Edit mode
    And Bankuser modifies User's Customized "Cash Management" Entitlement role with data:
      | division          | All Divisions   |
      | paymentPurpose    | Standard        |
      | reportingAccounts | All             |
    Then BankUser clicks on "Submit" button for User Modification for the "1st" API created User, then clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then check User status is "Enabled" and workflow is "Pending Approval - Modified" in view User page
    Then check Entitlements tab of User Details page in View mode
    Then BankUser logs out
    When "Default OIM Bankuser" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
    Then check Entitlements tab of User Details page in View mode
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		Then check the Single User modification been approved successfully
    Then check Entitlements tab of User Details page in View mode
		Then BankUser logs out
		Then check the version number is "3" in CA for the "1st" API created User


