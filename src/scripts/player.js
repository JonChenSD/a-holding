import * as Tone from 'tone'

const notes = ['C','C#','D','D#','E','F','G','G#','A','A#','B']

const now = Tone.now()
var vol = new Tone.Volume(-12);

const PolySynth = new Tone.PolySynth().toDestination();
// set the attributes across all the voices using 'set'
PolySynth.set({ detune: -1200 });
// play a chord
PolySynth.triggerAttackRelease(["C4", "E4", "A4"], 1);

const synth = new Tone.Synth().toDestination();
const sawSynth = new Tone.MonoSynth({
	oscillator: {
		type: "sawtooth"
	},
	envelope: {
		attack: 0.1
	}
}).toDestination();
const monoSynth = new Tone.MonoSynth({
	oscillator: {
		type: "square"
	},
	envelope: {
		attack: 0.1
	}
}).toDestination();
Tone.start()
const polySynth = new Tone.PolySynth().toDestination();

const windchime = new Tone.Sampler({
	urls: {
		A2: "windchime.mp3",
	},
	baseUrl: "/audio/",
	onload: () => {
		windchime.triggerAttackRelease(["C1", "E1", "G1", "B1"], 6);
	}
}).toDestination();

const windbell = new Tone.Sampler({
	urls: {
		A2: "windbell.mp3",
	},
	baseUrl: "/audio/",
	onload: () => {
		windchime.triggerAttackRelease(["C1", "E1", "G1", "B1"], 6);
	}
}).toDestination();

// const sampler = new Tone.Sampler({
// 	urls: {
// 		A1: "bark.mp3",
// 		A2: "bark2.mp3",
// 	},
// 	baseUrl: "./assets/",
// 	onload: () => {
// 		sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
// 	}
// }).toDestination();
var player = {
    init: function() {
        document.querySelector('button')?.addEventListener('click', async () => {
            await Tone.start()
            console.log('audio is ready')
            player.play('mono', 'C')
        })
    },
    play: function(type, note) {
		
        console.log('playnote')
        switch (type) {
			case 'mono':
				monoSynth.triggerAttackRelease(note + 3, .02)
				break
            case 'windchime':
                windchime.triggerAttackRelease(note + 1, 6)
				break
			case 'windbell':
				windbell.triggerAttackRelease(note + 2, 6)
				break
			case 'PolySynth':
				PolySynth.triggerAttackRelease(note + 4, .1)
				break
			case 'SawSynth':
				sawSynth.triggerAttackRelease(note + 2, .03)
				break
        }
    }
}

export { player }