import {TemplateObject} from "logimat";
import {TemplateState} from "../types/TemplateState";
import {ensureState, getString, outerCheck} from "../util";
import transform from "../init/transform";
import circle from "../init/circle";

/**
 * Initialize the game. This must be the first template called.
 */
export const initialize: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        return transform + circle;
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
 * Finalize the game. This must be the last template called.
 * Usage: finalize!();
 */
export const finalize: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const output: string[] = [];

        if (args.length < 1) {
            for (const action of state.graphgame.postActions) {
                output.push(action(state));
            }

            return output.join("\n") + "\nfinalize!(1);";
        }

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