import {GameObject} from "../GameObject";
import {Behavior} from "../Behavior";
import {SemiMutable} from "../SemiMutable";

export interface TemplateState {
    graphgame: {
        objects: {
            [key: number]: GameObject
        },
        behaviors: {
            [key: number]: Behavior
        },
        actions: string[],
        finalActions: SemiMutable[],
        finalized: boolean
    }
}