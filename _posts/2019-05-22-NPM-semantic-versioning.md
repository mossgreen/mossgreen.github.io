---
title: NPM Semantic Versioning
search: true
tags: 
  - npm
  - git
toc: true
toc_label: "My Table of Contents"
toc_icon: "cog"
classes: wide
---

We should tag projects like NPM does.

## NPM Semantic Versioning Rules
1. **Starting** your package version at `1.0.0`.
2. **Patch release**, which is backward compatible bug fixes, do `1.0.1`.
3. **Minor release**, backward compatible new features, do `1.1.0`.
4. **Major release**, changes that break backward compatibility, do `2.0.0`.

![IMAGE](https://i.loli.net/2019/05/23/5ce5d73fb2f7323808.jpg)

## Operators
- include everything **greater than** a particular version in the same major range: `^`. E.g., `^2.2.1`
- specify a range of stable versions: use `>`, `<`, `=`, `>=` or `<=` for **comparisons**, or `-` to specify an **inclusive** range: `>2.1`. E.g.,  `1.0.0 - 1.2.0`
- include **prerelease** versions like `alpha` and `beta`. E.g., `1.0.0-rc.1`
- include **multiple sets** of versions, use `||`. E.g.,`^2 <2.2 || > 2.3`
- include everything greater than a particular version in the same **minor range**: `~`. E.g., `~2.2.0`
- specify a range of prerelease versions, use comparisons like `>` with a prerelease tag: `>1.0.0-alpha`, `>=1.0.0-rc.0 <1.0.1`


## Specify your acceptable version from `package.json`
- Patch releases: `1.0` or `1.0.x` or `~1.0.4`
- Minor releases: `1` or `1.x` or `^1.0.4`
- Major releases: `*` or `x`


## Most comman used

- `^4.17.3` install latest minor version
- `~4.17.3` install latest patch version
- `4.17.3` install that version, exactly

```json
"dependencies": {
  "my_dep": "^1.0.0",
  "another_dep": "~2.2.0"
},
```

## Benefits
1. Helps other developers who depend on your code understand the extent of changes
2. If rock back is needed, it has room to fix bugs


## Take Away

1. Tag git branches the NPM way.
2. **vX.Y.Z** e.g. `v3.1.0` is not necessary. `v` is historical for older SCSS.
3. `git check-ref-format` to check if a git name is valid. However, you should not use it if they follow our rules.


### References
1. [About semantic versioning](https://docs.npmjs.com/about-semantic-versioning)
2. [npm semver calculator](https://semver.npmjs.com/)
3. [Semantic Versioning 2.0.0](https://semver.org/)
4. [Git Basics - Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
5. [Bitbucke Tutorial - Git tag](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-tag)
6. [Is there a standard naming convention for git tags?](https://stackoverflow.com/questions/2006265/is-there-a-standard-naming-convention-for-git-tags)
7. [What names are valid git tags?](https://stackoverflow.com/questions/26382234/what-names-are-valid-git-tags)