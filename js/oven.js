
//Declarate the variables
let ovenState = 'off',
  currentOvenVideo,
  ovenDoor,
  ovenLockDoor = 'false';


window.onload = () => {
  currentOvenVideo = document.getElementById('video-oven');
  ovenDoor = document.getElementById('door-oven');

  //When the user touch the door
  ovenDoor.onclick = () => {
    //Every time the user touch the over door, the advanceAnimation function is going to executed.
    if(!ovenLockDoor){
      if(ovenState === 'ready-pie'){
        ovenState = 'remove-pie'
      }else if(ovenState === 'burned-pie'){
        ovenState = 'remove-burned-pie';
      }
    }
    advanceAnimation();

}


  //Declarate the first fucntion
  function advanceAnimation() {
    //Evaluate each state of the oven an executed  certain action.
    //Use a switch case because there are many states.
    switch (ovenState) {
      //When the oven be off and the user touch the door, they are going to occur some things.
      case 'off':
        //Lock the door to avoid unexpected iteranctions.
        lockDoor(true);
        //Reproduce the open door sound.
        reproduceSound('door', false);
        // Show the video tag.
        showVideo();
        //Reproduce the initial video.
        reproduceVideo('oven-open-door');
        //Change the oven state.
        whenFinishAdvanceTo('cooking');
        break;

      //When the oven be cooking
      case 'cooking':
        //Reproduce the video of the pie cooking.
        reproduceVideo('oven-cooking');
        // Reproduce the timer sound.
        reproduceSound('timer', true);
        //Change the oven state.
        whenFinishAdvanceTo('ready-pie');
        break;

      //When the pie is ready
      case 'ready-pie':
        //Stop the timer sound.
        stopSound();
        //Unlock the oven door.
        lockDoor(false);
        //Reproduce the ready pie video.
        reproduceVideo('oven-pie-okay');
        //Reproduce the bell sound.
        reproduceSound('bell', false);
        //Repeat the video for some time.
        loopVideo(10000);
        //Change the state to burning.
        whenFinishAdvanceTo('burning-pie');
        break;

        
        //When the pie is burning
        case 'burning-pie':
            //Stop the bell sound.
            stopSound();
            //Lock the door again.
            lockDoor(true);
            //Reproduce the video of the pie burning
            reproduceVideo('oven-burning');
            //Change the state to burned
            whenFinishAdvanceTo('burned-pie');
            break;

        //The burned pie
        case 'burned-pie':
          //Lock the door.
          lockDoor(false);
          //Reproduce the video of the burned pie.
          reproduceVideo('oven-pie-burned');
          //Loop 
          loopVideo();
          break;
        
        //Remove the pie from the oven
        case 'remove-pie':
            //Play the sound of door opening.
            reproduceSound('pie',false);
            //Lock the door again.
            lockDoor(true);
            //Play video taking out the pie.
            reproduceVideo('oven-remove-pie');
            //Reset the states
            resetState()
            break;

        
        //Remove pie burned
        case 'remove-burned-pie':
          //Play the sound of the door opening.
          reproduceSound('pie', false);
          //Lock the door again.
          lockDoor(true);
          //Play the video taking out the pie burned.
          reproduceVideo('oven-burned');
          //Reset the state.
          resetState();
          break
          

    }
  }

  let sound;

  //Create reproduceSound function
  function reproduceSound(soundName, soundLoop) {
    //sound varible create a new sound object with the name passed by parameter.
    sound = new Audio(`sounds/${soundName}.mp3`);
    //play sound
    sound.play();
    //loop sound
    sound.loop = soundLoop; /*Can be TRUE or FALSE */
  }

  //Create showVideo function
  function showVideo() {
    //show the current video
    currentOvenVideo.classList.remove('hidden');
  }

  //Create a hideVideo function
  function hideVideo() {
    //Hide the current video
    currentOvenVideo.classList.add('hidden'); /* Change src by the video passed*/
  }

  //Create reproduceVideo function
  function reproduceVideo(videoName) {
    currentOvenVideo.src = `video/${videoName}.webm`;
    currentOvenVideo.play();
  }

  //Update the state
  function updateState(newState) {
    ovenState = newState;
  }

  //Create whenFinishAdvanceTo function
  function whenFinishAdvanceTo(newState) {
    //When finish the current video, It's going to do this:
    currentOvenVideo.onended = () => {
      updateState(newState);
      advanceAnimation();
    };
  }

  //Create lockDoor function
  function lockDoor(lock) {
    ovenLockDoor = lock;
  }

  //Create stopSound function
  function stopSound(){
    sound.pause();
  }

  //Create loopVideo function
  function loopVideo(time){
    currentOvenVideo.loop = true;
    //If a time is defined
    if(time != undefined){
        //Create a timer to unlock
        setTimeout(()=>{
            notLoopVideo();
        }, time);/*Wait for the time passed by parameter.*/
    }
  }


  //Create notLoopVideo function
  function notLoopVideo(){
    currentOvenVideo.loop = false;
  }


  //Create resetState function
  function resetState(){
    notLoopVideo();
    currentOvenVideo.onended = () => {
      updateState('off');
      hideVideo();
      lockDoor(false);
      turnButton(0);
    }
  }


  //Button Oven
  //Look for the button and save it ina a variable
  const MAX_PLAYBACK_RATE = 16,
        MIN_PLAYBACK_RATE = 1;

  let ovenButton = document.getElementById('button-oven');
  let rotateButton = 0;


  //Detect when the mouse is over the button y when the wheel of the mouse is rotated.
  ovenButton.onmousewheel = (data) => {
    //Accelerate and decelerate the video
    if(ovenState === 'cooking' || ovenState === 'ready-pie'){
      //Know the direction of the button rotated  
      changeTemperature(data) ;
      //Turn the button in the indicated direction

    }
  }

  function changeTemperature(dataReceived){
    if(dataReceived.deltaY < 0 && currentOvenVideo.playbackRate < MAX_PLAYBACK_RATE){
      //Accelerate the video
      turnButton('right');
      currentOvenVideo.playbackRate = currentOvenVideo.playbackRate + 0.5;
    }
    //Decelerate video
    else if(dataReceived.deltaY > 0 && currentOvenVideo.playbackRate > MIN_PLAYBACK_RATE){
      turnButton('left');
      currentOvenVideo.playbackRate = currentOvenVideo.playbackRate - 0.5;
    }
  }

  //Crete turnButton function
  function turnButton(direction){
    if(direction === 'right'){
      rotateButton = rotateButton + 2.5;
    }
    else if(direction === 'left'){
      rotateButton = rotateButton - 2.5;
    }
    else{
  
      rotateButton = direction;
    }
    ovenButton.style.transform = `rotate(${rotateButton}.deg)`;
  }
  

};