import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../GameObject";
import {SemiMutable} from "../SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {ensureState, outerCheck, expressionCheck, behaviorCheck, objectVarCheck, getSemiMut, getNum, getString} from "../util";
import {Behavior} from "../Behavior";

/**
 Creates a new behavior.
 Usage: createBehavior!(name: string);
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
 Marks a behavior's variable as mutable (changable after compilation).
 Usage: setBehaviorMut!(name: string, variableName: string);
*/
export const setBehaviorMut: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setMut!(${id}, ${name + varName});`);

        return "";
    }
};

/**
 Get the value of a behavior's variable.
 Usage: getBehaviorVal!(name: string, variableName: string);
*/
export const getBehaviorVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        expressionCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `getVal!(${id}, ${name + varName});`);

        return "";
    }
};

/**
7 Set the value of a behavior's variable (during compilation). This must be used before a variable is marked as mutable.
 Usage: setBehaviorVal!(name: string, variableName: string, val: number);
*/
export const setBehaviorVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!");
        const val = getNum(args, state, 2, "A value is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setVal!(${id}, ${name + varName}, ${val});`);

        return "";
    }
};

/**
 Set the value of a behavior's variable on update (during runtime). This must be used after a variable is marked as mutable.
 Usage: setBehaviorValAction!(name: string, variableName: string, body: ActionBody);
*/
export const setBehaviorValAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();
        const varName = getString(args, state, 1, "A variable name is required!");
        const body = getString(args, state, 2, "An action body is required!");

        behaviorCheck(state, name);

        state.graphgame.behaviors[name].add((id: number) => `setValAction!(${id}, ${name + varName}, ${body});`);

        return "";
    }
};

/**
 Create an action that sets the value of a behavior's variable (during runtime). This must be ran manually. This must be used after a variable is marked as mutable.
 Usage: noRegisterSetBehaviorValAction!(name: string, variableName: string, body: ActionBody, actionName: string);
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

        state.graphgame.behaviors[name].add((id: number) => `noRegisterSetValAction!(${id}, ${name + varName}, ${body}${actionName ? ", " + actionName : ""});`);

        return "";
    }
};

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
