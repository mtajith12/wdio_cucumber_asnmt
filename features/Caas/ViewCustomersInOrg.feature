@chrome @ie @COBRA @OIM @ViewCustomersInOrg.feature
Feature: CAAS ORG Customers - Display Selected Customer
    As a Bank User
    BankUser want to be able to display selected Customer

    @AAMS-3241 
    Scenario Outline: COBRA UI: View Customers from Org - Positive
        Given "Default OIM Bankuser" creates "1" organisations with all applications
        Given "Default OIM Bankuser" creates "1" Customers with all products and jurisdictions
        Given "Default OIM Bankuser" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
            | applications | EsandaNet;GCIS;Institutional Insights;Internet Enquiry Access;Online Trade;Transactive Global |
        Given "<bankUser>" logins in to COBRA using a valid password
        And BankUser navigates to search CAAS Orgs page
        Then BankUser search orgID of org created by API at no. 1 and verify results
        Then BankUser open the Org details page from search result
        Then BankUser view the Org Customers tab and verify the Customers
        Then BankUser double clicks on the "1st" API created Customer from Customers tab
        Then BankUser closes Customer Org details page
        Examples:
            | bankUser                     |
            | Registration Officer (Pilot) |
            | Helpdesk Officer (Pilot)     |