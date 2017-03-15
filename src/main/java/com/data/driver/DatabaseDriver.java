package com.data.driver;

import java.sql.Statement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Matthew on 3/12/2017.
 */
public class DatabaseDriver {

	private static final String username = "book-app";
	private static final String password = "yzc123JFD";

	public static Connection getConnection() throws ClassNotFoundException {
		Class.forName("com.mysql.jdbc.Driver");

		try {
			return DriverManager.getConnection("jdbc:mysql://localhost:3306/reading_app?autoReconnect=true&useSSL=false", username, password);
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}

	public static void closeConnection(ResultSet rs, Statement statement, Connection connection) throws SQLException {
		if (connection != null) {
			connection.close();
		}

		if (rs != null) {
			rs.close();
		}

		if (statement != null) {
			statement.close();
		}
	}

}
