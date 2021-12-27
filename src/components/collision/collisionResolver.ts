export default `
createBehavior!("collision_resolver");

setMut!("collision_resolver", "base.transform.x");
setMut!("collision_resolver", "base.transform.y");

//The reason that x is <= and y is < is that, if both are <=, then we can possibly put the object at a corner. This makes sure that it always goes on an edge.

setValAction!("collision_resolver", "base.transform.x", {
    if(abs(getVal!("collision_resolver", "base.transform.collision_x")) <= abs(getVal!("collision_resolver", "base.transform.collision_y"))) {
        state = x + getVal!("collision_resolver", "base.transform.collision_x");
    } else {
        state = x;
    }
}, -200);

setValAction!("collision_resolver", "base.transform.y", {
    if(abs(getVal!("collision_resolver", "base.transform.collision_y")) < abs(getVal!("collision_resolver", "base.transform.collision_x"))) {
        state = y + getVal!("collision_resolver", "base.transform.collision_y");
    } else {
        state = y;
    }
}, -200);

finalizeBehavior!("collision_resolver");
`;