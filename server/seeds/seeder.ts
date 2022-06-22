import { readFileSync } from 'fs';
import { join, normalize } from 'path';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

;(async () => {
  const seeds = await getSeeds();
  if (seeds.length === 0) {
    console.log('No seeds found.');
    process.exit(0);
  }

  console.log('Seeding');

  let allGood = false;

  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const seed of seeds) {
      console.log(`${seed.file}`);
      try {
        await client.query(seed.query);
      } catch (err) {
          console.error(`Error while running seed ${seed.file}. See the "hint" in the below error for help.\n`);
          console.log(seed.query);
          console.error(err);
          throw err;    
      }
    }

    await client.query('COMMIT');
    allGood = true;
    console.log('All seeds executed successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
    console.groupEnd();
    process.exit(allGood ? 0 : 1);
  }
})().catch(e => {
  console.error(e.stack);
  process.exit(1);
});

async function getSeeds(): Promise<Array<Seed>> {  
  const seeds: string[] = JSON.parse(readFileSync(normalize(join(__dirname, 'seeds.json')), 'utf-8'));
  return Promise.all(seeds.map(async file => {
    const query = readFileSync(normalize(join(__dirname, file)), 'utf-8');
    return {
      file,
      query
    };
  }));
}

type Seed = {
  file: string;
  query: string;
};