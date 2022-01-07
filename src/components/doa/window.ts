export default `
//Behavior

createBehavior!("window", {
    setValArgs!("base.transform.scale_x", 0, 1);
    setValArgs!("base.transform.scale_y", 1, 1);
    
    setVal!("base.transform.x", 0);
    setVal!("base.transform.y", 0);
});

//Prefab

createPrefab!("window", {
    useBehaviorPrefab!("window", "0", "1");
});
`;