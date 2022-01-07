export default `
createBehavior!("circle");

//TODO: Implement rotation.
behaviorCustom!({
    getDisplay!();

    graph { {
        const p1 = x-getVal!("base.transform.x");
        const p2 = y-getVal!("base.transform.y");

        state = (p1^2)/getVal!("base.transform.scale_x") + (p2^2)/getVal!("base.transform.scale_y");
    } } = { 1 };
}, -100);

finalizeBehavior!();
`;