import { EventEmitter } from "eventemitter3";
import { Howl, Howler } from 'howler';
import { SoundLoader, Sound, LoadedEventPayload } from "./SoundLoader";

export interface SoundsIndex{
    [key: string]: Sound;
}

export class SoundController{

    loader: SoundLoader;
    sounds: SoundsIndex;

    constructor() {
        this.loader = new SoundLoader();
        this.sounds = {};

        // Listen for load event
        this.loader.on('load', (event: LoadedEventPayload) => {
            this.registerSounds(event.sounds);
        });
    }

    registerSounds(sounds: Array<Sound>){
        for (let i = 0; i < sounds.length; i++) {
            const sound = sounds[i];
            if(sound.name in this.sounds){
                console.warn('Sound with key "' + sound.name + '" already exists.');
            }else{
                this.sounds[sound.name] = sound;
            }
        }
    }

    play(name: string): number{
        if(name in this.sounds){
            // if name is the same as sprite id then use it or else no param
            if(this.sounds[name].sprite === name){
                return this.sounds[name].howl.play(name);
            }else{
                return this.sounds[name].howl.play();
            }
        }else{
            console.log('Sound "' + name + '" does not exists.');
        }
    }

    get(name: string): Sound{
        if(name in this.sounds){
            return this.sounds[name];
        }else{
            console.log('Sound "' + name + '" does not exists.');
        }
    }

}