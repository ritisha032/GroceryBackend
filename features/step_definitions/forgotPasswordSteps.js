import { Given, When, Then } from '@cucumber/cucumber';
import * as chai from 'chai';
import axios from 'axios';

const { expect } = chai;

Given('a user with email {string}, security question {string}, and new password {string}', function (email, question, newPassword) {
  this.resetData = { email, question, newPassword };
});

When('the user tries to reset the password', async function () {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/forgot-password', this.resetData);
    this.response = response;
  } catch (error) {
    this.response = error.response;
  }
});

Then('the password reset should be successful with message {string}', function (message) {
  expect(this.response.status).to.equal(200);
  expect(this.response.data.success).to.be.true;
  expect(this.response.data.message).to.equal(message);
});

Then('the password reset should fail with message {string}', function (message) {
  expect(this.response.status).to.be.oneOf([400, 404, 200]);
  expect(this.response.data.success).to.be.false;
  expect(this.response.data.message).to.equal(message);
});
