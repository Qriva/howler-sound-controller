import { SoundController } from "./SoundController";


const controller = new SoundController();
export { controller as HowlerSoundController };
export * from './SoundController';
export * from './SoundLoader';

// declare global {
//     namespace NodeJS {
//         interface Global {
//             HowlerSoundController: SoundController
//         }
//     }
// }

// global.HowlerSoundController = controller;