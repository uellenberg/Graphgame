import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {ensureState, getBlock, getString, outerCheck} from "../util";
import main from "../components/main";

/**
 * Initialize the game. This must be the first template called.
 */
export const initialize: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        return main;
    }
};

/**
 * Sets the display applied to every item emitted by Graphgame.
 * This will be overridden by any other displays.
 * Usage: setGlobalDefaultDisplay!(display: Block);
 */
export const setGlobalDefaultDisplay: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        state.graphgame.globalDefaultDisplay = getBlock(args, state, 0, "A display is required!");

        return "";
    }
};

/**
 * Registers an action and runs it on update.
 * Usage: registerAction!(actionName: string);
 */
export const registerAction: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const actionName = getString(args, state, 0, "An action name is required!");

        state.graphgame.finalActions.push(actionName);
        return "";
    }
};

/**
 * For internal use only.
 */
export const finalize: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const output: string[] = [];

        for(const objectID in state.graphgame.objects) {
            for(const layer in state.graphgame.objects[objectID].behaviorActions) {
                output.push(...state.graphgame.objects[objectID].behaviorActions[layer]);
            }
        }

        return output.join("\n") + "\nfinalize1!();";
    }
};

/**
 * For internal use only.
 */
export const finalize1: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        state.graphgame.postInit = true;

        const output: string[] = [];

        const priorityOutput: Record<number, string[]> = {};

        for(const objectID in state.graphgame.objects) {
            for(const priority in state.graphgame.objects[objectID].behaviorPostActions) {
                if(!priorityOutput.hasOwnProperty(priority)) priorityOutput[priority] = [];
                priorityOutput[priority].push(...state.graphgame.objects[objectID].behaviorPostActions[priority]);
            }
        }

        //Sort in ascending order.
        for(const priority of Object.keys(priorityOutput).map(priority => parseInt(priority)).sort((a, b) => a-b)) {
            output.push(...priorityOutput[priority]);
        }

        for (const action of state.graphgame.postActions) {
            output.push(action(state));
        }

        return output.join("\n") + "\nfinalize2!();";
    }
};

/**
 * For internal use only.
 */
export const finalize2: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const output: string[] = [];

        for (const name in state.graphgame.actions) {
            const val = state.graphgame.actions[name];

            output.push(`${state.graphgame.globalDefaultDisplay || ""}
            action ${name + "u"} = ${name} {
                state = ${val};
            }`);
            state.graphgame.finalActions.push(name + "u");
        }

        if(state.graphgame.finalActions.length > 0) {
            output.push(`${state.graphgame.globalDefaultDisplay || ""}
            actions m_ain = ${state.graphgame.finalActions.join(", ")} ;`);
        }

        return output.join("\n");
    }
};