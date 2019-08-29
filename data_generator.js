/*
 * NOTE: This file generates fake tweet data, and is not intended to be part of your implementation.
 * You can safely leave this file untouched, and confine your changes to index.html.
 */

// set up data structures
const streams = {
  home: [],
  users: {
    shawndrost: [],
    sharksforcheap: [],
    mracus: [],
    douglascalhoun: [],
  },
};
const users = Object.keys(streams.users);

// utility function for adding tweets to our data structures
const addTweet = (newTweet) => {
  const username = newTweet.user;
  streams.users[username].push(newTweet);
  streams.home.push(newTweet);
};

// utility function
const randomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// random tweet generator
const opening = ['just', '', '', '', '', 'ask me how i', 'completely', 'nearly', 'productively', 'efficiently', 'last night i', 'the president', 'that wizard', 'a ninja', 'a seedy old man'];
const verbs = ['downloaded', 'interfaced', 'deployed', 'developed', 'built', 'invented', 'experienced', 'navigated', 'aided', 'enjoyed', 'engineered', 'installed', 'debugged', 'delegated', 'automated', 'formulated', 'systematized', 'overhauled', 'computed'];
const objects = ['my', 'your', 'the', 'a', 'my', 'an entire', 'this', 'that', 'the', 'the big', 'a new form of'];
const nouns = ['cat', 'koolaid', 'system', 'city', 'worm', 'cloud', 'potato', 'money', 'way of life', 'belief system', 'security system', 'bad decision', 'future', 'life', 'pony', 'mind'];
const tags = ['#techlife', '#burningman', '#sf', 'but only i know how', 'for real', '#sxsw', '#ballin', '#omg', '#yolo', '#magic', '', '', '', ''];

const randomMessage = () => {
  return [
    randomElement(opening),
    randomElement(verbs),
    randomElement(objects),
    randomElement(nouns),
    randomElement(tags),
  ].join(' ');
};

// generate random tweets on a random schedule
const generateRandomTweet = () => {
  const tweet = {
    user: randomElement(users),
    message: randomMessage(),
    created_at: new Date(),
  };
  addTweet(tweet);
};

for (let i = 0; i < 8; i++) {
  generateRandomTweet();
}

const scheduleNextTweet = () => {
  generateRandomTweet();
  setTimeout(scheduleNextTweet, Math.random() * 10000);
};
scheduleNextTweet();

// utility function for letting students add "write a tweet" functionality
// (note: not used by the rest of this file.)
const writeTweet = (message) => {
  const visitor = window.visitor;

  if (!visitor) {
    throw new Error('set the global visitor property!');
  }

  const tweet = {
    user: visitor,
    message: message,
  };
  addTweet(tweet);
};

window.streams = streams;
window.users = users;
window.writeTweet = writeTweet;
