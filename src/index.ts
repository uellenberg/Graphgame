import {finalize, finalize1, finalize2, initialize, registerAction} from "./modules/main";
import {
    behaviorCustom,
    createBehavior, extendBehavior, getBehaviorArgs,
    getVal, helper,
    noRegisterSetValAction, objectID, setBehavior, setDisplay, setInline,
    setMut,
    setVal,
    setValAction,
    setValArgs
} from "./modules/component";
import {createObject, setObject, setObjectVal, useBehavior, useBehaviorPost} from "./modules/object";
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
import {createPrefab, extendPrefab, setPrefab, setPrefabVal, useBehaviorPrefab, usePrefab} from "./modules/prefab";

export const templates: TemplatesObject = {
    //Main
    initialize,
    registerAction,
    finalize,
    finalize1,
    finalize2,
    //Component
    createBehavior,
    extendBehavior,
    setMut,
    setInline,
    getVal,
    setVal,
    setValArgs,
    setValAction,
    noRegisterSetValAction,
    behaviorCustom,
    setDisplay,
    getBehaviorArgs,
    objectID,
    helper,
    setBehavior,
    //Object
    createObject,
    useBehavior,
    useBehaviorPost,
    setObjectVal,
    setObject,
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
    extendPrefab,
    useBehaviorPrefab,
    setPrefabVal,
    usePrefab,
    setPrefab
};

export const postTemplates: string = "finalize!();";