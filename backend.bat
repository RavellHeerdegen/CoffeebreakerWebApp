cd backend
start "" nodemon server.js
cd auth-service
start "" nodemon index.js
cd ..
cd user-service
start "" nodemon index.js
cd ..
cd coffeebreak-service
start "" nodemon index.js
cd ..
cd messageboard-service
start "" nodemon index.js
cd ..
cd news-service
call python app.py