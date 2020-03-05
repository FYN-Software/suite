export default class Drag
{
    static on(target, scope, config)
    {
        target.on({
            dragstart: e => {
                e.dataTransfer.setData(scope, config.start.call(null, e));
            },
        });

        document.body.on({
            dragover: e => {
                if(e.dataTransfer.types.every(t => t === scope))
                {
                    config.over.call(null, e);
                }
            },
            dragend: e => {
                if(e.dataTransfer.types.every(t => t === scope))
                {
                    config.end.call(null, e);
                }

                e.dataTransfer.clearData();
            },
        });
    }
}