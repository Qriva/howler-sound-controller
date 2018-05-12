import { EventEmitter } from "eventemitter3";
import { Howl, Howler } from 'howler';

export interface HowlSpriteObject{
    [key: string]: Array<number|boolean>;
}

export interface HowlOptions{
    src: Array<string> | string;
    volume?: number;
    loop?: boolean;
    rate?: number;
    format?: Array<string>;
    sprite?: HowlSpriteObject;
}

export interface QueueResource{
    name: string;
    howlOptions: HowlOptions;
}

export interface Sound{
    name: string;
    howl: Howl;
    sprite: string | null;
}

export interface LoadedEventPayload{
    sounds: Array<Sound>;
}

export interface ProgressEventPayload{
    progress: number;
    total: number;
}

/**
 * SoundLoader
 * 
 * *Events*
 * - load
 * - progress
 * - error
 * 
 * @export
 * @class SoundLoader
 * @extends {EventEmitter}
 */
export class SoundLoader extends EventEmitter{

    private loading: boolean;
    private queue: Array<QueueResource>;
    private loadedSounds: number;
    private loadingSounds: Array<Sound>;

    constructor() {
        super();
        this.loading = false;
        this.queue = [];
        this.loadedSounds = 0;
        this.loadingSounds = [];
    }

    add(name: string, howlOptions: HowlOptions, sprite: HowlSpriteObject = null){
        // Skip if currently loading
        if(this.loading){
            return;
        }
        // Add resource to queue
        this.queue.push({
            name: name,
            howlOptions: howlOptions
        });
        return this;
    }

    load(){
        // Skip if currently loading
        if(this.loading){
            return;
        }
        this.loading = true;
        this.loadedSounds = 0;
        this.loadingSounds = [];

        for (let i = 0; i < this.queue.length; i++) {
            const singleResource = this.queue[i];

            let spriteOpt: HowlSpriteObject = {};
            if(singleResource.howlOptions.sprite){
                spriteOpt = singleResource.howlOptions.sprite;
            }

            let options = (<any>Object).assign({}, singleResource.howlOptions);
            // Create Howl instance
            let sound = new Howl(options);

            if( (<any>Object).keys(spriteOpt).length === 0 ){
                this.loadingSounds.push({
                    name: singleResource.name,
                    howl:  sound,
                    sprite: null
                });
            }else{
                for (const key in spriteOpt) {
                    if (spriteOpt.hasOwnProperty(key)) {
                        this.loadingSounds.push({
                            name: key,
                            howl:  sound,
                            sprite: key
                        });
                    }
                }
            }
            
            // Register load events
            sound.once('load', () => {
                this.loadedResource();
            });
            sound.once('loaderror', (id, error) => {
                console.warn(error);
                for (let i = 0; i < this.loadingSounds.length; i++) {
                    const s = this.loadingSounds[i];
                    s.howl.off('load').off('loaderror').unload();
                }
                console.warn('Unable to load sound [id]: ' + id + '. Loading canceled.');
                this.reset();
            });
        } 
        return this;
    }

    private loadedResource(){
        if(!this.loading){
            console.warn('Attempted to load resource without calling load() method. Can be caused in load errors');
            return;
        }
        this.loadedSounds++;
        // Emit progress event: ProgressEventPayload
        this.emit('progress', {
            progress: this.loadedSounds,
            total: this.queue.length
        });
        // Check if all sounds are loaded
        if(this.loadedSounds === this.queue.length){
            // Emit loaded event: LoadedEventPayload
            this.emit('loaded', {
                sounds: this.loadingSounds
            });
            this.reset();
        }
    }

    private reset(){
        this.loading = false;
        this.queue = [];
        this.loadedSounds = 0;
        this.loadingSounds = [];
    }

    clearQueue(){
        // Skip if currently loading
        if(this.loading){
            console.log('Cannot clear queue now');
            return;
        }
        this.queue = [];
    }

}