package com.servlet.endpoints;

import com.data.Book;
import com.data.ReadingList;
import com.data.User;
import com.data.factory.BookFactory;
import com.data.factory.ReadingListFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.servlet.SessionAttributes;
import util.StringUtil;

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
 * Created by Matthew on 4/29/2017.
 */
@WebServlet("/api/reading-list")
public class ReadingListAPI extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		PrintWriter pw = resp.getWriter();
		String delete = req.getParameter("delete");
		String update = req.getParameter("update");
		String addBook = req.getParameter("addBook");
		User user = (User) req.getSession(false).getAttribute(SessionAttributes.USER);
		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();

		if(!StringUtil.isNull(delete) && Integer.parseInt(delete) == 1) {
			int listId = Integer.parseInt(req.getParameter("id"));

//			try {
//				ReadingListFactory.deleteReadingList(listId);
//				pw.print("Success");
//			} catch (SQLException e) {
//				e.printStackTrace();
//				pw.print(e.toString());
//			}
		} else if(!StringUtil.isNull(update) && Integer.parseInt(update) == 1) {
			String name = req.getParameter("name");
//
//			ReadingList readingList = new ReadingList();
//			readingList.setName(name);
//
//			try {
//				ReadingListFactory.insertReadingList(readingList);
//				GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
//				Gson gson = gsonBuilder.create();
//				pw.append(gson.toJson(readingList));
//			} catch (SQLException e) {
//				e.printStackTrace();
//				pw.print(e.toString());
//			}
		} else if(!StringUtil.isNull(addBook) && Integer.parseInt(addBook) == 1) {
			int listId = Integer.parseInt(req.getParameter("id"));
			String bookIsbn = req.getParameter("isbn");

			try {
				ReadingListFactory.insertReadingListBook(listId, bookIsbn);
				Book book = BookFactory.getBook(bookIsbn);
				ReadingList rl = ReadingListFactory.getReadingList(listId);

				JsonObject json = new JsonObject();
				json.add("book", gson.toJsonTree(book));
				json.add("readingList", gson.toJsonTree(rl));

				pw.print(json.toString());
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		}else {
			String name = req.getParameter("name");

			ReadingList readingList = new ReadingList();
			readingList.setName(name);
			readingList.setUser(user);

			try {
				ReadingListFactory.insertReadingList(readingList);
				pw.append(gson.toJson(readingList));
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		List<ReadingList> readingLists = new ArrayList<>();
		User user = (User) req.getSession(false).getAttribute(SessionAttributes.USER);

		try {
			readingLists.addAll(ReadingListFactory.getReadingLists(user));
		} catch (SQLException e) {
			e.printStackTrace();
		}

		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();
		PrintWriter pw = resp.getWriter();
		pw.append(gson.toJson(readingLists));
	}
}
