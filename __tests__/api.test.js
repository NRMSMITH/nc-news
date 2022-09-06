const app = require('../api/app');
const seed = require('../db/seeds/seed');
const request = require('supertest');
const db = require('../db/connection');
const testData = require('../db/data/test-data/index');
const { get } = require('../api/app');
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
describe('GET /api/articles/:article_id', () => {
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
    test("404: article id does not exist", () => {
        const article_id = 1000
        return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'article id does not exist'})
        })
    });
    test('400: responds with Bad Request when an article_id that is invalid is inputted', () => {
        const article_id = 'notAnId'
        return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})
describe('GET api/users', () => {
    test('200: responds with an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.users)).toBe(true);
            expect(body.users.length > 0).toBe(true)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            });
        })
    })
    test('404: should respond with the msg: not found', () => {
        return request(app)
        .get('/api/userz')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        });
    });
})

describe('PATCH api/articles/article_id', () => {
    test('should update the vote count of an article and return the updated article', () => {
        const newVote = 1
        const articleUpdate = {
            inc_votes: newVote
        }
        const newVotes = 15
        const articleUpdate2 = {
            inc_votes: newVotes
        }
        const negativeVotes = -10
        const articleUpdate3 = {
            inc_votes: negativeVotes
        }
        return request(app)
        .patch(`/api/articles/3`)
        .send(articleUpdate)
        .expect(200)
        .then(({ body }) => {
            expect(typeof body.article).toBe('object')
            expect(body.article).toEqual({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                votes: 1,
                created_at: expect.any(String)
            })
            return request(app)
            .patch(`/api/articles/5`)
            .send(articleUpdate2)
            .expect(200)
            .then(({body}) => {
                expect(typeof body.article).toBe('object')
                expect(body.article).toEqual({
                    article_id: 5,
                    title: 'UNCOVERED: catspiracy to bring down democracy',
                    topic: 'cats',
                    author: 'rogersop',
                    body: 'Bastet walks amongst us, and the cats are taking arms!',
                    votes: 15,
                    created_at: expect.any(String)
            })
                return request(app)
                .patch(`/api/articles/5`)
                .send(articleUpdate3)
                .expect(200)
                .then(({body}) => {
                    expect(typeof body.article).toBe('object')
                    expect(body.article).toEqual({
                        article_id: 5,
                        title: 'UNCOVERED: catspiracy to bring down democracy',
                        topic: 'cats',
                        author: 'rogersop',
                        body: 'Bastet walks amongst us, and the cats are taking arms!',
                        votes: 5,
                        created_at: expect.any(String)
                    })
                })
            });
        });
    })
});
