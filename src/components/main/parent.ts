export default `
createBehavior!("parent", {
    setValArgs!("id", 0);
    
    setVal!("offset_x", 0);
    setVal!("offset_y", 0);
    
    setInline!("offset_x");
    setInline!("offset_y");
    
    //Set the offsets to the current window position.
    
    setValAction!("offset_x", {
        state = 0;
        selectAll!({
            if(selectedID!() == getVal!("id")) {
                state = getValSelect!("transform.x", true);
            }
        });
    }, -390);
    
    setValAction!("offset_y", {
        state = 0;
        selectAll!({
            if(selectedID!() == getVal!("id")) {
                state = getValSelect!("transform.y", true);
            }
        });
    }, -390);
    
    //Move the current position to be based on the offsets during collisions and renders.
    
    setValAction!("base.transform.x", {
        state = x + getVal!("offset_x");
    }, -390);
    
    setValAction!("base.transform.y", {
        state = y + getVal!("offset_y");
    }, -390);
    
    //At the end of the frame, move it back to the original position.
    
    setValAction!("base.transform.x", {
        state = x - getVal!("offset_x");
    }, -90);
    
    setValAction!("base.transform.y", {
        state = y - getVal!("offset_y");
    }, -90);
});
`;