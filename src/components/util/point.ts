export default `
createBehavior!("point");

setMut!("base.transform.x");
setMut!("base.transform.y");

behaviorCustom!({
    getDisplay!();

    point (getVal!("base.transform.x"), getVal!("base.transform.y"));
}, -400);

finalizeBehavior!();
`;