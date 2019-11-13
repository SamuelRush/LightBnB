SELECT properties.city, count(reservations.property_id) as total_reso
FROM properties
JOIN reservations ON properties.id = reservations.property_id
GROUP BY properties.city
ORDER BY count(reservations.property_id) DESC;