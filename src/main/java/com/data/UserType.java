package com.data;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Matthew on 4/3/2017.
 */
public enum UserType {

	ADMIN("Admin", Arrays.asList(Role.values())),
	BASIC_USER("Basic User", Arrays.asList(Role.ENTRIES_ADD, Role.ENTRIES_DELETE, Role.ENTRIES_UPDATE, Role.READING_LIST_ADD, Role.READING_LIST_UPDATE, Role.READING_LIST_DELETE)),
	LIBRARIAN("Librarian", Arrays.asList(Role.ENTRIES_ADD, Role.ENTRIES_DELETE, Role.ENTRIES_UPDATE, Role.BOOK_UPDATE, Role.BOOK_ADD, Role.READING_LIST_ADD, Role.READING_LIST_UPDATE, Role.READING_LIST_DELETE)),
	CURATOR("Curator", Arrays.asList(Role.ENTRIES_ADD, Role.ENTRIES_DELETE, Role.ENTRIES_UPDATE, Role.BOOK_UPDATE, Role.BOOK_ADD, Role.BOOK_DELETE, Role.READING_LIST_ADD, Role.READING_LIST_UPDATE, Role.READING_LIST_DELETE));

	List<Role> roles = new ArrayList<>();
	@Expose
	String displayName;

	UserType(String displayName, List<Role> roles) {
		this.displayName = displayName;
		this.roles.addAll(roles);
	}

	public List<Role> getRoles() {
		return roles;
	}

	public String getDisplayName() {
		return displayName;
	}
}
