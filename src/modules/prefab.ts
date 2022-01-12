import {TemplateArgs, TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    prefabCheck,
    ensureState,
    getNum,
    getString,
    outerCheck,
    getAnyAsString,
    getNumOrString, outerInnerCheck, getBlock
} from "../util";
import {GameObject} from "../types/GameObject";

/**
 * Creates a new prefab.
 * Usage: createPrefab!(name: string);
 */
export const createPrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A prefab name is required!");
        const body = getBlock(args, state, 1, "A prefab definition is required!");

        if(state.graphgame.prefabs.hasOwnProperty(name)) throw new Error("A prefab with the name \"" + name + "\" already exists!");

        state.graphgame.prefabs[name] = [];

        state.graphgame.currentPrefab = name;

        return body + "setPrefab!();";
    }
};

/**
 * Add to an already existing prefab.
 * Usage: extendPrefab!(name: string, body: Body);
 */
export const extendPrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A prefab name is required!");
        const body = getBlock(args, state, 1, "A prefab definition is required!");

        if(!state.graphgame.prefabs.hasOwnProperty(name)) throw new Error("A prefab with the name \"" + name + "\" does not exist!");

        state.graphgame.currentPrefab = name;

        return body;
    }
};

/**
 * Add a behavior to a prefab. Any additional arguments will be passed to the behavior. To use
 * prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.
 * Usage: useBehavior!(behaviorName: string);
 */
export const useBehaviorPrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentPrefab;
        const behaviorName = getString(args, state, 0, "A behavior name is required!");

        prefabCheck(state, name);

        const behaviorArgs = args.slice(1);

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.prefabs[name].push((id: number, args: TemplateArgs) => {
            const newBehaviorArgs = behaviorArgs.map(arg => {
                if(typeof(arg) === "string") {
                    const idx = parseInt(arg);
                    if(isNaN(idx)) throw new Error("Prefab \"" + name + "\" requested to use the argument at index \"" + arg + "\", but it is not an integer!");
                    if(args.length <= idx) throw new Error("The prefab \"" + name + "\" requires at least " + (idx+1) + " arguments, but only " + args.length + " were provided.");

                    return args[idx];
                } else if(typeof(arg) === "object" && arg["block"]) {
                    return "{" + arg["value"] + "}";
                } else return arg;
            });

            return prefix + `useBehavior!("${behaviorName}"${newBehaviorArgs.length > 0 ? ", " + newBehaviorArgs.join(", ") : ""});` + suffix;
        });

        return "";
    }
};

/**
 * Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable.
 * To use prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.
 * Usage: setPrefabVal!(variableName: string, val: number | string);
 */
export const setPrefabVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = state.graphgame.currentPrefab;
        const variableName = getString(args, state, 0, "A variable name is required!");
        const val = getNumOrString(args, state, 1, "A value is required!");

        prefabCheck(state, name);

        const prefix = "setFile!(\"" + state.logimat.files[state.logimat.files.length-1] + "\");";
        const suffix = "setFile!();";

        state.graphgame.prefabs[name].push((id: number, args: TemplateArgs) => {
            let newVal: number;

            if(typeof(val) !== "string") newVal = val;
            else {
                const idx = parseInt(val);
                if (isNaN(idx)) throw new Error("Prefab \"" + name + "\" requested to use the argument at index \"" + val + "\", but it is not an integer!");
                if (args.length <= idx) throw new Error("The prefab \"" + name + "\" requires at least " + (idx + 1) + " arguments, but only " + args.length + " were provided.");

                newVal = <number>args[idx];
            }

            return prefix + `setObjectVal!(${id}, "${variableName}", ${newVal});` + suffix;
        });

        return "";
    }
};

/**
 * Creates a new object from a prefab.
 * Usage: usePrefab!(prefab: string, body?: Body);
 */
export const usePrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A prefab name is required!");
        const body = getBlock(args, state, 1) || "";

        const prefabArgs = args.slice(2);

        prefabCheck(state, name);

        //Store the next ID, then increment it.
        const id = state.graphgame.nextObjectId++;

        state.graphgame.objects[id] = new GameObject(id);

        state.graphgame.currentObject = id;

        const output: string[] = [`useBehavior!("transform");`];

        for(const func of state.graphgame.prefabs[name]) {
            output.push(func(id, prefabArgs));
        }

        return output.join("\n") + body;
    }
};

/**
 * For internal use only.
 */
export const setPrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerInnerCheck(context);

        state.graphgame.currentPrefab = getString(args, state, 0) || "";

        return "";
    }
};