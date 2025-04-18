const request = require('supertest');
const nodemailer = require('nodemailer');

// Mock nodemailer before importing server
jest.mock('nodemailer');
const mockSendMail = jest.fn();
nodemailer.createTransport.mockReturnValue({
  sendMail: mockSendMail,
});

const app = require('../server');

describe('Server', () => {
  beforeEach(() => {
    mockSendMail.mockReset();
    mockSendMail.mockResolvedValue({ response: 'Email sent' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });

  it('should accept POST requests to /api/notify with valid data', async () => {
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
        to: 'test@example.com',
        subject: 'Welcome to the App!',
      })
    );
  });

  it('should reject POST requests to /api/notify with invalid email', async () => {
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'invalid',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});