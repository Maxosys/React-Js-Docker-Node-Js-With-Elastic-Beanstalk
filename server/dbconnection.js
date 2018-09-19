var mysql=require('mysql');
var connection=mysql.createPool({

 host:'localhost',
 user:'root',
 password:'',
 database:'iapp'
 
});

connection.getConnection(function(err, connection) {
  	
  	if(err)
  	{
  		console.log("database error ",err);	
  	}
  	else
  	{
  		console.log("Database Connected");		
  	}
  //console.log("database error ",err);

});

connection.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

 module.exports=connection;