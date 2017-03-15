package com.servlet;

import com.data.User;
import com.data.factory.UserFactory;
import com.security.BasicAuthenticator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Created by Matthew on 3/14/2017.
 */
public class AuthenticateAPI extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String username = req.getParameter("username");
		String email = req.getParameter("email");
		String firstName = req.getParameter("first-name");
		String lastName = req.getParameter("last-name");

		if (BasicAuthenticator.doesUserExist(username)) {
			resp.getWriter().print("Failed: Username taken!");
			return;
		}

		User user = new User(username, email, firstName, lastName);
		try {
			UserFactory.insertUser(user, req.getParameter("password"));
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

		if (BasicAuthenticator.authenticateUser(username, password)) {
			try {
				User user = UserFactory.getUser(username);
				resp.getWriter().print("Successfully logged in: " + user.getFirstName() + " " + user.getLastName());
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} else {
			resp.getWriter().print("Failed to log in.");
		}
	}
}
