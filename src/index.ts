import { SoundController } from "./SoundController";

const controller = new SoundController();
export { controller };

declare global {
    namespace NodeJS {
        interface Global {
            HowlerSoundController: SoundController
        }
    }
}

global.HowlerSoundController = controller;