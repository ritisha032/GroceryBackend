import { Given, When, Then } from '@cucumber/cucumber';
import * as chai from 'chai';
import axios from 'axios';

const { expect } = chai;

Given('a user with email {string} and password {string}', function (email, password) {
  this.credentials = { email, password };
});

When('the user tries to log in', async function () {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/login', this.credentials);
    this.response = response;
  } catch (error) {
    this.response = error.response;
  }
});

Then('the login should be successful with message {string}', function (message) {
  expect(this.response.status).to.equal(200);
  expect(this.response.data.success).to.be.true;
  expect(this.response.data.message).to.equal(message);
  expect(this.response.data.token).to.exist;
});

Then('the login should fail with message {string}', function (message) {
  expect(this.response.status).to.be.oneOf([400, 200]);
  expect(this.response.data.success).to.be.false;
  expect(this.response.data.message).to.equal(message);
});
