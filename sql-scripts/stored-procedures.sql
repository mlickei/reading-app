DROP PROCEDURE IF EXISTS reading_list_update_book_order;

CREATE PROCEDURE reading_list_update_book_order
  (IN rli INT, IN b VARCHAR(256), IN ordre INT)
  BEGIN
    UPDATE reading_list_book as rlb SET ordr = ordre WHERE rlb.readingListId = rli AND rlb.isbn = b LIMIT 1;
  END;

DROP PROCEDURE IF EXISTS reading_list_book_remove_order_update;

CREATE PROCEDURE reading_list_book_remove_order_update
  (IN rlid INT)
  BEGIN
    DECLARE idx, done INT DEFAULT 0;
    DECLARE o, rli INT;
    DECLARE b VARCHAR(256);
    DECLARE rlCur CURSOR FOR SELECT ordr, isbn, readingListId FROM tmp_reading_list_book ORDER BY ordr;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_reading_list_book (isbn VARCHAR(256), readingListId INT, ordr INT) AS (SELECT isbn, readingListId, ordr FROM reading_list_book WHERE readingListId = rlid);

    OPEN rlCur;

    rl_loop: LOOP
      FETCH rlCur INTO o, b, rli;

      IF done = 1 THEN
        LEAVE rl_loop;
      END IF;

      CALL reading_list_update_book_order(rli, b, idx);
      SELECT idx + 1 INTO idx;
    END LOOP;

    DROP TEMPORARY TABLE tmp_reading_list_book;

    CLOSE rlCur;
  END;

DROP PROCEDURE IF EXISTS remove_reading_list_book;

CREATE PROCEDURE remove_reading_list_book
  (IN rlid INT, IN bISBN VARCHAR(256))
  BEGIN
    DELETE FROM reading_list_book WHERE readingListId = rlid AND isbn = bISBN LIMIT 1;
    CALL reading_list_book_remove_order_update(rlid);
  END;