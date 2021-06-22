Feature: To test as a bankuser we are able to register an customer user for DSS account level entitlement
  As a Bank User
  I want to be able to register/approve/register/approve/reject the customer user and the changes to be reflected in CA for DSS account level entitlement

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
  @chrome @ie @COBRA @ONAR-3316
  Scenario Outline: 01.Create/Modify/Register/Reject customer user with Service Request - Approve and Service Request - Appoint roles with legal entity <admin> adminModel Customer
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "955648176" with bsb "012201" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "397096011" with bsb "012327" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it

    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Legal Entity" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for single adminModel with legal entity
    Then modify the user by adding "Service Request - Approve" entitlement with "Selected,Add Legal Entity" Resources

    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Appoint
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for single adminModel with legal entity
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin  |
      | Triple |
  @chrome @ie @COBRA @ONAR-3318
  Scenario Outline:02.Create/Modify/Register/Reject customer user with All  and Service Request - Create roles with legal entity <admin> adminModel Custom
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "954499594" with bsb "012351" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111263727" with bsb "015010" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "119990CAD00115" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Then Bankuser checks the accounts

    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "100189269" with bsb "013225" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "119990USD00358" with bsb "" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "119990USD00001" with bsb "" and country "Australia" and approves it

    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message

    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Service Request - Create" entitlement with "Selected,Add Legal Entity" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Create
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for single adminModel with legal entity
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin  |
      | Triple |
  @chrome @ie @COBRA @ONAR-3317
  Scenario Outline: 03.Create/Modify/Register/Reject customer user with Service Request - Appoint role with Account and modifying the same role<admin> adminModel Custom
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "955648176" with bsb "012201" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111263727" with bsb "015010" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Account" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    Then Bankuser checks the accounts
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "119990CAD00115" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Modifying "Service Request - Appoint" entitlement with "Selected,Add Account" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Appoint
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  validate the user is modified in CA for single adminModel with Account
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin  |
      | Triple |
  @chrome @ie @COBRA @ONAR-3316
  Scenario Outline: 04.Create/Modify/Register/Reject customer user with Service Request - Appoint role with Account and modifying the same role with legal entity <admin> adminModel Custom
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "248134862" with bsb "013026" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111263727" with bsb "015010" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197780USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Account" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then  validate the user is created in CA for single adminModel with Account
    Then modify the user by Modifying "Service Request - Appoint" entitlement with "Selected,Add Legal Entity" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Appoint
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for single adminModel with legal entity
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And BankUser logs out
    And validate the user is deregistered in CA
    Examples:
      | admin  |
      | Triple |
  @chrome @ie @COBRA @ONAR-3319  @dev
  Scenario Outline: 05.Create/Modify/Register/Reject customer user with Service Request - Appoint role with Account and modifying the same role with new legal entity <admin> adminModel Custom
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "954527647" with bsb "012010" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111263727" with bsb "015010" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Account" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    Then Bankuser checks the accounts
    Then Bankuser checks the legal entity
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system MDZ
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Modifying "Service Request - Appoint" entitlement with "Selected,Add Legal Entity" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Appoint
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |
  @chrome @ie @COBRA @ONAR-3318  @dev
  Scenario Outline: 06.Create/Modify/Register/Reject customer user with All, Service Request - Transact role with Account <admin> adminModel Custom
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "954581643" with bsb "012301" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111238871" with bsb "013440" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add All Entitlements with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Service Request - Transact" entitlement with "Selected,Add Account" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Transact
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  validate the user is modified in CA for single adminModel with Account
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |
  @chrome @ie @COBRA @ONAR-3316
  Scenario Outline: 07.Create/Modify/Register/Reject customer user with Service Request - Appoint, Service Request - Approve role with Account and legal entity<admin> adminModel Custom
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "954581643" with bsb "012301" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "111238871" with bsb "013440" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Legal Entity" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Service Request - Approve" entitlement with "Selected,Add Account" Resources
    Then validate the "modify" message
    Then Bankuser verifies the User details for Service Request - Approve
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Then  validate the user is modified in CA for single adminModel with Account
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin  |
      | Triple |
  #  @chrome @ie @COBRA @ONAR-3319 @progression
  #  Scenario: To verify the Manage Summary grid of Users entity
  #    Given  get user information
  #    Given "Default users" logins in to COBRA using a valid password
  #    When bankUser verifies the existing customer
  #    When bankUser verifies the existing User
  #    Then modify the user by adding "Service Request - Appoint" entitlement with "Selected,Add Legal Entity" Resources
  #    Then validate the "modify" message
  #    And BankUser logs out
  #    When  "Default approvers" logins in to COBRA using a valid password
  #    Then Approve the changes and validate the "modified" notification messages
  #    Then deregister the user
  #   And BankUser logs out

  @chrome @ie @COBRA @ONAR-3316
  Scenario Outline: 08.Create/Modify/Register/Reject customer user with Customer Admin and Loan Reporting roles, approve entitlements with None resources for <admin> adminModel Customer
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "954411628" with bsb "012341" and country "Australia" and approves it
    Then Bankuser registers a resource with "CAP" hostSystem with AccountNumber "110051458" with bsb "013510" and country "Australia" and approves it
    Then Bankuser registers a resource with "MDZ" hostSystem with AccountNumber "197921USD00001" with bsb "" and country "Australia" and approves it
    Then BankUser creates a legal entity with host system CAP,MDZ
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Legal Entity" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Service Request - Approve" entitlement with "Selected,Add Legal Entity" Resources
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then reject the changes and validate the "modified" notification messages
    And BankUser logs out
    Examples:
      | admin  |
      | Triple |


  @chrome @ie @COBRA @dev @ONAR-6939 @ONAR-7006 @ONAR-7081 @ONAR-7100 @DSSAccountGroups
  Scenario: 09.Register/Modify/Replicate customer user with Service Request roles with Legal Entity, Accounts and Account Groups for adminModel Customer
   
    ##Enable the commented rows for Division Level Entitlements and in Users.ts : Line 445

    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    ## HostIndex is the nth record of account belonging to given particular hostSystem
    Given create Account using api with below details
      | AccountIndex | AccountHost | HostIndex | Division | BSB    | AccountNumber  | Country | Action  |
      | 1            | CAP         | 1         | All      | 012201 | 955648176      | AU      | approve |
      | 2            | MDZ         | 1         | All      |        | 197921USD00001 | AU      | approve |
      | 3            | CAP         | 2         | All      | 012294 | 181077763      | AU      | approve |
      | 4            | CAP         | 3         | All      | 012294 | 905648160      | AU      | approve |
      | 5            | MDZ         | 2         | All      |        | 197921USD00061 | AU      | approve |
      | 6            | MDZ         | 3         | All      |        | 197921USD00091 | AU      | approve |

    ## 1,2 are the nth index values of accounts to be added
    Given create a legal entity using api for below details
      | Index | Product             | Division | AccountHost       | Action  |
      | 1     | Services            | All      | MDZ,1&3;CAP,1&2&3 | approve |
      | 2     | Services,Fulfilment | All      | MDZ,2             | approve |

    Given create resource group using api for below details
      | Index | AccountHost     | Action  |
      | 1     | MDZ,3;CAP,1&2&3 | approve |
      | 2     | MDZ,3&2         | approve |

    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add DSS Entitlements with Account groups and Resources and register the customeruser with :
      | RoleName                  | AddAccount        | AddResourceGroup | AddLegalEntity | Order                                                                  |
      | Service Request - Appoint | CAP,1,2 & MDZ,1,3 | 1,2              | 1,2            | Alldivisions,Selected,Add Account,Add Resource Group,Add Legal Entity |
      | Service Request - Create  | MDZ,1,2           | 2                | 2              | Alldivisions,Selected,Add Resource Group,Add Account,Add Legal Entity |
    # | Service Request - View    | CAP,1,3 & MDZ,2   | 1                | 2              | DivisionDss#1,Selected,Add Resource Group,Add Account,Add Legal Entity |
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Bankuser verifies the CAAS User details for DSS Account Groups
      | RoleName                  | Account_Fufil | Account_Service | ResourceGroup_Fulfil | ResourceGroup_Service | LegalEntity_Fulfil | LegalEntity_Service |
      | Service Request - Appoint |               |                 | 1,2                  | 1,2                   | 2                  | 1,2                 |
      | Service Request - Create  |               |                 | 2                    | 2                     | 2                  |  2                  |
    #  | Service Request - View    |               |                 | 2                    | 2                     | 2                  | 2                   |
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the caas user changes and validate the "register" notification messages
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then modify below DSS entitlements with Resources to CAASuser
      | RoleName                   | AddAccount | AddResourceGroup | AddLegalEntity | Order                                                |
      | Service Request - Transact | CAP,1,2    | 1                | 1              | Alldivisions,Selected,Add Account,Add Resource Group |
      | Service Request - Create   |            |                  |                | remove                                               |
      # | Service Request - View     |            |                  |                | remove                                               |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Bankuser verifies the CAAS User details for DSS Account Groups
      | RoleName                   | Account_Fufil | Account_Service | ResourceGroup_Fulfil | ResourceGroup_Service |  LegalEntity_Fulfil | LegalEntity_Service |
      | Service Request - Appoint  |               |                 | 1,2                  | 1,2                   |  2                  | 1,2                 |
      | Service Request - Transact |               |                 | 1                    | 1                     |                     |                     |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the caas user changes and validate the "modified" notification messages
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    When "Default users" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement | Resources |
      | replicate   |           |
    Then BankUser logs out
