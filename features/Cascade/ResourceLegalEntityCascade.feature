Feature: To test as a bankuser data is cascading for Resource-Legal entity
  As a Bank User
  I want to be able to add/remove various actions and verify the cascading feature

  Background: Create CAAS user
    Given  create a CAASUSER using CAAS api
    Given create a customer using api
    Given create a "1" Division using api
    Given create a "2" Division using api
    Given create a Account "CAP" "015208"-"285414708" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"948794AUD00001" and country "AU" using api and "approve"
    Given create a Account "MDZ" ""-"924837AUD00001" and country "AU" using api and "approve"
    Given create a legal entity using api and "approve"

  @chrome @ie @COBRA @ONAR-3429 @dev @e2e
  Scenario: 01. Verify the cascade Resource for  Resource-Legal entity -Action-Remove Legal Entity Account

    Given "Default approvers" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Legal Entity" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    Then Bankuser "Removes" "1" "Account" of "LegalEntity" and approve the changes
    Then verify "Users" with "Service Request - Appoint" entitlement if the "1" "Legal Entity" are "removed"
    Then BankUser logs out

  @chrome @ie @COBRA @ONAR-6021 @dev @e2e
  Scenario: 05. Verify the cascade feature for customer -Action-Addition/Removal of Product -Fulfilment
    Given "Default approvers" logins in to COBRA using a valid password
    When bankUser verifies the created customer
    Then search for created user in cobra
    Then add "Service Request - Appoint" with "Selected,Add Legal Entity" Resources and register the customeruser
    Then validate the "register" message
    Then Bankuser verifies the User details for Service Request - Appoint
    Then BankUser logs out
    When "Default users" logins in to COBRA using a valid password
    Then Approve the changes and validate the "register" notification messages
    When Bankuser verifies division doesnt have "Fulfilment" "Product" from "Cash Management"
    Then BankUser logs out

