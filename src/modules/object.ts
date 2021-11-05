import {TemplateObject} from "logimat";
import {GameObject} from "../GameObject";
import {SemiMutable} from "../SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {
    ensureState,
    expressionCheck,
    getNum,
    getSemiMut,
    getString,
    objectCheck,
    objectVarCheck,
    outerCheck,
    behaviorCheck
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

        return "";
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
        const name = getString(args, state, 1, "A variable name is required!");

        objectCheck(state, id);
        objectVarCheck(state, id, name);

        return getSemiMut(state, id, name).get();
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
        const name = getString(args, state, 1, "A behavior name is required!");

        objectCheck(state, id);
        behaviorCheck(state, name);

        state.graphgame.lastObjectBehaviorId = id;

        return state.graphgame.behaviors[name].compile(id);
    }
};

/**
 * Finalize the game. This must be the last template called.
 * Usage: finalize!();
 */
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

        for(const name in state.graphgame.actions) {
            const val = state.graphgame.actions[name];

            output.push(`action ${name + "update"} = ${name} {
                state = ${val};
            }`);
            state.graphgame.finalActions.push(name + "update");
        }

        output.push("actions m_ain = " + state.graphgame.finalActions.join(", ") + ";");

        return output.join("\n");
    }
}
