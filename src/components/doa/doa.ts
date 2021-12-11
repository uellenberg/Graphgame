export default `
//Behavior

createBehavior!("doa");

helper!("doa", {
    export function g_raphgame_doa_helper(c_urval, n_ewval, i_nit) {
        if(c_urval != i_nit) {
            state = c_urval;
        } else {
            state = n_ewval;
        }
    }
});

setValArgs!("doa", "layer", 0);

setVal!("doa", "selected", -1);
setMut!("doa", "selected");

setVal!("doa", "base.transform.x", 0);
setMut!("doa", "base.transform.x", 0);

setVal!("doa", "base.transform.y", 0);
setMut!("doa", "base.transform.y", 0);

setVal!("doa", "base.transform.scale_x", 0);
setMut!("doa", "base.transform.scale_x", 0);

setVal!("doa", "base.transform.scale_y", 0);
setMut!("doa", "base.transform.scale_y", 0);

setValAction!("doa", "selected", {
    //If it isn't our turn, don't change anything.
    const turn = {
        state = -1;
        selectBehavior!("window", {
            state = getValSelect!("window.active_doa");
        });
    };
    
    if(turn != objectID!()) {
        state = selected;
    } else {
        state = -1;
        
        //Go through each mount point to try to find one.
        selectBehavior!("mount_point", {
            state = g_raphgame_doa_helper(state, {
                state = -1;
                
                //Make sure that we haven't already chosen a mount point, and that this mount point is visible.
                if(getValSelect!("mount_point.visible")) {
                    const id = selectedID!();
            
                    //Make sure that another doa doesn't own this.
                    const owned = {
                        state = 0;
                    
                        selectBehavior!("doa", {
                            //If this object is us, we can safely ignore it.
                            if(selectedID!() != objectID!()) {
                                //If an object owns this one, set state to true.
                                if(getValSelect!("doa.selected", true) == id) {
                                    state = 1;
                                }
                            }
                        });
                    };
                
                    //If it isn't owned, we can take it.
                    if(!owned) {
                        state = id;
                    }
                }
            }, -1);
        });
    }
});

setValAction!("doa", "base.transform.x", {
    state = 0;

    //Get the id.
    const id = getVal!("doa", "selected", true);
    
    //Find the object.
    selectBehavior!("mount_point", {
        //If it's this object, set the state.
        if(selectedID!() == id) {
            state = getValSelect!("transform.x");
        }
    });
});

setValAction!("doa", "base.transform.y", {
    state = 0;

    //Get the id.
    const id = getVal!("doa", "selected", true);
    
    //Find the object.
    selectBehavior!("mount_point", {
        //If it's this object, set the state.
        if(selectedID!() == id) {
            state = getValSelect!("transform.y");
        }
    });
});

setValAction!("doa", "base.transform.scale_x", {
    state = 0;

    //Get the id.
    const id = getVal!("doa", "selected", true);
    
    //Find the object.
    selectBehavior!("mount_point", {
        //If it's this object, set the state.
        if(selectedID!() == id) {
            state = getValSelect!("transform.scale_x");
        }
    });
});

setValAction!("doa", "base.transform.scale_y", {
    state = 0;

    //Get the id.
    const id = getVal!("doa", "selected", true);
    
    //Find the object.
    selectBehavior!("mount_point", {
        //If it's this object, set the state.
        if(selectedID!() == id) {
            state = getValSelect!("transform.scale_y");
        }
    });
});

finalizeBehavior!("doa");

//Prefab

createPrefab!("doa");
useBehaviorPrefab!("doa", "doa", "0");
useBehaviorPrefab!("doa", "window_follower");
useBehaviorPrefab!("doa", "square");
useBehaviorPrefab!("doa", "square_collider");
`;