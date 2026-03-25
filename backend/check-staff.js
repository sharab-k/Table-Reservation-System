const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStaff() {
  const { data, error } = await supabase
    .from('staff_members')
    .select('*, organizations(*)')
    .limit(10);

  if (error) {
    console.error('Error fetching staff:', error);
    return;
  }

  console.log('Staff Records:');
  console.log(JSON.stringify(data, null, 2));
}

checkStaff();
