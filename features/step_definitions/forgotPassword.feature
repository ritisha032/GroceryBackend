Feature: Forgot Password

  Scenario: Successful password reset
    Given a user with email "user@example.com", security question "What is your pet's name?", and new password "newPassword123"
    When the user tries to reset the password
    Then the password reset should be successful with message "Password changed successfully"

  Scenario: Password reset with incorrect email or security question
    Given a user with email "wrong@example.com", security question "Wrong answer", and new password "newPassword123"
    When the user tries to reset the password
    Then the password reset should fail with message "Wrong Email or answer"

  Scenario: Password reset with missing credentials
    Given a user with email "", security question "", and new password ""
    When the user tries to reset the password
    Then the password reset should fail with message "Invalid credentials"
