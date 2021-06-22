Feature: To test as a bankuser we are able to register an customer user
  As a Bank User
  I want to be able to register/approve/register/approve/reject the customer user and the changes to be reflected in CA

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api

  @chrome @ie @COBRA @ONAR-6107 @dev @qa2
  Scenario Outline: : 01. Create USer and Bulk Approve.
    Given create a customer using api
    Given create a "1" Division using api
    Given create "4" CAASUSER using CAAS api
    Then Register "4" CAAS User using api
    When "Default approvers" logins in to COBRA using a valid password
    Then Bulk approve "4" entities and validate the "register" notification messages
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-2266 @qa2 @ONAR-6119
  Scenario Outline: 02. Create/Modify/Register/Reject customer user with FX Overlay and Omni Demo App entitlements for <admin> adminRole Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "FX Overlay" with "None" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Adding "Omni Demo App" entitlement with "None" Resources
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for "<admin>" adminModel
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-6052 @dev @qa2 @progression
  Scenario Outline: 03. Create/Modify/Register/Reject customer user with All Entitlements and approve entitlements with All resources for <admin> adminRole Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    #Note: if the daily limit is already set for the User , the value will not be edited , only the fields with no Value set would be editied.
    Then add All Entitlements with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Approve" entitlement with "All" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for "<admin>" adminModel
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-6053 @qa2
  Scenario Outline: 04. Create/Modify/Register/Reject customer user with All Entitlements and approve entitlements with None resources for <admin> adminRole Customer
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    #Note: if the daily limit is already set for the User , the value will not be edited , only the fields with no Value set would be editied.
    Then add All Entitlements with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Approve" entitlement with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for "<admin>" adminModel
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin  |
      | Single |
      | Dual   |
      | Triple |

  @chrome @ie @COBRA @ONAR-2266 @ONAR-3296 @qa2
  Scenario Outline: 05. Create/Modify/Register/Reject customer user with Customer Admin and Loan Reporting roles, approve entitlements with None resources for <admin> adminModel Customer
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    #Note: if the daily limit is already set for the User , the value will not be edited , only the fields with no Value set would be editied.
    Then add "Loan Reporting" with "None" Resources and register the customeruser
    #Then add All Entitlements with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000" and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by adding "Customer Admin" entitlement with "None" Resources with Daily limit "" , Batch limit "10000",Transaction limit "10000"
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    And validate the user is modified in CA for "<admin>" adminModel
    Then  "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "deregister" notification messages
    And validate the user is deregistered in CA
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-3780  @cit @fixlater
  Scenario Outline: 06. Create a Resource and Customer User with entitlement and the resource for <admin> adminRole Customer and Verify using the Bankuser with restricted country China
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
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then Bankuser registers a restricted country "China" resource hostSystem "MDZ" and approves it
    Then BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then View the Resource to validate Restricted Country
    Then Verify "Resource" if "China" "Country" is displayed
    And BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "All Entitlements" with "Selected,Add" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    And BankUser logs out
    When "created bankuserDefault" logins in to COBRA using a valid password
    Then View the "Caas" User and its entitlements to verify Restricted country resource
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-6178 @dev
  Scenario Outline: 07. Create/Register/Re-Register customer user with FX Overly and Omni Demo App entitlements for <admin> adminRole Customer
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "FX Overlay" with "None" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And validate the user is created in CA for "<admin>" adminModel
    Then modify the user by Adding "Omni Demo App" entitlement with "None" Resources
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    Then BankUser validated the Audit Scenarios for Customer User
      | Description                                         | Action       |
      | Record was created and submitted for approval.      | Created      |
      | Record was approved and created.                    | Approved     |
      | Record was modified and submitted for approval.     | Modified     |
      | Changes to Record were approved.                    | Approved     |
      | Record was deregistered and submitted for approval. | Deregistered |
    And BankUser logs out
    Examples:
      | admin  |
      | Single |

  @chrome @ie @COBRA @dev @e2e @ONAR-6106
  Scenario: To verify the Manage Summary grid of customers entity
    Given "Default users" logins in to COBRA using a valid password
    Then validate the Summary Grid for FR users
    And BankUser logs out

  @chrome @ie @COBRA @ONAR-3985
  Scenario Outline: 08. Create/verify that ForgeRock Users should not to be displayed in the Customer User Search results via 'Register User' <admin> adminRole Customer
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then verify if the FR users are present in search grid of CAAS Organisation
    Then BankUser logs out
    Examples:
      | admin  |
      | Single |

  @chrome @ie @COBRA @ONAR-6132
  Scenario: 09. Validate Remove Entitlements for Users
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "None" with "None" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then Validate "Remove Entitlement" functionality
    Then modify the user by Adding "Omni Demo App,FX Overlay" entitlement with "None" Resources
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then modify the user by Removing entitlements "Omni Demo App,FX Overlay"
    And BankUser logs out

 @chrome @ie @COBRA @ONAR-6360 @ONAR-6362 @notYetdeveloped
  Scenario Outline: 10. Create/Register/Modify customer user with Create FX Contracts entitlement for <admin> adminRole Customer
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "<admin>" the necessary information and selects the "FX Services" products and "Australia,China,Hong Kong,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    And create fx organisation for country "AU" using api
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add "Create Fx Contracts" with "None" Resources and register the customeruser
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then modify the user by Adding "Create Fx Contracts" entitlement with "Selected,Add" Resources
    Then validate the "modify" message
    And BankUser logs out
    When  "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "modified" notification messages
    Then deregister the user
    And BankUser logs out
    Examples:
      | admin |
      | Dual  |

  @chrome @ie @COBRA @ONAR-6312  @dev
  Scenario: Validate Replicate functionality
    Given create a customer using api
    Given create a "1" Division using api
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement                           | Resources|
      |FX Overlay                     |None |
      |Omni Demo App |None |
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default users" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement                           | Resources|
      |replicate    |  |

  @chrome @ie @COBRA @ONAR-6542  @dev
  Scenario: Validate Replicate functionality for VAM Accounts and verify the entitlements
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "VAM" "013350"-"12362572" and country "SG" using api and "approve"
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then BankUser logs out
    Given "Default approvers" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement                           | Resources|
      |All Entitlements                    |Selected,Add,Division,1|
    Then validate the "register" message
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given  create a CAASUSER using CAAS api
    Given "Default users" logins in to COBRA using a valid password
    Then search for created user in cobra
    Then add below entitlements with Resources and register the customeruser
      | entitlement                           | Resources|
      |replicate    |  |
    Then validate the "register" message
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Given "Default users" logins in to COBRA using a valid password
    Then validate the user with
      | entitlements                         | Product            | Type      |
      |All Entitlements                      | Reporting - Accounts |  Resource   |

  @chrome @ie @COBRA @ONAR-7010 @dev
  Scenario: Validate Remove Entitlement message with all entitlements removed
    Given create a customer using api
    And create a "1" Division using api
    When "Default users" logins in to COBRA using a valid password
    Then bankUser verifies the created customer
    And BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    And search for created user in cobra
    And add below entitlements with Resources and register the customeruser
      | entitlement   | Resources |
      | FX Overlay    | None      |
      | Omni Demo App | None      |
    Then validate the "register" message
    And BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    And BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    And remove below entitlements for the customeruser
      | entitlement   |
      | FX Overlay    |
      | Omni Demo App |
    Then validate remove entitlement message with no entitlements
