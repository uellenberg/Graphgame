export default `
createBehavior!("collision_resolver", {
    setMut!("base.transform.x");
    setMut!("base.transform.y");
    
    //The reason that x is <= and y is < is that, if both are <=, then we can possibly put the object at a corner. This makes sure that it always goes on an edge.
    
    setValAction!("base.transform.x", {
        if(abs(getVal!("base.transform.collision_x")) <= abs(getVal!("base.transform.collision_y"))) {
            state = x + getVal!("base.transform.collision_x");
        } else {
            state = x;
        }
    }, -200);
    
    setValAction!("base.transform.y", {
        if(abs(getVal!("base.transform.collision_y")) < abs(getVal!("base.transform.collision_x"))) {
            state = y + getVal!("base.transform.collision_y");
        } else {
            state = y;
        }
    }, -200);
});
`;