export default `
createBehavior!("circle");

behaviorGraph!("circle", {
    const p1 = x-getVal!("circle", "base.transform.x");
    const p2 = y-getVal!("circle", "base.transform.y");

    state = (p1^2+p2^2)/getVal!("circle", "base.transform.scale");
});

finalizeBehavior!("circle");
`;