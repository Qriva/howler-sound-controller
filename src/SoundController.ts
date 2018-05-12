import { EventEmitter } from "eventemitter3";
import { Howl, Howler } from 'howler';
import { SoundLoader, Sound, LoadedEventPayload } from "./SoundLoader";

export interface SoundsIndex{
    [key: string]: Sound;
}

export interface Vector3D{
    x: number;
    y: number;
    z: number;
}

export interface PannerAttributes{
    coneInnerAngle?: number;
    coneOuterAngle?: number;
    coneOuterGain?: number;
    distanceModel?: 'inverse'|'exponential'|'linear';
    maxDistance?: number;
    refDistance?: number;
    rolloffFactor?: number;
    panningModel?: 'HRTF'|'equalpower';
}

export class SoundController{

    private loader: SoundLoader;
    private sounds: SoundsIndex;

    constructor() {
        this.loader = new SoundLoader();
        this.sounds = {};

        // Listen for load event
        this.loader.on('loaded', (event: LoadedEventPayload) => {
            this.registerSounds(event.sounds);
        });
    }

    getLoader(): SoundLoader{
        return this.loader;
    }

    registerSounds(sounds: Array<Sound>){
        for (let i = 0; i < sounds.length; i++) {
            const sound = sounds[i];
            if(sound.name in this.sounds){
                console.warn('sound-controller: Sound with key "' + sound.name + '" already exists.');
            }else{
                this.sounds[sound.name] = sound;
            }
        }
    }

    updateListener(position: Vector3D, orientation: Vector3D = null, orientationUp: Vector3D = null){
        Howler.pos(position.x, position.y, position.z);
        // Skip if both orientation vectors are not set
        if(orientation === null || orientationUp === null){
            return;
        }
        Howler.orientation(orientation.x, orientation.y, orientation.z, orientationUp.x, orientationUp.y, orientationUp.z);
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
            console.log('sound-controller: Sound "' + name + '" does not exists.');
        }
    }

    playSpatial(name: string, position: Vector3D, pannerAttr: PannerAttributes, orientation: Vector3D = null): number{
        if(name in this.sounds){
            // if name is the same as sprite id then use it or else no param
            let soundId;
            let sound = this.sounds[name].howl;

            if(this.sounds[name].sprite === name){
                soundId = sound.play(name);
            }else{
                soundId = sound.play();
            }
            // Set spatial sound attributes
            sound.once('play', () => {
				// Set the position of the speaker in 3D space.
                sound.pos(position.x, position.y, position.z, soundId);
                if(orientation !== null){
                    sound.orientation(orientation.x, orientation.y, orientation.z, soundId);
                }
				// Tweak the attributes to get the desired effect.
				sound.pannerAttr(pannerAttr, soundId);
            }, soundId);
            return soundId;
        }else{
            console.log('sound-controller: Sound "' + name + '" does not exists.');
        }
    }

    stop(name: string, id: number = null): SoundController{
        if(name in this.sounds){
            // if name is the same as sprite id then use it or else no param
            if(id === null){
                this.sounds[name].howl.stop();
                return this;
            }else{
                this.sounds[name].howl.stop(id);
                return this;
            }
        }else{
            console.log('sound-controller: Sound "' + name + '" does not exists.');
        }
    }

    get(name: string): Sound{
        if(name in this.sounds){
            return this.sounds[name];
        }else{
            console.log('sound-controller: Sound "' + name + '" does not exists.');
        }
    }

    getAll(): SoundsIndex{
        return this.sounds;
    }

}