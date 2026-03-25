require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const email = "fresh_1774439405986@example.com";
  
  // 1. Get auth user
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    console.log("User not in auth.users");
    return;
  }
  console.log("Auth user ID:", user.id);
  
  // 2. Query staff_members
  const { data: staff } = await supabase
    .from('staff_members')
    .select('*')
    .eq('user_id', user.id);
    
  console.log("Staff members found:", staff);
  
  // 3. Query all staff just in case
  const { data: allStaff } = await supabase
    .from('staff_members')
    .select('*');
  console.log("All staff emails:", allStaff.map(s => s.email));
}

run();
