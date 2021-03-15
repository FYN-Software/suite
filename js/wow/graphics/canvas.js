import * as Fyn from '@fyn-software/component/fyn.js';
import * as Types from '@fyn-software/data/types.js';
import * as Comlink from 'https://unpkg.com/comlink/dist/esm/comlink.mjs';

const Game = Comlink.wrap(new Worker('/js/engine/game.js', {  type: 'module' }));

export default class Canvas extends Fyn.Component
{
    static localName = 'fyn-wow-graphics-canvas';
    static styles = [ 'fyn.suite.base', 'global.theme' ];

    #game;

    static get properties()
    {
        return {
        };
    }

    async initialize()
    {

    }

    async ready()
    {
        const canvas = this.shadow.getElementById('canvas');
        const control = canvas.transferControlToOffscreen();

        canvas.style.position = 'absolute';
        canvas.style.top = 0;

        this.#game = await new Game(Comlink.transfer(control, [ control ]));

        let buttons = [0, 0, 0];

        this.on({
            mousedown: e => {
                buttons[e.button]++;

                this.#game.emit('mouse', { position: [ e.x, e.y ], buttons });
            },
            mouseup: e => {
                buttons[e.button]--;

                this.#game.emit('mouse', { position: [ e.x, e.y ], buttons });
            },
            mousemove: e => {
                this.#game.emit('mouse', { position: [ e.x, e.y ], buttons });
            },
            mouseleave: e => {
                buttons = buttons.map(b => 0);

                this.#game.emit('mouse', { position: [ e.x, e.y ], buttons });
            },
            wheel: e => {
                this.#game.emit('wheel', Math.sign(e.deltaY));
            },
        });

        const observer = new ResizeObserver(([ e ]) => this.#game.resize(e.contentRect.width, e.contentRect.height));
        observer.observe(canvas);
    }
}
