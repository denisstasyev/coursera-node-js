# Assignment Overview

At the end of this assignment, you should have completed the following tasks to update the server:

- Created a Node module using Express router to support the routes for the dishes REST API.
- Created a Node module using Express router to support the routes for the promotions REST API.
- Created a Node module using Express router to support the routes for the leaders REST API.

## Assignment Requirements

The REST API for our Angular and Ionic/Cordova application that we built in the previous courses requires us to support the following REST API end points:

1. http://localhost:3000/dishes/:dishId
2. http://localhost:3000/promotions and http://localhost:3000/promotions/:promoId
3. http://localhost:3000/leaders and http://localhost:3000/leaders/:leaderId

We need to support GET, PUT, POST and DELETE operations on each of the endpoints mentioned above, including supporting the use of route parameters to identify a specific promotion and leader. We have already constructed the REST API for the dishes route in the previous exercise.

This assignment requires you to complete the following three tasks. Detailed instructions for each task are given below.

## Task 1

In this task you will create a separate Node module implementing an Express router to support the REST API for the dishes. You can reuse all the code that you implemented in the previous exercise. To do this, you need to complete the following:

- Update the Node module named dishRouter.js to implements the Express router for the /dishes/:dishId REST API end point.

## Task 2

In this task you will create a separate Node module implementing an Express router to support the REST API for the promotions. To do this, you need to complete the following:

- Create a Node module named promoRouter.js that implements the Express router for the /promotions and /promotions/:promoId REST API end points.
- Require the Node module you create above within your Express application and mount it on the /promotions route.

## Task 3

In this task you will create a separate Node module implementing an Express router to support the REST API for the leaders. To do this, you need to complete the following:

- Create a Node module named leaderRouter.js that implements the Express router for the /leaders and /leaders/:leaderId REST API end points.
- Require the Node module you create above within your Express application and mount it on the /leaders route.
