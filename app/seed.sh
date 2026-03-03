#!/bin/bash
set -e

psql $DATABASE_URL -f /app/db/seeds/base.sql