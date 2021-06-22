Feature: To test as a bankuser we are able to register bankuser
  As a Bank User
  I want to be able to create/Approve/Search/Edit/Deregister  a new bankuser and changes to be reflected in CA
  Background:Login

  @chrome @COBRA @ONAR-3698 @BankUser  @dev @ONAR-3426 @ONAR-2689
  Scenario: Create/Modify/Register/Reject a new bankuser with all admin functions and all jurisdictions
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction                 | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | Helpdesk Officer              | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Helpdesk Team Lead            | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Implementation Manager        | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Product/Channel Manager       | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Senior Implementation Manager | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Technical Officer             | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Application Admin             |                                 |                                                                                                                                                             |                                             |
      | Bank User Management Admin    |                                 |                                                                                                                                                             |                                             |
      | Registration Team Lead        | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Billing Officer               | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |
      | Content Admin                 |                                 | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App |                                             |
      | Registration Officer          | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Payments Officer              | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |
      | Payments Maker                | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Payments Authoriser           | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser validates the created bankuser with
      | adminFunction          | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | Implementation Manager | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then BankUser validated the Audit Sceanrios
      | Description                                    | Action  |
      | Record was created and submitted for approval. | Created |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Bankuser "Approve" "new" workflow
    Then Validate jurisdictions and roles added against CA
      | adminFunction                 | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | Helpdesk Officer              | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Helpdesk Team Lead            | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Implementation Manager        | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Product/Channel Manager       | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Senior Implementation Manager | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Technical Officer             | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Application Admin             |                                 |                                                                                                                                                             |                                             |
      | Bank User Management  Admin   |                                 |                                                                                                                                                             |                                             |
      | Registration Team Lead        | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Billing Officer               | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |
      | Content Admin                 |                                 | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App |                                             |
      | Registration Officer          | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Payments Officer              | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |
      | Payments Maker                | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Payments Authoriser           | Trans Tasman,Asia,Pacific,Other |                                                                                                                                                             |                                             |

    Then BankUser edits the created bankuser
      | adminFunction | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | Payments View | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "modify" message for bankuser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "modify" workflow
    Then Validate against CA for Bankuser "Approve" "modify" workflow
    Then Search the BankUser in searchscreen and "Verify" "deregister" workflow
    Then Validate the "deregister" message for bankuser
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then BankUser validated the Audit Sceanrios
      | Description                                     | Action   |
      | Record was approved and created.                | Approved |
      | Changes to Record were approved.                | Approved |
      | Record was modified and submitted for approval. | Modified |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "deregister" workflow
    Then Validate against CA for Bankuser "Approve" "deregister" workflow
    Then BankUser logs out

  @chrome @COBRA @ONAR-2689 @ONAR-6525 @BankUser @dev
  Scenario: Create/Modify/Register/Reject a new bankuser Helpdesk Officer  admin function and australia jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction    | jurisdriction | productFamily                                                                                                                                               | restrictedCountries                         |
      | Helpdesk Officer | Australia     | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser validates the created bankuser with
      | adminFunction    | jurisdriction | productFamily                                                                                                                                               | restrictedCountries                         |
      | Helpdesk Officer | Australia     | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Bankuser "Approve" "new" workflow
    Then Validate jurisdictions and roles added against CA
      | adminFunction    | jurisdriction |
      | Helpdesk Officer | Australia     |
    Then BankUser edits the created bankuser
      | adminFunction          | jurisdriction                   | productFamily                                                                                   | restrictedCountries                         |
      | Implementation Manager | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,Pilot Products | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "modify" message for bankuser
    When "Default users" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "modify" workflow
    Then Validate against CA for Bankuser "Approve" "modify" workflow
    Then BankUser logs out


  @chrome @COBRA @ONAR-3426 @BankUser
  Scenario: Create/Modify/Register/Reject a new bankuser  Helpdesk Officer  admin function and Cambodia jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction    | jurisdriction | productFamily                                                                                                                                               | restrictedCountries |
      | Helpdesk Officer | Australia     | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App |                     |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser validated the Audit Sceanrios
      | Description                                    | Action  |
      | Record was created and submitted for approval. | Created |
    Then BankUser logs out


  @chrome @ie @COBRA @dev @e2e @ONAR-6005
  Scenario: To verify the Manage Summary grid of bankUser entity
    Given "Default approvers" logins in to COBRA using a valid password
    Then validate the elements present in the bankUser screen
    And BankUser logs out


  @chrome @COBRA @ONAR-6372 @BankUser @dev
  Scenario: Create a new bankuser with Resource Support Officer role and using the created bankuser Register/Approve/View the resources and Validate the View Rights
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "MDZ" ""-"999995THB00001" and country "AU" using api and "do not approve"
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction            | jurisdriction         | productFamily | restrictedCountries                         |
      | Resource Support Officer | Australia,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Bankuser "Approve" "new" workflow
    Then Validate jurisdictions and roles added against CA
      | adminFunction            | jurisdriction         | productFamily | restrictedCountries                         |
      | Resource Support Officer | Australia,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    # CreatedBankuser is able to View and Approve Resources
    Then Search the Resource in searchscreen and "Approve" "new" workflow
    Given create a legal entity using api and "do not approve"
    Then Search the Legal Entity in searchscreen and "Approve" "new" workflow
    # CreatedBankuser is able to register Resources
    Then Click on regsiter resources
    # And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "MDZ,CAP"
    And Register an Resource for account for "CAP" Host system with "013148" BSB and "9780219" accountNumber for "Australia" country
    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then Click on regsiter resources
    And Register an Resource for "Legal Entity" for "ABN" BIN Type for host system "CAP,CAP"
    #  Verifies View rights for CreatedBankuser
    #    Then Bankuser Verifies the view rights
    #      | Entity                 | Selector           | Status  |     Action          |
    #      | customer               | New Customer       | disable |                     |
    #      | division               | New Division       | disable |                     |
    #      | users                  | Register User      | disable |                     |
    #      | roles                  | New Role           | disable |                     |
    #      | authPanel              | New Panel          | disable |                     |
    #      | resourceGroup          | New Resource Group | disable |                     |
    Then BankUser logs out


  @chrome @COBRA @ONAR-6920 @BankUser @dev
  Scenario: Create a bankuser without any Bank User roles assigned and validating error message when logged in with that bankuser
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction  | jurisdriction | productFamily | restrictedCountries |
      | Payments Maker | Australia     |               |                     |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Bankuser "Approve" "new" workflow
    Then Validate jurisdictions and roles added against CA
      | adminFunction  | jurisdriction | productFamily | restrictedCountries |
      | Payments Maker | Australia     |               |                     |
    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then Corresponding notification message is displayed


  @chrome @COBRA @ONAR-7258 @ONAR-7367 @BankUser  
  Scenario Outline: Create/Modify/Register/Reject a new bankuser with all admin functions and all jurisdictions
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "<createdBankuserRandom>"
      | adminFunction | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | <RoleName>    | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then Search the BankUser in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Bankuser "Approve" "new" workflow
    Then Validate jurisdictions and roles added against CA
      | adminFunction | jurisdriction                   | productFamily                                                                                                                                               | restrictedCountries                         |
      | <RoleName>    | Trans Tasman,Asia,Pacific,Other | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App | Taiwan,Philippines,Cambodia,Indonesia,Japan |

    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then Verify if the "<Link1>" and "<Link2>" under Reports Menu is displayed "<isDisplayed>" for "<ReportTypes>"

    Examples:
      | createdBankuserRandom | RoleName                       | Link1       | Link2            | isDisplayed | ReportTypes |
      | random                | Helpdesk Officer               | Run Reports | Download Reports | true        | All         |
      | random                | Helpdesk Team Lead             | Run Reports | Download Reports | true        | All         |
      | random                | Security Device Officer        | Run Reports | Download Reports | true        | All         |
      | random                | Payments Officer               | Run Reports | Download Reports | false       | None        |
      | random                | Security Device Upload Officer | Run Reports | Download Reports | false       | None        |

