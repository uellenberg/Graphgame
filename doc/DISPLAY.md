# Display
Display is a feature of Graphgame that helps simplify the build process by automatically applying certain properties (such as color, fill, onclick action, etc) based on specified code. Please note that in order to use this feauture, you must be using a postprocessor that supports it.

An example of using display is:
```
dislay label = "Label text ${v_ariable}";
```
*(labels can have exported variables used in them)*

## Usage
To use displays in Graphgame, use the `setDisplay` (behavior) template. For example:
```
createBehavior!("hide", {
    setDisplay!({
        display hidden = true;
    });
});
```
will create a behavior `hide` that will hide any objects that it is applied to.

## Display Types
Below is a table showing the different display properties available.

| Name      | Argument        | Description                                                                                                                     |
|-----------|-----------------|---------------------------------------------------------------------------------------------------------------------------------|
| color     | identifier      | Sets the color of the object.                                                                                                   |
| stroke    | number          | Sets the opacity of the outline/point (0-1).                                                                                    |
| thickness | number          | Sets the size of the outline/point.                                                                                             |
| fill      | number          | Sets the opacity of the shape's fill (0-1).                                                                                     |
| click     | identifier      | Sets the action that will be ran when the object is clicked.                                                                    |
| label     | template string | Sets the label of the object. Template string means that exported identifiers can be used inside of it (see the example above). |
| drag      | x/y/xy          | Sets the drag mode of the point.                                                                                                |
| hidden    | boolean         | Sets if the shape will be hidden (but not the label).                                                                           |
| outline   | boolean         | Sets if the label will have a outline.                                                                                          |
| angle     | number          | Sets the angle of the label.                                                                                                    |
| size      | number          | Sets the size of the label.                                                                                                     |
