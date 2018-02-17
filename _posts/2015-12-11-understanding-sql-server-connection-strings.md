---
title: Understanding Sql Server Connection Strings
tags: 
  - Sql Server
  - Database
toc: true
---

These are my notes while using connection strings with VS 2015 and SQL Server products.

What is connection string?
---

A connection string is a string version of the initialization properties needed to connect to a data store and enables you to easily store connection information within your application or to pass it between applications. Without a connection string, you would be required to store or pass a complex array of structures to access data.

Key words in connection string
---

**Data Source**
Normally the Data Source is known as an instance. If the SQL Server resides on the same server as your application, a default instance simply specifies the name of the computer, you can also use `(local)` or `.` . Otherwise, you need to specify the computer name to the instance, like `MYSERVER\MYINSTANCE`.

You can use a fully qualified domain name `myserver.mycompany.com`, or you can specify a TCP/IP address and port number.

**Initial Catalog**
Specifying an Initial Catalog in the connection string automatically switches the context of the current database


Common Connection Strings
---

```yaml
Data Source=.\SQLEXPRESS;AttachDbFilename=C:\Temp\MyDatabase.mdf;Integrated Security=True;User Instance=True
```

This connection string uses a feature called User Instances. A user instance opens up a target database file directly in a new instance of SQL Server Express that is running under the context of the current user. This is useful for users that are not administrators on their machines. Note that the database can not also be attached to a running SQL Server instance for this type of connection to succeed, which means you won’t see this database in a tool like SQL Server Management Studio unless you attach to it.

TODOs
---

1. Connection String Tools: use visual studio to generate connection strings

More
---
1. https://www.connectionstrings.com/sql-server/

