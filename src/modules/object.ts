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
    outerCheck, outerInnerCheck
} from "../util";

/**
 * Creates a new object.
 * Usage: createObject!(body: Body);
 */
export const createObject: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        //Store the next ID, then increment it.
        const id = state.graphgame.nextObjectId++;
        const body = getString(args, state, 0, "An object definition is required!");

        state.graphgame.objects[id] = new GameObject(id);

        state.graphgame.currentObject = id;

        return `useBehavior!("transform");${body}setObject!();`;
    }
};

/**
 * Add a behavior to an object.
 * Usage: useBehavior!(behaviorName: string);
 */
export const useBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObject;
        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();

        objectCheck(state, id);
        behaviorCheck(state, name);

        state.graphgame.behaviors[name].compilePost(id, state.graphgame.objects[id].behaviorPostActions, `useBehaviorPost!(${id}, \"${name}\"${args.length > 2 ? ", " + args.slice(1).join(", ") : ""});`);
        state.graphgame.behaviors[name].compileDisplay(state.graphgame.objects[id].displayProperties);

        state.graphgame.objects[id].behaviors.push(name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(1);

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
        const name = getString(args, state, 1, "A behavior name is required!").trim().toLowerCase();

        objectCheck(state, id);
        behaviorCheck(state, name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(2);

        return "";
    }
};

/**
 * Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable.
 * Usage: setObjectVal!(variableName: string, val: number);
 */
export const setObjectVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = state.graphgame.currentObject;
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
 * For internal use only.
 */
export const setObject: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        state.graphgame.currentObject = getNum(args, state, 0) || 0;

        return "";
    }
};