'use strict';

/**
 * Standalone seed runner.
 *
 * Usage:
 *   node scripts/run-seed.js [--env .env.seed]
 *
 * The script:
 *  1. Loads environment variables (from .env.seed by default, or first CLI arg)
 *  2. Connects to MongoDB
 *  3. Runs the seeding script
 *  4. Gracefully disconnects
 */

const path = require('path');

// ── Resolve env file ──────────────────────────────────────────────────────────
const envArg = process.argv[2] || '.env.seed';
const envPath = path.isAbsolute(envArg)
    ? envArg
    : path.resolve(process.cwd(), envArg);

require('dotenv').config({ path: envPath });

const mongoose = require('mongoose');
const seedDatabase = require('../seeds/seedDatabase');

const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://localhost:27017/krushi_logic';

// ── Connect ───────────────────────────────────────────────────────────────────
async function run() {
    console.log(`[RUN-SEED] Connecting to MongoDB: ${MONGO_URI}`);

    await mongoose.connect(MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    });

    console.log('[RUN-SEED] Connected. Starting seed…\n');

    try {
        await seedDatabase();
    } finally {
        await mongoose.disconnect();
        console.log('\n[RUN-SEED] MongoDB connection closed.');
    }
}

run().catch((err) => {
    console.error('[RUN-SEED] Fatal error:', err.message || err);
    process.exitCode = 1;
    mongoose.disconnect().finally(() => process.exit(1));
});
