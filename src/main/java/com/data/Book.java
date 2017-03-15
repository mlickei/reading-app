package com.data;

import com.google.gson.annotations.Expose;

/**
 * Created by Matthew on 3/12/2017.
 */
public class Book {

	@Expose
	private String isbn;
	@Expose
	private String title;
	@Expose
	private int pages;
	@Expose
	private String authorFirst;
	@Expose
	private String authorLast;

	public Book() {
	}

	public Book(String isbn, String title, int pages, String authorFirst, String authorLast) {
		this.isbn = isbn;
		this.title = title;
		this.pages = pages;
		this.authorFirst = authorFirst;
		this.authorLast = authorLast;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public String getAuthorFirst() {
		return authorFirst;
	}

	public void setAuthorFirst(String authorFirst) {
		this.authorFirst = authorFirst;
	}

	public String getAuthorLast() {
		return authorLast;
	}

	public void setAuthorLast(String authorLast) {
		this.authorLast = authorLast;
	}
}
