Feature: As a Bank Administrator, i want to register/Approve/Modify/deregister a Division
  As a Bank User
  I want to be able to register/approve/register/approve/reject Division and  and the changes to be reflected in CA
  @chrome @ie @COBRA @ONAR-3320 @ONAR-3701 @dev  @qa2 @ONAR-6245
  Scenario Outline: 01. Create/Modify/Register/Reject Division with All features
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "Australia,China,Hong Kong,New Zealand,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the division with "Omni Demo App"
    Then Validate the "modify" message for division
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for the Division
    Then BankUser edits the division with "Omni Demo App"
    Then Validate the "modify" message for division
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the division in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Division" "Approve" "modify" workflow
    Then Search the division in searchscreen and "Verify" "disable" workflow
    Then validate against CA for "Division" "Verify" "disable" workflow
    Then Search the division in searchscreen and "Verify" "enable" workflow
    Then validate against CA for "Division" "Verify" "enable" workflow
    Then BankUser logs out
    Examples:
    |Products|
    |Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|


  @chrome @ie @COBRA @ONAR-3719 @ONAR-6460 @dev @qa2
  Scenario Outline: 02. Create/Modify/Register/Reject child Division with All features
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "Australia,China,Hong Kong,New Zealand,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then create child division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the parent division
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the parent division in searchscreen and "Approve" "modify" workflow and validate against CA
    Then BankUser edits the division with "Pilot Products"
    Then Validate the "modify" message for division
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the division in searchscreen and "Approve" "modify" workflow
    Then Search the parent division in searchscreen and "Verify" "disable" workflow and validate against CA
    Then Search the parent division in searchscreen and "Verify" "enable" workflow and validate against CA
    Then BankUser logs out
    Examples:
      |Products|
      |Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Pilot Products,Omni Demo App|

  @chrome @ie @COBRA @dev @e2e @ONAR-6025 @qa2
  Scenario: To verify the Manage Summary grid of Divisions entity
    Given "Default approvers" logins in to COBRA using a valid password
    Then validate the elements present in the Division screen
    And BankUser logs out

  @chrome @ie @COBRA @ONAR-6026 @ONAR-3978 @dev @e2e
  Scenario Outline: 03. Create/Modify/Validate Audit for Division with all features
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "Australia,China,Hong Kong,New Zealand,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then BankUser validated the Audit Scenarios for Division
      | Description                        | Action   |
      | Record was submitted for creation. | Created  |
      | Record was approved and created.   | Approved |
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the division with "Omni Demo App"
    Then Validate the "modify" message for division
    When "Default users" logins in to COBRA using a valid password
    Then Search the division in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Division" "Approve" "modify" workflow
    Then BankUser validated the Audit Scenarios for Division
      | Description                                     | Action   |
      | Record was modified and submitted for approval. | Modified |
      | Changes to Record were approved.                | Approved |
    Then BankUser logs out

    Examples:
      | Products                                                                                                                                     |
      | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App |


  @chrome @ie @COBRA @ONAR-6093 @dev @qa2
  Scenario Outline: 04. Create/Modify/Register/Reject Division with All features
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "Australia,China,Hong Kong,New Zealand,Singapore" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then create division with "<Products>" with "Additional file formats", "000155,1234" DEuserId & DDcode and Authorisation Model Settings with "All,Panel" model with "China" FX settings
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the division by removing entitilement "AU Domestic (Direct Debit),NZ Domestic (Direct Debit)"
    Then Validate the "modify" message for division
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the division in searchscreen and "Approve" "modify" workflow
    Then BankUser logs out

    Examples:
      |Products|
      |Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|

