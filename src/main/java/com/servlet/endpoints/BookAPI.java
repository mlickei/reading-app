package com.servlet.endpoints;

import com.data.Role;
import com.data.User;
import com.data.UserType;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.data.Book;
import com.data.factory.BookFactory;
import com.servlet.SessionAttributes;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
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
		User user = (User) req.getSession().getAttribute(SessionAttributes.USER);
		UserType userType = user.getUserType();
		List<Role> userRoles = userType.getRoles();

		PrintWriter pw = resp.getWriter();
		if (delete != null && delete.length() > 0 && Integer.parseInt(delete) == 1) {
			if(userRoles.contains(Role.BOOK_DELETE)) {
				try {
					BookFactory.deleteBook(isbn);
					pw.print("Success");
				} catch (SQLException e) {
					e.printStackTrace();
					pw.print(e.toString());
				}
			} else {
				resp.sendError(401, "You don't have permission to do that!");
			}
		} else {
			if(userRoles.contains(Role.BOOK_ADD)) {
				String title = req.getParameter("title");
				int pages = Integer.parseInt(req.getParameter("pages"));
				String authorFirst = req.getParameter("authorFirst");
				String authorLast = req.getParameter("authorLast");

				Book book = new Book(isbn, title, pages, authorFirst, authorLast, new Timestamp(new Date().getTime()), user);
				try {
					BookFactory.insertBook(book);
					pw.print("Success");
				} catch (SQLException e) {
					e.printStackTrace();
					pw.print(e.toString());
				}
			} else {
				resp.sendError(401, "You don't have permission do do that!");
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
