# Howler.js sound controller
Very simple [howler.js](https://howlerjs.com)  based sound manager for games (and not only).


### What does it do
* Controller makes it easier to manage sounds
* Loader helps to load all sounds before use 
* Allows to use spatial sound too
* Organise all sounds and sprites
* Plus all standard features of Howler.js



# Documentation


### Install


* Install via [npm](https://www.npmjs.com/): `npm install howler-sound-controller`
* or clone the repo: `git clone https://github.com/Qriva/howler-sound-controller.git`

## Examples

#### Simple example
```javascript
import { HowlerSoundController } from 'howler-sound-controller';

var controller = HowlerSoundController;
// Get load manager via method
var loader = controller.getLoader();

// Queue resources in loader
loader
.add('soundName', {
    src: ['music1.mp3'],
    volume: 0.7
})
.add('soundName2', {
    src: ['music2.mp3'],
    volume: 0.5
});

// Wait for 'loaded' event fired when all sounds are ready
loader.once('loaded', function(){
    // Play sound by name
    controller.play('music');
});

// Start loading queued sounds
loader.load();
```

#### Loader basic methods and events
```javascript
// Queue can be cleared
loader.clearQueue();

// Before loading add resources to queue
// Controller creates spirtes if provided
loader.add('spriteSound', {
    src: ['music1.mp3'],
    volume: 0.7
},{
    explosion: [0, 2000],
    laser: [2000, 2000]
});

// Start loading files from queue
loader.load();

// Monitoring progress
loader.on('progress', function(event){
    // event.progress - number of sounds loded
    // event.total - total number of sounds
});

// Event fired when all sounds are ready to use
loader.once('loaded', function(event){
    // After this event, loader is ready again to use
    // event.sounds - array of sounds objects added to controller
});
```

#### Controller basic methods
```javascript
// Play sound - provide sound name or sprite name
var id = controller.play('sound1');

// Stop sound
controller.stop('sound1', id);
// Or stop all sounds in group
controller.stop('sound1');

// Get Sound object
controller.get('sound1');
```
# Sound object
```typescript
interface Sound {
    name: string;
    howl: Howl;
    sprite: string | null;
}
```
All registered objects in Controller and objects returned by loaded event extends above interface.
You can register Sounds manually by passing array of following objects.

# Loader

## Methods

#### add(name, howlOptions): `SoundLoader`
Queue resource in loader. Sound is added in Controller into provided name or sprite name if provided. Param howlOptions is used to setup Howl object.
##### name `string`
##### howlOptions `Object`

* src `Array/String` *`required`*
* volume `Number`
* loop `Boolean`
* rate `Number`
* format `Array`
* sprite `Object`

```javascript
{
  key: [offset, duration, (loop)]
}
```
If Howl Sound sprite is provided then Loader will generate sound for each key instead of for resource name.

#### load()
Start loading all queued resources.

#### clearQueue()
Clear all queued resources

#### on() / off() / once()
Event emitter methods.

## Events

#### loaded
Fires when all sounds are loaded. 
##### `Event data`
* progress `number` - number of loaded sounds
* total `number` - total number of sounds

#### progress
Fires when single sound (howler instance) is loaded. 
##### `Event data`
* sounds `array` - array of loaded Sounds added to controller library (Sound object described above). There is no need to use Controller to play sounds, you can just use Loader to load all files and use Howl instances separately.

#### loaderror
Fires if any of provided sounds cannot be loaded.


# Controller

## Methods

#### play(name): `number`
Play sound registered for given name. Returns the sound id to be used with other methods.

#### stop(name, [id]): `SoundController`
Stops playback of all sounds for given name. If id is provided only sound by given id is stopped.

#### get(name): `Sound`
Returns Sound object for given name (Described above).

#### getAll() `Array<Sound>`
Returns array of all Sound objects registered in Controller.

#### registerSounds(sounds)
Register manually Sound objects.

#### getLoader(): `SoundLoader`
Returns SoundLoader object.


## Spatial

#### updateListener(position, orientation, orientationUp)
Update position of listener (only used by spatial sounds).
Orientation is updated only if both orientation and orientationUp is provided *(`Vector3D`)*.

#### playSpatial(name, position, pannerAttr, [orientation]): `number`
Play spatial sound on provided position. Panner attributes are all avaiable attributes of Howl pannerAttr option. Position and orientation are `Vector3D` objects.
```javascript
{
  x: number,
  y: number,
  z: number,
}
```

##### pannerAttr

* coneInnerAngle `number` 
* coneOuterAngle `number`
* coneOuterGain `number`
* distanceModel `inverse` | `linear` | `exponential`
* maxDistance `number` 
* refDistance `number` 
* rolloffFactor `number`
* panningModel `HRTF` | `equalpower`

