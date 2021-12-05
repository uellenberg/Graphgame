export default `
createBehavior!("square");

behaviorGraph!("square", {
    const xpos = getVal!("square", "base.transform.x");
    const ypos = getVal!("square", "base.transform.y");
    const rot = pi/4;

    const p1 = (x-xpos)*cos(rot) + (y-ypos)*sin(rot);
    const p2 = (y-ypos)*cos(rot) - (x-xpos)*sin(rot);

    state = (abs(p1)+abs(p2))/getVal!("square", "base.transform.scale");
});

finalizeBehavior!("square");
`;