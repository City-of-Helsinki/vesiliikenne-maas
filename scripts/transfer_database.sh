#!/usr/bin/env bash

PGPASSWORD=hki-vesiliikenne pg_dump -Fc --no-acl --no-owner -h localhost -U postgres postgres > dump_with_extensions.dump
# => Make available publicly, for example put to dropbox, use wget to follow redirects to get final URL, then:
# heroku pg:backups:restore [public_url] DATABASE_URL
