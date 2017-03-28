package com.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.data.Book;
import com.data.factory.BookFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 3/12/2017.
 */
@WebServlet("/api/book")
public class BookAPI extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String isbn = req.getParameter("isbn");
		String delete = req.getParameter("delete");

		PrintWriter pw = resp.getWriter();
		if (delete != null && delete.length() > 0 && Integer.parseInt(delete) == 1) {
			try {
				BookFactory.deleteBook(isbn);
				pw.print("Success");
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		} else {
			String title = req.getParameter("title");
			int pages = Integer.parseInt(req.getParameter("pages"));
			String authorFirst = req.getParameter("authorFirst");
			String authorLast = req.getParameter("authorLast");

			Book book = new Book(isbn, title, pages, authorFirst, authorLast);
			try {
				BookFactory.insertBook(book);
				pw.print("Success");
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String isbn = req.getParameter("isbn");
		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();

		PrintWriter pw = resp.getWriter();
		List<Book> books = new ArrayList<>();
		try {
			if (isbn == null || isbn.length() <= 0) {
				books.addAll(BookFactory.getBooks());
				pw.append(gson.toJson(books));
			} else {
				Book book = BookFactory.getBook(isbn);
				pw.append(gson.toJson(book));
			}
		} catch (SQLException e) {
			e.printStackTrace();
			pw.print(e.toString());
		}
	}
}
