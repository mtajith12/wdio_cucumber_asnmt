Feature: To test as a bankuser we are able to register Roles
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister Register Roles and changes to be reflected in CA

  Background: Register an customer and division
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @COBRA @ONAR-3376 @ONAR-3768 @ONAR-6111 @dev @cit @e2e @qa2
  Scenario Outline: 01. Create/Modify/Register/Reject Resource for Roles with View permission and validate Deleted Role
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                         |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td],ANZ Transactive - AU & NZ: Payments[p_tttpayment]                                                                                                                                                                                                                                                                                              | View and Download[r_view-download] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                       |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                       |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                       |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                       |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                       |
    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                              |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                                | View and Download[r_view-download],All Permissions[all] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                                            |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                                            |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                                            |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                                            |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                                            |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for Role "Approve" "new" workflow
    Then BankUser edits the role description
    Then Validate the "modify" message for Role
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "modify" workflow
    Then validate against CA for Role "Approve" "modify" workflow
    Then executing additional CA validations for Role
    Then Search the entity in searchscreen and "Verify" "delete" workflow
    Then Validate the "delete" message for Role
    And BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "delete" workflow
    Then validate against CA for Role "Approve" "delete" workflow
    And validate "Deleted" status of Role in the Summary Grid
    Then BankUser logs out
    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6044 @dev @cit 

  Scenario Outline: 02. Create/Register Resource for Roles with manage permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                           |
      | Reporting[f_rep]                 | All Products[all]                                                                                                                                                                                                                                                                                                                                                                                                      | All Permissions[all]                 |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | File Import[r_manage-pay-imp-unrest] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                                                                                                | File Import[r_manage-dd-imp-unrest]  |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | Manage[r_manage]                     |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | Manage[r_manage]                     |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | Manage[r_manage]                     |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                              |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td],ANZ Transactive - AU & NZ: Payments[p_tttpayment]                                                                                                                                                                                                                                                                                              | View and Download[r_view-download],All Permissions[all] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | File Import[r_manage-pay-imp-unrest],View[r_view]       |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                                                                                                | File Import[r_manage-dd-imp-unrest],View[r_view]        |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view],Manage[r_manage]                           |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view],Manage[r_manage]                           |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view],Manage[r_manage]                           |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6045 @dev @cit 
  Scenario Outline: 03. Create/Register Resource for Roles approve permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                          |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | Make Payments to Adhoc Payees[r_manage-pay-adhoc]   |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                                                                                                | Request Debits from Adhoc Payers[r_manage-dd-adhoc] |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | Approve[r_authorize]                                |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | Approve[r_authorize]                                |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | Approve[r_authorize]                                |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                                                                                                                    |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | Make Payments to Adhoc Payees[r_manage-pay-adhoc],Make Payments using Approved Templates or Payees[r_manage-pay-benetmpl-unrest],View[r_view] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                                                                                                | Request Debits from Adhoc Payers[r_manage-dd-adhoc], View[r_view]                                                                             |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | Approve[r_authorize],View[r_view]                                                                                                             |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | Approve[r_authorize],View[r_view]                                                                                                             |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | Approve[r_authorize],View[r_view]                                                                                                             |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6046 @dev @cit 
  Scenario Outline: 04. Create/Register Resource for Roles with Self-Approval permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                     |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | Approve[r_authorize]           |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd], PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                 | Allow Self Approval[r_authown] |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | Allow Self Approval[r_authown] |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | Allow Self Approval[r_authown] |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | Allow Self Approval[r_authown] |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                                       |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | Approve[r_authorize],View[r_view]                                |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd], PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                 | Approve[r_authorize],View[r_view],Allow Self Approval[r_authown] |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | Approve[r_authorize],View[r_view],Allow Self Approval[r_authown] |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | Approve[r_authorize],View[r_view],Allow Self Approval[r_authown] |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | Approve[r_authorize],View[r_view],Allow Self Approval[r_authown] |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6047 @dev @cit @e2e
  Scenario Outline: 05. Create/Register Resource for Roles with All permissions
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                 | permission                     |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer] | Allow Self Approval[r_authown] |
      | Receivables Management[f_ddmgmt] | All Products[all]                                                                                                                                                                                                                                                                                                                                    | All Permissions[all]           |
      | Template Management[f_tmplmgmt]  | All Products[all]                                                                                                                                                                                                                                                                                                                                    | All Permissions[all]           |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                         | All Permissions[all]           |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                        | All Permissions[all]           |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                                                                              |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | Approve[r_authorize],View[r_view],Allow Self Approval[r_authown]                                        |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd], PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                 | All Permissions[all], Approve[r_authorize],View[r_view],Allow Self Approval[r_authown]                  |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | All Permissions[all],Manage[r_manage], Approve[r_authorize],View[r_view],Allow Self Approval[r_authown] |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | All Permissions[all],View[r_view],Manage[r_manage],Approve[r_authorize],Allow Self Approval[r_authown]  |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | All Permissions[all],View[r_view],Manage[r_manage],Approve[r_authorize],Allow Self Approval[r_authown]  |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6048 @dev @cit 
  Scenario Outline: 06. Create/Register Resource for Roles with make Payments with Approved Templates or Payees permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                 | permission                                                                     |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer] | Make Payments using Approved Templates or Payees[r_manage-pay-benetmpl-unrest] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                              | Request Debits using Approved Templates or Payers[r_manage-dd-tmpl-unrest]     |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                 | permission                                                                                   |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer] | Make Payments using Approved Templates or Payees[r_manage-pay-benetmpl-unrest], View[r_view] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                              | Request Debits using Approved Templates or Payers[r_manage-dd-tmpl-unrest], View[r_view]     |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6049 @dev @cit 
  Scenario Outline: 07. Create/Register Resource for Roles with Get Trade permission for Payment Management and Manage permission for Receivables
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                   | permission              |
      | Payment Management[f_paymgmt]    | International Payments[p_intpay],Transfers[p_transfer] | Get Rate/Trade[r_trade] |
      | Receivables Management[f_ddmgmt] | PayID Management[p_payidmgmt]                          | Manage[r_manage]        |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                   | permission                            |
      | Payment Management[f_paymgmt]    | International Payments[p_intpay],Transfers[p_transfer] | Get Rate/Trade[r_trade], View[r_view] |
      | Receivables Management[f_ddmgmt] | PayID Management[p_payidmgmt]                          | Manage[r_manage], View[r_view]        |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6050 @dev @cit  
  Scenario Outline: 08. Create/Register Resource for Roles with Approve permission for receivables and All permission for Payment Management
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                   | permission           |
      | Payment Management[f_paymgmt]    | All Products[all]                                                                                                      | All Permissions[all] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd], PayID Management[p_payidmgmt] | Approve[r_authorize] |

    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                 | permission                                                                                                                                                                                                                                                  |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer] | All Permissions[all],View[r_view],Make Payments using Approved Templates or Payees[r_manage-pay-benetmpl-unrest],File Import[r_manage-pay-imp-unrest],Make Payments to Adhoc Payees[r_manage-pay-adhoc],Approve[r_authorize],Allow Self Approval[r_authown] |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd]                                                                                                                                                                                                                                                              | Approve[r_authorize],View[r_view]                                                                                                                                                                                                                           |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then BankUser logs out

    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6051 @dev @cit 
  Scenario Outline: 09. Create/Modify/Reject Resource for Roles with View permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                         |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td],ANZ Transactive - AU & NZ: Payments[p_tttpayment]                                                                                                                                                                                                                                                                                              | View and Download[r_view-download] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                       |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                       |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                       |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                       |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                       |
    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                              |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                                | View and Download[r_view-download],All Permissions[all] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                                            |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                                            |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                                            |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                                            |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                                            |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for Role "Approve" "new" workflow
    Then BankUser edits the role description
    Then Validate the "modify" message for Role
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for Role
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Verify" "delete" workflow
    Then Validate the "delete" message for Role
    And BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "delete" notification messages for Role
    Then BankUser logs out
    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |



  @chrome @COBRA @ONAR-6179 @dev @cit 
  Scenario Outline: 10. Create/Modify/Delete/Validate Audit for Roles with View permission
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                         |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td],ANZ Transactive - AU & NZ: Payments[p_tttpayment]                                                                                                                                                                                                                                                                                              | View and Download[r_view-download] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                       |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                       |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                       |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                       |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                       |
    And BankUser submits role
    Then Validate the "register" message for Role
    And Bankuser verifies roles selected
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                                              |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                                | View and Download[r_view-download],All Permissions[all] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | View[r_view]                                            |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | View[r_view]                                            |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | View[r_view]                                            |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | View[r_view]                                            |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | View[r_view]                                            |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "new" workflow
    Then validate against CA for Role "Approve" "new" workflow
    Then BankUser edits the role description
    Then Validate the "modify" message for Role
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "modify" workflow
    Then validate against CA for Role "Approve" "modify" workflow
    Then BankUser validates the Audit Scenarios for Role
      | Description                                     | Action   |
      | Record was created and submitted for approval.  | Created  |
      | Record was approved and created.                | Approved |
      | Record was modified and submitted for approval. | Modified |
      | Changes to Record were approved.                | Approved |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Verify" "delete" workflow
    Then Validate the "delete" message for Role
    And BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the entity in searchscreen and "Approve" "delete" workflow
    Then validate against CA for Role "Approve" "delete" workflow
    Then BankUser validates the Audit Scenarios for Role
      | Description                                    | Action   |
      | Record was deleted and submitted for approval. | Deleted  |
      | Record was deleted.                            | Approved |
    Then BankUser logs out
    Examples:
      | RoleName | RoleDescription |
      | test     | testdesc        |


 @chrome @ie @COBRA @ONAR-7004 @dev
  Scenario Outline: : 11. Create COBRA Users and verify in custom role details screen.
    Given create a customer using api
    Given create a "1" Division using api
    # Given create a "2" Division using api
    
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser creates a role
    Then Get role id
    Then BankUser logs out
    Given "Default users" creates "1" organisations with all applications
    Given create a "1" OIM User using api
    Given create a "2" OIM User using api
    When "Default approvers" logins in to COBRA using a valid password
    Then Bulk approve "2" entities and validate the "register" notification messages
    Then Search the Role in searchscreen and verify users
    Then BankUser logs out
    Examples:
      | admin |
      | Dual  |