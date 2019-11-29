---
title: Everyday PSQL Commands
search: true
tags: 
  - database
  - PostgreSQL
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

PostgreSQL Cheat Sheet.

## Contents

- psql query Parameters
- Common connect and query
- Query Postgres db version
- Pg dump and restore

## PSQL Query Parameters

- `-d`, `–dbname=DBNAME` database name
- `-h`, `–host=HOSTNAME` database server hostname or ip
- `-t`, a table
- `-p`, `–port=PORT` database server port number (default: 5432)
- `-U`, `–username=NAME` connect as specified database user
- `-W`, `–password` force password prompt
- `–role=ROLENAME` do SET ROLE 


## Common commands and queries

### Connect to PostgreSQL database

```bash
$ psql -U moss template1;

$ psql -h localhost -p 5432 -U spm template1;
```
Switch to another db

```sql
\c template0  -- without username
\c template0 moss  -- with username
```

### List and descriptions

1. List available databases `\l`
2. List available tables `\dt`
    ```sql
    -- find that table name contains 'moss', case insensitive
    template1=> \dt *moss*
    ```

3. Describe a table `\d table_name`
4. List available schema `\dn`
5. List available functions `\df`. Use `\df+` to view a founction.
6. List available views `\dv`
7. List users and their roles `\du`
8. List Command history `\s`
    save commandline history to a file named history.txt
    ```sql
    \s moss.cmd.txt
    ```
9. Execute psql commands from a file `\i`
10. Turn on and off query execution time `\timing`
    ```sql
    template1=> \timing
    Timing is on.
    template1=> select now();
                  now
    -------------------------------
     2046-10-15 17:55:52.075797+13
    (1 row)
    
    Time: 20.232 ms
    template1=> \timing
    Timing is off.
    ```

11. Edit command in your own editor `\e`. It will open vim.
12. Create or View/Edit a function in the editor
    -  `\ef`It generates an editable function template.
        ```sql
        CREATE FUNCTION ( )
         RETURNS
         LANGUAGE
         -- common options:  IMMUTABLE  STABLE  STRICT  SECURITY DEFINER
        AS $function$
        
        $function$
        ```

    -  `\ef myFuncName` It opens a vim to view **existing** function.
13. Quit psql `\q`


### Query current psql version

```sql
template1=> SELECT version();
-- PostgreSQL 9.6.14 on x86_64-pc-linux-gnu (Debian 9.6.14-1.pgdg90+1), compiled by gcc (Debian 6.3.0-18+deb9u1) 6.3.0 20170516, 64-bit

template1=> SELECT current_setting('server_version_num')
-- 90614 (9.6.14)

template1=> SHOW server_version_num;
--  90614 (9.6.14)
```

### How can I query if a column exists in a table using an SQL statement

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name='your_table' and column_name='your_column';

select count(1)
from events
where time between (now() - '1 week'::interval) and (now() - '2 weeks'::interval);
```

### How to query record with timestamp

```java
SELECT *
FROM table
WHERE update_date >= '2013-05-03'::date
AND update_date < ('2013-05-03'::date + '1 day'::interval);
```

## Backup and Restore 

```sql
pg_dump -d <databasename> -h <hostname> -p <port> -n <schemaname> -f <location of the dump file>
```

`pg_restore` is a utility for restoring a PostgreSQL database from an archive created by pg_dump in one of the **non-plain-text formats**. 

It will issue the commands necessary to reconstruct the database to the state it was in **at the time it was saved**. 

The dump and restore processes should be in one transaction. This mode can be specified by passing the `-1` or `--single-transaction` command-line options to `psql`.

### For one table

```bash
root@postgresql-local:/$ pg_dump -U moss -d template -n public -t users > template_public_users.psql

root@postgresql-local:/$ psql -U spm -d org < org_public_users.psql -- restore
```

### For one Schema

```bash
pg_dump -U moss -d template1 -n schema_name > schema_name.dmp
```

### For one Database

```bash
pg_dump -U moss dbname > dbname.dmp
```
Since a database is too big, you may want to compress a large db

```bash
pg_dump -U postgres -d database_name | gzip > database_name.gz
gunzip -c database_name.gz | psql -U postgres database_name
```

### Export and import schema and table definition

1. schema definition without data
    ```bash
    $ pg_dump -U postgres -s -d myDatabase -n my_schema > my_schema_dump.txt
    ```
2. We need the customers definition because
    1. We need to reuse definition while creating new customers table
    2. we want to make sure new customers table remains the same definition
    ```bash
    $ pg_dump -U postgres -s -d myDatabase -n my_schema -t my_schema.customers > customers_dump.txt
    ```

## DO $$ Block

1. Excute sql

    ```sql
    Do $$
        Begin 
           execute format('drop database %I ', 'bak_20180404_2014_12'); 
        End
    $$ ;
    ```

2. Excute based on conditions

    ```sql
    DO
        $do$
        BEGIN
            IF EXISTS (SELECT FROM orders) THEN
               DELETE FROM orders;
            ELSE 
               INSERT INTO orders VALUES (1,2,3);
            END IF;
        END
    $do$
    ```
    - Need a `;` at the end of each statement, except for the final `END`
    - need `END IF;` at the end of the `IF` statement.


## Reference 

1. [PSQL 24.1. SQL Dump](https://www.postgresql.org/docs/9.1/backup-dump.html)
2. [17 Practical psql Commands That You Don’t Want To Miss](http://www.postgresqltutorial.com/psql-commands/)
3. [5 Tips to Backup and Restore Database in PostgreSQL](https://tecadmin.net/backup-and-restore-database-in-postgresql/)
4. [postgresql-if-statement](https://stackoverflow.com/questions/11299037/postgresql-if-statement/)