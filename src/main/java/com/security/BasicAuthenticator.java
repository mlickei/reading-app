package com.security;

import com.data.User;
import com.data.factory.UserFactory;

import java.sql.SQLException;

/**
 * This class is used to authenticate a user given a userName and password provided by the user for login purposes
 */
public class BasicAuthenticator
{

	public static boolean doesUserExist(String username)
	{
		User user = null;

		try {
			user = UserFactory.getUser(username);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return user != null;
	}

	/**
	 * This method is used to check a username-password pair against database values.
	 * @param username The username provided by the user.
	 * @param password The password provided by the user.
	 * @return Returns true if the password hash matches the value in the database. Returns false otherwise.
	 */
	public static boolean authenticateUser(String username, String password)
	{
		String hashSaltPair[] = new String[0];

		try {
			hashSaltPair = UserFactory.getHashSaltPair(username);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		String userHash = hashSaltPair[0];
		String userSalt = hashSaltPair[1];

		PasswordHasher pw = new PasswordHasher();

		pw.hashPassword(password, userSalt);

		String inHash = pw.getHash();

		return userHash.equals(inHash);
	}

	public static boolean updateUserPassword(User user, String newPassword) {
		boolean success = false;

		PasswordHasher hasher = new PasswordHasher();
		hasher.hashPassword(newPassword);

		if(!BasicAuthenticator.authenticateUser(user.getUsername(), newPassword)) {
			user.setSalt(hasher.getSalt());
			user.setHash(hasher.getHash());
			try {
				UserFactory.updateUserPassword(user.getId(), user.getHash(), user.getSalt());
				success = true;
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		return success;
	}
}