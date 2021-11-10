export default `
createBehavior!("circle");

behaviorGraph!("circle", {
    const p1 = (x-getBehaviorVal!("circle", "base.transform.x"))/getBehaviorVal!("circle", "base.transform.scale");
    const p2 = (y-getBehaviorVal!("circle", "base.transform.y"))/getBehaviorVal!("circle", "base.transform.scale");

    state = p1^2+p2^2;
});

finalizeBehavior!("circle");
`;