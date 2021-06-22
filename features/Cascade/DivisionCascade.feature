Feature: To test as a bankuser data is cascading for Division
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api


  @chrome @ie @COBRA @ONAR-3427 @dev @e2e
  Scenario: 01. Verify the cascade feature for Division -Action-Removal of product family
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "CC03_Authorised Signatory" with "Selected,Add,Division,1" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Commercial Cards" "Product Family" of Division and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then verify "Users" with "CC03_Authorised Signatory" entitlement if the "Commercial Cards" "Product Family" are "removed"

  @chrome @ie @COBRA @ONAR-6019 @dev @e2e
  Scenario: 02. Verify the cascade feature for Division -Action-Removal/Added of product
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "All Institutional Insights" with "Selected,Add" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Transaction Banking Insights" "Product" from "Institutional Insights" of Division and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then verify "Users" with "All Institutional Insights" entitlement if the "Transaction Banking Insights" "Product" are "removed"
    Then Bankuser "adds" "Transaction Banking Insights" "Product" from "Institutional Insights" of Division and approve the changes
    Then verify "Users" with "All Institutional Insights" entitlement if the "Transaction Banking Insights" "Product" are "added"



  @chrome @ie @COBRA @ONAR-6019 @dev @ONAR-6245 @e2e
  Scenario: 02. Verify the cascade feature for Division -Action-Removal/Added of Supply Chain Finance product
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "All Institutional Insights" with "Selected,Add" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Supply Chain Finance" "Product" from "Institutional Insights" of Division and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then verify "Users" with "All Institutional Insights" entitlement if the "Supply Chain Finance" "Product" are "removed"
    Then Bankuser "adds" "Supply Chain Finance" "Product" from "Institutional Insights" of Division and approve the changes
    Then verify "Users" with "All Institutional Insights" entitlement if the "Supply Chain Finance" "Product" are "added"
  
  
  
  @chrome @ie @COBRA  @dev @ONAR-6524
  Scenario: 02. Verify the cascade feature for Division -Action-Removal/Added of Pilot Product product
    
    Given "Default users" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "Pilot - Trade Finance" with "None" Resources and register the customeruser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Pilot - Trade Finance" "Product" from "Pilot Products" of Division and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then Bankuser "removes" "Pilot - Trade Finance" "Product" from "Pilot Products" of Customer and approve the changes
    Then BankUser logs out
    Given "Default users" logins in to COBRA using a valid password
    Then verify "Users" with "Pilot - Trade Finance" entitlement is "removed"
