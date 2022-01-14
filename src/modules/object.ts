import {TemplateObject} from "logimat";
import {GameObject} from "../types/GameObject";
import {SemiMutable} from "../types/SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {
    behaviorCheck,
    ensureState,
    expressionCheck, getBlock,
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
        const body = getBlock(args, state, 0, "An object definition is required!");

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

        state.graphgame.behaviors[name].compilePost(id, state.graphgame.objects[id].behaviorPostActions, `useBehaviorPost!(${id}, \"${name}\"${args.length > 2 ? ", " + args.slice(1).map(val => {
            if(typeof(val) === "string") return `"${val}"`;
            else if(typeof(val) === "object" && val["block"]) return "{" + val["value"] + "}";
            else return val.toString();
        }).join(", ") : ""});`);
        state.graphgame.behaviors[name].compileDisplay(state.graphgame.objects[id].displayProperties);

        state.graphgame.objects[id].behaviors.push(name);

        state.graphgame.lastObjectBehaviorId = id;
        state.graphgame.lastObjectBehaviorArgs = args.slice(1);

        state.graphgame.behaviors[name].compile(id, state.graphgame.objects[id].behaviorActions);

        return "";
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
 * Internal use only.
 */
export const handleMuts: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = getNum(args, state, 0, "An object ID is required!");
        const name = getString(args, state, 1, "A behavior name is required!").trim().toLowerCase();

        objectCheck(state, id);
        behaviorCheck(state, name);

        let muts: string[] = [];
        for (const mut of state.graphgame.behaviors[name].muts) {
            const semimut = getSemiMut(state, id, mut);
            if(semimut.isMut()) continue;

            const value = semimut.get();
            semimut.mut();

            muts.push("export const " + semimut.name() + " = " + value + ";");
        }

        return muts.join("\n");
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

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.objects[id].behaviorActions[0].push(prefix + `selectID!(${id});setValSelect!("${name}", ${val});selectID!();` + suffix);

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