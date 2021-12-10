import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    ensureState,
    expressionCheck, getAnyAsString, getBoolean,
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
            const output: string[] = [];

            //Sort in ascending order.
            for (let id of Object.keys(state.graphgame.objects).map(id => parseInt(id)).sort((a, b) => a-b)) {
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
            const output: string[] = [];

            //Sort in ascending order.
            for (let id of Object.keys(state.graphgame.objects).map(id => parseInt(id)).sort((a, b) => a-b)) {
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
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");

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
 * Marks the current object's variable as mutable, but inlines it instead of exporting it.
 * Usage: setInlineSelect!(variableName: string);
 */
export const setInlineSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(semimut.isMut()) return "";

        const value = semimut.get();
        semimut.inline();

        return "inline const " + semimut.name() + " = " + value + ";";
    }
};

/**
 * Get the value of the current object's variable. A boolean can be supplied to get the currently saved value instead of the current value.
 * Usage: getValSelect!(variableName: string, saved?: boolean)
 */
export const getValSelect: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const id = state.graphgame.currentObjectId;
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");
        const saved = getBoolean(args, state, 1);

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const value = getSemiMut(state, id, name);

        if(saved && value.isMut()) return value.name(true);
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
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");
        const val = getNum(args, state, 1, "A value is required!");

        objectCheck(state, id);

        if(!state.graphgame.objects[id].hasOwnProperty(name)) {
            state.graphgame.objects[id][name] = new SemiMutable(name, id, val);
        } else {
            //The error message is included in here.
            getSemiMut(state, id, name).set(val);
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
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");
        const body = getString(args, state, 1, "An action body is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        const semimutVar = semimut.name(true);

        const oldSemimut = semimut.get();
        semimut.increment();
        const semimutName = semimut.name();

        if(!semimut.isInline()) state.graphgame.actions[semimutVar] = semimut.get();

        semimut.decrement();
        state.graphgame.toIncrement = semimut;

        return `inline function ${semimutName}() {
            const ${name} = ${oldSemimut};
            ${body}
        }
        reIncrement!();`;
    }
};

/**
 * For internal use only.
 */
export const reIncrement: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        state.graphgame.toIncrement.increment();

        return "";
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
        const name = getString(args, state, 0, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");
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