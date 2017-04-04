package com.data;

import com.google.gson.annotations.Expose;

/**
 * Created by Matthew on 3/12/2017.
 */
public class User {

	//FIXME remove the necessity of this being exposed
	@Expose
	private int id;
	@Expose
	private String username;
	@Expose
	private String email;
	@Expose
	private String firstName;
	@Expose
	private String lastName;
	private String hash;
	private String salt;
	@Expose
	private UserType userType;

	public User() {

	}

	public User(String username, String email, String firstName, String lastName, UserType userType) {
		this.username = username;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.userType = userType;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}
}
