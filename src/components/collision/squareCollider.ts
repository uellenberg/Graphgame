export default `
createBehavior!("square_collider");

//Create helpers
helper!({    
    export function g_raphgame_square_collider_update(c_urval, n_ewval) {
        if(c_urval[1] != -1) {
            state = c_urval;
        } else {
            state = n_ewval;
        }
    }
    
    export function g_raphgame_square_collider_is_collided(x_1, y_1, s_x1, s_y1, x_2, y_2, s_x2, s_y2) {
        state = 0;
        
        //Quickly determine if they collide.
        //https://gamedev.stackexchange.com/a/587
        if(abs(x_1 - x_2) * 2 < s_x1 + s_x2 &&
           abs(y_1 - y_2) * 2 < s_y1 + s_y2
        ) {
            state = 1;
        }
    }
    
    export function g_raphgame_square_collider_get_data(x_1, y_1, s_x1, s_y1, x_2, y_2, s_x2, s_y2, i_d) {
        state = [-1, 0, 0];
    
        //Make sure that we are colliding.
        if(g_raphgame_square_collider_is_collided(x_1, y_1, s_x1, s_y1, x_2, y_2, s_x2, s_y2)) {
            //1 if the condition is true, and -1 if it is false.
            const x_scale_mul = (x_1 > x_2)*2 - 1;
            const y_scale_mul = (y_1 > y_2)*2 - 1;
        
            //Calculate x collision.
            const col_x = x_2 - x_1 + x_scale_mul*(s_x1/2 + s_x2/2);
            
            //Calculate y collision.
            const col_y = y_2 - y_1 + y_scale_mul*(s_y1/2 + s_y2/2);
            
            //Put everything into an array.
            state = [i_d, col_x, col_y];
        }
    }
});

setValArgs!("only_collided", 0, 0);

//Calculate the collision values.
setVal!("data", 0);
setInline!("data");

//True, true means that this update will be exported as a function which will be called instead of being inlined when used,
//and the second true means that the function will be a variable instead of a method, for a small performance boost.
setValAction!("data", {
    state = [-1, 0, 0];
    
    //Make sure that we actually need to calculate collisions for this collider.
    if(!getVal!("only_collided")) {
        const scalex = getVal!("base.transform.scalex");
        const cornerx = getVal!("base.transform.x");
    
        const scaley = getVal!("base.transform.scaley");
        const cornery = getVal!("base.transform.y");
    
        const id = objectID!();
        
        //Go through each collider.
        selectBehavior!("square_collider", {
            //Calculate the collision values for it.
            const collision_value = {
                state = [-1, 0, 0];
                
                //Make sure that we aren't checking against ourselves.
                if(selectedID!() != id) {
                    const scalex1 = getValSelect!("transform.scalex");
                    const cornerx1 = getValSelect!("transform.x");
                
                    const scaley1 = getValSelect!("transform.scaley");
                    const cornery1 = getValSelect!("transform.y");
                    
                    //Get the value.
                    state = g_raphgame_square_collider_get_data(cornerx, cornery, scalex, scaley, cornerx1, cornery1, scalex1, scaley1, selectedID!());
                }
            };
            
            //Only update the current value to the new value if the old value has not been set.
            state = g_raphgame_square_collider_update(state, collision_value);
        });
    }
}, -300, true, true);

//Provide helpers to get the specific values from the collision data.
setValAction!("base.transform.collision_id", {
    state = getVal!("data")[1];
}, -300, false);

setValAction!("base.transform.collision_x", {
    state = getVal!("data")[2];
}, -300, false);

setValAction!("base.transform.collision_y", {
    state = getVal!("data")[3];
}, -300, false);

finalizeBehavior!();
`;