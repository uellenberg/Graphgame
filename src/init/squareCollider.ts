export default `
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

createBehavior!("square_collider");

setVal!("square_collider", "base.transform.collision_x", {
    state = 0;

    const scalex = getVal!("square_collider", "base.transform.scalex");
    const cornerx = getVal!("square_collider", "base.transform.x") - scalex/2;
    
    const scaley = getVal!("square_collider", "base.transform.scaley");
    const cornery = getVal!("square_collider", "base.transform.y") - scaley/2;
    
    const id = objectID!();
    
    selectBehavior!("square_collider", {
        if(state == 0 && selectedID!() != id) {
            const scalex1 = getValSelect!("transform.scalex");
            const cornerx1 = getValSelect!("transform.x") - scalex1/2;
            
            const scaley1 = getValSelect!("transform.scaley");
            const cornery1 = getValSelect!("transform.y") - scaley1/2;
            
            state = g_raphgame_square_collider_helper(cornery, cornery1, scaley, scaley1, cornerx, cornerx1, scalex, scalex1);
        }
    });
});

setVal!("square_collider", "base.transform.collision_y", {
    state = 0;

    const scalex = getVal!("square_collider", "base.transform.scalex");
    const cornerx = getVal!("square_collider", "base.transform.x") - scalex/2;
    
    const scaley = getVal!("square_collider", "base.transform.scaley");
    const cornery = getVal!("square_collider", "base.transform.y") - scaley/2;
    
    const id = objectID!();
    
    selectBehavior!("square_collider", {
        if(state == 0 && selectedID!() != id) {
            const scalex1 = getValSelect!("transform.scalex");
            const cornerx1 = getValSelect!("transform.x") - scalex1/2;
            
            const scaley1 = getValSelect!("transform.scaley");
            const cornery1 = getValSelect!("transform.y") - scaley1/2;
            
            state = g_raphgame_square_collider_helper(cornerx, cornerx1, scalex, scalex1, cornery, cornery1, scaley, scaley1);
        }
    });
});

finalizeBehavior!("square_collider");
`;