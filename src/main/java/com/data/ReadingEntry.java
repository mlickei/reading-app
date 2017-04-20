package com.data;

import com.google.gson.annotations.Expose;

import java.sql.Timestamp;

/**
 * Created by Matthew on 3/12/2017.
 */
public class ReadingEntry {

	@Expose
	private int id;
	@Expose
	private Book book;
	@Expose
	private User user;
	@Expose
	private int startPage;
	@Expose
	private int endPage;
	@Expose
	private Timestamp startTime;
	@Expose
	private Timestamp endTime;
	@Expose
	private String notes;

	public ReadingEntry() {
	}

	public ReadingEntry(Book book, User user, int startPage, Timestamp startTime) {
		this.book = book;
		this.user = user;
		this.startPage = startPage;
		this.startTime = startTime;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public int getStartPage() {
		return startPage;
	}

	public void setStartPage(int startPage) {
		this.startPage = startPage;
	}

	public int getEndPage() {
		return endPage;
	}

	public void setEndPage(int endPage) {
		this.endPage = endPage;
	}

	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
}
