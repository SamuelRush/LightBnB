const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool.query(`
    SELECT *
    FROM users
    WHERE email = $1
  `,[email])
  .then(res => {
    return res.rows[0] || null;
  })
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
    SELECT * 
    FROM USERS
    WHERE id = $1
  `,[id])
  .then(res => {
    return res.rows[0] || null;
  })
  //return Promise.resolve(users[id]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  //user = {name: 'Sam', email: 'Sam@gmail.com', password: "password"}
  const userName = user.name;
  const userEmail = user.email;
  const userPassword = user.password;
  let values = [userName,userEmail,userPassword];

  return pool.query(`
    INSERT INTO users (name,email,password)
    VALUES ($1,$2,$3)
    RETURNING *;
  `,values)
  .then(res => {
    return res.rows[0] || null;
  })
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  values = [guest_id, limit]

  return pool.query(`
  SELECT reservations.*, properties.*, AVG(property_reviews.rating) as avg_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.end_date < Now()::date AND reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;
  `,values)
  .then(res => {
    return res.rows;
  })
  
  //return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let whereClause = "";

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  whereClause = `WHERE`;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    if (whereClause === `WHERE`) {
      whereClause += ` city LIKE $${queryParams.length} `;
    } else {
      whereClause += `AND city LIKE $${queryParams.length} `;
    }
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (whereClause === `WHERE`) {
      whereClause += ` owner_id = $${queryParams.length} `;
    } else {
      whereClause += `AND owner_id = $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    if (whereClause === `WHERE`) {
      whereClause += ` (properties.cost_per_night/100) >= $${queryParams.length} `;
    } else {
      whereClause += `AND (properties.cost_per_night/100) >= $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    if (whereClause === `WHERE`) {
      whereClause += ` (properties.cost_per_night/100) < $${queryParams.length} `;
    } else {
      whereClause += `AND (properties.cost_per_night/100) < $${queryParams.length} `;
    }
  }

  if (whereClause !== `WHERE`) {
    queryString += whereClause
  }

  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
  .then(res => res.rows);
  // return pool.query(`
  // SELECT * FROM properties
  // LIMIT $1
  // `, [limit])
  // .then(res => res.rows);
}

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
