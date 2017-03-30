package com.servlet.filter;

import com.servlet.SessionAttributes;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Matthew on 3/29/2017.
 */
@WebFilter("/*")
public class UserSessionFilter implements Filter {

	private static Map<String, Boolean> filterMap = new HashMap<>();

	static {
		filterMap.put("/login.html", true);
		filterMap.put("/api/auth", true);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse resp = (HttpServletResponse) response;
		HttpSession session = req.getSession(false);

		String requestPath = req.getRequestURI().substring(req.getContextPath().length());

		if(!filterMap.containsKey(requestPath) && (session == null || session.getAttribute(SessionAttributes.USER) == null)) {
			resp.sendRedirect(req.getContextPath() + "/login.html");
		} else {
			chain.doFilter(req, resp);
		}
	}

	@Override
	public void destroy() {

	}
}
