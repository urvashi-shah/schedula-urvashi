import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

jest.setTimeout(30000);

describe('Doctor availability (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let recurringAvailabilityId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();

    const email = `availability-${Date.now()}@example.com`;
    const password = 'Password123!';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Availability Doctor',
        email,
        password,
        role: 'DOCTOR',
      })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password,
      })
      .expect(201);

    token = loginResponse.body.access_token;

    await request(app.getHttpServer())
      .post('/doctor/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fullName: 'Dr. Availability Test',
        specialization: 'Cardiologist',
        experience: 8,
        qualification: 'MBBS, MD',
        consultationFee: 500,
        availability: 'Mon-Fri 10AM-5PM',
        profileDetails: 'Availability e2e test profile',
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, lists, updates, resolves, and deletes recurring availability', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'MONDAY',
        startTime: '10:00',
        endTime: '12:00',
      })
      .expect(201);

    recurringAvailabilityId = createResponse.body.availability.id;

    await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'MONDAY',
        startTime: '12:00',
        endTime: '13:00',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.availabilities.length).toBeGreaterThanOrEqual(2);
      });

    await request(app.getHttpServer())
      .patch(`/doctor/availability/${recurringAvailabilityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        startTime: '09:00',
        endTime: '10:00',
      })
      .expect(200);

    await request(app.getHttpServer())
      .get('/doctor/availability/date?date=2026-06-15')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.source).toBe('recurring');
        expect(body.dayOfWeek).toBe('MONDAY');
      });

    await request(app.getHttpServer())
      .delete(`/doctor/availability/${recurringAvailabilityId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('rejects invalid, duplicate, and overlapping recurring availability', async () => {
    await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'TUESDAY',
        startTime: '15:00',
        endTime: '13:00',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'TUESDAY',
        startTime: '10:00',
        endTime: '12:00',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'TUESDAY',
        startTime: '10:00',
        endTime: '12:00',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/doctor/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dayOfWeek: 'TUESDAY',
        startTime: '11:00',
        endTime: '13:00',
      })
      .expect(400);
  });

  it('uses custom availability overrides and rejects custom conflicts', async () => {
    await request(app.getHttpServer())
      .post('/doctor/availability/override')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2026-06-15',
        startTime: '14:00',
        endTime: '15:00',
        reason: 'Special clinic',
      })
      .expect(201);

    await request(app.getHttpServer())
      .get('/doctor/availability/date?date=2026-06-15')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.source).toBe('custom');
        expect(body.availabilities).toHaveLength(1);
      });

    await request(app.getHttpServer())
      .post('/doctor/availability/override')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2026-06-15',
        startTime: '14:00',
        endTime: '15:00',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/doctor/availability/override')
      .set('Authorization', `Bearer ${token}`)
      .send({
        date: '2026-06-15',
        startTime: '14:30',
        endTime: '15:30',
      })
      .expect(400);
  });

  it('rejects invalid date and unauthenticated requests', async () => {
    await request(app.getHttpServer())
      .get('/doctor/availability/date?date=15-06-2026')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    await request(app.getHttpServer()).get('/doctor/availability').expect(401);
  });
});
