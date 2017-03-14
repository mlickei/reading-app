CREATE DATABASE reading_app;

create TABLE user (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE book (
  isbn VARCHAR(255) NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  pages INT,
  authorFirst VARCHAR(255),
  authorLast VARCHAR(255)
);

CREATE TABLE reading_entry (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  isbn VARCHAR(255) NOT NULL,
  userId INT NOT NULL,
  startPage INT,
  endPage INT,
  startTime TIMESTAMP,
  endTime TIMESTAMP,
  FOREIGN KEY (isbn) REFERENCES book (isbn),
  FOREIGN KEY (userId) REFERENCES user (id)
);