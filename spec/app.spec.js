process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const connection = require("../db/connection.js");
const app = require("../app.js");

describe("Server", () => {
  after(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/", () => {
    it("GET: 404 - responds with an error message when trying to use a path that doesn't exist", () => {
      return request(app)
        .get("/banana")
        .expect(404)
        .then(res => {
          expect(res.body.msg).to.equal("Route Not Found.");
        });
    });
  });
  describe("/api", () => {
    describe("/topics", () => {
      it("GET: 200 - responds with an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics[0]).to.have.all.keys("slug", "description");
          });
      });
      it("GET: 404 - responds with an error message when trying to use a path that doesn't exist", () => {
        return request(app)
          .get("/api/topics/banana")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Route Not Found.");
          });
      });
    });
    describe("/users/:username", () => {
      it("GET: 200 - responds with a user object", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(res => {
            expect(res.body.user).to.deep.equal({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            });
          });
      });
      it("GET: 404 - responds with an error message when trying to get a username that doesn't exist", () => {
        return request(app)
          .get("/api/users/banana")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("User Not Found.");
          });
      });
    });
    describe("/articles/:article_id", () => {
      it("GET: 200 - responds with an article object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(res => {
            expect(res.body.article).to.have.all.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
            expect(res.body.article.article_id).to.equal(1);
            expect(res.body.article.comment_count).to.equal(13);
          });
      });
      it("GET: 404 - responds with an error message when trying to get an article by an article_id that doesn't exist", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Article Not Found.");
          });
      });
      it("GET: 400 - responds with an error message when trying to get an article by an invalid article_id", () => {
        return request(app)
          .get("/api/articles/banana")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Data Type.");
          });
      });
      it("PATCH: 200 - responds with the updated article object when votes count is increased", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(101);
          });
      });
      it("PATCH: 200 - responds with the updated article object when votes count is decreased", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -50 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(50);
          });
      });
      it("PATCH: 400 - responds with an error message when trying to patch without an inc_votes key", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ banana: -50 })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Data Type.");
          });
      });
      it("PATCH: 400 - responds with an error message when trying to patch with anything but an integer as the value of inc_votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Data Type.");
          });
      });
      it("PATCH: ", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "Banana" })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("You Can Only Update Votes.");
          });
      });
    });
  });
});
