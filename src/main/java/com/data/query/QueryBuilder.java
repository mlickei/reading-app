package com.data.query;

import com.data.Book;
import com.data.driver.DatabaseDriver;
import com.data.query.constraints.IConstraint;
import util.StringUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Matthew on 5/3/2017.
 */
public abstract class QueryBuilder<T> implements IQueryBuilder {

	protected final String BASE_SELECT;
	protected final String BASE_ORDER_BY;
	private String selectStr = null;
	private String orderByStr = null;
	private ArrayList<IConstraint> constraints = new ArrayList<>();
	private ArrayList<String> joins = new ArrayList<>();
	private boolean debugEnabled = false;

	public QueryBuilder(String baseSelect, String baseOrderBy) {
		this.BASE_SELECT = baseSelect;
		this.BASE_ORDER_BY = baseOrderBy;
	}

	@Override
	public String getQueryStr() {
		StringBuilder sb = new StringBuilder();
		sb.append(getSelect());

		if(joins.size() > 0) {
			for(String join : joins) {
				sb.append(join);
				sb.append(" ");
			}
		}

		if(constraints.size() > 0) {
			sb.append(" where ");
			for (IConstraint constraint : constraints) {
				sb.append(constraint.getConstraintQueryString());
				sb.append(" ");
			}
		}

		sb.append(getOrderBy());
		return sb.toString();
	}

	@Override
	public void addConstraint(IConstraint constraint) {
		constraints.add(constraint);
	}

	@Override
	public void addJoin(String joinStr) {
		joins.add(joinStr);
	}

	@Override
	public void addJoin(String joinStr, int idx) {
		joins.add(idx, joinStr);
	}

	@Override
	public boolean isDebugEnabled() {
		return debugEnabled;
	}

	@Override
	public void enableDebug(boolean enable) {
		this.debugEnabled = enable;
	}

	@Override
	public String getSelect() {
		return (StringUtil.isEmpty(selectStr)) ? BASE_SELECT : selectStr;
	}

	@Override
	public String getOrderBy() {
		return (StringUtil.isEmpty(orderByStr)) ? BASE_ORDER_BY : orderByStr;
	}

	@Override
	public List<Book> getResults() throws SQLException {
		List<Book> books = new ArrayList<Book>();
		PreparedStatement statement = null;
		ResultSet rs = null;
		Connection conn = null;

		try {
			conn = DatabaseDriver.getConnection();

			assert conn != null;
			String query = getQueryStr();

			if(isDebugEnabled()) {
				System.out.println(query);
			}

			statement = conn.prepareStatement(query);

			int constIdx = 1;
			for(IConstraint constraint : constraints) {
				statement.setObject(constIdx, constraint.getConstraintValue());
			}

			rs = statement.executeQuery();

			while(rs.next()) {
				books.add((Book) buildObjectFromResult(rs));
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} finally {
			DatabaseDriver.closeConnection(rs, statement, conn);
		}

		return books;
	}

	public String getSelectStr() {
		return selectStr;
	}

	public void setSelectStr(String selectStr) {
		this.selectStr = selectStr;
	}

	public String getOrderByStr() {
		return orderByStr;
	}

	public void setOrderByStr(String orderByStr) {
		this.orderByStr = orderByStr;
	}
}
