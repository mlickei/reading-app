package com.data.query;

import com.data.Book;
import com.data.driver.DatabaseDriver;
import com.servlet.SessionAttributes;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by Matthew on 4/6/2017.
 */
public class BookQueryBuilder extends QueryBuilder<Book> {

	public static final String BASE_SELECT = "SELECT * FROM book";
	public static final String BASE_ORDER_BY = " ORDER BY book.lastModified desc, book.createdOn desc";

	public BookQueryBuilder() {
		super(BASE_SELECT, BASE_ORDER_BY);
	}

	@Override
	public Object buildObjectFromResult(ResultSet rs) throws SQLException {
		Book book = new Book();

		book.setTitle(rs.getString("title"));
		book.setIsbn(rs.getString("isbn"));
		book.setAuthorFirst(rs.getString("authorFirst"));
		book.setAuthorLast(rs.getString("authorLast"));
		book.setPages(rs.getInt("pages"));

		return book;
	}
}
