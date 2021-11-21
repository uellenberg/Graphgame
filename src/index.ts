import {TemplatesObject} from "logimat";
import {
    createObject,
    getVal,
    noRegisterSetValAction,
    setMut,
    setVal,
    setValAction,
    useBehavior,
    useBehaviorPost
} from "./modules/object";
import {
    createBehavior,
    setBehaviorMut,
    getBehaviorVal,
    setBehaviorVal,
    setBehaviorValAction,
    noRegisterSetBehaviorValAction,
    finalizeBehavior,
    getBehaviorArgs,
    setBehaviorValArgs, behaviorGraph
} from "./modules/component";
import {finalize, initialize, registerAction} from "./modules/main";

export const templates: TemplatesObject = {
    //Main
    initialize,
    registerAction,
    finalize,
    //Object
    createObject,
    setMut,
    getVal,
    setVal,
    setValAction,
    noRegisterSetValAction,
    useBehavior,
    useBehaviorPost,
    //Behavior
    createBehavior,
    setBehaviorMut,
    getBehaviorVal,
    setBehaviorVal,
    setBehaviorValAction,
    noRegisterSetBehaviorValAction,
    finalizeBehavior,
    getBehaviorArgs,
    setBehaviorValArgs,
    behaviorGraph
};