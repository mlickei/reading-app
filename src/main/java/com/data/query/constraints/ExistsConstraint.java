package com.data.query.constraints;

/**
 * Created by Matthew on 5/3/2017.
 */
public class ExistsConstraint implements IConstraint {

	private String condition;
	private Object value;
	private boolean doesExist;

	public ExistsConstraint(String condition, Object value, boolean doesExist) {
		this.condition = condition;
		this.value = value;
		this.doesExist = doesExist;
	}

	@Override
	public String getConstraintQueryString() {
		StringBuilder sb = new StringBuilder();

		if(!doesExist) {
			sb.append("NOT ");
		}

		sb.append("EXISTS( ");
		sb.append(condition);
		sb.append(" )");
		return sb.toString();
	}

	@Override
	public Object getConstraintValue() {
		return this.value;
	}
}
