db = db.getSiblingDB("shop");

db.orders.insertOne({
  _id: 1001,
  customer: { name: "Linh", city: "Hanoi" },
  status: "paid",
  items: [
    { sku: "BK-01", title: "Python Basics", qty: 2, price: 12.5 },
    { sku: "BK-07", title: "SQL in Practice", qty: 1, price: 18.0 }
  ]
});

db.orders.insertMany([
  {
    _id: 1002,
    customer: { name: "Nam", city: "Da Nang" },
    status: "shipped",
    items: [
      { sku: "BK-03", title: "Data Viz", qty: 1, price: 22.0 }
    ]
  },
  {
    _id: 1003,
    customer: { name: "Mai", city: "Hanoi" },
    status: "paid",
    items: [
      { sku: "BK-01", title: "Python Basics", qty: 1, price: 12.5 }
    ],
    coupon: "WELCOME10"
  }
]);

db.orders.find({ status: "paid" });

db.orders.find({ "customer.city": "Hanoi" });

db.orders.find({ "items.sku": "BK-01" });

db.orders.find({
  status: "paid",
  coupon: { $exists: true }
});

db.orders.find({
  "items.price": { $gt: 20 }
});

db.orders.find(
  { status: { $in: ["paid", "shipped"] } },
  { _id: 1, status: 1 }
).sort({ _id: -1 }).limit(2);

db.orders.updateOne(
  { _id: 1001 },
  { $set: { status: "shipped" } }
);

db.orders.updateMany(
  { status: "paid" },
  { $set: { reviewed: false } }
);

db.orders.updateOne(
  { _id: 1002 },
  { $push: { tags: "gift" } }
);

db.orders.updateOne(
  { _id: 1003 },
  { $unset: { coupon: "" } }
);

db.orders.deleteOne({ _id: 1003 });

db.orders.aggregate([
  { $match: { status: { $in: ["paid", "shipped"] } } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.sku",
      units: { $sum: "$items.qty" },
      revenue: {
        $sum: { $multiply: ["$items.qty", "$items.price"] }
      }
    }
  },
  { $sort: { revenue: -1 } },
  { $limit: 5 }
]);

db.orders.createIndex({
  "customer.city": 1,
  status: 1
});

db.orders.find({
  "customer.city": "Hanoi",
  status: "paid"
}).explain("executionStats");