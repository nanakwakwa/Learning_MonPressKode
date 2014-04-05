Node + Express + Mongodb Example App
======

This is a basic node and express app that does 2 things:
1.  On start up connects with mongodb and stores an entry into the 'scores' collection.
2.  Responds to a post request at the route '/submitScore' and saves that data in the mongo database.

To run the app locally, first boot up your mongodb database using the "mongod" command in your terminal. Then run the app calling "node app.js" in the main app directory.