import { createClient } from '@libsql/client';

const client = createClient({
  url:       process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const columns = [
  'ALTER TABLE "Order" ADD COLUMN "ipAddress"   TEXT',
  'ALTER TABLE "Order" ADD COLUMN "userAgent"   TEXT',
  'ALTER TABLE "Order" ADD COLUMN "referer"     TEXT',
  'ALTER TABLE "Order" ADD COLUMN "acceptLang"  TEXT',
  'ALTER TABLE "Order" ADD COLUMN "timezone"    TEXT',
  'ALTER TABLE "Order" ADD COLUMN "utmSource"   TEXT',
  'ALTER TABLE "Order" ADD COLUMN "utmMedium"   TEXT',
  'ALTER TABLE "Order" ADD COLUMN "utmCampaign" TEXT',
  'ALTER TABLE "Order" ADD COLUMN "geoCountry"  TEXT',
  'ALTER TABLE "Order" ADD COLUMN "geoRegion"   TEXT',
  'ALTER TABLE "Order" ADD COLUMN "geoCity"     TEXT',
  'ALTER TABLE "Order" ADD COLUMN "geoIsp"      TEXT',
];

for (const sql of columns) {
  const col = sql.match(/"(\w+)"\s*TEXT$/)[1];
  try {
    await client.execute(sql);
    console.log(`✓ Added: ${col}`);
  } catch (e) {
    if (e.message?.includes('duplicate column')) {
      console.log(`– Skip:  ${col} (already exists)`);
    } else {
      console.error(`✗ Error: ${col} — ${e.message}`);
    }
  }
}

console.log('\nDone.');
