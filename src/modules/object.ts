import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../GameObject";
import {SemiMutable} from "../SemiMutable";

interface TemplateState {
    graphgame: {
        objects: {
            [key: number]: GameObject
        },
        actions: string[],
        finalActions: SemiMutable[],
        finalized: boolean
    }
}

const ensureState = (state: TemplateState) => {
    if (!state.hasOwnProperty("graphgame")) state.graphgame = { objects: {}, actions: [], finalActions: [], finalized: false };
    if(state.graphgame.finalized) throw new Error("Do not run any other templates after finalizing!");
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
        console.log("get", args);
        ensureState(state);
        expressionCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        //We need to use the offset because gets are run after a set, which increments.
        return getSemiMut(state, id, name).get(-2);
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
        console.log("set", args);
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        const oldName = semimut.get();
        semimut.increment();

        const semimutName = semimut.get();
        state.graphgame.actions.push(semimutName + "set");

        if(!state.graphgame.finalActions.includes(semimut)) state.graphgame.finalActions.push(semimut);

        return `export const ${semimutName} = ${oldName};
        action ${semimutName + "set"} = ${semimutName} {
            ${body}
        }`;
    }
};

//TODO: fix this so that it doesn't break updates
export const noRegisterSetValAction: TemplateObject = {
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

        const oldName = semimut.get();
        semimut.increment();

        const semimutName = semimut.get();

        return `export const ${semimutName} = ${oldName};
        action ${actionName ? `${actionName} = ` : ""}${semimutName} {
            ${body}
        }`;
    }
};

export const finalize: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const output: string[] = [];

        for (const id of Object.keys(state.graphgame.objects)) {
            const object: GameObject = state.graphgame.objects[id];

            //Draw the object.
            output.push(`inline function graphGameDraw${id}(x, y) {
                if(${object.shape.get()} == 0) {
                    state = ((x-${object.x.get()})/${object.width.get()})^2+((y-${object.y.get()})/${object.height.get()})^2;
                } else {
                    state = 0;
                }
            }
            graph { 1 } = { graphGameDraw${id}(x, y) };`);
        }

        for(const semimut of state.graphgame.finalActions) {
            const noIncrement = semimut.name(true);
            const name = semimut.name();

            output.push(`action ${noIncrement + "update"} = ${noIncrement} {
                state = ${name};
            }`);
            state.graphgame.actions.push(noIncrement + "update");
        }

        output.push("actions m_ain = " + state.graphgame.actions.join(", ") + ";");

        return output.join("\n");
    }
}