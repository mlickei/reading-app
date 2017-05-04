package com.util;

/**
 * Created by Matthew on 5/3/2017.
 */
public class StringUtil {

	public static boolean isNull(String str) {
		return str == null;
	}

	public static boolean isEmpty(String str) {
		return !(!isNull(str) && str.length() > 0);
	}

}
