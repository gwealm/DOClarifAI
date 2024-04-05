// Connect to the admin database
db = db.getSiblingDB('admin');

// Authenticate using environment variables
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

// Switch to the lgp database
db = db.getSiblingDB('lgp');

// Create a collection named 'documents'
db.createCollection('documents');
