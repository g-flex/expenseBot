# expenseBot
Open source node-red Telegram expense bot

## expenseBot
##### Open source node-red Telegram expense bot
###### This is a scholastic project. The purpose is to list expenses on-the-go with telegram messages. Required: mySQL database, node-red.
To learn how I set up my server environment, you can head at [this guide](https://github.com/g-flex/linux-ami-setup) (cost: almost free, time: 20mins).
***


### Node-red
Plugins: [node-red-contrib-telegrambot](https://flows.nodered.org/node/node-red-contrib-telegrambot), [node-red-node-mysql](https://flows.nodered.org/node/node-red-node-mysql).
This is what the flow looks like:
![Expense Bot flow](/screens/all%20flow.png)

There is an upper part where I put the endpoints (same as an API), and a lower part where i put user messages parsing.

An endpoint looks like this one:
![Expense Bot endpoint](/screens/specific%20endpoint.png)

I collect data from it and execute database queries with the function for mySQL node:
![Expense Bot sql](/screens/specific%20query.png)
 Response is a json object.
 
