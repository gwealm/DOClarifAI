// your-script.js
db.auth('admin', 'secret'); 


db.createUser({
  user: 'user',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'database'
    }
  ]
});


db = db.getSiblingDB('database');
db.createCollection('collection');