/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE IF NOT EXISTS ticket_options(
    id INT GENERATED ALWAYS AS IDENTITY,
    "description" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    amount INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    discount_group VARCHAR(100) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    logo_id VARCHAR(100),
    instructions VARCHAR(500) NOT NULL,
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
    instructions,
    currency
  ) VALUES (
    'The vessels serving the Island Hopping route will stop at three attractive island destinations (Vallisaari, Suomenlinna and Lonna). You can stop offand continue your trip as you please. Departures from Helsinki Market Square and Hakaniemi.',
    'Island Hopping',
    'adult',
    'JT-Line',
    'jt-logo.jpg',
    1200,
    'With this one-day-ticket passenger can travel as many journeys as she/he wishes during one day to Lonna, Vallisaari and Suomenlinna. Please show the bar code on your smartphone to the fare collector. The ticket is not for a specific departure. Passengers board in their order of arrival. Please note that the ticket is only valid for vessels operated by JT-Line.'
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
