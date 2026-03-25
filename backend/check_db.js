require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const orgId = 'org_2teQOPaG20b1OedD8kZ1zEaU2Wf';

  const { data: tables } = await supabase
    .from('tables')
    .select('*')
    .eq('organization_id', orgId);
    
  console.log("Tables schema (first item):", tables ? tables[0] : null);
  console.log("All Table categories:", tables ? Array.from(new Set(tables.map(t => t.category))) : []);
  console.log("Total tables:", tables ? tables.length : 0);

  const { data: res } = await supabase
    .from('reservations')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log("Recent Reservations:", res);
}

run();
