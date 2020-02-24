exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("user_username").primary();
    usersTable.string("user_avatar_url"); //.notNullable();
    usersTable.string("user_name").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
