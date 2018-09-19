var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
var db = require('./dbconnection');


// Update profile pic

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './build/uploads/users/',
  filename: function(req, file, cb){
   
    var user_id = req.body.user_id;
    var finalfilename = user_id+'_userpic.jpg';

    //cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    cb(null,finalfilename);
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/api/upload-profile-image', function(req, res, next) {

   db.getConnection(function(err, connection) {

    console.log('handling profile image');
     upload(req, res, (err) => {
    if(err){
      console.log('first err', err);
      res.send({
        msg: err
      });
    } else {
      if(req.file == undefined){
        console.log('Error: No File Selected!')
        res.send({
          msg: 'Error: No File Selected!'
        });
      } else {
        console.log('File Uploaded!')
        res.send({
          msg: 'File Uploaded!',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });

connection.release();

   });

});

router.get('/api/hello1',function(req,res,next){

    res.send({ express: 'Hello From Express' });

});


// Add library component 




// Set Storage Engine
var storagecom = multer.diskStorage({
  destination: './build/uploads/library/',
  filename: function(req, file, cb){
    
   
    //var user_id = req.body.user_id;
    //var finalfilename = user_id+'_userpic.jpg';

    cb(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    //cb(null,finalfilename);
  }
});

// Init Upload
const uploadcompo = multer({
  storage: storagecom,
  limits:{fileSize: 1000000000},
  fileFilter: function(req, file, cb){
    checkFileTypeLib(file, cb);
  }
}).single('libfiles');

// Check File Type
function checkFileTypeLib(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|mp4/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/api/addlibcomponent', function(req, res, next) {

   db.getConnection(function(err, connection) {

    console.log('handling profile image');
     uploadcompo(req, res, (err) => {
    if(err){
      console.log('first err', err);
      res.send({
        msg: err
      });
    } else {
      if(req.file == undefined){
        console.log('Error: No File Selected!')
        res.send({
          msg: 'Error: No File Selected!'
        });
      } else {
        console.log('File Uploaded!')         

        console.log(req.file);

         var community_id     = req.body.cid;
         var library_subtitle = req.body.library_tagline;
         var library_desc     = req.body.library_desc;
         var user_id          = req.body.user_id;        
         var filename         = req.file.filename;
         var file_extension   = req.file.mimetype;
         var status           = 1;
         var originalname     = req.file.originalname;


    connection.query('INSERT INTO `itribe_library` (`community_id`, `library_subtitle`, `library_desc`, `user_id`, `filename`, `file_extension`, `status`, `originalname`) ' +
      'VALUES (?, ? , ?, ?, ?, ?, ? ,?)',[community_id, library_subtitle, library_desc, user_id, filename, file_extension, status, originalname], function(err, rows) {

     console.log(err);
     
    if (rows.affectedRows) {

      connection.query("SELECT * FROM itribe_library WHERE library_id='" + rows.insertId + "' LIMIT 1", function(err, rows) {

        if (!err && rows.length > 0) {

            res.json(rows[0]);
        
        } else {

            res.json([]);

        }
              });

            }

        });         

            // end here insert data
       
      }
    }
  });

connection.release();

   });

});


// get Community Library Componant data

router.get('/api/getlibdata', (req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var cid      = postBody.cid;  
   
      var result = [];
      var commIdArr = [];


    connection.query("SELECT * FROM itribe_library il,itribe_users iu WHERE il.user_id = iu.id and il.community_id='"+cid+"' ", function(err, rows) {
    
      console.log(err);

    //res.send({ express: 'Hello From Express' });
            
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

// get Community Library Componant data

router.get('/api/getlibdatabyid', (req, res) => {

     db.getConnection(function(err, connection) {

    var postBody     = req.query;                 
    var cid      = postBody.cid;  
    var libid      = postBody.libid;  
   
      var result = [];
      var commIdArr = [];


    connection.query("SELECT * FROM itribe_library il,itribe_users iu WHERE il.user_id = iu.id and il.library_id='"+libid+"' ", function(err, rows) {
    
      console.log(err);

    //res.send({ express: 'Hello From Express' });
            
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


 module.exports=router;