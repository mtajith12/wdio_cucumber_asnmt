@chrome @ie @COBRA @OIM
Feature: Modify User Screen end-to-end scenarios

	
	@AAMS-3388 @AAMS-2251 @AAMS-3398 @AAMS-2251-05 @AAMS-2284-01 @AAMS-2284-02 @AAMS-2284-03 @AAMS-2307-01 @AAMS-2723-01 @AAMS-2724-01 @AAMS-2265-01 @AAMS-2266-01 @AAMS-2268-01 @AAMS-2269-01 @AAMS-5223-02 @AAMS-4232-02 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit and single approve for existing user
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		# AAMS-2723-01
		Then check User.DA Modifiable has been set to FALSE
		# AAMS-354#04, AAMS-496#04
		Then check the "Approve" option is NOT displayed on the view User page
    	Then check the "Reject" option is NOT displayed on the view User page
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		Then BankUser selects the "1st" entry
		# AAMS-2266-01 #AAMS-2269-01
		# Then check "Approve" and "Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		# Then check "Approve" and "Reject" options are "Enabled" for the "1st" entry in the Context Menu
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then BankUser reset search
    	Then BankUser searches the UI created User by "User ID"
    	Then BankUser opens the "1st" entry from search User results
		# AAMS-2265-01 # AAMS-2268-01
		Then check the "Approve" option is displayed on the view User page
		Then check the "Reject" option is displayed on the view User page
		Then BankUser clicks on "Approve" button on the User details page
    	# AAMS-2284-01 # AAMS-2284-02
		Then check Approve Single User modification confirmation message, then click on "No" button
		Then check the system retain the user on the View User Details screen
		Then BankUser clicks on "Approve" button on the User details page
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		# AAMS-2284-03
		Then check the Single User modification been approved successfully
		# AAMS-2724-01
		Then check User.DA Modifiable has been set to TRUE
		Then check User Status set to Enabled and Workflow to Approved on View User details page
		# AAMS-5223-02
		Then check the details of the User displayed correctly in view User page
		# AAMS-2307-01
		Then check user details in COBRA Agent database

	@AAMS-3573 @AAMS-2277-01 @AAMS-2278-01 @AAMS-2311-01 @AAMS-2311-02 @AAMS-2311-03 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit and single reject for existing user
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		# AAMS-354#04, AAMS-496#04
		Then check the "Approve" option is NOT displayed on the view User page
    	Then check the "Reject" option is NOT displayed on the view User page
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		Then BankUser navigates to Pending Approvals page
		Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
		Then BankUser selects the "1st" entry
		# AAMS-2277#01, AAMS-2278-01
		# Then check "Approve" and "Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		# Then check "Approve" and "Reject" options are "Enabled" for the "1st" entry in the Context Menu
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then BankUser reset search
    	Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    	Then BankUser rejects the "1st" entry from "Context" menu
		# AAMS-2311-01
		Then check Reject Acknowledgement dialog displayed with empty reason
		# AAMS-2311-02
		Then BankUser enters Reject reason then clicks on "Cancel" button:
			| rejectReason | first time input reason for user rejection |
		Then check Reject Acknowledgement dialog closed
		Then BankUser rejects the "1st" entry from "Context" menu
		Then check Reject Acknowledgement dialog displayed with empty reason
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | User is rejected for testing purpose |
		# AAMS-2311-03
		Then check the Single User modification been rejected successfully
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check rejected user modification has been reverted
		Then BankUser logs out


	@AAMS-3574 @AAMS-2304-01 @AAMS-2528-01 @AAMS-2277-01 @AAMS-2284-01 @AAMS-2284-03 @AAMS-3645-02 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Update user details for DA user, promote to ANZ Managed and approve
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		#AAMS-2528-01
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then check the details of the User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser promotes user to ANZ Managed
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then check the details of the User displayed correctly in view User page
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		Then BankUser navigates to Pending Approvals page
		Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
		Then BankUser selects the "1st" entry
		# AAMS-2277#01, AAMS-2278-01
		# Then check "Approve" and "Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		# Then check "Approve" and "Reject" options are "Enabled" for the "1st" entry in the Context Menu
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then BankUser reset search
    	Then BankUser searches Pending Approval entity by "Record ID" for the UI created user
    	Then BankUser approves the "1st" entry from "Actions" menu
		Then check Approve Single User modification confirmation message, then click on "Yes" button
		# AAMS-2284-03
		Then check the Single User modification been approved successfully
		Then BankUser logs out
		When "Helpdesk Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser selects the "1st" entry
		And BankUser opens the "1st" entry from search User results
		And BankUser clicks "Verify" button
		# AAMS-2304-01
		Then BankUser verifies the elements on Verify User dialog

	@AAMS-5242 @AAMS-3645-01 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Update user details for new DA user
		Given "Default users" creates "1" organisations with a unique random string in orgData
		Given "Default users" creates non ANZ managed "1" users with the "1st" created Org
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		#AAMS-2528-01
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "New" user
		Then check the details of the User displayed correctly in view User page

	@AAMS-3575 @AAMS-2267-01 @AAMS-2270-01 @AAMS-2286-01 @AAMS-2286-03 @AAMS-2286-04 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit modifications and multiple user modification approve for existing users
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" approves the "2nd" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser closes User details page
		Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "2nd" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		Then BankUser selects the "1st" and "2nd" entries
		# AAMS-2267-01 # AAMS-2270-01
    	# Then check "Approve" and "Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    	# Then check "Approve" and "Reject" options are "Enabled" for the "1st" and "2nd" entries in the Context Menu
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then BankUser reset search
    	Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    	Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
		# AAMS-2286-01 # AAMS-2286-03
    	Then check Approve Multiple Users modification confirmation message, then click on "No" button
		Then check the system retain the users on the grid
		Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
		# AAMS-2286-01 # AAMS-2286-04
		Then check Approve Multiple Users modification confirmation message, then click on "Yes" button
		Then check the Multiple Users modification been approved successfully
		Then BankUser logs out

	@AAMS-3576 @AAMS-2286-02 @AAMS-2286-03 @AAMS-2286-04 @AAMS-2270-02 @AAMS-2267-02 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit modifications and multiple approve for existing users with combination of workflow status
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		Then BankUser selects the "1st" and "2nd" entries
		# AAMS-2267-02 # AAMS-2270-02
    	# Then check "Approve" and "Reject" options are "Enabled" in Actions Menu for the selected entry/entries
    	# Then check "Approve" and "Reject" options are "Enabled" for the "1st" and "2nd" entries in the Context Menu
		Then check "Approve, Reject" options are "Enabled" in Actions Menu for the selected entry/entries
		Then check "Approve, Reject" options are "Enabled" in Context Menu for the selected entry/entries
		Then BankUser reset search
    	Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
    	Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
		# AAMS-2286-02 # AAMS-2286-03
    	Then check Approve Multiple Users creation and modification confirmation message, then click on "No" button
		Then check the system retain the users on the grid
		Then BankUser approves the "1st" and "2nd" entries from "Actions" menu
		# AAMS-2286-01 # AAMS-2286-04
		Then check Approve Multiple Users creation and modification confirmation message, then click on "Yes" button
		Then check the Multiple Users modification been approved successfully
		Then BankUser logs out


	@AAMS-3577 @AAMS-2313-01 @AAMS-2313-02 @AAMS-2313-03 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit modifications and multiple user modification reject for existing users
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		Given "Default OIM Bankuser" approves the "2nd" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser closes User details page
		Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "2nd" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		Then BankUser navigates to Pending Approvals page
		Then BankUser searches Pending Approval entities by "Record ID" for all the API created users
		Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
		# AAMS-2313-01 # AAMS-2313-02
		Then BankUser enters Reject reason then clicks on "Cancel" button:
      		| rejectReason | reject from search User grid |
    	Then check the system retain the users on the grid
		Then BankUser rejects the "1st" and "2nd" entries from "Actions" menu
		Then BankUser enters Reject reason then clicks on "Ok" button:
		# AAMS-2313-01
			| rejectReason | User is rejected for testing purpose |
		# AAMS-2313-03
		Then check the Multiple Users modification been rejected successfully
		Then BankUser logs out
 
	@AAMS-3578 @AAMS-2313-01 @AAMS-2313-03 @ModifyUser.feature
	Scenario: COBRA UI: Modify User - Submit modifications and multiple reject for existing users with combination of workflow status
		Given "Default users" creates "1" organisations with all applications
		Given "Default users" creates "2" users with the "1st" created Org
		Given "Default OIM Bankuser" approves the "1st" created user
		When "Registration Officer (Pilot)" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check the details of the API created User displayed correctly in view User page
		And BankUser clicks on "Edit" button on User Details page
		Then BankUser updates all user details with new values
		Then BankUser clicks on "Submit" button for User Modification for UI created user and clicks "Yes" on the confirmation
		Then check User modification has been submitted successfully for "Existing" user
		Then BankUser logs out
		When "Registration Officer (Pilot) 2" logins in to COBRA using a valid password
		And BankUser navigates to search User page
		Then BankUser searches Users by "CAAS Org ID" with values from the "1st" API created user
		# AAMS-2313-01
		Then BankUser rejects the "1st" and "2nd" entries from "Context" menu
		Then BankUser enters Reject reason then clicks on "Ok" button:
			| rejectReason | User is rejected for testing purpose |
		# AAMS-2313-03
		Then check the Multiple Users modification been rejected successfully
		Then BankUser reset search
		And BankUser searches Users by "User ID" with values from the "1st" API created user
		And BankUser opens the "1st" entry from search User results
		Then check rejected user modification has been reverted
