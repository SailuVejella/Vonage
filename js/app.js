// replace these values with those generated in your TokBox Account
var apiKey = "46463332";
var sessionId = "2_MX40NjQ2MzMzMn5-MTU3NDI4NjA4MTk1Nn5rVmhQZTZUdjl4cnN5cWlyOTdqUWpsSTV-fg";
var token = "T1==cGFydG5lcl9pZD00NjQ2MzMzMiZzaWc9OGY2ZjgzMmRjYjc2ZmRiMGYzOTUyNjVkNWI5YzZjNGZiY2U4ZmQ0YTpzZXNzaW9uX2lkPTJfTVg0ME5qUTJNek16TW41LU1UVTNOREk0TmpBNE1UazFObjVyVm1oUVpUWlVkamw0Y25ONWNXbHlPVGRxVVdwc1NUVi1mZyZjcmVhdGVfdGltZT0xNTc0Mjg2MDk1Jm5vbmNlPTAuNzc2MzU2MzQ5NDg2MTE1OSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc0ODkwODk0JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";
// (optional) add server code here
initializeSession();
// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
  
    // Subscribe to a newly created stream
    var subscriber = null;
    session.on('streamCreated', function(event) {
      subscriber= session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '85%',
          height: '100%',
          restrictFrameRate:true,
        }, handleError);
      });
    // restrict the frame rate to mimize bandwidth consumption
    if(subscriber)
  subscriber.restrictFrameRate(true);
    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
    // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function signalCallback(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });

// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form
form.addEventListener('submit', function submit(event) {
  event.preventDefault();

  session.signal({
    type: 'msg',
    data: msgTxt.value
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
});
    //get the Image data
    var imgData = publisher.getImgdata();
    session.on('archiveStarted', function archiveStarted(event) {
      archiveID = event.id;
      console.log('Archive started ' + archiveID);
      $('#stop').show();
      $('#start').hide();
    });
  
    session.on('archiveStopped', function archiveStopped(event) {
      archiveID = event.id;
      console.log('Archive stopped ' + archiveID);
      $('#start').hide();
      $('#stop').hide();
      $('#view').show();
    });
    // Start recording
     function startArchive() { // eslint-disable-line no-unused-vars
      $.ajax({
        url: SAMPLE_SERVER_BASE_URL + '/archive/start',
        type: 'POST',
        contentType: 'application/json', // send as JSON
        data: JSON.stringify({'sessionId': sessionId}),
    
        complete: function complete() {
          // called when complete
          console.log('startArchive() complete');
        },
    
        success: function success() {
          // called when successful
          console.log('successfully called startArchive()');
        },
    
        error: function error() {
          // called when there is an error
          console.log('error calling startArchive()');
        }
      });
    
      $('#start').hide();
      $('#stop').show();
    }
    
    // Stop recording
    function stopArchive() { // eslint-disable-line no-unused-vars
      $.post(SAMPLE_SERVER_BASE_URL + '/archive/' + archiveID + '/stop');
      $('#stop').hide();
      $('#view').prop('disabled', false);
      $('#stop').show();
    }
    
    // Get the archive status. If it is  "available", download it. Otherwise, keep checking
    // every 5 secs until it is "available"
    function viewArchive() { // eslint-disable-line no-unused-vars
      $('#view').prop('disabled', true);
      window.location = SAMPLE_SERVER_BASE_URL + /archive/ + archiveID + '/view';
    }
    
    $('#start').show();
    $('#view').hide();
    $("#start").on("click", function(){
      startArchive();
    })
    $("#stop").on("click", function(){
      stopArchive();
    })
    $("#view").on("click", function(){
      viewArchive();
    })

}