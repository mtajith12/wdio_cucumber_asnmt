Feature: To test as a bankuser data is cascading for Customer
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature

  Background: Create required Data
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
  #  Given create a Account "CAP" ""-"123456790" and country "AU" using api and approve
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add All Entitlements with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
   Then BankUser logs out


  @chrome @ie @COBRA  @dev @ONAR-6012 @e2e
  Scenario: 01. Verify the cascade feature for customer -Action-Removal of product family
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      |entity                          |role                                                                                                                                                                                                                                                                                                                                                                                                                  |permission                         |
      |Reporting[f_rep]                |Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                               |View and Download[r_view-download]|
      |Payment Management[f_paymgmt]   |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                  |All Permissions[all]|
      |Receivables Management[f_ddmgmt]|AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                 |All Permissions[all]|
      |Template Management[f_tmplmgmt] |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]|All Permissions[all]|
      |Payee Management[f_benemgmt]    |Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                          |All Permissions[all]|
      |Payer Management[f_payermgmt]   |Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                         |All Permissions[all]|
    And BankUser submits role
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser verifies division doesnt have "Cash Management" "Product Family"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Cash Management" "Product Family" of customer and approve the changes
    Then verify "Roles" is deleted
  Then verify "Users" with "All Entitlements" entitlement if the "Cash Management" "Product Family" are "removed"
    Then BankUser logs out

  @chrome @ie @COBRA @ONAR-6013 @dev @e2e
  Scenario: 02. Verify the cascade feature for customer -Action-Removal of Jurisdiction-Singapore
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser verifies division doesnt have "FX Services" "Product Family"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Singapore" "Jurisdiction" of customer and approve the changes
      Then BankUser logs out

#  @chrome @ie @COBRA @ONAR-2266 @ONAR-3221 @dev @e2e
#  Scenario: 03. Verify the cascade feature for customer -Action-Removal of Jurisdiction-China
#    Given "Default users" logins in to COBRA using a valid password
#    When Bankuser verifies division doesnt have "Cash Management,Loans,FX Overlay,Institutional Insights,Omni Demo App" "Product Family"
#    Then BankUser logs out
#    Given "Default users" logins in to COBRA using a valid password
#    Then Bankuser "removes" "China" "Jurisdiction" of customer and approve the changes
#   Then BankUser logs out

    @chrome @ie @COBRA  @dev @ONAR-6014 @e2e
  Scenario: 04. Verify the cascade feature for customer -Action-Addition/Removal of Feature
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser verifies division doesnt have "AU Domestic (Direct Credit)" "Feature"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "AU Domestic (Direct Credit)" "Feature" of customer and approve the changes
    Then verify "Users" with "All Entitlements" entitlement if the "AU Domestic (Direct Credit)" "Feature" are "removed"
      Then BankUser logs out
      Given "Default users" logins in to COBRA using a valid password
      Then Bankuser "adds" "AU Domestic (Direct Credit)" "Feature" of customer and approve the changes
      Then verify "Users" with "All Entitlements" entitlement if the "AU Domestic (Direct Credit)" "Feature" are "added"
      Then BankUser logs out


  @chrome @ie @COBRA   @dev @ONAR-6015 @e2e
  Scenario: 05. Verify the cascade feature for customer -Action-Addition/Removal of Product -Payments
    Given "Default users" logins in to COBRA using a valid password
    And BankUser selects below options
      |entity                          |role                                                                                                                                                                                                                                                                                                                                                                                                                  |permission                         |
      |Reporting[f_rep]                |Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                               |View and Download[r_view-download]|
      |Payment Management[f_paymgmt]   |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                  |All Permissions[all]|
      |Receivables Management[f_ddmgmt]|AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                 |All Permissions[all]|
      |Template Management[f_tmplmgmt] |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]|All Permissions[all]|
      |Payee Management[f_benemgmt]    |Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                          |All Permissions[all]|
      |Payer Management[f_payermgmt]   |Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                         |All Permissions[all]|
    And BankUser submits role
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser verifies division doesnt have "Payments" "Product" from "Cash Management"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Payments" "Product" of customer and approve the changes
    Then verify "Users" with "All Entitlements" entitlement if the "Payments" "Product" are "removed"
    Then verify Roles if the "Payments" Product are "removed"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "adds" "Payments" "Product" of customer and approve the changes
    Then verify "Users" with "All Entitlements" entitlement if the "Payments" "Product" are "added"
    Then verify Roles if the "Payments" Product are "added"
    Then BankUser logs out



##  @chrome @ie @COBRA @ONAR-2266 @ONAR-3221
##  Scenario: 01. Create/Modify/Register/Reject customer user with All Entitlements and approve entitlements with Selected resources for adminRole Customer
##    #    Given create a Account "CAP" "123456789" using api and approve
###    Given create a Account "CAP" "123456790" using api and approve
###    Given create a Account "MDZ" "999995AUD00001" using api and approve
###    Given create a Account "MDZ" "999995AUD00003" using api and approve
###    Given create a legal entity using api
##    Given "Default users" logins in to COBRA using a valid password
##    When Bankuser verifies accounts doesnt have "Cash Management" "Product Family"
##    Given "Default users" logins in to COBRA using a valid password
##    When Bankuser verifies division doesnt have "Cash Management" "Product Family"
##
##    Then Bankuser removes "Cash Management" product and approve the changes.
##

  @chrome @ie @COBRA   @dev @ONAR-6016 @e2e
  Scenario: 06. Verify the cascade feature for Customer Jurisdiction removal
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser verifies division doesnt have "CN Domestic (BEPS & HVPS)" "Feature"
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
     Then Bankuser "removes" "China" "Jurisdiction" of customer and approve the changes
     Then BankUser logs out
