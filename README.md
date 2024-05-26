# DOClarifAI

From clutter to clarity, we clarify.

## Index
- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [How to Use](#how-to-use)
- [How to Contribute](#how-to-contribute)
- [How to Run and Operate in a Production Environment](#how-to-run-and-operate-in-a-production-environment)
- [Environments](#environments)
- [Architectural Overview](#architectural-overview)
- [License](#license)

## Introduction

DoClarifAI is an innovative data processing platform designed to automate the extraction and management of data from various documents. By leveraging advanced artificial intelligence technologies, DoClarifAI significantly reduces the time and effort required to process invoices, contracts, and other business documents. This allows organizations to streamline their operations, minimize errors, and make more informed decisions based on accurate and timely data.

## Prerequisites

Authentication is explained in the [architecture documentation](docs/architecture.md).

The authentication service needs a public/private key pair, and all the other services need to know about the authentication service's public key. We chose to use the ES256 algorithm. Instructions on how to generate a public/private key pair for this algorithm can be found [here](https://notes.salrahman.com/generate-es256-es384-es512-private-keys/).

In the authentication service, create a folder ES256 and place:
- the private key, in a file named `private.ec.key`
- the public key, in a file named `public.pem`

For all other services, create a folder named ES256 and place a copy of the authentication service's public key in a file named `public.pem`.

## How to Use

Detailed instructions on how to use the services are available in their respective READMEs:

- [Authentication Service](authentication-service/README.md)
- [Exporter Service](exporter-service/README.md)
- [Frontend](frontend/README.md)
- [Importer Service](importer-service/README.md)
- [Workflow Management Service](workflow-management-service/README.md)
- [Common](common/README.md)
- [Database - Postgres](database/postgres/README.md)

## How to Contribute

To contribute you should open a Issue, and later, after triage by the development team, a Pull Request which will be reviewed.

We are using [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

## Deployment Environment

Production: 
- [www.doclarifai.pt](http://www.doclarifai.pt)

Note: deployment is currently being done using google cloud and cloudflare to manage the dns records.

## Architectural Overview

### Requirements

The platform is designed to meet several key user requirements:
- Automatic processing of files from a mailbox
- Manual file entry for processing
- API access for file submission
- Customizable document templates for AI model training
- Configurable confidence thresholds for data extraction
- Integration of structured data output into existing systems

### Architecture and Technologies

The architecture is divided into key areas:

#### Authentication & Authorization

- Public/Private key pair management using the [ES256 algorithm](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm).

#### Document Processing

- **Backend**: SAP Document Information Extraction (Dox), FastAPI
- **Frontend**: React
- **Database**: MongoDB, PostgreSQL

### Technologies

- **Backend**: 
  - [SAP Document Information Extraction (Dox)](https://help.sap.com/docs/document-information-extraction)
  - [FastAPI](https://fastapi.tiangolo.com/)

- **Frontend**: 
  - [React](https://react.dev/)

- **Database**: 
  - [MongoDB](https://www.mongodb.com/)
  - [PostgreSQL](https://www.postgresql.org/)

### Hand-Over Process

The project includes thorough documentation for the installation process, ensuring a smooth handover to clients.

## License

This project is currently under no license.
