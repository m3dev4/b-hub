import request from 'supertest';
import express from 'express';
import helmetMiddleware from '../security/helmet/helmet';
import rateLimit from '../security/ratelimit/rateLimit';
import corsMiddleware from '../security/cors/cors';
import potentialIntrusionMiddleware from '../security/ids/potentialIntrusion';

const app = express();
app.use(corsMiddleware);
app.use(helmetMiddleware());
app.use(potentialIntrusionMiddleware);

app.get('/test', (req, res) => {
    res.send('Test endpoint');
});

describe('Security Middleware Tests', () => {
    it('should allow requests from allowed origins', async () => {
        const response = await request(app)
            .get('/test')
            .set('Origin', 'http://localhost:3000');
        expect(response.status).toBe(200);
    });



 


});
