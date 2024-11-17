Feature: User Signup

  Scenario: Successful signup
    Given a user with name "Ritika Singh", email "ritika123@example.com", password "password123", phone "1234567890", address "123 Street", and question "cricket"
    When they try to sign up
    Then the signup should be successful with a message "user created successfully"

  Scenario: Signup with an existing email
    Given a user with name "Jane Doe", email "john@example.com", password "password123", phone "0987654321", address "456 Avenue", and question "What is your mother's maiden name?"
    When they try to sign up
    Then the signup should fail with a message "user already exists"
