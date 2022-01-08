import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    behaviorCheck,
    ensureState,
    expressionCheck, getBlock,
    getBoolean,
    getFullVariableName,
    getNum,
    getSemiMut,
    getShortVariableName,
    getString,
    objectVarCheck,
    outerCheck, outerInnerCheck
} from "../util";
import {Behavior} from "../types/Behavior";

/**
 * Creates a new behavior.
 * Usage: createBehavior!(name: string, body: Body);
 */
export const createBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body = getBlock(args, state, 1, "A behavior definition is required!");

        if(state.graphgame.behaviors.hasOwnProperty(name)) throw new Error("A behavior with the name \"" + name + "\" already exists!");

        state.graphgame.behaviors[name] = new Behavior(name);

        state.graphgame.currentBehavior = name;

        return body;
    }
};

/**
 * Add to an already existing behavior.
 * Usage: extendBehavior!(name: string, body: Body);
 */
export const extendBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const body = getBlock(args, state, 1, "A behavior definition is required!");

        if(!state.graphgame.behaviors.hasOwnProperty(name)) throw new Error("A behavior with the name \"" + name + "\" does not exist!");

        state.graphgame.currentBehavior = name;

        return body;
    }
};

/**
 * Marks a behavior's variable as mutable (changable after compilation).
 * Usage: setMut!(variableName: string);
 */
export const setMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setMutSelect!("${getFullVariableName(varName, name)}");
        selectID!();`);

        return "";
    }
};

/**
 * Marks a behavior's variable as mutable (changable after compilation), but inlines it instead of exporting it.
 * Usage: setInline!(variableName: string);
 */
export const setInline: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setInlineSelect!("${getFullVariableName(varName, name)}");
        selectID!();`);

        return "";
    }
};

/**
 * Get the value of a behavior's variable. A boolean can be supplied to get the currently saved value instead of the current value.
 * Usage: getVal!(variableName: string, saved?: boolean);
 */
export const getVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();
        const saved = getBoolean(args, state, 1);

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
 * Usage: setVal!(variableName: string, val: number);
 */
export const setVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();
        const val = getNum(args, state, 1, "A value is required!");

        behaviorCheck(state, name);
        
        state.graphgame.behaviors[name].add((id: number) => `selectID!(${id});
        setValSelect!("${getFullVariableName(varName, name)}", ${val});
        selectID!();`);

        return "";
    }
};

/**
 * Set the value of a behavior's variable (during compilation) using a zero-based argument that was passed to the behavior when it was added to the GameObject. This must be used before a variable is marked as mutable.
 * Usage: setValArgs!(variableName: string, arg: number, defaultVal?: number);
 */
export const setValArgs: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();
        const idx = getNum(args, state, 1, "An argument index is required!");
        const defaultVal = getNum(args, state, 2);

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
            else if(typeof(val) === "object" && val["block"]) val = val["value"];
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
 * Usage: setValAction!(variableName: string, body: Body, priority?: number = 0, exported?: boolean = false, variable?: boolean = false);
 */
export const setValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();
        const body = getBlock(args, state, 1, "An action body is required!");
        const priority = getNum(args, state, 2) || 0;
        const exported = getBoolean(args, state, 3);
        const variable = getBoolean(args, state, 4);

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `selectID!(${id});
        setValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};setBehavior!("${name}");${body}setBehavior!();}, ${exported ? "true" : "false"}, ${variable ? "true" : "false"});
        selectID!();`, priority);

        return "";
    }
};

/**
 * Create an action that sets the value of a behavior's variable (during runtime). This must be run manually (or as the click property of an object). This must be used after a variable is marked as mutable.
 * Usage: noRegisterSetValAction!(variableName: string, body: Body, actionName?: string, priority?: number = 0);
 */
export const noRegisterSetValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const varName = getString(args, state, 0, "A variable name is required!").trim().toLowerCase();
        const body = getBlock(args, state, 1, "An action body is required!");
        const actionName = getString(args, state, 2)?.trim().toLowerCase();
        const priority = getNum(args, state, 3) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number) => `selectID!(${id});
        noRegisterSetValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};setBehavior!("${name}");${body}setBehavior!();}${actionName ? ", \"" + actionName + "\"" : ""});
        selectID!();`, priority);

        return "";
    }
};

/**
 * Create a graph of this object.
 * If only one body is defined, the graph will use 1=body1, and body1=body2 otherwise.
 * Usage: behaviorGraph!(body1: Body, operator?: string, body2?: ActionBody);
 */
export const behaviorGraph: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const body1 = getBlock(args, state, 0, "An action body is required!");
        const operator = getString(args, state, 1);
        const body2 = getBlock(args, state, 2);
        const priority = getNum(args, state, 3) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost((id: number, idx: number) => {
            return `selectID!(${id});
            setBehavior!("${name}");
            
            inline function g_raphgamepost${name}a${id}a${idx}a1(x, y) {
                ${body2 ? body1 : "state = 1;"}
            }
            inline function g_raphgamepost${name}a${id}a${idx}a2(x, y) {
                ${body2 ? body2 : body1}
            }
            graph { g_raphgamepost${name}a${id}a${idx}a1(x, y) } ${operator || "="} { g_raphgamepost${name}a${id}a${idx}a2(x, y) };
            
            setBehavior!();
            selectID!();`;
        }, priority);

        return "";
    }
};

/**
 * Create custom declarations on the behavior. This is ideal for graphs, polygons, points, etc, but should not be used for named declarations ((functions, consts, etc).
 * Usage: behaviorCustom!(body: Body, priority?: number = 0);
 */
export const behaviorCustom: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const body = getBlock(args, state, 0, "A body is required!");
        const priority = getNum(args, state, 1) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addPost(id => {
            return `selectID!(${id});
            setBehavior!("${name}");
            ${body}
            setBehavior!();
            selectID!();`;
        }, priority);

        return "";
    }
};

/**
 * Allows modifying the display properties of any object that this is attached to.
 * Usage: setDisplay!(body: Body, priority?: number = 0);
 */
export const setDisplay: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const body = getBlock(args, state, 0, "An action body is required!");
        const priority = getNum(args, state, 1) || 0;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addDisplay(body, priority);

        return "";
    }
};

/**
 * Gets a zero-based argument that was passed to the behavior when it was added to the GameObject.
 * Usage: getBehaviorArgs!(arg: number);
 */
export const getBehaviorArgs: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);

        const idx = getNum(args, state, 0, "An argument index is required!");

        if(state.graphgame.lastObjectBehaviorArgs.length <= idx) throw new Error("This behavior requires at least " + (idx+1) + " arguments!");

        let val = state.graphgame.lastObjectBehaviorArgs[idx];
        if(typeof(val) === "string") val = `"${val}"`;
        else if(typeof(val) === "object" && val["block"]) val = val["value"];
        else val = val.toString();

        return val;
    }
};

/**
 * Allows creating helper methods at certain priorities, and which are only output if the behavior they are attached to is used.
 * Usage: helper!(body: Body, priority?: number = 0);
 */
export const helper: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentBehavior;
        const body = getBlock(args, state, 0, "An action body is required!");
        const priority = getNum(args, state, 1) ?? -10000;

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].addHelper(body, priority);

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

/**
 * For internal use only.
 */
export const setBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        state.graphgame.currentBehavior = getString(args, state, 0) || "";

        return "";
    }
};