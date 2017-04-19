package com.servlet.endpoints;

import com.data.Role;
import com.data.User;
import com.data.UserType;
import com.data.query.BookQueryBuilder;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Matthew on 3/12/2017.
 */
@WebServlet("/api/book")
public class BookAPI extends HttpServlet {

	//TODO instead of using request params, use the CRUD methods to implement updates, deletes, etc.



	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String isbn = req.getParameter("isbn");
		String delete = req.getParameter("delete");
		String update = req.getParameter("update");

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
		} else if(update != null && update.length() > 0 && Integer.parseInt(update) == 1) {
			if (userRoles.contains(Role.BOOK_UPDATE)) {
				try {
					String title = req.getParameter("title");
					int pages = Integer.parseInt(req.getParameter("pages"));
					String authorFirst = req.getParameter("authorFirst");
					String authorLast = req.getParameter("authorLast");
					String prevIsbn = req.getParameter("previousIsbn");

					Book book = new Book(isbn, title, pages, authorFirst, authorLast, new Timestamp(new Date().getTime()), user);
					//FIXME change to prevIsbn when implemented
					BookFactory.updateBook(book, isbn);

					GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
					Gson gson = gsonBuilder.create();
					pw.append(gson.toJson(book));
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
		String title = req.getParameter("title");
		String authorFirst = req.getParameter("authorFirst");
		String authorLast = req.getParameter("authorLast");
		String createdOn = req.getParameter("createdOn");

		BookQueryBuilder bookQueryBuilder = new BookQueryBuilder();

		if (isbn != null && isbn.length() > 0) {
			bookQueryBuilder.addConstraint("isbn", "=", isbn);
		}

		if (title != null && title.length() > 0) {
			bookQueryBuilder.addConstraint("title", "like", '%'+title+'%');
		}

		if (authorFirst != null && authorFirst.length() > 0) {
			bookQueryBuilder.addConstraint("authorFirst", "like", '%'+authorFirst+'%');
		}

		if (authorLast != null && authorLast.length() > 0) {
			bookQueryBuilder.addConstraint("authorLast", "like", '%'+authorLast+'%');
		}

		if (createdOn != null && createdOn.length() > 0) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

			try {
				bookQueryBuilder.addConstraint("createdOn", "<=", sdf.parse(createdOn));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();

		PrintWriter pw = resp.getWriter();
		List<Book> books = new ArrayList<>();
		try {
			books.addAll(bookQueryBuilder.getResults());
			pw.append(gson.toJson(books));
		} catch (SQLException e) {
			e.printStackTrace();
			pw.print(e.toString());
		}
	}
}
