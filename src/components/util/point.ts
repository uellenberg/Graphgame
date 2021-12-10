export default `
createBehavior!("point");

setMut!("point", "base.transform.x");
setMut!("point", "base.transform.y");

behaviorCustom!("point", {
    point (getVal!("point", "base.transform.x"), getVal!("point", "base.transform.y"));
}, -400);

finalizeBehavior!("point");
`;