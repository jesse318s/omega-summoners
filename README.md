## _**PLEASE READ THIS TO COMPLETION BEFORE ASKING ANY QUESTIONS!**_

### _**IMPORTANT NOTES**_ - 
This project does not have a mongoDB connection setup.
- local development: create a .env file (make sure to name it .env), which exports your MONGO_URL connection. This file will be ignored by git so your db credentials will be kept safe when the app is deployed.


## Getting Started
This repository aims to assist you in beginning work on a MERN stack application for heroku deployment with a solid file structure as a foundation.

Since this project will hold both the client application and the server application there will be node modules in two different places. First run `npm install` from the root. After this you will run `npm run-script install-all` from the root. From now on run this command anytime you want to install all modules again. This is a script we have defined in package.json. Alternatively your group may choose to simplify this process by using yarn workspaces as specified [here](https://yarnpkg.com/lang/en/docs/workspaces/).

For more information on deploying to heroku reference the extra resources at the bottom of this file.


### `yarn workspace server build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

If deploying to heroku this does not need to be run since it is handled by the heroku-postbuild script<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## File structure
#### `client` - Holds the client application
- #### `public` - This holds all of our static files aside from some assets
- #### `src`
    - #### `assets` - This holds our static assets that aren't stored in the public file
    - #### `components` - This holds our components that aren't pages
    - #### `constants` - This holds our constant objects that are used in our components
    - #### `pages` - This holds our components that are routed to as pages
    - #### `services` - Holds all of our services
    - #### `App.jsx` - This is what renders the primary MERN app, should not change
    - #### `index.js` - This is what renders all of our browser routes
- #### `package.json` - Defines npm behaviors and packages for the client
- #### `package-lock.json` - Generated from above package.json
- #### `README` - Getting Started with Create React App
#### `server` - Holds the server application
- #### `.env` - This holds our configuration files, like mongoDB uri
- #### `models` - This holds all of our data models
- #### `routes` - This holds all of our HTTP to URL path associations for each unique url
- #### `index.js` - Defines npm behaviors and packages for the client
- #### `package.json` - Defines npm behaviors like the scripts
- #### `package-lock.json` - Generated from above package.json
#### `.gitignore` - Tells git which files to ignore
#### `README` - This file!

## Learn More
To learn how to setup a local MongoDB instance for testing, check out how to [connect to MongoDB](https://docs.mongodb.com/guides/server/drivers/).

To learn how to deploy a full-stack web app to heroku, check out [this great guide](https://daveceddia.com/deploy-react-express-app-heroku/).
