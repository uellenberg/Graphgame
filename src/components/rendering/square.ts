export default `
createBehavior!("square");

helper!({
    export function g_raphgame_helper_square_rotate(a, b, r) {
        state = a*cos(r) + b*sin(r);
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
    
        state = (x, y) + [(-1/2, -1/2), (1/2, -1/2), (1/2, 1/2), (-1/2, 1/2)].map(s_point => {
            const new_x = x_scale*s_point.x;
            const new_y = y_scale*s_point.y;
            
            const rotated_x = g_raphgame_helper_square_rotate(new_x, -new_y, rotation);
            const rotated_y = g_raphgame_helper_square_rotate(new_y, new_x, rotation);
            
            state = (rotated_x, rotated_y);
        });
    });
}, -100);

finalizeBehavior!();
`;