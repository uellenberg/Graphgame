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
    getFullVariableName, getShortVariableName, objectCheck, getAnyAsString, getBoolean
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
 * Usage: setMut!(name: string, variableName: string);
 */
export const setMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setMutSelect!("${getFullVariableName(varName, name)}");
        selectID!();`);

        return "";
    }
};

/**
 * Marks a behavior's variable as mutable (changable after compilation), but inlines it instead of exporting it.
 * Usage: setInline!(name: string, variableName: string);
 */
export const setInline: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setInlineSelect!("${getFullVariableName(varName, name)}");
        selectID!();`);

        return "";
    }
};

/**
 * Get the value of a behavior's variable. A boolean can be supplied to get the currently saved value instead of the current value.
 * Usage: getVal!(name: string, variableName: string, saved?: boolean)
 */
export const getVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const saved = getBoolean(args, state, 2);

        const fullName = getFullVariableName(varName, name);

        behaviorCheck(state, name);
        objectVarCheck(state, state.graphgame.lastObjectBehaviorId, fullName);

        const value = getSemiMut(state, state.graphgame.lastObjectBehaviorId, fullName);

        if(saved && value.isMut()) return value.name(true);
        return value.get();
    }
};

/**
 * Set the value of a behavior's variable (during compilation). This must be used before a variable is marked as mutable.
 * Usage: setVal!(name: string, variableName: string, val: number);
 */
export const setVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const val = getNum(args, state, 2, "A value is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setValSelect!("${getFullVariableName(varName, name)}", ${val});
        selectID!();`);

        return "";
    }
};

/**
 * Set the value of a behavior's variable (during compilation) using an argument that was passed to the behavior when it was added to the GameObject. This must be used before a variable is marked as mutable.
 * Usage: setValArgs!(name: string, variableName: string, arg: number);
 */
export const setValArgs: TemplateObject = {
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
                if(defaultVal == null) throw new Error("The behavior \"" + name + "\" requires at least " + (idx+1) + " arguments!");
                else val = defaultVal;
            } else {
                val = state.graphgame.lastObjectBehaviorArgs[idx];
            }

            if(typeof(val) === "string") val = `"${val}"`;
            else val = val.toString();

            return `selectID!(${id});
            setValSelect!("${getFullVariableName(varName, name)}", ${val});
            selectID!();`;
        });

        return "";
    }
};

/**
 * Set the value of a behavior's variable on update (during runtime). This must be used after a variable is marked as mutable.
 * Usage: setValAction!(name: string, variableName: string, body: ActionBody);
 */
export const setValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const body = getString(args, state, 2, "An action body is required!");
        const priority = getNum(args, state, 3) || 0;
        const exported = getBoolean(args, state, 4);
        const variable = getBoolean(args, state, 5);

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `selectID!(${id});
        setValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};${body}}, ${exported ? "true" : "false"}, ${variable ? "true" : "false"});
        selectID!();`, priority);

        return "";
    }
};

/**
 * Create an action that sets the value of a behavior's variable (during runtime). This must be ran manually. This must be used after a variable is marked as mutable.
 * Usage: noRegisterSetValAction!(name: string, variableName: string, body: ActionBody, actionName: string);
 */
export const noRegisterSetValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);


        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!").trim().toLowerCase();
        const body = getString(args, state, 2, "An action body is required!");
        const actionName = getString(args, state, 3)?.trim().toLowerCase();
        const priority = getNum(args, state, 4) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `selectID!(${id});
        noRegisterSetValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};${body}}${actionName ? ", \"" + actionName + "\"" : ""});
        selectID!();`, priority);

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
        const priority = getNum(args, state, 4) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number, idx: number) => {
            return `selectID!(${id});
            
            inline function g_raphgamepost${name}a${id}a${idx}a1(x, y) {
                ${body2 ? body1 : "state = 1;"}
            }
            inline function g_raphgamepost${name}a${id}a${idx}a2(x, y) {
                ${body2 ? body2 : body1}
            }
            graph { g_raphgamepost${name}a${id}a${idx}a1(x, y) } ${operator || "="} { g_raphgamepost${name}a${id}a${idx}a2(x, y) };
            
            selectID!();`;
        }, priority);

        return "";
    }
};

/**
 * Create custom declarations on the behavior. This is ideal for graphs, polygons, points, etc, but should not be used for named declarations.
 * Usage: behaviorCustom!(name: string, body: ActionBody);
 */
export const behaviorCustom: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body = getString(args, state, 1, "A body is required!");
        const priority = getNum(args, state, 2) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost(id => {
            return `selectID!(${id});
            ${body}
            selectID!();`;
        }, priority);

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

export const helper: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body = getString(args, state, 1, "An action body is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addHelper(body);

        return "";
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

/**
 * Gets the ID of the object that this behavior is currently attached to.
 * Usage: objectID!();
 */
export const objectID: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        return state.graphgame.lastObjectBehaviorId.toString();
    }
};