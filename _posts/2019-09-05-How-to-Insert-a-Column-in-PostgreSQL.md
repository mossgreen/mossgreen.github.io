---
title: How to Insert a Column in PostgreSQL
search: true
tags: 
  - database
  - PostgreSQL
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Insert (not add) a column in PostgreSQL is quit a mission.

## Add a column in table

Add a column in a table in PostgreSQL is:

```sql
ALTER TABLE table_name
  ADD new_column_name column_definition;
```
For example:
```sql
CREATE TABLE customers (
   id SERIAL PRIMARY KEY,
   customer_name VARCHAR NOT NULL
);
```

```sql
ALTER TABLE customers 
ADD COLUMN phone VARCHAR;
```

It's simple. I won't go further. The question is what if I want to insert the column between `id` and `customer_name`?

I've checked StackOverflow and psql documentation. So sure that there is no way to insert a column to a table. 

## Insert a column to a table

My processes:
1. Back up customers table, copy all data to origin_customers table.
2. Drop the current table.
3. Rebuild customers table without constraints.
4. Copy data back from origin_customers. Give your new column a default value or leave null.
5. Add constrains back to the customers table.
6. Add constrains back to reference tables.
7. Rebuild customers table sequence.

//todo details

## References

1. [PostgreSQL ADD COLUMN: Add One Or More Columns To a Table](http://www.postgresqltutorial.com/postgresql-add-column/)
2. [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html/)