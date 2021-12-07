import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    ensureState,
    expressionCheck, getAnyAsString,
    getNum,
    getSemiMut,
    getString,
    objectCheck,
    objectVarCheck,
    outerCheck,
    outerInnerCheck
} from "../util";
import {SemiMutable} from "../types/SemiMutable";

/**
 * Sets a specific ID to be the one used by select templates.
 * Usage: selectID!(id?: number);
 */
export const selectID: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        state.graphgame.currentObjectId = getNum(args, state, 0);
        return "";
    }
}

/**
 * Gets the currently selected ID.
 * Usage: selectedID!();
 */
export const selectedID: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        return state.graphgame.currentObjectId.toString();
    }
}

/**
 * Selects every object and uses the specified body on each.
 * Usage: selectAll!(body: string);
 */
export const selectAll: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        const body = getString(args, state, 0, "A body is required!");

        const func = (state: TemplateState) => {
            state.graphgame.postInit = true;

            const output: string[] = [];

            for (let id of Object.keys(state.graphgame.objects)) {
                output.push("selectID!(" + id + ");");
                output.push(body);
            }

            output.push("selectID!();");

            return output.join("\n");
        };

        if(state.graphgame.postInit) return func(state);
        return func;
    }
};

/**
 * Selects every object that has a specific behavior and uses the specified body on each.
 * Usage: selectBehavior!(behavior: string, body: string);
 */
export const selectBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        const behavior = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body = getString(args, state, 1, "A body is required!");

        const func = (state: TemplateState) => {
            state.graphgame.postInit = true;

            const output: string[] = [];

            for (let id of Object.keys(state.graphgame.objects)) {
                if(!state.graphgame.objects[id].behaviors.includes(behavior)) continue;

                output.push("selectID!(" + id + ");");
                output.push(body);
            }

            output.push("selectID!();");

            return output.join("\n");
        };

        if(state.graphgame.postInit) return func(state);
        return func;
    }
};

/**
 * Marks the current object's variable as mutable (changable after compilation).
 * Usage: setMutSelect!(variableName: string);
 */
export const setMutSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/\./g, "");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(semimut.isMut()) return "";

        const value = semimut.get();
        semimut.mut();

        return "export const " + semimut.name() + " = " + value + ";";
    }
};

/**
 * Get the value of the current object's variable.
 * Usage: getValSelect!(variableName: string)
 */
export const getValSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/\./g, "");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const value = getSemiMut(state, id, name);
        if(typeof(value) === "string") return value;

        console.log("get " + value.get());
        return value.get();
    }
};

/**
 * Set the value of the current object's variable (during compilation). This must be used before a variable is marked as mutable.
 * Usage: setValSelect!(variableName: string, val: number);
 */
export const setValSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/\./g, "");
        const val = getAnyAsString(args, state, 1, "A value is required!");

        const parsed = parseInt(val);

        objectCheck(state, id);

        if(!isNaN(parsed)) {
            if(!state.graphgame.objects[id].hasOwnProperty(name)) {
                state.graphgame.objects[id][name] = new SemiMutable(name, id, parsed);
            } else {
                //The error message is included in here.
                getSemiMut(state, id, name).set(parsed);
            }
        } else {
            if(state.graphgame.objects[id].hasOwnProperty(name)) {
                throw new Error("The variable \"" + name + "\" already exists! Consider using actions or a different variable name.");
            }

            state.graphgame.objects[id][name] = `g_raphgameobject${id}${name}`;

            return `
            inline function g_raphgameobject${id}${name}_get() {
                ${val}
            }
            
            inline const g_raphgameobject${id}${name} = g_raphgameobject${id}${name}_get();`;
        }

        return "";
    }
};

/**
 * Set the value of the current object's variable on update (during runtime). This must be used after a variable is marked as mutable.
 * Usage: setValActionSelect!(variableName: string, body: ActionBody);
 */
export const setValActionSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/\./g, "");
        const body = getString(args, state, 1, "An action body is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        const semimutVar = semimut.name(true);

        const oldSemimut = semimut.get();
        semimut.increment();
        const semimutName = semimut.name();

        console.log("bumped " + semimut.get());

        state.graphgame.actions[semimutVar] = semimut.get();

        return `inline function ${semimutName}() {
            const ${name} = ${oldSemimut};
            ${body}
        }`;
    }
};

/**
 * Create an action that sets the value of the current object's variable (during runtime). This must be ran manually. This must be used after a variable is marked as mutable.
 * Usage: noRegisterSetValActionSelect!(variableName: string, body: ActionBody, actionName: string);
 */
export const noRegisterSetValActionSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/\./g, "");
        const body = getString(args, state, 1, "An action body is required!");
        const actionName = getString(args, state, 2)?.trim().toLowerCase();

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        //this_action => 1
        //nextName (update) => semimutName == 1 ? body : oldName.
        //semimutName (update) => 0

        //When this action is triggered, it sets a value to one. During the update,
        //the next value for this semimut is checked for 1, and is set to the body
        //given here, and the oldValue otherwise. Then, the value is reset back to
        //0. This ensures continuity and only sets the body when the action is triggered.

        const semimutVar = semimut.name(true);

        const oldSemimut = semimut.get();
        semimut.increment();
        const indicatorName = semimut.name();
        semimut.increment();
        const semimutName = semimut.name();

        state.graphgame.actions[semimutVar] = semimut.get();

        state.graphgame.finalActions.push(indicatorName + "set");

        return `export const ${indicatorName} = 0;
        action ${(actionName ? actionName + " = " : "") + indicatorName} {
            state = 1;
        }
        action ${indicatorName + "set" + " = " + indicatorName} {
            state = 0;
        }
        inline function ${semimutName}() {
            if(${indicatorName} == 1) {
                const ${name} = ${oldSemimut};
                ${body}
            } else {
                state = ${oldSemimut};
            }
        }`;
    }
};