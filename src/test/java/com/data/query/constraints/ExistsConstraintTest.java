package com.data.query.constraints;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Matthew on 5/3/2017.
 */
public class ExistsConstraintTest {

	@Test
	public void getConstraintQueryStringExists() throws Exception {
		ExistsConstraint existsConstraint = new ExistsConstraint("select null from table where prop = ?", null, true);
		assertEquals("EXISTS( select null from table where prop = ? )", existsConstraint.getConstraintQueryString());
	}

	@Test
	public void getConstraintQueryStringNotExists() throws Exception {
		ExistsConstraint existsConstraint = new ExistsConstraint("select null from table where prop = ?", null, false);
		assertEquals("NOT EXISTS( select null from table where prop = ? )", existsConstraint.getConstraintQueryString());
	}

}