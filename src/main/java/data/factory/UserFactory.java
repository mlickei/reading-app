package data.factory;

import data.User;
import data.driver.DatabaseDriver;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Matthew on 3/12/2017.
 */
public class UserFactory {

	public static void insertUser(User user) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO user (username, firstName, lastName, email) VALUES (?, ?, ?, ?, ?, ?)");

			statement.setString(1, user.getUsername());
			statement.setString(2, user.getFirstName());
			statement.setString(3, user.getLastName());
			statement.setString(4, user.getEmail());

			statement.executeQuery();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(null, statement, conn);
		}
	}

	public static User getUser(int id) throws SQLException {
		User user = null;
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
				user = new User();

				user.setId(rs.getInt("id"));
				user.setUsername(rs.getString("username"));
				user.setFirstName(rs.getString("firstName"));
				user.setLastName(rs.getString("lastName"));
				user.setEmail(rs.getString("email"));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return user;
	}
}
