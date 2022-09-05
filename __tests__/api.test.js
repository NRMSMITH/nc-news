const app = require('../api/app');
const seed = require('../db/seeds/seed');
const request = require('supertest');
const db = require('../db/connection');
const testData = require('../db/data/test-data/index');


beforeEach(() => {
    return seed(testData)
});

afterAll(() => {
    return db.end()
});

describe('GET /api/topics', () => {
    test('200: responds with an array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            expect(body.topics.length > 0).toBe(true)
            body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            });
        });
    });
    test('404: client error of wrong URL responds with 404 not found', () => {
        return request(app)
        .get('/api/topicz')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
});

describe.only('GET /api/articles/:article_id', () => {
    test('200: responds with an array of the specified article according to the id', () => {
        const article_id = 3;
        return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body }) => {
            expect(body.result).toMatchObject({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                votes: 0,
                created_at: expect.any(String)
            });
        });
    })
})