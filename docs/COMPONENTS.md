# Components
This document outlines all the built-in components (as well as some prefabs) that Graphgame provides.

## Main
These are some of Graphgame's main components.

### Transform (`transform`)
Transform is an essential component, and is available on every object. It acts as a place for important variables about the object's location to be stored. Here are the variables that it stores:

| Variable     | Description                                         |
|--------------|-----------------------------------------------------|
| x            | The x position of the object.                       |
| y            | The y position of the object.                       |
| scale_x      | The x scale of the object.                          |
| scale_y      | The y scale of the object.                          |
| rotation     | The rotation of the object (in radians).            |
| collision_x  | The current x collision of the object.              |
| collision_y  | The current y collision of the object.              |
| collision_id | The id of the object currently being collided with. |

## Rendering
These components allow your objects to become visible.

### Square (`square`)
Renders a rectangle.

### Circle (`circle`)
Renders a ellipse.

## DOA
DOA (Dynamic Object Allocation) is a system that helps with the creation of platformer games. It dynamically allocates objects from an object pool once they come into view of the window, so that in a large world, only a few objects really exist.

It also makes the rendering of the game easier to manage by handling the viewport for you.

### DOA (`doa`)
The main DOA behavior. This is an object that will be dynamically allocated. The first argument is the layer that the DOA is on (WIP, put 0).

### Mount Point (`mount_point`)
Mount points are points in that the DOAs will mount to, once the mount points are visible by the window. Mount points have an x and y position, as well as a scale_x and scale_y, which the DOAs will use. The first argument is the layer that the DOA is on (WIP, put 0), and the next (which are optional) are x, y, scale_x, and scale_y.

### Window (`window`)
The window is the user's screen, and should be locked to the player.

### Window Follower (`window_follower`)
The window follower is a behavior that makes the object follow the window. That means that when the window is moved so that it is viewing the object, that object will be moved into view. This behavior should be on any objects that also have DOAs on them.

## Util

### Point (`point`)
Point is a utility that adds a point to the object, which is movable by the user. This allows them to change the object's coordinates.