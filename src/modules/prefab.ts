import {TemplateArgs, TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {
    prefabCheck,
    ensureState,
    getNum,
    getString,
    outerCheck,
    getAnyAsString,
    getNumOrString,
    handleObjectID
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

        if(state.graphgame.prefabs.hasOwnProperty(name)) throw new Error("A prefab with the name \"" + name + "\" already exists!");

        state.graphgame.prefabs[name] = [];

        return "";
    }
};

/**
 * Add a behavior to a prefab. Any additional arguments will be passed to the behavior. To use
 * prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.
 * Usage: useBehavior!(prefab: string, behaviorName: string);
 */
export const useBehaviorPrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A prefab name is required!");
        const behaviorName = getString(args, state, 1, "A behavior name is required!");

        prefabCheck(state, name);

        const behaviorArgs = args.slice(2);

        state.graphgame.prefabs[name].push((id: number, args: TemplateArgs) => {
            const newBehaviorArgs = behaviorArgs.map(arg => {
                if(typeof(arg) !== "string") return arg;

                const idx = parseInt(arg);
                if(isNaN(idx)) throw new Error("Prefab \"" + name + "\" requested to use the argument at index \"" + arg + "\", but it is not an integer!");
                if(args.length <= idx) throw new Error("The prefab \"" + name + "\" requires at least " + (idx+1) + " arguments, but only " + args.length + " were provided.");

                return args[idx];
            });

            return `useBehavior!(${id}, "${behaviorName}"${newBehaviorArgs.length > 0 ? ", " + newBehaviorArgs.join(", ") : ""});`;
        });

        return "";
    }
};

/**
 * Set the value of an object's variable (during compilation). This must be used before a variable is marked as mutable.
 * To use prefab arguments, wrap the number in quotes, which will now indicate the index of the prefab argument.
 * Usage: setPrefabVal!(prefab: string, variableName: string, val: number | string);
 */
export const setPrefabVal: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A prefab name is required!");
        const variableName = getString(args, state, 1, "A variable name is required!");
        const val = getNumOrString(args, state, 2, "A value is required!");

        prefabCheck(state, name);

        state.graphgame.prefabs[name].push((id: number, args: TemplateArgs) => {
            let newVal: number;

            if(typeof(val) !== "string") newVal = val;
            else {
                const idx = parseInt(val);
                if (isNaN(idx)) throw new Error("Prefab \"" + name + "\" requested to use the argument at index \"" + val + "\", but it is not an integer!");
                if (args.length <= idx) throw new Error("The prefab \"" + name + "\" requires at least " + (idx + 1) + " arguments, but only " + args.length + " were provided.");

                newVal = <number>args[idx];
            }

            return `setObjectVal!(${id}, "${variableName}", ${newVal});`;
        });

        return "";
    }
};

/**
 * Creates a new object from a prefab. Supply -1 for the object ID to use the next available object ID.
 * Usage: usePrefab!(id: number, prefab: string);
 */
export const usePrefab: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const id = handleObjectID(getNum(args, state, 0, "An object ID is required!"), state);
        const name = getString(args, state, 1, "A prefab name is required!");

        const prefabArgs = args.slice(2);

        prefabCheck(state, name);
        if(state.graphgame.objects.hasOwnProperty(id)) throw new Error("An object with the ID \"" + id + "\" already exists!");
        if(id < 0) throw new Error("Objects cannot have an ID less than zero.");

        state.graphgame.objects[id] = new GameObject(id);

        const output: string[] = [`useBehavior!(${id}, "transform");`];

        for(const func of state.graphgame.prefabs[name]) {
            output.push(func(id, prefabArgs));
        }

        return output.join("\n");
    }
};