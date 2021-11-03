import {TemplateArgs, TemplateContext, TemplateObject} from "logimat";
import {GameObject} from "../GameObject";
import {SemiMutable} from "../SemiMutable";
import {TemplateState} from "../types/TemplateState";
import {ensureState, outerCheck, expressionCheck, objectCheck, objectVarCheck, getSemiMut, getNum, getString} from "../util";
import {Behavior} from "../Behavior";

/**
 Creates a new behavior.
 Usage: createObject!(id: number);
*/
export const createBehavior: TemplateObject = {
    function: (args, state: TemplateState, context) => {
        ensureState(state);
        outerCheck(context);

        const name = getString(args, state, 0, "A behavior name is required!").trim().toLowerCase();

        if(state.graphgame.objects.hasOwnProperty(name)) throw new Error("A behavior with the name \"" + name + "\" already exists!");

        state.graphgame.behaviors[id] = new Behavior(name);

        return "";
    }
};