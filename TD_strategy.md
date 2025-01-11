# Technical Debt strategy

Our strategy to tackle the technical debt is to solve all sonarcube's issues ranked as blocker or high severity.

## Quality gate definition
The quality gate is as follows:
- Duplicated lines < 3.0%
- Maintainablity better than A
- Reliability better than A
- Security hotspot at 100%
- Security rating better than A
- Test coverage is manually checked

## New code definition
A new analysis is triggered every time something is pushed on 'dev' branch and on new commits in every Pull Request.
New code is set to 'previous version'.