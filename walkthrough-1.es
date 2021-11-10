GET /_cluster/health

/**
  Table => index
  Row => Doc
  Column => Field
*/

// post data to 'users' index
POST users/_doc
{
  "firstname": "James",
  "lastname": "Smith",
  "age": 22
}

// get data in 'users' index
GET users/_search

// insert to specific ID
// if the ID already exists, it will be replaced instead
POST users/_doc/007
{
  "firstname": "Jordon",
  "lastname": "Lucas",
  "age": 18
}

// show all indices (which means table in relational db)
GET /_cat/indices?v

// post multiple data
// curl localhost:9200/_bulk -H 'Content-Type: application/x-ndjson' --data-binary '@users.ndjson'
POST /_bulk
{"index":{"_index":"users","_id": 1}}
{"firstname":"Rodney","lastname":"Charles","age":19}
{"index":{"_index":"users","_id": 2}}
{"firstname":"Tamia","lastname":"Shannon","age":22}

// or if every indices in the same, specify the index first
POST users/_bulk
{"index":{"_id": 3}}
{"firstname":"Emerson","lastname":"Warner","age":20}
{"index":{"_id": 4}}
{"firstname":"Talia","lastname":"Reid","age":20}
