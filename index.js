const Slackbot = require("slackbots");
const dbDefaults = require("./databaseDefaults");
const format = require("string-format");
require('dotenv').config()
var _ = require("lodash");

dbDefaults.initDefaults();

let low = require("lowdb");
let FileSync = require("lowdb/adapters/FileSync");
let db = low(new FileSync("db.json"));

let params = {
    icon_emoji: ":senseiemoji:"
};

let users = [];

const bot = new Slackbot({
    token: process.env.BOT_TOKEN,
    name: process.env.BOT_NAME
});

bot.on("start", () => {
    //bot.postMessageToChannel('heckathon', 'Sensei is listening for new comers!', params)

    let checkusers = () => {
        bot.getUsers().then(data => {
            users = data;
            greet(users);
        });
    };
    checkusers();
    setInterval(checkusers, 10000);
});

bot.on("message", data => {
    if (data.type === "message") {
        handleMessage(data);
    } else if (data.type === "reaction_added") {
        handleReactionAdded(data);
    }
});

function greet(users) {
    let greetedBefore = db
        .get("tasksDoneByUser")
        .map("name")
        .value();

    let allUsers = _.map(users.members, item => {
        return item.name;
    });

    let toNotify = _.difference(allUsers, greetedBefore);
    let greeting = db.get("greeting").value();

    _.forEach(toNotify, value => {
        let personalGreeting = format(greeting, value);
        bot.postMessageToUser(value, personalGreeting, params);

        db.get("tasksDoneByUser")
            .push({
                name: value,
                tasksDone: []
            })
            .write();
    });
}

function handleReactionAdded(data) {
    let doneReactions = ["+1"];
}

function handleMessage(data) {
    let who = _.find(users.members, user => {
        if (user.id === data.user) {
            return true;
        }
    });

    if (data.text.includes(db.get("triggerWord").value())) {
        nextStep(who);
    } else {
        bot.postMessageToUser(who.name, db.get("unknownQueston").value(), params);
    }
}

function getTasks(who) {
    let tasksDone = db
        .get("tasksDoneByUser")
        .find({
            name: who.name
        })
        .value();

    let role = db
        .get("userToRole")
        .find({
            userId: who.name
        })
        .value();

    let tasksForRole = db
        .get("tasks")
        .find({
            roleId: role.roleId
        })
        .value();

    let toDo = tasksForRole.tasks.filter(task => {
        return !tasksDone.tasksDone.includes(task.id);
    });

    return toDo;
}

function nextStep(who) {
    let pendingTasks = getTasks(who);

    if (pendingTasks.length > 0) {
        bot.postMessageToUser(
            who.name,
            db.get("pendingTasksMessage").value(),
            params
        );
        pendingTasks.forEach(task => {
            bot.postMessageToUser(who.name, format("[{id}] {task}", task), params);
        });
    }
}