SET search_path TO public;

CREATE TABLE IF NOT EXISTS ticket_types(
  "id" INTEGER NOT NULL,
  "description" VARCHAR(255),
  "name" VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO ticket_types (
  "id",
  "description",
  "name",
  amount,
  currency
) VALUES (
  1,
  'Hop-on hop-off -style ticket at the islands Lonna, Vallisaari and Suomenlinna.',
  'Island Hopping',
  1200,
  'EUR'
);


CREATE TABLE IF NOT EXISTS tickets(
  uuid VARCHAR(64) NOT NULL,
  agency VARCHAR(64) NOT NULL,
  ticket_type_id INTEGER REFERENCES ticket_types(id) NOT NULL,
  discount_group VARCHAR(64) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (uuid)
);
