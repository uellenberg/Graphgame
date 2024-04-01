import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    behaviorCheck,
    ensureState,
    expressionCheck, getBlock,
    getBoolean,
    getFullVariableName,
    getNum, getNumOrBlock,
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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.behaviors[name].add((id: number) => prefix + `selectID!(${id});
        setMutSelect!("${getFullVariableName(varName, name)}");
        selectID!();` + suffix, 1);

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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.behaviors[name].add((id: number) => prefix + `selectID!(${id});
        setInlineSelect!("${getFullVariableName(varName, name)}");
        selectID!();` + suffix, 1);

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
        const val = getNumOrBlock(args, state, 1, "A value is required!");

        behaviorCheck(state, name);

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        const itemPrefix = state.graphgame.behaviors[name].getItemPrefix();

        state.graphgame.behaviors[name].add((id: number) => prefix + `selectID!(${id});
        ${itemPrefix}
        setValSelect!("${getFullVariableName(varName, name)}", ${val});
        selectID!();` + suffix, 0);

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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        const itemPrefix = state.graphgame.behaviors[name].getItemPrefix();

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

            return prefix + `selectID!(${id});
            ${itemPrefix}
            setValSelect!("${getFullVariableName(varName, name)}", ${val});
            selectID!();` + suffix;
        }, 0);

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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        const itemPrefix = state.graphgame.behaviors[name].getItemPrefix();

        state.graphgame.behaviors[name].addPost((id: number) => prefix + `selectID!(${id});
        ${itemPrefix}
        setValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};setBehavior!("${name}");state = {${body}};setBehavior!();}, ${exported ? "true" : "false"}, ${variable ? "true" : "false"});
        selectID!();` + suffix, priority);
        state.graphgame.behaviors[name].muts.push(getFullVariableName(varName, name));

        return "";
    }
};

/**
 * Create an action that sets the value of a behavior's variable (during runtime). This must be run manually (or as the click property of an object). This must be used after a variable is marked as mutable.
 * This name must be unique (i.e., the behavior only exists on a single object).
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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        const itemPrefix = state.graphgame.behaviors[name].getItemPrefix();

        state.graphgame.behaviors[name].addPost((id: number) => prefix + `selectID!(${id});
        ${itemPrefix}
        noRegisterSetValActionSelect!("${getFullVariableName(varName, name)}", {const ${getShortVariableName(varName)} = ${getFullVariableName(varName, name)};setBehavior!("${name}");state = {${body}};setBehavior!();}${actionName ? ", \"" + actionName + "\"" : ""});
        selectID!();` + suffix, priority);
        state.graphgame.behaviors[name].muts.push(getFullVariableName(varName, name));

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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.behaviors[name].addPost(id => {
            return prefix + `selectID!(${id});
            selectCustom!({setBehavior!("${name}");${body}setBehavior!();});
            selectID!();` + suffix;
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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.behaviors[name].addDisplay(prefix + body + suffix, priority);

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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.behaviors[name].addHelper(prefix + body + suffix, priority);

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
 * Sets the name of the next piece of generated code (variable or action)
 * instead of using the built-in Graphgame naming scheme.
 * This should only be used if you can guarantee that this name is unique.
 * In other words, this behavior is only attached to a single object.
 * Usage: setItemName!(name: String);
 */
export const setItemName: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const behavior = state.graphgame.currentBehavior;
        const name = getString(args, state, 0, "A name is required!");

        behaviorCheck(state, behavior);

        state.graphgame.behaviors[state.graphgame.currentBehavior].setNextName(name);

        return "";
    }
};

/**
 * Sets the display of the next piece of generated code (variable or action).
 * Usage: setItemDisplay!(display: Block);
 */
export const setItemDisplay: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const behavior = state.graphgame.currentBehavior;
        const display = getBlock(args, state, 0, "A display is required!");

        behaviorCheck(state, behavior);

        state.graphgame.behaviors[state.graphgame.currentBehavior].setNextDisplay(display);

        return "";
    }
};

/**
 * Sets the default display of every piece of generated code (variable or action)
 * in the current behavior.
 * Usage: setDefaultDisplay!(display: Block);
 */
export const setDefaultDisplay: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const behavior = state.graphgame.currentBehavior;
        const display = getBlock(args, state, 0, "A display is required!");

        behaviorCheck(state, behavior);

        state.graphgame.behaviors[state.graphgame.currentBehavior].setDefaultDisplay(display);

        return "";
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