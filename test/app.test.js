const { expect } = require("chai");
const supertest = require('supertest');
const app = require('../app');


describe('Google-Play Store', () => {
    it('throws a 400 error for invalid sort input', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "asdf" })
            .expect(400, 'Not a valid sort selector.')
    });

    it('throws a 400 error for invalid genre input', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: "asdf" })
            .expect(400, 'Not a valid genre selector.')
    });

    it('detects valid sort parameter(App)', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "App" })
            .expect(200)
    });

    it('detects valid sort parameter(Rating)', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "Rating" })
            .expect(200)
    });

    it('sorts in alphabetical order', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "App" })
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                const val1 = res.body[0].App
                const val2 = res.body[res.body.length - 1].App
                if(val2 > val1) {
                    throw new Error("This is an error")
                }
            });
    });

    it('correctly sorts by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: "Rating" })
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                const num1 = res.body[0].Rating
                const num2 = res.body[res.body.length - 1].Rating
                expect(num1).to.be.greaterThan(num2)
            });
    });

    it('correctly filters content by Genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: "Action" })
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                const val1 = res.body[0].Genres
                const val2 = res.body[res.body.length - 1].Genres
                expect(val1).to.be.deep.equal(val2);
            })
    })
});