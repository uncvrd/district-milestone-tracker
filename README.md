# District Milestone Tracker

This is a package to track YouTube View Milestones (some assembly required)! There are several steps in order to get this application up and running, but once it's set up, you will not need to touch it again. Hope you find it useful! :)

Running this application **is free** because the amount of resources you will use will be covered by their free tier, however, you will need to enter payment information. I'll explain this later.

## Environment Setup

Install the latest version of Node to your computer: https://nodejs.org/en/ (click the left box "Recommended For Most Users")

In order to deploy your project, you will need to install 2 packages to your command line:

- Ionic (this is the framework the project is built off of)
- Firebase (this will be used to deploy your project to the web)

#### Setup Ionic Commands

It's documented here: https://ionicframework.com/getting-started but, in short, all you have to do is open Terminal (on Mac) or Command Prompt (on Windows) and type the following line, then hit ENTER:

`sudo npm install -g ionic`

When you hit enter, it will ask for your computer's system password and then install some packages. 

###### What did we just do?

When you run `sudo npm install -g ionic`

- `sudo` = gives you super user permissions to install packages to your computer
- `npm` = node package manager. It can be thought of as a library of a whole bunch of packages, it just so happens that the package we're interested in here is called `ionic`
- `-g` = this is called a "flag" and -g means GLOBAL.

So in short, we're globally installing a package called `ionic` to your computer. Which means now we can run commands like `ionic build` which will build an ionic project. (We'll use that command later)

#### Setup Firebase Commands

It's documented here: https://firebase.google.com/docs/cli

Let's do the same thing, but this time for firebase, this should look familiar!

`sudo npm install -g firebase-tools`

###### Lets use this firebase package to log in to Firebase!

There are two services you will need to register for:

- Google Firebase (Firestore and Cloud Functions): https://firebase.google.com/
- Google Cloud: https://cloud.google.com/

## Google Firebase Configuration

- Sign in with your Google Account (Does not have to be your YouTube account)
- Once logged in, click "Go To Console", in the top right corner next to your profile picture
- Click the "Add Project" in the center of your screen. 
- Type a name for the project, I chose "YouTube Milestone Tracker"
- The next screen will ask if you want to set up Analytics, click "Not Right Now" and "Create"
- Once created, go to the project, this page should have a bar on the left with stuff like "Authentication, Database, and Storage" at the top of this side bar will be a "Settings Icon" next to the title "Project Overview", click the settings icon and click "Project Settings". 
- There will be a section called "Your Apps" at the bottom, look in this section for a header called "Firebase SDK snippet". Click the radio button to select the "Config" option. You should see some text change beneath where you clicked. This is called an "object". Copy this object. 


## Google Cloud Configuration

- Sign in with your Google Account (Does not have to be your YouTube account)
- You should be logged in to a dashboard page. At the top, to the right of the title "Google Cloud Platform", there should be a dropdown, click that, and select "New Project" in the top right-hand corner. Call this whatever you want, I called mine, "YouTube Milestone Tracker"
