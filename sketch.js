//Create variables here

var dogImg, happyDog, database, foodS, foodStock;
var dog;
var fedTime, lastFed;
var feed, addFood;
var foodObj;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");

}

function setup() {
  database = firebase.database();
  createCanvas(600, 600);
  
  foodObj = new Food();

  dog = createSprite(500,300,50,50);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed The Dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

 
  //add styles here

  fill(255,255,254);
  textSize(15);
  if(lastFed > 12){
    text("Last Fed : " + lastFed % 12 + " PM",105,65);
  }
  else if(lastFed === 0){
    text("Last Fed : 12 AM",105,65);
  }
  else{
    text("Last Fed : " + lastFed + " AM",105,65);
  }
  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })
}