const app = require('../app');
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
                created_at: expect.any(String),
                comment_count: 2
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
    test('400: no data in body - sends back message', () => {
        const articleUpdate = {}
        return request(app)
        .patch(`/api/articles/5`)
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
        expect(response.body).toEqual({msg: 'Bad Request'})
        })
    })
    test('400: wrong data type in body - sends back error message', () => {
        const articleUpdate = {
            inc_votes: 'this is the wrong data type'
        }
        return request(app)
        .patch(`/api/articles/5`)
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg:  'Bad Request'})
        })
    })
    test('200: should ignore extra keys when given', () => {
        const newVotes3 = 1
        const articleUpdate4 = {
            inc_votes: newVotes3,
            title: 'This is the wrong title'
        }
        return request(app)
        .patch(`/api/articles/5`)
        .send(articleUpdate4)
        .expect(200)
        .then(({body}) => {
            expect(typeof body.article).toBe('object')
            expect(body.article).toEqual({
                article_id: 5,
                title: 'UNCOVERED: catspiracy to bring down democracy',
                topic: 'cats',
                author: 'rogersop',
                body: 'Bastet walks amongst us, and the cats are taking arms!',
                votes: 1,
                created_at: expect.any(String)
            })
        })
    })
    test('404: article not found', () => {
        const articleUpdate = {
            inc_votes: 1
        }
        return request(app)
        .patch(`/api/articles/500`)
        .send(articleUpdate)
        .expect(404)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Not Found'})
        });
    })
    test('400: wrong data type for id', () => {
        const articleUpdate = {
            inc_votes: 1
        }
        return request(app)
        .patch(`/api/articles/D`)
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body).toEqual({msg: 'Bad Request'})
        })
    })
});

describe('GET /api/articles', () => {
    test('200: responds with an array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length === 12).toBe(true);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                });
            })
        })
    })
    test('200: should be able to use a query and respond with an array of the value asked', () => {
        const topics = 'mitch'
        return request(app)
        .get(`/api/articles?topic=${topics}`)
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length === 11).toBe(true);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: topics,
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            })
        })
    })
    test('200: should be able query sort_by (defaults to date) on any valid column', () => {
        return request(app)
        .get(`/api/articles?sort_by=title`)
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title', {ascending: true})
        });
    });
    test('400: responds with an error message when a column is asked to be sorted by that does not exist', () => {
        return request(app)
        .get(`/api/articles?sort_by=article_name`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Column does not exist')
        });
    });
    test('200: responds with an empty array when the topic does exist but there are no articles about it', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.articles)).toBe(true);
            expect(body.articles.length === 0).toBe(true);
            expect(body.articles).toEqual([])
        })
    })
    test('404: responds with a not found message when the topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=dingoes')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article topic does not exist')
        })
    })
    test('200: user can change order of results', () => {
        return request(app)
        .get(`/api/articles?order=desc`)
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("created_at", {descending: true})
        });
    });
    test('400: responds with an error message when invalid order is entered', () => {
        return request(app)
        .get(`/api/articles?order=sjkldf`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid order request')
        });
    });
    test('200: can respond with multiple queries in place',  () => {
        return request(app)
        .get(`/api/articles?topic=mitch&sort_by=author&order=desc`)
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("author", {descending:true})
            body.articles.forEach((article) => {
              expect(article.topic).toBe('mitch');
            });
        })
    })
});
describe('GET /api/articles/:article_id/comments', () => {
    test('200: should respond with an array of comments for a particular article', () => {
        const article_id = 1
        return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length === 11).toBe(true);
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                })
            })
        })
    })
    test('200: should respond with an empty array when the article exists but no comments are posted', () => {
        return request(app)
        .get(`/api/articles/2/comments`)
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length === 0).toBe(true);
            expect(body.comments).toEqual([]);
        })
    })
    test('404: should respond with an error saying not found when the article id does not exist', () => {
        return request(app)
        .get(`/api/articles/5000/comments`)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article ID does not exist');
        })
    })
    test('400: invalid article id', () => {
        const articleid = 'niamh'
        return request(app)
        .get(`/api/articles/${articleid}/comments`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe('POST: /api/articles/:article_id/comments', () => {
    test('200: should accept an object of username and body and return the posted comment', () => {
        const sendComment = {username: 'lurker', body: 'This article is just ok I guess'}
        return request(app)
        .post(`/api/articles/1/comments`)
        .send(sendComment)
        .expect(201)
        .then(({ body }) => {
            expect(body.comment).toMatchObject({
                article_id: 1,
                author: 'lurker',
                body: 'This article is just ok I guess',
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_id: expect.any(Number)
            })
        })
    })
    test('404: should respond with an error saying not found when the article id does not exist', () => {
        const sendComment = {username: 'lurker', body: 'This article is just ok I guess'}
        return request(app)
        .post(`/api/articles/5000/comments`)
        .send(sendComment)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Does not exist');
        })
    })
    test("400: wrong data type for article id", () => {
        const articleid = "niamh";
        const sendComment = {username: 'lurker', body: 'This article is just ok I guess'}
        return request(app)
        .post(`/api/articles/${articleid}/comments`)
        .send(sendComment)
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
    });
});
    test("404: username doesn't exist", () => {
      const sendComment = {
        username: "niamh",
        body: "This article is just ok I guess",
      };
      return request(app)
        .post(`/api/articles/1/comments`)
        .send(sendComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Does not exist");
        });
    });
    test("400: missing keys from object", () => {
          const sendComment = {
            username: "lurker",
          };
          return request(app)
            .post(`/api/articles/1/comments`)
            .send(sendComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
})

describe('DELETE: /api/comments/:comment_id', () => {
    test('204: should return no content but delete a comment', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('404: returns error message for invalid comment_id', () => {
        return request(app)
        .delete('/api/comments/5000')
        .expect(404)
        .then(({ body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    })
    test('400: returns error message for wrong data type for comment_id', () => {
        return request(app)
        .delete('/api/comments/niamh')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})