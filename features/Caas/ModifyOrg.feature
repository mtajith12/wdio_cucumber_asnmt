@chrome @ie @COBRA @OIM @ModifyOrg.feature
Feature: Modify ORG Screen end-to-end scenarios

  @AAMS-5278 @AAMS-422 @AAMS-421
  Scenario: COBRA UI: Add Application to CAAS Org - positive
    Given "Default OIM Bankuser" creates "1" organisations with no applications
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    And BankUser searches for the "1st" API created CAAS Org
    And BankUser opens the "1st" entry from search Org results
    And BankUser clicks on "Edit" button on Org Details page
    Then BankUser clicks "Add" application button on modify CAAS Org Screen
    Then verify the applications on Add applications page on modify Caas Org Screen for the "1st" API created org
    Then BankUser selects "eMatching,LM,GCP" Application in Application grid
    Then BankUser clicks on "Ok" button on Add applications page
    Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
    #AAMS-422
    Then BankUser clicks "Add" application button on modify CAAS Org Screen
    Then BankUser clicks on "Ok" button on Add applications page
    Then BankUser checks no application selected to be assigned notification message
    Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen
    Then BankUser clicks on "Cancel" button on Add applications page
    Then BankUser selects "eMatching,LM,GCP" Application in selected Application grid
    Then BankUser clicks "Remove" application button on modify CAAS Org Screen
    Then BankUser checks remove application notification message
    Then BankUser clicks "Yes" on the confirmation dialog on modify CAAS Org Screen
    Then Bankuser checks all Applications removed notification
    Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen


  @AAMS-5279 @AAMS-262 @AAMS-409 @AAMS-421 @AAMS-416 @AAMS-251 @AAMS-332
  Scenario: COBRA UI : Modify CAAS Org - Add and Remove and Submit Applications - positive
    Given "Default OIM Bankuser" creates "1" organisations with Transactive Global applications
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    And BankUser searches for the "1st" API created CAAS Org
    And BankUser opens the "1st" entry from search Org results
    And BankUser clicks on "Edit" button on Org Details page
    Then BankUser clicks "Add" application button on modify CAAS Org Screen
    Then verify the applications on Add applications page on modify Caas Org Screen for the "1st" API created org
    Then BankUser selects "eMatching,LM,GCP" Application in Application grid
    Then BankUser clicks on "Ok" button on Add applications page
    Then BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
    Then check Org modification has been submitted successfully notification message
    Then verify date and time were updated for new applications in CAAS Org
    Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                             | Action   |
      | Record was submitted and auto-approved. | Modified |
    And BankUser clicks on "Edit" button on Org Details page
    #AAMS-409-05
    Then BankUser clicks "Remove" application button on modify CAAS Org Screen
    Then BankUser checks no application selected to be removed notification message
    Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen
    Then BankUser selects "Transactive Global" Application in selected Application grid
    Then BankUser clicks "Remove" application button on modify CAAS Org Screen
    #AAMS-409-02
    Then BankUser checks remove application notification message
    Then BankUser clicks "No" on the confirmation dialog on modify CAAS Org Screen
    Then BankUser clicks "Remove" application button on modify CAAS Org Screen
    Then BankUser checks remove application notification message
    Then BankUser clicks "Yes" on the confirmation dialog on modify CAAS Org Screen
    Then BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
    Then check Org modification has been submitted successfully notification message
    Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                             | Action   |
      | Record was submitted and auto-approved. | Modified |

  @AAMS-5280 @AAMS-262 @AAMS-409 @AAMS-421 @AAMS-416 @AAMS-251 @AAMS-332
  Scenario: COBRA UI: Modify CAAS Org - Add and Remove Submit Applications - All Apps Removed - Positive
    Given "Default OIM Bankuser" creates "1" organisations with no applications
    Given "Registration Officer (Pilot)" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    And BankUser searches for the "1st" API created CAAS Org
    And BankUser opens the "1st" entry from search Org results
    And BankUser clicks on "Edit" button on Org Details page
    Then BankUser clicks "Add" application button on modify CAAS Org Screen
    Then verify the applications on Add applications page on modify Caas Org Screen for the "1st" API created org
    Then BankUser selects "eMatching,EsandaNet,GCIS,GCP,Institutional Insights,Internet Enquiry Access" Application in Application grid
    Then BankUser clicks on "Ok" button on Add applications page
    Then BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
    Then check Org modification has been submitted successfully notification message
    Then verify date and time were updated for new applications in CAAS Org
    Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                             | Action   |
      | Record was submitted and auto-approved. | Modified |
    And BankUser clicks on "Edit" button on Org Details page
    Then BankUser selects "eMatching,EsandaNet,GCIS,GCP,Institutional Insights,Internet Enquiry Access" Application in selected Application grid
    Then BankUser clicks "Remove" application button on modify CAAS Org Screen
    Then BankUser checks remove application notification message
    Then BankUser clicks "Yes" on the confirmation dialog on modify CAAS Org Screen
    #AAMS-409-04
    Then Bankuser checks all Applications removed notification
    Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen
    Then BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
    Then check Org modification has been submitted successfully notification message
    Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                             | Action   |
      | Record was submitted and auto-approved. | Modified |


  @AAMS-5281 @AAMS-228 @AAMS-333 @AAMS-416 @AAMS-251 @AAMS-333
  Scenario: COBRA UI: Modify Org - Delete Org - No apps or users
    Given "Default users" creates "1" organisations with no applications
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    And BankUser searches for the "1st" API created CAAS Org
    And BankUser opens the "1st" entry from search Org results
    Then BankUser clicks on "Delete" button on Org Details page
    Then BankUser clicks "No" on delete org confirmation message
    Then BankUser clicks on "Delete" button on Org Details page
    Then BankUser clicks "Yes" on delete org confirmation message
    Then check Org deletion has been submitted successfully notification message
    Then check Org Status set to "Deleted" and Workflow to Approved on View Org details page
    Then check that the Org has been removed from IDM for the "1st" API created Org
    Then BankUser clicks on "Audit" tab
    Then validate the Audit Scenarios for Org
      | Description                             | Action  |
      | Record was submitted and auto-approved. | Deleted |
    Then BankUser closes Org Details page
    Then check the "1st" row is grey-ed out

  @AAMS-5282 @AAMS-228
  Scenario: COBRA UI: Modify Org - Delete Org - No apps or users from Org Summary page
    Given "Default users" creates "1" organisations with no applications
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    When BankUser navigates to search CAAS Orgs page
    And BankUser searches for the "1st" API created CAAS Org
    And BankUser deletes the "1st" entry from "Actions" menu
    Then BankUser clicks "Yes" on delete org confirmation message
    Then check Org deletion has been submitted successfully notification from org summary grid
    Then check the "1st" row is grey-ed out
    And BankUser opens the "1st" entry from search Org results
    Then check Org Status set to "Deleted" and Workflow to Approved on View Org details page
    Then check that the Org has been removed from IDM for the "1st" API created Org