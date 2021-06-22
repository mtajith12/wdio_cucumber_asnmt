@chrome @ie @COBRA @OIM @AssociateCustomerWithUser.feature
Feature: Customer Assignment And Maintenance 
	As a Bank User
	BankUser want to be able to associate Customer to User

  @AAMS-2915 @AAMS-2840 
	Scenario: COBRA UI: Default CAAS Org - when Customer is associated with one CAAS Org, and manually select Org
		Given "Default OIM Bankuser" creates "2" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
      |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu | 
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    # AAMS-1728#01
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser clears the entered Customer ID
    # AAMS-1728#05
    Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
    Then check the "2nd" API created Org is selected and displayed correctly
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "2nd" API created Org is selected and displayed correctly
    Then BankUser logs out

  @AAMS-4485 @AAMS-2840 @BR-UM-027
	Scenario: COBRA UI: Default CAAS Org - when Customer is associated with multiple CAAS Orgs - "Disabled" User 
		Given "Default OIM Bankuser" creates "2" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      |applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global               |
      |securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu | 
    Given "Default OIM Bankuser" creates "1" users with the "2nd" created Org, with the "1st" created Customer, and with:
      | applications    | eMatching;Transactive Global                                                                                |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default users" approves the "1st" created user
    Given "Default users" disables the "1st" API created user
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    # AAMS-1728#01
    Then check the "2nd" API created Org is selected and displayed correctly
    Then BankUser clears the entered Customer ID
    # AAMS-1728#05
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser logs out

  @AAMS-2916 @AAMS-2840 @BR-UM-027
	Scenario: COBRA UI: Default CAAS Org - when Customer is associated with multiple CAAS Orgs - "Deleted" User 
		Given "Default OIM Bankuser" creates "2" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "2" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Transactive Global                                                           |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne;Token Digipass 276 (China Compliant):CHINA, Chengdu |
    Given "Default OIM Bankuser" creates "2" users with the "2nd" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global |
      | securityDevices | ANZ Digital Key                                                                               |
    Given "Default users" approves the "1st" created user
    Given "Default users" approves the "2nd" created user
    Given "Default users" deletes the "2nd" API created user
    Given "Default OIM Bankuser" approves the "2nd" created user
    Given "Default users" approves the "3rd" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    # AAMS-1728#02
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    Then check the "2nd" API created Org is selected and displayed correctly
    Then BankUser logs out

  @AAMS-2917 @AAMS-2840 @BR-UM-027
  Scenario: COBRA UI: Default CAAS Org - when Customer is associated with multiple CAAS Orgs that have the same number of Users
		Given "Default OIM Bankuser" creates "2" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | Institutional Insights;Internet Enquiry Access;Transactive Global |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                           |
    Given "Default OIM Bankuser" creates "3" users with the "2nd" created Org, with the "1st" created Customer, and with:
      | applications    | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global |
      | securityDevices | ANZ Digital Key;Token Digipass 276 (China Compliant):CHINA, Chengdu                           |
    Given "Default users" approves the "1st" created user
    Given "Default users" approves the "3rd" created user
    Given "Default users" disables the "3rd" API created user
    Given "Default users" approves the "4th" created user
    Given "Default users" deletes the "4th" API created user
    Given "Default OIM Bankuser" approves the "4th" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    # AAMS-1728#03
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    Then check CAAS Org is defaulted to the 1st created Org in alphabetic ascending order and displayed correctly
    Then BankUser logs out

  @AAMS-2918 @AAMS-2840 
	Scenario: COBRA UI: Default CAAS Org - when Customer is not associated with any CAAS Orgs
		Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    # AAMS-1728#04
    Then check CAAS Org is NOT defaulted to any value 
    Then BankUser logs out

  @AAMS-2919 @AAMS-2840
  Scenario: COBRA UI: Default CAAS Org - default TG assignment
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications    | Institutional Insights;Internet Enquiry Access;Transactive Global |
      | securityDevices | Token Digipass 270:AUSTRALIA, Melbourne                           |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in randomised General details data
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser enters randomised address then clicks on "Ok" button
    Then BankUser fills in User details data:
      | mobileCountry | 61        |
      | mobileNumber  | 401980652 |
    Then BankUser clicks on "Continue" button
    # AAMS-1731#01,02, AAMS-2255
    Then check "Transactive Global" has been assigned on Add Application page by default
    Then check "Remove" button is "Disabled" for "Transactive Global" application
    Then BankUser adds "LM" application to user
    Then BankUser enters "iSeriesUserID" as "UID" and "userRegion" as "NSW, ACT" to add "EsandaNet" and clicks OK
    And BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    And Bankuser adds "Loan" Entitlement with data:
      |role      | Loan Reporting |
      |division  | All Divisions  |
    And Bankuser verifies entitlement with DivisionID as "All Divisions", DivisionName as "All Divisions", RoleName as "Loan Reporting", RoleFamily as "Loans" and RoleType as "System"
    Then BankUser clicks on "Back" button
    Then BankUser clicks on "Back" button
    Then BankUser clicks on "Back" button
    # AAMS-1733
    Then BankUser clears the entered Customer ID
    Then check Customer and CAAS Org info are all cleared
    Then check the entered address is cleared and Address dropdown disabled
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser enters randomised address then clicks on "Ok" button
    Then BankUser fills in User details data:
      | mobileCountry | 61        |
      | mobileNumber  | 401980652 |
    Then BankUser clicks on "Continue" button
    Then check "Transactive Global" has been assigned on Add Application page by default
    Then check the previously added applications have been cleared
    And BankUser moves from Applications page to Security Devices page
    And BankUser moves from Security Devices page to Assign Entitlements page
    Then Bankuser check that No Entitlements Selected message appears on screen
    Then BankUser logs out

  @AAMS-2920 @AAMS-2840 
  Scenario: COBRA UI: Default CAAS Org - TG is not assigned to the selected CAAS Org
    Given "Default OIM Bankuser" creates "1" organisations with no applications
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
		Given "Default OIM Bankuser" logins in to COBRA using a valid password
		When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check the "1st" API created Org is selected and displayed correctly
    Then BankUser clicks on "Continue" button
    # AAMS-1736#01
    Then check error message MSG047 is displayed under Search CAAS Org field 
    Then BankUser logs out