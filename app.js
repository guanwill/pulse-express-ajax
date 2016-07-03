$(function(){
  $('form').on('submit', function(e){  //Default function to make page not reload on any submit form buttons
  e.preventDefault();
});
$('#mp3_player').hide();
// $('#new-form').hide();

//-----DISPLAYING MUSIC LIST-----
$.ajax({
  url: "http://localhost:3000/api/",
  type: "GET",
  dataType : "json",
  })
  .done(function( data ) {
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
  var MusicId = $(this).data('Data-id');
  $.ajax({
    url: 'http://localhost:3000/api/'+MusicId,
    method: 'GET',
    success: function(data){

      $('#mp3_player').show();
      play(MusicId);
    },
    error: function(data) {
    }
  })
}

//-----DELETE MUSIC-----
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

//-----CREATE MUSIC-----

// $('#new').on('click', function(){
  //       $('#new-form').show();  //when you click on the new button, the new form appears
  $('#upload').on('click', function(){ //when you hit the create button.....

var formData = new FormData($('#new-form')[0]);

$.ajax({
  url: 'http://localhost:3000/api/',
  method: 'POST',
  data: formData,
  contentType: false,
  processData: false,
  mimeType: "multipart/form-data",
  success: function(data){  //if successful upon grabbing data
  console.log(data);
  var id = $('<p>').text("Id:" + data._id);
  var title = $('<p>').text("Title:" + data.originalname);
  var play = $('<button>').data('Data-id', data._id).text('Play').on('click', playSong); //creates edit button with donut id and carries a function editDonut in which we will define later

  // var edit = $('<button>').data('Donut-id', data[i].id).text('Edit').on('click', editDonut); //creates edit button with donut id and carries a function editDonut in which we will define later
  var del = $('<button>').data('Data-id', data._id).text('Delete').on('click', deleteMusic);  //creates delete button with donut id and carries a function deleteDonut in which we will define later
  var container = $('<div>').attr('Data-id', data._id);
  $(container).append(id, title, play, del); //append all the paragraphs and buttons to a div container
  $('body').append(container) //lastly, append the container to the body tag for it to appear
  $('#new-form').hide();  //when new donut is created when user clicks create, hide the 'new form'
}
    })
  })
// })










//-----------------VISUALS----------------
var play = function(id) {
  var audio = new Audio();
  audio.src = 'http://localhost:3000/api/'+id+'/media';
  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous'

  //establish all variables that analyser will Use
  var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
  //initialize mp3 player after pages loads all html
  // window.addEventListener("load", initMp3Player, true);

  initMp3Player();

  console.log('playing music'
  )
  function initMp3Player(){


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

            frameLooper(); //play this function for the vsuals

            //ANIMATING OUR MUSIC
            // frameLooper() animates any style of graphics you wish to the audio frequency
            // Looping at the default frame rate that the browser provides(approx. 60 FPS)
            function frameLooper(){
              window.requestAnimationFrame(frameLooper);
              fbc_array = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(fbc_array);
              ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
              ctx.fillStyle = 'rgba(80, 60, 190, 0.9)'; // Color of the bars
              bars = 200;
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
        // Animation js
        // var media = [
          //   MusicId
          //   ],
          //   fftSize = 1024,
          //   // [32, 64, 128, 256, 512, 1024, 2048]

          //   background_color = "rgba(0, 0, 1, 1)",
          //   background_gradient_color_1 = "#000011",
          //   background_gradient_color_2 = "#060D1F",
          //   background_gradient_color_3 = "#02243F",

          //   stars_color = "#465677",
          //   stars_color_2 = "#B5BFD4",
          //   stars_color_special = "#F451BA",
          //   TOTAL_STARS = 1500,
          //   STARS_BREAK_POINT = 140,
          //   stars = [],

          //   waveform_color = "rgba(29, 36, 57, 0.05)",
          //   waveform_color_2 = "rgba(0,0,0,0)",
          //   waveform_line_color = "rgba(157, 242, 157, 0.11)",
          //   waveform_line_color_2 = "rgba(157, 242, 157, 0.8)",
          //   waveform_tick = 0.05,
          //   TOTAL_POINTS = fftSize / 2,
          //   points = [],

          //   bubble_avg_color = "rgba(29, 36, 57, 0.1)",
          //   bubble_avg_color_2 = "rgba(29, 36, 57, 0.05)",
          //   bubble_avg_line_color = "rgba(77, 218, 248, 1)",
          //   bubble_avg_line_color_2 = "rgba(77, 218, 248, 1)",
          //   bubble_avg_tick = 0.001,
          //   TOTAL_AVG_POINTS = 64,
          //   AVG_BREAK_POINT = 100,
          //   avg_points = [],

          //   SHOW_STAR_FIELD = true,
          //   SHOW_WAVEFORM = true,
          //   SHOW_AVERAGE = true,

          //   AudioContext = (window.AudioContext || window.webkitAudioContext),
          //   floor = Math.floor,
          //   round = Math.round,
          //   random = Math.random,
          //   sin = Math.sin,
          //   cos = Math.cos,
          //   PI = Math.PI,
          //   PI_TWO = PI * 2,
          //   PI_HALF = PI / 180,

          //   w = 0,
          //   h = 0,
          //   cx = 0,
          //   cy = 0,

          //   playing = false,
          //   startedAt, pausedAt,

          //   rotation = 0,
          //   msgElement = document.querySelector('#loading .msg'),
          //   avg, ctx, actx, asource, gainNode, analyser, frequencyData, frequencyDataLength, timeData;

          // window.addEventListener('load', initialize, false);
          // window.addEventListener('resize', resizeHandler, false);

          // function initialize() {
            //   if (!AudioContext) {
              //     return featureNotSupported();
              //   }

              //   ctx = document.createElement('canvas').getContext('2d');
              //   actx = new AudioContext();

              //   document.body.appendChild(ctx.canvas);

              //   resizeHandler();
              //   initializeAudio();
              // }

              // function featureNotSupported() {
                //   hideLoader();
                //   return document.getElementById('no-audio').style.display = "block";
                // }

                // function hideLoader() {
                  //   return document.getElementById('loading').className = "hide";
                  // }

                  // function updateLoadingMessage(text) {
                    //   msgElement.textContent = text;
                    // }

                    // function initializeAudio() {
                      //   var xmlHTTP = new XMLHttpRequest();

                      //   updateLoadingMessage("- Loading Audio Buffer -");

                      //   xmlHTTP.open('GET', media[0], true);
                      //   xmlHTTP.responseType = "arraybuffer";

                      //   xmlHTTP.onload = function(e) {
                        //     updateLoadingMessage("- Decoding Audio File Data -");
                        //     analyser = actx.createAnalyser();
                        //     analyser.fftSize = fftSize;
                        //     analyser.minDecibels = -100;
                        //     analyser.maxDecibels = -30;
                        //     analyser.smoothingTimeConstant = 0.8;

                        //     actx.decodeAudioData(this.response, function(buffer) {
                          //       console.timeEnd('decoding audio data');

                          //       msgElement.textContent = "- Ready -";

                          //       audio_buffer = buffer;
                          //       gainNode = actx.createGain();

                          //       gainNode.connect(analyser);
                          //       analyser.connect(actx.destination);

                          //       frequencyDataLength = analyser.frequencyBinCount;
                          //       frequencyData = new Uint8Array(frequencyDataLength);
                          //       timeData = new Uint8Array(frequencyDataLength);

                          //       createStarField();
                          //       createPoints();
                          //       createAudioControls();
                          //     }, function(e) {
                            //       alert("Error decoding audio data" + e.err);
                            //     });
                            //   };

                            //   xmlHTTP.send();
                            // }

                            // function createAudioControls() {
                              //   var playButton = document.createElement('a');

                              //   playButton.setAttribute('id', 'playcontrol');
                              //   playButton.textContent = "pause";
                              //   document.body.appendChild(playButton);

                              //   playButton.addEventListener('click', function(e) {
                                //     e.preventDefault();
                                //     this.textContent = playing ? "play" : "pause";
                                //     toggleAudio();
                                //   });

                                //   playAudio();
                                //   hideLoader();
                                // }

                                // function toggleAudio() {
                                  //   playing ? pauseAudio() : playAudio();
                                  // }

                                  // function playAudio() {
                                    //   playing = true;
                                    //   startedAt = pausedAt ? Date.now() - pausedAt : Date.now();
                                    //   asource = null;
                                    //   asource = actx.createBufferSource();
                                    //   asource.buffer = audio_buffer;
                                    //   asource.loop = true;
                                    //   asource.connect(gainNode);
                                    //   pausedAt ? asource.start(0, pausedAt / 1000) : asource.start();

                                    //   animate();
                                    // }

                                    // function pauseAudio() {
                                      //   playing = false;
                                      //   pausedAt = Date.now() - startedAt;
                                      //   asource.stop();
                                      // }

                                      // function getAvg(values) {
                                        //   var value = 0;

                                        //   values.forEach(function(v) {
                                          //     value += v;
                                          //   })

                                          //   return value / values.length;
                                          // }

                                          // function clearCanvas() {
                                            //   var gradient = ctx.createLinearGradient(0, 0, 0, h);

                                            //   gradient.addColorStop(0, background_gradient_color_1);
                                            //   gradient.addColorStop(0.96, background_gradient_color_2);
                                            //   gradient.addColorStop(1, background_gradient_color_3);

                                            //   ctx.beginPath();
                                            //   ctx.globalCompositeOperation = "source-over";
                                            //   ctx.fillStyle = gradient;
                                            //   ctx.fillRect(0, 0, w, h);
                                            //   ctx.fill();
                                            //   ctx.closePath();

                                            //   gradient = null;
                                            // }

                                            // function drawStarField() {
                                              //   var i, len, p, tick;

                                              //   for (i = 0, len = stars.length; i < len; i++) {
                                                //     p = stars[i];
                                                //     tick = (avg > AVG_BREAK_POINT) ? (avg / 20) : (avg / 50);
                                                //     p.x += p.dx * tick;
                                                //     p.y += p.dy * tick;
                                                //     p.z += p.dz;

                                                //     p.dx += p.ddx;
                                                //     p.dy += p.ddy;
                                                //     p.radius = 0.2 + ((p.max_depth - p.z) * .1);

                                                //     if (p.x < -cx || p.x > cx || p.y < -cy || p.y > cy) {
                                                  //       stars[i] = new Star();
                                                  //       continue;
                                                  //     }

                                                  //     ctx.beginPath();
                                                  //     ctx.globalCompositeOperation = "lighter";
                                                  //     ctx.fillStyle = p.color;
                                                  //     ctx.arc(p.x + cx, p.y + cy, p.radius, PI_TWO, false);
                                                  //     ctx.fill();
                                                  //     ctx.closePath();
                                                  //   }

                                                  //   i = len = p = tick = null;
                                                  // }

                                                  // function drawAverageCircle() {
                                                    //   var i, len, p, value, xc, yc;

                                                    //   if (avg > AVG_BREAK_POINT) {
                                                      //     rotation += -bubble_avg_tick;
                                                      //     value = avg + random() * 10;
                                                      //     ctx.strokeStyle = bubble_avg_line_color_2;
                                                      //     ctx.fillStyle = bubble_avg_color_2;
                                                      //   } else {
                                                        //     rotation += bubble_avg_tick;
                                                        //     value = avg;
                                                        //     ctx.strokeStyle = bubble_avg_line_color;
                                                        //     ctx.fillStyle = bubble_avg_color;
                                                        //   }

                                                        //   ctx.beginPath();
                                                        //   ctx.lineWidth = 1;
                                                        //   ctx.lineCap = "round";

                                                        //   ctx.save();
                                                        //   ctx.translate(cx, cy);
                                                        //   ctx.rotate(rotation);
                                                        //   ctx.translate(-cx, -cy);

                                                        //   ctx.moveTo(avg_points[0].dx, avg_points[0].dy);

                                                        //   for (i = 0, len = TOTAL_AVG_POINTS; i < len - 1; i++) {
                                                          //     p = avg_points[i];
                                                          //     p.dx = p.x + value * sin(PI_HALF * p.angle);
                                                          //     p.dy = p.y + value * cos(PI_HALF * p.angle);
                                                          //     xc = (p.dx + avg_points[i + 1].dx) / 2;
                                                          //     yc = (p.dy + avg_points[i + 1].dy) / 2;

                                                          //     ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
                                                          //   }

                                                          //   p = avg_points[i];
                                                          //   p.dx = p.x + value * sin(PI_HALF * p.angle);
                                                          //   p.dy = p.y + value * cos(PI_HALF * p.angle);
                                                          //   xc = (p.dx + avg_points[0].dx) / 2;
                                                          //   yc = (p.dy + avg_points[0].dy) / 2;

                                                          //   ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
                                                          //   ctx.quadraticCurveTo(xc, yc, avg_points[0].dx, avg_points[0].dy);

                                                          //   ctx.stroke();
                                                          //   ctx.fill();
                                                          //   ctx.restore();
                                                          //   ctx.closePath();

                                                          //   i = len = p = value = xc = yc = null;
                                                          // }

                                                          // function drawWaveform() {
                                                            //   var i, len, p, value, xc, yc;

                                                            //   if (avg > AVG_BREAK_POINT) {
                                                              //     rotation += waveform_tick;
                                                              //     ctx.strokeStyle = waveform_line_color_2;
                                                              //     ctx.fillStyle = waveform_color_2;
                                                              //   } else {
                                                                //     rotation += -waveform_tick;
                                                                //     ctx.strokeStyle = waveform_line_color;
                                                                //     ctx.fillStyle = waveform_color;
                                                                //   }

                                                                //   ctx.beginPath();
                                                                //   ctx.lineWidth = 1;
                                                                //   ctx.lineCap = "round";

                                                                //   ctx.save();
                                                                //   ctx.translate(cx, cy);
                                                                //   ctx.rotate(rotation)
                                                                //   ctx.translate(-cx, -cy);

                                                                //   ctx.moveTo(points[0].dx, points[0].dy);

                                                                //   for (i = 0, len = TOTAL_POINTS; i < len - 1; i++) {
                                                                  //     p = points[i];
                                                                  //     value = timeData[i];
                                                                  //     p.dx = p.x + value * sin(PI_HALF * p.angle);
                                                                  //     p.dy = p.y + value * cos(PI_HALF * p.angle);
                                                                  //     xc = (p.dx + points[i + 1].dx) / 2;
                                                                  //     yc = (p.dy + points[i + 1].dy) / 2;

                                                                  //     ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
                                                                  //   }

                                                                  //   value = timeData[i];
                                                                  //   p = points[i];
                                                                  //   p.dx = p.x + value * sin(PI_HALF * p.angle);
                                                                  //   p.dy = p.y + value * cos(PI_HALF * p.angle);
                                                                  //   xc = (p.dx + points[0].dx) / 2;
                                                                  //   yc = (p.dy + points[0].dy) / 2;

                                                                  //   ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
                                                                  //   ctx.quadraticCurveTo(xc, yc, points[0].dx, points[0].dy);

                                                                  //   ctx.stroke();
                                                                  //   ctx.fill();
                                                                  //   ctx.restore();
                                                                  //   ctx.closePath();

                                                                  //   i = len = p = value = xc = yc = null;
                                                                  // }

                                                                  // function animate() {
                                                                    //   if (!playing) return;

                                                                    //   window.requestAnimationFrame(animate);
                                                                    //   analyser.getByteFrequencyData(frequencyData);
                                                                    //   analyser.getByteTimeDomainData(timeData);
                                                                    //   avg = getAvg([].slice.call(frequencyData)) * gainNode.gain.value;

                                                                    //   clearCanvas();

                                                                    //   if (SHOW_STAR_FIELD) {
                                                                      //     drawStarField();
                                                                      //   }

                                                                      //   if (SHOW_AVERAGE) {
                                                                        //     drawAverageCircle();
                                                                        //   }

                                                                        //   if (SHOW_WAVEFORM) {
                                                                          //     drawWaveform();
                                                                          //   }
                                                                          // }

                                                                          // function Star() {
                                                                            //   var xc, yc;

                                                                            //   this.x = Math.random() * w - cx;
                                                                            //   this.y = Math.random() * h - cy;
                                                                            //   this.z = this.max_depth = Math.max(w / h);
                                                                            //   this.radius = 0.2;

                                                                            //   xc = this.x > 0 ? 1 : -1;
                                                                            //   yc = this.y > 0 ? 1 : -1;

                                                                            //   if (Math.abs(this.x) > Math.abs(this.y)) {
                                                                              //     this.dx = 1.0;
                                                                              //     this.dy = Math.abs(this.y / this.x);
                                                                              //   } else {
                                                                                //     this.dx = Math.abs(this.x / this.y);
                                                                                //     this.dy = 1.0;
                                                                                //   }

                                                                                //   this.dx *= xc;
                                                                                //   this.dy *= yc;
                                                                                //   this.dz = -0.1;

                                                                                //   this.ddx = .001 * this.dx;
                                                                                //   this.ddy = .001 * this.dy;

                                                                                //   if (this.y > (cy / 2)) {
                                                                                  //     this.color = stars_color_2;
                                                                                  //   } else {
                                                                                    //     if (avg > AVG_BREAK_POINT + 10) {
                                                                                      //       this.color = stars_color_2;
                                                                                      //     } else if (avg > STARS_BREAK_POINT) {
                                                                                        //       this.color = stars_color_special;
                                                                                        //     } else {
                                                                                          //       this.color = stars_color;
                                                                                          //     }
                                                                                          //   }

                                                                                          //   xc = yc = null;
                                                                                          // }

                                                                                          // function createStarField() {
                                                                                            //   var i = -1;

                                                                                            //   while (++i < TOTAL_STARS) {
                                                                                              //     stars.push(new Star());
                                                                                              //   }

                                                                                              //   i = null;
                                                                                              // }

                                                                                              // function Point(config) {
                                                                                                //   this.index = config.index;
                                                                                                //   this.angle = (this.index * 360) / TOTAL_POINTS;

                                                                                                //   this.updateDynamics = function() {
                                                                                                  //     this.radius = Math.abs(w, h) / 10;
                                                                                                  //     this.x = cx + this.radius * sin(PI_HALF * this.angle);
                                                                                                  //     this.y = cy + this.radius * cos(PI_HALF * this.angle);
                                                                                                  //   }

                                                                                                  //   this.updateDynamics();

                                                                                                  //   this.value = Math.random() * 256;
                                                                                                  //   this.dx = this.x + this.value * sin(PI_HALF * this.angle);
                                                                                                  //   this.dy = this.y + this.value * cos(PI_HALF * this.angle);
                                                                                                  // }

                                                                                                  // function AvgPoint(config) {
                                                                                                    //   this.index = config.index;
                                                                                                    //   this.angle = (this.index * 360) / TOTAL_AVG_POINTS;

                                                                                                    //   this.updateDynamics = function() {
                                                                                                      //     this.radius = Math.abs(w, h) / 10;
                                                                                                      //     this.x = cx + this.radius * sin(PI_HALF * this.angle);
                                                                                                      //     this.y = cy + this.radius * cos(PI_HALF * this.angle);
                                                                                                      //   }

                                                                                                      //   this.updateDynamics();

                                                                                                      //   this.value = Math.random() * 256;
                                                                                                      //   this.dx = this.x + this.value * sin(PI_HALF * this.angle);
                                                                                                      //   this.dy = this.y + this.value * cos(PI_HALF * this.angle);
                                                                                                      // }

                                                                                                      // function createPoints() {
                                                                                                        //   var i;

                                                                                                        //   i = -1;
                                                                                                        //   while (++i < TOTAL_POINTS) {
                                                                                                          //     points.push(new Point({
                                                                                                            //       index: i + 1
                                                                                                            //     }));
                                                                                                            //   }

                                                                                                            //   i = -1;
                                                                                                            //   while (++i < TOTAL_AVG_POINTS) {
                                                                                                              //     avg_points.push(new AvgPoint({
                                                                                                                //       index: i + 1
                                                                                                                //     }));
                                                                                                                //   }

                                                                                                                //   i = null;
                                                                                                                // }

                                                                                                                // function resizeHandler() {
                                                                                                                  //   w = window.innerWidth;
                                                                                                                  //   h = window.innerHeight;
                                                                                                                  //   cx = w / 2;
                                                                                                                  //   cy = h / 2;

                                                                                                                  //   ctx.canvas.width = w;
                                                                                                                  //   ctx.canvas.height = h;

                                                                                                                  //   points.forEach(function(p) {
                                                                                                                    //     p.updateDynamics();
                                                                                                                    //   });

                                                                                                                    //   avg_points.forEach(function(p) {
                                                                                                                      //     p.updateDynamics();
                                                                                                                      //   });
                                                                                                                      // }
                                                                                                                    });

