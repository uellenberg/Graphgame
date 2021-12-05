import {GameObject} from "./GameObject";
import {Behavior} from "./Behavior";
import {SemiMutable} from "./SemiMutable";
import {TemplateArgs} from "logimat";

export interface TemplateState {
    graphgame: {
        objects: {
            [key: number]: GameObject
        },
        behaviors: {
            [key: string]: Behavior
        },
        actions: {
            [key: string]: string
        },
        finalActions: string[],
        finalized: boolean,
        lastObjectBehaviorId: number,
        lastObjectBehaviorArgs: TemplateArgs,
        postActions: ((state: TemplateState) => string)[],
        selects: ((state: TemplateState) => string)[],
        currentObjectId: number,
        postInit: boolean
    }
}