INSERT INTO users (name, email, password)
VALUES ('Sam Rush', 'sam@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Max Rush', 'max@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Leo Rush', 'leo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code,active)
VALUES (1, 'Speed Lamp', 'description', 'URL1', 'URL2', 18, 2, 1, 18, 'Canada','Fake Street','Edmonton','AB','123456',1),
(1, 'Blnk Corner', 'description', 'URL1', 'URL2', 1, 2, 2, 8, 'Canada','Fake Street','Calgary','AB','123256',0),
(3, 'Habit Mix', 'description', 'URL1', 'URL2', 180, 2, 1, 1, 'Canada','Fake Street','Red Deer','AB','143456',1);