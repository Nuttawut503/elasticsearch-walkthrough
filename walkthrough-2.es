// run this first -> curl localhost:9200/recipes/_bulk -H 'Content-Type: application/x-ndjson' --data-binary '@recipes.ndjson'

GET recipes/_search

/**
  searching for a word through an index
  elasticsearch use TF-IDF to calculate _score for each docs
 */
GET recipes/_search?q=steps:salt

// tokenize words
GET /_analyze
{
  "text": "A customer walked into my clothing shop and asked to see the pants that were advertised in the paper that day",
  "analyzer": "standard"
}

// cut html tags and ignore cases
GET /_analyze
{
  "text": "<span>A customer <b>walked</b> into my clothing shop</span>",
  "char_filter": ["html_strip"],
  "tokenizer": "standard",
  "filter": ["lowercase"]
}

GET /_analyze
{
  "text": "ยายกินลำใยน้ำลายยายไหลย้อย",
  "analyzer": "thai"
}

// create an index with specific analyzer for words
// https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html
PUT languages
{
  "mappings": {
    "properties": {
      "english": {
        "type": "text",
        "analyzer": "standard"
      },
      "thai": {
        "type": "text",
        "analyzer": "thai"
      }
    }
  }
}

POST languages/_doc
{
  "english": "Good morning",
  "thai": "สวัสดีตอนเช้า"
}

// this would be able to do properly
// you can try to put thai text in english field and search for a word in that field to see the difference 
GET languages/_search?q=thai:เช้า

// search for "good" word in english field of 'languages' index
GET languages/_search
{
  "query": {
    "match": {
      "english": "good"
    }
  }
}

// normally, standard analyzer will tokenize by converting every tokens to lowercase
// using term search won't be able to find the "Good" word since it is already converted to lowercase
// if you want insensitive search, use 'query.match' instead (like in the previous query)
GET languages/_search
{
  "query": {
    "term": {
      "english": "Good"
    }
  }
}
