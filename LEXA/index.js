var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var bCrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var router = require('./router.js');
var Authrouter = require('./Authrouter.js');
const upload = require('express-fileupload');
var moment = require('moment');

// const app = express()
// const app = express()
app.use(upload())

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname + '/index.html')
// })

app.post('/upl',(req,res)=>{
    if(req.files){
        console.log(req.files)
        var file = req.files.file
        global.filename = file.name
        console.log(filename)

        file.mv('./upload/'+filename, function(err){
            if(err){
                res.send(err)
            }else{
                // res.send("File Uploaded")
            }
        })
        // return res.redirect('/autoposting');
    }
})

// ----------------
// py3 page 

// pages_show_list
// pages_read_engagement
// pages_read_user_content
// pages_manage_posts
// pages_manage_engagement
// ----------------

  app.get('/astatus', function (request, response) {
    // return response.send(request.query);
    
    var FB = require('fb');
    FB.setAccessToken('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');
  
    var body = request.query.msg;
    FB.api(`${request.query.id}/feed`, 'post', { message: body }, function (res) {
        if (!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post Id: ' + res.id);
        global.postid = res.id;
        var mysql = require('mysql');
        var con = mysql.createConnection({
          host: 'localhost', // Replace with your host name
          user: 'root',      // Replace with your database username
          password: '',      // Replace with your database password
          database: 'seven'
        });
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Status","'+postid+'")';

          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
        });
    });

    return response.redirect('/autoposting');

    
  });
  
  app.get('/aimage', function (request, response) {
  
    var FB = require('fb');
    const fs = require('fs');
    const  stream =  fs.createReadStream(`./upload/${filename}`);
    FB.setAccessToken    ('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');
  
    var body = request.query.msg;
    FB.api(`${request.query.id}/photos`, 'post', { message : body , picture: stream }, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.id);
      global.postid = res.id;
      var mysql = require('mysql');
      var con = mysql.createConnection({
        host: 'localhost', // Replace with your host name
        user: 'root',      // Replace with your database username
        password: '',      // Replace with your database password
        database: 'seven'
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Image","'+postid+'")';
         
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    });

    return response.redirect('/autoposting');

  });

  app.get('/avideo', function (request, response) {

    var FB = require('fb');
    const fs = require('fs');
    const  stream =  fs.createReadStream(`./upload/${filename}`);
    FB.setAccessToken('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');

    var body = request.query.msg;
    FB.api(`${request.query.id}/videos`, 'post', { description : body, picture: stream }, function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('Post Id: ' + res.id);
      global.postid = res.id;
        var mysql = require('mysql');
        var con = mysql.createConnection({
          host: 'localhost', // Replace with your host name
          user: 'root',      // Replace with your database username
          password: '',      // Replace with your database password
          database: 'seven'
        });
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Video","'+postid+'")';
           
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
        });
    });

    return response.redirect('/autoposting');

  });

  app.get('/lead', function (req, response) {

    'use strict';
    const bizSdk = require('facebook-nodejs-business-sdk');
    const Lead = bizSdk.Lead;
    const request = require("request");
    const access_token =     'EAAGaT5ZAkg9oBAGip2F9Ew6yCi6d3d4IldF4msHUm6THfSDBIgmMIJz62b8FZBUerufjsLfnojzjp351aZBZADgsQXrUaZAhkpNanZBSsIZBCZCwc8HheEmsV57kKCTLL    f7m5wwunoaFkONYLGu5vLRBOSSY306HC0YWkxCtM554dDByttR7FniG';
    const id = req.query.id;
    const api = bizSdk.FacebookAdsApi.init(access_token);
    var mysql = require('mysql');

    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "third"
    });

    request({
      url : `https://graph.facebook.com/v9.0/${id}?fields=&access_token=${access_token}`,
      json : true
    },(err , response , body) => {
      var data = JSON.stringify(body, undefined , 4)
      console.log(data)
      var datas = JSON.parse(data)
      console.log(datas)
      console.log(datas.created_time)
      console.log(datas.field_data[1])
   
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = 'INSERT INTO thirdd (time, ledid , email , emailvalue , name , namevalue , phone , phonevalue , city , cityvalue , bday , bdayvalue) VALUES ("'+datas.created_time+'","'+datas.id+'","'+datas.field_data[0].name+'","'+datas.field_data[0].values+'","'+datas.field_data[1].name+'","'+datas.field_data[1].values+'","'+datas.field_data[2].name+'","'+datas.field_data[2].values+'","'+datas.field_data[3].name+'","'+datas.field_data[3].values+'","'+datas.field_data[4].name+'","'+datas.field_data[4].values+'")';
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    });
    return response.redirect('/dashboard');
  });
  app.get('/leaddash', function(req, res, next) {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
      host: 'localhost', // Replace with your host name
      user: 'root',      // Replace with your database username
      password: '',      // Replace with your database password
      database: 'third' // // Replace with your database Name
    }); 
    conn.connect(function(err) {
      if (err) throw err;
      console.log('Database is connected successfully !');
    });
    var sql='SELECT * FROM thirdd';
    conn.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('Lead/lead', { title: 'User List', userData: data});
    console.log(data)
  });
  });
  app.get('/post', function(req, res, next) {
    var mysql = require('mysql');
    var conn = mysql.createConnection({
      host: 'localhost', // Replace with your host name
      user: 'root',      // Replace with your database username
      password: '',      // Replace with your database password
      database: 'seven' // // Replace with your database Name
    }); 
    conn.connect(function(err) {
      if (err) throw err;
      console.log('Database is connected successfully !');
    });
    var sql='SELECT * FROM sevenn';
    conn.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('Post/post', { title: 'User List', userData: data});
    console.log(data)
  });
  });
// Access public folder from root
app.post('/scheduler', (req, res) => {

  var FB = require('fb');
  const fs = require('fs');
  const body = req.body.caption;
  console.log(body);
  const  stream =  fs.createReadStream(`./upload/${filename}`);
  const c = req.body.birthdaytime;
  console.log(c)
  const ti = moment(c).unix();
  console.log(ti) //console.log(stream)
  FB.setAccessToken('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');

  FB.api('me/photos', 'post', { message: body, picture: stream, scheduled_publish_time: ti, published: 'false' }, function(res) {
      if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
      }
      console.log('Post Id: ' + res.id);
  });
  res.end('Post sucessfull')
});

app.get('/astatussche', function (request, response) {
  // return response.send(request.query);
  
  var FB = require('fb');
  const c = request.query.birthdaytime;
  console.log(c)
  const ti = moment(c).unix();
  FB.setAccessToken('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');

  var body = request.query.msg;
  FB.api(`${request.query.id}/feed`, 'post', { message: body , scheduled_publish_time: ti, published: 'false' }, function (res) {
      if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
      }
      console.log('Post Id: ' + res.id);
      global.postid = res.id;
      var mysql = require('mysql');
      var con = mysql.createConnection({
        host: 'localhost', // Replace with your host name
        user: 'root',      // Replace with your database username
        password: '',      // Replace with your database password
        database: 'seven'
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Status","'+postid+'")';

        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
  });

  return response.redirect('/autopostingscheduler');

  
});

app.get('/aimagesche', function (request, response) {
  
  var FB = require('fb');
  const fs = require('fs');
  const c = request.query.birthdaytime;
  console.log(c)
  const ti = moment(c).unix();
  const  stream =  fs.createReadStream(`./upload/${filename}`);
  FB.setAccessToken    ('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');

  var body = request.query.msg;
  FB.api(`${request.query.id}/photos`, 'post', { message : body , picture: stream , scheduled_publish_time: ti, published: 'false' }, function (res) {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
    global.postid = res.id;
    var mysql = require('mysql');
    var con = mysql.createConnection({
      host: 'localhost', // Replace with your host name
      user: 'root',      // Replace with your database username
      password: '',      // Replace with your database password
      database: 'seven'
    });
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Image","'+postid+'")';
       
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  });

  return response.redirect('/autopostingscheduler');

});

app.get('/avideosche', function (request, response) {

  var FB = require('fb');
  const fs = require('fs');
  const c = request.query.birthdaytime;
  console.log(c)
  const ti = moment(c).unix();
  const  stream =  fs.createReadStream(`./upload/${filename}`);
  FB.setAccessToken('EAAFwQThccMwBAL4tPwXd9KLLyXYMj9Dnepddp9sQ0oPOBSexwp4xr9opVd1lu4PcsFmxfqchdMRLEpLaiazUUAgD51qCUKcQFeK2BXOyVHqm0ZAxmsxrYyimh9epMtCDXgkkeGljZCCTUEslLCK1cqZBZCBAWNVHzHXpxJfQvXRFORM7sYSL');

  var body = request.query.msg;
  FB.api(`${request.query.id}/videos`, 'post', { description : body, picture: stream , scheduled_publish_time: ti, published: 'false'  }, function (res) {
    if(!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log('Post Id: ' + res.id);
    global.postid = res.id;
      var mysql = require('mysql');
      var con = mysql.createConnection({
        host: 'localhost', // Replace with your host name
        user: 'root',      // Replace with your database username
        password: '',      // Replace with your database password
        database: 'seven'
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = 'INSERT INTO sevenn (post_type,post_id) VALUES ("Video","'+postid+'")';
         
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
  });

  return response.redirect('/autopostingscheduler');

});

app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
  res.render('view');
});

// Add Authentication Route file with app
app.use('/', Authrouter); 

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Add Route file with app
app.use('/', router); 

http.listen(8000, function(){
  console.log('listening on *:8000');
});