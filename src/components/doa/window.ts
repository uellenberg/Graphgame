export default `
//Behavior

createBehavior!("window");

setValArgs!("window", "base.transform.scale_x", 0, 1);
setValArgs!("window", "base.transform.scale_y", 1, 1);

setVal!("window", "base.transform.x", 0);
setVal!("window", "base.transform.y", 0);

setVal!("window", "active_doa", -1);
setMut!("window", "active_doa");
setValAction!("window", "active_doa", {
    //Move to the next doa.
    state = active_doa + 1;
    
    const max_object = {
        state = -1;
    
        selectBehavior!("doa", {
            state = selectedID!();
        });
    };
    
    //Limit it to the highest object ID.
    state = mod(state, max_object+1);
});

finalizeBehavior!("window");

//Prefab

createPrefab!("window");
useBehaviorPrefab!("window", "window", "0", "1");`;