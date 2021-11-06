import {TemplatesObject} from "logimat";
import {createObject, finalize, getVal, noRegisterSetValAction, setMut, setVal, setValAction, useBehavior} from "./modules/object";
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