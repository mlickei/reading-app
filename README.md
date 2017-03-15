# Reading App
Allows you to track book reading progress and reading speed over time.

## How to run
1. Run `gradle build` to make sure depencies are compiled and project is setup correctly.
2. Run `gradle clean` to clean out the /build/ directory.
3. Run `gradle appStartWar` to run app on localhost:8080/reading-app/

## How to stop
1. Run `gradle appStop`

_Note: if running `gradle` does not work, try using an IDE like intellij or using `./gradlew` instead._

Example: `./gradlew appStartWar`

## Development Info
In order to run the actual app, all you need is a MySQL DB with a user dedicated. Insert the username and password to dev config file. (TODO: Add this config file) Then run the initialize.sql file along with any other data-conversions you're missing.

In order get the styles for the pages, you'll need to have NodeJS installed. Once installed, run the following to get going:
1. `npm install -g bower`
2. `npm install --global gulp`
3. `npm install --save-dev gulp`
4. `npm install --save-dev gulp-bower`

This will get you to the point that you can now download the node dependencies and run the gulp tasks. Before running tasks firs the first time, make sure to do `npm install` to download the latest dependencies.

To run all default tasks do `gulp`, to run a specific task to `gulp {task-name}`