package com.servlet.endpoints;

import com.data.ReadingEntry;
import com.data.User;
import com.data.factory.BookFactory;
import com.data.factory.ReadingEntryFactory;
import com.data.factory.UserFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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
import java.util.List;

/**
 * Created by Matthew on 3/14/2017.
 */
@WebServlet("/api/reading-entry")
public class ReadingEntryAPI extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String delete = req.getParameter("delete");
		String update = req.getParameter("update");

		PrintWriter pw = resp.getWriter();
		//TODO add permissions checking, everyone can do it right now.. so mehhhh
		if (delete != null && delete.length() > 0 && Integer.parseInt(delete) == 1) {
			int entryId = Integer.parseInt(req.getParameter("id"));

			try {
				ReadingEntryFactory.deleteReadingEntry(entryId);
				pw.print("Success");
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		} else if(update != null && update.length() > 0 && Integer.parseInt(update) == 1) {
			String isbn = req.getParameter("book[isbn]");
			int userId = Integer.parseInt(req.getParameter("user[id]"));
			int startPg = Integer.parseInt(req.getParameter("startPage"));
			String endPg = req.getParameter("endPage");
			String startTimeStr = req.getParameter("startTime");
			String endTimeStr = req.getParameter("endTime");
			String notes = req.getParameter("notes");
			int entryId = Integer.parseInt(req.getParameter("id"));

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Timestamp startTime = null;
			Timestamp endTime = null;

			try {
				startTime = new Timestamp(sdf.parse(startTimeStr).getTime());

				if(endTimeStr != null && endTimeStr.length() > 0) {
					endTime = new Timestamp(sdf.parse(endTimeStr).getTime());
				}
			} catch (ParseException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}

			try {
				ReadingEntry entry = new ReadingEntry(BookFactory.getBook(isbn), UserFactory.getUser(userId), startPg, startTime);

				if(endPg != null && endPg.length() > 0) {
					entry.setEndPage(Integer.parseInt(endPg));
				} else {
					entry.setEndPage(-1);
				}

				entry.setNotes(notes);
				entry.setEndTime(endTime);

				ReadingEntryFactory.updateReadingEntry(entry, entryId);

				GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
				Gson gson = gsonBuilder.create();
				pw.append(gson.toJson(entry));
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		} else {
			String isbn = req.getParameter("book[isbn]");
			int userId = Integer.parseInt(req.getParameter("user[id]"));
			int startPg = Integer.parseInt(req.getParameter("startPage"));
			String endPg = req.getParameter("endPage");
			String startTimeStr = req.getParameter("startTime");
			String endTimeStr = req.getParameter("endTime");
			String notes = req.getParameter("notes");

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Timestamp startTime = null;
			Timestamp endTime = null;

			try {
				startTime = new Timestamp(sdf.parse(startTimeStr).getTime());

				if(endTimeStr != null && endTimeStr.length() > 0) {
					endTime = new Timestamp(sdf.parse(endTimeStr).getTime());
				}
			} catch (ParseException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}

			try {
				ReadingEntry entry = new ReadingEntry(BookFactory.getBook(isbn), UserFactory.getUser(userId), startPg, startTime);

				if(endPg != null && endPg.length() > 0) {
					entry.setEndPage(Integer.parseInt(endPg));
				} else {
					entry.setEndPage(-1);
				}

				entry.setNotes(notes);
				entry.setEndTime(endTime);

				ReadingEntryFactory.insertReadingEntry(entry);
				pw.print("Success");
			} catch (SQLException e) {
				e.printStackTrace();
				pw.print(e.toString());
			}
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		List<ReadingEntry> readingEntries = new ArrayList<>();
		User user = (User) req.getSession(false).getAttribute(SessionAttributes.USER);

		try {
			readingEntries.addAll(ReadingEntryFactory.getReadingEntries(user));
		} catch (SQLException e) {
			e.printStackTrace();
		}

		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();
		PrintWriter pw = resp.getWriter();
		pw.append(gson.toJson(readingEntries));
	}
}
