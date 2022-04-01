export default `
createBehavior!("square_outline", {
    behaviorCustom!({
        //Apply the default style.
        display fill = 1;
        display stroke = 0;
        display thickness = 0;
    
        //Apply the user-defined style.
        //getDisplay is not used here because the outline should be different from the shape itself.
        getBehaviorArgs!(0);
    
        polygon({
            //This is multiplied by two because it needs to account for both sides.
            const thickness = 2*getBehaviorArgs!(1);
            
            const x = getVal!("base.transform.x");
            const y = getVal!("base.transform.y");
            const x_scale = getVal!("base.transform.scale_x") + thickness;
            const y_scale = getVal!("base.transform.scale_y") + thickness;
            const rotation = getVal!("base.transform.rotation");
        
            (x, y) + [(-1/2, -1/2), (1/2, -1/2), (1/2, 1/2), (-1/2, 1/2)].map(s_point => {
                const new_x = x_scale*s_point.x;
                const new_y = y_scale*s_point.y;
                
                const rotated_x = g_sr_r(new_x, -new_y, rotation);
                const rotated_y = g_sr_r(new_y, new_x, rotation);
                
                (rotated_x, rotated_y)
            })
        });
    }, -150);
});
`;