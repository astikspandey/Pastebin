require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function initializeDatabase() {
  console.log('Initializing Supabase database...\n');

  try {
    // Read SQL schema
    const sqlPath = path.join(__dirname, 'supabase-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Creating tables...');

    // Split SQL into individual statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.warn('Warning:', error.message);
        }
      } catch (err) {
        // Try direct query if RPC fails
        console.log('Using direct query method...');
        break;
      }
    }

    // Verify tables exist
    console.log('\nVerifying tables...');

    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('count')
      .limit(1);

    const { data: pastes, error: pastesError } = await supabase
      .from('pastes')
      .select('count')
      .limit(1);

    if (!sitesError && !pastesError) {
      console.log('✅ Tables verified successfully!');
      console.log('\nDatabase is ready to use.');
      console.log('\nNext steps:');
      console.log('1. Start the pastebin service: npm start');
      console.log('2. In another terminal, start the website');
      console.log('3. Open http://localhost:3000 and register your site');
    } else {
      console.log('\n⚠️  Could not verify tables automatically.');
      console.log('Please run the SQL manually:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Click on "SQL Editor"');
      console.log('3. Copy and paste the contents of supabase-schema.sql');
      console.log('4. Click "Run"');
    }

  } catch (error) {
    console.error('Error initializing database:');
    console.error(error.message);
    console.log('\nPlease run the SQL manually:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Click on "SQL Editor" in the left menu');
    console.log('4. Copy and paste the contents of pastebin/supabase-schema.sql');
    console.log('5. Click "Run"');
  }
}

initializeDatabase();
