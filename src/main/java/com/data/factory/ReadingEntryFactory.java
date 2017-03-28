package com.data.factory;

import com.data.ReadingEntry;
import com.data.User;
import com.data.driver.DatabaseDriver;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 3/12/2017.
 */
public class ReadingEntryFactory {

	public static List<ReadingEntry> getReadingEntries(User user) throws SQLException {
		List<ReadingEntry> readingEntries = new ArrayList<ReadingEntry>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM reading_entry where userId = ?");
			statement.setInt(1, user.getId());
			rs = statement.executeQuery();

			while(rs.next()) {
				ReadingEntry readingEntry = new ReadingEntry();

				readingEntry.setId(rs.getInt("id"));
				readingEntry.setBook(BookFactory.getBook(rs.getString("isbn")));
				readingEntry.setUser(user);
				readingEntry.setStartPage(rs.getInt("startPage"));
				readingEntry.setEndPage(rs.getInt("endPage"));
				readingEntry.setStartTime(rs.getTimestamp("startTime"));
				readingEntry.setEndTime(rs.getTimestamp("endTime"));

				readingEntries.add(readingEntry);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return readingEntries;
	}

	public static void insertReadingEntry(ReadingEntry readingEntry) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO reading_entry (isbn, userId, startTime, endTime, startPage, endPage) VALUES (?, ?, ?, ?, ?, ?)");

			statement.setString(1, readingEntry.getBook().getIsbn());
			statement.setInt(2, readingEntry.getUser().getId());
			statement.setTimestamp(3, readingEntry.getStartTime());
			statement.setTimestamp(4, readingEntry.getEndTime());
			statement.setInt(5, readingEntry.getStartPage());
			statement.setInt(6, readingEntry.getEndPage());

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static void deleteReadingEntry(int id) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("DELETE FROM reading_entry where id = ?");
			statement.setInt(1, id);

			statement.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static ReadingEntry getReadingEntry(int id) throws SQLException {
		ReadingEntry readingEntry = null;
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM reading_entry where isbn = ?");
			statement.setInt(1, id);

			rs = statement.executeQuery();

			while(rs.next()) {
				readingEntry = new ReadingEntry();

				readingEntry.setId(id);
				readingEntry.setBook(BookFactory.getBook(rs.getString("isbn")));
				readingEntry.setUser(UserFactory.getUser(rs.getInt("userId")));
				readingEntry.setStartPage(rs.getInt("startPage"));
				readingEntry.setEndPage(rs.getInt("endPage"));
				readingEntry.setStartTime(rs.getTimestamp("startTime"));
				readingEntry.setEndTime(rs.getTimestamp("endTime"));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return readingEntry;
	}
}
