cd frontend
call npm install
cd ..
cd backend
call npm install
cd auth-service
call npm install
cd ..
cd coffeebreak-service
call npm install
cd ..
cd messageboard-service
call npm install
cd ..
cd user-service
call npm install
cd ..
cd news-service
call pip install -r requirements.txt
REM call git submodule update --init
REM call git submodule update --recursive --remote
echo "Setup completed"
pause