import {TemplateArgs, TemplateContext} from "logimat";
import {TemplateState} from "./types/TemplateState";
import {SemiMutable} from "./types/SemiMutable";

export const ensureState = (state: TemplateState) => {
    if (!state.hasOwnProperty("graphgame")) state.graphgame = { objects: {}, behaviors: {}, actions: {}, finalActions: [], finalized: false, lastObjectBehaviorId: null, lastObjectBehaviorArgs: null, postActions: [], selects: [], currentObjectId: null, postInit: false, prefabs: [], toIncrement: null, currentBehavior: "", currentPrefab: "", currentObject: 0, nextObjectId: 1, nextVariableId: 1 };
    if(state.graphgame.finalized) throw new Error("Do not run any other templates after finalizing!");
};

//Context checks

export const outerCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.OuterDeclaration) throw new Error("This can only be ran from outside of any functions.");
};

export const expressionCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.Expression) throw new Error("This can only be ran from within an expression.");
};

export const outerInnerCheck = (context: TemplateContext) : void => {
    if(context === TemplateContext.Expression) throw new Error("This cannot be ran from within an expression.");
}

//GameObject checks

export const objectCheck = (state: TemplateState, id: number) : void => {
    if(!state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" does not exist!");
};

export const objectVarCheck = (state: TemplateState, id: number, name: string) : void => {
    if(!state.graphgame.objects[id].hasOwnProperty(name)) throw new Error("A variable with the name \"" + name + "\" does not exist!");
};

export const getSemiMut = (state: TemplateState, id: number, name: string) : SemiMutable => {
    return state.graphgame.objects[id][name];
};

//Behavior checks

export const behaviorCheck = (state: TemplateState, name: string) : void => {
    if(!state.graphgame.behaviors.hasOwnProperty(name)) throw new Error("A behavior with the name \"" + name + "\" does not exist!");
};

//Prefab checks

export const prefabCheck = (state: TemplateState, name: string) : void => {
    if(!state.graphgame.prefabs.hasOwnProperty(name)) throw new Error("A prefab with the name \"" + name + "\" does not exist!");
};

//Arg checks

export const getNum = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : number => {
    if(args.length < idx+1 || args[idx] == null || typeof(args[idx]) !== "number" || isNaN(<number>args[idx])) {
        if(error) throw new Error(error);
        else return null;
    }
    return <number>args[idx];
};

export const getBoolean = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : boolean => {
    if(args.length < idx+1 || args[idx] == null || typeof(args[idx]) !== "boolean") {
        if(error) throw new Error(error);
        else return false;
    }
    return <boolean>args[idx];
};

export const getString = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string => {
    if(args.length < idx+1 || args[idx] == null || typeof(args[idx]) !== "string") {
        if(error) throw new Error(error);
        else return null;
    }
    return <string>args[idx];
};

export const getAnyAsString = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string => {
    if(args.length < idx+1 || args[idx] == null) {
        if(error) throw new Error(error);
        else return null;
    }
    return args[idx].toString();
};

export const getNumOrString = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string | number => {
    if(args.length < idx+1 || args[idx] == null || (typeof(args[idx]) != "string" && typeof(args[idx]) != "number")) {
        if(error) throw new Error(error);
        else return null;
    }
    return <string | number>args[idx];
};

export const getBlock = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string => {
    if(args.length < idx+1 || args[idx] == null || typeof(args[idx]) !== "object" || !args[idx]["block"]) {
        if(error) throw new Error(error);
        else return null;
    }
    return <string>args[idx]["value"];
};

//Dot access helper

export const getFullVariableName = (varName: string, behaviorName: string) => (varName.startsWith("base.") ? varName.substring(5) : behaviorName + varName).replace(/[._]/g, "");

export const getShortVariableName = (varName: string) => varName.split(".").pop();