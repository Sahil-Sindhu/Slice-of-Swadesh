import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Session } from '../models/Session';

const testEmail = 'test_user_jest@example.com';
const testPassword = 'Password123';
const testName = 'Jest Test User';

beforeAll(async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/slice-of-swadesh-test';
  await mongoose.connect(connString);
  await User.deleteMany({ email: testEmail });
});

afterAll(async () => {
  await User.deleteMany({ email: testEmail });
  await mongoose.disconnect();
});

describe('Authentication Integration Tests', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        name: testName,
        phoneNumber: '1234567890',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.headers['set-cookie']).toBeDefined();

    // Verify cookies are set (HttpOnly tokens)
    const cookies = ((res.headers['set-cookie'] || []) as string[]).join(' ');
    expect(cookies).toContain('swadesh-token');
    expect(cookies).toContain('swadesh-refresh');
  });

  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        name: testName,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login user successfully and set cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();

    const cookies = ((res.headers['set-cookie'] || []) as string[]).join(' ');
    expect(cookies).toContain('swadesh-token');
    expect(cookies).toContain('swadesh-refresh');
  });

  it('should get profile using access token cookie', async () => {
    // Log in to get the cookie
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    const tokenCookie = ((loginRes.headers['set-cookie'] || []) as string[]).find((c: string) => c.startsWith('swadesh-token=')) || '';

    const res = await request(app)
      .get('/api/v1/auth/profile')
      .set('Cookie', [tokenCookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it('should fail profile retrieval with invalid cookie', async () => {
    const res = await request(app)
      .get('/api/v1/auth/profile')
      .set('Cookie', ['swadesh-token=invalid_token']);

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
  });

  it('should logout user successfully and clear cookies', async () => {
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    const cookiesList = (loginRes.headers['set-cookie'] || []) as string[];
    const tokenCookie = cookiesList.find((c: string) => c.startsWith('swadesh-token=')) || '';
    const refreshCookie = cookiesList.find((c: string) => c.startsWith('swadesh-refresh=')) || '';

    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', [tokenCookie, refreshCookie]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const cookies = ((res.headers['set-cookie'] || []) as string[]).join(' ');
    expect(cookies).toContain('swadesh-token=;');
    expect(cookies).toContain('swadesh-refresh=;');
  });
});
