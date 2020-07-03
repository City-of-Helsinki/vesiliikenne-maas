/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE IF NOT EXISTS ticket_types(
    id INT GENERATED ALWAYS AS IDENTITY,
    "description" VARCHAR(255),
    "name" VARCHAR(100) NOT NULL,
    amount MONEY NOT NULL,
    discount_group VARCHAR(100) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    logoId VARCHAR(100),
    PRIMARY KEY (id)
  );
  `)

  pgm.sql(`
  INSERT INTO ticket_types (
    "description",
    "name",
    discount_group,
    agency,
    logoId,
    amount
  ) VALUES (
    'Hop-on hop-off -style ticket at the islands Lonna, Vallisaari and Suomenlinna.',
    'Island Hopping',
    'adult',
    'JT-Line',
    'jt-logo.jpg',
    12.00
  );
  `)

  pgm.sql(`
  CREATE TABLE IF NOT EXISTS tickets(
    uuid VARCHAR(64) NOT NULL,
    ticket_type_id INTEGER REFERENCES ticket_types(id) NOT NULL,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (uuid)
  );
  `)
}

exports.down = pgm => {}
