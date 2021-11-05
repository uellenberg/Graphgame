import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../types/GameObject";
import {SemiMutable} from "../types/SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {ensureState, outerCheck, expressionCheck, behaviorCheck, objectVarCheck, getSemiMut, getNum, getString} from "../util";
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
        const varName = getString(args, state, 1, "A variable name is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setMut!(${id}, "${varName.startsWith("base.") ? varName.substring(5) : name + varName}");`);

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
        const varName = getString(args, state, 1, "A variable name is required!");

        behaviorCheck(state, name);

        return `getVal!(${state.graphgame.lastObjectBehaviorId}, "${varName.startsWith("base.") ? varName.substring(5) : name + varName}")`;
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
        const varName = getString(args, state, 1, "A variable name is required!");
        const val = getNum(args, state, 2, "A value is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setVal!(${id}, "${varName.startsWith("base.") ? varName.substring(5) : name + varName}", ${val});`);

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
        const varName = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setValAction!(${id}, "${varName.startsWith("base.") ? varName.substring(5) : name + varName}", {${varName.startsWith("base.") ? "" : `const ${varName} = ${name + varName};`}${body}});`);

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
        const varName = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");
        const actionName = getString(args, state, 3);

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `noRegisterSetValAction!(${id}, "${varName.startsWith("base.") ? varName.substring(5) : name + varName}", {${varName.startsWith("base.") ? "" : `const ${varName} = ${name + varName};`}${body}}${actionName ? ", \"" + actionName + "\"" : ""});`);

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

        let val = state.graphgame.lastObjectBehaviorArgs[0];
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
