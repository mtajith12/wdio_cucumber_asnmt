Feature: To test as a bankuser we are able to register an customer OIM user
  As a Bank User
  I want to be able to register/approve/Modify/approve/reject the customer user and the changes to be reflected in CA

  @chrome @ie @COBRA @ONAR-6109 @ONAR-6366 @ONAR-6240 @qa2  @dev @ONAR-6461

  Scenario: 01. Create  COBRA customer user with All Entitlements and approve entitlements with Selected resources for adminRole Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create billing entity using api and approve

    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"

    Given create a resource group using api
    Given create a legal entity using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser creates a role
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement                     | Resources                   |
      | All Entitlements                | Selected,Add,Division,1     |
      | Approve                         | Selected,Add Resource Group |
      | Service Request - Appoint       | Selected,Add Legal Entity   |
      | Custom Role                     | All                         |
      | Customer Admin                  | None                    |
      | CC03_Authorised Signatory       | Selected,Add,Division,1 |
      | Pilot - Trade Finance           | None                    |
      | Pilot - Report Centre           | None                    |
      | Pilot - Periodical Direct Debit | None                    |
      | Pilot - Pacific Payments        | None                    |
      | Supplier Explorer               | None                    |
      | Payable Modeller                | None                    |
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | All Entitlements,Selected,Add,Division,1; Approve,Selected,Add Resource Group;Service Request - Appoint,Selected,Add Legal Entity;Custom Role,All,;Customer Admin,None,;CC03_Authorised Signatory,Selected,Add,Division,1;Pilot - Trade Finance,None,;Pilot - Report Centre,None,;Pilot - Periodical Direct Debit,None,;Pilot - Pacific Payments,None,;Supplier Explorer,None,;Payable Modeller,None, |

    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then Search the customer in searchscreen and "Verify" "View" workflow
    Then Search the division in searchscreen and "Verify" "View" workflow
    And Compare the entitlements between COBRA and CAAS


  @chrome @ie @COBRA @ONAR-6109 @dev
  Scenario: 02. Create  COBRA customer user with replicate existing caas customer user
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"948794AUD00001" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"924837AUD00001" and country "AU" using api and "approve"
    Given create a resource group using api
    Given create a legal entity using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement      | Resources               |
      | All Entitlements | Selected,Add,Division,1 |
      | Customer Admin   | None                    |
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | replicate |
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    And Compare the entitlements between COBRA and CAAS



  @chrome @ie @COBRA @ONAR-6109 @dev
  Scenario: 03. Create a Resource and Customer User with entitlement containg the resource for adminRole Customer and Verify using the Bankuser with restricted country China
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      | adminFunction          | jurisdriction                             | productFamily | restrictedCountries                         |
      | Registration Officer   | Australia,Singapore,Hong Kong,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
      | Registration Team Lead | Australia,Singapore,Hong Kong,New Zealand |               | Taiwan,Philippines,Cambodia,Indonesia,Japan |
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser registers a restricted country "China" resource hostSystem "MDZ" and approves it
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | All Entitlements,Selected,Add,Division,1 |
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then View the "Cobra" User and its entitlements to verify Restricted country resource
    And BankUser logs out

  @ONAR-6109 @chrome @ie @COBRA  @dev
  Scenario Outline: 04. Verify the roles of Cobra User  with "<Products>" products and "<Jurisdiction>" jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "<Jurisdiction>" jurisdiction
    Then selects "AUD" as basecurrency
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser verifies User entitlements, with the created Customer, and with:
      | entitlements | <UserEntitlements> |
    Examples:
      | Products                                       | Jurisdiction                                    | UserEntitlements                                                                                              |
      | Commercial Cards,Omni Demo App                 | Australia,China,New Zealand,Singapore,Hong Kong | Cash Management;Clearing Services;Loans;Customer Administration;FX Overlay;FX Services;Institutional Insights |
      | Cash Management,Commercial Cards,Omni Demo App | Australia,China,New Zealand,Singapore,Hong Kong | Clearing Services;Loans;Customer Administration;FX Overlay;FX Services;Institutional Insights                 |

  @chrome @ie @COBRA @ONAR-6132

  Scenario: 08. Validate Remove Entitlements for FR Users

    Given create a customer using api
    Given create a "1" Division using api
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | All Entitlements,All;Omni Demo App;FX Overlay |
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then Validate cobra user "Remove Entitlement" functionality
    Then modify the cobra user by Removing entitlements "Omni Demo App,FX Overlay"
    And BankUser logs out

  @chrome @ie @COBRA @dev  @ONAR-6197
  Scenario Outline: 08. Create/verify that existing resource is not added when non-existing Resource is searched for FR user.
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    And BankUser logs out
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | All Entitlements,All |
    And BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then modify the cobra user by Modifying "All Entitlements" entitlement with "Selected,Add non-existing Account" Resources with Daily limit "" , Batch limit "",Transaction limit ""
    And BankUser logs out
    Examples:
      | admin  |
      | Single |


 @chrome @ie @COBRA @ONAR-6674 @dev 

  Scenario: 09. Modify COBRA customer user with All Entitlements and approve entitlements with Selected resources for adminRole Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create billing entity using api and approve

    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"

    Given create a resource group using api
    Given create a legal entity using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then BankUser creates a role
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser

      | entitlement               | Resources               |
      | All Entitlements          | Selected,Add,Division,1 |
      | CC03_Authorised Signatory | Selected,Add,Division,1 |

    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then modify and add below entitlements with Resources and register the customeruser
      | entitlement                     | Resources                   |
      | Approve                         | Selected,Add Resource Group |
      | Service Request - Appoint       | Selected,Add Legal Entity   |
      | Custom Role                     | All  |
      | Customer Admin                  | None |
      | Create FX Contracts             | All  |
      | Pilot - Report Centre           | None |
      | Pilot - Periodical Direct Debit | None |
      | Pilot - Pacific Payments        | None |
      | Supplier Explorer               | None |
      | Payable Modeller                | None |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      # | entitlements | All Entitlements,Selected,Add,Division,1; Approve,Selected,Add Resource Group;Service Request - Appoint,Selected,Add Legal Entity;Custom Role,All,;Customer Admin,None,;CC03_Authorised Signatory,Selected,Add,Division,1;Pilot - Trade Finance,None,;Pilot - Report Centre,None,;Pilot - Periodical Direct Debit,None,;Pilot - Pacific Payments,None,;Supplier Explorer,None,;Payable Modeller,None, |

      | entitlements | CC03_Authorised Signatory,Selected,Add,Division,1; All Entitlements,Selected,Add,Division,1|

    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then modify and add below entitlements with Resources to COBRAuser
      | entitlement                     | Resources                   |
      | Approve                         | Selected,Add Resource Group |
      | Service Request - Appoint       | Selected,Add Legal Entity   |
      | Custom Role                     | All                         |
      | Customer Admin                  | None                        |
      | Create FX Contracts             | All                         |
      | Pilot - Report Centre           | None                        |
      | Pilot - Periodical Direct Debit | None                        |
      | Pilot - Pacific Payments        | None                        |
      | Supplier Explorer               | None                        |
      | Payable Modeller                | None                        |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "modified" notification messages
    Then Search the customer in searchscreen and "Verify" "View" workflow
    Then Search the division in searchscreen and "Verify" "View" workflow
    And Compare the entitlements between COBRA and CAAS


    @chrome @ie @COBRA @ONAR-6674 @dev 

  Scenario: 10. Modify COBRA customer user with removing entitlements and add Selected resources in entitlements
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create billing entity using api and approve

    Given create a Account "CAP" "012294"-"181097963" and country "AU" using api and "approve"

    Given create a resource group using api
    Given create a legal entity using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser

      | entitlement               | Resources                   |
      | All Entitlements          | Selected,Add,Division,1     |
      | CC03_Authorised Signatory | Selected,Add,Division,1     |
      | Approve                   | Selected,Add Resource Group |
      | Service Request - Appoint | Selected,Add Legal Entity   |
      | Customer Admin            | None                        |
      | Create FX Contracts       | All                         |
      | Pilot - Report Centre     | None                        |
      | Payable Modeller          | None                        |

    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then modify and remove below entitlements with Resources and register the customeruser

      | entitlement               |
      | All Entitlements          |
      | Service Request - Appoint |
      | Create FX Contracts       |
      | Pilot - Report Centre     |
      | Payable Modeller          |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | All Entitlements,Selected,Add,Division,1; Approve,Selected,Add Resource Group;Service Request - Appoint,Selected,Add Legal Entity;Customer Admin,None,;CC03_Authorised Signatory,Selected,Add,Division,1;Pilot - Report Centre,None,;Create FX Contracts,All,;Payable Modeller,None, |
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then modify and remove below entitlements with Resources and register the COBRAuser

      | entitlement               |
      | All Entitlements          |
      | Service Request - Appoint |
      | Create FX Contracts       |
      | Pilot - Report Centre     |
      | Payable Modeller          |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "modified" notification messages
    Then Search the customer in searchscreen and "Verify" "View" workflow
    Then Search the division in searchscreen and "Verify" "View" workflow

    And Compare the entitlements between COBRA and CAAS


  @chrome @ie @COBRA @dev @ONAR-6940 @ONAR-7097 @ONAR-7081 @ONAR-7100 @DSSAccountGroups
  Scenario: 11. Create/Modify/Replicate Cobra OIM user with Service Request roles by adding/removing Account groups with Accounts and Legal entity
    
     ##Enable the commented rows for Division Level Entitlements and in Users.ts : Line 445

    Given  create a CAASUSER using CAAS api
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
    Given "Default OIM Bankuser" creates "1" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page

    ## new step created for DSS Account group entitlements,
    Then BankUser creates User with the created Org and DSS entitlements with Account Groups, with the created Customer, and :
      | RoleName                  | AddAccount        | AddResourceGroup | AddLegalEntity | Order                                                                  |
      | Service Request - Appoint | CAP,1,2 & MDZ,1,3 | 1,2              | 1,2            | Alldivisions,Selected,Add Account,Add Resource Group,Add Legal Entity  |
      | Service Request - Create  | MDZ,1,2           | 2                | 2              | Alldivisions,Selected,Add Resource Group,Add Account,Add Legal Entity  |
      # | Service Request - View   | CAP,1,3 & MDZ,2   | 1                | 2              | DivisionDss#1,Selected,Add Resource Group,Add Account,Add Legal Entity |
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password

    # ## This step verifies the view screen UI on how the entities appear in grid (fulfil/service) after adding the entitlements, we pass the nth entity's index value in the table
    # Then Bankuser verifies the COBRA User details for DSS entitlements with Account Groups
    #   | RoleName                  | Account_Fufil | Account_Service | ResourceGroup_Fulfil | ResourceGroup_Service |  LegalEntity_Fulfil | LegalEntity_Service |
    #   | Service Request - Appoint |               |                 | 1,2                  | 1,2                   |  2                  | 1,2                 |
    #   | Service Request - Create  |               |                 | 2                    | 2                     |  2                  | 2                   |
    # #  | Service Request - View    |               |                 | 2                    | 2                     | 2                  | 2                   |
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the cobra user changes and validate the "register" notification messages
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password

    # Modify - Add/Remove entitlement/Resources
    Then modify below DSS entitlements with Resources to COBRAuser
      | RoleName                   | AddAccount | AddResourceGroup | AddLegalEntity | Order                                                |
      | Service Request - Transact | CAP,1,2    | 1                | 1              | Alldivisions,Selected,Add Account,Add Resource Group |
      | Service Request - Create   |            |                  |                | remove                                               |
    # | Service Request - View     |            |                  |                | remove                                               |
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then modify by removing below individual Resources from DSS entitlements of COBRAuser
      | RoleName                  | Account_Fufil | Account_Service | ResourceGroup_Fulfil | ResourceGroup_Service | LegalEntity_Fulfil | LegalEntity_Service |
      | Service Request - Appoint |               |                 | 1                    | 2                     |                    | 1                   |

    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    # Then Bankuser verifies the COBRA User details for DSS entitlements with Account Groups
    #   | RoleName                   | Account_Fufil | Account_Service | ResourceGroup_Fulfil | ResourceGroup_Service | LegalEntity_Fulfil | LegalEntity_Service |
    #   | Service Request - Appoint  |               |                 | 2                    | 1                     | 2                  | 2                   |
    #   | Service Request - Transact |               |                 | 1                    | 1                     |                    |                     |
    Then Approve the cobra user changes and validate the "modified" notification messages
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default OIM Bankuser" creates "2" organisations with all applications
    Given "Default OIM Bankuser" logins in to COBRA using a valid password
    When BankUser navigates to "New User" page
    Then BankUser creates User with the created Org and entitlements, with the created Customer, and with:
      | entitlements | replicate |
    Then BankUser logs out


