export default `
createBehavior!("square");

behaviorGraph!("square", {
    const rot = pi/4;
    const xpos = getVal!("square", "base.transform.x");
    const ypos = getVal!("square", "base.transform.y");
    const xscale = getVal!("square", "base.transform.scale_x")*rot;
    const yscale = getVal!("square", "base.transform.scale_y")*rot;

    const p1 = ((x-xpos)/xscale)*cos(rot) + ((y-ypos)/yscale)*sin(rot);
    const p2 = ((y-ypos)/yscale)*cos(rot) - ((x-xpos)/xscale)*sin(rot);

    state = abs(p1)+abs(p2);
});

finalizeBehavior!("square");
`;