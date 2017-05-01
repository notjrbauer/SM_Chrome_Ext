console.log("Activated");

//Add css modal to page
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('w3.css');
(document.head||document.documentElement).appendChild(style);
var id = 0;
//1 is more conservative, -1 is more liberal
//http://www.truthrevolt.org/sites/default/files/images/kP4Yax1.jpg
var media_vals = {"the-guardian":-1, "the-new-yorker":-2, "vice": -1, "the-guardian":0, "time":0, "bbc":0, "new-york-times":1, "forbes":2,
"sports-illustrated":0, "cbs-sports":0};
// [("wall_street",0),("npr",0),("bbc",0),("new_york_times",-1),("cnn",-1),("usa_today",0),("economist",1),("fxn",2),("info_wars",3),
// ("breibart",3),("the_guardian",-1),("slate",-2),("vox",-2),("atlantic",-2),("msnbc",-2),("huffington_post",-2),("occupy_democrats",3)];
var valid_links = ["cnn","fxn","trib","occupydemocrats"];
//adding news box when any a is hovered over
//var created_box_already = false;

$( 'a' ).on({
    mouseenter:function() {
    event.preventDefault();
		//id = id + 1;
		//get the text out of this so we can say that it has to be a cnn link then we can grab url as shown below and use that to find related URLS

		var element = $(this);
		var article_link = element[0].href;
		for (var index = 0; index < valid_links.length; index++) {
		if(article_link.indexOf(valid_links[index]) != -1){
			var url = $(this);
			var article_title = $(url[0]).prev(0).text();
			var data = '{"text":"'+article_title.substring(0, article_title.length-12)+'"}';
			//http://cnn.it/2oZRWAW
		//Make AJAX REQUEST
		// only in white subheading can mouse be in
		console.log(article_title);
		if( (article_title!="") && (article_title!=null) && (article_title.indexOf(' ') >= 0) ){
					console.log("HOVERING");
		$.ajax({
            type: "POST", //or GET
            url: 'https://news-api.lateral.io/documents/similar-to-text',
            data: data,
            contentType: 'application/json',
            headers: {
            	'subscription-key': '218622d4fbf2eb1c9c3321f2e87e5225'
            },
            crossDomain:true,
            cache:false,
            async:false,
            success: function(msg){
                //call createNewsBox function
              article_1 = msg[0];
              article_2 = msg[1];
              article_3 = msg[3];
              console.log(msg);
              //if(!created_box_already){
								createNewsBox({
								"id" : id,
								"news_1_img" : article_1.image,
								"news_2_img" : article_2.image,
								"news_3_img" : article_3.image,
								"source_slug_1" : article_1.source_slug,
								"source_slug_2" : article_2.source_slug,
								"source_slug_3" : article_3.source_slug,
								"news_1_heading" : article_1['title'],
								"news_2_heading" : article_2['title'],
								"news_3_heading" : article_3['title'],
								"news_1_url" : article_1['url'],
								"news_2_url" : article_2['url'],
								"news_3_url" : article_3['url']
								},function(container) {
									$("body").append(container);
									$('#modal_'+id).show();
								});
						//}
						//else{
							// populateNewsBox({
							// 	"id" : id,
							// 	"news_1_img" : article_1.image,
							// 	"news_2_img" : article_2.image,
							// 	"news_3_img" : article_3.image,
							// 	"news_1_heading" : article_1['title'],
							// 	"news_2_heading" : article_2['title'],
							// 	"news_3_heading" : article_3['title'],
							// 	"news_1_url" : article_1['url'],
							// 	"news_2_url" : article_2['url'],
							// 	"news_3_url" : article_3['url']
							// 	});
						//}
           },
           error:function(jxhr){
               console.log(jxhr.responseText);
                //do some thing
           }
     });
		}
		}
	}
		}
  });

// function populateNewsBox(data){
// 	console.log("Ryan");
// 	$(".news-1-heading").text(data.news_1_heading);
// 	$(".news-2-heading").text(data.news_2_heading);
// 	$(".news-3-heading").text(data.news_3_heading);
// 	$("#img_news_1").attr('src', data.news_1_img);
// 	$("#img_news_2").attr('src', data.news_2_img);
// 	$("#img_news_3").attr('src', data.news_3_img);
// 	$( "#img_news_1" ).remove( "a" );
// 	$( "#img_news_2" ).remove( "a" );
// 	$( "#img_news_3" ).remove( "a" );
// 	$("#img_news_1").wrap($('<a>',{
//    href: data.news_1_url
// 	 }));
// 	$("#img_news_2").wrap($('<a>',{
//    href: data.news_2_url
// 	 }));
// 	$("#img_news_3").wrap($('<a>',{
//    href: data.news_3_url
// 	 }));
// 	$('#modal_'+id).show();
// }

function set_meter(source){
		chrome.storage.sync.get("score", function(data) {
		var score = media_vals[source];
		var new_val = data["score"] + score;
		console.log(new_val);
		chrome.storage.sync.set({'score': new_val}, function() {
          // Notify that we saved.
          console.log('Settings saved');
        });

		});

	// console.log(currentScore);

	// console.log(score);
	// console.log("THE NEW SCORE IS!!!!");
	// console.log(new_val);

}

// function getScore(){
// 	chrome.storage.sync.get("score", function(data) {return data["score"];});
// }

function createNewsBox(data,callback) {
	//container for three images and main container
	var container = $('<div id="modal_'+data.id+'"class="news-container modal">');
	var container_modal_content = $('<div class="modal-content">');
	container_modal_content.appendTo(container);


	var close = $('<span class="close">');
	close.text("CLOSE");
	close.appendTo(container_modal_content);
	var news_1_container = $('<div class="news-1-container">');
	var news_2_container = $('<div class="news-2-container">');
	var news_3_container = $('<div class="news-3-container">');
	news_1_container.appendTo(container_modal_content);
	news_2_container.appendTo(container_modal_content);
	news_3_container.appendTo(container_modal_content);
	//append three titles to each news box container
	// add headings to each box
	var news_1_heading = $('<div class="news-1-heading">');
	var news_2_heading = $('<div class="news-2-heading">');
	var news_3_heading = $('<div class="news-3-heading">');
	news_1_heading.appendTo(news_1_container);
	news_2_heading.appendTo(news_2_container);
	news_3_heading.appendTo(news_3_container);
	$('.news-1-heading').empty();
	$('.news-2-heading').empty();
	$('.news-3-heading').empty();
	$('.news-1-heading').text(data.news_1_heading);
	$('.news-2-heading').text(data.news_2_heading);
	$('.news-3-heading').text(data.news_3_heading);


	d = new Date();
	//create three img and append to boxes
	var img_news_1 = $('<img id="img_news_1">');
	$('#img_news_1').attr('src', data.news_1_img + '?r=' + Math.random());
	img_news_1.attr('height', "20px");
	img_news_1.attr('width', "20px");
	img_news_1.appendTo(news_1_container);
	//$('#img_news_1').unwrap();
	img_news_1.wrap("<a href='" + data.news_1_url + "' target='_blank'</a>");
	img_news_1.click(function(){set_meter(data.source_slug_1);});

	var img_news_2 = $('<img id="img_news_2">');
	$('#img_news_2').attr('src', data.news_2_img + '?r=' + Math.random());
	img_news_2.attr('src', data.news_2_img);
	img_news_2.attr('height', "20px");
	img_news_2.attr('width', "20px");
	img_news_2.appendTo(news_2_container);
	//$('#img_news_2').unwrap();
	img_news_2.wrap("<a href='" + data.news_2_url + "' target='_blank'</a>");
	img_news_2.click(function(){set_meter(data.source_slug_2);
	});

	var img_news_3 = $('<img id="img_news_3">');
	$('#img_news_3').attr('src', data.news_3_img + '?r=' + Math.random());
	img_news_3.attr('src', data.news_3_img);
	img_news_3.attr('height', "20px");
	img_news_3.attr('width', "20px");
	img_news_3.appendTo(news_3_container);
	if ( $('#img_news_3').parent().is( "a" ) ){
	console.log("UNWRAPPING!!!!");
	$('#img_news_3').unwrap();
	}
	$('#img_news_3').wrap("<a href='" + data.news_3_url + "'target='_blank' </a>");

	img_news_3.click(function(){
		set_meter(data.source_slug_3);
	});
	//add links to meter(data.source_slug)
	// $("#img_news_1").wrap($('<a id="news_1_url">',{
 //    href: data.news_1_url
	//  }));
	// $("#img_news_2").wrap($('<a id="news_2_url">',{
 //   href: data.news_2_url
	//  }));
	// $("#img_news_3").wrap($('<a id="news_3_url">',{
 //   href: data.news_3_url
	//  }));

	//add meter element
	var meter = $('<meter class="meter">');
	var div = $('<div>');
	meter.attr('min', -50);
	meter.attr('max', 50);
	chrome.storage.sync.get("score", function(data) {
		meter.attr('value', data['score']);
		div.text("Liberal-Conservative");
		meter.appendTo(div);
		div.appendTo(container_modal_content);
	});


	//track which link they click on
	// $( "#img_news_1" ).click(function() {
	//   //get val from array and add to score stored in browswer
	//   console.log("1");
	// });
	// $( "#img_news_2" ).click(function() {
	//   //get val from array and add to score stored in browswer
	// });
	// $( "#img_news_3" ).click(function() {
	//   //get val from array and add to score stored in browswer
	// });
	// created_box_already = true;
	$( close ).on( "click", function() {
      $("#modal_0").hide();
	});

  callback(container);
}


//});