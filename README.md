# DOClarifAI

From clutter to clarity, we clarify.

## Prerequisites
Authentication is explained in the [architecture documentation](docs/architecture.md).

The authentication service needs a public/private key pair, and all the other services need to know about the authentication service's public key. We chose to use the ES256 algorithm.
Instructions on how to generate a public/private key pair for this algorithm can be found [here](https://notes.salrahman.com/generate-es256-es384-es512-private-keys/).
In the authentication service, create a folder ES256 and inside it place:
- the private key, in a file named "private.ec.key"
- the public key, in a file named "public.pem"

For all the other services, create a folder named ES256 and inside it place a copy of the authentication service's public key, in a file named "public.pem"


## How to use


## How to contribute

TODO

To learn more, you can also read the [development guide](docs/development.md).


## How to run and operate in a production environment
TODO

#### Module READMEs
- TODO

# Environments

Production: 
- TODO: add links

Staging:  
- TODO: add links
