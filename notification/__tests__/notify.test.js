const request = require('supertest');
const express = require('express');
const notifyRoutes = require('../routes/notify');

jest.mock('nodemailer'); // Mock Nodemailer to avoid sending real emails
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use('/', notifyRoutes);

describe('Notify API', () => {
  beforeEach(() => {
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({}),
    });
  });

  it('should send notification email', async () => {
    const res = await request(app)
      .post('/')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'test@example.com',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Email notification sent successfully');
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'invalid',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/')
      .send({
        userId: '123',
        email: 'test@example.com',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});