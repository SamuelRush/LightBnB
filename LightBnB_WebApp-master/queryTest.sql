SELECT properties.*,AVG(property_reviews.rating) as avg_rating
FROM properties
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE properties.city = 'Vancouver'
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY properties.cost_per_night ASC
LIMIT 10;