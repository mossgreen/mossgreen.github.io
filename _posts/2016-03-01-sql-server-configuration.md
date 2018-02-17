---
title: SQL Server Configuration
tags: 
  - Sql Server
  - Database
toc: true
---

These are my notes while using SQL Server 2016.

### 1. What is a SQL Server instance?

An SQL Server instance has its own copy of the server files, databases and security credentials.

An SQL Server instance is a complete SQL server and you can install many instances on a machine but you can have only one default instance. In SQL Server, the default name is **MSSQLSERVER**. Normally you can connect to this instance using:

* computer name
* `.` (dot)
* `(local)`

However, with SQL Server Express, the default name is `SQLExpress`. You should use `computer name\SQLExpress` to connect to this instance.

Find more info: [MSDN - Database Engine Instances (SQL Server)](https://msdn.microsoft.com/en-us/library/hh231298.aspx?f=255&MSPPError=-2147217396)

### 2. Differences among SQL Server Express and localDB

LocalDB is an improved SQL Express. LocalDB installation copies a minimal set of files necessary to start the SQL Server Database Engine. Once LocalDB is installed, you can initiate a connection using a special connection string. When connecting, the necessary SQL Server infrastructure is automatically created and started, enabling the application to use the database without complex configuration tasks.

The easiest way to use LocalDB is to connect to the automatic instance owned by the current user by using the connection string:

```yaml
Server=(localdb)\MSSQLLocalDB;Integrated Security=true
```

To connect to a specific database by using the file name, connect using a connection string similar to: 

```yaml
Server=(LocalDB)\MSSQLLocalDB; Integrated Security=true; AttachDbFileName=D:\Data\MyDB1.mdf
```

Find more info at: [MSDN - SQL Server 2016 Express LocalDB](https://msdn.microsoft.com/en-us/library/hh510202.aspx) 