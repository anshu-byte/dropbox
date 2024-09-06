import { createDatabase } from './createDatabase.js';
import { createTables } from './createTables.js';

async function setup() {
  try {
    // wait 2 seconds to allow time for docker to start
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await createDatabase();
    await createTables();
  } catch (err) {
    console.error('Error during db setup', err);
  } finally {
    // eslint-disable-next-line no-undef
    process.exit();
  }
}

setup();
