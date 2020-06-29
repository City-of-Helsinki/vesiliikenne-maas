#!/usr/bin/env bash

openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem

echo "# Keys generated, use these in .env:"
echo "GWT_SIGNING_PRIVATE_KEY_BASE64=$(cat private_key.pem|base64)"
echo "GWT_SIGNING_PUBLIC_KEY_BASE64=$(cat public_key.pem|base64)"
