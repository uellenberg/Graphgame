export default `
createBehavior!("transform");

setVal!("x", 0);
setVal!("y", 0);

setVal!("scale_x", 1);
setVal!("scale_y", 1);

setVal!("rotation", 0);

setVal!("collision_x", 0);
setVal!("collision_y", 0);
setVal!("collision_id", -1);
setInline!("collision_x");
setInline!("collision_y");
setInline!("collision_id");

finalizeBehavior!();
`;