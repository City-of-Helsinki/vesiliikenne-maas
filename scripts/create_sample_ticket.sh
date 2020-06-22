#!/usr/bin/env bash

# Echo the sample ticket with CR ($'\r') in the end, which is then followed by the normal LF.
# Together they form a Windows linefeed (CRLF) as expected by CSV reading.
echo "c9a5c85d-7d8a-4f8c-8424-ba7f6434d010,JT-Line,Day,Adult,2020-06-11T10:48:44+03:00,2020-06-12T03:00:00+03:00"$'\r' >> "$(dirname "$0")"/../tickets.csv
