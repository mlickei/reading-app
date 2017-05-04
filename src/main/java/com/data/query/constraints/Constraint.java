package com.data.query.constraints;

/**
 * Created by Matthew on 5/3/2017.
 */
public class Constraint implements IConstraint {

	private String constraint;
	private String op;
	private Object value;

	public Constraint(String constraint, String op, Object value) {
		this.constraint = constraint;
		this.op = op;
		this.value = value;
	}

	@Override
	public String getConstraintQueryString() {
		return constraint + " " + op + " ?";
	}

	@Override
	public Object getConstraintValue() {
		return value;
	}
}
