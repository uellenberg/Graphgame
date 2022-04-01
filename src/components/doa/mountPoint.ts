export default `
//Behavior

createBehavior!("mount_point", {
    //Helper function
    helper!({
        export function g_mp_h(x_1, y_1, s_x1, s_y1, x_2, y_2, s_x2, s_y2) {
            //Quickly determine if they collide.
            //https://gamedev.stackexchange.com/a/587
            if(abs(x_1 - x_2) * 2 < s_x1 + s_x2 &&
               abs(y_1 - y_2) * 2 < s_y1 + s_y2
            ) {
                1
            } else {
                0
            }
        }
    });
    
    setValArgs!("layer", 0);
    setValArgs!("base.transform.x", 1, 0);
    setValArgs!("base.transform.y", 2, 0);
    setValArgs!("base.transform.scale_x", 3, 1);
    setValArgs!("base.transform.scale_y", 4, 1);
    
    setVal!("visible", 0);
    setInline!("visible");
    
    setValAction!("visible", {
        //Get all of the values for the window.
        
        const x1 = {
            state = 0;
            selectBehavior!("window", {
                state = getValSelect!("transform.x");
            });
        };
        
        const y1 = {
            state = 0;
            selectBehavior!("window", {
                state = getValSelect!("transform.y");
            });
        };
        
        const sx1 = {
            state = 0;
            selectBehavior!("window", {
                state = getValSelect!("transform.scale_x");
            });
        };
        
        const sy1 = {
            state = 0;
            selectBehavior!("window", {
                state = getValSelect!("transform.scale_y");
            });
        };
        
        //Get the values for this mount point.
        
        const x2 = getVal!("base.transform.x");
        const y2 = getVal!("base.transform.y");
        const sx2 = getVal!("base.transform.scale_x");
        const sy2 = getVal!("base.transform.scale_y");
        
        //Check if it is visible.
        g_mp_h(x1, y1, sx1, sy1, x2, y2, sx2, sy2)
    }, -600);
});

//Prefab

createPrefab!("mount_point", {
    useBehaviorPrefab!("mount_point", "0", "1", "2", "3", "4");
});
`;