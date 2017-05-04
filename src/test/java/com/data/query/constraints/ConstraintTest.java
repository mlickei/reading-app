package com.data.query.constraints;

import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Matthew on 5/3/2017.
 */
public class ConstraintTest {

	@Test
	public void getConstraintQueryString() throws Exception {
		Constraint constraint = new Constraint("prop", "=", "test");
		assertEquals("prop = ?", constraint.getConstraintQueryString());
	}

}