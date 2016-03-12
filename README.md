# get-started-with-redux-lesson27

### What is in this repo? 
This is based on the lessons from https://egghead.io/series/getting-started-with-redux, lesson 27,
so one can look at how the running code looks like. It will get more complicated with subsequent 
lessons

### Motivation 

I was finding it a bit hard to remember every single detail of each decision Dan was taking 
as he walks through the tutorials, which by the way are brilliant. 

So after much trial and error, I realized I have to master these tutorials by 
writing the code the way it is being explained. 

I wanted to put document step by step how the code evolved to get more comfortable with thinking in Redux.

So I decided to just follow the videos and create working versions of the entire code from Dan's lessons,
but backtracked from the 17th lesson onwards. 


## Quickstart

```
npm install
npm start 
```

### Whats the goal of this lesson? 

This lesson is brilliant because it ties back to simplify everything. 
* To summarize: 
* I earlier lessons, we first started separating out the presentational components from the container components. 
* This allowed us to separat the behavior from the presentation 
* But in doing so, we created more levels of components
* Hence, we started passing down the store as props through each layer 
 and some intermediate layers which didn't even need to know about the props were having to accept
 and passdown the store as props. 
 * To circumvent this, we started using contexts, and then finally Providers which allowed us to 
 specify what contexts the child level components expected without having to pass through as props 
 through multiple levels of components. 
 * However, we realized a common pattern in that many of the components which were passing down 
 state and dispatchers as props needed were doing similar things. Getting the state/store from the 
 context when they mount, removing it when they unmount and specifying the contexts they wanted to receive. 
 Also contexts themselves are not highly recommended as discussed in the previous lessons. 
 * Hence, finally, we use the connect method from react-redux that takes care of all the things, 
 and we just need to create the map of the state and dispatchers that we need to pass as props to lower 
 level components and connect them to the right component. This reduces a lot of boiler plate and also 
 reduces the chance of error. 


### Different versions of the index.js files 

In this repo, you will find a reference to the index.js file from the previous lesson so you can 
easily diff it to see how the code is changing, in case you want to come back to it.


### Comments in the code.

Have also added some comments of my own observations about the coding style as well as based on the 
lecture videos. 
