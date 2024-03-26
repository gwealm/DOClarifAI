# Workflow Management Service

The Workflow Management Service leverages SAP BPA's API to enable users to configure workflows according to their specific requirements.

## Prerequisites

Before utilizing this repository, ensure the following software is installed on your system:

- [Docker](https://www.docker.com/get-started)
- Docker Compose 

## Getting Started

### Running the Application

To initiate the application, execute `run_standalone.sh`.

This script will launch the application.

### Running Tests and Linter

To execute tests and the linter, run `run_tests_and_lint.sh`.

This will trigger the tests and the linter, generating corresponding reports.

### Reports

Reports for both tests and the linter are accessible in the `/reports/` directory.

## Project Structure

The project structure encompasses the following components:
- `/app/`: Holds the application's code.
- `/env/`: Houses example .env files and a shell script to create the necessary .env files from the examples.
- `/tests/`: Contains scripts for testing the application.
- `/reports/`: Stores reports for tests and the linter.

## Formatting

To format the code, use the following commands:

```bash
pip install yapf

python -m yapf -ri .
```
