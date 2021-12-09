export default `
createBehavior!("square");

behaviorCustom!("square", {
    polygon({
        const x = getVal!("square", "base.transform.x") + getVal!("square", "base.transform.offset_x");
        const y = getVal!("square", "base.transform.y") + getVal!("square", "base.transform.offset_y");
        const x_scale = getVal!("square", "base.transform.scale_x");
        const y_scale = getVal!("square", "base.transform.scale_y");
    
        state = (x, y) + x_scale*[(-1/2, 0), (1/2, 0), (1/2, 0), (-1/2, 0)] + y_scale*[(0, -1/2), (0, -1/2), (0, 1/2), (0, 1/2)];
    });
}, -100);

finalizeBehavior!("square");
`;