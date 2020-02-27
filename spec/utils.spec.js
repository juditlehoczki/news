process.env.NODE_ENV = "test";
const connection = require("../db/connection.js");

const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments,
  checkIfExists
} = require("../db/utils/utils");

//Formatting data before seeding
describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const actual = formatDates([]);
    expect(actual).to.deep.equal([]);
  });
  it("returns an array of one object with the correct date type", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      }
    ];
    const actual = formatDates(input);
    expect(actual[0].created_at).to.deep.equal(new Date(911564514171));
  });
  it("returns an array of multiple objects with the correct date types", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const actual = formatDates(input);
    expect(actual[0].created_at).to.deep.equal(new Date(911564514171));
    expect(actual[1].created_at).to.deep.equal(new Date(785420514171));
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    formatDates(input);
    expect(input[0]).to.deep.equal({
      title: "A",
      topic: "mitch",
      author: "icellusedkars",
      body: "Delicious tin of cat food",
      created_at: 911564514171
    });
  });
});

describe("makeRefObj", () => {
  it("returns a empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    expect(actual).to.deep.equal({});
  });
  it("returns an object with one key if passed an array with one object", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = makeRefObj(input);
    expect(actual).to.deep.equal({ "Living in the shadow of a great man": 1 });
  });
  it("returns an object with multiple keys if passed an array with multiple objects", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      }
    ];
    const actual = makeRefObj(input);
    expect(actual).to.deep.equal({
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2
    });
  });
});

describe("formatComments", () => {
  it("formats one comment when passed one comment", () => {
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 1
    };
    const actual = formatComments(comment, articleRef);
    expect(actual[0]).to.have.all.keys(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[0].article_id).to.equal(1);
    expect(actual[0].created_at).to.deep.equal(new Date(1511354163389));
  });
  it("formats multiple comments when passed multiple comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 1
    };
    const actual = formatComments(comments, articleRef);
    expect(actual[0]).to.have.all.keys(
      "body",
      "article_id",
      "author",
      "votes",
      "created_at"
    );
    expect(actual[0].article_id).to.equal(1);
    expect(actual[0].created_at).to.deep.equal(new Date(1511354163389));
  });
  it("does not mutate the original array of comments", () => {
    const comments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 1
    };
    formatComments(comments, articleRef);
    expect(comments[0]).to.deep.equal({
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: "butter_bridge",
      votes: 16,
      created_at: 1511354163389
    });
  });
});

// Utility function for models
describe("checkIfExists", () => {
  after(() => {
    return connection.destroy();
  });
  it("returns 0 if required value doesn't exist in required table", () => {
    return checkIfExists("banana", "slug", "topics").then(res => {
      expect(res).to.equal(0);
    });
  });
  it("returns 1 if required value does exist in required table", () => {
    return checkIfExists("mitch", "slug", "topics").then(res => {
      expect(res).to.equal(1);
    });
  });
  it("returns an error message when passed a non-existent column in table", () => {
    return checkIfExists("mitch", "banana", "topics").then(res => {
      expect(res).to.equal("Column Doesn't Exist.");
    });
  });
  it("returns an error message when passed a non-existent table", () => {
    return checkIfExists("mitch", "slug", "banana").then(res => {
      expect(res).to.equal("Table Doesn't Exist.");
    });
  });
  it("returns 0 if value is undefined", () => {
    expect(checkIfExists(undefined, "slug", "banana")).to.equal(0);
  });
});
