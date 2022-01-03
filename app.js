const express = require('express');
const app = express();

const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const ejs = require('ejs');
app.set('view-engine', 'ejs');
app.use(express.static("public"));
const _ = require("lodash");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true,useUnifiedTopology: true }); 

const postschema = new mongoose.Schema({
    name: { 
        type:String,
        require:true
    },
    title :{
        type:String,
        require:true
    },
    post :{
        type:String,
        require:true
    }
});

const Post = mongoose.model("Post",postschema);
//const post = [];

app.get("/", function(req,res){
    res.render("index.ejs");
});

app.get("/latest",function(req,res)
{
    Post.find(function(err,posts)
    {
        if(!err)
        res.render("home.ejs",{title : "Home", newpost : posts  });
    });
})
app.get("/about", function(req,res){

     res.render("about.ejs",{routecontent:aboutContent,title : "About"});
});
app.get("/contacts", function(req,res){

     res.render("contacts.ejs",{routecontent:contactContent,title : "Contacts"});
});
app.get("/compose", function(req,res){

     res.render("compose.ejs",{routecontent:contactContent,title : "Report"});
});
// app.get("/post/:postTitle",function(req,res)
// {
   
// //     const pt = _.capitalize(req.params.postTitle);
// //     console.log(pt);
// //    post.forEach(function(thispost)
// //    {
// //        if(thispost.title===pt)
// //        {
// //            res.render("post.ejs",{routecontent:thispost.post,title : pt})
// //        }
// //    });
// });
app.get("/post/:postID",function(req,res)
{
    const reqd = req.params.postID;
    Post.findById({_id : reqd },function(err,thispost)
    {
        //postID = thispost.title;
       // console.log(postID);
        res.render("post.ejs",{ routecontent : thispost.post , title : thispost.title , _id : thispost._id })
    });
});

app.post("/compose", function(req,res){
    // const postdetails = {
    //     title : _.capitalize(req.body.postTitle),
    //     post : req.body.post
    // };
    // post.push(postdetails);
    //console.log(postdetails);
    //res.redirect('/');

    const postdetails = new Post({
        title : (req.body.postTitle),
        post : req.body.post
    });
    
    postdetails.save(function(err)
    {
        if(!err)
        res.redirect('/latest');
    });

});

app.post('/delete/:id',(req,res)=>{

    const reqd = req.params.id;
  
    Post.findByIdAndRemove(reqd, (err)=>{
      res.redirect('/latest');
    });
});

app.get('/update/:id' , (req,res)=>{

    const reqd = req.params.id;
  
    Post.findById(reqd, (err,doc)=>{
      res.render("update.ejs" , {thispost : doc ,title: doc.title});

    })
});
  
app.post('/update/:id' , (req,res)=>{
    const reqd = req.params.id; 
    
    const updatedTitle = req.body.title;
    const updatedBody = req.body.post;
  
    Post.findByIdAndUpdate(reqd,{title : updatedTitle , post : updatedBody} , (err,doc)=>{
      res.redirect('/post/' + reqd);
    });
});

app.listen(3000, function()
{
    console.log("server started running at port 3000....");
});
