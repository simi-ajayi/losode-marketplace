# Contributing Guide

## Branch Strategy
- Create focused feature branches from the latest stable branch.
- Keep one concern per branch.
- Avoid mixing refactors with feature changes.

## Branch Naming Convention
- `feature/<feature-name>`
- Example: `feature/cart-management`

## Commit Message Convention
Use:
```text
Feat:`description-of-the feat`
```

Examples:
- `Feat:`product-listing-search-filter``
- `Feat:`cart-management-redux-persist``

## Pull Request Checklist
- [ ] Branch is up-to-date with target
- [ ] Lint passes
- [ ] Build passes
- [ ] Scope is focused and reviewable
- [ ] Screenshots/GIFs added for UI work
- [ ] Env variable updates documented (if any)
