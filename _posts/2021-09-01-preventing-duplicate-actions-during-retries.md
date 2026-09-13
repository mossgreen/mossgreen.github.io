---
title: "Preventing Duplicate Actions During Retries"
description: "Retries prevent lost work but can repeat completed actions. Stable IDs, atomic commits, outboxes, and idempotency keys make retries safe."
tags:
- distributed system
- idempotent
- messaging
- outbox
search: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
classes: wide
---

The system may attempt the work many times. The business action should happen once.

**TL;DR**

- Expect a message to arrive more than once.
- Keep its event ID unchanged.
- Commit the local action, processed ID, and outgoing event together.
- Reuse one idempotency key for every remote attempt.

## 1. A missing acknowledgement makes the result uncertain

The warehouse receives `OrderPaid` and creates a dispatch job:

```text
receive → create dispatch job → commit → acknowledge
```

Neither order is safe:

- **Acknowledge, then commit.** A crash in between loses the dispatch job. The broker thinks the work is done.
- **Commit, then acknowledge.** A crash in between causes redelivery. Repeating the work creates two dispatch jobs.

**Changing the order only changes the failure.** Commit first, acknowledge afterwards, and accept redelivery. This is **at-least-once delivery**.

Repeated delivery is expected. A repeated business action is the bug.

## 2. A stable event ID identifies the retry

Give each event an ID before its first publication. Every delivery attempt for that event must carry the same ID. A new ID makes a retry look like new work.

The delivery attempt may be new. The event identity must not be. This makes deduplication possible, but not yet safe.

## 3. One transaction prevents duplicate local actions

The warehouse must create the dispatch job and record the event ID as processed. Doing them separately leaves another gap:

- **Record first, then act.** A crash leaves the event marked as processed without a dispatch job.
- **Act first, then record.** A crash creates the job without recording the event. The retry creates another job.

Commit both changes in one database transaction:

```text
BEGIN
  insert event ID into processed_messages if absent
  if inserted:
    create dispatch job
COMMIT
acknowledge incoming message
```

Enforce uniqueness on `(consumer_id, event_id)`. Only the transaction that inserts the event ID performs the action. Do not check first and insert later: two workers could pass the check together. Use one atomic operation, such as PostgreSQL's [INSERT ON CONFLICT](https://www.postgresql.org/docs/13/sql-insert.html#SQL-ON-CONFLICT).

**Acknowledge only after the transaction commits.** A crash may cause redelivery, but the stored event ID makes the retry harmless. [The acknowledgement tells the broker that it can discard the message](https://www.rabbitmq.com/docs/confirms).

## 4. An outbox prevents lost follow-up events

After consuming `OrderPaid`, the warehouse becomes the producer of `DispatchQueued`.

Creating the dispatch job and publishing the new event are separate operations. Again, either order leaves a gap:

- **Commit, then publish.** A crash in between creates the job, but the next service never hears about it. Lost event.
- **Publish, then commit.** The commit fails, but the next service acts on a change that never became permanent. Phantom event.

Save the outgoing event in an **outbox table** as part of the same transaction:

```text
BEGIN
  insert event ID into processed_messages if absent
  if inserted:
    create dispatch job
    insert DispatchQueued with a new event ID into outbox
COMMIT
```

The processed event ID, dispatch job, and outgoing event now commit together. This is the [transactional outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html).

A relay publishes committed outbox rows. It may crash after publishing but before marking a row as sent. It will publish the row again with the outgoing event's ID unchanged.

The outbox prevents a lost event. It does not prevent repeated delivery. The stable ID and consumer transaction make that delivery safe.

## 5. An idempotency key prevents duplicate remote actions

A database transaction protects only its own database. It cannot include a charge made by a payment provider. The service may crash after the provider accepts the charge but before the local record commits.

Create and store an **idempotency key** before the first call. Reuse it for every attempt of the same payment. The provider uses the key to recognise the retry and avoid another charge.

If the response is lost, retry with the same key. A new key may create a new charge. Also keep retries within the [provider's supported retention window](https://docs.stripe.com/api/idempotent_requests).

Without idempotency support, a timeout leaves the result uncertain. Check the provider's records before retrying when possible. Otherwise, choose which risk to accept: a missed charge or a duplicate one.

## 6. The goal is one action, not one attempt

Three rules apply at every boundary:

- **Keep the identity stable.** The same work keeps the same ID.
- **Commit local facts together.** The action, processed event ID, and outgoing event share one transaction.
- **Make remote actions idempotent.** Every attempt uses the same key.

The system may attempt the work many times. The business action should happen once.
