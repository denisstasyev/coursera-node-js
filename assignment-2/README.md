# Assignment Overview

> Requires installed Mongo DB with conFusion db
>
> 1. Install Mongo DB
> 2. Create mongodb/data folder
> 3. Run Mongo DB server: `mongod --dbpath=data --bind_ip 127.0.0.1`
> 4. Connect to server: `mongo`
> 5. Create conFusion db (inside mongo): `use conFusion`
>
> P.S. Usefull Mongo DB commands: `db`,`db.help()`, `db.dishes` (creates `dishes` collection), `db.dishes.insert({"name": "Testname", "description": "Description test"})` (insert document), `db.dishes.find()`, `db.dishes.find().pretty()`, `exit`

At the end of this assignment you would have completed the following three tasks:

- Implemented the Promotions schema and model
- Implement a REST API to support the /promotions endpoint, and the /promotions/:promoId endpoint enabling the interaction with the MongoDB database
- Implemented the Leaders schema and model
- Implement a REST API to support the /leaders endpoint, and the /leaders/:leaderId endpoint enabling the interaction with the MongoDB database

## Assignment Requirements

This assignment consists of the following two tasks:

## Task 1

You are given the following example of a promotion document. You will now create the Promotions schema and model to support the document:

```
{
  "name": "Weekend Grand Buffet",
  "image": "images/buffet.png",
  "label": "New",
  "price": "19.99",
  "description": "Featuring . . .",
  "featured": false
}
```

Note in particular that the label and price fields should be implemented the same way as you did for the Dishes schema and model. The Promotions schema and model should be defined in a file named promotions.js.

Next, extend the promoRouter.js to enable the interaction with the MongoDB database to fetch, insert, update and delete information.

## Task 2

You are given the following example of a leadership document. You will now create the Leaders schema and model to support the document:

```
{
  "name": "Peter Pan",
  "image": "images/alberto.png",
  "designation": "Chief Epicurious Officer",
  "abbr": "CEO",
  "description": "Our CEO, Peter, . . .",
  "featured": false
}
```

The Leaders schema and model should be defined in a file named leaders.js.

Next, extend the leaderRouter.js to enable the interaction with the MongoDB database to fetch, insert, update and delete information.
