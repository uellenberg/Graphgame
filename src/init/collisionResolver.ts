export default `
createBehavior!("collision_resolver");

setMut!("collision_resolver", "base.transform.x");
setMut!("collision_resolver", "base.transform.y");

setValAction!("collision_resolver", "base.transform.x", {
    state = x;
    
    if(abs(getVal!("collision_resolver", "base.transform.collision_x")) <= abs(getVal!("collision_resolver", "base.transform.collision_y"))) {
        state = x + getVal!("collision_resolver", "base.transform.collision_x");
    }
});

setValAction!("collision_resolver", "base.transform.y", {
    state = y;
    
    if(abs(getVal!("collision_resolver", "base.transform.collision_y")) <= abs(getVal!("collision_resolver", "base.transform.collision_x"))) {
        state = y + getVal!("collision_resolver", "base.transform.collision_y");
    }
});

finalizeBehavior!("collision_resolver");
`;