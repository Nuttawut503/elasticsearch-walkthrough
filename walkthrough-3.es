/** 
running this query, you would see the returned json says that
the total number of docs is 21 but if you try to count it returned only 10 docs
*/
GET recipes/_search

// 10 is the default of docs that will be actually returned, to change the size do this
GET recipes/_search?size=21

// this form of sending query also work like the previous query
GET recipes/_search
{
  "size": 21
}

// choose fields to return (when you don't want every fields)
GET recipes/_search
{
  "_source": ["title", "description"]
}

// or get every field except...
GET recipes/_search
{
  "_source": {
    "excludes": ["description", "ingredients", "ratings"]
  }
}

// if you don't want any fields
GET recipes/_search
{
  "_source": false
}

// get 3 docs but skip first 10 docs
GET recipes/_search
{
  "_source": false,
  "size": 3,
  "from": 10
}

// sorting
GET recipes/_search
{
  "_source": ["created"],
  "sort": [
    { "created": "desc" }
  ]
}

// adding "explain" key, it returns "_explanation" key inside each docs
// which explain how it calculated the scores
// for more information, research about Okapi BM25 in the internet
GET recipes/_search
{
  "query": {
    "term": {
      "title": "sauce"
    }
  },
  "explain": true
}

// search by ID, both string and integer work
GET recipes/_search
{
  "query": {
    "ids": {
      "values": ["1", 2, 5]
    }
  }
}

// search with range
GET recipes/_search
{
  "query": {
    "range": {
      "preparation_time_minutes": {
        "gte": 20,
        "lte": 25
      }
    }
  }
}

// search with range but with date
GET recipes/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2010-10/3",
        "lt": "2015-2/10",
        "format": "yyyy-M/d"
      }
    }
  }
}
GET recipes/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2010/01/01||+5M",
        "lt": "now/y-7y" // now - 4 years and rounddown year (first day of the year)
      }
    }
  }
}

// search for recipes that have ratings
GET recipes/_search
{
  "query": {
    "exists": {
      "field": "ratings"
    }
  }
}

// search for recipes that don't have ratings (empty arrays are also counted)
GET recipes/_search
{
  "query": {
    "bool": {
      "must_not": [
        {
          "exists": {
            "field": "ratings"
          }
        }
      ]
    }
  }
}

// search title that starts with "One"
GET recipes/_search
{
  "query": {
    "prefix": {
      "title.keyword": {
        "value": "One"
      }
    }
  }
}

// search with wildcard (contains Shrimp)
GET recipes/_search
{
  "query": {
    "wildcard": {
      "title.keyword": {
        "value": "*Shrimp*"
      }
    }
  }
}

// regex
GET recipes/_search
{
  "query": {
    "regexp": {
      "description.keyword": {
        "value": ".*and.*"
      }
    }
  }
}

// if title contains Spaghetti or Aglio
GET recipes/_search
{
  "query": {
    "match": {
      "title": "Spaghetti Aglio"
    }
  }
}

// if title contains Spaghetti and Aglio
GET recipes/_search
{
  "query": {
    "match": {
      "title": {
        "query": "Spaghetti Aglio",
        "operator": "and"
      }
    }
  }
}

// if title contains "Spaghetti Aglio"
GET recipes/_search
{
  "query": {
    "match_phrase": {
      "title": "Spaghetti Aglio"
    }
  }
}

// search in multiple fields, queried if one of the field contains
GET recipes/_search
{
  "query": {
    "multi_match": {
      "query": "Spaghetti Aglio",
      "fields": ["title", "description"]
    }
  }
}

// dynamic search with boolean
// _name key is to help how a doc matches with which one in the query rules
GET recipes/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "ingredients.name": {
              "query": "pasta",
              "_name": "match_pasta"
            }
          }
        },
        {
          "match": {
            "ingredients.name": {
              "query": "garlic",
              "_name": "match_garlic"
            }
          }
        }
      ],
      "filter": [
        {
          "range": {
            "preparation_time_minutes": {
              "lte": 25
            }
          }
        }
      ]
    }
  }
}

// describe an indices' structure
GET languages/_mapping

GET recipes/_mapping

// working with aggregation (set size to 0 to focus only on the aggregation)
GET recipes/_search
{
  "size": 0,
  "aggs": {
    "avg_preparation_time_minutes": {
      "avg": {
        "field": "preparation_time_minutes"
      }
    },
    "min_servings": {
      "min": {
        "field": "servings.min"
      }
    },
    "max_servings": {
      "max": {
        "field": "servings.max"
      }
    },
    "stat_of_ratings": {
      "stats": {
        "field": "ratings"
      }
    },
    "stat": {
      "terms": {
        "field": "preparation_time_minutes"
      },
      "aggs": { // nested aggs works too, this will show avg_ratings of each preparation_time_minutes
        "avg_ratings": {
          "avg": {
            "field": "ratings"
          }
        }
      }
    }
  }
}

// custom range
GET recipes/_search
{
  "size": 0,
  "aggs": {
    "rating_distribution": {
      "range": {
        "field": "preparation_time_minutes",
        "ranges": [
          {
            "to": 20
          },
          {
            "from": 20,
            "to": 25
          },
          {
            "from": 25
          }
        ]
      },
      "aggs": {
        "review_count": {
          "value_count": {
            "field": "ratings"
          }
        }
      }
    }
  }
}


// custom range with date
GET recipes/_search
{
  "size": 0,
  "aggs": {
    "created_time_interval": {
      "date_range": {
        "field": "created",
        "format": "yyyy-M/d",
        "keyed": true,
        "ranges": [
          {
            "to": "2012-6/6",
            "key": "before mid 2012"
          },
          {
            "from": "2012-6/6",
            "key": "after mid 2012"
          }
        ]
      }
    }
  }
}

// histogram
GET recipes/_search
{
  "size": 0,
  "aggs": {
    "review_distribution": {
      "histogram": {
        "field": "preparation_time_minutes",
        "interval": 4
      }
    }
  }
}

// date histogram
GET recipes/_search
{
  "size": 0,
  "aggs": {
    "created_distribution": {
      "date_histogram": {
        "field": "created",
        "calendar_interval": "year"
      }
    }
  }
}
