export default `
//Behavior

createBehavior!("doa", {
    helper!({
        inline const g_raphgame_doa_visible_array = selectBehavior!("mount_point", {
            state = getValSelect!("mount_point.visible");
        }, true);
    
        export function g_raphgame_doa_filter(a_rray) {
            //Create an array of each index.
            const indexes = range(1, a_rray.length);
            
            //Filter the array to only selected mount points.
            const filtered = indexes.filter(m_pidx => {
                state = g_raphgame_doa_visible_array[m_pidx];
            });
            
            //Map the new array to the value in the input array.
            state = filtered.map(m_pidx1 => {
                state = a_rray[m_pidx1];
            });
        }
        
        export const g_raphgame_doa_x_array = g_raphgame_doa_filter(selectBehavior!("mount_point", {
            state = getValSelect!("transform.x");
        }, true));
        
        export const g_raphgame_doa_y_array = g_raphgame_doa_filter(selectBehavior!("mount_point", {
            state = getValSelect!("transform.y");
        }, true));
        
        export const g_raphgame_doa_xs_array = g_raphgame_doa_filter(selectBehavior!("mount_point", {
            state = getValSelect!("transform.scale_x");
        }, true));
        
        export const g_raphgame_doa_ys_array = g_raphgame_doa_filter(selectBehavior!("mount_point", {
            state = getValSelect!("transform.scale_y");
        }, true));
    }, -500);
    
    setValArgs!("layer", 0);
    
    setVal!("base.transform.x", 0);
    setInline!("base.transform.x", 0);
    
    setVal!("base.transform.y", 0);
    setInline!("base.transform.y", 0);
    
    setVal!("base.transform.scale_x", 0);
    setInline!("base.transform.scale_x", 0);
    
    setVal!("base.transform.scale_y", 0);
    setInline!("base.transform.scale_y", 0);
    
    setVal!("idx", 0);
    setInline!("idx");
    
    //The index of this doa in the current layer.
    setValAction!("idx", {
        //Increment by each value that is less than the id and is on the correct layer.
    
        state = 1;
        selectBehavior!("doa", {
            state = state + {
                if(selectedID!() < objectID!() && getValSelect!("doa.layer") == getVal!("layer")) {
                    state = 1;
                } else {
                    state = 0;
                }
            };
        });
    }, -500);
    
    setValAction!("base.transform.x", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_raphgame_doa_x_array[id];
    }, -500);
    
    setValAction!("base.transform.y", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_raphgame_doa_y_array[id];
    }, -500);
    
    setValAction!("base.transform.scale_x", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_raphgame_doa_xs_array[id];
    }, -500);
    
    setValAction!("base.transform.scale_y", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_raphgame_doa_ys_array[id];
    }, -500);
});

//Prefab

createPrefab!("doa", {
    useBehaviorPrefab!("doa", "0");
    useBehaviorPrefab!("window_follower");
    useBehaviorPrefab!("square");
    useBehaviorPrefab!("square_collider");
});
`;