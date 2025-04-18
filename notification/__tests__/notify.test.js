const request = require('supertest');
const express = require('express');
const notifyRoutes = require('../routes/notify');

const app = express();
app.use(express.json());
app.use('/api/notify', notifyRoutes);

describe('Notify API', () => {
  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/notify')
      .send({
        userId: '123',
        message: 'Test notification',
        email: 'invalid',
      });
    expect(res.status).toBe(400);
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
    expect(res.body.errors[0].msg).toBe('Message is required');
  });
});