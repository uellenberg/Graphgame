export default `
//Behavior

createBehavior!("doa", {
    helper!({
        inline const g_doa_v = selectBehavior!("mount_point", {
            state = getValSelect!("mount_point.visible");
        }, true);
    
        export function g_doa_f(a_rray) {
            //Create an array of each index.
            const indexes = range(1, a_rray.length);
            
            //Filter the array to only selected mount points.
            const filtered = indexes.filter(m_pidx => {
                state = g_doa_v[m_pidx];
            });
            
            //Map the new array to the value in the input array.
            state = filtered.map(m_pidx1 => {
                state = a_rray[m_pidx1];
            });
        }
        
        export const g_doa_x = g_doa_f(selectBehavior!("mount_point", {
            state = getValSelect!("transform.x");
        }, true));
        
        export const g_doa_y = g_doa_f(selectBehavior!("mount_point", {
            state = getValSelect!("transform.y");
        }, true));
        
        export const g_doa_xs = g_doa_f(selectBehavior!("mount_point", {
            state = getValSelect!("transform.scale_x");
        }, true));
        
        export const g_doa_ys = g_doa_f(selectBehavior!("mount_point", {
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
        state = g_doa_x[id];
    }, -500);
    
    setValAction!("base.transform.y", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_doa_y[id];
    }, -500);
    
    setValAction!("base.transform.scale_x", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_doa_xs[id];
    }, -500);
    
    setValAction!("base.transform.scale_y", {
        state = 0;
    
        //Get the id.
        const id = getVal!("idx");
        
        //Find the object.
        state = g_doa_ys[id];
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