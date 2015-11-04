Parse.initialize("WzUXlRK0hdHZMwe1WYRPz5WLB3j7TnD62rtUSh1O", "JY5CpRASKqkyHhml2aDg84tqITAtdz8PobqIpWvT");
var ReviewObject = Parse.Object.extend('ReviewObject');

// loading page elements & event listeners
window.onload = function() {
	$("#write").submit(function() {
	    var entry = new ReviewObject();
	    // entry.set("rating", $("#writeStars").raty("rating"));  // couldn't get to work
	    entry.set("rating", $("#writeStars").val());  
	    entry.set("title", $("#writeTitle").val());
	    entry.set("desc", $("#writeDesc").val());
	    entry.set("upvotes", "0");
	    entry.set("downvotes", "0");
	    entry.save();
 	})
   
    grabData();
};

// retrieves and displays the current reviews 
function grabData() {
    var reviewCount = 0; 
	var starCount = 0; 
    var search = new Parse.Query(ReviewObject);
    search.matches("desc", "[\s\S]*");
    search.find({
        success:function(result) {
		    for (var i = 0; i < result.length; i++) {
			    // creates elements
			    var divContainer = document.createElement("div");
			    $(divContainer).addClass("container");
			    var h4Title = document.createElement("h4");
			    var pDesc = document.createElement("p");
			    var spanRating = document.createElement("span");
			    
			    // appends elements
			    $(h4Title).append(result[i].get("title"));
			    $(pDesc).append(result[i].get("desc"));
			    $(divContainer).append(h4Title);
			    $(divContainer).append(createRating(spanRating, result[i].get("rating")));
			    $(divContainer).append(pDesc);
			    $(divContainer).append(createVoting(result[i].get("upvotes"), result[i].get("downvotes"), i));
			    $("#reviewlist").append(divContainer);

			    // updates counters
			    starCount += parseInt(result[i].get("rating"));
			    reviewCount++;
	    	}
	    	var avgRatingSpan = document.createElement("span");
		    $("#avgrating").append(createRating(avgRatingSpan, Math.round(starCount / reviewCount), reviewCount));
        }
    })
}

// creates the stars
function createRating(spanRating, rating, reviewCount) {
    for (var i = 0; i < 5; i++) {
        if (i < rating) 
            $(spanRating).append("&#9733;");
        else 
            $(spanRating).append("&#9734;");
    }
    return $(spanRating).text();
}

// creates the voting section
function createVoting(upvoteCount, downvoteCount, n) {
    var divVoting = document.createElement("div");
    $(divVoting).addClass("voting");

    // creates upvote and downvote buttons
    var upvote = document.createElement("a");
    $(upvote).addClass("upvote");
    $(upvote).html("Upvote ");
    var downvote = document.createElement("a");
    $(downvote).addClass("downvote");
    $(downvote).html("Downvote ");

    // displays number of upvotes and downvotes
    var upCounter = document.createElement("span");
    $(upCounter).addClass("upCounter");
    $(upCounter).html(upvoteCount + " &nbsp; ");
    upCounter.id = "upvote" + n;
    var downCounter = document.createElement("span");
    $(downCounter).addClass("downCounter");
    $(downCounter).html(downvoteCount);
    downCounter.id = "downvote" + n;
    // event listeners
    upvote.onclick = function() {
        upvoteListener(n);
    };
    downvote.onclick = function() {
        downvoteListener(n);
    };

    $(divVoting).append(upvote);
    $(divVoting).append(upCounter);
    $(divVoting).append()
    $(divVoting).append(downvote);
    $(divVoting).append(downCounter);
    return divVoting;
}

// updates Parse with upvote count
function upvoteListener(n) {
    var search = new Parse.Query(ReviewObject);
    search.matches("desc", "[\s\S]*");
    search.find({
        success:function(data) {
    		var thisone = data[n];
    		var upvote = parseInt(thisone.get("upvotes")) + 1;
            data[n].set("upvotes", upvote.toString());
            $("#upvote" + n).html(parseInt(data[n].get("upvotes")));
            data[n].save();
        }
    })
}

// updates Parse with upvote count
function downvoteListener(n) {
    var search = new Parse.Query(ReviewObject);
    search.matches("desc", "[\s\S]*");
    search.find({
        success:function(data) {
            var thisone = data[n];
            var downvote = parseInt(thisone.get("downvotes")) + 1;
            data[n].set("downvotes", downvote.toString());
            $("#downvote" + n).html(parseInt(data[n].get("downvotes")));
            data[n].save();
        }
    })
}


