declare type ScrollDirection = 'block'|'inline'|'horizontal'|'vertical';

declare type ScrollTimelineOptions = {
    scrollSource?: Element;
    orientation: ScrollDirection;
    fill: 'both'|'start'|'end';
    timeRange: number;
}

interface ScrollTimeline extends AnimationTimeline
{
    readonly scrollSource?: Element;
    readonly orientation: ScrollDirection;
}

interface ScrollTimelineConstructor
{
    new(options?: ScrollTimelineOptions): ScrollTimeline;
}

declare var ScrollTimeline: ScrollTimelineConstructor;

interface KeyframeAnimationOptions
{
    timeline: any,
}