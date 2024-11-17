Feature: User Login

  Scenario: Successful login
    Given a user with email "admin@admin.com" and password "123456"
    When the user tries to log in
    Then the login should be successful with message "Logged in SUCCESSFULLY"

  Scenario: Login with invalid credentials
    Given a user with email "admin@admin.com" and password "wrongpassword"
    When the user tries to log in
    Then the login should fail with message "Invalid Password"

  Scenario: Login with missing credentials
    Given a user with email "" and password ""
    When the user tries to log in
    Then the login should fail with message "Invalid credentials"
