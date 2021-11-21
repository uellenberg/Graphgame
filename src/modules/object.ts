import {TemplateObject} from "logimat";
import {GameObject} from "../types/GameObject";
import {SemiMutable} from "../types/SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {
    behaviorCheck,
    ensureState,
    expressionCheck,
    getNum,
    getSemiMut,
    getString,
    objectCheck,
    objectVarCheck,
    outerCheck
} from "../util";

/**
 * Creates a new object.
 * Usage: createObject!(id: number);
 */
export const createObject: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");

        if(state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" already exists!");

        state.graphgame.objects[id] = new GameObject(id);

        return `useBehavior!(${id}, "transform");`;
    }
};

/**
 * Marks an object's variable as mutable (changable after compilation).
 * Usage: setMut!(objectId: number, variableName: string);
 */
export const setMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");

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
 * Get the value of an object's variable.
 * Usage: getVal!(objectId: number, variableName: string)
 */
export const getVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!").replace(/\./g, "");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        return getSemiMut(state, id, name).get(-1);
    }
};

/**
 * Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable.
 * Usage: setVal!(objectId: number, variableName: string, val: number);
 */
export const setVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");
        const val = getNum(args, state, 2, "A value is required!");

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
 * Set the value of an object's variable on update (during runtime). This must be used after a variable is marked as mutable.
 * Usage: setValAction!(objectId: number, variableName: string, body: ActionBody);
 */
export const setValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        const semimut = getSemiMut(state, id, name);
        if(!semimut.isMut()) throw new Error("A variable must be marked as mutable before it can be used in an action!");

        const semimutVar = semimut.name(true);

        const oldSemimut = semimut.get();
        semimut.increment();
        const semimutName = semimut.name();

        state.graphgame.actions[semimutVar] = semimut.get();

        return `inline function ${semimutName}() {
            const ${name} = ${oldSemimut};
            ${body}
        }`;
    }
};

/**
 * Create an action that sets the value of an object's variable (during runtime). This must be ran manually. This must be used after a variable is marked as mutable.
 * Usage: noRegisterSetValAction!(objectId: number, variableName: string, body: ActionBody, actionName: string);
 */
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

/**
 * Add a behavior to an object.
 * Usage: useBehavior!(objectId: number, behaviorName: string);
 */
export const useBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A behavior name is required!").trim().toLowerCase();

        objectCheck(state, id);
        behaviorCheck(state, name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(2);

        state.graphgame.postActions.push((state) => {
            return `useBehaviorPost!(${id}, \"${name}\"${args.length > 2 ? ", " + args.slice(2).join(", ") : ""});\n` + state.graphgame.behaviors[name].compilePost(id);
        });

        return state.graphgame.behaviors[name].compile(id);
    }
};

/**
 * Internal use only.
 */
export const useBehaviorPost: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A behavior name is required!");

        objectCheck(state, id);
        behaviorCheck(state, name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(2);

        return "";
    }
};