export default `
//Behavior

createBehavior!("window");

setValArgs!("window", "base.transform.scale_x", 0, 1);
setValArgs!("window", "base.transform.scale_y", 1, 1);

setVal!("window", "base.transform.x", 0);
setVal!("window", "base.transform.y", 0);

finalizeBehavior!("window");

//Prefab

createPrefab!("window");
useBehaviorPrefab!("window", "window", "0", "1");`;