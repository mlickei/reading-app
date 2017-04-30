package com.data;

import com.google.gson.annotations.Expose;

/**
 * Created by Matthew on 4/3/2017.
 */
public enum Role {

	BOOK_DELETE("Delete Books"),
	BOOK_ADD("Add Books"),
	BOOK_UPDATE("Update Books"),
	ENTRIES_DELETE("Delete Entries"),
	ENTRIES_ADD("Add Entries"),
	ENTRIES_UPDATE("Update Entries"),
	MANAGE_USERS("Manage Users"),
	READING_LIST_ADD("Add Reading Lists"),
	READING_LIST_UPDATE("Update Reading Lists"),
	READING_LIST_DELETE("Delete Reading Lists");

	@Expose
	private String displayName = "";
	@Expose
	private String programmaticName = this.toString();

	Role(String displayName) {
		this.displayName = displayName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getProgrammaticName() {
		return programmaticName;
	}

	@Override
	public String toString() {
		return super.toString();
	}
}
