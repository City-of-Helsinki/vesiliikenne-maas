/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
  UPDATE ticket_translations
  SET 
    description = 'The vessels serving the Island Hopping route will stop at three attractive island destinations: Vallisaari, Suomenlinna and Lonna. You can stop off and continue your trip as you please. Departures from Helsinki Market Square.'
  WHERE name = 'Island Hopping' AND language = 'en';
  `)

  pgm.sql(`
  UPDATE ticket_translations
  SET 
    description = 'Matkustamalla Island Hopping-reitin voit käydä saman päivän aikana kolmessa Helsingin vetovoimaisimmassa saarikohteessa: Vallisaaressa, Suomenlinnassa ja Lonnassa. Voit hypätä pois kyydistä ja jatkaa matkaa oman aikataulusi mukaan. Vesibussit lähtevät Kauppatorin Kolera-altaalta.'
  WHERE name = 'Island Hopping' AND language = 'fi';
  `)
}

exports.down = pgm => {
  pgm.sql(`
  UPDATE ticket_translations
  SET 
    description = 'The vessels serving the Island Hopping route will stop at three attractive island destinations (Vallisaari, Suomenlinna and Lonna). You can stop offand continue your trip as you please. Departures from Helsinki Market Square and Hakaniemi.',
  WHERE name = 'Island Hopping' AND language = 'en';
  `)

  pgm.sql(`
  UPDATE ticket_translations
  SET 
    description = 'Matkustamalla Island Hopping-reitin voit käydä saman päivän aikana kolmessa Helsingin vetovoimaisimmassa saarikohteessa: Vallisaaressa, Suomenlinnassa ja Lonnassa. Voit hypätä pois kyydistä ja jatkaa matkaa oman aikataulusi mukaan. Vesibussit lähtevät Kauppatorin Kolera-altaalta ja Hakaniemen rannasta.'
  WHERE name = 'Island Hopping' AND language = 'fi';
  `)
}
