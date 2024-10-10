# FFC MPDP Acceptance Tests POC

> Acceptance tests POC for the Making Payment Data Public service UI using Playwright

Mainly there are two types of tests in this repository:
cucumber tests (resides in features folder) and non-cucumber tests (resides in non-cucumber-tests folder).

There is also an implementation of accessibility tests using playwright which resides in the a11y folder.

All the types of tests use page-object-based approach.

## Prerequisites

- Docker (installed and running locally)
- Docker Compose
- Node.js
- npm

### Running tests

The non-cucumber-tests tests run in a containerized environment. This will rebuild images before running tests via docker-compose.

Run the test locally using the command from this folder (no need to pass the docker-compose.yaml when run from this folder as the docker-compose.yaml is in the same folder):

```docker-compose -f docker-compose.yaml up --build --abort-on-container-exit```

To run the cucumber tests locally, run the following command:

```PROJECT=<ENV_VALUE> npm run cucumber-tests```
where PROJECT is the environment to run the tests against such as dev, test, pre-prod or prod as defined in teh playwright.config.ts file.

## CI pipeline

As this is a POC, these tests are not being executed in CI pipeline.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
