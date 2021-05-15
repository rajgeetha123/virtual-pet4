
var dog;
var happyDog;
var database;
var foodS=0;
var foodStock;
var assign=0;
var button;
var fedTime;
var lastFed;
var readState;
var gameState=0;
var bedroom,garden,washroom;
var Playing;
var Sleeping;
var Bathing;

function preload()
{
  dogImage=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/Happy.png");
  bedroom=loadImage("Images/Bed Room.png");
  garden=loadImage("Images/Garden.png");
  washroom=loadImage("Images/Wash Room.png");
  livingroom=loadImage("Images/Living Room.png");
}

function setup() {
  database=firebase.database();

  createCanvas(400,500);

  foodStock=database.ref("Food");
  foodStock.on("value",function(data){
    foodS=data.val();
  });

  fedTime=database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
  dog=createSprite(200,400,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15
  

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
 addFood.position(800,95);
addFood.mousePressed(addFoods)

  



  
}


function draw() { 

  background("yellow");

  foodObj.display();
  writeStock(foodS);

  if(foodS==0)
  {
    dog.addImage(happyDog);
    milkBottle2.visible=false;
  }
  
 

  //if(keyWentDown(UP_ARROW))
  //{
  // assign=assign+20;
  //  writeStock(assign);
  //  dog.addImage(happyDog);
  //}


 //foodObj.display();

 
 currentTime=hour();
 if(currentTime==(lastFed+1))
 {
   update("Playing");
   foodObj.garden();
 }else if(currentTime==(lastFed+2))
 {
   update("Sleeping");
   foodObj.bedroom();

 }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4))
 {
   update("Bathing");
   foodObj.washroom();
 }else{
   update("Hungry");
   foodObj.display();
 }

 if(gameState!="Hungry")
 {
   feed.hide();
   addFood.hide();
   dog.remove();

 }
 else{
   feed.show();
   addFood.show();
   dog.addImage(dogImage);
 }

//gameState=1
 if(gameState===1)
 {
   dog.addImage(happyDog);
   dog.scale=0.175;
   dog.y=250;
 }



//gameState=2
 if(gameState===2)
 {
   dog.addImage(dogImage);
   dog.scale=0.175;
   milkBottle2.visible=false;
   dog.y=250;
 }




//gameState=3
 var Bath=createButton("I want to take bath");
 Bath.position(580,125);
 if(Bath.mousePressed(function(){
   gameState=3;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===3)
 {
   dog.addImage(washroom);
   dog.scale=1;
   milkBottle2.visible=false;
 }


//gameState=4
 var Sleep=createButton("I am very sleepy");
 Sleep.position(710,125);
 if(Sleep.mousePressed(function(){
   gameState=4;
   database.ref('/').update({'gameState':gameState});
 }));

 if(gameState===4)
 {
   dog.addImage(bedroom);
   dog.scale=1;
   milkBottle2.viisble=false;
 }


//gameState=5
 var Play=createButton("Let's play !");
 Play.position(500,160);
 if(Play.mousePressed(function(){
   gameState=5;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===5)
 {
   dog.addImage(livingroom);
   dog.scale=1;
 }


//gameState=6
 var PlayInGarden=createButton("Lets play in park");
 PlayInGarden.position(585,160);
 if(PlayInGarden.mousePressed(function(){
   gameState=6;
   database.ref('/').update({'gameState':gameState});
 }));
 if(gameState===6)
 {
   dog.y=175;
   dog.addImage(garden);
   dog.scale=1;
   milkBottle2.visible=false;
 }

 

  drawSprites();
  

}

function readStock(data)
{
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog()
{
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"

  })


}

function writeStock(x)
{
  database.ref("/").set({
    food:x,

  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS,
    
  })
}

function update(state)
{
  database.ref('/').update({
    gameState:state,
  });
}





