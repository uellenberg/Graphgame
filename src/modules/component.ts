import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../types/GameObject";
import {SemiMutable} from "../types/SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {
    ensureState,
    outerCheck,
    expressionCheck,
    behaviorCheck,
    objectVarCheck,
    getSemiMut,
    getNum,
    getString,
    getFullVariableName, getShortVariableName
} from "../util";
import {Behavior} from "../types/Behavior";

/**
 * Creates a new behavior.
 * Usage: createBehavior!(name: string);
 */
export const createBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();

        if(state.graphgame.objects.hasOwnProperty(name)) throw new Error("A behavior with the name \"" + name + "\" already exists!");

        state.graphgame.behaviors[name] = new Behavior(name);

        return "";
    }
};

/**
 * Marks a behavior's variable as mutable (changable after compilation).
 * Usage: setBehaviorMut!(name: string, variableName: string);
 */
export const setBehaviorMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setMut!(${id}, "${getFullVariableName(varName, name)}");`);

        return "";
    }
};

/**
 * Get the value of a behavior's variable.
 * Usage: getBehaviorVal!(name: string, variableName: string)
 */
export const getBehaviorVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        return `getVal!(${state.graphgame.lastObjectBehaviorId}, "${getFullVariableName(varName, name)}")`;
    }
};

/**
 * Set the value of a behavior's variable (during compilation). This must be used before a variable is marked as mutable.
 * Usage: setBehaviorVal!(name: string, variableName: string, val: number);
 */
export const setBehaviorVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const val = getNum(args, state, 2, "A value is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setVal!(${id}, "${getFullVariableName(varName, name)}", ${val});`);

        return "";
    }
};

/**
 * Set the value of a behavior's variable (during compilation) using an argument that was passed to the behavior when it was added to the GameObject. This must be used before a variable is marked as mutable.
 * Usage: setBehaviorValArgs!(name: string, variableName: string, arg: number);
 */
export const setBehaviorValArgs: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const idx = getNum(args, state, 2, "An argument index is required!");
        const defaultVal = getNum(args, state, 3);

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => {
            let val;
            if(state.graphgame.lastObjectBehaviorArgs.length <= idx) {
                if(defaultVal == null) throw new Error("This behavior requires at least " + (idx+1) + " arguments!");
                else val = defaultVal;
            } else {
                val = state.graphgame.lastObjectBehaviorArgs[idx];
            }

            if(typeof(val) === "string") val = `"${val}"`;
            else val = val.toString();

            return `setVal!(${id}, "${getFullVariableName(varName, name)}", ${val});`;
        });

        return "";
    }
};

/**
 * Set the value of a behavior's variable on update (during runtime). This must be used after a variable is marked as mutable.
 * Usage: setBehaviorValAction!(name: string, variableName: string, body: ActionBody);
 */
export const setBehaviorValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const body = getString(args, state, 2, "An action body is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `setValAction!(${id}, "${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};${body}});`);

        return "";
    }
};

/**
 * Create an action that sets the value of a behavior's variable (during runtime). This must be ran manually. This must be used after a variable is marked as mutable.
 * Usage: noRegisterSetBehaviorValAction!(name: string, variableName: string, body: ActionBody, actionName: string);
 */
export const noRegisterSetBehaviorValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const body = getString(args, state, 2, "An action body is required!");
        const actionName = getString(args, state, 3)?.trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `noRegisterSetValAction!(${id}, "${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};${body}}${actionName ? ", \"" + actionName + "\"" : ""});`);

        return "";
    }
};

/**
 * Create a graph of this object.
 * If only one body is defined, the graph will use 1=body1, and body1=body2 otherwise.
 * Usage: behaviorGraph!(name: string, body1: ActionBody, operator?: string, body2?: ActionBody);
 */
export const behaviorGraph: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body1 = getString(args, state, 1, "An action body is required!");
        const operator = getString(args, state, 2);
        const body2 = getString(args, state, 3);

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number, idx: number) => {
            return `inline function g_raphgamepost${name}a${id}a${idx}a1(x, y) {
                ${body2 ? body1 : "state = 1;"}
            }
            inline function g_raphgamepost${name}a${id}a${idx}a2(x, y) {
                ${body2 ? body2 : body1}
            }
            graph { g_raphgamepost${name}a${id}a${idx}a1(x, y) } ${operator || "="} { g_raphgamepost${name}a${id}a${idx}a2(x, y) };`;
        });

        return "";
    }
};

/**
 * Gets an argument that was passed to the behavior when it was added to the GameObject.
 * Usage getBehaviorArgs!(arg: number);
 */
export const getBehaviorArgs: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const idx = getNum(args, state, 0, "An argument index is required!");

        if(state.graphgame.lastObjectBehaviorArgs.length <= idx) throw new Error("This behavior requires at least " + (idx+1) + " arguments!");

        let val = state.graphgame.lastObjectBehaviorArgs[idx];
        if(typeof(val) === "string") val = `"${val}"`;
        else val = val.toString();

        return val;
    }
};

/**
 * Finalize the behavior. This must be the last template called on the behavior.
 * Usage: finalizeBehavior!(name: string);
 */
export const finalizeBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);
        
        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        
        behaviorCheck(state, name);

        state.graphgame.behaviors[name].finalize();
        
        return "";
    }
};
