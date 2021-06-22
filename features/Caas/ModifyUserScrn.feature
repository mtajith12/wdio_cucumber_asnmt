@chrome @ie @COBRA @OIM
Feature: Modify User Screen validations

	@AAMS-3397 @AAMS-3398 @AAMS-2272-01 @AAMS-2272-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - View Pending Modified User
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check record modified/pending approval message is displayed
		Then check View Change Summary link is displayed	

	
	@AAMS-3396 @AAMS-3398 @AAMS-2822-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Submit - Errors - Remove mobile number/email for ADK user (Pending)
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
				| securityDevices | ANZ Digital Key | 
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| email | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check error message MSG022 is displayed in Security Devices tab	

	
	@AAMS-3395 @AAMS-3398 @AAMS-2822-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Submit - Errors - Remove mobile number/email for ADK user (New)
		Given "Default users" creates "1" organisations with all applications
		Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
				| securityDevices | ANZ Digital Key | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| mobileCountry | 
				| mobileNumber  | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check error message MSG022 is displayed in Security Devices tab	

	
	@AAMS-3394 @AAMS-3398 @AAMS-2253-04 @AAMS-2253-07 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Submit - Errors - Invalid Mobile Number provided for selected Country Calling Code (Leading 0s)
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| mobileCountry     | 
				| mobileNumber      | 
				| otherPhoneCountry | 
				| otherPhoneNumber  | 
		Then BankUser modifies User details data:
				| mobileCountry     | <mobileCountry>     | 
				| mobileNumber      | <mobileNumber>      | 
				| otherPhoneCountry | <otherPhoneCountry> | 
				| otherPhoneNumber  | <otherPhoneNumber>  | 
		Then check "Mobile Number" is trimmed off leading 0s and spaces

		
			Examples: 
			| mobileCountry | mobileNumber   | otherPhoneCountry | otherPhoneNumber   |
			| 61            | 00411 222 333  | 61                | 021 6675 39989     |
			| 86            | 133 6675 39989 | 64                | AB CDE FGHIJ       |
			| 86            | 133 6675 39989 | 64                | .,!@#$%&*()_-–+    |
			| 86            | 133 6675 39989 | 64                | =\\?{}[]/\"':`~\\\| |

	
	@AAMS-3393 @AAMS-3398 @AAMS-2253-04 @AAMS-2253-07 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Submit - Errors - Invalid Mobile Number provided for selected Country Calling Code
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| mobileCountry | 
				| mobileNumber  | 
		Then BankUser modifies User details data:
				| mobileCountry | <mobileCountry> | 
				| mobileNumber  | <mobileNumber>  | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check "Mobile Number" data validation error on Modify User screen
		
			Examples: 
				| mobileCountry | mobileNumber         | 
				| 61            | 267867600            | 
				| 61            | 479897779798         | 
				| 61            | 34567887             | 
				| 64            | 123456789            | 
				| 64            | 5678                 | 
				| 64            | 123456789000         | 
				| 65            | 75364533             | 
				| 65            | 8536453376567564     | 
				| 84            | 41234567890          | 
				| 62            | 123                  | 
				| 86            | 13378767655654345433 | 
				| 86            | 23301234567          | 
				| 91            | 5012345678           | 	

	
	@AAMS-3392 @AAMS-3398 @AAMS-2253-04 @AAMS-2253-05 @AAMS-2253-06 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Submit - Errors - Calling Code and Number not provided at same time
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| mobileCountry     | 
				| mobileNumber      | 
				| otherPhoneCountry | 
				| otherPhoneNumber  | 
		Then BankUser modifies User details data:
				| mobileCountry     | <mobileCountry>     | 
				| mobileNumber      | <mobileNumber>      | 
				| otherPhoneCountry | <otherPhoneCountry> | 
				| otherPhoneNumber  | <otherPhoneNumber>  | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check "Mobile Number" not provided at the same time error on Modify User screen
		Then check "Other Phone Number" not provided at the same time error on Modify User screen
		
			Examples: 
				| mobileCountry | mobileNumber | otherPhoneCountry | otherPhoneNumber | 
				| 61            |              |                   | 412345678        | 
				|               | 478886666    | 86                |                  | 	

	
	@AAMS-3391 @AAMS-3398 @AAMS-2253-03 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Submit - Errors - Mandatory fields validation
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| userId       | 
				| firstName    | 
				| surname      | 
				| dob          | 
				| address1     | 
				| suburbOrCity | 
		And BankUser clears the entered Org ID
		Then BankUser clicks on "Submit" button
		Then BankUser clicks "Yes" button
		Then check "User ID" mandatory field error on Modify User screen
		Then check "First Name" mandatory field error on Modify User screen
		Then check "Surname" mandatory field error on Modify User screen
		Then check "Date of Birth" mandatory field error on Modify User screen
		Then check "CAAS Org ID" mandatory field error on Modify User screen
		Then check "Address Line 1" mandatory field error on Modify User screen
		Then check "Suburb / City" mandatory field error on Modify User screen	

	
	@AAMS-3390 @AAMS-3398 @AAMS-2253-02 @AAMS-2253-04 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Submit - Errors - Data Validation
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| userId        | 
				| firstName     | 
				| middleName    | 
				| surName       | 
				| prefFirstName | 
				| dob           | 
				| kycId         | 
				| email         | 
		Then BankUser fills in User details data:
				| userId        | <userId>        | 
				| firstName     | <firstName>     | 
				| middleName    | <middleName>    | 
				| surName       | <surName>       | 
				| prefFirstName | <prefFirstName> | 
				| dob           | <dob>           | 
				| kycId         | <kycId>         | 
				| email         | <email>         | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check "User ID" data validation error on Modify User screen
		Then check "First Name" data validation error on Modify User screen
		Then check "Middle Name" data validation error on Modify User screen
		Then check "Surname" data validation error on Modify User screen
		Then check "Preferred First Name" data validation error on Modify User screen
		Then check "Date of Birth" data validation error on Modify User screen
		Then check "KYC ID" data validation error on Modify User screen
		Then check "Email Address" data validation error on Modify User screen
		
			Examples: 
				| userId    | firstName   | middleName | surName       | prefFirstName | dob         | kycId    | email             | 
				| abcd 1234 | Mary--Ann   | ab<123     | Smith--abcd   | ab/**/cd      | 30/02/2001  | ab--12   | abcd[12@anz.com   | 
				| Abcd1234* | Mary/**/Ann | ab 123©    | Smith<abcd    | ab©cd         | 31-02-2001  | ab/**/12 | maryBlack@anz*com | 
				| abcd#1234 | Mary<Ann    | ab<123     | Smith>abcd    | ab--cd        | 30/13/2001  | ab<12    | abc]d12@anz.com   | 
				| abcd%1234 | Mary>Ann    | ab1 > 23   | Smith--abcd   | ab<cd         | 00/02/2001  | ab>12    | "mayJune"@anz.com | 
				| abcd!1234 | Mary;Ann    | XY--123    | Smith/**/abcd | ab>cd         | 31/01/201   | ab;12    | jonhSmith@anz@com | 
				| abd1234&  | Mary--Ann   | ab12/**/3  | Smith;abcd    | abcd;         | 30/02/20001 | ab--12$  | abcd\12@anz.com   | 
				| acd12?34  | Mary<>Ann   | <ab123>    | <Smith abcd>  | ab--cd        | 02/2001     | <ab12>   | abcd12@anz'com    | 
				| abcd1;234 | Mary©Ann    | ab;123     | Smith©abcd    | <abcd>        | 31/12/1919  | ab©cd    | (abcd).12@anz$com | 	

	
	@AAMS-3386 @AAMS-3398 @AAMS-2338-01 @AAMS-2338-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select CAAS Org from CAAS Org Search Results
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser clicks on "Search CAAS Org ID" icon
		Then BankUser enters the ID of the "2nd" API created Org in Search dialog, then clicks on Search
		Then BankUser selects the "1st" item in the search results then clicks on "OK"
		Then check the "2nd" API created Org is selected and displayed correctly
		And BankUser clears the entered Org ID
		Then BankUser clicks on "Search CAAS Org ID" icon
		Then BankUser enters the ID of the "1st" API created Org in Search dialog, then clicks on Search
		Then BankUser selects the "1st" item in the search results by double clicking
		Then check the "1st" API created Org is selected and displayed correctly	

	
	@AAMS-3385 @AAMS-3398 @AAMS-2335-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select CAAS Org - Default TG Application Assignment
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
		Then check the "2nd" API created Org is selected and displayed correctly
		Then check "Transactive Global" has been assigned on Applications tab	

	
	@AAMS-3384 @AAMS-3398 @AAMS-2334-03 @AAMS-2334-05 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Select CAAS Org - no matching records
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters Org ID "abcd$1234" and hits ENTER
		Then check lookup status to be "No Results Found"
		Then BankUser clicks on "<searchIcon>" icon
		Then BankUser enters search criteria in Search dialog, then clicks on Search:
				| <searchBy> | <searchByValue1> | 
		Then check the "No Record Found" message in Search dialog
		Then BankUser dismisses Search dialog
		Then BankUser fills in User details data:
				| <searchBy> | <searchByValue2> | 
		Then BankUser clicks on "<searchIcon>" icon
		Then check the "No Record Found" message in Search dialog
		Then BankUser dismisses Search dialog
		
			Examples: 
				| entity | searchIcon         | searchBy | searchByValue1 | searchByValue2 | 
				| Org    | Search CAAS Org ID | orgId    | i?dAbcd0 123*  | abcd$1234      | 	

	
	@AAMS-3383 @AAMS-3398 @AAMS-2334-02 @AAMS-2334-04 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select CAAS Org - multiple matching records
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters Org ID "testOrg" and hits ENTER
		Then Bankuser dismisses pagination message if it pops up
		Then check more than 1 matching records are returned in the search results
		Then BankUser dismisses Search dialog
		Then BankUser clicks on "Search CAAS Org ID" icon
		Then Bankuser dismisses pagination message if it pops up
		Then check more than 1 matching records are returned in the search results	

	
	@AAMS-3382 @AAMS-3398 @AAMS-2334-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select CAAS Org - single matching record
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
		Then check the "2nd" API created Org is selected and displayed correctly	

	
	@AAMS-3381 @AAMS-3398 @AAMS-2205-05 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Modify Details - Cancel
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "No" in the cancel modify confirmation dialog
		Then check the entered User data are retained on Modify User screen
		Then BankUser clicks on "Cancel" button
		Then BankUser selects "Yes" in the cancel modify confirmation dialog
		Then check the details of the API created User displayed correctly in view User page	

	
	@AAMS-3380 @AAMS-3398 @AAMS-2205-02 @AAMS-2205-03 @AAMS-2205-04 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Modify Details - Mobile Number validations
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser selects a different Country Calling Code
		Then BankUser selects a different Other Country Calling Code
		Then BankUser fills in User details data:
				| mobileCountry | <mobileCountry> | 
				| mobileNumber  | <mobileNumber>  | 
		Then check "Mobile Number" is trimmed off leading 0s and spaces
		
			Examples: 
				| mobileCountry | mobileNumber   | 
				| 61            | 00411 222 333  | 
				| 86            | 133 6675 39989 | 	

	
	@AAMS-3379 @AAMS-3398 @AAMS-2205-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Modify Details - Validate User ID is unique
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| userId | 
		Then BankUser fills in User ID with the same value from the "2nd" API created User then tab away
		Then check "Logon ID already exists" error message	

	
	@AAMS-3367 @AAMS-3398 @AAMS-2248-01 @AAMS-2261-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Clear CAAS Org ID - New Users
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then checks Modify User screen after clearing CAAS Org ID for New user	

	
	@AAMS-3363 @AAMS-3398 @AAMS-1828-02 @AAMS-2651-02 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Display Modify User Details tab - Enabled User - Modify (Limited) right
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check modifiable fields for API created "Enabled" user and "<role>" bankuser
		
			Examples: 
				| role                         | 
				| Registration Officer (Pilot) | 
				| Implementation Manager       | 	

	
	@AAMS-3362 @AAMS-3398 @AAMS-1828-04 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Display Modify User Details tab - New User (DA Managed) - Modify right
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check modifiable fields for API created "New" user and "<role>" bankuser
		
			Examples: 
				| role                         | 
				| Registration Officer (Pilot) | 
				| Implementation Manager       | 	

	
	@AAMS-3361 @AAMS-3398 @AAMS-1828-01 @AAMS-1828-03 @AAMS-2651-01 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Display Modify User Details tab - New User - Modify right
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check modifiable fields for API created "New" user and "<role>" bankuser
		
			Examples: 
				| role                         | 
				| Registration Officer (Pilot) | 
				| Implementation Manager       | 	

	
	@AAMS-3403 @AAMS-3398 @AAMS-2253-04 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Submit - Errors - Data Validation (Invalid DOB)
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser clears data in fields:
				| dob | 
		Then BankUser modifies User details data:
				| dob | <dob> | 
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check "Date of Birth" future date error on Modify User screen
		
			Examples: 
				| dob        | 
				| Today      | 
				| Tomorrow   | 
				| 01-01-2030 | 	

	
	@AAMS-3404 @AAMS-3398 @AAMS-2261-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Errors - TG is not assigned to the selected org
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" organisations with no applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then checks Modify User screen after clearing CAAS Org ID for New user
		Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
		Then check the "2nd" API created Org is selected and displayed correctly
		Then BankUser clicks on "Submit" button
		Then BankUser clicks "Yes" button
		Then check error message MSG047 is displayed under Search CAAS Org field


	#Todo: this test is currently blocked by bug AAMS-3734
	@AAMS-3387 @AAMS-2251 @AAMS-3398 @AAMS-2251-04 @ModifyUser.feature @ignore
	Scenario: COBRA UI: Modify User - Modify Details - Submit (New User)
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "2" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		And BankUser clears Customer ID and selects "Yes" on confirmation message
		Then BankUser enters the ID of the "2nd" API created Customer and hits ENTER
		Then check the "2nd" API created Customer is selected and displayed correctly
		Then BankUser enters the ID of the "2nd" API created Org and hits ENTER
		Then check the "2nd" API created Org is selected and displayed correctly
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "New" user
		Then check the details of the User displayed correctly in view User page	


	@AAMS-3389 @AAMS-2251 @AAMS-3398 @AAMS-2251-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Modify Details - Submit - Select No
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "No" on the confirmation
		Then check the entered User data are retained on Modify User screen	

	
	@AAMS-3378 @AAMS-2332 @AAMS-3398 @AAMS-2332-01 @AAMS-2332-02 @AAMS-2336-01 @AAMS-2336-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Display Search CAAS Org/Customer Screen
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser clicks on "Search CAAS Org ID" icon
		Then check Search Org dialog default display
		Then BankUser dismisses Search dialog
		Then BankUser clicks on "Search Customer ID" icon
		Then check Search Customer dialog default display
		Then BankUser enters the ID of the "1st" API created Customer in Search dialog, then clicks on Search
		Then BankUser selects the "1st" item in the search results then clicks on "OK"
		Then check Customer is selected and displayed correctly	

	
	@AAMS-3377 @AAMS-2333 @AAMS-3398 @AAMS-2333-05 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default CAAS Org - do not default when CAAS Org was manually selected
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "2" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "1" users with the "2nd" created Org, with the "2nd" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "3rd" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters the ID of the "2nd" API created Customer and hits ENTER
		Then check the "2nd" API created Customer is selected and displayed correctly
		Then check the "1st" API created Org is selected and displayed correctly	

	
	@AAMS-3376 @AAMS-2333 @AAMS-3398 @AAMS-2333-04 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default CAAS Org - when Customer is not associated with any CAAS Orgs
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly
		Then check CAAS Org is NOT defaulted to any value	

	
	@AAMS-3375 @AAMS-2333 @AAMS-3398 @AAMS-2333-03 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default CAAS Org - when Customer is associated with multiple CAAS orgs with the same number of users
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "2" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "2" users with the "2nd" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "5th" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly
		Then check CAAS Org is defaulted to the 1st created Org in alphabetic ascending order and displayed correctly	

	
	@AAMS-3374 @AAMS-2333 @AAMS-3398 @AAMS-2333-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default CAAS Org - when Customer is associated with multiple CAAS Orgs
		Given "Default users" creates "2" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "2" users with the "2nd" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "4th" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "2nd" API created Org is selected and displayed correctly	

	
	@AAMS-3373 @AAMS-2333 @AAMS-3398 @AAMS-2333-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default CAAS Org - when Customer is associated with one CAAS Org
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "2nd" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears the entered Org ID
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Org is selected and displayed correctly	

	
	@AAMS-3372 @AAMS-2260 @AAMS-3398 @AAMS-2260-01 @AAMS-2260-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - Default TG Application Assignment
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly
		Then check "Transactive Global" has been assigned on Applications tab
		And check "Transactive Global" cannot be removed after assigning Customer ID	

	
	@AAMS-3371 @AAMS-2258 @AAMS-3398 @AAMS-2258-03 @AAMS-2258-05 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Select Customer - no matching records
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters Customer ID "abcd$1234" and hits ENTER
		Then check lookup status to be "No Results Found"
		Then BankUser clicks on "<searchIcon>" icon
		Then BankUser enters search criteria in Search dialog, then clicks on Search:
				| <searchBy> | <searchByValue1> | 
		Then check the "No Record Found" message in Search dialog
		Then BankUser dismisses Search dialog
		Then BankUser fills in User details data:
				| <searchBy> | <searchByValue2> | 
		Then BankUser clicks on "<searchIcon>" icon
		Then check the "No Record Found" message in Search dialog
		Then BankUser dismisses Search dialog
		
			Examples: 
				| entity   | searchIcon         | searchBy   | searchByValue1       | searchByValue2 | 
				| Customer | Search Customer ID | customerId | aaaaabbbbb1111122222 | i&dAbcd0123*   | 	

	
	@AAMS-3370 @AAMS-2258 @AAMS-3398 @AAMS-2258-02 @AAMS-2258-04 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - multiple matching records
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters Customer ID "testCust" and hits ENTER
		Then Bankuser dismisses pagination message if it pops up
		Then check more than 1 matching records are returned in the search results
		Then BankUser dismisses Search dialog
		Then BankUser clicks on "Search Customer ID" icon
		Then Bankuser dismisses pagination message if it pops up
		Then check more than 1 matching records are returned in the search results	

	
	@AAMS-3369 @AAMS-3136 @AAMS-3398 @AAMS-3136-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - show Entitlements tab
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then check Entitlements tab is not displayed
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly
		Then check Entitlements tab is displayed
		Then check Entitlements grid does not contain pre-populated Entitlements	

	
	@AAMS-3368 @AAMS-2258 @AAMS-3398 @AAMS-2258-01 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Select Customer - single matching record
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly	
	

	#Todo: this test is currently blocked by bug AAMS-3734
	@AAMS-3579 @AAMS-2723-01 @ModifyUserScrn.feature @ignore
	Scenario: COBRA UI: Modify User - Submit User Modifications - User.DA Modifiable to remain TRUE when modifiying Customer ID only
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		Then check User.DA Modifiable has been set to TRUE
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
		Then check the "1st" API created Customer is selected and displayed correctly	
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then check User.DA Modifiable has been set to TRUE


	
	@AAMS-3366 @AAMS-2250 @AAMS-3398 @AAMS-2250-01 @AAMS-2250-03 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Clear Customer ID - Existing User (Enabled)
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | Transactive Global | 
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears Customer ID and selects "Yes" on confirmation message
		Then checks Modify User screen after clearing Customer ID for "Existing" user	

	
	@AAMS-3365 @AAMS-2250 @AAMS-3398 @AAMS-2250-01 @AAMS-2250-03 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Clear Customer ID - New User
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears Customer ID and selects "Yes" on confirmation message
		Then checks Modify User screen after clearing Customer ID for "New" user	

	
	@AAMS-3364 @AAMS-2250 @AAMS-3398 @AAMS-2250-01 @AAMS-2250-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Clear Customer ID - User does not confirm
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" Customers with all products and jurisdictions
		Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
				| applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global | 
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks on "Edit" button on User Details page
		And BankUser clears Customer ID and selects "No" on confirmation message
		Then checks user details are not modified	

	
	@AAMS-3360 @AAMS-1806 @AAMS-3398 @AAMS-1806-02 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Hide Edit option on View User screen
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check that Edit button "is not" present on View CAAS User page
		
			Examples: 
				| role                     | 
				| Helpdesk Officer (Pilot) | 	

	
	@AAMS-3359 @AAMS-1806 @AAMS-3398 @AAMS-1806-01 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Enable Edit option on View User screen
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check that Edit button "is" present on View CAAS User page
		
			Examples: 
				| role                         | 
				| Registration Officer (Pilot) | 
				| Implementation Manager       | 	

	
	@AAMS-3358 @AAMS-1805 @AAMS-3398 @AAMS-1805-06 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Hide Edit option on User Summary Grid - Multiple Users selected
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "2" users with the "1st" created Org
		When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		And BankUser selects the "1st" and "2nd" entries
		Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries

	
	@AAMS-3357 @AAMS-1805 @AAMS-3398 @AAMS-1805-05 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Verify that Edit option is not displayed for user where source system is not COBRA
		Given create a CAASUSER using CAAS api
		Then create a customer using api
		Then register a CAAS User using api
		When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches the UI created User by "User ID"
		And BankUser selects the "1st" entry
		Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries

	
	@AAMS-3356 @AAMS-1805 @AAMS-3398 @AAMS-1805-02 @ModifyUserScrn.feature
	Scenario: COBRA UI: Modify User - Hide Edit option on User Summary Grid
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser selects the "1st" entry
		Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries

	
	@AAMS-3355 @AAMS-1805 @AAMS-3398 @AAMS-1805-01 @ModifyUserScrn.feature
	Scenario Outline: COBRA UI: Modify User - Enable Edit option on User Summary Grid
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates "1" users with the "1st" created Org
		When "<role>" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser selects the "1st" entry
		Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
		Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
		
			Examples: 
				| role                         | 
				| Registration Officer (Pilot) | 
				| Implementation Manager       | 
