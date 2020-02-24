exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("user_username")
      .references("user_username")
      .inTable("users")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("article_id")
      .inTable("articles")
      .notNullable();
    commentsTable.integer("comment_votes").defaultTo(0);
    commentsTable
      .timestamp("comment_created_at", { useTz: true })
      .defaultTo(knex.fn.now());
    commentsTable.string("comment_body").notNullable();
  });
};

exports.down = function(knex) {};
