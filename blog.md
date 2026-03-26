---
layout: default
title: Blog
---

<div class="container">
  <div class="archive-layout">
    <header class="archive-header">
      <h1 class="archive-title">Latest Articles</h1>
      <p class="archive-description">Browse all our articles, from breaking news to in-depth analysis.</p>
    </header>

    <div class="posts-grid">
      {% for post in paginator.posts %}
        {% include post-card.html post=post %}
      {% endfor %}
    </div>

    {% include pagination.html %}
  </div>
</div>
