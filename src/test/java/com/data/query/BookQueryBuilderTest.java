package com.data.query;

import com.data.query.constraints.Constraint;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Matthew on 4/6/2017.
 */
public class BookQueryBuilderTest {

	@Test
	public void addJoin() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();
		String join = "inner join test on test.id = book.test";
		bqb.addJoin(join);

		assertEquals(BookQueryBuilder.BASE_SELECT + join  + " " + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}

	@Test
	public void addJoinIdx() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();

		String join = "inner join test on test.id = book.test";
		bqb.addJoin(join);

		String join2 = "inner join test2 on test2.id = book.test";
		bqb.addJoin(join2, 0);

		assertEquals(BookQueryBuilder.BASE_SELECT + join2 + " " + join + " " + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}

	@Test
	public void getQueryStr() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();
		assertEquals(BookQueryBuilder.BASE_SELECT + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}

	@Test
	public void addConstraint() throws Exception {
		BookQueryBuilder bqb = new BookQueryBuilder();
		bqb.addConstraint(new Constraint("prop", "=", "test"));
		assertEquals(BookQueryBuilder.BASE_SELECT + " where prop = ? " + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}

	@Test
	public void joinConstraint() {
		BookQueryBuilder bqb = new BookQueryBuilder();

		String join = "inner join test on test.id = book.test";
		bqb.addJoin(join);

		bqb.addConstraint(new Constraint("prop", "=", "test"));
		assertEquals(BookQueryBuilder.BASE_SELECT + join + "  where prop = ? " + BookQueryBuilder.BASE_ORDER_BY, bqb.getQueryStr());
	}
}