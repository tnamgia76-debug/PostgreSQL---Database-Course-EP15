import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

orders = client.shop.orders

orders.insert_one({
    "_id": 1004,
    "customer": {
        "name": "Hung",
        "city": "Hue"
    },
    "status": "paid",
    "items": []
})

for doc in orders.find(
    {"status": "paid"},
    {"customer.name": 1, "status": 1}
):
    print(doc)

pipeline = [
    {"$unwind": "$items"},
    {
        "$group": {
            "_id": "$items.sku",
            "units": {"$sum": "$items.qty"}
        }
    }
]

df = pd.DataFrame(orders.aggregate(pipeline))

print(df)