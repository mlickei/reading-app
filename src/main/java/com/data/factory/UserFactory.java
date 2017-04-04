package com.data.factory;

import com.data.User;
import com.data.UserType;
import com.data.driver.DatabaseDriver;
import com.security.PasswordHasher;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by Matthew on 3/12/2017.
 */
public class UserFactory {

	public static void insertUser(User user, String password) throws SQLException {
		PreparedStatement statement = null;
		Connection conn = null;

		try {
			PasswordHasher hasher = new PasswordHasher();
			hasher.hashPassword(password);
			user.setSalt(hasher.getSalt());
			user.setHash(hasher.getHash());

			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("INSERT INTO app_user (username, firstName, lastName, email, hash, salt, userType) VALUES (?, ?, ?, ?, ?, ?, ?)");

			statement.setString(1, user.getUsername());
			statement.setString(2, user.getFirstName());
			statement.setString(3, user.getLastName());
			statement.setString(4, user.getEmail());
			statement.setString(5, user.getHash());
			statement.setString(6, user.getSalt());
			statement.setString(7, user.getUserType().toString());

			statement.executeUpdate();
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
			statement = conn.prepareStatement("SELECT * FROM app_user where id = ?");
			statement.setInt(1, id);

			rs = statement.executeQuery();

			while(rs.next()) {
				user = buildUserFromFullResult(rs);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return user;
	}

	public static User getUser(String username) throws SQLException {
		User user = null;
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			statement = conn.prepareStatement("SELECT * FROM app_user where username = ?");
			statement.setString(1, username);

			rs = statement.executeQuery();

			while(rs.next()) {
				user = buildUserFromFullResult(rs);
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return user;
	}

	public static void updateUserPassword(int userId, String newHash, String newSalt) throws SQLException {
		Connection conn = null;
		PreparedStatement pst = null;

		try
		{
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			pst = conn.prepareStatement("UPDATE app_user SET hash = ?, salt = ? WHERE id = ?");
			pst.setString(1, newHash);
			pst.setString(2, newSalt);
			pst.setInt(3, userId);

			pst.executeUpdate();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally
		{
			DatabaseDriver.closeConnection(null, pst, conn);
		}
	}

	public static String[] getHashSaltPair(String userName) throws SQLException {
		Connection conn = null;
		PreparedStatement pst = null;
		ResultSet rs = null;
		String hashSaltPair[] = new String[2];

		try
		{
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			pst = conn.prepareStatement("SELECT hash, salt FROM app_user WHERE username = ?");
			pst.setString(1, userName);

			rs = pst.executeQuery();

			rs.next();

			hashSaltPair[0] = rs.getString("hash");
			hashSaltPair[1] = rs.getString("salt");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally
		{
			DatabaseDriver.closeConnection(rs, pst, conn);
		}

		return hashSaltPair;
	}

	private static User buildUserFromFullResult(ResultSet rs) throws SQLException {
		User user = new User();

		user.setId(rs.getInt("id"));
		user.setUsername(rs.getString("username"));
		user.setFirstName(rs.getString("firstName"));
		user.setLastName(rs.getString("lastName"));
		user.setEmail(rs.getString("email"));
		user.setSalt(rs.getString("salt"));
		user.setHash(rs.getString("hash"));
		user.setUserType(UserType.valueOf(rs.getString("userType")));

		return user;
	}
}
