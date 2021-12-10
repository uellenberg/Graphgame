export default `
createBehavior!("window_follower");

setVal!("window_follower", "offset_x", 0);
setVal!("window_follower", "offset_y", 0);

setInline!("window_follower", "offset_x");
setInline!("window_follower", "offset_y");

//Set the offsets to the current window position.

setValAction!("window_follower", "offset_x", {
    state = 0;
    selectBehavior!("window", {
        state = getValSelect!("transform.x", true);
    });
}, -399);

setValAction!("window_follower", "offset_y", {
    state = 0;
    selectBehavior!("window", {
        state = getValSelect!("transform.y", true);
    });
}, -399);

//Move the current position to be based on the offsets during collisions and renders.

setValAction!("window_follower", "base.transform.x", {
    state = x - getVal!("window_follower", "offset_x");
}, -399);

setValAction!("window_follower", "base.transform.y", {
    state = y - getVal!("window_follower", "offset_y");
}, -399);

//At the end of the frame, move it back to the original position.

setValAction!("window_follower", "base.transform.x", {
    state = x + getVal!("window_follower", "offset_x");
}, -99);

setValAction!("window_follower", "base.transform.y", {
    state = y + getVal!("window_follower", "offset_y");
}, -99);

finalizeBehavior!("window_follower");
`;