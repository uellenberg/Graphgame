export default `
//Behavior

createBehavior!("mount_point");

//Helper function
helper!("mount_point", {
    export function g_raphgame_mount_point_helper(o_ffsetx, o_ffsety, s_calex, s_caley, y_1top, y_1bottom, x_1left, x_1right) {
        state = 0;
        
        //Find the position of the edges.
        
        const y_top = o_ffsety + (s_caley / 2);
        const y_bottom = o_ffsety - (s_caley / 2);
        
        const x_right = o_ffsetx + (s_calex / 2);
        const x_left = o_ffsetx - (s_calex / 2);
        
        //Check if it lies within all of the edges.
        
        if(x_1left < x_right && x_1right > x_left && y_1top > y_bottom && y_1bottom < y_top) {
            state = 1;
        }
    }
});

setValArgs!("mount_point", "layer", 0);
setValArgs!("mount_point", "base.transform.x", 1, 0);
setValArgs!("mount_point", "base.transform.y", 2, 0);
setValArgs!("mount_point", "base.transform.scale_x", 3, 1);
setValArgs!("mount_point", "base.transform.scale_y", 4, 1);

setVal!("mount_point", "visible", 0);
setMut!("mount_point", "visible");

setValAction!("mount_point", "visible", {
    state = 0;
    
    //Get all of the values for the window.
    
    const offset_x = {
        state = 0;
        selectBehavior!("window", {
            state = getValSelect!("transform.x");
        });
    };
    
    const offset_y = {
        state = 0;
        selectBehavior!("window", {
            state = getValSelect!("transform.y");
        });
    };
    
    const scale_x = {
        state = 0;
        selectBehavior!("window", {
            state = getValSelect!("transform.scale_x");
        });
    };
    
    const scale_y = {
        state = 0;
        selectBehavior!("window", {
            state = getValSelect!("transform.scale_y");
        });
    };
    
    //Get the values for this mount point.
    
    const y_top = getVal!("mount_point", "base.transform.y") + (getVal!("mount_point", "base.transform.scale_y") / 2);
    const y_bottom = getVal!("mount_point", "base.transform.y") - (getVal!("mount_point", "base.transform.scale_y") / 2);
    
    const x_right = getVal!("mount_point", "base.transform.x") + (getVal!("mount_point", "base.transform.scale_x") / 2);
    const x_left = getVal!("mount_point", "base.transform.x") - (getVal!("mount_point", "base.transform.scale_x") / 2);
    
    //Check if it is visible.
    state = g_raphgame_mount_point_helper(offset_x, offset_y, scale_x, scale_y, y_top, y_bottom, x_left, x_right);
});

finalizeBehavior!("mount_point");

//Prefab

createPrefab!("mount_point");
useBehaviorPrefab!("mount_point", "mount_point", "0", "1", "2", "3", "4");`;