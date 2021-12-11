export default `
createBehavior!("square_collider");

//Create helpers
helper!("square_collider", {
    export function g_raphgame_square_collider_helper(c_ornery, c_ornery1, s_caley, s_caley1, c_ornerx, c_ornerx1, s_calex, s_calex1) {
        state = 0;
        
        if((c_ornery => c_ornery1 && c_ornery <= c_ornery1 + s_caley1) || (c_ornery + s_caley => c_ornery1 && c_ornery + s_caley <= c_ornery1 + s_caley1)) {
            const int1 = (c_ornerx1 + s_calex1) - c_ornerx;
            const int2 = (c_ornerx + s_calex) - c_ornerx1;
                
            const int1valid = int1 > 0 && int1 <= s_calex1 && c_ornerx => c_ornerx1 && c_ornerx <= c_ornerx1 + s_calex1;
            const int2valid = int2 > 0 && int2 <= s_calex1 && c_ornerx <= c_ornerx1;
                
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
        const cornerx = getVal!("square_collider", "base.transform.x") - scalex/2;
    
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y") - scaley/2;
    
        const id = objectID!();
    
        selectBehavior!("square_collider", {
            const collision_value = {
                state = 0;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x") - scalex1/2;
                
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y") - scaley1/2;
                
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
        const cornerx = getVal!("square_collider", "base.transform.x") - scalex/2;
    
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y") - scaley/2;
    
        const id = objectID!();
    
        selectBehavior!("square_collider", {
            const collision_value = {
                state = 0;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x") - scalex1/2;
                
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y") - scaley1/2;
                
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
        const cornerx = getVal!("square_collider", "base.transform.x") - scalex/2;
        
        const scaley = getVal!("square_collider", "base.transform.scaley");
        const cornery = getVal!("square_collider", "base.transform.y") - scaley/2;
        
        const id = objectID!();
        
        selectBehavior!("square_collider", {
            const collision_val = {
                state = -1;
            
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x") - scalex1/2;
                    
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y") - scaley1/2;
                    
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