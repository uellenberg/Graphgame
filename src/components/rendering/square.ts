export default `
createBehavior!("square");

helper!("square", {
    export function g_raphgame_helper_square_rotate(a, b, r) {
        state = a*cos(r) + b*sin(r);
    }
});

behaviorCustom!("square", {
    getDisplay!();

    polygon({
        const x = getVal!("square", "base.transform.x");
        const y = getVal!("square", "base.transform.y");
        const x_scale = getVal!("square", "base.transform.scale_x");
        const y_scale = getVal!("square", "base.transform.scale_y");
        const rotation = getVal!("square", "base.transform.rotation");
    
        state = (x, y) + [(-1/2, -1/2), (1/2, -1/2), (1/2, 1/2), (-1/2, 1/2)].map(s_point => {
            const new_x = x_scale*s_point.x;
            const new_y = y_scale*s_point.y;
            
            const rotated_x = g_raphgame_helper_square_rotate(new_x, -new_y, rotation);
            const rotated_y = g_raphgame_helper_square_rotate(new_y, new_x, rotation);
            
            state = (rotated_x, rotated_y);
        });
    });
}, -100);

finalizeBehavior!("square");
`;