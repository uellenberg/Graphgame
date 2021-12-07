import {finalize, finalize1, finalize2, initialize, registerAction} from "./modules/main";
import {
    behaviorCustom,
    behaviorGraph,
    createBehavior, finalizeBehavior, getBehaviorArgs,
    getVal,
    noRegisterSetValAction, objectID,
    setMut,
    setVal,
    setValAction,
    setValArgs
} from "./modules/component";
import {createObject, setObjectVal, useBehavior, useBehaviorPost} from "./modules/object";
import {
    getValSelect, noRegisterSetValActionSelect,
    selectAll,
    selectBehavior, selectedID,
    selectID,
    setMutSelect,
    setValActionSelect,
    setValSelect
} from "./modules/select";
import {TemplatesObject} from "logimat";

export const templates: TemplatesObject = {
    //Main
    initialize,
    registerAction,
    finalize,
    finalize1,
    finalize2,
    //Component
    createBehavior,
    setMut,
    getVal,
    setVal,
    setValArgs,
    setValAction,
    noRegisterSetValAction,
    behaviorGraph,
    behaviorCustom,
    getBehaviorArgs,
    finalizeBehavior,
    objectID,
    //Object
    createObject,
    useBehavior,
    useBehaviorPost,
    setObjectVal,
    //Select
    selectID,
    selectedID,
    selectAll,
    selectBehavior,
    setMutSelect,
    getValSelect,
    setValSelect,
    setValActionSelect,
    noRegisterSetValActionSelect
};

export const postTemplates: string = "finalize!();";