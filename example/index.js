import * as HSC from "../dist/index";

// console.log(HSCVar.HowlerSoundController);
let controller = HSC.HowlerSoundController;
window.HSC = HSC.HowlerSoundController;

let loader = controller.getLoader();

loader.add('m1', {
    src: ['music1.mp3'],
    volume: 0.7
})
.add('bg1', {
    src: ['sound1.mp3'],
    volume: 0.7
})
.add('s2', {
    src: ['sound2.mp3'],
    volume: 0.8,
    sprite: {
        one: [0, 2000],
        two: [2000, 2000],
        three: [4000, 2000]
    }
})

// .add('m2', {
//     src: ['music2.mp3'],
//     volume: 0.8
// })
// .add('m3', {
//     src: ['music3.mp3'],
//     volume: 0.8
// })
// .add('m4', {
//     src: ['music4.mp3'],
//     volume: 0.8
// });



loader.once('loaded', function(){
    // controller.play('m4');
    console.log("Loaded ALL");
});

loader.on('progress', function(e){
    console.log( (e.progress / e.total )*100 + " %");
    document.getElementById("progress").setAttribute("max", e.total);
    document.getElementById("progress").setAttribute("value", e.progress); 
});

loader.load();