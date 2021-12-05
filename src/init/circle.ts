export default `
createBehavior!("circle");

behaviorGraph!("circle", {
    const p1 = x-getBehaviorVal!("circle", "base.transform.x");
    const p2 = y-getBehaviorVal!("circle", "base.transform.y");

    state = (p1^2+p2^2)/getBehaviorVal!("circle", "base.transform.scale");
});

finalizeBehavior!("circle");
`;