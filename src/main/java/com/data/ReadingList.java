package com.data;

import com.google.gson.annotations.Expose;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 4/29/2017.
 */
public class ReadingList {

	@Expose
	private int id;
	@Expose
	private String name;
	@Expose
	private User user;
	@Expose
	private List<Book> books = new ArrayList<>();

	public ReadingList() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Book> addBook(Book book) {
		this.books.add(book);
		return this.books;
	}

	public List<Book> removeBook(Book book) {
		this.books.remove(book);
		return this.books;
	}

	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
