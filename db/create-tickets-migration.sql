CREATE TABLE IF NOT EXISTS ticket_types(
  `id` INTEGER NOT NULL,
  `description` VARCHAR(255),
  `name` VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
)


CREATE TABLE IF NOT EXISTS tickets(
  uuid VARCHAR(64) NOT NULL,
  agency VARCHAR(64) NOT NULL,
  ticket_type_id INTEGER REFERENCES ticket_types(id) NOT NULL,
  discount_group VARCHAR(64) NOT NULL,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (uuid)
)
