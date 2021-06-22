Feature: As a Bank Administrator, i want to Download Reports
  As a Bank User
  I want to be able to Download Reports
  @chrome @ie @COBRA  @dev @ONAR-4016 @ONAR-6245
  Scenario Outline: 01. Download and validate Customer Division Detail Report,Authorisation Matrix Report
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "<HostSystem>" "<BSB>"-"<AccountNumber>" and country "<Country>" using api and "<Action>"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "CC03_Authorised Signatory" with "Selected,Add,Division,1" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Customer Division Detail Report" "PDF" for the created customer
    Then Download Report "Customer Division Detail Report" for the created customer
    Then Validate the "Customer Division Detail Report" "PDF" Report content
    Then Run Report "Authorisation Matrix Report" "PDF" for the created customer
    Then Download Report "Authorisation Matrix Report" for the created customer
    Then Validate the "Authorisation Matrix Report" "PDF" Report content
    Then Run Report "Authorisation Matrix Report" "CSV" for the created customer
    Then Download Report "Authorisation Matrix Report" for the created customer
    Then Validate the "Authorisation Matrix Report" "CSV" Report content
    Examples:
      | HostSystem | BSB    | AccountNumber | Country | Action  |
      | CAP        | 013148 | 122964092     | AU      | approve |

    @e2e @chrome @COBRA
    Examples:
      | HostSystem | BSB    | AccountNumber | Country | Action  |
      | CAP        | 012294 | 181097963     | AU      | approve |


  @chrome @ie @COBRA  @dev @e2e @ONAR-6294 @ONAR-6245
  Scenario: 01. Download and validate Customer user Details Report
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "Supplier Explorer,Payable Modeller" with "None" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Customer User Details Report" "PDF" for the created customer
    Then Download Report "Customer User Details Report" for the created customer
    Then Validate the "Customer User Details Report" "PDF" Report content

  @chrome @ie @COBRA  @dev @e2e @ONAR-6027
  Scenario: 02. Download and validate Customer Customer Role Details Report
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then Click on Create a Role
    And BankUser selects below options
      | entity                           | role                                                                                                                                                                                                                                                                                                                                                                                                                   | permission                         |
      | Reporting[f_rep]                 | Reporting - Accounts[p_rep-account],Reporting - Term Deposits[p_rep-td]                                                                                                                                                                                                                                                                                                                                                | View and Download[r_view-download] |
      | Payment Management[f_paymgmt]    | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],Transfers[p_transfer]                                                                   | All Permissions[all]               |
      | Receivables Management[f_ddmgmt] | AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd],PayID Management[p_payidmgmt]                                                                                                                                                                                                                                                                                                  | All Permissions[all]               |
      | Template Management[f_tmplmgmt]  | AU BPAY[p_bpay-au],Multibank Payments[p_multibank],AU Domestic (Direct Credit)[p_dompay-au-dc],AU Domestic (Osko)[p_dompay-au-npp],AU Domestic (RTGS)[p_dompay-au-rtgs],CN Domestic (BEPS & HVPS)[p_dompay-cn],NZ Domestic (Direct Credit)[p_dompay-nz-lv],NZ Domestic (SCP)[p_dompay-nz-scp],International Payments[p_intpay],AU Domestic (Direct Debit)[p_domrecv-au-dd],NZ Domestic (Direct Debit)[p_domrecv-nz-dd] | All Permissions[all]               |
      | Payee Management[f_benemgmt]     | Payee Management[p_benemgmt]                                                                                                                                                                                                                                                                                                                                                                                           | All Permissions[all]               |
      | Payer Management[f_payermgmt]    | Payer Management[p_payermgmt]                                                                                                                                                                                                                                                                                                                                                                                          | All Permissions[all]               |
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
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Customer Role Details Report" "PDF" for the created customer
    Then Download Report "Customer Role Details Report" for the created customer
    Then Validate the "Customer Role Detail Report" "PDF" Report content
    Then Run Report "Customer Role Details Report" "CSV" for the created customer
    Then Download Report "Customer Role Details Report" for the created customer
    Then Validate the "Customer Role Detail Report" "CSV" Report content



  @chrome @ie @COBRA @dev @ONAR-6028
  Scenario: 03. Download and validate Customer Bank User Activity Report with PDF format
    Given "Default users" logins in to COBRA using a valid password
    Given register "bankUser1"
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Bank User Activity Report" "PDF" for the created customer
    Then Download Report "Bank User Activity Report" for the created customer
    Then Validate the "Bank User Activity Report" "PDF" Report content


  @chrome @ie @COBRA @ONAR-6029
  Scenario: 03. Download and validate Customer Bank User Activity Report with CSV format
    Given "Default users" logins in to COBRA using a valid password
    Given register "bankUser1"
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Bank User Activity Report" "CSV" for the created customer
    Then Download Report "Bank User Activity Report" for the created customer
    Then Validate the "Bank User Activity Report" "CSV" Report content


  @chrome @ie @COBRA @dev @ONAR-6030 @ONAR-6108
  Scenario: 03. Download and validate Customer Bank User Activity Report with New Bankuser
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction              | jurisdriction                   | productFamily                                                                                                                                | restrictedCountries                         |
      | Helpdesk Officer           | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Helpdesk Team Lead         | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Application Admin          |                                 |                                                                                                                                              |                                             |
      | Bank User Management Admin |                                 |                                                                                                                                              |                                             |
      | Registration Team Lead     | Trans Tasman,Asia,Pacific,Other |                                                                                                                                              | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Registration Officer       | Trans Tasman,Asia,Pacific,Other |                                                                                                                                              | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Bank User Activity Report" "PDF,created" for the created customer
    Then Download Report "Bank User Activity Report" for the created customer
#    Then Validate the "Bank User Activity Report,Created" "PDF" Report content
    Then Run Report "Bank User Activity Report" "CSV,created" for the created customer
    Then Download Report "Bank User Activity Report" for the created customer
#    Then Validate the "Bank User Activity Report,Created" "CSV" Report content
  

  @chrome @ie @COBRA  @dev @e2e @ONAR-5995
  Scenario: 04. Download and validate Customer Division Detail Report using the "Ready for download" link
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "<hostSystem>" "<BSB>"-"<AccountNumber>" and country "<country>" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "All Entitlements" with "Selected,Add" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Run Report "Customer Division Detail Report" "PDF" for the created customer
    Then Download Report "Customer Division Detail Report" for the created customer using Download hyperlink
    Then Validate the "Customer Division Detail Report" "PDF" Report content


  @chrome @ie @COBRA @ONAR-6116  @cit
  Scenario Outline: 05. Create Customer/Division with DE user ID and run/download/validate the DE User Id Report
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "Australia,China,Hong Kong,New Zealand,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then Obtain the details of De User ID
    Then Run Report "DE User ID Report" "PDF" for the created customer
    Then Download Report "DE User ID Report" for the created customer
    Then Validate the "DE User ID Report" "PDF" Report content
    Examples:
      | Products                                                                                                                                     |
      | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App |



  @chrome @ie @COBRA @ONAR-6306  @dev
  Scenario Outline: 06. Create Customer/Division/VAM Account to view VAM accounts on Reports
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "<hostSystem>" "<BSB>"-"<AccountNumber>" and country "<country>" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "All Entitlements" with "Selected,Add" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then Run Report "Customer Division Detail Report" "PDF" for the created customer
    Then Download Report "Customer Division Detail Report" for the created customer
    Then Validate the "Customer Division Detail Report - VAM" "PDF" Report content
    Then Run Report "Customer User Details Report" "PDF" for the created customer
    Then Download Report "Customer User Details Report" for the created customer
    Then Validate the "Customer User Details Report - VAM" "PDF" Report content
    Examples:
      | hostSystem |country  |BSB   | AccountNumber|
      | VAM        |SG       |013350|  12362572    |


@chrome @ie @COBRA  @dev @ONAR-6981
  Scenario Outline: 07. Export and validate Resource summary grid data
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "<CAP-BSB>"-"<CAP-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP1-BSB>"-"<CAP1-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP2-BSB>"-"<CAP2-AccountNumber>" and country "AU" using api and "approve"
    Given create a Account "CAP" "<CAP3-BSB>"-"<CAP3-AccountNumber>" and country "AU" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Search the Resource in searchscreen and export data
    Then Validate the "Manage-Resources" "Export" Report content
    Then BankUser logs out
  Examples:
      | CAP-AccountNumber | CAP-BSB | CAP1-AccountNumber | CAP1-BSB | CAP2-AccountNumber | CAP2-BSB | CAP3-AccountNumber | CAP3-BSB |
      | 123456799         | 013148  | 123456911          | 013148   | 1234567912         | 013148   | 1234567193         | 013148   |

@ONAR-7077 @chrome @ie @COBRA   @dev @qa2
# This works for all product families except Cash Management
  Scenario Outline: 08. Validate reports for "<Productfamily>", "<Products>" products and "<Jurisdiction>" jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" admin model and selects "<Productfamily>" product family, "<Products>" products and "<Jurisdiction>" jurisdictions
    Then create division with "<Productfamily>" and "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "Australia" FX settings
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Given create a CAASUSER using CAAS api
    Then search for created user in cobra
    Then add "<entitlement>" with "<Resources>" Resources and register the customeruser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then Run Report "<report>" "<format>" for the created customer
    Then Download Report "<report>" for the created customer
    Then Validate the "<report>" "<format>" Report content for "<Productfamily>"

    Examples:
      | Productfamily    | Products                                             | Jurisdiction          | entitlement                     | Resources              | report                       | format |
      | Pilot Products | Pilot - Support Chatbox                                | Australia,New Zealand | Pilot - Support Chatbox         | None                   | Customer User Details Report | PDF    |
