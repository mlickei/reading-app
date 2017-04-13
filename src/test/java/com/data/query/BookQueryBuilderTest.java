package com.data.query;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Matthew on 4/6/2017.
 */
public class BookQueryBuilderTest {

	@Test
	public void getQueryStr() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();
		assertEquals(BookQueryBuilder.BASE_SELECT + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}

	@Test
	public void addConstraint() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();
		bqb.addConstraint("prop", "=", "test");
		assertEquals(BookQueryBuilder.BASE_SELECT + "where prop = ?" + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}


}