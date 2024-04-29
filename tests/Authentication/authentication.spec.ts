import {test, expect, APIResponse} from '@playwright/test';

require('dotenv').config();

test.describe('Authentication Endpoint', () => {
    let response: APIResponse;

    test.beforeAll(async ({request}) => {
        response = await request.post('/auth', {
            data: {
                "username": process.env.USERNAME,
                "password": process.env.PASSWORD
            }
        });
    });

    test.describe('POST /auth', () => {
        test('should return 200 OK', async ({request}) => {
            const response = await request.post('/auth', {
                data: {
                    "username": process.env.USERNAME,
                    "password": process.env.PASSWORD
                }
            });
            expect(response.status()).toBe(200);
        });

        test('should return a Content-Type of application/json', async ({request}) => {
            const response = await request.post('/auth', {
                data: {
                    "username": process.env.USERNAME,
                    "password": process.env.PASSWORD
                }
            });
            expect(response.headers()['content-type']).toBe('application/json; charset=utf-8');
        });

        test('should return a response with the token property', async ({request}) => {
            const response = await request.post('/auth', {
                data: {
                    "username": process.env.USERNAME,
                    "password": process.env.PASSWORD
                }
            });
            const responseData = await response.json();
            expect(responseData.token).toBeDefined();
        });

        test('should return an error when the username is missing', async ({request}) => {
            const response = await request.post('/auth', {
                data: {
                    "password": process.env.PASSWORD
                }
            });
            expect(response.status()).toBe(200);

            const responseData = await response.json();
            expect(responseData.reason).toBe('Bad credentials');
        });

        test('should return an error when the username doesn\'t exist', async ({request}) => {
            const response = await request.post('/auth', {
                data: {
                    "username": 'unknown',
                    "password": process.env.PASSWORD
                }
            });
            expect(response.status()).toBe(200);

            const responseData = await response.json();
            expect(responseData.reason).toBe('Bad credentials');
        });
    });
});
