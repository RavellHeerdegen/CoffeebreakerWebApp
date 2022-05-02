# CoffeeBreaker

For lecture Web Application Architecture

Installation steps required

I.) Check out latest sourcecode from https://gitlab.mi.hdm-stuttgart.de/am206/coffeebreaker

II.) Quick Start
	To quickly get the project up and running do the following:
	1.)Start with Database migration stated in V.
	2.)Execute the setup.bat
	3.)Execute the backend.bat and the frontend.bat to start the backend and the frontend servers

III.) Backend

    1.) Install NodeJS LTS Latest (10.16.3)
    2.) npm install -g nodemon
    3.) Navigate to "coffeebreaker/backend" and run "npm install"
    4.) Start the backend with "npm start"

IV.) Frontend

    1.) Install Angular: npm install -g @angular/cli
    2.) Navigate to "coffeebreaker/frontend" and run "npm install"
    3.) Start the frontend with "ng serve -o"

V.) Migrations

    1.) Create a new database with the name "coffeebreaker" in phpmyadmin (use xampp and then go to [phpmyadmin](http://localhost/phpmyadmin))
    2.) npm install in all backend services
    3.) run the following in the command line first in the user-service, then in the coffeebreak-service and in the end in the messageboard-service (order is important)
        3.1) npx sequelize-cli db:migrate
        3.2) npx sequelize-cli db:seed:all
        
VI.) Git Submodules

    1.) git submodule update --init
    2.) git submodule update --recursive --remote
	

VII.) (temporary) Migration for profile picture functionality

    1.) Execute setup.bat and fetch git submodules
    2.) In the browser go to localhost/phpmyadmin
    3.) Delete the coffeebreaker database (e.g. by SQL script "DROP DATABASE coffeebreaker")
    4.) Re-create and seed the database with all steps as shown in Installation step V.) Migrations
    5.) After seeding, click on the coffeebreaker database in phpmyadmin left sidebar
    6.) In the table overview click on the tab "Structure" of the table "users"
    7.) Click on "Edit" at the column profilePicture
    8.) Change the Type field to MEDIUMBLOB
	
