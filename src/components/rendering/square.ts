export default `
createBehavior!("square", {
    helper!({
        export function g_sr_r(a, b, r) {
            a*cos(r) + b*sin(r)
        }
    });
    
    behaviorCustom!({
        getDisplay!();
    
        polygon({
            const x = getVal!("base.transform.x");
            const y = getVal!("base.transform.y");
            const x_scale = getVal!("base.transform.scale_x");
            const y_scale = getVal!("base.transform.scale_y");
            const rotation = getVal!("base.transform.rotation");
        
            (x, y) + [(-1/2, -1/2), (1/2, -1/2), (1/2, 1/2), (-1/2, 1/2)].map(s_point => {
                const new_x = x_scale*s_point.x;
                const new_y = y_scale*s_point.y;
                
                const rotated_x = g_sr_r(new_x, -new_y, rotation);
                const rotated_y = g_sr_r(new_y, new_x, rotation);
                
                (rotated_x, rotated_y)
            })
        });
    }, -100);
});
`;