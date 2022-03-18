/** @file Utility functions for continuous animation of mobjects. */

// from _Future__ import annotations

// _All__ = [
//     "assertIsMobjectMethod",
//     "always",
//     "fAlways",
//     "alwaysRedraw",
//     "alwaysShift",
//     "alwaysRotate",
//     "turnAnimationIntoUpdater",
//     "cycleAnimation",
// ]


// import inspect

// import numpy as np

// from manim.constants import DEGREES, RIGHT
// from manim.mobject.mobject import Mobject


// assertIsMobjectMethod(method) {
//     assert inspect.ismethod(method)
//     mobject = method._Self__
//     assert isinstance(mobject, Mobject)


// always(method, *args, **kwargs) {
//     assertIsMobjectMethod(method)
//     mobject = method._Self__
//     func = method._Func__
//     mobject.addUpdater(lambda m: func(m, *args, **kwargs))
//     return mobject


// fAlways(method, *argGenerators, **kwargs) {
//     """
//     More functional version of always, where instead
//     of taking in args, it takes in functions which output
//     the relevant arguments.
//     """
//     assertIsMobjectMethod(method)
//     mobject = method._Self__
//     func = method._Func__

//     updater(mob) {
//         args = [argGenerator() for argGenerator in argGenerators]
//         func(mob, *args, **kwargs)

//     mobject.addUpdater(updater)
//     return mobject


// alwaysRedraw(func) {
//     mob = func()
//     mob.addUpdater(lambda m: mob.become(func()))
//     return mob


// alwaysShift(mobject, direction=RIGHT, rate=0.1) {
//     normalize(v) {
//         norm = np.linalg.norm(v)
//         if norm == 0:
//             return v
//         return v / norm

//     mobject.addUpdater(lambda m, dt: m.shift(dt * rate * normalize(direction)))
//     return mobject


// alwaysRotate(mobject, rate=20 * DEGREES, **kwargs) {
//     mobject.addUpdater(lambda m, dt: m.rotate(dt * rate, **kwargs))
//     return mobject


// turnAnimationIntoUpdater(animation, cycle=False, **kwargs) {
//     """
//     Add an updater to the animation's mobject which applies
//     the interpolation and update functions of the animation

//     If cycle is True, this repeats over and over.  Otherwise,
//     the updater will be popped upon completion
//     """
//     mobject = animation.mobject
//     animation.suspendMobjectUpdating = False
//     animation.begin()
//     animation.totalTime = 0

//     update(m, dt) {
//         runTime = animation.getRunTime()
//         timeRatio = animation.totalTime / runTime
//         if cycle:
//             alpha = timeRatio % 1
//         else:
//             alpha = np.clip(timeRatio, 0, 1)
//             if alpha >= 1:
//                 animation.finish()
//                 m.removeUpdater(update)
//                 return
//         animation.interpolate(alpha)
//         animation.updateMobjects(dt)
//         animation.totalTime += dt

//     mobject.addUpdater(update)
//     return mobject


// cycleAnimation(animation, **kwargs) {
//     return turnAnimationIntoUpdater(animation, cycle=True, **kwargs)
