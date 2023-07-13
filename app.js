const express  = require("express");
const bodyParser = require("body-parser");//to parse the JSON
const request = require("request");//to make http calls
const https = require("https");

const app = express(); //set up the server

//push the static files in the local system to server
app.use(express.static("public"));

//use the body parser
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res) {
    //response is send the file signup.html
    res.sendFile(__dirname + "/signup.html");
});

//post method to retrieve data
app.post("/",function(req,res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailBox;
    
    //create a javascript object for mailchimp api
    const data = {
        members: [
            {
                //members is array of objects
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //term the data into JSON
    const jsonData = JSON.stringify(data);

    //send the JSON to mailchimp
    //post data to external resource using https
    const url = {MAILCHIMP} ;
    const options = {
        method : "POST",
        auth:{insert API Key}
    }
    //log the response after parsing
    const request = https.request(url, options, function(response) {

        if(response.statusCode == 200) {
            //the process is successfull!!
            res.sendFile(__dirname + "/success.html");
        }
        else {
            //failure
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data) {
            console.log(JSON.parse(data));
        });
    });
    //send to mail chimp
    request.write(jsonData);
    request.end();
});

//post request for failure route
//which will redirect to home route
app.post("/failure",function(req,res) {
    res.redirect("/");
});

//set the server to port 3000 or heroku deployment
//heroku will define a dynamic port
//or to make it listen both

app.listen(process.env.PORT || 3000,function(){
    console.log("Server up and running on PORT 3000");
});



