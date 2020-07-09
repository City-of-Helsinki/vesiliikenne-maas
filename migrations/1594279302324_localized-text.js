/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  CREATE TABLE IF NOT EXISTS ticket_translations(
    id INT GENERATED ALWAYS AS IDENTITY,
    ticket_option_id INTEGER REFERENCES ticket_options(id) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    discount_group VARCHAR(100) NOT NULL,
    instructions VARCHAR(500) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    PRIMARY KEY (id));
  `)

  pgm.sql(`
  ALTER TABLE ticket_options
  DROP COLUMN discount_group,
  DROP COLUMN instructions,
  DROP COLUMN description,
  DROP COLUMN name;
  `)

  pgm.sql(`
  INSERT INTO ticket_translations(
    ticket_option_id,
    "language",
    "description",
    "name",
    discount_group,
    instructions
  ) VALUES (
    1,
    'en',
    'The vessels serving the Island Hopping route will stop at three attractive island destinations (Vallisaari, Suomenlinna and Lonna). You can stop offand continue your trip as you please. Departures from Helsinki Market Square and Hakaniemi.',
    'Island Hopping',
    'adult',
    'With this one-day-ticket passenger can travel as many journeys as she/he wishes during one day to Lonna, Vallisaari and Suomenlinna. Please show the bar code on your smartphone to the fare collector. The ticket is not for a specific departure. Passengers board in their order of arrival. Please note that the ticket is only valid for vessels operated by JT-Line.'
  );`)

  pgm.sql(`
  INSERT INTO ticket_translations(
    ticket_option_id,
    "language",
    "description",
    "name",
    discount_group,
    instructions
  ) VALUES (
    1,
    'fi',
    'Matkustamalla Island Hopping-reitin voit käydä saman päivän aikana kolmessa Helsingin vetovoimaisimmassa saarikohteessa: Vallisaaressa, Suomenlinnassa ja Lonnassa. Voit hypätä pois kyydistä ja jatkaa matkaa oman aikataulusi mukaan. Vesibussit lähtevät Kauppatorin Kolera-altaalta ja Hakaniemen rannasta.',
    'Island Hopping',
    'aikuinen',
    'Lippu on voimassa koko matkustuspäivän, jolloin sillä voi matkustaa rajattomasti Kauppatorin, Lonnan, Vallisaaren, Suomenlinnan ja Hakaniemen välillä JT-Linen aluksilla. Näytä matkalipun viivakoodia matkapuhelimestasi aluksen rahastajalle. Lippu ei oikeuta paikkavaraukseen tietylle vuorolle, vaan alukset täytetään matkustajien saapumisjärjestyksessä. Tämä lippu kelpaa vain JT-Linen liikennöimällä reitillä.'
    );`)
}

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE ticket_options
  ADD COLUMN IF NOT EXISTS discount_group VARCHAR(100),
  ADD COLUMN IF NOT EXISTS instructions VARCHAR(10000),
  ADD COLUMN IF NOT EXISTS description VARCHAR(500),
  ADD COLUMN IF NOT EXISTS name VARCHAR(100);
  `)

  pgm.sql(`
  UPDATE ticket_options
    SET discount_group = 'adult',
    instructions = 'With this one-day-ticket passenger can travel as many journeys as she/he wishes during one day to Lonna, Vallisaari and Suomenlinna. Please show the bar code on your smartphone to the fare collector. The ticket is not for a specific departure. Passengers board in their order of arrival. Please note that the ticket is only valid for vessels operated by JT-Line.',
    description = 'The vessels serving the Island Hopping route will stop at three attractive island destinations (Vallisaari, Suomenlinna and Lonna). You can stop offand continue your trip as you please. Departures from Helsinki Market Square and Hakaniemi.',
    name = 'Island Hopping'
  WHERE id = 1;
  `)

  pgm.sql(`DROP TABLE ticket_translations;`)
}
