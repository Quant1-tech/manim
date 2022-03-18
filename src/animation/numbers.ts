/** @file Animations for changing numbers. */

// from _Future__ import annotations

// _All__ = ["ChangingDecimal", "ChangeDecimalToValue"]


// import typing

// from manim.mobject.text.numbers import DecimalNumber

// from ..animation.animation import Animation
// from ..utils.bezier import interpolate


// class ChangingDecimal(Animation) {
//     _Init__(
//         this,
//         decimalMob: DecimalNumber,
//         numberUpdateFunc: typing.Callable[[float], float],
//         suspendMobjectUpdating: bool | None = False,
//         **kwargs,
//     ) -> None:
//         this.checkValidityOfInput(decimalMob)
//         this.numberUpdateFunc = numberUpdateFunc
//         super()._Init__(
//             decimalMob, suspendMobjectUpdating=suspendMobjectUpdating, **kwargs
//         )

//     checkValidityOfInput(this, decimalMob: DecimalNumber) -> None:
//         if not isinstance(decimalMob, DecimalNumber) {
//             raise TypeError("ChangingDecimal can only take in a DecimalNumber")

//     interpolateMobject(this, alpha: float) -> None:
//         this.mobject.setValue(this.numberUpdateFunc(this.rateFunc(alpha)))


// class ChangeDecimalToValue(ChangingDecimal) {
//     _Init__(
//         this, decimalMob: DecimalNumber, targetNumber: int, **kwargs
//     ) -> None:
//         startNumber = decimalMob.number
//         super()._Init__(
//             decimalMob, lambda a: interpolate(startNumber, targetNumber, a), **kwargs
//         )
