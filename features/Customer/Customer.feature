
Feature: As a Bank Administrator, i want to register/Approve/Modify/deregister a Customer
  As a Bank User
  I want to be able to register/approve/register/approve/reject Customer and  and the changes to be reflected in CA

  @ONAR-5994 @chrome @ie @COBRA   @dev  @qa2 @ONAR-6245 @ONAR-6459 @ONAR-6974
  Scenario Outline: 01. Create/Modify/Register/Reject customer with "<Products>" products and "<Jurisdiction>" jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "<Jurisdiction>" jurisdiction
    Then selects "AUD" as basecurrency
    Then click on continue and select the products
    Then Register the user
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the customer with "Omni Demo App" and "Vietnam" jurisdiction
    Then Validate the "modify" message for customer
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Reject the changes and validate the "modified" notification messages for the Customer
    Then BankUser edits the customer with "Omni Demo App" and "Vietnam" jurisdiction
    Then Validate the "modify" message for customer
    Then BankUser edits the customer with "Pilot Products" and "Singapore" jurisdiction
    Then Validate the "modify" message for customer
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the customer in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Customer" "Approve" "modify" workflow
    Then Search the customer in searchscreen and "Verify" "disable" workflow
    Then validate against CA for "Customer" "Verify" "disable" workflow
    Then Search the customer in searchscreen and "Verify" "enable" workflow
    Then validate against CA for "Customer" "Verify" "enable" workflow
    Then BankUser logs out

    Examples:

      | Products                         | Jurisdiction               |
      | Cash Management,Commercial Cards,Omni Demo App,Institutional Insights,Pilot Products | Australia,China,India,Fiji |
      | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,Pilot Products,Omni Demo App |Australia,China,New Zealand,Hong Kong|
      | Institutional Insights|Australia,China,India,Fiji|

 @chrome @ie @COBRA @TC-ONAR-3709 @TC-ONAR-3982 @dev @qa2
  Scenario Outline: 02. Create/Modify/Register/Reject customer with "<Products>" products and "<Jurisdiction>" jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "<Jurisdiction>" jurisdiction
    Then selects "AUD" as basecurrency
    Then click on continue and select the products
    Then Register the user
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then BankUser edits the customer with Retail Customer option as "yes"
    Then Validate the "modify" message for customer
    Then BankUser edits the customer with "Customer Administration" and "Vietnam" jurisdiction
    Then Validate the "modify" message for customer
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Search the customer in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Customer" "Approve" "modify" workflow
    Then Search the customer in searchscreen and "Verify" "disable" workflow
    Then validate against CA for "Customer" "Verify" "disable" workflow
    Then Search the customer in searchscreen and "Verify" "enable" workflow
    Then validate against CA for "Customer" "Verify" "enable" workflow
    Then BankUser logs out

    Examples:
      | Products                                                                         | Jurisdiction                                                                                                                                                                                     |
      | Cash Management,Customer Administration,Commercial Cards,Clearing Services,Loans | Australia,China,Philippines,Taiwan,Thailand,Cook Islands,Fiji,Kiribati,Lao People's Democratic Republic,Myanmar,Papua New Guinea                                                                 |
      | Cash Management,Customer Administration                                          | Philippines,Cook Islands,Fiji,Kiribati,Lao People's Democratic Republic,Myanmar,Papua New Guinea                                                                                                 |
      | Cash Management,Customer Administration                                          | Cambodia,India,Indonesia,Philippines,Taiwan,Thailand,Cook Islands,Fiji,Kiribati,Myanmar,Papua New Guinea,Samoa,Solomon Islands,Timor-Leste,Tonga,Vanuatu,United Kingdom,United States of America |


  @chrome @ie @COBRA @ONAR-6023 @dev @e2e
  Scenario Outline: 03. Create/Modify/Validate Audit scenario for Customer with "<Products>" products and "<Jurisdiction>" jurisdiction
    Given "Default users" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Dual" the necessary information and selects the "<Products>" products and "<Jurisdiction>" jurisdiction
    Then selects "AUD" as basecurrency
    Then click on continue and select the products
    Then Register the user
    Then BankUser validated the Audit Scenarios for Customer
      | Description                                    | Action   |
      | Record was created and submitted for approval. | Created  |
      | Record was approved and created.               | Approved |
    Then BankUser edits the customer with "Omni Demo App" and "Vietnam" jurisdiction
    Then Validate the "modify" message for customer
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the customer in searchscreen and "Approve" "modify" workflow
    Then validate against CA for "Customer" "Approve" "modify" workflow
    Then BankUser validated the Audit Scenarios for Customer
      | Description                                     | Action   |
      | Record was modified and submitted for approval. | Modified |
      | Changes to Record were approved.                | Approved |
    Then BankUser logs out
    Examples:
      | Products                                                                                                                                     | Jurisdiction                                    |
      | Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App | Australia,China,New Zealand,Singapore,Hong Kong |


@chrome @ie @COBRA @dev  @ONAR-6249 @ONAR-6281
  Scenario: To View the entities from Customer Screen
    Given create a customer using api
    Given create a "1" Division using api
    Given create a Account "CAP" "013350"-"199625728" and country "AU" using api and "approve"
    Given create billing entity using api and approve
    Given create a legal entity using api and "approve"
    Given create a term deposit for "CMM" hostSystem "127128" client Id and "AU" country using api and "approve"
    Given create a resource group using api
    Given create "1" CAASUSER using CAAS api
    Then Register CAAS User using api
    Given create a Role using api
    Given "Default users" logins in to COBRA using a valid password
    Then View the entities from the Customer screen
    And BankUser logs out


@chrome @ie @COBRA @dev @ONAR-3983
  Scenario: To verify the error message when we try to delete the Customer when only Auth Panel linked to it
    Given create a customer using api
    Given create AuthPanel using api
     Given "Default users" logins in to COBRA using a valid password
    Then Delete the customer and check the error message
    And BankUser logs out


  @chrome @ie @COBRA @dev @e2e @ONAR-6024
  Scenario: To verify the Manage Summary grid of customers entity
    Given "Default users" logins in to COBRA using a valid password
    Then validate the elements present in the Customer screen
    And BankUser logs out


