---
layout: page
title: Topics
permalink: /topics/
description: All topics on Moss GU's blog.
---

{%- assign sorted_tags = site.tags | sort -%}
<div class="line-height-loose">
{%- for tag in sorted_tags -%}
  {%- assign slug = tag[0] | slugify -%}
  <a href="{{ '/topics/' | append: slug | append: '/' | relative_url }}">{{ tag[0] }}</a><span class="muted small font-ui"> ({{ tag[1] | size }})</span>{%- unless forloop.last -%}<span class="muted">,</span> {%- endunless -%}
{%- endfor -%}
</div>
