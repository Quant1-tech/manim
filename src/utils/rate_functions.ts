// """A selection of rate functions, i.e., *speed curves* for animations.
// Please find a standard list at https://easings.net/. Here is a picture
// for the non-standard ones

// .. manim:: RateFuncExample
//     :saveLastFrame:

//     class RateFuncExample(Scene) {
//         construct(this) {
//             x = VGroup()
//             for k, v in rateFunctions._Dict__.items() {
//                 if "function" in str(v) {
//                     if (
//                         not k.startswith("__")
//                         and not k.startswith("sqrt")
//                         and not k.startswith("bezier")
//                     ) {
//                         try:
//                             rateFunc = v
//                             plot = (
//                                 ParametricFunction(
//                                     lambda x: [x, rateFunc(x), 0],
//                                     tRange=[0, 1, .01],
//                                     useSmoothing=False,
//                                     color=YELLOW,
//                                 )
//                                 .stretchToFitWidth(1.5)
//                                 .stretchToFitHeight(1)
//                             )
//                             plotBg = SurroundingRectangle(plot).setColor(WHITE)
//                             plotTitle = (
//                                 Text(rateFunc._Name__, weight=BOLD)
//                                 .scale(0.5)
//                                 .nextTo(plotBg, UP, buff=0.1)
//                             )
//                             x.add(VGroup(plotBg, plot, plotTitle))
//                         except: # because functions `notQuiteThere`, `function squishRateFunc` are not working.
//                             pass
//             x.arrangeInGrid(cols=8)
//             x.height = config.frameHeight
//             x.width = config.frameWidth
//             x.moveTo(ORIGIN).scale(0.95)
//             this.add(x)


// There are primarily 3 kinds of standard easing functions:

// #. Ease In - The animation has a smooth start.
// #. Ease Out - The animation has a smooth end.
// #. Ease In Out - The animation has a smooth start as well as smooth end.

// .. note:: The standard functions are not exported, so to use them you do something like this:
//     rateFunc=rateFunctions.easeInSine
//     On the other hand, the non-standard functions, which are used more commonly, are exported and can be used directly.

// .. manim:: RateFunctions1Example

//     class RateFunctions1Example(Scene) {
//         construct(this) {
//             line1 = Line(3*LEFT, 3*RIGHT).shift(UP).setColor(RED)
//             line2 = Line(3*LEFT, 3*RIGHT).setColor(GREEN)
//             line3 = Line(3*LEFT, 3*RIGHT).shift(DOWN).setColor(BLUE)

//             dot1 = Dot().moveTo(line1.getLeft())
//             dot2 = Dot().moveTo(line2.getLeft())
//             dot3 = Dot().moveTo(line3.getLeft())

//             label1 = Tex("Ease In").nextTo(line1, RIGHT)
//             label2 = Tex("Ease out").nextTo(line2, RIGHT)
//             label3 = Tex("Ease In Out").nextTo(line3, RIGHT)

//             this.play(
//                 FadeIn(VGroup(line1, line2, line3)),
//                 FadeIn(VGroup(dot1, dot2, dot3)),
//                 Write(VGroup(label1, label2, label3)),
//             )
//             this.play(
//                 MoveAlongPath(dot1, line1, rateFunc=rateFunctions.easeInSine),
//                 MoveAlongPath(dot2, line2, rateFunc=rateFunctions.easeOutSine),
//                 MoveAlongPath(dot3, line3, rateFunc=rateFunctions.easeInOutSine),
//                 runTime=7
//             )
//             this.wait()
// """


// from _Future__ import annotations

// _All__ = [
//     "linear",
//     "smooth",
//     "rushInto",
//     "rushFrom",
//     "slowInto",
//     "doubleSmooth",
//     "thereAndBack",
//     "thereAndBackWithPause",
//     "runningStart",
//     "notQuiteThere",
//     "wiggle",
//     "squishRateFunc",
//     "lingering",
//     "exponentialDecay",
// ]

// import typing
// from functools import wraps
// from math import sqrt

// import numpy as np

// from ..utils.bezier import bezier
// from ..utils.simpleFunctions import sigmoid


// # This is a decorator that makes sure any function it's used on will
// # return 0 if t<0 and 1 if t>1.
// unitInterval(function) {
//     @wraps(function)
//     wrapper(t, *args, **kwargs) {
//         if 0 <= t <= 1:
//             return function(t, *args, **kwargs)
//         elif t < 0:
//             return 0
//         else:
//             return 1

//     return wrapper


// # This is a decorator that makes sure any function it's used on will
// # return 0 if t<0 or t>1.
// zero(function) {
//     @wraps(function)
//     wrapper(t, *args, **kwargs) {
//         if 0 <= t <= 1:
//             return function(t, *args, **kwargs)
//         else:
//             return 0

//     return wrapper


// @unitInterval
// linear(t: float) -> float:
//     return t


// @unitInterval
// smooth(t: float, inflection: float = 10.0) -> float:
//     error = sigmoid(-inflection / 2)
//     return min(
//         max((sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error), 0),
//         1,
//     )


// @unitInterval
// rushInto(t: float, inflection: float = 10.0) -> float:
//     return 2 * smooth(t / 2.0, inflection)


// @unitInterval
// rushFrom(t: float, inflection: float = 10.0) -> float:
//     return 2 * smooth(t / 2.0 + 0.5, inflection) - 1


// @unitInterval
// slowInto(t: float) -> float:
//     return np.sqrt(1 - (1 - t) * (1 - t))


// @unitInterval
// doubleSmooth(t: float) -> float:
//     if t < 0.5:
//         return 0.5 * smooth(2 * t)
//     else:
//         return 0.5 * (1 + smooth(2 * t - 1))


// @zero
// thereAndBack(t: float, inflection: float = 10.0) -> float:
//     newT = 2 * t if t < 0.5 else 2 * (1 - t)
//     return smooth(newT, inflection)


// @zero
// thereAndBackWithPause(t: float, pauseRatio: float = 1.0 / 3) -> float:
//     a = 1.0 / pauseRatio
//     if t < 0.5 - pauseRatio / 2:
//         return smooth(a * t)
//     elif t < 0.5 + pauseRatio / 2:
//         return 1
//     else:
//         return smooth(a - a * t)


// @unitInterval
// runningStart(
//     t: float,
//     pullFactor: float = -0.5,
// ) -> typing.Iterable:  # what is func return type?
//     return bezier([0, 0, pullFactor, pullFactor, 1, 1, 1])(t)


// notQuiteThere(
//     func: typing.Callable[[float], float] = smooth,
//     proportion: float = 0.7,
// ) -> typing.Callable[[float], float]:
//     result(t) {
//         return proportion * func(t)

//     return result


// @zero
// wiggle(t: float, wiggles: float = 2) -> float:
//     return thereAndBack(t) * np.sin(wiggles * np.pi * t)


// squishRateFunc(
//     func: typing.Callable[[float], float],
//     a: float = 0.4,
//     b: float = 0.6,
// ) -> typing.Callable[[float], float]:
//     result(t) {
//         if a == b:
//             return a

//         if t < a:
//             return func(0)
//         elif t > b:
//             return func(1)
//         else:
//             return func((t - a) / (b - a))

//     return result


// # Stylistically, should this take parameters (with default values)?
// # Ultimately, the functionality is entirely subsumed by squishRateFunc,
// # but it may be useful to have a nice name for with nice default params for
// # "lingering", different from squishRateFunc's default params


// @unitInterval
// lingering(t: float) -> float:
//     return squishRateFunc(lambda t: t, 0, 0.8)(t)


// @unitInterval
// exponentialDecay(t: float, halfLife: float = 0.1) -> float:
//     # The half-life should be rather small to minimize
//     # the cut-off error at the end
//     return 1 - np.exp(-t / halfLife)


// @unitInterval
// easeInSine(t: float) -> float:
//     return 1 - np.cos((t * np.pi) / 2)


// @unitInterval
// easeOutSine(t: float) -> float:
//     return np.sin((t * np.pi) / 2)


// @unitInterval
// easeInOutSine(t: float) -> float:
//     return -(np.cos(np.pi * t) - 1) / 2


// @unitInterval
// easeInQuad(t: float) -> float:
//     return t * t


// @unitInterval
// easeOutQuad(t: float) -> float:
//     return 1 - (1 - t) * (1 - t)


// @unitInterval
// easeInOutQuad(t: float) -> float:
//     return 2 * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 2) / 2


// @unitInterval
// easeInCubic(t: float) -> float:
//     return t * t * t


// @unitInterval
// easeOutCubic(t: float) -> float:
//     return 1 - pow(1 - t, 3)


// @unitInterval
// easeInOutCubic(t: float) -> float:
//     return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2


// @unitInterval
// easeInQuart(t: float) -> float:
//     return t * t * t * t


// @unitInterval
// easeOutQuart(t: float) -> float:
//     return 1 - pow(1 - t, 4)


// @unitInterval
// easeInOutQuart(t: float) -> float:
//     return 8 * t * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 4) / 2


// @unitInterval
// easeInQuint(t: float) -> float:
//     return t * t * t * t * t


// @unitInterval
// easeOutQuint(t: float) -> float:
//     return 1 - pow(1 - t, 5)


// @unitInterval
// easeInOutQuint(t: float) -> float:
//     return 16 * t * t * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 5) / 2


// @unitInterval
// easeInExpo(t: float) -> float:
//     return 0 if t == 0 else pow(2, 10 * t - 10)


// @unitInterval
// easeOutExpo(t: float) -> float:
//     return 1 if t == 1 else 1 - pow(2, -10 * t)


// @unitInterval
// easeInOutExpo(t: float) -> float:
//     if t == 0:
//         return 0
//     elif t == 1:
//         return 1
//     elif t < 0.5:
//         return pow(2, 20 * t - 10) / 2
//     else:
//         return (2 - pow(2, -20 * t + 10)) / 2


// @unitInterval
// easeInCirc(t: float) -> float:
//     return 1 - sqrt(1 - pow(t, 2))


// @unitInterval
// easeOutCirc(t: float) -> float:
//     return sqrt(1 - pow(t - 1, 2))


// @unitInterval
// easeInOutCirc(t: float) -> float:
//     return (
//         (1 - sqrt(1 - pow(2 * t, 2))) / 2
//         if t < 0.5
//         else (sqrt(1 - pow(-2 * t + 2, 2)) + 1) / 2
//     )


// @unitInterval
// easeInBack(t: float) -> float:
//     c1 = 1.70158
//     c3 = c1 + 1
//     return c3 * t * t * t - c1 * t * t


// @unitInterval
// easeOutBack(t: float) -> float:
//     c1 = 1.70158
//     c3 = c1 + 1
//     return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2)


// @unitInterval
// easeInOutBack(t: float) -> float:
//     c1 = 1.70158
//     c2 = c1 * 1.525
//     return (
//         (pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
//         if t < 0.5
//         else (pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2
//     )


// @unitInterval
// easeInElastic(t: float) -> float:
//     c4 = (2 * np.pi) / 3
//     if t == 0:
//         return 0
//     elif t == 1:
//         return 1
//     else:
//         return -pow(2, 10 * t - 10) * np.sin((t * 10 - 10.75) * c4)


// @unitInterval
// easeOutElastic(t: float) -> float:
//     c4 = (2 * np.pi) / 3
//     if t == 0:
//         return 0
//     elif t == 1:
//         return 1
//     else:
//         return pow(2, -10 * t) * np.sin((t * 10 - 0.75) * c4) + 1


// @unitInterval
// easeInOutElastic(t: float) -> float:
//     c5 = (2 * np.pi) / 4.5
//     if t == 0:
//         return 0
//     elif t == 1:
//         return 1
//     elif t < 0.5:
//         return -(pow(2, 20 * t - 10) * np.sin((20 * t - 11.125) * c5)) / 2
//     else:
//         return (pow(2, -20 * t + 10) * np.sin((20 * t - 11.125) * c5)) / 2 + 1


// @unitInterval
// easeInBounce(t: float) -> float:
//     return 1 - easeOutBounce(1 - t)


// @unitInterval
// easeOutBounce(t: float) -> float:
//     n1 = 7.5625
//     d1 = 2.75

//     if t < 1 / d1:
//         return n1 * t * t
//     elif t < 2 / d1:
//         return n1 * (t - 1.5 / d1) * (t - 1.5 / d1) + 0.75
//     elif t < 2.5 / d1:
//         return n1 * (t - 2.25 / d1) * (t - 2.25 / d1) + 0.9375
//     else:
//         return n1 * (t - 2.625 / d1) * (t - 2.625 / d1) + 0.984375


// @unitInterval
// easeInOutBounce(t: float) -> float:
//     if t < 0.5:
//         return (1 - easeOutBounce(1 - 2 * t)) / 2
//     else:
//         return (1 + easeOutBounce(2 * t - 1)) / 2
