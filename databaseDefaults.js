// JSON database

module.exports.initDefaults = () => {

    let low = require('lowdb')
    let FileSync = require('lowdb/adapters/FileSync')

    let databaseFile = new FileSync('db.json')
    let database = low(databaseFile)

    database.defaults(
        {
            greeting:'Hey {}! Welcome to SomeCompany. I am Sensei. I am here to help you survive through the day. Start by typing: \"*I am ready Sensei*\"',
            triggerWord: "I am ready Sensei",
            pendingTasksMessage: "Some tasks to get you started",
            unknownQueston:'Sorry I do not know the answer to this question. Here are the list of questions you can ask me:',
            roles:[
                {
                    id:1, 
                    name:'developer'
                },
                {
                    id:2, 
                    name:'qa'
                }
            ],
            tasks:[
                {
                    roleId:1, 
                    tasks: [
                        {
                            id: 1,
                            task:'Setup PC: https://url.to.instructions.com'
                        },
                        {
                            id: 2,
                            task:'Familiarise with Coding Standards: https://url.to.instructions.com' 
                        }
                    ]
                },
                {
                    roleId:2, 
                    tasks: [
                        {
                            id: 1,
                            task:'Setup MTM: https://url.to.instructions.com'
                        },
                        {
                            id: 2,
                            task:'Setup NPM: https://url.to.instructions.com'
                        }
                        
                    ]
                }
            ],
            questions: [
                {
                    q:'How do I use Git?', 
                    a:'This will help: https://url.to.instructions.com'
                },
                {
                    q:'How do I trigger a new build?', 
                    a:'This will help: https://url.to.instructions.com'
                },
                {
                    q:'Where do I find a new build?',
                    a:'Builds can be found on : https://url.to.instructions.com'
                }
            ],
            userToRole: [
                {
                    userId: "slack.username",
                    roleId: 1
                }
            ],
            tasksDoneByUser:[
            ],
        }
    ).write()
}