# Press-JL (Backend)

A RESTful Express server that gives access to an SQL database of articles, comments, topics and users.

### Hosted at https://press-jl.herokuapp.com.

#### I also built a frontend to this server, it's live at http://press-jl.netlify.com and you can check out the code on [this repository](https://github.com/juditlehoczki/news-frontend).

## Available Endpoints

Go to [https://press-jl.herokuapp.com/api](https://press-jl.herokuapp.com) to see details on all the available endpoints of the API.

- `/api`
- `/api/topics`
- `/api/users`
- `/api/users/:username`
- `/api/articles`
- `/api/articles/:article_id`
- `/api/articles/:article_id/comments`
- `/api/comments/:comment_id`

## Install

To run this locally please follow the below steps:

- Make sure you have version 2.10.1 (or above) of Node JS installed (to check, type `git --version` in your terminal)
- Clone this repository by putting `git clone https://github.com/juditlehoczki/news-backend.git` in your terminal
- Install the necessary dependencies by typing `npm install`
- Create a knexfile.js in the root directory and put the below in the file:

  ```js
  const ENV = process.env.NODE_ENV || "development";
  const baseConfig = {
    client: "pg",
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds"
    }
  };
  const customConfig = {
    development: {
      connection: {
        database: "nc_news"
        // user,
        // password
      }
    },
    test: {
      connection: {
        database: "nc_news_test"
        // user,
        // password
      }
    }
  };
  module.exports = { ...customConfig[ENV], ...baseConfig };
  ```

- Setup the database by running `npm run seed`.
- To run locally type `npm run start`.
- Go to your browser and open your localhost: http://localhost:9090/api. The above endpoints will now be available for you to use locally.

## Built With

- [Express](http://expressjs.com/)
- [Knex](https://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Tests

### Unit testing

Each pure function has been tested separately. To run the tests, type `npm run test-utils`.

### Integration testing

Tests were carried out on each method of each endpoint as well as handling all potential errors. To run the tests, type `npm run test`.

## Tested With

- [Supertest](https://www.npmjs.com/package/supertest)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)

## Author

Judit Lehoczki

- [GitHub](https://github.com/juditlehoczki)
- [LinkedIn](https://www.linkedin.com/in/juditlehoczki/)
