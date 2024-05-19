# Importer  Service


## Prerequisites

Before utilizing this repository, ensure the following software is installed on your system:

- [Docker](https://www.docker.com/get-started)
- Docker Compose 

In addition, you need a service key for Document Information Extraction. You can find a tutorial on how to get one [here](https://developers.sap.com/tutorials/cp-aibus-dox-free-booster-key.html).
In the .env file, set SAP_BASE_URL as  url, SAP_CLIENT_ID as uaa.clientid, SAP_CLIENT_SECRET as uaa.clientsecret, and SAP_UAA_URL as uaa.url

Lastly, you'll need an OAUTH2 token to interact with the Gmail API. To get this token, change directory into importer-service and run
```bash
python3 app/gmail_automation/generate_google_oauth2_token.py
```
This requires that you have the client secrets credentials (crendentials.json) on the google_oauth2_token folder.
To get this JSON, navigate to the [google cloud console](https://console.cloud.google.com/apis/credentials), log in as doclarifai@gmail.com, navigate to the WeClarifai project, click on the download button for the  Gmail automation OAuth2.0 Client and then click on DOWNLOAD JSON, storing the file inside google_oauth2_token with the name token.json


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
