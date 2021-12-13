export default `
//Behavior

createBehavior!("doa");

helper!("doa", {
    export function g_raphgame_doa_helper(o_bjectid, i_dx) {
        //Value, idx.
        state = [0, 0];
    
        //Go through each mount point to try to find one.
        selectBehavior!("mount_point", {
            state = g_raphgame_doa_helper1(state, i_dx, getValSelect!("mount_point.visible"), selectedID!());
        });
        
        state = state[1];
    }
    
    export function g_raphgame_doa_helper1(c_urval, i_dx, v_isible, i_d) {
        state = c_urval;
        
        //Make sure that we are visible.
        if(v_isible) {
            //Check if it's out index. If it is, return, otherwise increment the index.
            if(c_urval[2] == i_dx) {
                state = [i_d, c_urval[2]+1];
            } else {
                state = [c_urval[1], c_urval[2]+1];
            }
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

setVal!("doa", "idx", 0);
setInline!("doa", "idx");

//The index of this doa in the current layer.
setValAction!("doa", "idx", {
    //Start the value at 1.
    //Increment the value while it is > 0, and the layer is the same.
    //Once we reach our ID, make the value negative.
    //Return the value + 1, multiplied by -1.
    
    state = 1;
    selectBehavior!("doa", {
        if(getValSelect!("doa.layer") == getVal!("doa", "layer")) {
            if(state > 0) {
                if(selectedID!() == objectID!()) {
                    state = -state;
                } else {
                    state = state + 1;
                }
            }
        }
    });
    
    state = -(state + 1);
});

setValAction!("doa", "selected", {
    state = g_raphgame_doa_helper(objectID!(), getVal!("doa", "idx"));
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