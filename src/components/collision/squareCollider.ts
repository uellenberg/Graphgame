export default `
createBehavior!("square_collider");

//Create helpers
helper!("square_collider", {
    export function g_raphgame_square_collider_helper(c_ornery, c_ornery1, s_caley, s_caley1, c_ornerx, c_ornerx1, s_calex, s_calex1) {
        state = 0;
        
        //1st is us, 2nd is the other collider.
        
        //Make sure that all objects have a scale.
        if(s_calex > 0 && s_calex1 > 0 && s_caley > 0 && s_caley1 > 0 &&
        //Quickly determine if they collide.
        //https://gamedev.stackexchange.com/a/587
           abs(c_ornerx - c_ornerx1) * 2 < s_calex + s_calex1 &&
           abs(c_ornery - c_ornery1) * 2 < s_caley + s_caley1
        ) {
            const left = c_ornerx - s_calex/2;
            const right = c_ornerx + s_calex/2;
            
            const left1 = c_ornerx1 - s_calex1/2;
            const right1 = c_ornerx1 + s_calex1/2;
        
            //If our midpoint is greater than the other one, subtract our left edge from its right edge.
            //Otherwise, do the opposite.
            if(c_ornerx > c_ornerx1) {
                state = right1 - left;
            } else {
                state = left1 - right;
            }
        }
    }
    
    export function g_raphgame_square_collider_helper1(c_urval, n_ewval, i_nit) {
        if(c_urval != i_nit) {
            state = c_urval;
        } else {
            state = n_ewval;
        }
    }
});

setValArgs!("square_collider", "only_collided", 0, 0);

setValAction!("square_collider", "base.transform.collision_x", {
    state = 0;

    if(!getVal!("square_collider", "only_collided")) {
        const scalex = getVal!("square_collider", "base.transform.scalex");
        const cornerx = getVal!("square_collider", "base.transform.x");
    
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y");
    
        const id = objectID!();
    
        selectBehavior!("square_collider", {
            const collision_value = {
                state = 0;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x");
                
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y");
                
                    state = g_raphgame_square_collider_helper(cornery, cornery1, scaley, scaley1, cornerx, cornerx1, scalex, scalex1);
                }
            };
            
            state = g_raphgame_square_collider_helper1(state, collision_value, 0);
        });
    }
}, -300, true, true);

setValAction!("square_collider", "base.transform.collision_y", {
    state = 0;
    
    if(!getVal!("square_collider", "only_collided")) {
        const scalex = getVal!("square_collider", "base.transform.scalex");
        const cornerx = getVal!("square_collider", "base.transform.x");
    
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y");
    
        const id = objectID!();
    
        selectBehavior!("square_collider", {
            const collision_value = {
                state = 0;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x");
                
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y");
                
                    state = g_raphgame_square_collider_helper(cornerx, cornerx1, scalex, scalex1, cornery, cornery1, scaley, scaley1);
                }
            };
            
            state = g_raphgame_square_collider_helper1(state, collision_value, 0);
        });
    }
}, -300, true, true);

setValAction!("square_collider", "base.transform.collision_id", {
    //The specific collision coordinate doesn't matter here, as any collision will result in both x and y having non-zero values.

    state = -1;
    
    if(!getVal!("square_collider", "only_collided")) {
        const scalex = getVal!("square_collider", "base.transform.scalex");
        const cornerx = getVal!("square_collider", "base.transform.x");
        
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y");
        
        const id = objectID!();
        
        selectBehavior!("square_collider", {
            const collision_val = {
                state = -1;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x");
                    
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y");
                    
                    if(g_raphgame_square_collider_helper(cornery, cornery1, scaley, scaley1, cornerx, cornerx1, scalex, scalex1) != 0) {
                        state = selectedID!();
                    }
                }
            };
            
            //If there is a collision, set the state.
            state = g_raphgame_square_collider_helper1(state, collision_val, -1);
        });
    }
}, -300, true, true);

finalizeBehavior!("square_collider");
`;