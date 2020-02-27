process.env.NODE_ENV = "test";
const chai = require("chai");
const expect = chai.expect;
const chaiSorted = require("sams-chai-sorted");
chai.use(chaiSorted);
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
  describe("/*", () => {
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
    describe("/teapot", () => {
      it("GET: 418 - responds with an error message", () => {
        return request(app)
          .get("/api/teapot")
          .expect(418)
          .then(res => {
            expect(res.body.msg).to.equal("You're a teapot.");
          });
      });
    });
    it("DELETE: 405 - responds with an error message when using an unauthorised method", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then(res => {
          expect(res.body.msg).to.equal("Method Not Allowed.");
        });
    });
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
      it("POST: 405 - responds with an error message when using an unauthorised method", () => {
        return request(app)
          .post("/api/topics")
          .send({ test: "test" })
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal("Method Not Allowed.");
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
      it("PUT: 405 - responds with an error message when using an unauthorised method", () => {
        return request(app)
          .put("/api/users/butter_bridge")
          .send({ test: "test" })
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal("Method Not Allowed.");
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
            expect(res.body.article.comment_count).to.equal("13");
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

    describe("/articles/:article_id/comments", () => {
      it("POST: 201 - responds with the comment object", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "I don't like bananas." })
          .expect(201)
          .then(res => {
            expect(res.body.comment.body).to.deep.equal(
              "I don't like bananas."
            );
          });
      });
      it("POST: 404 - responds with an error message when trying to post to an article that doesn't exist", () => {
        return request(app)
          .post("/api/articles/99999/comments")
          .send({ username: "butter_bridge", body: "I don't like bananas." })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Article Or User Not Found.");
          });
      });
      it("POST: 400 - responds with an error message when trying to post to an invalid article_id", () => {
        return request(app)
          .post("/api/articles/banana/comments")
          .send({ username: "butter_bridge", body: "I don't like bananas." })
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Data Type.");
          });
      });
      it("POST: 404 - responds with an error message when trying to post with a non-existent username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "banana", body: "I don't like bananas." })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Article Or User Not Found.");
          });
      });
      it("GET: 200 - responds with an array of comments", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments.length).to.equal(13);
          });
      });
      it("GET: 200 - responds with an array of comments sorted by created_at in descending order by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: 200 - responds with an array of comments sorted by requested column", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("GET: 200 - responds with an array of comments sorted by requested column in ascending order if requested", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("comment_id", {
              descending: false
            });
          });
      });
      it("GET: 200 - responds with an array of comments sorted by requested column in descending order if order not requested", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id")
          .expect(200)
          .then(res => {
            expect(res.body.comments).to.be.sortedBy("comment_id", {
              descending: true
            });
          });
      });
      it("GET: 400 - responds with an error message when trying to sort by a non-existent column", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=banana")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Column.");
          });
      });
      it("GET: 400 - responds with an error message when using anything else but desc or asc to order", () => {
        return request(app)
          .get("/api/articles/1/comments?order=banana")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Trying To Sort By "banana" Is Not Valid.'
            );
          });
      });
      it("GET: 400 - responds with an error message when trying to get comments by an invalid article ID", () => {
        return request(app)
          .get("/api/articles/banana/comments")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Data Type.");
          });
      });
      it("GET: 404 - responds with an error message when no comments found", () => {
        return request(app)
          .get("/api/articles/99999/comments")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("No Comments Found.");
          });
      });
    });

    describe("/articles", () => {
      it("GET: 200 - responds with an array of articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            res.body.articles.forEach(article => {
              expect(article).to.have.all.keys(
                "article_id",
                "title",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              );
            });
          });
      });
      it("GET: 200 - responds with an array of articles sorted by created_at in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: 200 - responds with an array of articles sorted by requested column", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: true
            });
          });
      });
      it("GET: 200 - responds with an array of articles sorted by requested column in requested order", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: false
            });
          });
      });
      it("GET: 200 - responds with an array of articles filtered by author if provided an author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(res => {
            res.body.articles.forEach(article => {
              expect(article.author).to.equal("butter_bridge");
            });
          });
      });
      it("GET: 200 - responds with an array of articles filtered by topic if provided a topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            res.body.articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("GET: 400 - returns an error message when trying to sort by a column that doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=banana")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal("Invalid Column.");
          });
      });
      it("GET: 400 - returns an error message when trying to order by anything else but asc or desc", () => {
        return request(app)
          .get("/api/articles?order=banana")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              'Trying To Sort By "banana" Is Not Valid.'
            );
          });
      });
      //400 trying to filter by a non-existent author -> maybe should be querying the users table to check whether user exists?
      it("GET: 404 - returns an error message when trying to filter by a non-existent author", () => {
        return request(app)
          .get("/api/articles?author=banana")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("User doesn't exist.");
          });
      });
      //404 trying to filter by a valid author that has no articles
      it("GET: 200 - returns an error message when trying to filter by a valid author that has no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(res => {
            expect(res.body.articles).to.deep.equal([]);
          });
      });
      //404 trying to filter by a non-existent topic
      it("GET: 404 - returns an error message when trying to filter by a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=banana")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("No Articles Found.");
          });
      });
      //404 trying to filter by a valid topic that has no articles
      it("GET: 404 - returns an error message when trying to filter by a valid topic that has no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("No Articles Found.");
          });
      });
      it("PATCH: 405 - responds with an error message when using an unauthorised method", () => {
        return request(app)
          .post("/api/articles")
          .send({ test: "test" })
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal("Method Not Allowed.");
          });
      });
    });

    describe.only("/comments/:comment_id", () => {
      it("PATCH: 200 - responds with an updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(17);
          });
      });
      it("PATCH: 404 - responds with a 404 when trying to patch a non-existent comment", () => {
        return request(app)
          .patch("/api/comments/99999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Comment Not Found.");
          });
      });
      it("DELETE: 204 - responds with a 204 when deleting comment by ID", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("DELETE: 404 - responds with a 404 when trying to delete a non-existent comment", () => {
        return request(app)
          .delete("/api/comments/99999")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Comment Not Found.");
          });
      });
      it("PUT: 405 - responds with an error message when using an unauthorised method", () => {
        return request(app)
          .put("/api/comments/1")
          .send({ test: "test" })
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal("Method Not Allowed.");
          });
      });
    });
  });
});
