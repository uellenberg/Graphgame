import {finalize, finalize1, finalize2, initialize, registerAction} from "./modules/main";
import {
    behaviorCustom,
    behaviorGraph,
    createBehavior, finalizeBehavior, getBehaviorArgs,
    getVal, helper,
    noRegisterSetValAction, objectID, setDisplay, setInline,
    setMut,
    setVal,
    setValAction,
    setValArgs
} from "./modules/component";
import {createObject, setObjectVal, useBehavior, useBehaviorPost} from "./modules/object";
import {
    getDisplay,
    getValSelect, noRegisterSetValActionSelect, reIncrement,
    selectAll,
    selectBehavior, selectedID,
    selectID, setInlineSelect,
    setMutSelect,
    setValActionSelect,
    setValSelect
} from "./modules/select";
import {TemplatesObject} from "logimat";
import {createPrefab, setPrefabVal, useBehaviorPrefab, usePrefab} from "./modules/prefab";

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
    setInline,
    getVal,
    setVal,
    setValArgs,
    setValAction,
    noRegisterSetValAction,
    behaviorGraph,
    behaviorCustom,
    setDisplay,
    getBehaviorArgs,
    finalizeBehavior,
    objectID,
    helper,
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
    setInlineSelect,
    getValSelect,
    setValSelect,
    setValActionSelect,
    noRegisterSetValActionSelect,
    reIncrement,
    getDisplay,
    //Prefab
    createPrefab,
    useBehaviorPrefab,
    setPrefabVal,
    usePrefab
};

export const postTemplates: string = "finalize!();";