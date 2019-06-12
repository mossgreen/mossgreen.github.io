---
title: Don't Use PHP in JS Condition Check
search: true
tags: 
  - Linux
  - Docker
toc: true
---

Don't use PHP in JS Condition Check.

```javascript
<script>

      if ('false') {
          alert('hi');
      }
  </script>
```

Above code alerts "hi". That's alright.


```javascript
<?php $demo = "false"; ?>

<script>

    if (<?php echo $demo; ?>) {
        alert('hi');
    }
</script>
```
Above code has no alert

```javascript
<?php $demo = "false"; ?>

<script>

    if ('<?php echo $demo; ?>') {
        alert('hi');
    }
</script>
```
Above code alerts "hi". That's alright.

```javascript
<?php $demo = "demo"; ?>

<script>

    if ('<?php echo $demo; ?>') {
        alert('hi');
    }
</script>
```
Above code alerts "hi".


```javascript
<script>

      <?php $demo = "true"; ?>

      if (<?php $demo ; ?>) {
          alert("hi");
      }
  </script>
```
no alert

```javascript
<script>

    <?php $demo = "true"; ?>

    if (<?php echo $demo ; ?>) {
        alert("hi");
    }
</script>
```
Alert !


Conclusion:
1. Try not to use php in js
2. Use it the following way:

```php
<?php if($first_condition): ?>
  /*$first_condition is true*/
<?php elseif ($second_condition): ?>
  /*$first_condition is false and $second_condition is true*/
<?php else: ?>
  /*$first_condition and $second_condition are false*/
<?php endif; ?>
```
