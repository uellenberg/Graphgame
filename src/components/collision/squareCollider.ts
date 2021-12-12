export default `
createBehavior!("square_collider");

//Create helpers
helper!("square_collider", {
    export function g_raphgame_square_collider_helper(c_ornery, c_ornery1, s_caley, s_caley1, c_ornerx, c_ornerx1, s_calex, s_calex1) {
        const cornery = c_ornery - s_caley/2;
        const cornery1 = c_ornery1 - s_caley1/2;
        
        const cornerx = c_ornerx - s_calex/2;
        const cornerx1 = c_ornerx1 - s_calex1/2;
    
        state = 0;
        
        if((cornery => cornery1 && cornery <= cornery1 + s_caley1) || (cornery + s_caley => cornery1 && cornery + s_caley <= cornery1 + s_caley1)) {
            const int1 = (cornerx1 + s_calex1) - cornerx;
            const int2 = (cornerx + s_calex) - cornerx1;
                
            const int1valid = int1 > 0 && int1 <= s_calex1 && cornerx => cornerx1 && cornerx <= cornerx1 + s_calex1;
            const int2valid = int2 > 0 && int2 <= s_calex1 && cornerx <= cornerx1;
                
            if(int1valid) {
                if(int2valid && int2 < int1) {
                    state = -int2;
                } else {
                    state = int1;
                }
            } else if(int2valid) {
                if(int1valid && int1 < int2) {
                    state = int1;
                } else {
                    state = -int2;
                }
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
}, -300, true);

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
}, -300, true);

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
}, -300, true);

finalizeBehavior!("square_collider");
`;