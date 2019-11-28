---
title: Delete and Create Records Violates Constraints in Spring Data Jpa
search: true
tags: 
  - Spring Data JPA
  - Sprint Boot
  - SQL
  - Spring
  - Spring Professional Certification
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

Still haven't find a decent answer in StackOverFlow.

Scenario: I have an **Attribute** entity, which has multipul children **Options**. Option has its unique keys, say, label.
When I delete an Option with label "AAA", with Id 1, then add a new Option without Id, but the same label. Then, hit save.

What I've tried, however doesn't work:

1. A normal implementation, what I expect is that JPA handles this, deletes the old record in Database and inserts a new record.

2. Run a delete method before inserting.

3. Annotate the deleting mehtod with `@Transactional`, then implement the insert.

4. After deleting, run `repository.flush()`.

What saved me:

```sql
ALTER TABLE options
  ADD CONSTRAINT your_constraint_name UNIQUE (id, label) DEFERRABLE INITIALLY DEFERRED;
```

Explain:

JPA preference is to instert before deleting so when we have parent child contraints it will not work, so we added the deferred constraint so it will delete and insert then apply the contraint rules. This will only work for prostgress and Oracle future dbs be aware.

## References

- [Delete then create records are causing a duplicate key violation with Spring Data JPA](https://stackoverflow.com/questions/42124030/delete-then-create-records-are-causing-a-duplicate-key-violation-with-spring-dat)

- [JPA: foreign key violation during parent entity deletion](https://groups.google.com/forum/#!topic/play-framework/4DgwtuNYs10)

- [Advanced Database Constraints: Don’t Look for a Second](https://dzone.com/articles/advanced-database-constraints-0)