(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	//.force("center", d3.forceCenter(width / 2, height / 2))
	.force("collide", forceCollide);


  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "CivilWar.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);


	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  
    		.alpha(0.7)                                          
    		.restart();                                         
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 72)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("72% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 172)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 28)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("28% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 84)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("84% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 184)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 16)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("16% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Captain America: Civil War")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$1,151,684,349")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();



(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "FindingDory.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 58)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("58% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 158)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 42)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("42% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 47)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("47% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 147)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 53)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("53% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Finding Dory")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$1,022,617,376")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();






(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "Zootopia.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 62)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("62% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 162)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 38)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("38% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 54)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("54% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 154)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 46)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("46% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Zootopia")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$1,019,922,983")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();




(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "Junglebook.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 79)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("79% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 179)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 21)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("21% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 90)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("90% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 190)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 10)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("10% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("The Jungle Book")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$963,901,123")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();



(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "SecretLifeofPets.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 73)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("73% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 173)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 27)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("27% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 81)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("81% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 181)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 19)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("19% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("The Secret Life of Pets")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$870,184,167")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();





(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "BatmanVSuperman.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 76)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("76% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 176)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 24)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("24% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 77)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("77% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 177)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 23)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("23% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Batman Vs. Superman")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$868,160,194")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();






(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "RogueOne.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 91)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("91% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 191)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 9)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("9% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 83)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("83% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 183)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 17)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("17% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Rogue One")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$829,107,837")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();




(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "Deadpool.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 71)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("71% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 171)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 29)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("29% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 83)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("83% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 183)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 17)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("17% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Deadpool")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$783,770,709")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();





(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "FantasticBeasts.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 68)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("68% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 168)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 32)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("32% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 68)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("68% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 168)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 32)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("32% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Fantastic Beasts")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$778,465,796")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();






(function() {
var width = 300,
    height = 300;

var svg = d3.select("#chart")
	.append("svg")
	.attr("height", height)
	.attr("width", width)
	.append("g")
	.attr("transform", "translate(0,0)")

var radiusScale = d3.scaleSqrt().domain([1, 4692]).range([1, 40])

var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
        .strength(0.2);

var forceXCombine = d3.forceX((width)/2).strength(0.1)

var forceCollide = d3.forceCollide(function(d){
		return radiusScale(d.Total_Words) + 1
	})
	.iterations(10);

var simulation = d3.forceSimulation()
	.force("x", forceXCombine)
	.force("y", d3.forceY((height / 3) + 10).strength(0.15))
	.force("collide", forceCollide)	

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "darkgray")
    .style("border-radius", "6px")
    .style("font", "11")
    .style("font-family", "Quattrocento Sans")
    .style("text-anchor", "middle")
    .text("");  



d3.queue()
	.defer(d3.csv, "SuicideSquad.csv")
	.await(ready)


function ready (error, datapoints) {
	datapoints.forEach(d => d.Total_Words = +d.Total_Words);

	var mousemove = function() {
          		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      		}

    var mouseout = function(){return tooltip.style("visibility", "hidden");} 

	var circles = svg.selectAll(".Character")
	.data(datapoints)
	.enter().append("circle")
	.attr("class", "Character")
	.attr("r", function(d){
		return radiusScale(d.Total_Words)
	})
	.style("fill", d => d.Sex === "male" ? "#3b3f93" : "#ff4a6b")
	.on("mouseover", function(d) {
              tooltip.html(d.Character + "<br><br> Words Spoken: " + d.Total_Words);
              tooltip.style("visibility", "visible");
      })
    .on("mousemove", mousemove)
   	.on("mouseout", mouseout);

	

/// Adding Toggle Switches	
	
	var onClick = function(){
		simulation 
    		.force("x", atRight ? forceXSplit : forceXCombine)  // 1. Set the force
    		.alpha(0.7)                                           // 2. Reheat
    		.restart();                                         // 3. Restart
   		setAtRight(!atRight);
	}

	var atRight = true

	var rect = svg.append("rect")
            .attr("x", 7)
            .attr("y", 7)
            .attr("rx", 22)
            .attr("ry", 22)
            .style("fill", "lightgray")
            .attr("width", 64)
            .attr("height", 40)
            .on("click", onClick)

    var circle = svg.append("circle")
            .attr("cx", 27)
            .attr("cy", 27)
            .attr("r", 16)
            .style("fill", "white")
			.on("click", onClick)
				

    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(250)
                .attr("cx", (atRight? (27) : (51)))
                .style("fill", "white");
        rect.transition().duration(250)
        		.style("fill", atRight? "lightgray" : "#ff4a6b");  
    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };

  		

    var line = svg.append("line")          
    	.style("stroke", "darkgray") 
    	.attr("x1", width/2)    
    	.attr("y1", 235)      
    	.attr("x2", width/2)     
    	.attr("y2", 285);

    var maleCharacters = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#3b3f93")
    		.attr("width", 78)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("78% Male Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove) 
      		.on("mouseout", mouseout);

    var femaleCharacters = svg.append("rect")
    		.attr("x", 178)
    		.attr("y", (height * (2/3) + 45))
    		.style("fill", "#ff4a6b")
    		.attr("width", 22)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("22% Female Characters");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var maleWords = svg.append("rect")
    		.attr("x", 100)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#3b3f93")
    		.attr("width", 68)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("68% Male Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);

    var femaleWords = svg.append("rect")
    		.attr("x", 168)
    		.attr("y", (height * (2/3) + 65))
    		.style("fill", "#ff4a6b")
    		.attr("width", 32)
    		.attr("height", 10)
    		.on("mouseover", function(d) {
              tooltip.html("32% Female Dialogue");
              tooltip.style("visibility", "visible");
      		})
      		.on("mousemove", mousemove)
      		.on("mouseout", mouseout);	


    var iconC = svg.append("text")
  			.attr("x",83)
  			.attr("y", (height * (2/3) + 55))
  			.attr("font-family","FontAwesome")
  			.attr("font-size", 16)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf183'; }); 		

  	var iconW = svg.append("text")
  			.attr("x", 80)
  			.attr("y", (height * (2/3) + 75))
  			.attr("font-family", "FontAwesome")
  			.attr("font-size", 14)
  			.attr("fill", "darkgray")
  			.text(function(d) { return '\uf075'; })	

 	var movie = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3)))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento')
 			.text("Suicide Squad")
	
	var gross = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height * (2/3) + 25))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.text("$746,100,054")	

 	var fifty = svg.append("text")
 			.attr("class", "titles")
 			.attr("x", width/2)
 			.attr("y", (height - 5))
 			.style("text-anchor", "middle")
 			.attr("font-family", 'Quattrocento Sans')
 			.attr("font-size", 9)
 			.attr("fill", "darkgray")
 			.text("50")	
			
   
	simulation.nodes(datapoints)
		.on('tick', ticked)


	function ticked() {
		circles
			.attr("cx", function(d) {
				return d.x
			})
			.attr("cy", function(d) {
				return d.y
			})
	}	
}		
})();







