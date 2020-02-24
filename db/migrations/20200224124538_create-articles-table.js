exports.up = function(knex) {
  return knex.schema.createTable("articles", articlesTable => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("article_title").notNullable();
    articlesTable.string("article_body").notNullable();
    articlesTable.integer("article_votes").defaultTo(0);
    articlesTable
      .string("topic_slug")
      .references("topic_slug")
      .inTable("topics")
      .notNullable();
    articlesTable
      .string("user_username")
      .references("user_username")
      .inTable("users")
      .notNullable();
    articlesTable
      .timestamp("article_created_at", { useTz: true })
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("articles");
};
