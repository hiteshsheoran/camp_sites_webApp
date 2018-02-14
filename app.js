var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDB();


app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campgrounds",function(req,res){
	//get all campgrounds from database
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log("error");
		} else{
			console.log("working");
			res.render("index",{campgrounds:allCampgrounds});
		}
	});
});

app.post("/campgrounds",function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name:name ,image:image,description:desc};
	//create a new campground and save to db
	Campground.create(newCampground,function(err,newlycreated){
		if(err){
			console.log("error");
		} else{
			//console.log("working");
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new",function(req, res){
	res.render("new");
});

app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log("error");
		} else{
			console.log(foundCampground);
			res.render("show",{campground:foundCampground});
		}
	});
});

app.listen(3000,function(){
	console.log("serving at port 3000!");
});