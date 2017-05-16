package com.servlet.endpoints;

import com.data.Role;
import com.data.User;
import com.data.UserType;
import com.data.query.BookQueryBuilder;
import com.data.query.constraints.Constraint;
import com.data.query.constraints.ExistsConstraint;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.data.Book;
import com.data.factory.BookFactory;
import com.servlet.SessionAttributes;
import com.util.StringUtil;

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
		String bookInList = req.getParameter("readingList[inList]");
		String readingListId = req.getParameter("readingList[id]");

		BookQueryBuilder bookQueryBuilder = new BookQueryBuilder();
		Gson gsonParser = new GsonBuilder().create();

		if (!StringUtil.isEmpty(isbn)) {
			bookQueryBuilder.addConstraint(new Constraint("book.isbn", "=", isbn));
		}

		if (!StringUtil.isEmpty(title)) {
			bookQueryBuilder.addConstraint(new Constraint("book.title", "like", '%'+title+'%'));
		}

		if (!StringUtil.isEmpty(authorFirst)) {
			bookQueryBuilder.addConstraint(new Constraint("book.authorFirst", "like", '%'+authorFirst+'%'));
		}

		if (!StringUtil.isEmpty(authorLast)) {
			bookQueryBuilder.addConstraint(new Constraint("book.authorLast", "like", '%'+authorLast+'%'));
		}

		if (!StringUtil.isEmpty(createdOn)) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

			try {
				bookQueryBuilder.addConstraint(new Constraint("book.createdOn", "<=", sdf.parse(createdOn)));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}

		if(!StringUtil.isEmpty(readingListId) && !StringUtil.isEmpty(bookInList)) {
			bookQueryBuilder.setSelectStr("SELECT distinct book.* FROM book");
			bookQueryBuilder.addConstraint(new ExistsConstraint("select NULL from reading_list_book as rlb inner join reading_list as rl on rl.id = rlb.readingListId where rl.id = ? AND rlb.isbn = book.isbn", readingListId, Boolean.parseBoolean(bookInList)));

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
