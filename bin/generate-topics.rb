#!/usr/bin/env ruby
# frozen_string_literal: true
#
# Scan all posts, collect their `tags`, and emit one Jekyll page per tag at
# _pages/topics/<slug>.md  →  /topics/<slug>/  (uses layout: topic).
#
# Run from repo root:  ruby bin/generate-topics.rb

require "yaml"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
out_dir = File.join(ROOT, "_pages", "topics")
FileUtils.mkdir_p(out_dir)

# Wipe any previously-generated stubs so deletions are reflected
Dir.glob(File.join(out_dir, "*.md")).each { |f| File.delete(f) }

tags = {}
Dir.glob(File.join(ROOT, "_posts", "*.md")).each do |path|
  raw = File.read(path)
  next unless raw =~ /\A---\s*\n(.*?)\n---/m
  fm = YAML.safe_load(Regexp.last_match(1)) || {}
  Array(fm["tags"]).each do |t|
    label = t.to_s.strip
    next if label.empty?
    slug = label.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, "")
    tags[slug] ||= label
  end
end

tags.sort.each do |slug, label|
  path = File.join(out_dir, "#{slug}.md")
  yaml_label = label.gsub('"', '\\"')
  File.write(path, <<~MD)
    ---
    layout: topic
    permalink: /topics/#{slug}/
    title: "Topic: #{label}"
    tag: "#{yaml_label}"
    tag_label: "#{yaml_label}"
    sitemap:
      priority: 0.5
    ---
  MD
end

puts "Generated #{tags.size} topic pages in #{out_dir}"
