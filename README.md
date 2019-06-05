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

An **endpoint** looks like this one: ![Expense Bot endpoint](/screens/specific%20endpoint.png)

I collect *:params* from it and execute database queries with the function for mySQL node:
![Expense Bot sql](/screens/specific%20query.png)
 Response is a json object.
 

***


**Messages** in the lower parts are so divided:

**Normal messages**, set as *user msg*, which come without initial slash, 

and **commands**, which come with initial slash (ex. */help*).

I chose to set as /commands all the settings inputs, and normal messages for bot interactions.

*user msg* parsing function is this huge group of *if clauses* intended to detect what is the intent of the user.
It appears like this:

```
if (msg.originalMessage.entities && msg.originalMessage.entities[0].type=='bot_command'){
	//let chatId = msg.payload.chatId;
	//msg.payload.content = 'this is a command';
	//msg.payload.chatId = chatId;
	//return [null, msg];
} else {
	if(!msg.originalMessage.reply_to_message){
		let mexId=msg.payload.messageId;
		let chatId=msg.payload.chatId;
		let str = msg.payload.content;
		str = str.replace(/(^\s*)|(\s*$)/gi,"");
		str = str.replace(/[ ]{2,}/gi," "); 
		str = str.replace(/\n /,"\n");
		let subStr = str.split(' ');
		let strLength = subStr.length;
		msg.payload = {};
		//msg.payload.chatId = 539915525;
		msg.payload.type = 'message';
		if (strLength > 0 && strLength < 4 && (!isNaN(subStr[0]) || str.charAt(0)=='+')){
			if(str.charAt(0)=='+' && str != '+' && !isNaN(subStr[0]) || !isNaN(subStr[1])){
				if (strLength == 1){
					msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+(-str)+", 'No name', "+mexId+", @user_id);";
					//msg.payload.content = 'Income no name €'+(-str);
				} else if(strLength == 2){
					if(subStr[0]!='+'){
						msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+(-subStr[0])+", '"+subStr[1]+"', "+mexId+", @user_id)";
						//msg.payload.content = 'Income '+subStr[1]+' €'+(-subStr[0]);
					} else {
						msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+(-subStr[1])+", 'No name', "+mexId+", @user_id)";
					}
				} else if(strLength == 3){
					if(subStr[0]!='+'){
						msg.payload.content = '\u274C INPUT ERROR';
						msg.payload.chatId = chatId;
						return [null, msg];
					} else {
						msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+(-subStr[1])+", '"+subStr[2]+"', "+mexId+", @user_id)";
						//msg.payload.content = 'Income '+subStr[2]+' €'+(-subStr[1]);
					}
				}
				return [msg, null];
			} else if(!isNaN(subStr[0]) && strLength < 3 && str.charAt(0)!='+'){
				//msg.payload.content = 'Expense: '+subStr[0]+' eur';
				if (strLength == 1){
					msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+subStr[0]+", 'No name', "+mexId+", @user_id)";
				} else {
					msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES ("+subStr[0]+", '"+subStr[1]+"', "+mexId+", @user_id)";
				}
				return [msg, null];
			} else {
				msg.payload.content = '\u274C WRONG INPUT';
				msg.payload.chatId = chatId;
				return [null, msg];
			}
		} else if(strLength==1 && (subStr[0]=='del'||subStr[0]=='Del'||subStr[0]=='delete'||subStr[0]=='Delete')){
			msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); DELETE FROM expenses WHERE user_id = @user_id order by exp_id desc limit 1;";
			return [msg, null];
		} else {
			msg.payload.content = '\u274C WRONG INPUT';
			msg.payload.chatId = chatId;
			return [null,  msg];
		}
	} else {
		if(msg.payload.content=='del'||msg.payload.content=='Del'||msg.payload.content=='delete'||msg.payload.content=='Delete'){
			let chatId = msg.payload.chatId;
			msg.topic = "SET @user_id = (SELECT user_id FROM users WHERE chat_id = "+chatId+" ); DELETE FROM expenses WHERE mess_id="+msg.originalMessage.reply_to_message.message_id+" AND user_id = @user_id limit 1;";
			return[msg, null];
		} else {
			msg.payload.content = '\u274C WRONG INPUT';
			msg.payload.chatId = chatId;
			return [null, msg];
		}
	}
}
```

Each case is handled separately and can lead either to a quick bot response or to a database query and finally to a bot response. Entities like ```\u274C``` are emojis.

Each command leads to a database query and a response.

***


### Database
The database has this simple structure: 
![Expense Bot structure](/screens/database.png)


***


### Telegram
Commands are the following: ![Expense Bot commands](/screens/commands.png)


This is an example of adding an expense: ![Expense Bot add](/screens/add%20expense.png)

The bot always replies with *success* or *error* .


***


### Web App
Is intended to display in an intuitive way all your expenses.


This is an example of expense on the web app: ![Expense Bot webapp](/screens/web%20app.png)

User can edit the field by clicking, editing and pressing enter.
