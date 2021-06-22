@chrome @ie @COBRA @OIM
Feature: Modify Org Screen validations

    @AAMS-5283 @AAMS-404 @AAMS-411 @AAMS-407 @AAMS-40 @AAMS-412 @AAMS-227 @AAMS-409 @AAMS-410 @AAMS-421 @AAMS-854
    Scenario: COBRA UI: Modify Org - Enable Edit, Delete, Add Applications option on Org Summary Grid
        Given "Default users" creates "1" organisations with Transactive Global,LM applications
        Given "Default users" creates "2" users with the "1st" created Org, without a Customer, and with:
            | applications | LM;Transactive Global |
        Given "Default OIM Bankuser" approves the "1st" created user
        Given "Default OIM Bankuser" approves the "2nd" created user
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser selects the "1st" entry
        #AAMS-854 #AAMS-411
        Then check "Edit" options are "Enabled" in Context Menu for the selected entry/entries
        Then check "Edit" options are "Enabled" in Actions Menu for the selected entry/entries
        Then check "Delete" options are "Enabled" in Context Menu for the selected entry/entries
        Then check "Delete" options are "Enabled" in Actions Menu for the selected entry/entries
        And BankUser opens the "1st" entry from search Org results
        #AAMS-407
        Then check the "Edit" option is displayed on the view CAAS Org Screen
        #AAMS-412
        Then check the "Delete" option is displayed on the view CAAS Org Screen
        Then BankUser view the Org details with applications
        Then check number of active Users under App "LM" is 2
        Then check number of active Users under App "Transactive Global" is 2
        And BankUser clicks on "Edit" button on Org Details page
        #AAMS-227 #AAMS-410-02 #AAMS-410-04
        Then check the "Add" applications button is "Enabled" on modify CAAS Org Screen
        Then check the "Remove" applications button is "Enabled" on modify CAAS Org Screen
        Then BankUser clicks "Add" application button on modify CAAS Org Screen
        Then verify the applications on Add applications page on modify Caas Org Screen for the "1st" API created org
        Then BankUser selects "GCIS" Application in Application grid
        Then BankUser clicks on "Cancel" button on Add applications page
        Then verify the selected applications on modify Caas Org Screen for the "1st" API created org
        Then check the "Submit" option is displayed on the view CAAS Org Screen
        Then check the "Cancel" option is displayed on the view CAAS Org Screen
        #AAMS-40-2
        And BankUser clicks on "Cancel" button for Org Modification and clicks "No" on the confirmation for the "1st" API created org
        And BankUser clicks on "Cancel" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org


    @AAMS-5284 @AAMS-405 @AAMS-410
    Scenario: COBRA UI: Modify Org - check no applications assigned
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        Then check the "No Record Found" message in the applications grid on modify caas org page
        #AAMS-410-03
        Then check the "Remove" applications button is "Disabled" on modify CAAS Org Screen

    @AAMS-5285 @AAMS-405 @AAMS-410 @AAMS-421
    Scenario: COBRA UI: Modify Org - All Apps Assigned
        Given "Default users" creates "1" organisations with all applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        #AAMS-410-01 #AAMS-410-04 #AAMS-421-03
        Then check the "Add" applications button is "Disabled" on modify CAAS Org Screen
        Then check the "Remove" applications button is "Enabled" on modify CAAS Org Screen

    @AAMS-5286 @AAMS-404 @AAMS-411 @AAMS-412 @AAMS-407
    Scenario: COBRA UI: Modify Org - Check options when CAAS Org is deleted
        Given "Default users" creates "1" organisations with no applications
        Then "Default users" deletes the "1st" API created org
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser selects the "1st" entry
        #AAMS-411-03
        Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries
        Then check "Delete" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Delete" options are "Disabled" in Actions Menu for the selected entry/entries
        And BankUser opens the "1st" entry from search Org results
        #AAMS-407
        Then check the "Edit" option is NOT displayed on the view CAAS Org Screen
        #AAMS-412-03
        Then check the "Delete" option is NOT displayed on the view CAAS Org Screen

    @AAMS-5287 @AAMS-404 @AAMS-411 @AAMS-407
    Scenario Outline: COBRA UI: Modify Org - Hide Edit and Delete option on Org Summary Grid
        Given "Default users" creates "1" organisations with no applications
        When "<role>" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser selects the "1st" entry
        Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries
        #AAMS-411-02
        Then check "Delete" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Delete" options are "Disabled" in Actions Menu for the selected entry/entries
        And BankUser opens the "1st" entry from search Org results
        #AAMS-407
        Then check the "Edit" option is NOT displayed on the view CAAS Org Screen
        #AAMS-412-02
        Then check the "Delete" option is NOT displayed on the view CAAS Org Screen
        Examples:
            | role                     |
            | Helpdesk Officer (Pilot) |
            | Implementation Manager   |

    @AAMS-5288 @AAMS-404 @AAMS-411
    Scenario: COBRA UI: Modify Org - Multiple Records Selected
        Given "Default users" creates "2" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        Then BankUser Search orgs with comma separated values in ID and verify results
        And BankUser selects the "1st" and "2nd" entries
        Then check "Edit" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Edit" options are "Disabled" in Actions Menu for the selected entry/entries
        #AAMS-411-04
        Then check "Delete" options are "Disabled" in Context Menu for the selected entry/entries
        Then check "Delete" options are "Disabled" in Actions Menu for the selected entry/entries

    @AAMS-5289 @AAMS-409
    Scenario: COBRA UI : Remove Application - with users message
        Given "Default users" creates "1" organisations with all applications
        Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
            | applications | LM |
        Given "Default OIM Bankuser" approves the "1st" created user
        Given "Default OIM Bankuser" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        Then BankUser selects "LM" Application in selected Application grid
        Then BankUser clicks "Remove" application button on modify CAAS Org Screen
        Then BankUser checks remove application with active users notification message

    @AAMS-5290 @AAMS-228 @AAMS-413
    Scenario: COBRA UI: Modify Org - Delete Org - with users
        Given "Default users" creates "1" organisations with LM applications
        Given "Default users" creates "1" users with the "1st" created Org, without a Customer, and with:
            | applications | LM |
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        Then BankUser clicks on "Delete" button on Org Details page
        Then BankUser checks delete notification message when org has applications or users
        Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen

    @AAMS-5291 @AAMS-228 @AAMS-413
    Scenario: COBRA UI: Modify Org - Delete Org - with apps
        Given "Default users" creates "1" organisations with all applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        Then BankUser clicks on "Delete" button on Org Details page
        Then BankUser checks delete notification message when org has applications or users
        Then BankUser clicks "Ok" on the confirmation dialog on modify CAAS Org Screen

    @AAMS-5292 @AAMS-262
    Scenario: COBRA UI: Modify Org data validation - trimmed leading/trailing spaces
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        And BankUser modifies CAAS Org Data with leading/trailing spaces
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
        Then check Org modification has been submitted successfully notification message
        Then verify the updated org name and bin on org details page
        Then BankUser clicks on "Audit" tab
        Then validate the Audit Scenarios for Org
            | Description                             | Action   |
            | Record was submitted and auto-approved. | Modified |

    @AAMS-5293 @AAMS-262
    Scenario: COBRA UI: Modify Org data validation - allowed special characters
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        And BankUser modifies CAAS Org Data with allowed special characters
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
        Then verify the similar caas org record message
        Then click "Yes" on the similar caas org dialog
        Then check Org modification has been submitted successfully notification message
        Then verify the updated org name and bin on org details page
        Then BankUser clicks on "Audit" tab
        Then validate the Audit Scenarios for Org
            | Description                             | Action   |
            | Record was submitted and auto-approved. | Modified |

    @AAMS-5294 @AAMS-262
    Scenario: COBRA UI: Create Org data validation - maximum field lengths
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        Then BankUser modifies Org data with maximum field lengths
        Then check "orgName" field has been truncated to the max allowed length on modify org page
        Then check "bin" field has been truncated to the max allowed length on modify org page

    @AAMS-5295 @AAMS-353 @AAMS-262
    Scenario: COBRA UI: Modify Org data validation - uniqueness check same org name
        Given "Default OIM Bankuser" creates "2" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "2nd" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        And BankUser modifies the "2nd" org with the same name as the "1st" API created org
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then verify the similar caas org record message
        Then click "No" on the similar caas org dialog
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then click "Yes" on the similar caas org dialog
        Then check Org modification has been submitted successfully notification message
        Then verify the updated org name and bin on org details page
        Then BankUser clicks on "Audit" tab
        Then validate the Audit Scenarios for Org
            | Description                             | Action   |
            | Record was submitted and auto-approved. | Modified |

    @AAMS-5296 @AAMS-353 @AAMS-262
    Scenario: COBRA UI: Modify Org data validation - uniqueness check similar org name
        Given "Default OIM Bankuser" creates "2" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "2nd" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        And BankUser modifies the "2nd" org with the similar name as the "1st" API created org
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then verify the similar caas org record message
        Then click "No" on the similar caas org dialog
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then click "Yes" on the similar caas org dialog
        Then check Org modification has been submitted successfully notification message
        Then verify the updated org name and bin on org details page
        Then BankUser clicks on "Audit" tab
        Then validate the Audit Scenarios for Org
            | Description                             | Action   |
            | Record was submitted and auto-approved. | Modified |

    @AAMS-5297 @AAMS-353 @AAMS-262
    Scenario: COBRA UI: Modify Org data validation - uniqueness check same org bin
        Given "Default OIM Bankuser" creates "2" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        When BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "2nd" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        And BankUser modifies the "2nd" org with the same bin as the "1st" API created org
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then verify the similar caas org record message
        Then click "No" on the similar caas org dialog
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "2nd" API created org
        Then click "Yes" on the similar caas org dialog
        Then check Org modification has been submitted successfully notification message
        Then verify the updated org name and bin on org details page
        Then BankUser clicks on "Audit" tab
        Then validate the Audit Scenarios for Org
            | Description                             | Action   |
            | Record was submitted and auto-approved. | Modified |

    @AAMS-5298 @AAMS-406
    Scenario Outline: COBRA UI: Modify Org data validation - invalid special characters
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        Then BankUser modifies Org data with name "<orgName>" and bin "<bin>"
        And BankUser clicks on "Submit" button for Org Modification and clicks "Yes" on the confirmation for the "1st" API created org
        Then check "orgName" data validation error on modify Org screen
        Then check "bin" data validation error on modify Org screen
        Examples:
            | orgName    | bin     |
            | abcd--6785 | ab-1234 |
            | abcd 123;  | abc123* |
            | id0123<    | ab123$  |
            | id0>123    | abc 123 |
            | id01/**/23 | Abc#123 |
            | id01©23    | Abc*123 |

    @AAMS-5299 @AAMS-406
    Scenario: COBRA UI: Modify Org data validation - blank mandatory fields
        Given "Default users" creates "1" organisations with no applications
        When "Registration Officer (Pilot)" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        And BankUser searches for the "1st" API created CAAS Org
        And BankUser opens the "1st" entry from search Org results
        And BankUser clicks on "Edit" button on Org Details page
        Then BankUser modifies Org data with blank mandatory fields
        Then BankUser clicks on Submit button for Org Modification with blank fields and click Yes on confirmation
        Then check "orgName" mandatory field error on modify Org screen
        Then check "bin" mandatory field error on modify Org screen
