# Graphgame
Graphgame is a game engine for Desmos. It has an object system based on Unity, where objects have behaviors that control what they do. It makes it easy to write and apply behaviors to objects and interact with other objects. Below is a quick overview of Graphgame's foundation.

## Foundation
The [foundation document](doc/FOUNDATION.md) explains certain concepts that Graphgame uses (such as objects and behaviors) in detail.

## API
The API reference is available [here](doc/API.md).

## Usage

### Logimat
Graphgame is a template library for Logimat. That means that you write your code in Logimat, and use Graphgame's templates to do special functions such as creating objects/behaviors. Logimat is a language based on Javascript that compiles to either raw math, or in this case, Desmos.

### Templates
Templates are how Graphgame functions. In essence, they are calls to Javascript code that get replaced by the output by said code. When they are ran, templates get replaced by Logimat code, and they help to abstract away a lot of the work of managing the game. Templates look like functions, although their name ends with a "!".

### Using Graphgame
To use Graphgame, you should first take a look at a few of its examples, which showcase how Logimat and Graphgame templates work. You should also take a look at the <API reference> and <Priority guide> for more detailed information on how to do certain things in Graphgame.

### Main file
One important way that Graphgame projects are structured is through a main file (called `main.lm`). This main file is responsible for importing and initializing Graphgame, as well as importing other files.

## Graphgame studio

## Examples
Here is a basic example of how you might use Graphgame. Below is a ball that will move upwards every frame, and will go back to zero if it reaches the top of the screen:
```
//These statements allows you to use Graphgame.
import templates from "graphgame";

initialize!();

//Create a max_y. This will be used below.
inline const max_y = 20;

//First, we need a behavior to move the ball. We'll call it "mover".
createBehavior!("mover", {
    //Next, we need to actually move the ball. To do that, we first need to set the balls y-value to mutable, which means that it can be modified.
    //The first argument is the variable. We need to use the y variable on this object's transform component, so we
    //use "base" to refer to this object, then "base.transform" to get the transform component, and finally "base.transform.y" to get the y variable.
    setMut!("base.transform.y");
    
    //Next, we need to actually move it. We use setValAction to do this. We use setValAction to set a variable to something each frame, as opposed to setVal, which sets the object's starting value.
    //The "{}" is called an action body. It contains code statements.
    setValAction!("base.transform.y", {
        //First, add 1 to the current y value.
        //We can access the variable we're updating like this. Other variables need to be accessed with getVal.
        const new_y = y + 1;
        
        //Next, we'll check if it's above our max y.
        //If it is, we'll set the state to 0, otherwise we'll set it to the new y value.
        //The state is like our return value. In Logimat, we can't early return, so we set the return value throughout the code. At the end of the function, whatever the state is will be the result of the function.
        //At each branch of an if statement (if, else if, else) the state must be set. Additionally, if an if has no else, the state must be set at some point before the if is used.
        if(new_y > max_y) {
            state = 0;
        } else {
            state = new_y;
        }
    });
});

//Now that we have our behavior, we can create an object.
//We'll first create an object.
createObject!({
    //Next, we'll attach the mover behavior to it to make it move.
    useBehavior!("mover");
    
    //Finally, we'll add a circle renderer to it so that it displays.
    useBehavior!("circle");
});

//That's it. Now, if we compile it, we'll see a ball moving upwards until it hits the top, and going back to 0.
```