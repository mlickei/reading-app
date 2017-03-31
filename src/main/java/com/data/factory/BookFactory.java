package com.data.factory;

import com.data.Book;
import com.data.driver.DatabaseDriver;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 3/12/2017.
 */
public class BookFactory {

	public static List<Book> getBooks() throws SQLException {
		List<Book> books = new ArrayList<Book>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM reading_app.book ORDER BY createdOn desc");
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

	public static void insertBook(Book book) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO book (isbn, title, authorFirst, authorLast, pages, createdOn, createdByUserId) VALUES (?, ?, ?, ?, ?, ?, ?)");

			statement.setString(1, book.getIsbn());
			statement.setString(2, book.getTitle());
			statement.setString(3, book.getAuthorFirst());
			statement.setString(4, book.getAuthorLast());
			statement.setInt(5, book.getPages());
			statement.setTimestamp(6, book.getCreatedOn());
			//noinspection ConstantConditions
			statement.setInt(7, book.getCreatedBy() == null ? null : book.getCreatedBy().getId());

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static void deleteBook(String isbn) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("DELETE FROM book where isbn = ? ORDER BY createdOn desc");
			statement.setString(1, isbn);

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static Book getBook(String isbn) throws SQLException {
		Book book = null;
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM book where isbn = ? ORDER BY createdOn desc");
			statement.setString(1, isbn);

			rs = statement.executeQuery();

			while(rs.next()) {
				book = new Book();

				book.setTitle(rs.getString("title"));
				book.setIsbn(rs.getString("isbn"));
				book.setAuthorFirst(rs.getString("authorFirst"));
				book.setAuthorLast(rs.getString("authorLast"));
				book.setPages(rs.getInt("pages"));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return book;
	}
}
