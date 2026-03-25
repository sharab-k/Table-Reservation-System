require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const userId = '679b7de4-ac40-49de-af08-0ffcd84272e3';
  
  const { data: staffMember, error: staffError } = await supabase
    .from('staff_members')
    .select('*, organizations(*)')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();
    
  console.log("Error:", staffError);
  console.log("Data:", staffMember);
}

run();
