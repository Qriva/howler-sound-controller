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

    private backgroundName: string | null;
    private backgroundId: number | null;
    private backgroundVolume: number;

    constructor() {
        this.loader = new SoundLoader();
        this.sounds = {};

        this.backgroundName = null;
        this.backgroundId = null;
        this.backgroundVolume = 1;

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

    getMasterVolume(): number{
        return Howler.volume();
    }

    setMasterVolume(val: number){
        Howler.volume(val);
    }

    getBackgroundVolume(): number{
        return this.backgroundVolume;
    }

    setBackgroundVolume(val: number){
        this.backgroundVolume = val;
        this.sounds[this.backgroundName].howl.volume(val, this.backgroundId);
    }

    playBackground(name: string | null, fadeOutTime: number = 0, fadeInTime: number = 0,  smooth: boolean = false){
        // Skip if currently playing this track
        if(name === this.backgroundName){
            return;
        }
        // Check if background is playing already
        let playing = false;
        if(this.backgroundName !== null && this.backgroundId !== null){
            playing = true;
        }
        // Fadeout current track
        if(playing){
            let sound = this.sounds[this.backgroundName].howl;
            let soundId =  this.backgroundId;
            // Create new sound then stop it if name is not null
            let id = null;
            if(smooth === false && name !== null){
                id = this.play(name);
                this.sounds[name].howl.pause(id);
                this.sounds[name].howl.loop(true, id);
                this.backgroundName = name;
                this.backgroundId = id;
            }
            // Start fadeout current trck and stop sound in face event
            sound.fade(this.backgroundVolume, 0, fadeOutTime, soundId);
            sound.once('fade', () => {
                sound.stop(soundId);
                // If smoth was disabled then play next sound after fadeout
                if(id !== null){
                    this.sounds[name].howl.play(id);
                    this.sounds[name].howl.fade(0, this.backgroundVolume, fadeInTime, id);
                }
            }, soundId);
        }
        if( (smooth === true || !playing ) && name !== null){
            let id = this.play(name);
            this.sounds[name].howl.loop(true, id);
            this.backgroundName = name;
            this.backgroundId = id;
            this.sounds[name].howl.once('play', () => {
                this.sounds[name].howl.fade(0, this.backgroundVolume, fadeInTime, id);
            }, id);
        }

        if(name === null){
            this.backgroundId = null;
            this.backgroundName = null;
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
                this.backgroundId = null;
                this.backgroundName = null;
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