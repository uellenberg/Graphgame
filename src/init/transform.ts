export default `
createBehavior!("transform");

setBehaviorVal!("transform", "x", 0);
setBehaviorVal!("transform", "y", 0);
setBehaviorVal!("transform", "scale", 1);

finalizeBehavior!("transform");
`;