package com.servlet.endpoints;

import com.data.User;
import com.data.factory.UserFactory;
import com.servlet.SessionAttributes;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

/**
 * Created by Matthew on 4/4/2017.
 */
@WebServlet("/api/profile")
public class ProfileAPI extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String username = req.getParameter("username");
		String email = req.getParameter("email");
		String firstName = req.getParameter("firstName");
		String lastName = req.getParameter("lastName");
		HttpSession session = req.getSession();
		User sessionUser = (User) session.getAttribute(SessionAttributes.USER);

		if(sessionUser != null && sessionUser.getUsername().equals(username)) {
			boolean hasUpdates = false;

			if(email != null && email.length() > 0) {
				sessionUser.setEmail(email);
				hasUpdates = true;
			}

			if (firstName != null && firstName.length() > 0) {
				sessionUser.setFirstName(firstName);
				hasUpdates = true;
			}

			if (lastName != null && lastName.length() > 0) {
				sessionUser.setLastName(lastName);
				hasUpdates = true;
			}

			if(hasUpdates) {
				try {
					UserFactory.updateUser(sessionUser);
					session.setAttribute(SessionAttributes.USER, sessionUser);
					resp.getWriter().print("Success");
				} catch (SQLException e) {
					e.printStackTrace();
					resp.getWriter().print(e.toString());
				}
			} else {
				resp.getWriter().print("No updates to profile!");
			}
		} else {
			resp.sendError(401, "Unable to verify session user with updating user.");
		}
	}
}
