export default `
//Behavior

createBehavior!("window");

setValArgs!("base.transform.scale_x", 0, 1);
setValArgs!("base.transform.scale_y", 1, 1);

setVal!("base.transform.x", 0);
setVal!("base.transform.y", 0);

finalizeBehavior!();

//Prefab

createPrefab!("window");
useBehaviorPrefab!("window", "window", "0", "1");`;