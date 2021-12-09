export default `
createBehavior!("window_follower");

setInline!("window_follower", "base.transform.offset_x");
setInline!("window_follower", "base.transform.offset_y");

setValAction!("window_follower", "base.transform.offset_x", {
    state = 0;
    selectBehavior!("window", {
        state = getValSelect!("transform.scale_x");
    });
});

setValAction!("window_follower", "base.transform.offset_y", {
    state = 0;
    selectBehavior!("window", {
        state = getValSelect!("transform.scale_y");
    });
});

finalizeBehavior!("window_follower");
`;