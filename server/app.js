const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const multer     = require('multer');
const path       = require('path');
const sgMail     = require('@sendgrid/mail');
const SHA256     = require("crypto-js/sha256");
const cors       = require('cors');
let fs           = require('fs');

var base_url     = "https://localhost:5555";

sgMail.setApiKey('SG.VWBvo');

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//connect to mysql don't use var tomake it global

var db = require('./dbconnection'); //reference of dbconnection.js

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.use(cors());

//app.use(bodyParser.json({limit:1024102420}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const routers = require('./routers');

app.use('/',routers);

// update profile in router

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));



app.post('/api/updateprofile', function(req, res, next) {

    db.getConnection(function(err, connection) {

           var postBody = req.body.task;    

            var user_id             = postBody.user_id;
            var user_name           = postBody.user_name;
            var user_location       = postBody.user_location;          
            var userpic       		= postBody.userpic; 

    connection.query('update `itribe_users` set `name` = "'+user_name+'" , `location` = "'+user_location+'"  where id = "'+user_id+'" ', function(err, rows) {

     console.log(err); 

           res.send({ msg: 'Successfully Updated' });   
        });
 
connection.release();
    });

});

// end 

// get notifications
    
    app.get('/api/getnotifications', (req, res) => {
          db.getConnection(function(err, connection) {

        var postBody     = req.query;    
        var userid       = postBody.userid;   
   

    connection.query("SELECT `sender_id` as sid,`reciver_id` as rid , COUNT(reciver_id) as countnotifiction , (SELECT name FROM `itribe_users` WHERE id = sid ) as sendername , (SELECT msg_text FROM `itribe_messages` WHERE (sender_id = sid and reciver_id = rid) order by msg_id LIMIT 1 ) as lastmsg FROM `itribe_messages` WHERE `status` = 0 and reciver_id = '"+userid+"' GROUP BY sender_id", function(err, rows) {
                
            if (!err && rows.length > 0) {

              res.json(rows);

            }
            else
            {
                res.json([]);
            }

            connection.release();
        });
    });
});
    

// end 


// get Total Msg Count

app.get('/api/msgtotalcount', (req, res) => {

     db.getConnection(function(err, connection) {

        var postBody     = req.query;    
        var userid       = postBody.userid;   
   

    connection.query("SELECT count(*) as unreadmsg FROM itribe_messages WHERE  reciver_id = '"+userid+"' and  status = '0' ", function(err, rows) {
    
        console.log(err);   
            
            if (!err && rows.length > 0) {

              res.json(rows);

            }
            else
            {
                res.json([]);
            }
        });

        connection.release();

    });
});

// end

// get message Friends list



app.get('/api/callApiGetFriendList', (req, res) => {

     db.getConnection(function(err, connection) {

    	var postBody     = req.query;    
		var sender_id      = postBody.sender_id;		
   
    	var result = [];
    	var commIdArr = [];

    connection.query("SELECT * FROM itribe_messages WHERE sender_id='" + sender_id + "' OR reciver_id = '"+sender_id+"' ", function(err, rows) {
    
    console.log(err);

    //res.send({ express: 'Hello From Express' });
            if (!err && rows.length > 0) {
            
                rows.forEach((row) => {
                    commIdArr.push(row.sender_id);
                    commIdArr.push(row.reciver_id);
                });           

            	var community_id = 1;

        	connection.query('SELECT * from itribe_users where  itribe_users.id IN  ('+commIdArr+') and itribe_users.id NOT IN ('+sender_id+') ', function (error, results, fields) {
            if (error) throw error;
                
                res.send(JSON.stringify(results));
            
            });

            }
            else
            {
                res.json({ msg: 'Not Found Any Friend' });
            }   
       });

    connection.release();

 });

});


// get message getConversationSR

app.get('/api/getConversationSR', (req, res) => {

     db.getConnection(function(err, connection) {

    	var postBody     = req.query;    
		var sender_id      = postBody.sender_id;
		var reciver_id     = postBody.reciver_id; 
   
    	var result = [];
    	var commIdArr = [];

//console.log("SELECT * FROM itribe_messages WHERE (sender_id='" + sender_id + "' and reciver_id = '"+reciver_id+"') OR (sender_id='" + reciver_id + "' and reciver_id = '"+sender_id+"') and  status = '1' ");
    connection.query("SELECT * FROM itribe_messages WHERE (sender_id='" + sender_id + "' AND reciver_id = '"+reciver_id+"') OR (sender_id='" + reciver_id + "' AND reciver_id = '"+sender_id+"') ", function(err, rows) {
    
    	console.log(err);

    //res.send({ express: 'Hello From Express' });
            
            if (!err && rows.length > 0) {                

// update status 0 to 1 for unread to read
   
    connection.query("update `itribe_messages` set `status` = '1' WHERE (sender_id='" + sender_id + "' AND reciver_id = '"+reciver_id+"') OR (sender_id='" + reciver_id + "' AND reciver_id = '"+sender_id+"') ", function(err, rows) {

     console.log(err); 
              
    });
        	  res.json(rows);

            }
            else
            {
                res.json([]);
            }
    	});

    connection.release();

	});
});



// Add Message DONE

app.post('/api/addmessage', function(req, res, next) {

    db.getConnection(function(err, connection) {

            var postBody       = req.body.task;          

            var sender_id      = postBody.sender_id;
            var reciver_id     = postBody.reciver_id;
            var msg_text       = postBody.msg_text;
            var status         = 1;
            var community_id   = postBody.community_id;
            var chat_file 	   = 'text'; //postBody.chat_file;
            var file_extension = '';//postBody.file_extension;

     connection.query('INSERT INTO `itribe_messages` (`sender_id`, `reciver_id`, `msg_text`, `status`, `community_id`, `chat_file`, `file_extension`) ' +
      'VALUES (?, ? , ?, ?, ?, ?, ?)',[sender_id, reciver_id, msg_text, status, community_id, chat_file, file_extension], function(err, rows) {

     console.log(err);
     
    if (rows.affectedRows) {

      connection.query("SELECT * FROM itribe_messages WHERE msg_id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

            res.json(rows[0]);

        } else {

            res.json([]);
        }

    });

            }

        });
 
 connection.release();

    });

});


// 11 April 2018

// Delete Communities

app.get('/api/delete_community', (req, res) => {

    db.getConnection(function(err, connection) {

        var postBody            = req.query;                 
        var community_id       = postBody.community_id; 
        
// delete from itribe_community

    connection.query('delete from `itribe_community` where community_id = "'+community_id+'"  ', function(err, rows) {
     console.log(err);            
        });

// delete from itribe_commu_members

    connection.query('delete from `itribe_commu_members` where commun_id = "'+community_id+'"  ', function(err, rows) {
     console.log(err);            
        });

// delete from itribe_commu_invitation

    connection.query('delete from `itribe_commu_invitation` where commu_id = "'+community_id+'"  ', function(err, rows) {
     console.log(err);            
        });

 // delete from itribe_library

    connection.query('delete from `itribe_library` where community_id = "'+community_id+'"  ', function(err, rows) {
     console.log(err);            
        });  

 // delete from itribe_library

    connection.query('delete from `itribe_messages` where community_id = "'+community_id+'"  ', function(err, rows) {
     console.log(err);            
        });      


     res.send({ msg: 'Community Successfully Deleted' }); 

    connection.release();

    });

});

// Delete Users 

app.get('/api/delete_users', (req, res) => {

    db.getConnection(function(err, connection) {

        var postBody            = req.query;
        var user_id             = postBody.user_id; 

// delete from itribe_users

    connection.query('delete from `itribe_users` where id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });

// delete from itribe_community

    connection.query('delete from `itribe_community` where community_owner_id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });

// delete from itribe_commu_members

    connection.query('delete from `itribe_commu_members` where user_id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });

// delete from itribe_commu_invitation

    connection.query('delete from `itribe_commu_invitation` where user_id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });

 // delete from itribe_library

    connection.query('delete from `itribe_library` where user_id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });  
    
 // delete from itribe_messages

    connection.query('delete from `itribe_messages` where sender_id = "'+user_id+'"  ', function(err, rows) {
     console.log(err);            
        });      


     res.send({ msg: 'Successfully Deleted' }); 

    
    connection.release();

    });

});

//get check community member status by community id

app.get('/api/joinedcommunitybyuid_status',(req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var user_id      = postBody.uid;    
    var commun_id    = postBody.cid;    

     connection.query("SELECT * FROM itribe_commu_members WHERE user_id='" + user_id + "' and commun_id = '"+ commun_id+"'  LIMIT 1", function(err, rows) {
    
    console.log(err);

     res.json(rows[0]);
        
        });
        
    
    connection.release(); })   });

app.get('/api/joinedcommunitybyuid_statusmembership',(req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var user_id      = postBody.uid;          

     connection.query("SELECT * FROM itribe_commu_members WHERE user_id='" + user_id + "' ", function(err, rows) {
    
    console.log(err);

     res.json(rows);
        
        });
        
    
    connection.release(); })   });


// end

// get All Joined Communities by user id DONE

app.get('/api/pendingcommunitybyuid', (req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var user_id      = postBody.uid;    
   
    var result = [];
    var commIdArr = [];
//and user_join_status = '1'
    connection.query("SELECT * FROM itribe_commu_members WHERE user_id='" + user_id + "' and user_join_status = '0' ", function(err, rows) {
    
    console.log(err);

    //res.send({ express: 'Hello From Express' });
            if (!err && rows.length > 0) {
            
                rows.forEach((row) => {
                    commIdArr.push(row.commun_id);
                });           

            var community_id = 1;

          connection.query('SELECT * from itribe_community,itribe_users where  itribe_community.community_owner_id = itribe_users.id and itribe_community.community_id IN  ('+commIdArr+') ', function (error, results, fields) {
            if (error) throw error;
                
                res.send(JSON.stringify(results));
            
            });
               
              // res.contentType('application/json');          

            }
            else
            {
                res.json({ msg: 'Not Found Any Joined Community' });
            }

    });

    connection.release();

});
});



// end 11 april 2018


// get All Joined Communities by user id DONE

app.get('/api/joinedcommunitybyuid', (req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var user_id      = postBody.uid;    
   
    var result = [];
    var commIdArr = [];

    connection.query("SELECT * FROM itribe_commu_members WHERE user_id='" + user_id + "' and user_join_status = '1' ", function(err, rows) {
    
    console.log(err);

    //res.send({ express: 'Hello From Express' });
            if (!err && rows.length > 0) {
            
                rows.forEach((row) => {
                    commIdArr.push(row.commun_id);
                });           

            var community_id = 1;

          connection.query('SELECT * from itribe_community,itribe_users where  itribe_community.community_owner_id = itribe_users.id and itribe_community.community_id IN  ('+commIdArr+') ', function (error, results, fields) {
            if (error) throw error;
                
                res.send(JSON.stringify(results));
            
            });
               
              // res.contentType('application/json');          

            }
            else
            {
                res.json({ msg: 'Not Found Any Joined Community' });
            }

    });

    connection.release();
    
    });
});

// Join Community DONE

app.get('/api/joincommunity', function(req, res, next) {
   

    db.getConnection(function(err, connection) {

        var postBody         = req.query;
            
        //console.log(postBody);

            var commun_id        = postBody.commun_id;
            var user_id          = postBody.user_id;
            var community_owner_id   = postBody.reciver_id;
            var user_join_status = 0;
            var status           = 1;

    connection.query("SELECT * FROM itribe_commu_members WHERE user_id='" + user_id + "' and commun_id = '"+ commun_id+"'  LIMIT 1", function(err, rows) {
    
    console.log(err);

    //res.send({ express: 'Hello From Express' });
    if (!err && rows.length > 0) {

        res.json({ msg: 'Already Joined' });
    }
    else
    {
        connection.query('INSERT INTO `itribe_commu_members` (`commun_id`, `user_id`, `user_join_status`, `status`) ' +
        'VALUES (?, ? , ?, ?)',[commun_id, user_id, user_join_status, status], function(err1, rows1) {

        console.log(err1);

        if (rows1.affectedRows) {

        connection.query("SELECT * FROM itribe_commu_members WHERE commun_rel_id='" + rows1.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

                        //insert in message for '6)  Pending community join requests should be a message and should be reflected in a number in the inbox'

            var sender_id      = user_id;
            var reciver_id     = community_owner_id;
            var msg_text       = 'Pending community join requests';
            var status         = 0;
            var community_id   = commun_id;
            var chat_file      = 'text'; //postBody.chat_file;
            var file_extension = '';//postBody.file_extension;

            console.log(reciver_id);

     connection.query('INSERT INTO `itribe_messages` (`sender_id`, `reciver_id`, `msg_text`, `status`, `community_id`, `chat_file`, `file_extension`) ' +
      'VALUES (?, ? , ?, ?, ?, ?, ?)',[sender_id, reciver_id, msg_text, status, community_id, chat_file, file_extension], function(msgerr, msgrows) {

      });
            // end 

        res.json(rows[0]);

        } else {

        res.json([]);
        }
        });
        }

        });   // end join insert query 

    }

     

    }); 

    connection.release();

    });

});

// leave_community

app.get('/api/leave_community', (req, res) => {

    db.getConnection(function(err, connection) {

        var postBody            = req.query;                 
        var commun_id       = postBody.commun_id; 
        var user_id             = postBody.user_id; 

    connection.query('delete from `itribe_commu_members` where commun_id = "'+commun_id+'"  and user_id = "'+user_id+'" ', function(err, rows) {

     console.log(err); 

           res.send({ msg: 'Successfully Left' });   
        });

    
    connection.release();

    });

});

// end 

// Delete Join Requests

app.get('/api/delete_join_request', (req, res) => {

	db.getConnection(function(err, connection) {

        var postBody     		= req.query;                 
        var commun_rel_id       = postBody.commun_rel_id; 
        var user_id      		= postBody.user_id; 
        var commun_id              = postBody.commun_id;

    connection.query('delete from `itribe_commu_members` where commun_rel_id = "'+commun_rel_id+'"  and user_id = "'+user_id+'" ', function(err, rows) {

     console.log(err); 
    
    connection.query('update `itribe_messages` set `status` = "1"  where community_id = "'+commun_id+'"  and sender_id = "'+user_id+'" ', function(errmsg, rowsmsg) { });

           res.send({ msg: 'Successfully Rejected' });   
        });

connection.release();
    });

});

// Approved Join Requests

app.get('/api/approve_join_request', (req, res) => {

	     db.getConnection(function(err, connection) {

        var postBody     		= req.query;                 
        var commun_rel_id       = postBody.commun_rel_id; 
        var user_id      		= postBody.user_id; 
        var commun_id           = postBody.commun_id; 

     connection.query('update `itribe_commu_members` set `user_join_status` = "1"  where commun_rel_id = "'+commun_rel_id+'"  and user_id = "'+user_id+'" ', function(err, rows) {

     console.log(err); 

     connection.query('update `itribe_messages` set `status` = "1"  where community_id = "'+commun_id+'"  and sender_id = "'+user_id+'" ', function(errmsg, rowsmsg) { });

           res.send({ msg: 'Successfully Approved' });   
        });

    connection.release();

    });

});

// Get Invitation Sending Requests

app.get('/api/getpendingjoins', (req, res) => {

    

     db.getConnection(function(err, connection) {

        var postBody     = req.query;                 
        var user_id      = postBody.uid;    

        var result = [];
        var commIdArr = []; 

   connection.query('SELECT community_id from itribe_community where  itribe_community.community_owner_id = ? ',[user_id], function (err, rows, fields) {
    if (err) throw err;
    
            console.log(rows);

            if (!err && rows.length > 0) {
            
                rows.forEach((row) => {
                    commIdArr.push(row.community_id);
                });           

            var community_id = 1;

//console.log('SELECT * from itribe_commu_invitation ici,itribe_users iu,itribe_community ic where  ic.community_id = ici.commu_id and ici.user_id = iu.id and ici.commu_id IN  ('+commIdArr+') and ici.status = 0');
 
//console.log('SELECT * from itribe_commu_members,itribe_users,itribe_community ic where  ic.community_id = itribe_commu_members.commun_id and itribe_commu_members.user_id = itribe_users.id and itribe_commu_members.commun_id IN  ('+commIdArr+') and user_join_status = 0');

          connection.query('SELECT * from itribe_commu_members,itribe_users,itribe_community ic where  ic.community_id = itribe_commu_members.commun_id and itribe_commu_members.user_id = itribe_users.id and itribe_commu_members.commun_id IN  ('+commIdArr+') and user_join_status = 0', function (error, results, fields) {
            if (error) throw error;
                
                res.send(JSON.stringify(results));
            
            });               
              
              // res.contentType('application/json');
             

            }
            else
            {
                res.json([]);

            }
    
    
    }); //3

   connection.release();

   }); //2

}); // 1


// Get list of community by cid and invitation id

app.get('/api/communitybycidinviteid', (req, res) => {

db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var community_id = postBody.cid;   
    var inviteid     = postBody.inviteid;   

    connection.query('SELECT * from itribe_commu_invitation, itribe_community,itribe_users where itribe_commu_invitation.invitation_id= ? and  itribe_commu_invitation.commu_id = itribe_community.community_id and itribe_community.community_owner_id = itribe_users.id',[inviteid,'1'], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
     
        connection.release();

    });
});


// send invitaions to other users

app.post('/api/sendinvitaion', function(req, res, next) {

    db.getConnection(function(err, connection) {
            
            var postBody = req.body.task;
               
            var user_id         = postBody[0].user_id;
            var commu_id        = postBody[0].commu_id;
            var user_emailidarr = postBody[1].emailids;  

            var community_name   = "";         
            var community_title  = "";   
            var ownername        = "";   


    connection.query('SELECT * from itribe_community,itribe_users where  itribe_community.community_id = ? and itribe_community.community_status = ? and itribe_community.community_owner_id = itribe_users.id',[commu_id,'1'], function (error, results, fields) {
    
    if (error) throw error;

    community_name   = results[0].community_name;
    community_title  = results[0].community_tagline;
    ownername        = results[0].name;  
                
        for(var i=0 ; i < user_emailidarr.length; i++ )
        {
               var user_emailid = user_emailidarr[i];             


            connection.query('INSERT INTO `itribe_commu_invitation` (`user_id`, `commu_id`, `user_emailid`) ' +
              'VALUES (?, ? , ?)',[user_id, commu_id, user_emailid], function(err, rows) {

             console.log(err);          
           
                if (rows.affectedRows) {

                             var invitationid = rows.insertId;

var htmlContent = '<html>Hi <br/> <strong> Please click on verify link    </strong></html>';

var joinurl = base_s_url+"/joincommunity/"+invitationid+"/"+commu_id;

var invitationhtml = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body style="padding: 0; margin:0; background:#F4FBFD;font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:0px 15px 10px 15px;">';
invitationhtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" style=""><br><br>';
invitationhtml += '<table width="600" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" bgcolor="#fff" style="border-radius: 0.375rem; box-shadow: 12px 15px 20px 0 rgba(46, 61, 73, 0.15); padding:50px " >';
invitationhtml += '<div><img src="images/logo.jpg"></div><br>';
invitationhtml += '<div style=" border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; color: #000; font-size: 48px; padding: 4px 0;"><b>Welcome to iTribe</b></div> <br>';
invitationhtml += '<div><h2 style="font-size: 17px;  text-align: left;">Dear '+user_emailid+',</h2></div>';
invitationhtml += '<div style="text-align: left;">';
invitationhtml += 'Community Title: '+community_title+'  <br>  <br>';
invitationhtml += 'Community Name: '+community_name+'  <br>   <br>';
invitationhtml += 'Owner Name: '+ownername+' ';
invitationhtml += '<br><br><div><a href="'+joinurl+'" style="color: #3ba700; font-size: 16px; text-transform: capitalize;">Join us</a></div>';
invitationhtml += '<br> <br> © Copyright 2018 - iTribe </div></td></tr></table><br><br></td></tr></table></body></html>';

const msg = {
  to: user_emailid,
  from: 'info@itribe.us',
  subject: 'iTribe Community Invitation Mail',
  text: 'Welcome to iTribe Dear Community Title Community Name Owner Name Copyright 2018 - iTribe ',
  html: invitationhtml,
};

        sgMail.send(msg);

    // } else {

               
   //  }                        

        }

                });

            }

             res.send({ msg: 'Successfully Sent' }); 

        });          
        
       
connection.release();

    });

});



// get list of community by user id DONE

app.get('/api/communitybysearch', (req, res) => {

    db.getConnection(function(err, connection) {

    var postBody           = req.query;                 
    var community_tagline = postBody.cstr;  
    

   connection.query('SELECT * from itribe_community,itribe_users where  (itribe_community.community_tagline LIKE "%'+community_tagline+'%" || itribe_community.community_name LIKE "%'+community_tagline+'%"  ) and itribe_community.community_status = 1 and itribe_community.community_owner_id = itribe_users.id ', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });

   connection.release();

    });

});


// get list of community by user id DONE

app.get('/api/communitybyuid', (req, res) => {

    db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var community_owner_id = postBody.uid;  
    

   connection.query('SELECT * from itribe_community,itribe_users where  itribe_community.community_owner_id = ? and itribe_community.community_status = ? and itribe_community.community_owner_id = itribe_users.id',[community_owner_id,'1'], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });

    connection.release();

    });

});

// get list of community members  by cid DONE

app.get('/api/comm_mem_by_cid', (req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var community_id = postBody.cid; 
    

    connection.query('SELECT * from itribe_commu_members icm ,itribe_community ic ,itribe_users iu where  icm.commun_id = ? and icm.commun_id = ic.community_id and icm.user_id = iu.id and user_join_status=1',[community_id], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
     
      connection.release();

    });

});

// get list of community by id DONE

app.get('/api/communitybyid', (req, res) => {

      db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var community_id = postBody.cid;   

    connection.query('SELECT * from itribe_community,itribe_users where  itribe_community.community_id = ? and itribe_community.community_status = ? and itribe_community.community_owner_id = itribe_users.id',[community_id,'1'], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
     
     connection.release();

    });
});

// list of all communities DONE ... Use in admin pending...


app.get('/api/allcommunitiesadmin', (req, res) => {

    db.getConnection(function(err, connection) {

    connection.query('SELECT * from itribe_community,itribe_users  where   itribe_community.community_owner_id = itribe_users.id ', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
  
    //res.send({ express: 'Hello From Express' });
    //res.send({ one: 'Express 1', two : 'Express 2', three : 'Express 3' , four : 'Express 4' });

     connection.release();

    });

});

// All contact request for admin

app.get('/api/allcontactsadmin', (req, res) => {

     db.getConnection(function(err, connection) {

    connection.query('SELECT * from itribe_contact ', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });

     connection.release();

    });

});

app.get('/api/allcommunities', (req, res) => {

    db.getConnection(function(err, connection) {

    connection.query('SELECT * from itribe_community,itribe_users  where  community_visibility = ? and community_status = ? and itribe_community.community_owner_id = itribe_users.id ',['on','1'], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
  
    //res.send({ express: 'Hello From Express' });
    //res.send({ one: 'Express 1', two : 'Express 2', three : 'Express 3' , four : 'Express 4' });

     connection.release();

    });
});



// Update Updatecommunity 

app.post('/api/updatecommunity', function(req, res, next) {

    db.getConnection(function(err, connection) {

            var postBody = req.body.task;    

           // console.log(postBody);      

            var community_id         = postBody.community_id;
            var community_owner_id   = postBody.community_owner_id;
            var community_name       = postBody.community_name;
            var community_size       = postBody.community_size;
            var community_religion   = postBody.community_religion;
            var community_spoken     = postBody.community_spoken;
            var community_tagline    = postBody.community_tagline;
            var comminty_desc        = postBody.comminty_desc;
            var community_visibility = postBody.community_visibility;
            var community_status     = postBody.community_status;
            var community_location = postBody.community_location;
            var community_lat_long = postBody.community_lat_long;


    connection.query('update `itribe_community` set `community_name` = "'+community_name+'" , `community_size` = "'+community_size+'" , `community_religion` = "'+community_religion+'"  , `community_spoken` = "'+community_spoken+'" , `community_tagline` = "'+community_tagline+'" , `comminty_desc` = "'+comminty_desc+'" , `community_visibility` = "'+community_visibility+'"  where community_id = "'+community_id+'" ', function(err, rows) {

     console.log(err); 

           res.send({ msg: 'Successfully Updated' });   
        });
 
     
     connection.release();

    });

});

// Add Community DONE

app.post('/api/addcommunity', function(req, res, next) {

    db.getConnection(function(err, connection) {

            var postBody = req.body.task;          

            var community_owner_id = postBody.community_owner_id;
            var community_name = postBody.community_name;
            var community_size = postBody.community_size;
            var community_religion = postBody.community_religion;
            var community_spoken = postBody.community_spoken;
            var community_tagline = postBody.community_tagline;
            var comminty_desc = postBody.comminty_desc;
            var community_visibility = postBody.community_visibility;
            var community_status = postBody.community_status;
            var community_location = postBody.community_location;
            var community_lat_long = postBody.community_lat_long;



     connection.query('INSERT INTO `itribe_community` (`community_owner_id`, `community_name`, `community_size`, `community_religion`, `community_spoken`, `community_tagline`, `comminty_desc`, `community_visibility`, `community_status`, `community_location`, `community_lat_long`) ' +
      'VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?)',[community_owner_id, community_name, community_size, community_religion, community_spoken, community_tagline, comminty_desc, community_visibility, community_status, community_location, community_lat_long], function(err, rows) {

     console.log(err);
     
    if (rows.affectedRows) {

      connection.query("SELECT * FROM itribe_community WHERE community_id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {


var joinurl = base_s_url+"/joincommunity";

var invitationhtml = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body style="padding: 0; margin:0; background:#F4FBFD;font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:0px 15px 10px 15px;">';
invitationhtml += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" style=""><br><br>';
invitationhtml += '<table width="600" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" bgcolor="#fff" style="border-radius: 0.375rem; box-shadow: 12px 15px 20px 0 rgba(46, 61, 73, 0.15); padding:50px " >';
invitationhtml += '<div><img src="/images/logo.jpg"></div><br>';
invitationhtml += '<div style=" border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; color: #000; font-size: 48px; padding: 4px 0;"><b>Welcome to iTribe</b></div> <br>';
invitationhtml += '<div><h2 style="font-size: 17px;  text-align: left;">Dear Admin,</h2></div>';
invitationhtml += '<div style="text-align: left;">';
invitationhtml += '<strong> Please confirme my community </strong>  <br>  <br>';
invitationhtml += 'Community Title: '+community_tagline+'  <br>  <br>';
invitationhtml += 'Community Name: '+community_name+'  <br>   <br>';
invitationhtml += '<br><br><div></div>';
invitationhtml += '<br> <br> © Copyright 2018 - iTribe </div></td></tr></table><br><br></td></tr></table></body></html>';

const msg = {
  to: 'info@itribe.us',
  from: 'info@itribe.us',
  subject: 'iTribe Community Admin Approval Mail',
  text: 'Welcome to iTribe Dear Community Title Community Name Owner Name Copyright 2018 - iTribe ',
  html: invitationhtml,
};

        sgMail.send(msg);



            res.json(rows[0]);

        } else {

            res.json([]);
        }

    });

            }

        });
 
     
     connection.release();

    });

});


// Add to Contact

app.post('/api/addtocontact', function(req, res, next) {

    db.getConnection(function(err, connection) {

            var postBody 	= req.body.task; 

            var name 		= postBody.name;
            var subject 	= postBody.subject;
            var email 		= postBody.email;
            var message 	= postBody.message;
            var status 		= 1;          



     connection.query('INSERT INTO `itribe_contact` (`name`, `subject`, `email`, `message`, `status`) ' +
      'VALUES (?, ? , ?, ?, ?)',[name, subject, email, message, status], function(err, rows) {

     console.log(err);
     
    if (rows.affectedRows) {

      connection.query("SELECT * FROM itribe_contact WHERE contact_id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {



            var htmlContent = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body style="padding: 0; margin:0; background:#F4FBFD;font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:0px 15px 10px 15px;">';
htmlContent += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" style=""><br><br>';
htmlContent += '<table width="600" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" bgcolor="#fff" style="border-radius: 0.375rem; box-shadow: 12px 15px 20px 0 rgba(46, 61, 73, 0.15); padding:50px " >';
htmlContent += '<div><img src="/images/logo.jpg"></div><br>';
htmlContent += '<div style=" border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; color: #000; font-size: 48px; padding: 4px 0;"><b>Welcome to iTribe</b></div> <br>';
htmlContent += '<div><h2 style="font-size: 17px;  text-align: left;">Dear iTribe,</h2></div>';
htmlContent += '<div style="text-align: left;">';
htmlContent += '<strong> Name </strong> : '+name+' <br>  <br>';
htmlContent += '<strong> Subject </strong> : '+subject+' <br>  <br>';
htmlContent += '<strong> Email </strong> : '+email+' <br>  <br>';
htmlContent += '<strong> Message </strong> : '+message+' <br>  <br>';
htmlContent += '<br><br><div></div>';
htmlContent += '<br> <br> © Copyright 2018 - iTribe </div></td></tr></table><br><br></td></tr></table></body></html>';


                const msg = {
                to: 'info@itribe.us',
                from: email,
                subject: 'iTribe Help Contact Request Mail',
                text: 'Dear iTribe, Name Subject Email Message',
                html: htmlContent,
                };

                sgMail.send(msg);



            res.json(rows[0]);

        } else {

            res.json([]);
        }

    });

            }

        });
 
     connection.release();

    });

});

// verify email section Done

app.get('/api/verifyemailservice', (req, res) => {

    db.getConnection(function(err, connection) {
        
    var postBody     = req.query;   

    //console.log("request",postBody);       

    var user_id      = postBody.uid;    
    var hashkey      = postBody.hashkey;     
    

    connection.query("SELECT * FROM itribe_users WHERE id = '" + user_id + "' and password = '"+hashkey+"' ", function(err, rows) {
    
    console.log(err);
    
     if (!err && rows.length > 0) {

        connection.query("update itribe_users set status = '1'  WHERE id = " + user_id + " and password = '"+hashkey+"' ", function (error, results, fields) {
        if (error) throw error;            
            //res.send({ msg: 'Successfully verified' });        
            res.send(rows);
        });
     }
       else
     {
            res.send({ msg: 'Not verified. Please Try Again...' });
     }       

    });

    connection.release();
 
  });

});

// end 


// registration join  

app.post('/api/registerjoin', function(req, res, next) {

    db.getConnection(function(err, connection) {

        var postBody = req.body.task;    

       // console.log(postBody.username);
        // res.json(postBody);

        var name     = postBody.username;
        var email    = postBody.email;
        var password = postBody.inckey;
        var invitation_id = postBody.invitation_id;
        var community_id = postBody.community_id;
        var location = '';
        var status   = 1;


    connection.query('SELECT * from itribe_users where email="'+email+'" ', function(err, rows) {
  

            if (!err && rows.length > 0) {
                
                //res.send({ msg: 'Email Id Already exists' });

                        var userid = rows[0].id;

        // insert member

    connection.query('INSERT INTO `itribe_commu_members` (`commun_id`, `user_id`, `user_join_status`, `status`) ' +
        'VALUES (?, ? , ?, ?)',[community_id, userid, 1, 1], function(err1, rows1) {

        console.log(err1);

        if (rows1.affectedRows) {

        connection.query("SELECT * FROM itribe_commu_members WHERE commun_rel_id='" + rows1.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

        res.send({ msg: 'Email Id Already exists And Successfully Joined' });

        } else {
        	
        	res.json([]);

        }

        });

        }

        });   // end join insert query 


            } else {


   connection.query("INSERT INTO itribe_users (name, email, password, location, status) VALUES ('" + name + "','" + email + "','"+password+"','"+location+"','"+status+"')", function(err, rows) {

    // console.log(err);
     
    if (rows.affectedRows) {

        var userid = rows.insertId;

        // insert member

    connection.query('INSERT INTO `itribe_commu_members` (`commun_id`, `user_id`, `user_join_status`, `status`) ' +
        'VALUES (?, ? , ?, ?)',[community_id, userid, 1, 1], function(err1, rows1) {

        console.log(err1);

        if (rows1.affectedRows) {

        connection.query("SELECT * FROM itribe_commu_members WHERE commun_rel_id='" + rows1.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

        res.send({ msg: 'Successfully Joined' });

        } else {

        res.json([]);
        }
        });
        }

        });   // end join insert query 


        // end insert join members



            }

        });

        
        } // end else account already exists condition
    });

    
    connection.release();

  });

});


// registration DONE mail pending 

app.post('/api/register', function(req, res, next) {

    db.getConnection(function(err, connection) {

        var postBody = req.body.task;    

        console.log(postBody.username);
        // res.json(postBody);

        var name     = postBody.username;
        var email    = postBody.email;
        var password = postBody.inckey;
        var location = '';
        var status 	 = 0;


    connection.query('SELECT * from itribe_users where email="'+email+'" ', function(err, rows) {
  

            if (!err && rows.length > 0) {
                
                res.send({ msg: 'Email Id Already exists' });

            } else {


   connection.query("INSERT INTO itribe_users (name, email, password, location, status) VALUES ('" + name + "','" + email + "','"+password+"','"+location+"','"+status+"')", function(err, rows) {

    // console.log(err);
     
    if (rows.affectedRows) {

        var userid = rows.insertId;
      connection.query("SELECT * FROM itribe_users WHERE id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

               // var htmlContent = '<html>Hi, '+name+' , <br/> <strong> Please click on verify link  <a href="'+base_s_url+'/verifyemail/'+userid+'/'+password+' " > VERIFY </a>  </strong></html>';

            var htmlContent = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body style="padding: 0; margin:0; background:#F4FBFD;font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:0px 15px 10px 15px;">';
htmlContent += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" style=""><br><br>';
htmlContent += '<table width="600" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" bgcolor="#fff" style="border-radius: 0.375rem; box-shadow: 12px 15px 20px 0 rgba(46, 61, 73, 0.15); padding:50px " >';
htmlContent += '<div><img src="/images/logo.jpg"></div><br>';
htmlContent += '<div style=" border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; color: #000; font-size: 48px; padding: 4px 0;"><b>Welcome to iTribe</b></div> <br>';
htmlContent += '<div><h2 style="font-size: 17px;  text-align: left;">Dear '+name+',</h2></div>';
htmlContent += '<div style="text-align: left;">';
htmlContent += '<strong> Please click on verify link</strong> <br>  <br>';
htmlContent += '<br><br><div><a href="'+base_s_url+'/verifyemail/'+userid+'/'+password+'" style="color: #3ba700; font-size: 16px; text-transform: capitalize;"> VERIFY </a></div>';
htmlContent += '<br> <br> © Copyright 2018 - iTribe </div></td></tr></table><br><br></td></tr></table></body></html>';


                const msg = {
                to: email,
                from: 'info@itribe.us',
                subject: 'iTribe Email Verification Mail',
                text: 'Dear, '+name+', Please click on verify link ',
                html: htmlContent,
                };

                sgMail.send(msg);

            res.json(rows[0]);

        } else {

            res.json([]);
        }

    });
            }

        });

        
        } // end else account already exists condition
    });

     connection.release();

  });

});


// registration DONE mail pending 

app.post('/api/registerfb', function(req, res, next) {

    db.getConnection(function(err, connection) {

        var postBody = req.body;    

        console.log(postBody.username);
        // res.json(postBody);

        var name     = postBody.username;
        var email    = postBody.email;
        var password = postBody.inckey;
        var usertype = postBody.usertype;
        var dob = postBody.birthday;
        var gender   = postBody.gender;
        var location = '';
        var status   = 1;


    connection.query('SELECT * from itribe_users where email="'+email+'" ', function(err, rows) {
  

            if (!err && rows.length > 0) {
                
                res.json(rows[0]);

            } else {


   connection.query("INSERT INTO itribe_users (name, email, password, location, status , user_type, dob, gender) VALUES ('" + name + "','" + email + "','"+password+"','"+location+"','"+status+"' , '"+usertype+"', '"+dob+"' ,'"+gender+"')", function(err, rows) {

     console.log(err);
     
    if (rows.affectedRows) {

        var userid = rows.insertId;
      connection.query("SELECT * FROM itribe_users WHERE id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

            res.json(rows[0]);

        } else {

            res.json([]);
        }

    });

            }

        });

        
        } // end else account already exists condition
    });

    connection.release();

  });

});


// newpassword


app.post('/api/newpasswordreq', (req, res) => {

    db.getConnection(function(err, connection) {
        
    var postBody     = req.body.task;   

    //console.log("request",postBody);       

    var user_id      = postBody.uid;    
    var hashkey      = postBody.hashkey;     
    var inckey       = postBody.inckey;     
    
    

    connection.query("SELECT * FROM itribe_users WHERE id = '" + user_id + "' and password = '"+hashkey+"' ", function(err, rows) {
    
    console.log(err);
    
     if (!err && rows.length > 0) {



        connection.query("update itribe_users set password= '"+inckey+"' , status = '1'  WHERE id = " + user_id + " and password = '"+hashkey+"' ", function (error, results, fields) {
        if (error) throw error;            
            res.send({ msg: 'Successfully changed' });        
        });
     }
       else
     {
        res.send({ msg: 'Not Changed. Please Try Again...' });
     }

    });

    connection.release();
 
  });

});


// forgetpassword 


app.post('/api/forgetpassword', function(req, res, next) {

   var postBody = req.body.task;

    //console.log(postBody);

    db.getConnection(function(err, connection) {       
       
        
    var email    = postBody.email;         

    connection.query('SELECT * from itribe_users where email="'+email+'" ', function(err, rows) {

          
          console.log(err);

            if (!err && rows.length > 0) {
                
                var userid   = rows[0]['id'];
                var password = rows[0]['password'];
                var name = rows[0]['name'];

                var htmlContent = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body style="padding: 0; margin:0; background:#F4FBFD;font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#000000; padding:0px 15px 10px 15px;">';
htmlContent += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" style=""><br><br>';
htmlContent += '<table width="600" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valign="top" bgcolor="#fff" style="border-radius: 0.375rem; box-shadow: 12px 15px 20px 0 rgba(46, 61, 73, 0.15); padding:50px " >';
htmlContent += '<div><img src="/images/logo.jpg"></div><br>';
htmlContent += '<div style=" border-bottom: 1px solid #ddd; border-top: 1px solid #ddd; color: #000; font-size: 48px; padding: 4px 0;"><b>Welcome to iTribe</b></div> <br>';
htmlContent += '<div><h2 style="font-size: 17px;  text-align: left;">Dear '+name+',</h2></div>';
htmlContent += '<div style="text-align: left;">';
htmlContent += '<strong> Please click on change password link</strong> <br>  <br>';
htmlContent += '<br><br><div><a href="'+base_s_url+'/newpassword/'+userid+'/'+password+'" style="color: #3ba700; font-size: 16px; text-transform: capitalize;"> Change Password </a></div>';
htmlContent += '<br> <br> © Copyright 2018 - iTribe </div></td></tr></table><br><br></td></tr></table></body></html>';


                const msg = {
                to: email,
                from: 'info@itribe.us',
                subject: 'iTribe Forgot Password Mail',
                text: 'Dear, '+name+', Please click on change password link ',
                html: htmlContent,
                };

                sgMail.send(msg);

                res.json(rows);

            } else {
                res.json([]);
            }
        });

connection.release();

    });

});

// login DONE

app.post('/api/login', function(req, res, next) {

   var postBody = req.body.task;

    //console.log(postBody);

    db.getConnection(function(err, connection) {       
       
        
        var email    = postBody.email;
        var password = postBody.inckey;

      var bytes  = SHA256(password);
      var plaintext = bytes.toString();
      var inckey   = plaintext;

        connection.query('SELECT * from itribe_users where email="'+email+'" and password="'+inckey+'" and status="1"', function(err, rows) {

          
          console.log(err);

            if (!err && rows.length > 0) {
                res.json(rows);
            } else {
                res.json([]);
            }
        });

connection.release();

    });

});

// Admin Services

// Update Updatecommunity 

app.get('/api/communitystatusadmin', function(req, res, next) {

    db.getConnection(function(err, connection) {

            var postBody = req.query;    

            //console.log(postBody);      

        var commun_id           = postBody.commun_id;
        var user_id             = postBody.user_id;
        var community_status    = postBody.statusset;

    connection.query('update `itribe_community` set `community_status` = "'+community_status+'"   where community_id = "'+commun_id+'" ', function(err, rows) {

     console.log(err); 

        var user_join_status   = 1;
        var status             = 1;

        connection.query('INSERT INTO `itribe_commu_members` (`commun_id`, `user_id`, `user_join_status`, `status`) ' +
        'VALUES (?, ? , ?, ?)',[commun_id, user_id, user_join_status, status], function(err1, rows1) {

                console.log(err1);

                res.send({ msg: 'Successfully Updated' }); 

            });   // end join insert query 
              
        });
 
 connection.release();

    });

});


// Admin login DONE

app.post('/api/alogin', function(req, res, next) {

   var postBody = req.body.task;

    //console.log(postBody);

    db.getConnection(function(err, connection) {       
       
        
        var email    = postBody.email;
        var password = postBody.inckey;

        connection.query('SELECT * from itribe_admin where email="'+email+'" and password="'+password+'" and status="1"', function(err, rows) {
       
          console.log(err);

            if (!err && rows.length > 0) {
                res.json(rows);
            } else {
                res.json([]);
            }
        });

connection.release();

    });

});


// Get user data by id DONE

app.get('/api/getUserByIdOne', (req, res) => {

    db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var uid          = postBody.uid;

    connection.query('SELECT * from itribe_users where id=? limit 1',[uid], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results[0]));
    }); 

    connection.release();

    });
});

// Get user data by id DONE

app.get('/api/getUserById', (req, res) => {

      db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var uid          = postBody.uid;

    connection.query('SELECT * from itribe_users where id=?',[uid], function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
  
    //res.send({ express: 'Hello From Express' });
    //res.send({ one: 'Express 1', two : 'Express 2', three : 'Express 3' , four : 'Express 4' });

     connection.release();

    });
});

// Use in user managment 

app.get('/api/users', (req, res) => {

      db.getConnection(function(err, connection) {

    connection.query('SELECT * from itribe_users', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
  
    //res.send({ express: 'Hello From Express' });
    //res.send({ one: 'Express 1', two : 'Express 2', three : 'Express 3' , four : 'Express 4' });

     connection.release();

   });
});

app.get('/api/hello', (req, res) => {

 db.getConnection(function(err, connection) {
/*const msg = {
  to: 'ankit.sharma@nanowebtech.com',
  from: 'ankit.sharma@nanowebtech.com',
  subject: 'Sending iTribe Mail Testing',
  text: 'iTribe Mail Testing',
  html: '<strong>iTribe Mail Testing</strong>',
};
sgMail.send(msg);*/


    connection.query('SELECT * from itribe_users', function (error, results, fields) {
    if (error) throw error;
    res.send(JSON.stringify(results));
    });
  
  	//res.send({ express: 'Hello From Express' });
  	//res.send({ one: 'Express 1', two : 'Express 2', three : 'Express 3' , four : 'Express 4' });

     connection.release();

   });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;