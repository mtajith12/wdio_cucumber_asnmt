@chrome @ie @COBRA @OIM @VerifyUser.feature
Feature: To test as a bankuser we are able to verify user
  As a Bank User
  I want to be able to verify users

  @AAMS-3028 @AAMS-5-01-02
  Scenario Outline: COBRA UI: Verify User - verify the display Verify Option on View User Screen for users with Helpdesk Officer (Pilot) roles - Positive case
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<user name>" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "<verify available>" present on View CAAS User page
    Then BankUser logs out
    Examples:
      | Test case name                                                             | user name                | verify available |
      | Verify option is displayed for Helpdesk Officer (Pilot) and status Enabled | Helpdesk Officer (Pilot) | is               |

  @AAMS-3029 @AAMS-5-01-02
  Scenario Outline: COBRA UI: Verify User - verify the display Verify Option on View User Screen for users with different roles- Negative case
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<user name>" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "<verify available>" present on View CAAS User page
    Then BankUser logs out
    Examples:
      | Test case name                                                                     | user name                    | verify available |
      | Verify option is not displayed for Registration Officer (Pilot) and status Enabled | Registration Officer (Pilot) | is not           |

  @AAMS-3030 @AAMS-5-05
  Scenario: COBRA UI: Verify User - verify Verify is not displayed for status New and Workflow:Pending Approval - Create
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "is not" present on View CAAS User page

  @AAMS-3031 @AAMS-5-03 @AAMS-919-01
  Scenario: COBRA UI: Verify User - verify Verify is not displayed for user which is not ANZ managed
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "is not" present on View CAAS User page
    And BankUser checks the value in Verified On field for non ANZ Managed user is "N/A"

  @AAMS-3032 @AAMS-5-04
  Scenario: COBRA UI: Verify User - verify that Verify Option is not displayed for user where source system is not COBRA
    Given create a CAASUSER using CAAS api
    Then create a customer using api
    Then register a CAAS User using api
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches the UI created User by "User ID"
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "is not" present on View CAAS User page

  @AAMS-3033 @AAMS-51-01
  Scenario: COBRA UI: Verify User - verify Verify User page elements in create mode
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then BankUser verifies the elements on Verify User dialog
    Then BankUser verifies the selected option in Challenge Language dropdown is "English"
    And verifies the available and default options in "Challenge Question1" for "English" language
    And verifies the available and default options in "Challenge Question2" for "English" language
    And verifies the available and default options in "Challenge Question3" for "English" language
    And verifies the available and default options in Challenge Language dropdown

  @AAMS-3033 @AAMS-51-01 @AAMS-839-03
  Scenario: COBRA UI: Verify User - verify Verify User page elements in create mode/view mode for approved and Pending Approval - Modified work flow
    Given "Default users" creates "1" organisations with all applications
    Given "Default users" creates "1" Customers with all products and jurisdictions
    Given "Default users" creates "1" users with the "1st" created Org, with the "1st" created Customer, and with:
      | applications | Transactive Global |
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then BankUser verifies the elements on Verify User dialog
    Then BankUser verifies the selected option in Challenge Language dropdown is "English"
    And verifies the available and default options in "Challenge Question1" for "English" language
    And verifies the available and default options in "Challenge Question2" for "English" language
    And verifies the available and default options in "Challenge Question3" for "English" language
    And verifies the available and default options in Challenge Language dropdown
    And BankUser clicks "Cancel" button
    Then BankUser clicks "Yes" button
    Then BankUser logs out
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then check the details of the API created User displayed correctly in view User page
    And BankUser clicks on "Edit" button on User Details page
    Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then BankUser logs out
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
  Then BankUser verifies the elements on Verify User dialog
    Then BankUser verifies the selected option in Challenge Language dropdown is "English"
    And verifies the available and default options in "Challenge Question1" for "English" language
    And verifies the available and default options in "Challenge Question2" for "English" language
    And verifies the available and default options in "Challenge Question3" for "English" language
    And verifies the available and default options in Challenge Language dropdown
    And BankUser selects "English" in challenge language
    And selects "What is the name of your first teacher?" in challengeQuestion1, "Where did you go on your first holiday?" in challengeQuestion2 and "What was the first movie you went to see?" in challengeQuestion3
    And enters " test value1    " in response1 textbox " test value2    " in response2 textbox and " test value3    " in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    And BankUser clicks "Verify" button
    And BankUser clicks "Edit" button
    And selects "What is the name of your first teacher?" in challengeQuestion1, "Where did you go on your first holiday?" in challengeQuestion2 and "What was the first movie you went to see?" in challengeQuestion3
    And enters "   updatedtest value1    " in response1 textbox "  updated test value2    " in response2 textbox and "   updatedtest value3    " in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification


  @AAMS-3034 @AAMS-847-01
  Scenario: COBRA UI: Verify User - verify that leading and trailing spaces are trimmed
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And selects "What is the name of your first teacher?" in challengeQuestion1, "Where did you go on your first holiday?" in challengeQuestion2 and "What was the first movie you went to see?" in challengeQuestion3
    And enters "   test value1    " in response1 textbox "   test value2    " in response2 textbox and "   test value3    " in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    And BankUser clicks "Verify" button
    # TODO: rework the checks on questions/answers after AAMS-3187 is fixed.
     Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User

  @AAMS-3035 @AAMS-847-02 @OIMcore
  Scenario Outline: COBRA UI: Verify User - verify Submit functionality
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<LoginUser>" logins in to COBRA using a Password@123 password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And BankUser selects "<language>" in challenge language
    And selects "<question1>" in challengeQuestion1, "<question2>" in challengeQuestion2 and "<question3>" in challengeQuestion3
    And enters "<response1>" in response1 textbox "<response2>" in response2 textbox and "<response3>" in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    And verifies the text in "userVerified" is "Yes"
    And BankUser verifies the time stamp in Verified On with user as "<LoginUser>"
    And BankUser clicks "Verify" button
    # TODO: rework the checks on questions/answers after AAMS-3187 is fixed.
    Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User
    Examples:
      | Test case name                                            | language | LoginUser                | question1 | question2 | question3 | response1                                                    | response2                                                    | response3                                                    |
      | Verify submit functionality with special chars            | English  | Helpdesk Officer (Pilot) | index2    | index3    | index4    | a3. , ! @ # $ % & * ( ) _ - – + = \ ? { } [ ] / " ' : ` ~   | a3. , ! @ # $ % & * ( ) _ - – + = \ ? { } [ ] / " ' : ` ~   | a3. , ! @ # $ % & * ( ) _ - – + = \ ? { } [ ] / " ' : ` ~   |
      | Verify submit functionality with spaces in responses      | English  | Helpdesk Officer (Pilot) | index2    | index3    | index4    | Test Value                                                   | Test   value                                                 | test   value                                                 |
      | Verify submit functionality without challenge 3 question  | English  | Helpdesk Officer (Pilot) | index1    | index2    |           | Test Value                                                   | Test value                                                   |                                                              |
      | Verify submit functionality with vietnamese language      | English  | Helpdesk Officer (Pilot) | index1    | index2    | index7    | Bài kiểm tra giá trị                                       | Tên đệm của mẹ bạn là gì                                | Tên bộ phim đầu tiên của tôi123                          |
      | Verify submit functionality with Traditional language     | English  | Helpdesk Officer (Pilot) | index1    | index2    | index7    | 我的愛好是音樂和舞蹈                                         | 五月的中間名是戴安娜                                         | 寶馬是我的第一輛車                                           |
      | Verify submit functionality with max char-60 in responses | English  | Helpdesk Officer (Pilot) | index1    | index2    | index7    | 123456789012345678901234567890123456789012345678901234567890 | 123456789012345678901234567890123456789012345678901234567890 | 123456789012345678901234567890123456789012345678901234567890 |

  @AAMS-3036 @AAMS-482-01-02 @AAMS-839-01-03,@AAMS-800 @OIMcore
  Scenario Outline: COBRA UI: Verify User - verify Edit/View functionality for Approved work flow
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<LoginUser>" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And BankUser selects "<language>" in challenge language
    And selects "<question1>" in challengeQuestion1, "<question2>" in challengeQuestion2 and "<question3>" in challengeQuestion3
    And enters "<response1>" in response1 textbox "<response2>" in response2 textbox and "<response3>" in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    And BankUser clicks "Verify" button
    # TODO: rework the checks on questions/answers after AAMS-3187 is fixed.
    Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User
    And verifies the text in "challengeLanguage" is "<language>"
    And verifies the text in "userVerification" is ""
    And BankUser clicks "Edit" button
    Then BankUser verifies the selected option in Challenge Language dropdown is "<language>"
    # TODO: rework the checks on questions/answers after AAMS-3187 is fixed.
    Then verifies the values of security questions and answers are displayed correctly for the "1st" API created User
    And selects "<question2>" in challengeQuestion1, "<question3>" in challengeQuestion2 and "<question1>" in challengeQuestion3
    And verifies the value in "response1" is ""
    And verifies the value in "response2" is ""
    And verifies the value in "response3" is ""
    And enters "<response3>" in response1 textbox "<response1>" in response2 textbox and "<response2>" in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    And BankUser clicks "Verify" button
    # TODO: rework the checks on questions/answers after AAMS-3187 is fixed.
    Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User
    And verifies the text in "challengeLanguage" is "<language>"
    And verifies the text in "userVerification" is ""
    And BankUser clicks "Edit" button
    And BankUser selects "Simplified Chinese" in challenge language
    And verifies the value in "question1" is ""
    And verifies the value in "question2" is ""
    And verifies the value in "question3" is ""
    And verifies the value in "response1" is ""
    And verifies the value in "response2" is ""
    And verifies the value in "response3" is ""
    Examples:
      | Test case name                             | language | LoginUser                | question1                               | question2                               | question3                                   | response1    | response2    | response3    |
      | Verify edit  functionality for Verify User | English  | Helpdesk Officer (Pilot) | What is the name of your first teacher? | Where did you go on your first holiday? | What was the first single/album you bought? | Test value 1 | Test value 2 | Test value 3 |

  @AAMS-3037 @AAMS-804-01
  Scenario Outline: COBRA UI: Verify User - verify the max value in response1, response2, response3
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<LoginUser>" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And enters "<responseValue>" in response1 textbox "<responseValue>" in response2 textbox and "<responseValue>" in response3 textbox
    Then verifies the value in "response1" is "<expectedValue>"
    And verifies the value in "response2" is "<expectedValue>"
    And verifies the value in "response3" is "<expectedValue>"
    Examples:
      | Test case name         | LoginUser                | field     | responseValue                                                 | expectedValue                                                |
      | Max value of response1 | Helpdesk Officer (Pilot) | response1 | 1234567890123456789012345678901234567890123456789012345678901 | 123456789012345678901234567890123456789012345678901234567890 |

  @AAMS-3038 @AAMS-846
  Scenario Outline: COBRA UI: Verify User - verify Cancel button functionality
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And BankUser selects "English" in challenge language
    And selects "<question1>" in challengeQuestion1, "<question2>" in challengeQuestion2 and "<question3>" in challengeQuestion3
    And enters "<response1>" in response1 textbox "<response2>" in response2 textbox and "<response3>" in response3 textbox
    And BankUser clicks "Cancel" button
    Then verifies the confirmation message
    And BankUser clicks "No" button
    Then verifies the value in "question1" is "<question1>"
    And verifies the value in "question2" is "<question2>"
    And verifies the value in "question3" is "<question3>"
    And verifies the value in "response1" is "<response1>"
    And verifies the value in "response2" is "<response2>"
    And verifies the value in "response3" is "<response3>"
    And BankUser clicks "Cancel" button
    Then BankUser clicks "Yes" button
    Then check that Verify button "is" present on View CAAS User page
    And BankUser clicks "Verify" button
    Then verifies the value in "question1" is ""
    And verifies the value in "question2" is ""
    And verifies the value in "question3" is ""
    And verifies the value in "response1" is ""
    And verifies the value in "response2" is ""
    And verifies the value in "response3" is ""
    Examples:
      | Test case name                       | question1                               | question2                               | question3                                   | response1 | response2 | response3 | response1ErrMsg                   |
      | Mandetory field check for question 1 | What is the name of your first teacher? | Where did you go on your first holiday? | What was the first single/album you bought? | Aman      | Aman      | Aman      | Challenge Question 1 is mandatory |

  @AAMS-3039 @AAMS-804-01-02-03-04
  Scenario: COBRA UI: Verify User - verify error messages for invalid chars in response text boxes on Verify User dialog
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then verifies the error msg for ";,<,>,--,/**/" in "response1" is "Challenge Response 1 has invalid format or type or size"
    Then verifies the error msg for ";,<,>,--,/**/" in "response2" is "Challenge Response 2 has invalid format or type or size"
    Then verifies the error msg for ";,<,>,--,/**/" in "response3" is "Challenge Response 3 has invalid format or type or size"
    Then verifies the mandatory field error msg for "response1" is "Challenge Response 1 is mandatory"
    And verifies the mandatory field error msg for "response2" is "Challenge Response 2 is mandatory"
    And verifies the mandatory field error msg for "response3" is "Challenge Question 3 and Response 3 must be provided at the same time."
    And  verifies the mandatory field error msg for "question1" is "Challenge Question 1 is mandatory"
    And  verifies the mandatory field error msg for "question2" is "Challenge Question 2 is mandatory"
    And  verifies the mandatory field error msg for "question3" is "Challenge Question 3 and Response 3 must be provided at the same time."
    And BankUser clicks "Verify" button
    Then verifies the error message for same questions in "question1" and "question2" is "Challenge Questions must be different"
    Then verifies the error message for same questions in "question1" and "question3" is "Challenge Questions must be different"
    Then verifies the error message for same questions in "question2" and "question3" is "Challenge Questions must be different"

  @AAMS-3040 @AAMS-804-04
  Scenario: COBRA UI: Verify User - verify error messages for same questions on Verify User dialog
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    Then BankUser searches Users by "User ID" with values from the "1st" API created user
    Then BankUser selects the "1st" entry
    Then BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then verifies the error message for same questions in "question1" and "question2" is "Challenge Questions must be different"
    Then verifies the error message for same questions in "question1" and "question3" is "Challenge Questions must be different"
    Then verifies the error message for same questions in "question2" and "question3" is "Challenge Questions must be different"

  @AAMS-3041 @AAMS-1849-01
  Scenario: COBRA UI: Generate Password - verify display of Generate Password Option on View User Screen - when user is ANZ Managed
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Generate Password button "is" present on View CAAS User page
    Then BankUser logs out

  @AAMS-3042 @AAMS-1849-02
  Scenario: COBRA UI: Generate Password - verify display of Generate Password Option on View User Screen - when user is not ANZ Managed
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Generate Password button "is" present on View CAAS User page
    Then BankUser logs out

  @AAMS-3043 @AAMS-1849-03
  Scenario Outline: COBRA UI: Generate Password - verify display of Generate Password Option on View User Screen - when bankuser is not entitled
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "<bankuserRole>" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Generate Password button "is not" present on View CAAS User page
    Then BankUser logs out
    Examples:
      | bankuserRole                 |
      | Registration Officer (Pilot) |

  @AAMS-3044 @AAMS-1849-04
  Scenario: COBRA UI: Generate Password - verify display of Generate Password Option on View User Screen - source system is not COBRA
    Given create a CAASUSER using CAAS api
    Then create a customer using api
    Then register a CAAS User using api
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches the UI created User by "User ID"
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Generate Password button "is not" present on View CAAS User page

  #TODO: add scenarios for Disabled and Deleted status once available
  @AAMS-3045 @AAMS-1849-05 @AAMS-1849-06
  Scenario: COBRA UI: Generate Password - verify display of Generate Password Option on View User Screen - user not enabled and not correct workflow
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Generate Password button "is not" present on View CAAS User page

  @AAMS-3046 @AAMS-1850-01 @AAMS-1850-03 @AAMS-4227-01 @OIMcore
  Scenario: COBRA UI: Generate Password - verify display of Generate Password screen
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And BankUser selects "English" in challenge language
    And selects "index1" in challengeQuestion1, "index2" in challengeQuestion2 and "" in challengeQuestion3
    And enters "test value1" in response1 textbox "test value2" in response2 textbox and "" in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    Then BankUser clicks "Generate Password" button
    Then check Generate Password confirmation message
    Then BankUser clicks "Yes" button
    Then check Generate Password screen elements
    Then BankUser clicks "Close" button
    Then check user Account Status values after generating password
    Then check anzpwddisabled value is "16777216" for the "1st" user

  @AAMS-3047 @AAMS-1850-02
  Scenario: COBRA UI: Generate Password - verify display of Generate Password screen - when no is selected
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    And BankUser selects "English" in challenge language
    And selects "What is the name of your first teacher?" in challengeQuestion1, "Where did you go on your first holiday?" in challengeQuestion2 and "" in challengeQuestion3
    And enters "test value1" in response1 textbox "test value2" in response2 textbox and "" in response3 textbox
    And BankUser clicks "Submit" button
    Then BankUser verifies the success notification
    Then BankUser clicks "Generate Password" button
    Then check Generate Password confirmation message
    Then BankUser clicks "No" button
    Then check user Account Status values after selecting No on Generate Password confirmation

  @AAMS-3048 @AAMS-2202-01
  Scenario: COBRA UI: Generate Password - verify display of Generate Password screen - user identity is not verified
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then BankUser clicks "Generate Password" button
    Then check Generate Password message when user identity is not verified

  @AAMS-3903 @AAMS-3472-01 @AAMS-3472-02
  Scenario: COBRA UI: Verify User - verify Verify is displayed after a user has been approved from non ANZ Managed to ANZ managed
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user
    When "Registration Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    Then check the details of the API created User displayed correctly in view User page
    And BankUser clicks on "Edit" button on User Details page
    Then BankUser promotes user to ANZ Managed
    Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
    Then check User modification has been submitted successfully for "Existing" user
    Then BankUser logs out
    #AAMS-3472-02
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "is not" present on View CAAS User page
    Given "Default approvers" approves the "1st" created user
    #AAMS-3472-01
    And BankUser navigates to search User page
    And BankUser selects the "1st" entry
    And BankUser opens the "1st" entry from search User results
    Then check that Verify button "is" present on View CAAS User page
    Then BankUser logs out

  @AAMS-5303  @AAMS-3148 @AAMS-3151 @AAMS-3152
  Scenario: COBRA UI: Verify User - verify Verify User page when user is disabled and deleted - Positive
    Given "Default users" creates "1" organisations with a unique random string in orgData
    Given "Default users" creates "1" users with the "1st" created Org
    Given "Default OIM Bankuser" approves the "1st" created user 
    Given "Helpdesk Officer (Pilot)" verifies the "1st" API created user in locale "en":
      | question                              | answer  |
      | What was the name of your first pet?  | answer1 |
      | What is your father's place of birth? | answer2 |
    Then "Default OIM Bankuser" disables the "1st" API created user
    When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
    And BankUser navigates to search User page
    And BankUser searches Users by "User ID" with values from the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User
    Then Check that edit button is "Disabled" on Verify User page
    Then BankUser clicks "Cancel" button
    Then BankUser closes User details page
    Then "Default OIM Bankuser" enables the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button    
    Then Check that edit button is "Disabled" on Verify User page
    Then BankUser clicks "Cancel" button
    Then BankUser closes User details page    
    Given "Default users" approves the "1st" created user
    Given "Default users" deletes the "1st" API created user
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then Check that edit button is "Disabled" on Verify User page
    Then BankUser clicks "Cancel" button    
    Then BankUser closes User details page    
    Given "Default OIM Bankuser" approves the "1st" created user 
    And BankUser opens the "1st" entry from search User results
    And BankUser clicks "Verify" button
    Then verifies the texts of security questions and answers are displayed correctly for the "1st" API created User
    Then Check that edit button is "Disabled" on Verify User page