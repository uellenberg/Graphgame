# Templates
This document shows usage instructions for every template that Graphgame provides.

## Main

### initialize
Initialize the game. This must be the first template called.
```
initialize!();
```

### registerAction
Registers an action and runs it on update.
```
registerAction!(actionName: string);
```

## Object

### createObject
Creates a new object.

`definition` - is a body containing the object's definition, comprised of the below templates.
```
createObject!(definition: Body);
```

### useBehavior
Add a behavior to an object.
```
useBehavior!(behaviorName: string);
```

### setObjectVal
Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable.
```
setObjectVal!(variableName: string, val: number);
```

## Component

### createBehavior
Creates a new behavior.

`definition` - is a body containing the behavior's definition, comprised of the below templates.
```
createBehavior!(name: string, definition: Body);
```

### extendBehavior
Extends a behavior. The supplied definition will be added to the behavior's current definition.

`definition` - is a body containing the behavior's definition, comprised of the below templates.
```
extendBehavior!(name: string, definition: Body);
```

### setMut
Marks a behavior's variable as mutable (changable after compilation).
```
setMut!(variableName: string);
```

### setInline
Marks a behavior's variable as mutable (changable after compilation), but inlines it instead of exporting it.
```
setInline!(variableName: string);
```

### getVal
Get the value of a behavior's variable. A boolean can be supplied to get the currently saved value instead of the current value.

`saved` - is whether to use the currently stored (saved) variable or the one that has been updated but not yet saved.
```
getVal!(variableName: string, saved?: boolean);
```

### setVal
Set the value of a behavior's variable (during compilation). This must be used before a variable is marked as mutable.
```
setVal!(variableName: string, val: number);
```

### setValArgs
Set the value of a behavior's variable (during compilation) using a zero-based argument that was passed to the behavior when it was added to the GameObject. This must be used before a variable is marked as mutable.
```
setValArgs!(variableName: string, arg: number, defaultVal?: number);
```

### setValAction
Set the value of a behavior's variable on update (during runtime). Running this will automatically mark a variable as mutable.

`body` - is the body of the function that will be run to update the variable. This function has access to the name of the variable that is updating without using getVal.
```
setValAction!(variableName: string, body: Body, priority?: number = 0, exported?: boolean = false, variable?: boolean = false);
```

### noRegisterSetValAction
Create an action that sets the value of a behavior's variable (during runtime). This must be run manually (or as the click property of an object). Running this will automatically mark a variable as mutable.

`body` - is the body of the function that will be run to update the variable. This function has access to the name of the variable that is updating without using getVal.
```
noRegisterSetValAction!(variableName: string, body: Body, actionName?: string, priority?: number = 0);
```

### behaviorCustom
Create custom declarations on the behavior. This is ideal for graphs, polygons, points, etc, but should not be used for named declarations (functions, consts, etc).

`body` - is a body that contains outer declarations (polygon, graph, etc). These outer declarations can use getVal, and will be created for every object that the behavior exists on.
```
behaviorCustom!(body: Body, priority?: number = 0);
```

### setDisplay
Allows modifying the display properties of any object that this is attached to.

`body` - is a body that contains the display properties that will be applied to each renderer that is attached to the object that this behavior is attached to.
```
setDisplay!(body: Body, priority?: number = 0);
```

### getBehaviorArgs
Gets a zero-based argument that was passed to the behavior when it was added to the GameObject.

```
getBehaviorArgs!(arg: number);
```

### helper
Allows creating helper methods at certain priorities, and which are only output if the behavior they are attached to is used.

`body` - is a body that contains helper methods or constants (or any other outer declaration). These will only be exported once and will only be exported if the behavior is used.
```
helper!(body: Body, priority?: number = 0);
```

### objectID
Gets the ID of the object that this behavior is currently attached to.

```
objectID!();
```

## Prefab

### createPrefab
Creates a new prefab.

`definition` - is a body containing the prefab's definition, comprised of the below templates.
```
createPrefab!(name: string, definition: Body);
```

### extendPrefab
Extends a prefab. The supplied definition will be added to the prefab's current definition.

`definition` - is a body containing the prefab's definition, comprised of the below templates.
```
extendPrefab!(name: string, definition: Body);
```

### useBehaviorPrefab
Add a behavior to a prefab. Any additional arguments will be passed to the behavior. 
To use prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.

```
useBehavior!(behaviorName: string);
```

### setPrefabVal
Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable. 
To use prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.

```
setPrefabVal!(variableName: string, val: number | string);
```


### usePrefab
Creates a new object from a prefab. Any additional arguments will be passed to the prefab.

`definition` - is a body containing the new object's definition, comprised of the object templates.
```
usePrefab!(prefab: string, body?: Body);
```

## Select

### selectID
Sets a specific ID to be the one used by select templates.

```
selectID!(id?: number);
```

### selectedID
Gets the currently selected ID.

```
selectedID!();
```

### selectAll
Selects every object and uses the specified body on each.

`body` - is a body of inner or outer declarations that will be used for each object that is selected.
`array` - is whether the output should be done as an array.
```
selectAll!(body: Body, array?: boolean);
```

### selectBehavior
Selects every object that has a specific behavior and uses the specified body on each.

`body` - is a body of inner or outer declarations that will be used for each object that is selected.
`array` - is whether the output should be done as an array.
```
selectBehavior!(behavior: string, body: Body, array?: boolean);
```

### setMutSelect
Marks the current object's variable as mutable (changable after compilation).

```
setMutSelect!(variableName: string);
```

### setInlineSelect
Marks the current object's variable as mutable, but inlines it instead of exporting it.

```
setInlineSelect!(variableName: string);
```

### getValSelect
Get the value of the current object's variable. A boolean can be supplied to get the currently saved value instead of the current value.

`saved` - is whether to use the currently stored (saved) variable or the one that has been updated but not yet saved.
```
getValSelect!(variableName: string, saved?: boolean);
```

### setValSelect
Set the value of the current object's variable (during compilation). This must be used before a variable is marked as mutable.

```
setValSelect!(variableName: string, val: number);
```

### setValActionSelect
Set the value of the current object's variable on update (during runtime). Running this will automatically mark a variable as mutable.

`body` - is the body of the function that will be run to update the variable. This function has access to the name of the variable that is updating without using getVal.
```
setValActionSelect!(variableName: string, body: Body);
```

### noRegisterSetValActionSelect
Create an action that sets the value of the current object's variable (during runtime). This must be run manually (or as the click property of an object). Running this will automatically mark a variable as mutable.

`body` - is the body of the function that will be run to update the variable. This function has access to the name of the variable that is updating without using getVal.
```
noRegisterSetValActionSelect!(variableName: string, body: Body, actionName?: string);
```

### getDisplay
Gets the display properties for the current objects, and inserts them in place of this template.

```
getDisplay!();
```
