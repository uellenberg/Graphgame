export default `
createBehavior!("transform");

setVal!("transform", "x", 0);
setVal!("transform", "y", 0);

setVal!("transform", "scale_x", 1);
setVal!("transform", "scale_y", 1);

setVal!("transform", "rotation", 0);

setVal!("transform", "collision_x", 0);
setVal!("transform", "collision_y", 0);
setVal!("transform", "collision_id", -1);
setInline!("transform", "collision_x");
setInline!("transform", "collision_y");
setInline!("transform", "collision_id");

finalizeBehavior!("transform");
`;