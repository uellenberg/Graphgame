import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../GameObject";
import {SemiMutable} from "../SemiMutable";

interface TemplateState {
    graphgame: {
        objects: {
            [key: number]: GameObject
        }
    }
}

const ensureState = (state: TemplateState) => {
    if (!state.hasOwnProperty("graphgame")) state.graphgame = { objects: {} };
    if (!state.graphgame.hasOwnProperty("objects")) state.graphgame.objects = {};
};


//Context checks

const outerCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.OuterDeclaration) throw new Error("This can only be ran from outside of any functions.");
};

const expressionCheck = (context: TemplateContext) : void => {
    if(context !== TemplateContext.Expression) throw new Error("This can only be ran from within an expression.");
};

//GameObject checks

const objectCheck = (state: TemplateState, id: number) : void => {
    if(!state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" does not exist!");
};

const objectVarCheck = (state: TemplateState, id: number, name: string) : void => {
    if(!state.graphgame.objects[id].hasOwnProperty(name)) throw new Error("A variable with the name \"" + name + "\" does not exist!");
};

const getSemiMut = (state: TemplateState, id: number, name: string) : SemiMutable => {
    return state.graphgame.objects[id][name];
}

//Arg checks

const getNum = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : number => {
    if(args.length < idx+1 || typeof(args[idx]) !== "number" || isNaN(<number>args[idx])) {
        if(error) throw new Error(error);
        else return null;
    }
    return <number>args[idx];
};

const getString = (args: TemplateArgs, state: TemplateState, idx: number, error: string = null) : string => {
    if(args.length < idx+1 || typeof(args[idx]) !== "string" || !args[idx]) {
        if(error) throw new Error(error);
        else return null;
    }
    return <string>args[idx];
};

//Templates

export const createObject: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");

        if(state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" already exists!");

        state.graphgame.objects[id] = new GameObject(id);

        return "";
    }
};

export const setMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        const value = semimut.get();
        semimut.mut();

        return "export const " + semimut.name() + " = " + value + ";";
    }
};

export const getVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        return getSemiMut(state, id, name).get();
    }
};

export const setVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");
        const val = getNum(args, state, 2, "A value is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        //The error message is included in here.
        getSemiMut(state, id, name).set(val);

        return "";
    }
};

export const setValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");
        const actionName = getString(args, state, 3);

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        return `action ${actionName ? `${actionName} = ` : ""}${semimut.get()} {
            ${body}
        }`;
    }
};