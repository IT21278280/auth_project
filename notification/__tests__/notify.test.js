const request = require('supertest');
const express = require('express');
const nodemailer = require('nodemailer');
const notifyRoutes = require('../routes/notify');

// Mock nodemailer before importing routes
jest.mock('nodemailer');
const mockSendMail = jest.fn();
nodemailer.createTransport.mockReturnValue({
  sendMail: mockSendMail,
});

const app = express();
app.use(express.json());
app.use('/api/notify', notifyRoutes);

describe('Notify API', () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    mockSendMail.mockResolvedValue({ response: 'Email sent' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send notification email', async () => {
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'test@example.com',
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Email notification sent successfully');
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),
        to: 'test@example.com',
        subject: 'Welcome to the App!',
        text: 'Test notification',
        html: '<p>Test notification</p>',
      })
    );
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'invalid',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('Invalid email');
  });

  it('should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        email: 'test@example.com',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('Message is required');
  });

  it('should fail if Nodemailer throws an error', async () => {
    mockSendMail.mockRejectedValueOnce(new Error('SMTP server down'));
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'test@example.com',
      });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to send email');
    expect(res.body.details).toBe('SMTP server down');
  });
});