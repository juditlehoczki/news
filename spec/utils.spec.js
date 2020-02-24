const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

/*
 {
    title: 'A',
    topic: 'mitch',
    author: 'icellusedkars',
    body: 'Delicious tin of cat food',
    created_at: 911564514171,
  },
  {
    title: 'Z',
    topic: 'mitch',
    author: 'icellusedkars',
    body: 'I was hungry.',
    created_at: 785420514171,
  }
*/

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
    const actual = makeRefObj(input, "title", "article_id");
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
    const actual = makeRefObj(input, "title", "article_id");
    expect(actual).to.deep.equal({
      "Living in the shadow of a great man": 1,
      "Eight pug gifs that remind me of mitch": 2
    });
  });
});

describe("formatComments", () => {});
