export default `
createBehavior!("square_collider");

setMut!("square_collider", "base.transform.collision_x");
setMut!("square_collider", "base.transform.collision_y");

setValAction!("square_collider", "base.transform.collision_x", {
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
            
            if((cornery => cornery1 && cornery <= cornery1 + scaley1) || (cornery + scaley => cornery1 && cornery + scaley <= cornery1 + scaley1)) {
                const int1 = (cornerx1 + scalex1) - cornerx;
                const int2 = (cornerx + scalex) - cornerx1;
            
                const int1valid = int1 > 0 && int1 <= scalex1 && cornerx => cornerx1 && cornerx <= cornerx1 + scalex1;
                const int2valid = int2 > 0 && int2 <= scalex1 && cornerx <= cornerx1;
            
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
    });
});

setValAction!("square_collider", "base.transform.collision_y", {
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
            
            if(true) {
                const int1 = (cornery1 + scaley1) - cornery;
                const int2 = (cornery + scaley) - cornery1;
            
                const int1valid = int1 > 0 && int1 <= scaley1 && cornery => cornery1 && cornery <= cornery1 + scaley1;
                const int2valid = int2 > 0 && int2 <= scaley1 && cornery <= cornery1;
            
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
    });
});

finalizeBehavior!("square_collider");
`;