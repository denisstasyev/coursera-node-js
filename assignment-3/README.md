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

_Useful command for this task: `db.users.update({username: "admin"}, {$set: {admin: true}})`_

At the end of this assignment, you would have completed the following:

- Check if a verified ordinary user also has Admin privileges
- Allow any one to perform GET operations
- Allow only an Admin to perform POST, PUT and DELETE operations
- Allow an Admin to be able to GET all the registered users' information from the database
- Allow a registered user to submit comments (already completed), update a submitted comment and delete a submitted comment. The user should be restricted to perform such operations only on his/her own comments. No user or even the Admin can edit or delete the comments submitted by other users

## Assignment Requirements

This assignment is divided into three tasks as detailed below:

## Task 1

In this task you will implement a new function named verifyAdmin() in authenticate.js file. This function will check an ordinary user to see if s/he has Admin privileges. In order to perform this check, note that all users have an additional field stored in their records named admin, that is a boolean flag, set to false by default. Furthermore, when the user's token is checked in verifyOrdinaryUser() function, it will load a new property named user to the request object. This will be available to you if the verifyAdmin() follows verifyUser() in the middleware order in Express. From this req object, you can obtain the admin flag of the user's information by using the following expression:

```
req.user.admin
```

You can use this to decide if the user is an administrator. The verifyAdmin() function will call next(); if the user is an Admin, otherwise it will return next(err); If an ordinary user performs this operation, you should return an error by calling next(err) with the status of 403, and a message "You are not authorized to perform this operation!".

Note: See the video on how to set up an Admin account

## Task 2

In this task you will update all the routes in the REST API to ensure that only the Admins can perform POST, PUT and DELETE operations. Update the code for all the routers to support this. These operations should be supported for the following end points:

- POST, PUT and DELETE operations on /dishes and /dishes/:dishId
- DELETE operation on /dishes/:dishId/comments
- POST, PUT and DELETE operations on /promotions and /promotions/:promoId
- POST, PUT and DELETE operations on /leaders and /leaders/:leaderId

## Task 3

In this task you will now activate the /users REST API end point. When an Admin sends a GET request to http://localhost:3000/users you will return the details of all the users. Ordinary users are forbidden from performing this operation.

## Task 4

In this task you will allow a registered user to update or delete his/her own comment. Recall that the comment already stores the author's ID. When a user performs a PUT or DELETE operation on the /dishes/:dishId/comments/:commentId REST API end point, you will check to ensure that the user performing the operation is the same as the user that submitted the comment. You will allow the operation to be performed only if the user's ID matches the id of the comment's author. Note that the User's ID is available from the req.user property of the req object. Also ObjectIDs behave like Strings, and hence when comparing two ObjectIDs, you should use the Id1.equals(id2) syntax.
