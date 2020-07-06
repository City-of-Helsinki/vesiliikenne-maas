/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE IF NOT EXISTS ticket_options(
    id INT GENERATED ALWAYS AS IDENTITY,
    "description" VARCHAR(255),
    "name" VARCHAR(100) NOT NULL,
    amount INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    discount_group VARCHAR(100) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    logoId VARCHAR(100),
    PRIMARY KEY (id)
  );
  `)

  pgm.sql(`
  INSERT INTO ticket_options(
    "description",
    "name",
    discount_group,
    agency,
    logoId,
    amount,
    currency
  ) VALUES (
    'Hop-on hop-off -style ticket at the islands Lonna, Vallisaari and Suomenlinna.',
    'Island Hopping',
    'adult',
    'JT-Line',
    'jt-logo.jpg',
    1200,
    'EUR'
  );
  `)

  pgm.sql(`
  CREATE TABLE IF NOT EXISTS tickets(
    uuid VARCHAR(64) NOT NULL,
    ticket_option_id INTEGER REFERENCES ticket_options(id) NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (uuid)
  );
  `)
}

exports.down = pgm => {
  pgm.sql(`DROP TABLE tickets;`)
  pgm.sql(`DROP TABLE ticket_options;`)
}
