Feature: As a Bank Administrator, i want to Create/Approve/Search/View/Modify a Auth Panel
  As a Bank User
  I want to be able to Create/Approve/Search/View/Modify a Auth Panel for Customer and changes to be reflected in CA

  Background: Register an customer and division


  @chrome @COBRA @ONAR-3518 @ONAR-3768 @dev

  Scenario Outline: 01.Create/Approve/Search/View/Modify a Auth Panel for Customer with all  hostSystem
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,New Zealand" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create "Default" division
    Then BankUser logs out
    And Bankuser registers a resource with "<HostSystem>" hostSystem with AccountNumber "<AccountNumber>" with bsb "<BSB>" and country "<Country>" and approves it
    Given "Default users" logins in to COBRA using a valid password
    And BankUser creates a Auth Panel
    Then Validate the "register" message for authPanel
    Then Search the Auth Panel in searchscreen and "Verify" "new" workflow
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the Auth Panel in searchscreen and "Approve" "new" workflow
    Then Validate against CA for Auth Panel "Approve" "new" workflow
    Then BankUser edits the auth panel
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the Auth Panel in searchscreen and "Approve" "modify" workflow
    Then Validate against CA for Auth Panel "Approve" "modify" workflow
    Then BankUser logs out
    Examples:
      | HostSystem | BSB | AccountNumber  | Country   |
      | MDZ        |     | 999996AUD00001 | Australia |


@chrome @COBRA @ONAR-3822  @dev
Scenario Outline: 02.Create/Approve/View a Auth Panel for Customer with all <HostSystem> hostSystem and verify the edited Account Name
  Given "Default users" logins in to COBRA using a valid password
  When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,New Zealand" jurisdiction
  Then click on continue and select the products
  Then Register the user
  Then create "Default" division
  Then BankUser logs out
  Then Bankuser registers a resource with "<HostSystem>" hostSystem with AccountNumber "<AccountNumber>" with bsb "" and country "<Country>" and approves it
  Given "Default users" logins in to COBRA using a valid password
  And BankUser creates a Auth Panel
  Then Validate the "register" message for authPanel
  Then Search the Auth Panel in searchscreen and "Verify" "new" workflow
  Then BankUser logs out
  When "Default approvers" logins in to COBRA using a valid password
  Then Search the Auth Panel in searchscreen and "Approve" "new" workflow
  Then Validate against CA for Auth Panel "Approve" "new" workflow
  Then View the Account in the Auth Panel and verify the Account Name on the View screen
  Then BankUser edits the Account resource
  Then Validate the "modify" message for "accounts"
  Then BankUser logs out
  When "Default users" logins in to COBRA using a valid password
  Then Search the Resource in searchscreen and "Approve" "modify" workflow
  Then validate against CA for "Approve" "modify" workflow for "Accounts"
  Then View the Account in the Auth Panel and verify the Account Name on the View screen
  Then BankUser logs out
  Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 999996AUD00001 | Australia |
  
  @e2e @chrome @COBRA
  Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 157818USD00300 | Australia |
  
@chrome @COBRA @ONAR-3591  @dev
Scenario Outline: 03.Create/Modify/Validate Audit for Auth Panel for Customer with all <HostSystem> hostSystem
  Given "Default users" logins in to COBRA using a valid password
  When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,New Zealand" jurisdiction
  Then click on continue and select the products
  Then Register the user
  Then create "Default" division
  Then BankUser logs out
 And Bankuser registers a resource with "<HostSystem>" hostSystem with AccountNumber "<AccountNumber>" with bsb "<BSB>" and country "<Country>" and approves it
  Given "Default users" logins in to COBRA using a valid password
  And BankUser creates a Auth Panel
  Then Validate the "register" message for authPanel
  Then Search the Auth Panel in searchscreen and "Verify" "new" workflow
  Then BankUser logs out
  When "Default approvers" logins in to COBRA using a valid password
  Then Search the Auth Panel in searchscreen and "Approve" "new" workflow
  Then Validate against CA for Auth Panel "Approve" "new" workflow
  Then executing additional CA validations for Auth Panel - "Create"
  Then BankUser edits the auth panel
  Then BankUser logs out
  When "Default users" logins in to COBRA using a valid password
  Then Search the Auth Panel in searchscreen and "Approve" "modify" workflow
  Then Validate against CA for Auth Panel "Approve" "modify" workflow
  Then executing additional CA validations for Auth Panel - "Modify"
  Then BankUser validates the Audit Scenarios for Auth Panel
    | Description                                     | Action   |
    | Record was created and submitted for approval.  | Created  |
    | Record was approved and created.                | Approved |
    | Record was modified and submitted for approval. | Modified |
    | Changes to Record were approved.                | Approved |
  Then BankUser logs out
  Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 999996AUD00001 | Australia |



@chrome @COBRA @ONAR-6181  @dev
Scenario Outline: 04.Create/Modify/Reject for Auth Panel for Customer with all <HostSystem> hostSystem
  Given "Default users" logins in to COBRA using a valid password
  When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,New Zealand" jurisdiction
  Then click on continue and select the products
  Then Register the user
  Then create "Default" division
  Then BankUser logs out
  And Bankuser registers a resource with "<HostSystem>" hostSystem with AccountNumber "<AccountNumber>" with bsb "<BSB>" and country "<Country>" and approves it
  Given "Default users" logins in to COBRA using a valid password
  And BankUser creates a Auth Panel
  Then Validate the "register" message for authPanel
  Then Search the Auth Panel in searchscreen and "Verify" "new" workflow
  Then BankUser logs out
  When "Default approvers" logins in to COBRA using a valid password
  Then Search the Auth Panel in searchscreen and "Approve" "new" workflow
  Then Validate against CA for Auth Panel "Approve" "new" workflow
  Then BankUser edits the auth panel
  Then BankUser logs out
  When "Default users" logins in to COBRA using a valid password
  Then Reject the changes and validate the "modified" notification messages for Auth Panel
  Then BankUser logs out
 Examples:
    | HostSystem | BSB | AccountNumber  | Country   |
    | MDZ        |     | 999996AUD00001 | Australia |


@chrome @ie @COBRA @dev @e2e @ONAR-3667
Scenario: To verify the Manage Summary grid of Auth Panel entity
  Given "Default approvers" logins in to COBRA using a valid password
  Then validate the elements present in the Auth Panel screen
  And BankUser logs out
