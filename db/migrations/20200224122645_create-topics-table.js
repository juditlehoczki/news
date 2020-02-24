exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("topic_slug").primary(); //.notNullable();
    topicsTable.string("topic_description").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("topics");
};
