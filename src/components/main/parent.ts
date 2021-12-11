export default `
createBehavior!("parent");

setValArgs!("parent", "id", 0);

setVal!("parent", "offset_x", 0);
setVal!("parent", "offset_y", 0);

setInline!("parent", "offset_x");
setInline!("parent", "offset_y");

//Set the offsets to the current window position.

setValAction!("parent", "offset_x", {
    state = 0;
    selectAll!({
        if(selectedID!() == getVal!("parent", "id")) {
            state = getValSelect!("transform.x", true);
        }
    });
}, -399);

setValAction!("parent", "offset_y", {
    state = 0;
    selectAll!({
        if(selectedID!() == getVal!("parent", "id")) {
            state = getValSelect!("transform.y", true);
        }
    });
}, -399);

//Move the current position to be based on the offsets during collisions and renders.

setValAction!("parent", "base.transform.x", {
    state = x + getVal!("parent", "offset_x");
}, -399);

setValAction!("parent", "base.transform.y", {
    state = y + getVal!("parent", "offset_y");
}, -399);

//At the end of the frame, move it back to the original position.

setValAction!("parent", "base.transform.x", {
    state = x - getVal!("parent", "offset_x");
}, -99);

setValAction!("parent", "base.transform.y", {
    state = y - getVal!("parent", "offset_y");
}, -99);

finalizeBehavior!("parent");
`;