export default `
createBehavior!("transform");

setVal!("transform", "x", 0);
setVal!("transform", "y", 0);

setVal!("transform", "scale_x", 1);
setVal!("transform", "scale_y", 1);

setVal!("transform", "collision_x", 0);
setVal!("transform", "collision_y", 0);

finalizeBehavior!("transform");
`;