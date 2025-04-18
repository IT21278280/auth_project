const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  it('should respond with 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
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