# District Milestone Tracker

This is a package to track YouTube View Milestones (some assembly required)! There are several steps in order to get this application up and running, but once it's set up, you will not need to touch it again. Hope you find it useful! :)

Running this application **is free** because the amount of resources you will use will be covered under their free tiers, however, you will need to enter payment information. I'll explain this later.

## Download The Project
---

To download, click the green "Clone or Download" button, and then click the "Download Zip"

Unzip this package in your desired location. For example, you could place this package in `/Documents/district-milestone-tracker`

## Environment Setup
---

Install the latest version of Node to your computer: https://nodejs.org/en/ (click the left box "Recommended For Most Users")

Download Visual Studio Code (it's a free code editor): https://code.visualstudio.com/

Now that you have Visual Studio installed, lets open the project. 

- Open Visual Studio
- There should be a button to click called "Open Folder..."
- This will open file explorer, now find the folder where you installed District Milestone Tracker. For me it was `/Documents/district-milestone-tracker`
- VS Code has a terminal/command prompt built in to the app. Click `CTRL + ~` (the tilde next to the 1 on your keyboard). This should open a terminal window at the bottom at the root directory of your project

In order to deploy your project, you will need to install 2 command line tools:

- **Ionic** (this is the framework the project is built off of)
- **Firebase** (this will be used to deploy your project to the web)

### Setup Ionic
---

In the command prompt/terminal we opened using `CTRL + ~` in VS Code type the following line, then hit ENTER:

`sudo npm install -g ionic`

When you hit enter, it will ask for your computer's system password and then install the tool. 

Documented here: https://ionicframework.com/getting-started 

#### What are these commands?

When you run `sudo npm install -g ionic`

- `sudo` = gives you super user permissions to install packages to your computer
- `npm` = node package manager. It can be thought of as a library of a whole bunch of packages/tools, it just so happens that the package we're interested in here is called `ionic`
- `-g` = this is called a "flag" and -g means GLOBAL.

So in short, we're globally installing a package called `ionic` to your computer. Which now means we can run commands like `ionic build` which will build an ionic project. (We'll use that command later).

## Setup Firebase
---

Let's do the same thing, but this time for firebase, this should look familiar!

`sudo npm install -g firebase-tools`

Documented here: https://firebase.google.com/docs/cli

## Install Project Dependencies
---

Lets also install the required project dependencies:

- Type "`cd src`" in to your terminal and hit ENTER. This "changes our directory" to the `src` folder.
- If you type "`ls`" and ENTER, you can see all the files in this directory location (it should look similar to what you see in the sidebar). Do you see a `package.json` file? This is where references to packages you need to install are placed.
- To install these packages, type: "`npm install`" and ENTER.

We have to do this in another folder as well:

- Since you are in your `src` folder, we need to go "back up" a folder level, type: "`cd ..`" and ENTER. 
- We need to enter in to the `functions` folder so type: "`cd functions`" and ENTER
- You can type "`ls`" and ENTER and see that there's another `package.json` here! So run: "`npm install`" again.

## Google Firebase Configuration
---

Go to: https://firebase.google.com/

- Sign in with your Google Account (Does not have to be your YouTube account)
- Click "Go To Console", in the top right corner next to your profile picture
- Click the "Add Project" in the center of your screen. 
- Type a name for the project, I chose "YouTube Milestone Tracker"
- The next screen will ask if you want to set up Analytics, click "Not Right Now" and "Create"
- There will be a "Settings Icon" next to the title called "Project Overview" near the top left of the page, click the settings icon and click "Project Settings". 
- Scroll down to "Your Apps" at the bottom of the page, look in this section for a header called "Firebase SDK snippet". Click the radio button and select the "Config" option. You should see some text change beneath where you clicked, which should look like this:

```
firebaseConfig: {
    apiKey: "<INSERT API KEY HERE>",
    authDomain: "<INSERT AUTH DOMAIN HERE>",
    databaseURL: "<INSERT DB URL HERE>",
    projectId: "<INSERT PROJECT ID HERE>",
    storageBucket: "<INSERT STORAGE BUCKET HERE>",
    messagingSenderId: "<ENTER MESSAGING SENDER ID HERE>",
    appId: "<ENTER APP ID HERE>"
}
```

Copy this to your clipboard.

- Go back to your VS Code window. On the left hand side of your window, you should see a file structure. We need to find the `environments` folder. Which is found in `src/environments`.
- There are two files called `environment.ts` & `environment.prod.ts`. 
- Paste the object that you copied to your clipboard here **in both locations** (you should see my placeholder).

## Initialize Firebase in VS Code
---

Back in VS Code...

- Make sure you are in the root directory of the project in the VS Code terminal window. Remember you can use "`cd ..`" to go "up" a directory level. We need to be at the level where you see folders like: functions, src, and e2e when you type "`ls`"
- Now type: `firebase login`.
- This will open a webpage, make sure to login using **the same exact** account that you used to create your Firebase project.
- Next type: `firebase init`. This will ask you which features we want to set up. We need: **Functions & Hosting**. Select each option with the spacebar, and use the down arrow to traverse the list. Then enter.
- It'll ask which language to use for Cloud Functions, select "Typescript"
- Do you want to use TSLint? Type "`Y`" and click enter
- What you want to use as your public directory? Type "`www`" and enter
- Configure as a single-page app (rewrite all urls to /index.html)? Type "`y`" and enter
- "File www/index.html already exists. Overwrite?" Enter "No".

## Setup Email Service (SendGrid)
---

- Create a SendGrid account: https://sendgrid.com/
- Once logged in, click the settings tab on the left-hand sidebar. There should be a dropdown option for "API Keys". Click that.
- Click "Create API Key" -> Select "Full Access"
- This will generate an API code, copy this!! Once you close this page, you can never see this code again, so copy it to a notepad app for now.

## Google Cloud Configuration
---

Go to: https://cloud.google.com/

- Sign in with your Google Account (The same one you used to create your Firebase account)
- At the top, to the right of the title "Google Cloud Platform", there should be a dropdown, click that, and select "New Project" in the top right-hand corner of the popup. Call this whatever you want, I called mine, `YouTube Milestone Tracker`.
- You should now be on your project's "Dashboard" Page.
- In the top left corner of the page there should be an icon you can click on to open the side menu. Click on that, and find the menu option called: "APIs & Services"

#### Get Google API Key

- Do you see a "Browser Key Auto Generated By Firebase" under the API Keys header? Perfect, copy the key to your notepad and label it "google apiKey" (make sure you select the Browser Key and not the Server Key).

#### Get Google API Key

- Do you see a "Web client (auto created by Google Service)" under the OAuth 2.0 Client ID header? Copy the key to your notepad and label it "google client Id"

## Set the Google Client Id and API Key in VS Code
---

Hop back to VS Code. In the left hand sidebar, traverse the file stucture. We need to open a file called `auth.service.ts`. It can be found here: `~/src/app/services/auth.service.ts`. Open this file and look for the code on line 64:

```
gapi.client.init({
    apiKey: '<INSERT API KEY HERE>',
    clientId: '<INSERT CLIENT ID HERE>',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly'
})
```

Copy the `API Key` and `Client Id` from your notepad here and save the file "`ctrl/cmd + s`"

## Add Firebase Environment Variable
---

Hop back over to your VS Code terminal...

We need to install a couple environment variables (Google API and SendGrid API)

To do this type:

`firebase functions:config:set google.key="THE GOOGLE API KEY" sendgrid.key="THE SENDGRID API KEY"`

You can check to make sure they were set properly by typing:

`firebase functions:config:get`

You should see something like:

```
{
  "google": {
    "key": "YOUR KEY"
  },
  "sendgrid": {
    "key": "YOUR KEY"
  }
}
```

## Build & Deploy Your Project!
---

Go to your VS Code terminal and get back to your root project directory.

Then run:

`ionic build --prod`

This may take a minute or two as your project is compiled, then to deploy:

`firebase deploy`

Nice! Once this is done, take note of the URL that is shown in the terminal (something like: https://district-milestone-tracker-98869.firebaseapp.com). Copy this url to your clipboard.

## Whitelist URLs for Google Authentication
---

- Go Back to your project page on Google Cloud, where you copied your api keys: https://console.cloud.google.com/apis/credentials
- Click on "Web client (auto created by Google Service)" underneath OAuth 2.0 Client IDs.
- There will be a section for "Authorized Javascript Origins", paste your website url and hit enter. Then click save at the bottom of the page.
- Go back
- On the side bar, there's an "OAuth Consent Screen" option in the menu. Click that.
- Under "Application Name", call it what you want, I called mine `YouTube Milestone Tracker`
- Under " Scopes for Google APIs", click "Add Scope"
- Type "YouTube Data API V3" in to the filter input at the top and hit enter.
- We need to select two options (they both have a lock next to them): ../auth/youtube and ../auth/youtube.readonly. Then click the add button at the bottom.
- Under "Authorized Domains" add your URL: `district-milestone-tracker-98869.firebaseapp.com`
- Under "Application Home Page Link" add your URL: `https://district-milestone-tracker-98869.firebaseapp.com`
- Under "Application Privacy Policy Link" add your URL with the privacy policy (I created one for you already!): `https://district-milestone-tracker-98869.firebaseapp.com/privacy-policy`
- Click Save

## Log in to your site!
---

- Visit your URL, such as: https://district-milestone-tracker-98869.firebaseapp.com
- You should be presented with a simple YouTube log in page, click Sign In With YouTube and **LOG IN WITH YOUR YOUTUBE ACCOUNT <- IMPORTANT!!**
- After a successful login, you should be routed to a dashboard page.
- Enter an email address you'd like to use to receive email notifications
- Enter view counts you would like to be notified for (do not add commas). For example if you would like notifs for 500k and 1M, type in 500000 (hit enter) then 1000000 and enter again. 
- Click update!

## Set up the Cron Job

- Go to: https://cron-job.org/en/ and register for a free account.
- Go to your Firebase Project dashboard, and select Functions from the Projects sidebar. 
- Since we've deployed our project, there should be a function called "MilestoneTrackerV2" displayed on this page. Copy the URL that is displayed. It should look something like this: https://us-central1-district-milestone-tracker-98869.cloudfunctions.net/milestoneTrackerV2
- Go back to cron-job.org and select the "CronJobs" tab at the top, then click "Create Cron Job"
- Give it a title, I called mine "YouTube Milestone Tracker"
- Paste the URL in to the next input.
- For schedule, select the radio button for "Every Day at:" I did mine for Every Day at 8am.
- Click Create CronJob at the bottom.

## Finishing Touches!

Firebase requires a payment method on file that allows you to trigger Firebase Functions from a URL (aka that url you entered in the cronjob site).

- Go to your project: https://console.firebase.google.com 
- On the lefthand side of your Firebase project (at the bottom), it should show which payment plan you're on (probably: Spark). Click "Modify" and select the "Blaze" plan. It's pay-as-you-go, but has a very generous free tier (you won't have to pay a dime for this project).

Lastly, I added a database validator to prevent random people from logging in to your URL and causing you to run milestone trackers for multiple people. 

In Firebase, click on the "Database" option on the lefthand sidebar. You should see a collection called "users", click that, then click on the randomly generated ID, you should now see details about your account like "displayName, email, and milestones", just above this information is a button to add a field. Click that. MAKE SURE THIS IS EXACTLY AS I SAY:

- Field name: approved
- type: boolean
- value: true

Then click add. 

And finally, that's it!

**The first day the cron job runs, it will index all of your videos to your database. The second day it will start looking for videos that have surpassed your milestones. So just be aware, that you will not receive an email notification on the first day**

Thanks for using the project, and I hope you learned a lot!




