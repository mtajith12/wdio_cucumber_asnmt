Feature: To test as a bankuser Restrictions
  As a Bank User
  I want to be able to create  a new bankuser and test the restrictions
  Background:Login
  @chrome @COBRA @ONAR-3699 @BankUser  @dev
  Scenario: Test bankuser restrictions-Country-Singapore
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction                |jurisdriction                        |productFamily|restrictedCountries                        |
      |Registration Officer         |Australia,China,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Registration Team Lead       |Australia,China,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Indonesia,Japan|
       Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,Hong Kong" jurisdiction
    Then Verify "Customer" if "Singapore" "Country" is displayed
    Then click on continue and select the products
    Then Register the user
    Then Verify "Resource" if "Singapore" "Country" is displayed
    Then Verify "SummaryGrid" if "Singapore" "Country" is displayed
    Then BankUser logs out

  @chrome @COBRA  @BankUser  @dev @ONAR-6007
  Scenario: Test bankuser restrictions-Country-China
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction                |jurisdriction                        |productFamily|restrictedCountries                        |
      |Registration Officer         |Australia,Singapore,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Registration Team Lead       |Australia,Singapore,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Indonesia,Japan|
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,Singapore,Hong Kong" jurisdiction
    Then Verify "Customer" if "China" "Country" is displayed
    Then click on continue and select the products
    Then Register the user
    Then Verify "Resource" if "China" "Country" is displayed
    Then Verify "SummaryGrid" if "China" "Country" is displayed
    Then BankUser logs out

  @chrome @COBRA  @BankUser  @dev @ONAR-6008
  Scenario: Test bankuser restrictions-Country-Indonesia
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction                |jurisdriction                        |productFamily|restrictedCountries                        |
      |Registration Officer         |Australia,China,Singapore,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Japan|
      |Registration Team Lead       |Australia,China,Singapore,Hong Kong,New Zealand|             |Taiwan,Philippines,Cambodia,Japan|
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    When Bankuser onboards new Customer with "Single" the necessary information and selects the "Cash Management,Commercial Cards,Customer Administration" products and "Australia,China,Singapore,Hong Kong" jurisdiction
    Then click on continue and select the products
    Then Register the user
    Then Verify "Resource" if "Indonesia" "Country" is displayed
    Then Verify "SummaryGrid" if "Indonesia" "Country" is displayed
    Then BankUser logs out
  @chrome @COBRA  @BankUser  @dev @ONAR-6009
  Scenario: Test bankuser restrictions-role-Helpdesk Team Lead
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction      |jurisdriction                                  |productFamily                                                                                                                               |restrictedCountries                        |
      |Helpdesk Officer             |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Helpdesk Team Lead           |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
     Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    Then Verify the bankuser "Helpdesk Team Lead" Permissions
    Then BankUser logs out
  @chrome @COBRA  @BankUser  @dev @ONAR-6010
  Scenario: Test bankuser restrictions-role-Viewer
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction      |jurisdriction                                  |productFamily                                                                                                                               |restrictedCountries                        |
      |Helpdesk Officer             |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Technical Officer            |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Billing Officer              |Australia,China,Hong Kong,New Zealand,Singapore|                                                                                                                                            |                                           |
      |Content Admin                |                                               |Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|                                           |
      |Payments Officer             |Australia,China,Hong Kong,New Zealand,Singapore|                                                                                                                                            |                                           |
      |Payments Maker               |Australia,China,Hong Kong,New Zealand,Singapore|                                                                                                                                            |Taiwan,Philippines,Cambodia,Indonesia,Japan|
      |Payments Authoriser          |Australia,China,Hong Kong,New Zealand,Singapore|                                                                                                                                            |                                           |
      |Viewer             |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    Then Verify the bankuser "Viewer" Permissions
    Then BankUser logs out
  @chrome @COBRA @BankUser  @dev @ONAR-6011
  Scenario: Test bankuser restrictions-role-Implementation Manager
    Given "Default users" logins in to COBRA using a valid password
    Then Click on regsiter bankuser
    And Register an bankuser "random"
      |adminFunction      |jurisdriction                                  |productFamily                                                                                                                               |restrictedCountries                        |
      |Implementation Manager       |Australia,China,Hong Kong,New Zealand,Singapore|Cash Management,Commercial Cards,Clearing Services,Loans,Customer Administration,FX Overlay,FX Services,Institutional Insights,Omni Demo App|Taiwan,Philippines,Cambodia,Indonesia,Japan|
    Then Validate the "register" message for bankuser
    Then BankUser logs out
    When "Default approvers" logins in to COBRA using a valid password
    Then Search the BankUser in searchscreen and "Approve" "new" workflow
    Then BankUser logs out
    Given "created bankuserDefault" logins in to COBRA using a valid password
    Then Verify the bankuser "Implementation Manager" Permissions
    Then BankUser logs out
