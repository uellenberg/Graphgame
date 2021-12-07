export default `
export function g_raphgame_square_helper(x, y, r_ot, p_x, p_y, s_x, s_y) {
    const p1 = ((x-p_x)/s_x)*cos(r_ot) + ((y-p_y)/s_y)*sin(r_ot);
    const p2 = ((y-p_y)/s_y)*cos(r_ot) - ((x-p_x)/s_x)*sin(r_ot);

    state = abs(p1)+abs(p2);
}

createBehavior!("square");

behaviorGraph!("square", {
    const rot = pi/4;
    const xpos = getVal!("square", "base.transform.x");
    const ypos = getVal!("square", "base.transform.y");
    const xscale = getVal!("square", "base.transform.scale_x")*cos(rot);
    const yscale = getVal!("square", "base.transform.scale_y")*sin(rot);

    state = g_raphgame_square_helper(x, y, rot, xpos, ypos, xscale, yscale);
}, null, null, 300);

finalizeBehavior!("square");
`;