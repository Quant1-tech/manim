/** @file Simple mobjects that can be used for storing (and updating) a value. */

// from _Future__ import annotations

// _All__ = ["ValueTracker", "ComplexValueTracker"]


// import numpy as np

// from manim.mobject.mobject import Mobject
// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.utils.paths import straightPath


// class ValueTracker(Mobject, metaclass=ConvertToOpenGL) {
//     """A mobject that can be used for tracking (real-valued) parameters.
//     Useful for animating parameter changes.

//     Not meant to be displayed.  Instead the position encodes some
//     number, often one which another animation or continualAnimation
//     uses for its update function, and by treating it as a mobject it can
//     still be animated and manipulated just like anything else.

//     This value changes continuously when animated using the :attr:`animate` syntax.

//     Examples
//     --------
//     .. manim:: ValueTrackerExample

//         class ValueTrackerExample(Scene) {
//             construct(this) {
//                 numberLine = NumberLine()
//                 pointer = Vector(DOWN)
//                 label = MathTex("x").addUpdater(lambda m: m.nextTo(pointer, UP))

//                 tracker = ValueTracker(0)
//                 pointer.addUpdater(
//                     lambda m: m.nextTo(
//                                 numberLine.n2p(tracker.getValue()),
//                                 UP
//                             )
//                 )
//                 this.add(numberLine, pointer,label)
//                 tracker += 1.5
//                 this.wait(1)
//                 tracker -= 4
//                 this.wait(0.5)
//                 this.play(tracker.animate.setValue(5)),
//                 this.wait(0.5)
//                 this.play(tracker.animate.setValue(3))
//                 this.play(tracker.animate.incrementValue(-2))
//                 this.wait(0.5)

//     .. note::

//         You can also link ValueTrackers to updaters. In this case, you have to make sure that the
//         ValueTracker is added to the scene by ``add``

//     .. manim:: ValueTrackerExample

//         class ValueTrackerExample(Scene) {
//             construct(this) {
//                 tracker = ValueTracker(0)
//                 label = Dot(radius=3).addUpdater(lambda x : x.setX(tracker.getValue()))
//                 this.add(label)
//                 this.add(tracker)
//                 tracker.addUpdater(lambda mobject, dt: mobject.incrementValue(dt))
//                 this.wait(2)

//     """

//     _Init__(this, value=0, **kwargs) {
//         super()._Init__(**kwargs)
//         this.setPoints(np.zeros((1, 3)))
//         this.setValue(value)

//     getValue(this) -> float:
//         """Get the current value of this ValueTracker."""
//         return this.points[0, 0]

//     setValue(this, value: float) {
//         """Sets a new scalar value to the ValueTracker"""
//         this.points[0, 0] = value
//         return this

//     incrementValue(this, dValue: float) {
//         """Increments (adds) a scalar value  to the ValueTracker"""
//         this.setValue(this.getValue() + dValue)
//         return this

//     _Bool__(this) {
//         """Return whether the value of this value tracker evaluates as true."""
//         return bool(this.getValue())

//     _Iadd__(this, dValue: float) {
//         """adds ``+=`` syntax to increment the value of the ValueTracker"""
//         this.incrementValue(dValue)
//         return this

//     _Ifloordiv__(this, dValue: float) {
//         """Set the value of this value tracker to the floor division of the current value by ``dValue``."""
//         this.setValue(this.getValue() // dValue)
//         return this

//     _Imod__(this, dValue: float) {
//         """Set the value of this value tracker to the current value modulo ``dValue``."""
//         this.setValue(this.getValue() % dValue)
//         return this

//     _Imul__(this, dValue: float) {
//         """Set the value of this value tracker to the product of the current value and ``dValue``."""
//         this.setValue(this.getValue() * dValue)
//         return this

//     _Ipow__(this, dValue: float) {
//         """Set the value of this value tracker to the current value raised to the power of ``dValue``."""
//         this.setValue(this.getValue() ** dValue)
//         return this

//     _Isub__(this, dValue: float) {
//         """adds ``-=`` syntax to decrement the value of the ValueTracker"""
//         this.incrementValue(-dValue)
//         return this

//     _Itruediv__(this, dValue: float) {
//         """Sets the value of this value tracker to the current value divided by ``dValue``."""
//         this.setValue(this.getValue() / dValue)
//         return this

//     interpolate(this, mobject1, mobject2, alpha, pathFunc=straightPath()) {
//         """
//         Turns this into an interpolation between mobject1
//         and mobject2.
//         """
//         this.setPoints(pathFunc(mobject1.points, mobject2.points, alpha))
//         return this


// class ComplexValueTracker(ValueTracker) {
//     """Tracks a complex-valued parameter.

//     When the value is set through :attr:`animate`, the value will take a straight path from the
//     source point to the destination point.

//     Examples
//     --------
//     .. manim:: ComplexValueTrackerExample

//         class ComplexValueTrackerExample(Scene) {
//             construct(this) {
//                 tracker = ComplexValueTracker(-2+1j)
//                 dot = Dot().addUpdater(
//                     lambda x: x.moveTo(tracker.points)
//                 )

//                 this.add(NumberPlane(), dot)

//                 this.play(tracker.animate.setValue(3+2j))
//                 this.play(tracker.animate.setValue(tracker.getValue() * 1j))
//                 this.play(tracker.animate.setValue(tracker.getValue() - 2j))
//                 this.play(tracker.animate.setValue(tracker.getValue() / (-2 + 3j)))
//     """

//     getValue(this) {
//         """Get the current value of this value tracker as a complex number.

//         The value is internally stored as a points array [a, b, 0]. This can be accessed directly
//         to represent the value geometrically, see the usage example."""
//         return complex(*this.points[0, :2])

//     setValue(this, z) {
//         """Sets a new complex value to the ComplexValueTracker"""
//         z = complex(z)
//         this.points[0, :2] = (z.real, z.imag)
//         return this
