#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Merge each post's `categories` into `tags` (additively, deduped, lowercased).
# Categories are kept intact because permalinks depend on them
# (`permalink: /:categories/:title/`). The new layouts only render `tags`.
#
# Run from repo root:  ruby bin/migrate-frontmatter.rb

require "yaml"

ROOT = File.expand_path("..", __dir__)
posts = Dir.glob(File.join(ROOT, "_posts", "*.md")).sort

changed = 0
posts.each do |path|
  raw = File.read(path)
  next unless raw =~ /\A---\s*\n(.*?)\n---\s*\n(.*)/m

  fm = YAML.safe_load(Regexp.last_match(1)) || {}
  body = Regexp.last_match(2)

  cats = Array(fm["categories"]).map { |c| c.to_s.strip }.reject(&:empty?)
  tags = Array(fm["tags"]).map     { |t| t.to_s.strip }.reject(&:empty?)
  merged = (cats + tags).map(&:downcase).uniq.sort

  next if merged == tags.sort && tags.all? { |t| t == t.downcase }

  fm["tags"] = merged
  yaml = fm.to_yaml.sub(/\A---\s*\n/, "")
  File.write(path, "---\n#{yaml}---\n#{body}")
  changed += 1
end

puts "Updated #{changed} of #{posts.size} posts."
