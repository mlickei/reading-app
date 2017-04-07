package com.data.query;

import com.data.Book;
import com.data.driver.DatabaseDriver;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Created by Matthew on 4/6/2017.
 */
public class BookQueryBuilder {

	public static final String BASE_SELECT = "SELECT * FROM book ";
	public static final String BASE_ORDER_BY = " ORDER BY lastModified desc, createdOn desc";
	private LinkedHashMap<String, Object> constraints = new LinkedHashMap<>();

	public String getQueryStr() {
		StringBuilder sb = new StringBuilder();
		sb.append(BASE_SELECT);

		if(constraints.size() > 0) {
			sb.append("where");
			for (String key : constraints.keySet()) {
				sb.append(" ");
				sb.append(key);
				sb.append(" ?");
			}
		}

		sb.append(BASE_ORDER_BY);
		return sb.toString();
	}

	public Collection<Object> getConstraintValues() {
		return constraints.values();
	}

	public List<Book> getResults() throws SQLException {
		List<Book> books = new ArrayList<Book>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			String query = getQueryStr();
			statement = conn.prepareStatement(query);

			int constIdx = 1;
			for(Object constraint : getConstraintValues()) {
				statement.setObject(constIdx, constraint);
			}

			rs = statement.executeQuery();

			while(rs.next()) {
				Book book = new Book();

				book.setTitle(rs.getString("title"));
				book.setIsbn(rs.getString("isbn"));
				book.setAuthorFirst(rs.getString("authorFirst"));
				book.setAuthorLast(rs.getString("authorLast"));
				book.setPages(rs.getInt("pages"));

				books.add(book);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return books;
	}

	public void addConstraint(String name, String operation, Object value) {
		constraints.put(name + " " + operation, value);
	}

}
