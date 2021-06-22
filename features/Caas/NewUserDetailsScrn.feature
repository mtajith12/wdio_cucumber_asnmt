@chrome @ie @COBRA @OIM @NewUserDetailsScrn.feature
Feature: CAAS New User screen validations
  As a Bank User
  BankUser want to be able to view and operate on the New User pages

  @AAMS-1422 @AAMS-1469 @AAMS-2840
  Scenario: COBRA UI: Create User screen validations - default display
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New User" tile does exist in the onboarding page
    When BankUser navigates to "New User" page
    # AAMS-7#01, AAMS-2792
    Then check Create User page 1 default display
    # AAMS-434#01
    Then BankUser clicks on "Search CAAS Org ID" icon
    Then check Search Org dialog default display
    Then BankUser dismisses Search dialog
    # AAMS-1727#01
    Then BankUser clicks on "Search Customer ID" icon
    Then check Search Customer dialog default display
    Then BankUser dismisses Search dialog

  @AAMS-1423 @AAMS-1469
  Scenario: COBRA UI: Create User screen validations - cancel entering user data
  	Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-434#02
    Then BankUser clicks on "Search CAAS Org ID" icon
    Then BankUser enters the "1st" API created Org as search criteria in Search Dialog, then clicks on Search
    Then BankUser selects the "1st" item in the search results then clicks on "Cancel"
    Then check the canceled org selection is discarded
    Then BankUser fills in randomised user data with the "1st" API created Org
    # AAMS-7#07
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "No" in the cancel creation confirmation dialog
    Then check the entered User data are retained
    Then BankUser clicks on "Cancel" button
    Then BankUser selects "Yes" in the cancel creation confirmation dialog
    Then check "New User" tile does exist in the onboarding page

  @AAMS-1424 @AAMS-1469 
  Scenario: COBRA UI: Create User data validation - mandatory field check
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#02
    And BankUser clicks on "Continue" button
    Then check "User ID" mandatory field error on Create User screen
    Then check "First Name" mandatory field error on Create User screen
    Then check "Surname" mandatory field error on Create User screen
    Then check "Date of Birth" mandatory field error on Create User screen
    Then check "CAAS Org ID" mandatory field error on Create User screen
    Then check "Address" mandatory field error on Create User screen

  @AAMS-1425 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - not allowed special characters
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User details data:
      | userId            | <userId>            |
      | firstName         | <firstName>         |
      | middleName        | <middleName>        |
      | surName           | <surName>           |
      | prefFirstName     | <prefFirstName>     |
      | dob               | <dob>               |
      | kycId             | <kycId>             |
      | email             | <email>             |
    Then BankUser clicks on "Continue" button
    # AAMS-357#01, 03
    Then check "User ID" data validation error on Create User screen
    Then check "First Name" data validation error on Create User screen
    Then check "Middle Name" data validation error on Create User screen
    Then check "Surname" data validation error on Create User screen
    Then check "Preferred First Name" data validation error on Create User screen
    Then check "Date of Birth" data validation error on Create User screen
    Then check "KYC ID" data validation error on Create User screen
    Then check "Email Address" data validation error on Create User screen
    Then take screenshot "new-user-page-not-allowed-special-chars"
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

  @AAMS-1675 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - some fields passed validation some not
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User details data:
      | userId            | <userId>            |
      | firstName         | <firstName>         |
      | middleName        | <middleName>        |
      | surName           | <surName>           |
      | prefFirstName     | <prefFirstName>     |
      | dob               | <dob>               |
      | kycId             | <kycId>             |
      | email             | <email>             |
    Then BankUser clicks on "Continue" button
    # AAMS-357#01,03
    Then check "User ID" <userIdAccepted> by data validation on Create User screen
    Then check "First Name" <firstNameAccepted> by data validation on Create User screen
    Then check "Middle Name" <middleNameAccepted> by data validation on Create User screen
    Then check "Surname" <surNameAccepted> by data validation on Create User screen
    Then check "Preferred First Name" <prefFirstNameAccepted> by data validation on Create User screen
    Then check "Date of Birth" <dobAccepted> by data validation on Create User screen
    Then check "KYC ID" <kycIdAccepted> by data validation on Create User screen
    Then check "Email Address" <emailAccepted> by data validation on Create User screen
    Then take screenshot "new-user-page-data-validation-partial"
    Examples:
      | 龍行天下     | Not Accepted   | Mary Ann  | Accepted           | Đặng       | Accepted           | 武          | Accepted         | ab©cd         | Not Accepted         | 1-01-1980   | Not Accepted | Abc012 | Accepted      | maryBlack@anz*com | Not Accepted  |

  @AAMS-1426 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - DoB is not past date
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User details data:
      | dob | <dob> |
    Then BankUser clicks on "Continue" button
    # AAMS-357#03 #AAMS-1813
    Then check "Date of Birth" future date error on Create User screen
    Examples:
      | dob        |
      | Today      |
      | Tomorrow   |
      | 01-01-2030 |

  @AAMS-1427 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - Mobile phone country prefix and number
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#06
    Then check most commonly used country calling codes list in "Mobile Number" country dropdown
    Then BankUser fills in User details data:
      | mobileCountry     | <mobileCountry>     |
      | mobileNumber      | <mobileNumber>      |
    Then BankUser clicks on "Continue" button
    Then check "Mobile Number" data validation error on Create User screen
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

  @AAMS-1428 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - Leading 0s and spaces in phone numbers are trimmed
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User details data:
      | mobileCountry     | <mobileCountry>     |
      | mobileNumber      | <mobileNumber>      |
      | otherPhoneCountry | <otherPhoneCountry> |
      | otherPhoneNumber  | <otherPhoneNumber>  |
    Then BankUser clicks on "Continue" button
    # AAMS-7#04,05,06
    Then check "Mobile Number" is trimmed off leading 0s and spaces
    Examples: 
      | mobileCountry | mobileNumber   | otherPhoneCountry | otherPhoneNumber   |
			| 61            | 00411 222 333  | 61                | 03 787 77897       | 
			| 86            | 133 6675 39989 | 64                | AB CDE FGHIJ       | 	
			| 86            | 133 6675 39989 | 64                | .,!@#$%&*()_-–+    | 
  		| 86            | 133 6675 39989 | 64                | =\\?{}[]/\"':`~\\\| |

  @AAMS-1429 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - Other phone country and number length > 15
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#06
    Then check most commonly used country calling codes list in "Other Phone Number" country dropdown
    Then BankUser fills in User details data:
      | otherPhoneCountry     | <otherPhoneCountry>     |
      | otherPhoneNumber      | <otherPhoneNumber>      |
    Then BankUser clicks on "Continue" button
    Then check "Other Phone Number" data validation error on Create User screen
    Examples: 
      | otherPhoneCountry | otherPhoneNumber     |
      | 61                | 1234567890123451     |
      | 86                | 5836757645645431     |

  @AAMS-1430 @AAMS-1469
  Scenario Outline: COBRA UI: Create User data validation - Country and Mobile/Phone Number not provided at the same time
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#04,05
    Then BankUser fills in User details data:
      | mobileCountry     | <mobileCountry>     |
      | mobileNumber      | <mobileNumber>      |
      | otherPhoneCountry | <otherPhoneCountry> |
      | otherPhoneNumber  | <otherPhoneNumber>  |
    Then BankUser clicks on "Continue" button
    Then check "Mobile Number" not provided at the same time error on Create User screen
    Then check "Other Phone Number" not provided at the same time error on Create User screen
    Examples: 
      | mobileCountry | mobileNumber | otherPhoneCountry | otherPhoneNumber |
      | 61            |              |                   | ABC 6675 39989   |
      |               | 478886666    | 86                |                  |

  @AAMS-1431 @AAMS-1469
  Scenario: COBRA UI: Create User - select Org using Enter, single matching record
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-299#01
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check Org is selected and displayed correctly

  @AAMS-2921 @AAMS-2840 
  Scenario: COBRA UI: Create User  - select Customer using Enter, single matching record
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-1725#01, AAMS-1727#02
    Then BankUser enters the ID of the "1st" API created Customer and hits ENTER
    Then check the "1st" API created Customer is selected and displayed correctly

  @AAMS-1433 @AAMS-1469 @AAMS-2840
  Scenario Outline: COBRA UI: Create User - select Org/Customer using Enter, multiple matching records
    Given "Default OIM Bankuser" creates "2" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-299#02, AAMS-1725#02, AAMS-1727#02
    Then BankUser enters <entity> ID "<searchByValue>" and hits ENTER
    Then Bankuser dismisses pagination message if it pops up
    Then check <entity> Id search criteria set to "<searchByValue>"
    Then check more than 1 matching records are returned in the search results
    Then BankUser selects the "1st" item in the search results then clicks on "OK"
    Then check <entity> is selected and displayed correctly
    Examples:
      | entity   | searchByValue |
      | Org      | testorg     |
      | Customer | testCust      |

  @AAMS-1528 @AAMS-1469 @AAMS-2840
  Scenario Outline: COBRA UI: Create User - search Org/Customer dialog, blank search
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-435#05, AAMS-1727#02
    Then BankUser clicks on "<searchIcon>" icon then clicks on search
    Then Bankuser dismisses pagination message if it pops up
    Then check more than 1 matching records are returned in the search results
    Then BankUser selects the "1st" item in the search results then clicks on "OK"
    Then check <entity> is selected and displayed correctly
    Examples:
      | entity   | searchIcon         |
      | Org      | Search CAAS Org ID |
      | Customer | Search Customer ID |

  @AAMS-1434 @AAMS-1469 @AAMS-2840
  Scenario Outline: COBRA UI: Create User - search Org/Customer, no matching records
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-299#03, AAMS-1725#03
    Then BankUser enters <entity> ID "abcd$1234" and hits ENTER
    Then check lookup status to be "No Results Found"
    # AAMS-436#02, AAMS-1725#05
    Then BankUser clicks on "<searchIcon>" icon
    Then BankUser enters search criteria in Search dialog, then clicks on Search:
      | <searchBy> | <searchByValue1> |
    Then check the "No Record Found" message in Search dialog
    Then BankUser dismisses Search dialog
    # AAMS-447#02, AAMS-1725#05
    Then BankUser fills in User details data:
      | <searchBy> | <searchByValue2> |
    Then BankUser clicks on "<searchIcon>" icon
    Then check the "No Record Found" message in Search dialog
    Then BankUser dismisses Search dialog
    # AAMS-357#02,07
    Then BankUser clicks on "Continue" button
    Then check "CAAS Org ID" mandatory field error on Create User screen
    Examples:
      | entity   | searchIcon         | searchBy   | searchByValue1       | searchByValue2 |
      | Org      | Search CAAS Org ID | orgId      | i?dAbcd0 123*        | abcd$1234      |
      | Customer | Search Customer ID | customerId | aaaaabbbbb1111122222 | i&dAbcd0123*   |

  @AAMS-1435 @AAMS-1469
  Scenario: COBRA UI: Create User - search Org dialog, trim leading/trailing spaces, "and" and "contains" logic
  	Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search CAAS Org ID" icon
    Then BankUser enters the "1st" API created Org as search criteria in Search Dialog, with leading / trailing spaces, then clicks on Search 
    # AAMS-435#01, AAMS-447#01
    Then check the leading / trailing spaces have been trimmed in the entered criterias
    Then check no leading / trailing spaces in the Search result
    Then check the Search Org results display
    # AAMS-435#02,03,06, AAMS-436#01
    Then check the Search Org result meets "and" and "contains" logic on all criterias
    # AAMS-437#01
    Then BankUser selects the "1st" item in the search results then clicks on "OK"
    Then check Org is selected and displayed correctly

  @AAMS-2922 @AAMS-2840 
  Scenario: COBRA UI: Create User - search Customer dialog, multiple criterias, trim leading/trailing spaces, "and" and "contains" logic
    Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search Customer ID" icon
    Then BankUser enters the "1st" API created Customer as search criteria in Search Dialog, with leading / trailing spaces, then clicks on Search 
    # AAMS-1725#04, AAMS-1727#02
    Then check the leading / trailing spaces have been trimmed in the entered criterias
    Then check no leading / trailing spaces in the Search result
    Then check the Search Org results display
    Then check the Search Customer result meets "and" and "contains" logic on all criterias
    Then BankUser selects the "1st" item in the search results then clicks on "OK"
    Then check Customer is selected and displayed correctly

  @AAMS-1436 @AAMS-1469
  Scenario: COBRA UI: Create User - search Org dialog, comma seperated criteria
    Given "Default users" creates "2" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search CAAS Org ID" icon
    # AAMS-447#01
    Then BankUser searches Org with comma separated IDs from the API created entities as search criteria
    # AAMS-435#04, AAMS-435#06, AAMS-436#01
    Then check the Search Org result meets "or" logic on entered comma separated IDs
    # AAMS-437#02
    Then BankUser selects the "1st" item in the search results by double clicking
    Then check Org is selected and displayed correctly
    # AAMS-438#01
    Then BankUser clears the entered Org ID

  @AAMS-2923 @AAMS-2840 
  Scenario: COBRA UI: Create User - search Customer dialog, comma seperated criteria
    Given "Default OIM Bankuser" creates "2" Customers with all products and jurisdictions
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search Customer ID" icon
    # AAMS-1725#04
    Then BankUser searches Customer with comma separated IDs from the API created entities as search criteria
    Then check the Search Customer result meets "or" logic on entered comma separated IDs
    Then BankUser selects the "1st" item in the search results by double clicking
    Then check Customer is selected and displayed correctly

  @AAMS-1676 @AAMS-1469
  Scenario: COBRA UI: Create User - search Org by multiple criterias
    Given "Default users" creates "2" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search CAAS Org ID" icon
    Then BankUser enters search criteria in Search dialog, then clicks on Search:
      | orgId   | {{randomString}} |
      | orgName | No2              |
    Then check the Search Org results display
    # AAMS-435#02,03,06, AAMS-436#01
    Then check the Search Org result meets "and" and "contains" logic on all criterias
    # AAMS-437#01
    Then BankUser selects the "1st" item in the search results then clicks on "OK"
    Then check Org is selected and displayed correctly

  @AAMS-1437 @AAMS-1469
  Scenario: COBRA UI: Create User screen validations - address dropdown enable/disable
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-566#01
    Then check Address dropdown is "Disabled"
    # AAMS-568#01, AAMS-1354#03
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check Org is selected and displayed correctly
    Then check Address dropdown is "Enabled"
    Then check the "2" options in Address dropdown
    # AAMS-568#03
    Then check Address dropdown "mandatory field" error messages
    # AAMS-568#04
    Then BankUser enters randomised address then clicks on "Ok" button
    Then check the entered address is displayed as selected option in Address dropdown
    # AAMS-7#03
    Then check mobile country prefix is defaulted to the country of the entered address
    # AAMS-568#05
    Then BankUser enters randomised address then clicks on "Cancel" button
    Then check the entered address is NOT added to Address dropdown
    # AAMS-566#03
    Then BankUser clears the entered Org ID
    Then check Address dropdown is "Disabled"

  @AAMS-1438 @AAMS-1469
  Scenario Outline: COBRA UI: Create User - address dialog, not allowed special characters
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check Org is selected and displayed correctly
    # AAMS-568#02
    Then BankUser fills in address data then clicks on "Ok" button:
      | addressLine1    | <addressLine1>    |
      | addressLine2    | <addressLine2>    |
      | suburbOrCity    | <suburbOrCity>    |
      | stateOrProvince | <stateOrProvince> |
      | postalCode      | <postalCode>      |
    Then check "Address Line 1" data validation error on Create User screen
    Then check "Address Line 2" data validation error on Create User screen
    Then check "Suburb / City" data validation error on Create User screen
    Then check "State / Province" data validation error on Create User screen
    Then check "Postal Code" data validation error on Create User screen
    Examples:
      | addressLine1    | addressLine2  | suburbOrCity | stateOrProvince | postalCode |
      | 100 Smith--st   | Smith<abcd    | ab>123       | Smith--abcd     | ab/**/cd   |
      | 100 Smith/**/st | Smith/**/abcd | ab<123       | Smith/**/abcd   | ab--cd     |
      | 100 Smith st;   | Dock;land     | ab--123      | <VIC>           | 123;45     |
      | 123 Mary©Ann Rd | abbcd--123    | dock;land    | NSW;            | <123456>   |

  @AAMS-1472 @AAMS-1468
  Scenario: COBRA UI: Create User - 10 distinct addresses in address dropdown
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "2" users with the "1st" created Org and address:
      | addressLine1    | 839 Collins St |
      | addressLine2    | line 2         |
      | suburbOrCity    | Dockland       |
      | stateOrProvince | VIC            |
      | postalCode      | 3001           |
      | country         | AU             |
    Given "Default OIM Bankuser" creates "9" users with the "1st" created Org, without a Customer, and with:
      | applications    | GCIS;Institutional Insights;Internet Enquiry Access     |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default users" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New User" tile does exist in the onboarding page
    When BankUser navigates to "New User" page
    # AAMS-1354#01
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check Org is selected and displayed correctly
    Then check Address dropdown is "Enabled"
    Then check the "10" options in Address dropdown
    Then BankUser selects the "10th" available address
    Then check the selected address is displayed correctly

  @AAMS-3081 @AAMS-1469
  Scenario: COBRA UI: Create User - more than 10 distinct addresses associated with Org
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "11" users with the "1st" created Org, without a Customer, and with:
      | applications    | GCIS;Institutional Insights;Internet Enquiry Access     |
      | securityDevices | ANZ Digital Key;Token Digipass 270:AUSTRALIA, Melbourne |
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then check "New User" tile does exist in the onboarding page
    When BankUser navigates to "New User" page
    # AAMS-1354#02
    Then BankUser enters the ID of the "1st" API created Org and hits ENTER
    Then check the "2" options in Address dropdown

  @AAMS-1439 @AAMS-1469
  Scenario: COBRA UI: Create User - fields trancated to the max allowed length
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-357#01
    Then BankUser fills in User General Details data longer than allowed max lengths
    Then check User fields has been truncated to the max allowed length
    # AAMS-568#02
    Then BankUser fills address fields longer than allowed max lengths and check values truncated
    # AAMS-568#04
    Then check the entered address is displayed as selected option in Address dropdown

  @AAMS-2271 @AAMS-1469
  Scenario: COBRA UI: Create User - Dynamic User ID uniqueness check
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    # AAMS-1248#01, AAMS-584#01
    Then BankUser fills in User ID with the same value from the "1st" API created User then tab away
    Then check "Logon ID already exists" error message

  @AAMS-5428
  Scenario: COBRA UI: Create User - search deleted Org, no matching records
    Given "Default OIM Bankuser" creates "2" organisations with no applications
    Then "Default users" deletes the "1st" API created org
    Then "Default users" deletes the "2nd" API created org
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser clicks on "Search CAAS Org ID" icon
    Then BankUser enters in Org Id from "2nd" API created org in Search dialog, then click on Search
    Then check the "No Record Found" message in Search dialog
    Then BankUser dismisses Search dialog
    Then BankUser enters Org ID from "1st" API created org on new user page and hits ENTER
    Then check lookup status to be "No Results Found"

  @AAMS-5129 @AAMS-4414
  Scenario: COBRA UI: Create User - Duplicate First Name, Surname and DOB uniqueness check
    Given "Default OIM Bankuser" creates "2" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Default users" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page 
    Then BankUser fills in User Details using the first name, surname and date of birth from the "1st" API created User and "2nd" created Org and click continue
    Then verify that duplicate warning message "MSG_086" and confirmation message is displayed on the screen 
    Then check elements on create user duplicate warning page
    Then click "No" on duplicate warning page
    Then BankUser clicks on "Continue" button
    Then click "Yes" on duplicate warning page
    Then check BankUser is directed to "Assign Applications" page

  @AAMS-5130 @AAMS-4414
  Scenario: Cobra UI: Create User - Duplicate First Name, Surname and CAAS ORG uniqueness check
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Default users" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User Details using the first name, surname and org from the "1st" API created User and "1st" created Org and click continue
    Then verify that duplicate warning message "MSG_087" and confirmation message is displayed on the screen
    Then check elements on create user duplicate warning page
    Then click "No" on duplicate warning page
    Then BankUser clicks on "Continue" button
    Then click "Yes" on duplicate warning page
    Then check BankUser is directed to "Assign Applications" page

  @AAMS-5132 @AAMS-4414
  Scenario: Cobra UI: Create User - Skips uniqueness check with deleted user for duplicate first name, surname and caas org
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Default users" approves the "1st" created user
    Given "Default users" deletes the "1st" API created user
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User Details using the first name, surname and org from the "1st" API created User and "1st" created Org and click continue
    Then check BankUser is directed to "Assign Applications" page

  @AAMS-5133 @AAMS-4414
  Scenario: Cobra UI: Create User - Skips uniqueness check with deleted user for duplicate first name, surname and dob
    Given "Default OIM Bankuser" creates "2" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Default users" approves the "1st" created user
    Given "Default users" deletes the "1st" API created user
    Given "Default OIM Bankuser" approves the "1st" created user
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser fills in User Details using the first name, surname and date of birth from the "1st" API created User and "2nd" created Org and click continue
    Then check BankUser is directed to "Assign Applications" page

  @AAMS-5504 @AAMS-1231
  Scenario Outline: Cobra UI: Create User - Coexistence uniqueness check with existing OIM User
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page 
    Then BankUser fills in User details with "<userId>" and "1st" api created org
    Then check BankUser is directed to "Assign Applications" page
    Then BankUser clicks on "Continue" button
    Then check BankUser is directed to "Assign Security Devices" page
    Then BankUser clicks on "Continue" button
    Then check BankUser is directed to "User Notifications" page
    Then BankUser clicks on "Submit" button
    Then check error message for existing CAAS OIM user
    Examples:
    |userId|
    |AAMS_1231_OIM_3|
    |AAMS_1231_OIM_4|
