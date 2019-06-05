[{"id":"ab26a8f8.3a0d48","type":"telegram sender","z":"87745034.1dce9","name":"bot response","bot":"f370b11a.d64ec","x":1135,"y":881,"wires":[[]]},{"id":"aac42a44.e19928","type":"function","z":"87745034.1dce9","name":"msg parsing fn","func":"if (msg.originalMessage.entities && msg.originalMessage.entities[0].type=='bot_command'){\n\t//let chatId = msg.payload.chatId;\n\t//msg.payload.content = 'this is a command';\n\t//msg.payload.chatId = chatId;\n\t//return [null, msg];\n} else {\n\tif(!msg.originalMessage.reply_to_message){\n\t\tlet mexId=msg.payload.messageId;\n\t\tlet chatId=msg.payload.chatId;\n\t\tlet str = msg.payload.content;\n\t\tstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\n\t\tstr = str.replace(/[ ]{2,}/gi,\" \"); \n\t\tstr = str.replace(/\\n /,\"\\n\");\n\t\tlet subStr = str.split(' ');\n\t\tlet strLength = subStr.length;\n\t\tmsg.payload = {};\n\t\t//msg.payload.chatId = 539915525;\n\t\tmsg.payload.type = 'message';\n\t\tif (strLength > 0 && strLength < 4 && (!isNaN(subStr[0]) || str.charAt(0)=='+')){\n\t\t\tif(str.charAt(0)=='+' && str != '+' && !isNaN(subStr[0]) || !isNaN(subStr[1])){\n\t\t\t\tif (strLength == 1){\n\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+(-str)+\", 'No name', \"+mexId+\", @user_id);\";\n\t\t\t\t\t//msg.payload.content = 'Income no name €'+(-str);\n\t\t\t\t} else if(strLength == 2){\n\t\t\t\t\tif(subStr[0]!='+'){\n\t\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+(-subStr[0])+\", '\"+subStr[1]+\"', \"+mexId+\", @user_id)\";\n\t\t\t\t\t\t//msg.payload.content = 'Income '+subStr[1]+' €'+(-subStr[0]);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+(-subStr[1])+\", 'No name', \"+mexId+\", @user_id)\";\n\t\t\t\t\t}\n\t\t\t\t} else if(strLength == 3){\n\t\t\t\t\tif(subStr[0]!='+'){\n\t\t\t\t\t\tmsg.payload.content = '\\u274C INPUT ERROR';\n\t\t\t\t\t\tmsg.payload.chatId = chatId;\n\t\t\t\t\t\treturn [null, msg];\n\t\t\t\t\t} else {\n\t\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+(-subStr[1])+\", '\"+subStr[2]+\"', \"+mexId+\", @user_id)\";\n\t\t\t\t\t\t//msg.payload.content = 'Income '+subStr[2]+' €'+(-subStr[1]);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\treturn [msg, null];\n\t\t\t} else if(!isNaN(subStr[0]) && strLength < 3 && str.charAt(0)!='+'){\n\t\t\t\t//msg.payload.content = 'Expense: '+subStr[0]+' eur';\n\t\t\t\tif (strLength == 1){\n\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+subStr[0]+\", 'No name', \"+mexId+\", @user_id)\";\n\t\t\t\t} else {\n\t\t\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); INSERT INTO expenses (exp_val, exp_tag, mess_id, user_id) VALUES (\"+subStr[0]+\", '\"+subStr[1]+\"', \"+mexId+\", @user_id)\";\n\t\t\t\t}\n\t\t\t\treturn [msg, null];\n\t\t\t} else {\n\t\t\t\tmsg.payload.content = '\\u274C WRONG INPUT';\n\t\t\t\tmsg.payload.chatId = chatId;\n\t\t\t\treturn [null, msg];\n\t\t\t}\n\t\t} else if(strLength==1 && (subStr[0]=='del'||subStr[0]=='Del'||subStr[0]=='delete'||subStr[0]=='Delete')){\n\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); DELETE FROM expenses WHERE user_id = @user_id order by exp_id desc limit 1;\";\n\t\t\treturn [msg, null];\n\t\t} else {\n\t\t\tmsg.payload.content = '\\u274C WRONG INPUT';\n\t\t\tmsg.payload.chatId = chatId;\n\t\t\treturn [null,  msg];\n\t\t}\n\t} else {\n\t\tif(msg.payload.content=='del'||msg.payload.content=='Del'||msg.payload.content=='delete'||msg.payload.content=='Delete'){\n\t\t\tlet chatId = msg.payload.chatId;\n\t\t\tmsg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE chat_id = \"+chatId+\" ); DELETE FROM expenses WHERE mess_id=\"+msg.originalMessage.reply_to_message.message_id+\" AND user_id = @user_id limit 1;\";\n\t\t\treturn[msg, null];\n\t\t} else {\n\t\t\tmsg.payload.content = '\\u274C WRONG INPUT';\n\t\t\tmsg.payload.chatId = chatId;\n\t\t\treturn [null, msg];\n\t\t}\n\t}\n}","outputs":2,"noerr":0,"x":525,"y":881,"wires":[["9a2a9237.5058a"],["ab26a8f8.3a0d48"]],"outputLabels":["valid","invalid"]},{"id":"29732a51.f9dd46","type":"http in","z":"87745034.1dce9","name":"view endpoint","url":"/view/:user_name","method":"get","upload":false,"swaggerDoc":"","x":235,"y":321,"wires":[["ea177188.d5287"]]},{"id":"73bd30a.11e9bd","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":321,"wires":[]},{"id":"ea177188.d5287","type":"function","z":"87745034.1dce9","name":"query fn","func":"msg.topic = \"SET @user_id = (SELECT user_id FROM users WHERE user_name = '\"+msg.req.params.user_name+\"' );SELECT * FROM expenses WHERE user_id = @user_id;\";\nreturn msg;","outputs":1,"noerr":0,"x":565,"y":321,"wires":[["d602bc76.86cdf"]]},{"id":"d602bc76.86cdf","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":321,"wires":[["73bd30a.11e9bd"]]},{"id":"fdf58383.c2ab","type":"function","z":"87745034.1dce9","name":"status message fn","func":"let chatId = msg.originalMessage.chat.id;\nif (msg.error){\n    msg.payload.content = '\\u274C Error occurred';\n} else if(msg.payload[1].affectedRows===0) {\n    msg.payload.content = '\\u274C Not found';\n} else {\n    msg.payload.content = '\\u2705 Success';\n}\nmsg.payload.chatId = chatId;\nmsg.payload.type = 'message';\nreturn msg;","outputs":1,"noerr":0,"x":915,"y":821,"wires":[["ab26a8f8.3a0d48"]]},{"id":"295fae06.27a8b2","type":"http in","z":"87745034.1dce9","name":"update param endpoint","url":"/update/:exp_id/:exp_val/:exp_tag/:exp_date","method":"get","upload":false,"swaggerDoc":"","x":265,"y":381,"wires":[["80b802d9.2afe7"]]},{"id":"df8fd016.6b9fc","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":381,"wires":[]},{"id":"33627f8c.3193","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":381,"wires":[["df8fd016.6b9fc"]]},{"id":"80b802d9.2afe7","type":"function","z":"87745034.1dce9","name":"update query params fn","func":"msg.topic=\"UPDATE expenses SET exp_val = \"+msg.req.params.exp_val+\", exp_tag = '\"+msg.req.params.exp_tag+\"', exp_date = '\"+msg.req.params.exp_date+\"' WHERE exp_id = \"+msg.req.params.exp_id+\";\";\nreturn msg;","outputs":1,"noerr":0,"x":515,"y":381,"wires":[["33627f8c.3193"]]},{"id":"f35f6281.172cd","type":"telegram command","z":"87745034.1dce9","name":"user msg","command":"Bb","bot":"f370b11a.d64ec","strict":false,"x":185,"y":881,"wires":[[],["aac42a44.e19928"]]},{"id":"dbfb0d50.5cae7","type":"http in","z":"87745034.1dce9","name":"login param endpoint","url":"/login/:username/:password","method":"get","upload":false,"swaggerDoc":"","x":265,"y":441,"wires":[["4ea830b3.443e8"]]},{"id":"f5f565ba.ac46a8","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":441,"wires":[]},{"id":"e2142d98.52906","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":441,"wires":[["f5f565ba.ac46a8"]]},{"id":"4ea830b3.443e8","type":"function","z":"87745034.1dce9","name":"login query params fn","func":"msg.topic = \"SELECT * FROM users WHERE user_name='\"+msg.req.params.username+\"' AND password='\"+msg.req.params.password+\"'\";\nreturn msg;","outputs":1,"noerr":0,"x":525,"y":441,"wires":[["e2142d98.52906"]]},{"id":"795835ac.4fa55c","type":"http in","z":"87745034.1dce9","name":"verify endpoint","url":"/verify/:username/:chid","method":"get","upload":false,"swaggerDoc":"","x":245,"y":501,"wires":[["b19ef5e0.5a7628"]]},{"id":"38c0ea1f.2928d6","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":502,"wires":[]},{"id":"b19ef5e0.5a7628","type":"function","z":"87745034.1dce9","name":"verify query fn","func":"msg.topic = \"SELECT * FROM users WHERE user_name='\"+msg.req.params.username+\"' AND chat_id='\"+msg.req.params.chid+\"'\";\nreturn msg;","outputs":1,"noerr":0,"x":545,"y":501,"wires":[["f676a4fe.5b8858"]]},{"id":"f676a4fe.5b8858","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":501,"wires":[["38c0ea1f.2928d6"]]},{"id":"169aa6a3.cf0e39","type":"http in","z":"87745034.1dce9","name":"checkRegistered endpoint","url":"/checkRegistered/:chid","method":"get","upload":false,"swaggerDoc":"","x":275,"y":561,"wires":[["1ab75b1f.49abd5"]]},{"id":"831f86c8.64ca48","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":562,"wires":[]},{"id":"1ab75b1f.49abd5","type":"function","z":"87745034.1dce9","name":"is registered query fn","func":"msg.topic = \"SELECT * FROM users WHERE chat_id='\"+msg.req.params.chid+\"'\";\nreturn msg;","outputs":1,"noerr":0,"x":525,"y":561,"wires":[["4006d85.bbb2928"]]},{"id":"4006d85.bbb2928","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":561,"wires":[["831f86c8.64ca48"]]},{"id":"19a982d0.7e5eed","type":"telegram command","z":"87745034.1dce9","name":"","command":"/register","bot":"f370b11a.d64ec","strict":false,"x":88,"y":1025,"wires":[["95abb932.5682c8"],[]]},{"id":"14f42a13.a6a2e6","type":"telegram sender","z":"87745034.1dce9","name":"bot response","bot":"f370b11a.d64ec","x":1355,"y":1061,"wires":[[]]},{"id":"95abb932.5682c8","type":"function","z":"87745034.1dce9","name":"register fn","func":"let str = msg.payload.content;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet strLength = subStr.length;\nlet chatId=msg.payload.chatId;\n\nmsg.payload.chatId = chatId;\nmsg.payload.type = 'message';\n\nif(strLength != 1){\n\tmsg.payload.content = 'Username must be one word.';\n\treturn [null, msg];\n} else if(strLength == 1 && subStr[0]===''){\n\tmsg.payload.content = 'Please type your username.';\n\treturn [null, msg];\n} else {\n    //msg.url = \"https://yourDomain.com:1880/checkExistent/\"+subStr[0];\n    msg.url = \"https://yourDomain.com:1880/checkRegistered/\"+chatId;\n    return [msg, null];\n}","outputs":2,"noerr":0,"x":226,"y":1014,"wires":[["1320503a.2fd96"],["14f42a13.a6a2e6"]]},{"id":"9a2a9237.5058a","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"Insert exp","x":745,"y":821,"wires":[["fdf58383.c2ab"]]},{"id":"1320503a.2fd96","type":"http request","z":"87745034.1dce9","name":"check registered chat id","method":"GET","ret":"obj","paytoqs":false,"url":"","tls":"","proxy":"","x":378,"y":952,"wires":[["26125a70.c5f9b6"]]},{"id":"aa595246.fd504","type":"http in","z":"87745034.1dce9","name":"check existent user endpoint","url":"/checkExistent/:user","method":"get","upload":false,"swaggerDoc":"","x":285,"y":621,"wires":[["bc4ca198.558d7"]]},{"id":"da1d26c6.eed328","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":622,"wires":[]},{"id":"bc4ca198.558d7","type":"function","z":"87745034.1dce9","name":"ckeck user query fn","func":"msg.topic = \"SELECT * FROM users WHERE user_name='\"+msg.req.params.user+\"';\";\nreturn msg;","outputs":1,"noerr":0,"x":535,"y":621,"wires":[["e0b8e30d.f1f5c"]]},{"id":"e0b8e30d.f1f5c","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":621,"wires":[["da1d26c6.eed328"]]},{"id":"d0aebf18.e4f8d","type":"function","z":"87745034.1dce9","name":"check results fn","func":"let chatId = msg.originalMessage.chat.id;\nlet originText = msg.originalMessage.text;\nlet str = originText;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet userName = subStr[1];\n\nif(msg.payload[0]){\n\tmsg.payload.content = '\\u274C Username already taken. Retry with a different one.';\n    msg.payload.chatId = chatId;\n    msg.payload.type = 'message';\n\treturn [null, msg];\n} else {\n    msg.url = \"https://yourDomain.com:1880/insertUser/\"+userName+\"/\"+chatId;\n    return [msg, null];\n}","outputs":2,"noerr":0,"x":1059,"y":962,"wires":[["5731a68.16d0358"],["14f42a13.a6a2e6"]]},{"id":"d4aa1dc9.a409a","type":"http in","z":"87745034.1dce9","name":"insert user endpoint","url":"/insertUser/:username/:chid","method":"get","upload":false,"swaggerDoc":"","x":255,"y":681,"wires":[["a8895e2e.ae908"]]},{"id":"6b0890de.ad57e","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":682,"wires":[]},{"id":"a8895e2e.ae908","type":"function","z":"87745034.1dce9","name":"insert user query fn","func":"function SHA256(s){\n\tvar chrsz  = 8;\n\tvar hexcase = 0;\n\tfunction safe_add (x, y) {\n\tvar lsw = (x & 0xFFFF) + (y & 0xFFFF);\n\tvar msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n\treturn (msw << 16) | (lsw & 0xFFFF);\n\t}\n\tfunction S (X, n) { return ( X >>> n ) | (X << (32 - n)); }\n\tfunction R (X, n) { return ( X >>> n ); }\n\tfunction Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }\n\tfunction Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }\n\tfunction Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }\n\tfunction Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }\n\tfunction Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }\n\tfunction Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }\n\tfunction core_sha256 (m, l) {\n\tvar K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);\n\tvar HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);\n\tvar W = new Array(64);\n\tvar a, b, c, d, e, f, g, h, i, j;\n\tvar T1, T2;\n\tm[l >> 5] |= 0x80 << (24 - l % 32);\n\tm[((l + 64 >> 9) << 4) + 15] = l;\n\tfor ( var i = 0; i<m.length; i+=16 ) {\n\ta = HASH[0];\n\tb = HASH[1];\n\tc = HASH[2];\n\td = HASH[3];\n\te = HASH[4];\n\tf = HASH[5];\n\tg = HASH[6];\n\th = HASH[7];\n\tfor ( var j = 0; j<64; j++) {\n\tif (j < 16) W[j] = m[j + i];\n\telse W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);\n\tT1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);\n\tT2 = safe_add(Sigma0256(a), Maj(a, b, c));\n\th = g;\n\tg = f;\n\tf = e;\n\te = safe_add(d, T1);\n\td = c;\n\tc = b;\n\tb = a;\n\ta = safe_add(T1, T2);\n\t}\n\tHASH[0] = safe_add(a, HASH[0]);\n\tHASH[1] = safe_add(b, HASH[1]);\n\tHASH[2] = safe_add(c, HASH[2]);\n\tHASH[3] = safe_add(d, HASH[3]);\n\tHASH[4] = safe_add(e, HASH[4]);\n\tHASH[5] = safe_add(f, HASH[5]);\n\tHASH[6] = safe_add(g, HASH[6]);\n\tHASH[7] = safe_add(h, HASH[7]);\n\t}\n\treturn HASH;\n\t}\n\tfunction str2binb (str) {\n\tvar bin = Array();\n\tvar mask = (1 << chrsz) - 1;\n\tfor(var i = 0; i < str.length * chrsz; i += chrsz) {\n\tbin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);\n\t}\n\treturn bin;\n\t}\n\tfunction Utf8Encode(string) {\n\tstring = string.replace(/\\r\\n/g,\"\\n\");\n\tvar utftext = \"\";\n\tfor (var n = 0; n < string.length; n++) {\n\tvar c = string.charCodeAt(n);\n\tif (c < 128) {\n\tutftext += String.fromCharCode(c);\n\t}\n\telse if((c > 127) && (c < 2048)) {\n\tutftext += String.fromCharCode((c >> 6) | 192);\n\tutftext += String.fromCharCode((c & 63) | 128);\n\t}\n\telse {\n\tutftext += String.fromCharCode((c >> 12) | 224);\n\tutftext += String.fromCharCode(((c >> 6) & 63) | 128);\n\tutftext += String.fromCharCode((c & 63) | 128);\n\t}\n\t}\n\treturn utftext;\n\t}\n\tfunction binb2hex (binarray) {\n\tvar hex_tab = hexcase ? \"0123456789ABCDEF\" : \"0123456789abcdef\";\n\tvar str = \"\";\n\tfor(var i = 0; i < binarray.length * 4; i++) {\n\tstr += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +\n\thex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);\n\t}\n\treturn str;\n\t}\n\ts = Utf8Encode(s);\n\treturn binb2hex(core_sha256(str2binb(s), s.length * chrsz));\n}\n\nmsg.topic = \"INSERT INTO users (user_name, chat_id, password) VALUES ('\"+msg.req.params.username+\"', \"+msg.req.params.chid+\", '\"+SHA256(msg.req.params.chid)+\"');\";\nreturn msg;","outputs":1,"noerr":0,"x":535,"y":681,"wires":[["9e747ebc.4d2ec"]]},{"id":"9e747ebc.4d2ec","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":681,"wires":[["6b0890de.ad57e"]]},{"id":"5731a68.16d0358","type":"http request","z":"87745034.1dce9","name":"insert user","method":"GET","ret":"obj","url":"","tls":"","x":1233,"y":962,"wires":[["50e0ad98.7e28e4"]]},{"id":"50e0ad98.7e28e4","type":"function","z":"87745034.1dce9","name":"response to user fn","func":"let chatId = msg.originalMessage.chat.id;\nlet originText = msg.originalMessage.text;\nlet str = originText;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet userName = subStr[1];\n\nif (msg.error || msg.payload.affectedRows===0){\n    msg.payload.content = '\\u274C Error occurred. Please retry.';\n} else {\n    msg.payload.content = 'Welcome '+userName+', your registration was successful! \\u2705 \\n\\nYour chatId is: <b>'+chatId+'</b> . \\n This code is also set as default password for your account. \\n\\n Type /pass followed by your new password to set it, or type /help to get started.';\n}\nmsg.payload.chatId = chatId;\nmsg.payload.type = 'message';\nmsg.payload.options = {parse_mode : \"HTML\"};\nreturn msg;","outputs":1,"noerr":0,"x":1433,"y":982,"wires":[["14f42a13.a6a2e6"]]},{"id":"feb26b5.e18c098","type":"http in","z":"87745034.1dce9","name":"update password endpoint","url":"/updatePassword/:chid/:newPass","method":"get","upload":false,"swaggerDoc":"","x":275,"y":741,"wires":[["71f8d8b.278f228"]]},{"id":"6c015666.a9e428","type":"http response","z":"87745034.1dce9","name":"response","statusCode":"200","headers":{"Access-Control-Allow-Origin":"*"},"x":1065,"y":741,"wires":[]},{"id":"ae09ed9c.194f5","type":"mysql","z":"87745034.1dce9","mydb":"23a4e873.9c0ee8","name":"","x":825,"y":741,"wires":[["6c015666.a9e428"]]},{"id":"71f8d8b.278f228","type":"function","z":"87745034.1dce9","name":"query","func":"function SHA256(s){\n\tvar chrsz  = 8;\n\tvar hexcase = 0;\n\tfunction safe_add (x, y) {\n\tvar lsw = (x & 0xFFFF) + (y & 0xFFFF);\n\tvar msw = (x >> 16) + (y >> 16) + (lsw >> 16);\n\treturn (msw << 16) | (lsw & 0xFFFF);\n\t}\n\tfunction S (X, n) { return ( X >>> n ) | (X << (32 - n)); }\n\tfunction R (X, n) { return ( X >>> n ); }\n\tfunction Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }\n\tfunction Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }\n\tfunction Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }\n\tfunction Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }\n\tfunction Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }\n\tfunction Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }\n\tfunction core_sha256 (m, l) {\n\tvar K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);\n\tvar HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);\n\tvar W = new Array(64);\n\tvar a, b, c, d, e, f, g, h, i, j;\n\tvar T1, T2;\n\tm[l >> 5] |= 0x80 << (24 - l % 32);\n\tm[((l + 64 >> 9) << 4) + 15] = l;\n\tfor ( var i = 0; i<m.length; i+=16 ) {\n\ta = HASH[0];\n\tb = HASH[1];\n\tc = HASH[2];\n\td = HASH[3];\n\te = HASH[4];\n\tf = HASH[5];\n\tg = HASH[6];\n\th = HASH[7];\n\tfor ( var j = 0; j<64; j++) {\n\tif (j < 16) W[j] = m[j + i];\n\telse W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);\n\tT1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);\n\tT2 = safe_add(Sigma0256(a), Maj(a, b, c));\n\th = g;\n\tg = f;\n\tf = e;\n\te = safe_add(d, T1);\n\td = c;\n\tc = b;\n\tb = a;\n\ta = safe_add(T1, T2);\n\t}\n\tHASH[0] = safe_add(a, HASH[0]);\n\tHASH[1] = safe_add(b, HASH[1]);\n\tHASH[2] = safe_add(c, HASH[2]);\n\tHASH[3] = safe_add(d, HASH[3]);\n\tHASH[4] = safe_add(e, HASH[4]);\n\tHASH[5] = safe_add(f, HASH[5]);\n\tHASH[6] = safe_add(g, HASH[6]);\n\tHASH[7] = safe_add(h, HASH[7]);\n\t}\n\treturn HASH;\n\t}\n\tfunction str2binb (str) {\n\tvar bin = Array();\n\tvar mask = (1 << chrsz) - 1;\n\tfor(var i = 0; i < str.length * chrsz; i += chrsz) {\n\tbin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);\n\t}\n\treturn bin;\n\t}\n\tfunction Utf8Encode(string) {\n\tstring = string.replace(/\\r\\n/g,\"\\n\");\n\tvar utftext = \"\";\n\tfor (var n = 0; n < string.length; n++) {\n\tvar c = string.charCodeAt(n);\n\tif (c < 128) {\n\tutftext += String.fromCharCode(c);\n\t}\n\telse if((c > 127) && (c < 2048)) {\n\tutftext += String.fromCharCode((c >> 6) | 192);\n\tutftext += String.fromCharCode((c & 63) | 128);\n\t}\n\telse {\n\tutftext += String.fromCharCode((c >> 12) | 224);\n\tutftext += String.fromCharCode(((c >> 6) & 63) | 128);\n\tutftext += String.fromCharCode((c & 63) | 128);\n\t}\n\t}\n\treturn utftext;\n\t}\n\tfunction binb2hex (binarray) {\n\tvar hex_tab = hexcase ? \"0123456789ABCDEF\" : \"0123456789abcdef\";\n\tvar str = \"\";\n\tfor(var i = 0; i < binarray.length * 4; i++) {\n\tstr += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +\n\thex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);\n\t}\n\treturn str;\n\t}\n\ts = Utf8Encode(s);\n\treturn binb2hex(core_sha256(str2binb(s), s.length * chrsz));\n}\n\nmsg.topic=\"UPDATE users SET password = '\"+SHA256(msg.req.params.newPass)+\"' WHERE chat_id = \"+msg.req.params.chid+\";\";\nreturn msg;","outputs":1,"noerr":0,"x":575,"y":741,"wires":[["ae09ed9c.194f5"]]},{"id":"a52dd818.d2ab28","type":"telegram command","z":"87745034.1dce9","name":"","command":"/pass","bot":"f370b11a.d64ec","strict":false,"x":175,"y":1141,"wires":[["bd905b8b.879628"],[]]},{"id":"dd1f2cfe.7d318","type":"telegram sender","z":"87745034.1dce9","name":"bot response","bot":"f370b11a.d64ec","x":1335,"y":1141,"wires":[[]]},{"id":"bd905b8b.879628","type":"function","z":"87745034.1dce9","name":"pass fn","func":"let str = msg.payload.content;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet strLength = subStr.length;\nlet chatId=msg.payload.chatId;\n\nmsg.payload.chatId = chatId;\nmsg.payload.type = 'message';\n\nif(strLength != 1 || subStr[0]===''){\n\tmsg.payload.content = '\\u274C Password must be one word.';\n\treturn [null, msg];\n} else {\n    msg.url = \"https://yourDomain.com:1880/updatePassword/\"+chatId+\"/\"+subStr[0];\n    return [msg, null];\n}","outputs":2,"noerr":0,"x":345,"y":1141,"wires":[["624a3006.28a4"],["dd1f2cfe.7d318"]]},{"id":"624a3006.28a4","type":"http request","z":"87745034.1dce9","name":"update password","method":"GET","ret":"obj","url":"","tls":"","x":655,"y":1121,"wires":[["a44eb8f7.852a58"]]},{"id":"a44eb8f7.852a58","type":"function","z":"87745034.1dce9","name":"check results fn","func":"let chatId = msg.originalMessage.chat.id;\nlet originText = msg.originalMessage.text;\nlet str = originText;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet userName = subStr[1];\n\nif (msg.error){\n    msg.payload.content = '\\u274C Error occurred. Please retry.';\n} else if(msg.payload.affectedRows===0) {\n    msg.payload.content = '\\u274C User not found. Please register before changing the password.';\n} else {\n    msg.payload.content = '\\u2705 Password changed successfully.';\n}\nmsg.payload.chatId = chatId;\nmsg.payload.type = 'message';\nreturn msg;","outputs":1,"noerr":0,"x":865,"y":1121,"wires":[["dd1f2cfe.7d318"]]},{"id":"bee9a0e3.2b90c","type":"http request","z":"87745034.1dce9","name":"check existent username","method":"GET","ret":"obj","paytoqs":false,"url":"","tls":"","proxy":"","x":838,"y":957,"wires":[["d0aebf18.e4f8d"]]},{"id":"26125a70.c5f9b6","type":"function","z":"87745034.1dce9","name":"check results fn","func":"let chatId = msg.originalMessage.chat.id;\nlet originText = msg.originalMessage.text;\nlet str = originText;\nstr = str.replace(/(^\\s*)|(\\s*$)/gi,\"\");\nstr = str.replace(/[ ]{2,}/gi,\" \"); \nstr = str.replace(/\\n /,\"\\n\");\nlet subStr = str.split(' ');\nlet userName = subStr[1];\n\nif(msg.payload[0]){\n\tmsg.payload.content = 'You are already registered as <b>'+msg.payload[0].user_name+'</b>.';\n    msg.payload.chatId = chatId;\n    msg.payload.type = 'message';\n    msg.payload.options = {parse_mode : \"HTML\"};\n\treturn [null, msg];\n} else {\n    msg.url = \"https://yourDomain.com:1880/checkExistent/\"+userName;\n    return [msg, null];\n}","outputs":2,"noerr":0,"x":610,"y":951,"wires":[["bee9a0e3.2b90c"],["14f42a13.a6a2e6"]]},{"id":"5529e364.2e950c","type":"telegram command","z":"87745034.1dce9","name":"","command":"/help","bot":"f370b11a.d64ec","strict":false,"x":208,"y":1249,"wires":[["2bf30379.92a7bc"],[]]},{"id":"67321339.eacc9c","type":"telegram sender","z":"87745034.1dce9","name":"","bot":"f370b11a.d64ec","x":1302.750015258789,"y":1224.0000190734863,"wires":[[]]},{"id":"2bf30379.92a7bc","type":"function","z":"87745034.1dce9","name":"help fn","func":"let chatId=msg.payload.chatId;\nmsg.payload.chatId = chatId;\nmsg.url = \"https://yourDomain.com:1880/checkRegistered/\"+chatId;\nreturn msg;","outputs":1,"noerr":0,"x":401.25000381469727,"y":1260.0000190734863,"wires":[["1f9859b.c1534a6"]]},{"id":"1f9859b.c1534a6","type":"http request","z":"87745034.1dce9","name":"check registered chat id","method":"GET","ret":"obj","paytoqs":false,"url":"","tls":"","proxy":"","x":638.2500152587891,"y":1265.5000190734863,"wires":[["ec06318c.2d3ea"]]},{"id":"ec06318c.2d3ea","type":"function","z":"87745034.1dce9","name":"check results fn","func":"let chatId = msg.originalMessage.chat.id;\n\nif(msg.payload[0]){\n\tmsg.payload.content = '<b>ExpenseBot: a concept by G-Flex.</b> \\nHead to <a href=\"https://yourDomain.com/?user='+msg.payload[0].user_name+'&chid='+msg.payload[0].chat_id+'\">yourDomain.com</a> to view your expenses and control panel. \\n\\n<b>COMMAND LIST</b>: \\n\\n \\uD83D\\uDCDD <b>Register</b>: /register username(<i>string, one-word only</i>); \\n\\n \\uD83D\\uDD11 <b>Change password</b>: /pass password(<i>string, one-word only</i>); \\n\\n \\uD83D\\uDCC9 <b>Insert expense</b>: value(<i>int</i>) name(<i>string, optional</i>);\\n\\n \\uD83D\\uDCC8 <b>Insert income</b>: +(<i>plus operator</i>) value(<i>int</i>) name(<i>string, optional</i>);\\n\\n \\u274C <b>Delete expense</b>: reply to desired expense with one of these words: <i>Del</i>, <i>del</i>, <i>Delete</i>, <i>delete</i>;\\n\\n \\u274C <b>Delete last inserted expense</b>: type one of these words: <i>Del</i>, <i>del</i>, <i>Delete</i>, <i>delete</i>.';\n\n    msg.payload.chatId = chatId;\n    msg.payload.type = 'message';\n    msg.payload.options = {parse_mode : \"HTML\"};\n\treturn [msg];\n} else {\n    msg.payload.content = '<b>ExpenseBot: a concept by G-Flex.</b> \\nPlease type /register followed by your username (ex. /register Luigi) to register. \\n\\n<b>COMMAND LIST</b>: \\n\\n \\uD83D\\uDCDD <b>Register</b>: /register username(<i>string, one-word only</i>); \\n\\n \\uD83D\\uDD11 <b>Change password</b>: /pass password(<i>string, one-word only</i>); \\n\\n \\uD83D\\uDCC9 <b>Insert expense</b>: value(<i>int</i>) name(<i>string, optional</i>);\\n\\n \\uD83D\\uDCC8 <b>Insert income</b>: +(<i>plus operator</i>) value(<i>int</i>) name(<i>string, optional</i>);\\n\\n \\u274C <b>Delete expense</b>: reply to desired expense with one of these words: <i>Del</i>, <i>del</i>, <i>Delete</i>, <i>delete</i>;\\n\\n \\u274C <b>Delete last inserted expense</b>: type one of these words: <i>Del</i>, <i>del</i>, <i>Delete</i>, <i>delete</i>.';\n    \n    msg.payload.chatId = chatId;\n    msg.payload.type = 'message';\n    msg.payload.options = {parse_mode : \"HTML\"};\n    return [msg];\n}","outputs":1,"noerr":0,"x":929.0000152587891,"y":1248.2500190734863,"wires":[["67321339.eacc9c"]]},{"id":"16c8ef2a.31ef11","type":"telegram command","z":"87745034.1dce9","name":"","command":"/start","bot":"f370b11a.d64ec","strict":false,"x":202.5,"y":1373.75,"wires":[["69e65daa.829944"],[]]},{"id":"abd8d3f6.15f3a","type":"telegram sender","z":"87745034.1dce9","name":"","bot":"f370b11a.d64ec","x":1297.250015258789,"y":1348.7500190734863,"wires":[[]]},{"id":"69e65daa.829944","type":"function","z":"87745034.1dce9","name":"start fn","func":"let chatId=msg.payload.chatId;\nmsg.payload.chatId = chatId;\n\nmsg.payload.content = '<b>Hello from ExpenseBot!</b> \\ud83d\\udc4b \\n\\nType /register followed by your username (ex. /register Luigi) to signup or type /help to get started.';\n\nmsg.payload.type = 'message';\nmsg.payload.options = {parse_mode : \"HTML\"};\nreturn [msg];\n","outputs":1,"noerr":0,"x":739.5000038146973,"y":1363.500020980835,"wires":[["abd8d3f6.15f3a"]]},{"id":"f370b11a.d64ec","type":"telegram bot","z":"","botname":"ExpediBot","usernames":"","chatids":"","baseapiurl":"","updatemode":"polling","pollinterval":"300","usesocks":false,"sockshost":"","socksport":"6667","socksusername":"anonymous","sockspassword":"","bothost":"","localbotport":"8443","publicbotport":"8443","privatekey":"","certificate":"","useselfsignedcertificate":false,"verboselogging":false},{"id":"23a4e873.9c0ee8","type":"MySQLdatabase","z":"","host":"localhost","port":"3306","db":"expbot","tz":""}]
