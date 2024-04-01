import {finalize, finalize1, finalize2, initialize, registerAction, setGlobalDefaultDisplay} from "./modules/main";
import {
    behaviorCustom,
    createBehavior,
    extendBehavior,
    getBehaviorArgs,
    getVal,
    helper,
    noRegisterSetValAction,
    objectID,
    setBehavior,
    setDefaultDisplay,
    setDisplay,
    setInline,
    setItemDisplay,
    setItemName,
    setMut,
    setVal,
    setValAction,
    setValArgs
} from "./modules/component";
import {createObject, handleMuts, setObject, setObjectVal, useBehavior, useBehaviorPost} from "./modules/object";
import {
    getDisplay,
    getValSelect, noRegisterSetValActionSelect, reIncrement,
    selectAll,
    selectBehavior, selectCustom, selectedID,
    selectID, setInlineSelect, setItemDisplaySelect, setItemNameSelect, setMutSelect,
    setValActionSelect,
    setValSelect
} from "./modules/select";
import {TemplatesObject} from "logimat";
import {createPrefab, extendPrefab, setPrefab, setPrefabVal, useBehaviorPrefab, usePrefab} from "./modules/prefab";

export const templates: TemplatesObject = {
    //Main
    initialize,
    setGlobalDefaultDisplay,
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
    setItemName,
    setItemDisplay,
    setDefaultDisplay,
    //Object
    createObject,
    useBehavior,
    useBehaviorPost,
    setObjectVal,
    setObject,
    handleMuts,
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
    selectCustom,
    setItemNameSelect,
    setItemDisplaySelect,
    //Prefab
    createPrefab,
    extendPrefab,
    useBehaviorPrefab,
    setPrefabVal,
    usePrefab,
    setPrefab
};

export const postTemplates: string = "finalize!();";