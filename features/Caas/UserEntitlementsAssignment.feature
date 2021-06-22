@chrome @ie @COBRA @OIM @UserEntitlementsAssignment.feature
Feature: To test as a bankuser we are able to verify user
  As a Bank User
  I want to be able to assign entitlements to users

  @AAMS-3340 @AAMs-2209-01-02-03 @AAMS-2212 @2213-01
  Scenario: COBRA UI: Assign User Entitlements - verify that multiple Entitlements can be added to user
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And BankUser verifies the elements on User Entitlement page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    And Bankuser adds "Clearing Services" Entitlement with data:
        |role      | Reporting & Enquiries |
        |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Reporting & Enquiries", RoleFamily as "Clearing Services" and RoleType as "System"
    And Bankuser adds "FX Overlay" Entitlement with data:
        |role      | FX Overlay |
        |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "FX Overlay", RoleFamily as "FX Overlay" and RoleType as "System"
    And checks that Authorisation Group section "is not" displayed
    And Bankuser adds "Cash Management" Entitlement with data:
        |role           | CM03_Create (from Upload & Bene/Templates) & Reporting |
        |division       | All Divisions  |
        |paymentPurpose| Standard       |
    And checks that Authorisation Group section "is" displayed
    And BankUser moves from Assign Entitlements page to User Notifications page
    And BankUser clicks on "Submit" button
    Then check User has been created successfully

  @AAMS-3341 @AUAM-2209-01-04   @AAMS-2214-02 @AAMS-2220
  Scenario: COBRA UI: Assign User Entitlements - verify user can replicate entitlements from existing user
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | applications    | EsandaNet                                                                                                                                                                            |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                                                                                                                                              |
      | entitlements    | Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Cash Management:CM03_Create (from Upload & Bene/Templates) & Reporting:All Divisions:Payroll |
    Then check User has been created successfully
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
    Then BankUser navigates to Onboarding page
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser replicates entitlements from existing user
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM03_Create (from Upload & Bene/Templates) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser clears userID
    Then Bankuser check that No Entitlements Selected message appears on screen
    Then Bankuser select entitlement to replicate and click Cancel button on Search User Dialog
    Then Bankuser check that No Entitlements Selected message appears on screen
    And Bankuser replicates entitlements from existing user
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM03_Create (from Upload & Bene/Templates) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And BankUser moves from Assign Entitlements page to User Notifications page
    And BankUser clicks on "Submit" button
    Then check User has been created successfully


    @AAMS-3342 @AAMS-2215
  Scenario: COBRA UI: Assign User Entitlements - verify user can not replicate entitlements from unapproved user user
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | applications    | EsandaNet                                                                                                                                                                            |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                                                                                                                                              |
      | entitlements    | Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Cash Management:CM03_Create (from Upload & Bene/Templates) & Reporting:All Divisions:Payroll |
    Then check User has been created successfully
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to Onboarding page
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser verifies that no existing user is available to replicate entitlements

      @AAMS-3343 @AAMS-2220
    Scenario: COBRA UI: Assign User Entitlements - verify user with assigned entitlements in IDM
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | applications    | EsandaNet                                                                                                                                                                            |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                                                                                                                                              |
      | entitlements    | Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Cash Management:CM03_Create (from Upload & Bene/Templates) & Reporting:All Divisions:Payroll |
    Then check User has been created successfully
      Then BankUser logs out
      Given "Default users" logins in to COBRA using a valid password
      Then BankUser navigates to search User page
      Then BankUser searches the UI created User by "User ID"
      Then BankUser selects the "1st" entry
      Then BankUser opens the "1st" entry from search User results
      Then BankUser clicks on "Approve" button on the User details page
      Then check Approve Single User creation confirmation message, then click on "Yes" button
      Then check the Single User creation been approved successfully
      Then BankUser logs out
      Then check the UI created User exists in LDS under the "1st" API created Org
      Then check the UI created User is linked under the assigned Applications with correct attribute values
      Then check the Security Devices of the UI created User are in "Provisioning/Pending" status from IDM Linked View

  @AAMS-3344 @AUAM-2209-05
  Scenario:COBRA UI: Assign User Entitlements - - Verify the Cancel button functionality
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And BankUser verifies the elements on User Entitlement page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    # Then BankUser clicks on Cancel button and selects "No" in the cancel creation confirmation dialog on Assign Entitlements page
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "No" in the cancel creation confirmation dialog
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    # Then BankUser clicks on Cancel button and selects "Yes" in the cancel creation confirmation dialog on Assign Entitlements page
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "Yes" in the cancel creation confirmation dialog
    Then check "New User" tile does exist in the onboarding page

    @AAMS-3345 @AUAM-2211-01-02
  Scenario: COBRA UI: Assign User Entitlements - verify that Entitlement data is retained on screen when user goes back to Security device assignment screen and comes back on Assign Entitlement screen
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    Then BankUser adds Security Device "Token Digipass 270" with Location "AUSTRALIA, Melbourne"
    And check new Security Device "Token Digipass 270" has been added in Selected Devices grid correctly
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    Then BankUser clicks on "Back" button
    And check new Security Device "Token Digipass 270" has been added in Selected Devices grid correctly
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"


  @AAMS-3346 @AAMS-2214-01-02-03
  Scenario: COBRA UI: Assign User Entitlements - verify Remove Entitlements functionality
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    And Bankuser adds "Cash Management" Entitlement with data:
       |role           | CM01_Create (All Initiation Methods) & Reporting |
       |division       | All Divisions  |
       |paymentPurpose| Standard       |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    Then Bankuser select row "1", click Remove entitlement button, check message and click "No" on confirmation popup
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    Then Bankuser selects first 2 entitlements and remove them
    Then Bankuser check that No Entitlements Selected message appears on screen

    @AAMS-3347 @AAMS-2216 @AAMS-2217
  Scenario: COBRA UI: Assign User Entitlements - verify Modify Entitlements functionality
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser adds "FX Overlay" Entitlement with data:
      |role      | FX Overlay |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "FX Overlay", RoleFamily as "FX Overlay" and RoleType as "System"
    And Bankuser adds "Cash Management" Entitlement with data:
      |role           | CM01_Create (All Initiation Methods) & Reporting |
      |division       | All Divisions                                    |
      |paymentPurpose| Payroll                                          |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser adds "Cash Management" Entitlement with data:
      |role           | All Entitlements |
      |division       | All Divisions    |
      |paymentPurpose| Payroll          |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "All Entitlements", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser modifies entitlement with role as "CM01_Create (All Initiation Methods) & Reporting" to "CashManagement" Entitlement with data:
      |role           | CM03_Create (from Upload & Bene/Templates) & Reporting |
      |division       | All Divisions  |
      |paymentPurpose| Standard       |
    And Bankuser modifies entitlement with role as "FX Overlay" to "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser modifies entitlement with role as "All Entitlements" to "CashManagement" Entitlement with data:
      |role           | All Entitlements |
      |division       | All Divisions    |
      |paymentPurpose| Standard         |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "All Entitlements", RoleFamily as "Cash Management" and RoleType as "System"
    And BankUser moves from Assign Entitlements page to User Notifications page
    And BankUser clicks on "Submit" button
    Then check User has been created successfully
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And Bankuser clicks Entitlements tab
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "All Entitlements", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM03_Create (from Upload & Bene/Templates) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser verifies that entitlement with RoleName as "CM01_Create (All Initiation Methods) & Reporting" does not exist in entitlements grid
    And Bankuser verifies that entitlement with RoleName as "FX Overlay" does not exist in entitlements grid

    @AAMS-3348 @AAMS-2223-01-03
    Scenario: COBRA UI: Assign User Entitlements - verify the display of entitlements on View User screen
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    And Bankuser adds "Cash Management" Entitlement with data:
       |role           | CM01_Create (All Initiation Methods) & Reporting |
       |division       | All Divisions  |
       |paymentPurpose| Standard       |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    Then Bankuser select "B" in Authorisation Group dropdown
    And Bankuser completes the user creation
    Then check User has been created successfully
    And BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And Bankuser clicks Entitlements tab
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And checks that Authorisation Group section on View User screen "is" displayed
    And Bankuser checks the value in Authorisation Group is "B"
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"

    @AAMS-3349 @AAMS-3082
  Scenario: COBRA UI: Assign User Entitlements - verify that Entitlements does not display on View User screen when customer is not assigned to user
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    When "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from search User results
    And Bankuser verifies that Entitlements tab does not exist


  @AAMS-3350  @AAMS-2223-02
  Scenario: COBRA UI: Assign User Entitlements - verify the message on View User page when no entitlement is added
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default users" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from search User results
    And Bankuser clicks Entitlements tab
    Then Bankuser check that No Entitlements Selected message appears on screen

  @AAMS-3351 @AAMS-2215
  Scenario: COBRA UI: Assign User Entitlements - Assign entitlements to a CAAS user
    Given  create a CAASUSER using CAAS api
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    And BankUser enters Customer created from UI and hits ENTER
    Then BankUser fills user data with the created Org without a Customer, then moves to Add Application page
    Then BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser replicates entitlements from existing user
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "All Entitlements", RoleFamily as "Cash Management" and RoleType as "System"
    And Bankuser completes the user creation

  @AAMS-3414 @AAMS-2215
  Scenario: COBRA UI: Assign User Entitlements - verify user can replicate entitlements from existing user with Enabled'/'Pending Approval - Modified'
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org, with the created Customer, and with:
      | applications    | EsandaNet                                                                                                                                                                            |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                                                                                                                                              |
      | entitlements    | Cash Management:CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Cash Management:CM03_Create (from Upload & Bene/Templates) & Reporting:All Divisions:Payroll |
    Then check User has been created successfully
    Then BankUser logs out
    Then  "Default users" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches the UI created User by "User ID"
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    Then BankUser clicks on "Approve" button on the User details page
    Then check Approve Single User creation confirmation message, then click on "Yes" button
    Then check the Single User creation been approved successfully
     Then BankUser logs out
     When "Registration Officer (Pilot)" logins in to COBRA using a valid password
     And BankUser navigates to search User page
     Then BankUser searches the UI created User by "User ID"
     And BankUser selects the "1st" entry
     And BankUser opens the "1st" entry from search User results
     And BankUser clicks on "Edit" button on User Details page
     Then BankUser clears data in fields:
       | mobileCountry     |
       | mobileNumber      |
     Then BankUser modifies User details data:
       | mobileCountry     | 61     |
       | mobileNumber      | 451158097     |
     Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
     Then BankUser logs out
     Then "Default users" logins in to COBRA using a valid password
     Then BankUser navigates to Onboarding page
     When BankUser navigates to "New User" page
     Then BankUser fills user data with the created Org with a Customer, then moves to Add Application page
     Then BankUser moves from Applications page to Security Devices page
     And BankUser moves from Security Devices page to Assign Entitlements page
     And Bankuser replicates entitlements from existing user
     And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
     And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM03_Create (from Upload & Bene/Templates) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
      And BankUser moves from Assign Entitlements page to User Notifications page
    And BankUser clicks on "Submit" button
    Then check User has been created successfully

