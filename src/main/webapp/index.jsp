<%@ page import="data.factory.BookFactory" %>
<%@ page import="data.Book" %>
<%@ page import="java.util.List" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="java.util.ArrayList" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>Index</title>
  </head>
  <body>
  <div class="books">
    <%
      for(Book book : BookFactory.getBooks()) {
    %>
    <div class="book">
      <div class="title"><%= book.getTitle() %></div>
      <div class="isbn"><%= book.getIsbn() %></div>
      <div class="author-first"><%= book.getAuthorFirst() %></div>
      <div class="author-last"><%= book.getAuthorLast() %></div>
      <div class="pages"><%= book.getPages() %></div>
    </div>
    <%
      }
    %>
  </div>
  </body>
</html>
