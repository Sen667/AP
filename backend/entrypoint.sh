#!/bin/sh
set -e

echo "🚀 Démarrage du conteneur..."

# Attente de la base de données (Utilise les variables d'environnement du .env)
echo "⏳ Attente de la base de données sur $DB_HOST:5432..."
until nc -z "$DB_HOST" 5432; do
  echo "❌ DB non prête, nouvelle tentative dans 2s..."
  sleep 2
done
echo "✅ Base de données prête !"

# Application des migrations
echo "📦 Application des migrations Prisma..."
npx prisma migrate deploy --config prisma.config.ts

if [ -f "prisma/seed.ts" ]; then
  USER_COUNT=$(PGPASSWORD="${DB_PASSWORD:-fripouilles}" psql -h "${DB_HOST:-db}" -U "${DB_USERNAME:-fripouilles}" -d "${DB_DATABASE:-fripouilles_db}" -t -c "SELECT COUNT(*) FROM utilisateurs;" 2>/dev/null | tr -d ' ' || echo "0")
  if [ "$USER_COUNT" = "0" ]; then
    echo "🌱 Exécution du seed (base vide)..."
    npx tsx prisma/seed.ts || echo "⚠️ Seed échoué"
  else
    echo "✅ Base déjà peuplée ($USER_COUNT utilisateurs), seed ignoré."
  fi
fi

echo "🔥 Lancement de l'application..."
exec node dist/src/main.js
