require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function resetDatabase() {
  console.log('🗑️  Deleting all data...\n');

  try {
    // Delete all pastes
    console.log('Deleting all pastes...');
    const { error: pastesError, count: pastesCount } = await supabase
      .from('pastes')
      .delete()
      .neq('id', 0); // Delete all rows

    if (pastesError) {
      console.error('Error deleting pastes:', pastesError.message);
    } else {
      console.log(`✅ Deleted all pastes`);
    }

    // Delete all sites
    console.log('Deleting all site registrations...');
    const { error: sitesError, count: sitesCount } = await supabase
      .from('sites')
      .delete()
      .neq('id', ''); // Delete all rows

    if (sitesError) {
      console.error('Error deleting sites:', sitesError.message);
    } else {
      console.log(`✅ Deleted all site registrations`);
    }

    // Reset the auto-increment ID sequence
    console.log('Resetting ID sequence to 1...');
    try {
      const { data, error: resetError } = await supabase.rpc('reset_paste_sequence');

      if (resetError) {
        if (resetError.message.includes('function') && resetError.message.includes('does not exist')) {
          console.log('⚠️  Sequence reset function not found');
          console.log('\nTo enable automatic sequence reset, run this SQL once in your Supabase dashboard:');
          console.log('  (See pastebin/reset-sequence.sql)\n');
          console.log('Or manually reset with:');
          console.log('  ALTER SEQUENCE pastes_id_seq RESTART WITH 1;\n');
        } else {
          throw resetError;
        }
      } else {
        console.log(`✅ ID sequence reset to 1`);
      }
    } catch (error) {
      console.log('⚠️  Could not reset sequence');
      console.log(`Error: ${error.message}`);
      console.log('\nTo reset the ID to 1 manually, run this SQL in your Supabase dashboard:');
      console.log('  ALTER SEQUENCE pastes_id_seq RESTART WITH 1;');
    }

    console.log('\n✅ Database reset complete!');
    console.log('\nYou can now:');
    console.log('1. Re-register your site');
    console.log('2. Start with a clean slate');
    console.log('3. Next paste will have ID = 1');

  } catch (error) {
    console.error('Error resetting database:');
    console.error(error.message);
    process.exit(1);
  }
}

resetDatabase();
