package com.servlet;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

/**
 * Created by Matthew on 4/5/2017.
 */
@WebListener
public class AppSessionListener implements HttpSessionListener{

	private final int MAX_INACTIVE_INTERVAL_MIN = 180;

	@Override
	public void sessionCreated(HttpSessionEvent se) {
		se.getSession().setMaxInactiveInterval(MAX_INACTIVE_INTERVAL_MIN * 60);
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		//Do nothing
	}

}
