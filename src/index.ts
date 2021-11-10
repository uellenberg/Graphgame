import {TemplatesObject} from "logimat";
import {
    createObject,
    finalize,
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
    setBehaviorValArgs
} from "./modules/component";

export const templates: TemplatesObject = {
    //Object
    createObject,
    setMut,
    getVal,
    setVal,
    setValAction,
    finalize,
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
    setBehaviorValArgs
};