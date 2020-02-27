import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Progress extends Fyn.Component()
{
    static localName = 'fyn-common-form-progress';

    static get properties()
    {
        return {
            steps: Types.List.type(Types.String),
            index: Types.Number.default(1),
        };
    }

    async initialize()
    {
        this.shadow.on('content > slot', {
            slotchange: async () => {
                const steps = this.shadow
                    .querySelector('content > slot')
                    .assignedElements({ flatten: true });

                this.steps = steps.map(s => s.getAttribute('step'));
                for(const [ i , step ] of Object.entries(steps))
                {
                    step.setAttribute('case', i);
                }

                console.log(this.steps);
            },
        });
    }

    async ready()
    {
    }
}
