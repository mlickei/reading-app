package com.data.factory;

import com.data.Book;
import com.data.ReadingList;
import com.data.User;
import com.data.driver.DatabaseDriver;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 4/29/2017.
 */
public class ReadingListFactory {

	public static List<ReadingList> getReadingLists(User user) throws SQLException {
		List<ReadingList> readingLists = new ArrayList<>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM reading_list where userId = ? ORDER BY createdOn desc, lastModified desc");
			statement.setInt(1, user.getId());
			rs = statement.executeQuery();

			while(rs.next()) {
				ReadingList readingList = new ReadingList();

				readingList.setId(rs.getInt("id"));
				readingList.setUser(user);
				readingList.setName(rs.getString("name"));
				readingList.setBooks(getReadingListBooks(readingList));

				readingLists.add(readingList);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return readingLists;
	}

	public static List<Book> getReadingListBooks(ReadingList readingList) throws SQLException {
		List<Book> books = new ArrayList<Book>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT b.* FROM book as b INNER JOIN reading_list_book as rlb on b.isbn = rlb.isbn WHERE rlb.readingListId = ? ORDER BY rlb.ordr asc");
			statement.setInt(1, readingList.getId());
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

	public static void insertReadingList(ReadingList readingList) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO reading_list (name, userId) VALUES (?, ?)", Statement.RETURN_GENERATED_KEYS);

			statement.setString(1, readingList.getName());
			statement.setInt(2, readingList.getUser().getId());

			int affectedRows = statement.executeUpdate();

			if(affectedRows > 0) {
				ResultSet keys = statement.getGeneratedKeys();
				if(keys.next()) {
					readingList.setId(keys.getInt(1));
					List<Book> books = readingList.getBooks();
					for(int idx = 0; idx < books.size(); idx ++) {
						insertReadingListBook(readingList, books.get(idx), Integer.toString(idx));
					}
				}
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static void insertReadingListBook(ReadingList readingList, Book book) throws SQLException {
		insertReadingListBook(readingList, book, readingList.getBooks().size());
	}

	public static void insertReadingListBook(ReadingList readingList, Book book, int order) throws SQLException {
		insertReadingListBook(readingList, book, Integer.toString(order));
	}

	public static void insertReadingListBook(ReadingList readingList, Book book, String order) throws SQLException {
		insertReadingListBook(readingList.getId(), book.getIsbn(), order);
	}

	public static void insertReadingListBook(int readingListId, String bookIsbn, int order) throws SQLException {
		insertReadingListBook(readingListId, bookIsbn, Integer.toString(order));
	}

	public static void insertReadingListBook(int readingListId, String bookIsbn, String order) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO reading_list_book (isbn, readingListId, ordr) VALUES (?, ?, ?)");

			statement.setString(1, bookIsbn);
			statement.setInt(2, readingListId);
			statement.setString(3, order);

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static void insertReadingListBook(int readingListId, String bookIsbn) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO reading_list_book (isbn, readingListId, ordr) VALUES (?, ?, (SELECT COUNT(*) FROM reading_list_book as rlb WHERE rlb.readingListId = ?))");

			statement.setString(1, bookIsbn);
			statement.setInt(2, readingListId);
			statement.setInt(3, readingListId);

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static void removeReadingListBook(int readingListId, String bookIsbn) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("DELETE FROM reading_list_book WHERE readingListId = ? AND isbn = ? LIMIT 1");

			statement.setInt(1, readingListId);
			statement.setString(2, bookIsbn);

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static ReadingList getReadingList(int id) throws SQLException {
		ReadingList readingList = null;
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM reading_list where id = ? ORDER BY createdOn desc, lastModified desc");
			statement.setInt(1, id);
			rs = statement.executeQuery();

			if(rs.next()) {
				readingList = new ReadingList();
				readingList.setId(rs.getInt("id"));
				readingList.setName(rs.getString("name"));
				readingList.setBooks(getReadingListBooks(readingList));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return readingList;
	}
}
