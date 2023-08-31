# Airplane fighter
This project resembles the popular game "Chicken invaders".<br><br>
The purpose of the game is that by moving the airplane, the user should avoid the falling rocks. The airplane can also shoot with bullets and distroy the rocks. The score indicates the number of rocks distroyed.
The game ends when the airplane is hit by a rock.<br><br>
The most difficult part to implement was the movement of the bullets as this implied multiple "setInterval()" functions running in the same time.
Using a global iterator which increments every time when the movement function is called, I managed to go through all bullets and move them one by one, also keeping the interval distances between them. 
In this way, in a single thread, I handled multiple "setInterval()" functions that were running in the same time.
You can see a short explanations of how I made the project in the video below: 
https://www.loom.com/share/2fee003a407f46b49c26d452d21cbba7?sid=b0730688-4580-4730-919d-ee0f6d771afb 
