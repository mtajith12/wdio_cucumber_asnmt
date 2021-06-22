Feature: To test as a bankuser data is cascading for Role
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api

  @chrome @ie @COBRA  @dev @ONAR-3431 @e2e
    Scenario: 01. Verify the cascade for  Role-Remove/Add Product
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
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
    When "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then Add the user by Adding "Custom Role" entitlement with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages

     Then bankuser edits the role
       |entity                          |role                                                                                                                                                                                                                                                                                                                                                                                                                  |permission                         |
       |Reporting[f_rep]                |Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]|View and Download[r_view-download]|
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "modify" workflow

    Then verify "Users" with "Custom Role" entitlement if the "Reporting" "Product" are "removed"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then bankuser edits the role
      |entity                          |role                                                                                                                                                                                                                                                                                                                                                                                                                  |permission                         |
      |Reporting[f_rep]                |Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]|View and Download[r_view-download]|
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "modify1" workflow
    Then verify "Users" with "Custom Role" entitlement if the "Reporting" "Product" are "added"
    Then BankUser logs out

  @chrome @ie @dev @ONAR-6022 @e2e
  Scenario: 02. Verify the cascade for  Role-Modify feature
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
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
    When "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then Add the user by Adding "Custom Role" entitlement with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages

    Then bankuser edits the role
      |entity                          |role                                                                                                                                                                                                                                                                                                                                                                                                                  |permission                         |
      |Payment Management[f_paymgmt]   |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                  |Approve[r_authorize]|
      |Template Management[f_tmplmgmt] |AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]|Approve[r_authorize]|
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "modify" workflow

    Then verify "Users" with "Custom Role" entitlement if the "Payment" "Approval Discretions" are "removed"
    Then BankUser logs out

  @chrome @ie @COBRA  @dev @ONAR-3821
  Scenario: 03. Verify the cascade for  User list in roles tab in customer
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
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
    When "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then Add the user by Adding "Custom Role" entitlement with "All,,Division,1" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then modify the user by Adding "Custom Role" entitlement with "None,,Division,2" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    And BankUser logs out
    Given  create a CAASUSER using CAAS api
    When "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then Add the user by Adding "Custom Role" entitlement with "All,,Division,2" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    When "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then Add the user by Adding "Custom Role" entitlement with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Verify the roles tab to contain "All Divisions,MULTIPLE" in customer
    Then BankUser logs out

