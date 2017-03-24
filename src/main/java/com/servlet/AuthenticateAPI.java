package com.servlet;

import com.data.User;
import com.data.factory.UserFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.security.BasicAuthenticator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

/**
 * Created by Matthew on 3/14/2017.
 */
public class AuthenticateAPI extends HttpServlet {

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String username = req.getParameter("username");
		String email = req.getParameter("email");
		String firstName = req.getParameter("firstName");
		String lastName = req.getParameter("lastName");

		if (BasicAuthenticator.doesUserExist(username)) {
			resp.getWriter().print("Failed: Username taken!");
			return;
		}

		User user = new User(username, email, firstName, lastName);
		try {
			UserFactory.insertUser(user, req.getParameter("password"));
			User newUser = UserFactory.getUser(username);
			req.getSession().setAttribute(SessionAttributes.USER, newUser);
			resp.getWriter().print("Success");
		} catch (SQLException e) {
			e.printStackTrace();
			resp.getWriter().print(e.toString());
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String password = req.getParameter("password");
		String username = req.getParameter("username");
		String logoutParam = req.getParameter("logout");
		String redirectParam = req.getParameter("ret");

		boolean doLogout = Integer.parseInt((logoutParam != null) ? logoutParam : "0") == 1;

		PrintWriter pw = resp.getWriter();
		GsonBuilder gsonBuilder = new GsonBuilder().excludeFieldsWithoutExposeAnnotation();
		Gson gson = gsonBuilder.create();

		if(doLogout) {
			req.getSession().removeAttribute(SessionAttributes.USER);
			pw.print("User logged out.");
		} else if (password != null && password.length() >= 0) {
			User user = null;

			try {
				user = UserFactory.getUser(username);
			} catch (SQLException e) {
				e.printStackTrace();
			}

			if (user != null && BasicAuthenticator.authenticateUser(username, password)) {
				req.getSession().setAttribute(SessionAttributes.USER, user);
				JsonObject returnData = new JsonObject();
				returnData.add("user", gson.toJsonTree(user));
				returnData.addProperty("redirectURL", redirectParam);
				pw.print(returnData.toString());
			} else {
				resp.sendError(401, "Failed to log in.");
			}
		} else {
			User curUser = (User) req.getSession().getAttribute(SessionAttributes.USER);
			if (curUser != null) {
				JsonObject returnData = new JsonObject();
				returnData.add("user", gson.toJsonTree(curUser));
				pw.print(returnData);
			} else {
				resp.sendError(401, "No user signed in.");
			}
		}
	}
}
