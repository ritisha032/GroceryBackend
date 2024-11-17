import { Given, When, Then } from '@cucumber/cucumber';
import * as chai from 'chai';
import axios from 'axios'; // Use axios or any HTTP client to make requests

const { expect } = chai; // Destructure for easier use

// Store user data and response in the context object
Given('a user with name {string}, email {string}, password {string}, phone {string}, address {string}, and question {string}', function (name, email, password, phone, address, question) {
  this.userData = { name, email, password, phone, address, question };
});

When('they try to sign up', async function () {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/signup', this.userData); // Adjust URL as needed
  
    this.response = response;
    console.log("this is response: ",this.response);
  } catch (error) {
    this.response = error.response; // Capture error responses for failed requests
  }
});

Then('the signup should be successful with a message {string}', function (message) {
    console.log('Response Status:', this.response.status);
    console.log('Response Data:', this.response.data); // Log data for more context
    expect(this.response.status).to.equal(200);
    expect(this.response.data.success).to.be.true;
    expect(this.response.data.message).to.equal(message);
  });

Then('the signup should fail with a message {string}', function (message) {
  expect(this.response.status).to.equal(400);
  expect(this.response.data.success).to.be.false;
  expect(this.response.data.message).to.equal(message);
});
