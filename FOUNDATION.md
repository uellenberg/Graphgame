# Foundation
This document describes the principles behind Graphgame. After reading this, it is recommended that you check out the [API Reference](TEMPLATES.md).

Graphgame is based on Unity, and carries over some of the same concepts that exist there.

## Objects
Objects are fundamental concepts in Graphgame. Essentially, everything is an object. Each part of the world is made up of objects, and the player is also an object. On their own, objects do nothing, which is where behavior come in. Behavior will be explained in more detail in their section, but essentially, they are modular pieces of code that do some action on the object (like moving it, or colliding with another object). Behaviors are able to access variables on the object, as well as take input and use that to augment what they do.

### Prefabs
Prefabs aren't essential to Graphgame, but they can help make some things easier. A prefab is pretty much a configuration for an object, that can be used to create a new object. It contains what behavior should be applied to the object, what variables should be set to, and can also take input in when being created.

## Behaviors
Behaviors are the driving force behind Graphgame. Behaviors are essentially small packets of code that do one specific thing, or behavior. For example, there can be a behavior that figures out collisions, one that renders a square based on the object's position, and one that holds useful variables for other behaviors to access. These behaviors form a modular system, and can interact with each other. Graphgame includes a set of pre-built behaviors that will help jumpstart any development in it.

### Priority
Priority is a concept in Graphgame that allows some things to run before others. Everything runs in order of the least priority to the highest priority. You can see the priority ranges assigned to different types of behaviors [here](PRIORITIES.md).

## Selects
Selects are a feature of Graphgame that allows behaviors to interact with each other. At their core, selects allow a behavior for dynamically generate code based on other behaviors (for example, a collider behavior can select all objects that also have a collider behavior, and use that to figure out its collisions). Selects power a lot of Graphgame's integral features.

## Variables
Variables in Graphgame are handled in a special way. There are three types of variables: standard, exported, and inlined. A standard variable is more like a constant, and it holds a numerical value. An inlined variable has a changing state, but is not persistant, whereas an exported variable is persistant.

Examples of a standard variable might be the scale of an object in the world (because it probably won't change), where an inlined variable might be the collision values for a collider (because they are recalculated each frame), and an exported variable might be the player's x position (because the x position needs to be saved).

In many templates, variables must be referenced by a variable name. Variable names change if they are being used from inside a behavior or outside of one. Inside a behavior, you can reference a variable by simply using its name (which references a variable on the behavior), or using `base.BEHAVIOR.VARIABLE` to reference a variable on a specific behavior on the current object (such as `base.transform.x`). In situations where you aren't on a behavior, you must always reference the behavior that the variable is on, but you do not need to prefix it with `base.` (for example, `transform.x`).

In order to update a variable, it must first be set to a value (with `setVal`), then set to either mutable (exported) or inline (inlined), using `setMut` or `setInline` respectively. Next, a template such as `setValAction` must be used. These templates allow you to update a variable every frame, and allow you to access the current value of the variable. There are also options such as `exported` (which turns your specific update into a method, which can save space in some cases) and `variable` (which turns your specific update into a variable, which can save space and stop it from being recalculated in some cases).

In addition to updating variables, you can also get variables using a template like `getVal` to get the value of a variable.

## Display
Display is a feature of Graphgame that allows Graphgame's output to have a specific style, defined in Graphgame (such as making an object a certain color). NOTICE: This feature only works when used in conjunction with post-processor, such as Graphgame Studio.

To use display, use the `setDisplay` template. The renderer that you are using must be using the `getDisplay` template before anything it renders (all of Graphgame's built-in components do this). The body of the display will contain a series of display statments, such as:
```
display color = c_1;
```
*(where `c_1` is a defined color)*

The possible options for display are: `color` (color variable), `stroke` (number, 0-1), `thickness` (number), `fill` (number, 0-1), `click` (action name), `label` (template string), `drag` (`x`, `y`, or `xy`), and `hidden` (boolean).