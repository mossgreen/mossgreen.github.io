---
title: How to Test Jekyll Website Locally
search: true
categories: 
  - Jekyll
  - GitHub Pages
---

Preview your site and help troubleshoot failed Jekyll builds.

Test Jekyll website just on GitHub Pages is unprofessional and can be dangerous. It's highly recommend installing Jekyll to preview your site and help troubleshoot failed Jekyll builds.

## Requirements

1. Install Ruby: `$ sodu install ruby`

2. Install bundler: `$ gem install bundler`

3. Update 'Gemfile' in project directory:

    ```bash
    \$ source 'https://rubygems.org'
    \$ gem 'github-pages', group: :jekyll_plugins
    ```

4. In project directory, update dependencies:`$ bundle install`

## Run it

- Navigate to the root directory: `cd blog`

- Run your Jekyll site locally on 'watch mood':

    ```bash
    \$ bundle exec Jekyll serve --watch
    ```

- Navigate to: `localhost:4000` or `http://127.0.0.1:4000`

- If you update something, when you hit **Save**, it will automatically update

## End

- Add your changes and push to the repo on GitHub
