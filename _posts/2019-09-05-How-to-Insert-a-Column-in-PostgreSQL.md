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

## Add a column in a table

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


## How to test

Before we do it, we have to know how to verify that our solution is good.

1. Current table Not data lost
2. Current table o table definition change
3. Other tables don't lose data
4. Other tables don't have definition change

### Before running our migration script

1. `\d current table`
2. `select count(id)`
3. `\d reference table`
4. `select count(ref_id)`
5. `\d reference table`
6. `select count(ref_id)`
7. check views
8. NB check all triggers to see if there is a `select * from currentTable`  statement. If there is, we also need to back up and rebuild this table.

### Export schema and table definition

1. We need the schema definition because we want to compare customers related tables definitions are not changed.
    ```bash
    $ pg_dump -U postgres -s myDatabase -n my_schema > my_schema_dump.txt
    ```
2. We need the customers definition because
    1. We need to reuse definition while creating new customers table
    2. we want to make sure new customers table remains the same definition
    ```bash
    $ pg_dump -U postgres -s myDatabase -n my_schema -t my_schema.customers > customers_dump.txt
    ```


## Insert a column to a table

My processes:
1. Back up customers table, copy all data to origin_customers table.
2. Drop the current table.
3. Rebuild customers table without constraints.
4. Copy data back from origin_customers. Give your new column a default value or leave null.
5. Add constrains back to the customers table.
6. Add constrains back to reference tables.
7. Rebuild customers table sequence. Remember, sequence cannot be 0.  
    ```sql
    select setval('customers_customers_id_seq', (select max(customers_id) from customers where customers_id > 0), true);
    ```
8. Verify based on the testing plan.


## References

1. [PostgreSQL ADD COLUMN: Add One Or More Columns To a Table](http://www.postgresqltutorial.com/postgresql-add-column/)
2. [PostgreSQL: ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html/)