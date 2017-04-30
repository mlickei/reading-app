USE reading_app;

DROP TABLE IF EXISTS reading_list;
CREATE TABLE reading_list (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(256),
  userId INT NOT NULL,
  createdOn TIMESTAMP NOT NULL DEFAULT NOW(),
  lastModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES app_user(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS reading_list_book;
CREATE TABLE reading_list_book (
  isbn VARCHAR(256) NOT NULL,
  readingListId INT NOT NULL,
  ordr INT NOT NULL,
  FOREIGN KEY (isbn) REFERENCES book(isbn),
  FOREIGN KEY (readingListId) REFERENCES reading_list(id) ON DELETE CASCADE
);