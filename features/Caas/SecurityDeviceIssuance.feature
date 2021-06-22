@chrome @ie @COBRA @OIM @SecurityDeviceIssuance.feature
Feature: Security Device Issuance End to End Flows
	As a Security Device Officer 
	BankUser can issue Tokens to Security Devices

# The E2E scenarios below requires SSAS stub deployed and pointed to from BFF and IDM in the test env. 

  @AAMS-3325 @AAMS-3194
	Scenario Outline: COBRA UI: Security Device Issuance - issue <deviceType> successfully
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, without a Customer, and with:
      | applications    | SDP CTS;Transactive Global |
      | securityDevices | <deviceAndLocation>        |
    Given "Default users" approves the "1st" created user
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser searches Security Device by "User ID" with values from the "1st" API created user
    Then check tokens are displayed correctly in search results for the "1st" API created User
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1368#03
    Then BankUser enters Token Serial Number with "<serialNumberPrefix>" prefix then proceeds to submit the issuance
    Then check token issuance success message is displayed
    Then BankUser logs out
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    Then BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser opens the "1st" entry from search User results
    Then check Serial Number is displayed correctly in Security Devices tab on User Details page
    Then check "<deviceType>" is displayed correctly in Security Devices tab with Status "Pending activation" and Description "Device awaiting activation"
    Then BankUser logs out
    Then check IDM Linked View that "<deviceType>" has been Provisioned
    Examples:
      | deviceType                           | deviceAndLocation                                   | serialNumberPrefix |
      | Token Digipass 270                   | Token Digipass 270:AUSTRALIA, Melbourne             | SUC0               |
      | Token Digipass 276 (China Compliant) | Token Digipass 276 (China Compliant):CHINA, Chengdu | SUC6               |

  @AAMS-3326 @AAMS-3194
  Scenario Outline: COBRA UI: Security Device Issuance - serial number not found in SSAS
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser enters search Security Device criteria and click on search button:
      | Device Type       | <deviceType>  |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1367#04
    Then BankUser enters Token Serial Number with "NOTFOUND" prefix then proceeds to submit the issuance
    Then check token issuance error message "MSG042" is displayed
    Then BankUser logs out
    Examples:
      | deviceType                           |
      | Digipass Token 270                   | 
      | Digipass Token 276 (China Compliant) | 

  @AAMS-3327 @AAMS-3194
  Scenario Outline: COBRA UI: Security Device Issuance - Serial number and device type do not match
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser enters search Security Device criteria and click on search button:
      | Device Type       | <deviceType>  |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1367#05
    Then BankUser enters Token Serial Number with "<serialNumberPrefix>" prefix then proceeds to submit the issuance
    Then check token issuance error message "MSG044" is displayed
    Then BankUser logs out
    Examples:
      | deviceType                           | serialNumberPrefix |
      | Token Digipass 270                   | SUC6               |
      | Token Digipass 276 (China Compliant) | SUC0               |

  @AAMS-3328 @AAMS-3194
  Scenario Outline: COBRA UI: Security Device Issuance - Serial number is already allocated to another User
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser enters search Security Device criteria and click on search button:
      | Device Type       | <deviceType>  |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1367#06
    Then BankUser enters Token Serial Number with "<serialNumberPrefix>" prefix then proceeds to submit the issuance
    Then check token issuance success message is displayed
    Then BankUser reset search
    Then BankUser enters search Security Device criteria and click on search button:
      | Device Type       | <deviceType>  |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    Then BankUser enters the used Serial Number then proceeds to submit the issuance
    Then check token issuance error message "MSG043" is displayed
    Then BankUser logs out
    Examples:
      | deviceType                           | serialNumberPrefix |
      | Token Digipass 270                   | SUC0               |
      | Token Digipass 276 (China Compliant) | SUC6               |    

  @AAMS-3329 @AAMS-3194
  Scenario: COBRA UI: Security Device Issuance - unable to contact SSAS
    Given "Security Device Officer" logins in to COBRA using a valid password
    When BankUser navigates to Security Device Issuance search screen
    Then BankUser enters search Security Device criteria and click on search button:
      | Device Type       | Digipass Token 270    |
    Then Bankuser dismisses pagination message if it pops up
    Then BankUser opens the "1st" entry from search Security Devices results by clicking on Issue button
    # AAMS-1367#07
    Then BankUser enters Token Serial Number with "FAIL" prefix then proceeds to submit the issuance
    Then check token issuance error message with text "Unable to contact SSAS" is displayed
    Then BankUser logs out
  
