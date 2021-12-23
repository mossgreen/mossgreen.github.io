---
title: Debug a SQL performance issue (aka, how to read a query plan)
tags:
  - PSQL
  - Query Plan
  - JOOQ
toc: true
toc_label: 'My Table of Contents'
toc_icon: 'cog'
classes: wide
---

aka, how to read a query plan

### 0. how to get the sql query from JOOQ?

- try to use it on your own stack. It’s enough, because you only want to know the query
- never go to prod

add it to your application.properties

```properties
quarkus.log.category."org.jooq".level=DEBUG
```

### 1.  Query plan

- The `EXPLAIN` command shows the execution plan of a statement and
  - how data from the tables are scanned
  - how the tables are joined, the join method, and
  - the estimated number of rows
- `EXPLAIN ANALYZE` executes and returns the actual time and number of rows
- How to read the plan?
  read the execution plan bottom-up and from the most to least indented
- Readings
  - The cost is an estimation of the effort required to execute the query.
    - format (cost to retrieve the first row, cost to retrieve all rows)
    - a cost is an arbitrary unit of computation
  - rows is the estimated number of rows this Index Scan will return
  - width is the estimated size in bytes of the returned rows

### 2. a real life case

// todo

result:

1. Structure with query order (??)
   - sort – 6
     - nested loop – 3
       - seq scan xxxx_datasource – 1
       - index scan  idx_xxxx_identifier – 2
     - HashAggregate – 5
       - CTE scan on msmt – 4
2. Loops
in  Index Scan using `idx_xxxx_identifier` on the table  loops=2, because we only query 2 records in data source 175,174. It may go up quickly if we have more ids

## References
