

$(function(){
  $('form').on('submit', function(e){  //Default function to make page not reload on any submit form buttons
    e.preventDefault();
  });
  $('#mp3_player').hide();

//-----DISPLAYING MUSIC LIST-----
  $.ajax({
    url: "http://localhost:3000/api/",
    type: "GET",
    dataType : "json",
  })
  .done(function( data ) {
     console.log(data)
     for(var i=0; i<data.length; i++){   //loops through data, and for each data, print out the following. Also pass the data's id to the container, edit, and delete button
        var id = $('<p>').text("Id:" + data[i]._id);
        var title = $('<p>').text("Title:" + data[i].originalname);
        var play = $('<button>').data('Data-id', data[i]._id).text('Play').on('click', playSong); //creates edit button with donut id and carries a function editDonut in which we will define later

        // var edit = $('<button>').data('Donut-id', data[i].id).text('Edit').on('click', editDonut); //creates edit button with donut id and carries a function editDonut in which we will define later
        var del = $('<button>').data('Data-id', data[i]._id).text('Delete').on('click', deleteMusic);  //creates delete button with donut id and carries a function deleteDonut in which we will define later
        var container = $('<div>').attr('Data-id', data[i]._id);
        $(container).append(id, title, play, del); //append all the paragraphs and buttons to a div container
        $('body').append(container) //lastly, append the container to the body tag for it to appear
     }
  });

  function playSong() {
    console.log('playing')
    var MusicId = $(this).data('Data-id');
    console.log(MusicId);
    $.ajax({
        url: 'http://localhost:3000/api/'+MusicId,
        method: 'GET',
        success: function(data){

          $('#mp3_player').show();
          console.log('show working')
          play(MusicId);
        },
        error: function(data) {
        }
    })
  }

  // //-----DELETE MUSIC-----
    function deleteMusic(){
      var MusicId = $(this).data('Data-id');  //grab specific donut id from the 'delete button' (remember we passed it earlier when we created the button?)
        $.ajax({
          url: 'http://localhost:3000/api/'+MusicId, //pass the DonutId variable you defined two lines above that carries the specific id
          method: 'DELETE',
          success: function(data){
            $('div[Data-id="'+MusicId+'"]').remove(); //remember your div container contains a specific id when we create it? we pass it the DonutId variable with specific id, so now it looks for a div with THAT id, then removes it entirely
          },
          error: function(data) {
        }
      })
    }




//-----------------VISUALS----------------
var play = function(id) {
  console.log('play function working')
  var audio = new Audio();
  audio.src = 'http://localhost:3000/api/'+id+'/media';
  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous'

  console.log('created audio controls')
  //establish all variables that analyser will Use
  var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
  //initialize mp3 player after pages loads all html
  // window.addEventListener("load", initMp3Player, true);

  console.log('asdfasdf')
  initMp3Player();

  console.log('playing music'
)
  function initMp3Player(){

    console.log('play bars 0')

    //SETTING UP OUR MUSIC PLAYGROUND
    document.getElementById('audio_box').appendChild(audio); //grabs our music src and put it in our audio_box div
    context = new AudioContext(); // we need a container or playground where all the audio lives. It provides access to Web Audio API. It is an interface that represents audio-processing graph built from audio modules linked together. defines how the audio stream flows from its source (often an audio file) to its destination (often your speakers). As audio passes through each node, its properties can be modified or inspected. The simplest audio context is a connection directly form a source node to a destination node.
  	analyser = context.createAnalyser(); // we need to be able to extract data from audio source and creates analyserNodes, which includes audio time and frequency and allows to create animations

    //SETTING UP OUR CANVAS BOARD
    canvas = document.getElementById('analyser_render'); //we neeed a canvas which is a graphics drawing board. Here we are targeting analyser_render which gives it dimensions, etc. defining our canvas
  	ctx = canvas.getContext('2d'); //ctx stands for context. This initializes its 2d context for drawing

    //GRABBING THE MUSIC
    source = context.createMediaElementSource(audio); //this method allows us to create a node from an HTML Audio element, given that there is one
    source.connect(analyser); //this connects the music grabbed above, creates nodes so we can manipulate it with visuals
    analyser.connect(context.destination); //this produces sound from your music file by connecting the analyser to the source

    console.log('play bars')

    frameLooper(); //play this function for the vsuals

    console.log('play bars 2')
  //ANIMATING OUR MUSIC
  // frameLooper() animates any style of graphics you wish to the audio frequency
  // Looping at the default frame rate that the browser provides(approx. 60 FPS)
  function frameLooper(){
  	window.requestAnimationFrame(frameLooper);
  	fbc_array = new Uint8Array(analyser.frequencyBinCount);
  	analyser.getByteFrequencyData(fbc_array);
  	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  	 ctx.fillStyle = 'rgba(163, 48, 155, 0.5)'; // Color of the bars
  	bars = 100;
  	for (var i = 0; i < bars; i++) {
  		bar_x = i * 4;
  		bar_width = 3;
  		bar_height = -(fbc_array[i] / 2);
  		//  fillRect( x, y, width, height ) // Explanation of the parameters below
      ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
      	}
      }
    }




}


});







//
// //-----DELETE DONUT-----
//   function deleteDonut(){
//     var DonutId = $(this).data('Donut-id');  //grab specific donut id from the 'delete button' (remember we passed it earlier when we created the button?)
//       $.ajax({
//         url: 'https://api.doughnuts.ga/doughnuts/'+DonutId, //pass the DonutId variable you defined two lines above that carries the specific id
//         method: 'DELETE',
//         success: function(data){
//           $('div[donut-data-id="'+DonutId+'"]').remove(); //remember your div container contains a specific id when we create it? we pass it the DonutId variable with specific id, so now it looks for a div with THAT id, then removes it entirely
//         },
//         error: function(data) {
//         }
//       })
//     }
//
// //-----UPDATING DONUT-----
//     function editDonut(){
//       var DonutId = $(this).data('Donut-id');  //Grabs the id when we click on the edit button as a specific id is attached to the edit button when we created it
//       $('#save-donut').attr('donut-data-id', DonutId); //we now pass that id again to the 'save donut' button
//       $('#edit').show(); //when we click on edit button, the edit form will show
//     }
//
//     $('#save-donut').on('click', function(){
//       var DonutId = $('#save-donut').attr('donut-data-id'); //we are using the id attached to the 'save-donut' button earlier
//       $.ajax({
//         url: 'https://api.doughnuts.ga/doughnuts/'+DonutId, //pass DonutId here
//         method: 'PATCH',
//         data: {
//           style: $('#input1').val(),  //Grab user input data for style
//           flavor: $('#input2').val()  //grab user input data for flavor
//         },
//         success: function(data){
//           console.log(data);
//           $('div[donut-data-id="'+DonutId+'"] > p:eq(1)').text('Style:'+data.style);  //pass the donutId here. now we look for div container with this id, append style data to the SECOND paragraph we find in this div. First paragraph contains the ID
//           $('div[donut-data-id="'+DonutId+'"] > p:eq(2)').text('Favor:'+data.flavor); //pass the donutId here. now we look for div container with this id, append flavor data to the THIRD paragraph we find in this div
//           $('#edit').hide(); //after we hit the save button, hide the edit form
//         }
//       });
//     });
//
//     //-----CREATE DONUT-----
//     $('#new').on('click', function(){
//       $('#new-form').show();  //when you click on the new button, the new form appears
//       $('#create-donut').on('click', function(){ //when you hit the create button.....
//         $.ajax({
//             url: 'http://api.doughnuts.ga/doughnuts',
//             method: 'POST',
//             data: {
//               style: $('#input1').val(),  //grabs user input for style
//               flavor: $('#input2').val()  //grabs user input for flavor
//             },
//             success: function(data){  //if successful upon grabbing data
//               console.log(data);
//               var p1 = $('<p>').text("Id:" + data.id);  //create a few paragraphs and then pass in what user have inputted into the form via .text. Same jazz as before. append it to container, then to body
//               var p2 = $('<p>').text("Style:"+data.style);
//               var p3 = $('<p>').text("Flavor: " + data.flavor);
//               var edit = $('<button>').data('Donut-id', data.id).text('Edit').on('click', editDonut);
//               var del = $('<button>').data('Donut-id', data.id).text('Delete').on('click', deleteDonut);
//               var container = $('<div>').attr('donut-data-id', data.id);
//               $(container).append(p1, p2, p3, edit, del);
//               $('body').append(container);
//               $('#new-form').hide();  //when new donut is created when user clicks create, hide the 'new form'
//             }
//         })
//       })
//     })
//
//
// })
