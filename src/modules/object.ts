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
    getString, handleObjectID,
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

        const id = handleObjectID(getNum(args, state, 0, "An object ID is required!"), state);

        if(state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" already exists!");
        if(id < 0) throw new Error("Objects cannot have an ID less than zero.");

        state.graphgame.objects[id] = new GameObject(id);

        return `useBehavior!(${id}, "transform");`;
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

        state.graphgame.behaviors[name].compilePost(id, state.graphgame.objects[id].behaviorPostActions, `useBehaviorPost!(${id}, \"${name}\"${args.length > 2 ? ", " + args.slice(2).join(", ") : ""});`);

        state.graphgame.objects[id].behaviors.push(name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(2);

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
 * Usage: setObjectVal!(objectId: number, variableName: string, val: number);
 */
export const setObjectVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A variable name is required!").trim().toLowerCase().replace(/[._]/g, "");
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