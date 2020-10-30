import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Icon extends Fyn.Component
{
    static localName = 'fyn-common-graphics-icon';
    static styles = [ 'fyn.suite.base', 'fyn.suite.fontawesome', 'global.theme' ];

    static get properties()
    {
        return {
            type: Types.String.default('fas'),
            icons: Types.List.type(Types.String).set(v => {
                if(v === undefined || v === null || typeof v === 'boolean')
                {
                    v = [];
                }

                if(Array.isArray(v) !== true)
                {
                    v = JSON.tryParse(v.replace(/'/g, '"'));
                }

                if(Array.isArray(v) !== true)
                {
                    v = [ v ];
                }

                return v;
            }),
        };
    }

    async initialize()
    {
    }
}
