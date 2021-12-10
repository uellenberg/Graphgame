import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {ensureState, getString, outerCheck} from "../util";
import transform from "../components/main/transform";
import circle from "../components/rendering/circle";
import square from "../components/rendering/square";
import squareCollider from "../components/collision/squareCollider";
import collisionResolver from "../components/collision/collisionResolver";
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

        for (const action of state.graphgame.selects) {
            output.push(action(state));
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
            for(const priority of Object.keys(state.graphgame.objects[objectID].behaviorPostActions)) {
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

            output.push(`action ${name + "update"} = ${name} {
                state = ${val};
            }`);
            state.graphgame.finalActions.push(name + "update");
        }

        if(state.graphgame.finalActions.length > 0) output.push("actions m_ain = " + state.graphgame.finalActions.join(", ") + ";");

        return output.join("\n");
    }
};