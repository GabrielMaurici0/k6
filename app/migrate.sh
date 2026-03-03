#!/bin/bash
set -e

psql $DATABASE_URL -f /app/db/migrations/001_init.sql