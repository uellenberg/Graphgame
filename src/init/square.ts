export default `
createBehavior!("square");

behaviorCustom!("square", {
    polygon((getVal!("square", "base.transform.x"), getVal!("square", "base.transform.y")) + getVal!("square", "base.transform.scale_x")*[(-1/2, 0), (1/2, 0), (1/2, 0), (-1/2, 0)] + getVal!("square", "base.transform.scale_y")*[(0, -1/2), (0, -1/2), (0, 1/2), (0, 1/2)]);
}, 300);

finalizeBehavior!("square");
`;