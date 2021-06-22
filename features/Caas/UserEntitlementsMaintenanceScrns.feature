@chrome @ie @COBRA @OIM @UserEntitlementsMaintenanceScrns.feature
Feature: Screen validations on Enable, Disable, and Delete User options

  @AAMS-4161 @AAMS-2225 @AAMS-2226 @AAMS-2227 @AAMS-2228 @AAMS-4141
	Scenario: COBRA UI: Modify user entitlements - add/remove/modify entitlements screen validations
		Given "Default users" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | eMatching;GCIS;Transactive Global                                                                                                                    |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne                                          |
      | entitlements    | CM01_Create (All Initiation Methods) & Reporting:All Divisions:Standard;Reporting:All Divisions:All |
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
	  And BankUser navigates to search User page
	  And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
    And Bankuser clicks Entitlements tab
    #AAMS-2225-01
    Then check Entitlements tab of User Details page in Edit mode
    #AAMS-2227-06
    Then Bankuser clicks on "Remove Entitlement" button without selecting an entitlement row and checks error message
    #AAMS-2227-01,03,04
    Then Bankuser select row "1", click Remove entitlement button, check message and click "No" on confirmation popup
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Reporting", RoleFamily as "Clearing Services" and RoleType as "System"
    And checks that Authorisation Group section "is" displayed
    #AAMS-2227-02,05
    Then Bankuser removes entitlement with role as "CM01_Create (All Initiation Methods) & Reporting"
    Then Bankuser verifies that entitlement with RoleName as "CM01_Create (All Initiation Methods) & Reporting" does not exist in entitlements grid
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Reporting", RoleFamily as "Clearing Services" and RoleType as "System"
    And checks that Authorisation Group section "is not" displayed
    #AAMS-2227-07
    Then Bankuser removes entitlement with role as "Reporting"
    Then Bankuser verifies that entitlement with RoleName as "Reporting" does not exist in entitlements grid
    Then Bankuser check that No Entitlements Selected message appears on screen
    #AAMS-2226-01
    Then BankUser clicks on "Add Entitlement" button and checks Add Entitlement dialog is displayed
    Then BankUser cancels adding entitlement then clicks on "Yes" in the confirmation dialog
    #AAMS-2226-02
    Then Bankuser adds "Cash Management" Entitlement with data:
      | role           | CM01_Create (All Initiation Methods) & Reporting |
      | division       | All Divisions                                    |
      | paymentPurpose | Standard                                         |
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    And checks that Authorisation Group section "is" displayed
    #AAMS-2228-01,02,03
    And Bankuser modifies entitlement with role as "CM01_Create (All Initiation Methods) & Reporting" to "FX Overlay" Entitlement with data:
      | role     | FX Overlay    |
      | division | All Divisions |
    Then Bankuser verifies that entitlement with RoleName as "CM01_Create (All Initiation Methods) & Reporting" does not exist in entitlements grid
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "FX Overlay", RoleFamily as "FX Overlay" and RoleType as "System"
    And checks that Authorisation Group section "is not" displayed
    #AAMS-2225#04
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "No" in the cancel modify confirmation dialog
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "FX Overlay", RoleFamily as "FX Overlay" and RoleType as "System"
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "Yes" in the cancel modify confirmation dialog
		Then check the details of the API created User displayed correctly in view User page	
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "CM01_Create (All Initiation Methods) & Reporting", RoleFamily as "Cash Management" and RoleType as "System"
    Then Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Reporting", RoleFamily as "Clearing Services" and RoleType as "System"
