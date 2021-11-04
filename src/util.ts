import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {TemplateState} from "./types/TemplateState";
import {SemiMutable} from "./SemiMutable";

export const ensureState = (state: TemplateState) => {
    if (!state.hasOwnProperty("graphgame")) state.graphgame = { objects: {}, behaviors: {}, actions: {}, finalActions: [], finalized: false };
    if(state.graphgame.finalized) throw new Error("Do not run any other templates after finalizing!");
};

//Context checks

export const outerCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.OuterDeclaration) throw new Error("This can only be ran from outside of any functions.");
};

export const expressionCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.Expression) throw new Error("This can only be ran from within an expression.");
};

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

//Arg checks

export const getNum = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : number => {
    if(args.length < idx+1 || typeof(args[idx]) !== "number" || isNaN(<number>args[idx])) {
        if(error) throw new Error(error);
        else return null;
    }
    return <number>args[idx];
};

export const getString = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string => {
    if(args.length < idx+1 || typeof(args[idx]) !== "string" || !args[idx]) {
        if(error) throw new Error(error);
        else return null;
    }
    return <string>args[idx];
};
