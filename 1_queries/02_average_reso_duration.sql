SELECT AVG(total_time) as avg_duration
FROM (
  select end_date-start_date as total_time
  FROM reservations
) as total_times;