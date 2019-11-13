SELECT reservations.*, properties.*, AVG(property_reviews.rating) as avg_rating
FROM reservations
JOIN properties ON properties.id = reservations.property_id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.end_date < Now()::date AND reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10;