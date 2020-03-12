export default class Drag
{
    static draggable(target, scope, config)
    {
        const { query = ':scope', effect = 'move' } = config;

        target.on(query, {
            options: {
                passive: false,
            },
            dragstart: (e, t) => {
                const value = config.start?.invoke(e, t) ?? undefined;

                if(value !== undefined)
                {
                    e.dataTransfer.effectAllowed = effect;
                    e.dataTransfer.setData(scope, JSON.stringify(value));
                }
            },
            dragend: (e, t) => {
                config.end?.invoke(e, t);
            },
        });
    }

    static on(target, scope, config)
    {
        let valid = false;
        const last = { x: 0, y: 0 };

        target.on({
            options: {
                passive: false,
            },
            dragenter: async e => {
                valid = false;

                if(e.composedPath().includes(target) === false || e.dataTransfer.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                await Promise.delay(1);

                valid = true;

                config.enter?.invoke(e);
            },
            dragover: e => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = valid ? 'copy' : 'none';

                if(last.x === x && last.y === y)
                {

                }

                config.move?.invoke({ x: e.x, y: e.y });
            },
            dragleave: async e => {
                if(e.composedPath().includes(target) === false || e.dataTransfer.types.every(t => t !== scope))
                {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                valid = false;

                config.leave?.invoke(e);
            },
            drop: e => {
                const data = e.dataTransfer.types.filter(t => t === scope);

                if(data.length > 0)
                {
                    for(const item of e.dataTransfer.items)
                    {
                        if(item.type !== scope)
                        {
                            continue;
                        }

                        item[`getAs${item.kind.capitalize()}`](r => config.drop?.invoke({ result: JSON.parse(r), x: e.x, y: e.y, path: e.composedPath() }));
                    }
                }

                e.dataTransfer.clearData();
            },
        });
    }
}