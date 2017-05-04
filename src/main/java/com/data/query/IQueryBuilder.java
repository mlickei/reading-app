package com.data.query;

import com.data.Book;
import com.data.query.constraints.IConstraint;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

/**
 * Created by Matthew on 5/3/2017.
 */
public interface IQueryBuilder<T> {

	public String getQueryStr();

	public List<Book> getResults() throws SQLException;

	public void addConstraint(IConstraint constraint);

	public void addJoin(String joinStr);

	public void addJoin(String joinStr, int idx);

	public boolean isDebugEnabled();

	public void enableDebug(boolean enable);

	String getSelect();

	String getOrderBy();

	T buildObjectFromResult(ResultSet rs) throws SQLException;
}
