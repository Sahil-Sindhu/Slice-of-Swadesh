import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { Review } from '../models/Review';
import { User } from '../models/User';

const testEmail = 'reviewer@example.com';
const testPassword = 'Password123';
const testName = 'Reviewer User';

beforeAll(async () => {
  const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/slice-of-swadesh-test';
  await mongoose.connect(connString);
  await User.deleteMany({ email: testEmail });
  await Review.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({ email: testEmail });
  await Review.deleteMany({});
  await mongoose.disconnect();
});

describe('Review System Integration Tests', () => {
  it('should fetch empty reviews and seed starter reviews automatically', async () => {
    const res = await request(app).get('/api/v1/reviews');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reviews.length).toBe(3);
    expect(res.body.data.reviews[0].userName).toBeDefined();
  });

  it('should allow logged in user to submit a review', async () => {
    // 1. Register and login
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        name: testName,
        phoneNumber: '9876543210'
      });
    expect(regRes.statusCode).toBe(201);
    
    const tokenCookie = ((regRes.headers['set-cookie'] || []) as string[]).find((c: string) => c.startsWith('swadesh-token=')) || '';

    // 2. Post review
    const postRes = await request(app)
      .post('/api/v1/reviews')
      .set('Cookie', [tokenCookie])
      .send({
        rating: 4,
        comment: 'Nice fast-food items!'
      });

    expect(postRes.statusCode).toBe(201);
    expect(postRes.body.success).toBe(true);
    expect(postRes.body.data.review.comment).toBe('Nice fast-food items!');

    // 3. Fetch reviews again
    const fetchRes = await request(app).get('/api/v1/reviews');
    expect(fetchRes.body.data.reviews.length).toBe(4); // 3 starter + 1 new
  });
});
