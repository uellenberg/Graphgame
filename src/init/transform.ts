export default `
createBehavior!("transform");

setVal!("transform", "x", 0);
setVal!("transform", "y", 0);
setVal!("transform", "scale", 1);

finalizeBehavior!("transform");
`;