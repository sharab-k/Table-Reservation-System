require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const restaurantId = '5ee82204-2cf1-4c0a-9670-72751d7ee2ae';
  const filters = {
    limit: 100,
    sortOrder: 'desc',
    date: '2026-03-25'
  };
  
    let query = supabase
      .from('reservations')
      .select('*, tables(id, table_number, name, floor_areas(name))', { count: 'exact' })
      .eq('restaurant_id', restaurantId);

    // Apply filters
    if (filters.date) {
      query = query.eq('reservation_date', filters.date);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.tableId) {
      query = query.eq('table_id', filters.tableId);
    }
    if (filters.search) {
      query = query.or(
        `guest_first_name.ilike.%${filters.search}%,guest_last_name.ilike.%${filters.search}%,guest_email.ilike.%${filters.search}%`
      );
    }

    // Sorting - Default to date and time
    const sortBy = filters.sortBy || 'start_time'; // Default from Zod is 'start_time'
    const sortOrder = filters.sortOrder === 'desc' ? false : true;
    
    if (sortBy === 'reservation_date') {
      query = query.order('reservation_date', { ascending: sortOrder })
                   .order('start_time', { ascending: true });
    } else {
      query = query.order(sortBy, { ascending: sortOrder });
    }

    // Pagination
    const page = 1;
    const limit = filters.limit;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    console.log(error);
}

run();
