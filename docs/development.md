# Development

#  Development guide

<!--
Explain what a new developer to the project should know in order to develop the system, including who to build, run and test it in a development environment. 

Document any APIs, formats and protocols needed for development (but don't forget that public APIs should also be accessible from the "How to use" section in your README.md file). 

Describe coding conventions and other guidelines adopted by the project.
-->


### Workflow    
[GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) should be followed. When creating a pull request, the following [template](../.github/blob/main/PULL_REQUEST_TEMPLATE.md) should be used.


## Quality assurance

Quality assurance will be performed through the use of automated tests.
This should be achieved by using the following tools:

- [playwright](https://playwright.dev/) for **End-to-End Testing**
- [jest](https://jestjs.io/) or [vitest](https://vitest.dev/) depending on the build system used, for TypeScript/JavaScript **Unit Testing**
- [pytest](https://docs.pytest.org/en/7.4.x/) for Python **Unit Testing**

The following linters/formatters will be used:

- [eslint](https://eslint.org/) for Typescript
- [pylint](https://github.com/pylint-dev/pylint) for Python using [Google's configuration](https://google.github.io/styleguide/pylintrc), along with [yapf](https://github.com/google/yapf)


### Definition of Done
- All unit tests pass with at least 70% coverage
- Code has been rated at least 9/10 by the linter
- All automated acceptance tests pass
- Peer reviewed by at least 2 people
- Branch merged to main
- Deployed to the test environment