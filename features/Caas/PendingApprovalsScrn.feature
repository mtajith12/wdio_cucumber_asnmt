@chrome @ie @COBRA @OIM @PendingApprovalsScrn.feature
Feature: Pending Approvals page screen validations for OIM changes
  As a Bank User with entitlements to Pending Approvals page
  BankUser want to be able to view and operate on the Pending Approvals page

  @AAMS-2275 @AAMS-1674
  Scenario: COBRA UI: Pending Approvals page screen validation
    Given "Default OIM Bankuser" creates "1" organisations with a unique random string in orgData
    Given "Default OIM Bankuser" creates "1" users with the "1st" created Org
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    #AAMS-295#01
    Then BankUser navigates to Pending Approvals page
    #AAMS-295#02
    Then check "Record ID" field takes a maximum of "60" characters
    Then check loading text on Pending Approvals page
    #AAMS-295#03
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Full Name" with values from the "1st" API created user
    Then check the returned Entities meet the "Contains", "Or" and "And" logic
    #AAMS-295#04
    Then BankUser reset search
    Then BankUser searches Pending Approval entities by "Record ID" with values from the "1st" API created user
    Then check the "1st" API created User is displayed correctly in the Pending Approvals results grid
    #AAMS-295#05
    Then BankUser opens the "1st" entry from Pending Approvals grid
    Then check the details of the API created User displayed correctly in view User page
    Then BankUser logs out