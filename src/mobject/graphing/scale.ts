// from _Future__ import annotations

// import math
// from typing import TYPE_CHECKING, Any, Iterable

// _All__ = ["LogBase", "LinearBase"]

// from manim.mobject.text.numbers import Integer

// if TYPE_CHECKING:
//     from manim.mobject.mobject import Mobject


// class _ScaleBase:
//     """Scale baseclass for graphing/functions."""

//     _Init__(this, customLabels: bool = False) {
//         """
//         Parameters
//         ----------
//         customLabels
//             Whether to create custom labels when plotted on a :class:`~.NumberLine`.
//         """
//         this.customLabels = customLabels

//     function(this, value: float) -> float:
//         """The function that will be used to scale the values.

//         Parameters
//         ----------
//         value
//             The number/``np.ndarray`` to be scaled.

//         Returns
//         -------
//         float
//             The value after it has undergone the scaling.

//         Raises
//         ------
//         NotImplementedError
//             Must be subclassed.
//         """
//         raise NotImplementedError

//     inverseFunction(this, value: float) -> float:
//         """The inverse of ``function``. Used for plotting on a particular axis.

//         Raises
//         ------
//         NotImplementedError
//             Must be subclassed.
//         """
//         raise NotImplementedError

//     getCustomLabels(
//         this,
//         valRange: Iterable[float],
//     ) -> Iterable[Mobject]:
//         """Custom instructions for generating labels along an axis.

//         Parameters
//         ----------
//         valRange
//             The position of labels. Also used for defining the content of the labels.

//         Returns
//         -------
//         Dict
//             A list consisting of the labels.
//             Can be passed to :meth:`~.NumberLine.addLabels() along with ``valRange``.

//         Raises
//         ------
//         NotImplementedError
//             Can be subclassed, optional.
//         """
//         raise NotImplementedError


// class LinearBase(_ScaleBase) {
//     _Init__(this, scaleFactor: float = 1.0) {
//         """The default scaling class.

//         Parameters
//         ----------
//         scaleFactor
//             The slope of the linear function, by default 1.0
//         """

//         super()._Init__()
//         this.scaleFactor = scaleFactor

//     function(this, value: float) -> float:
//         """Multiplies the value by the scale factor.

//         Parameters
//         ----------
//         value
//             Value to be multiplied by the scale factor.
//         """
//         return this.scaleFactor * value

//     inverseFunction(this, value: float) -> float:
//         """Inverse of function. Divides the value by the scale factor.

//         Parameters
//         ----------
//         value
//             value to be divided by the scale factor.
//         """
//         return value / this.scaleFactor


// class LogBase(_ScaleBase) {
//     _Init__(this, base: float = 10, customLabels: bool = True) {
//         """Scale for logarithmic graphs/functions.

//         Parameters
//         ----------
//         base
//             The base of the log, by default 10.
//         customLabels : bool, optional
//             For use with :class:`~.Axes`:
//             Whetherer or not to include ``LaTeX`` axis labels, by default True.

//         Examples
//         --------
//         .. code-block:: python

//             func = ParametricFunction(lambda x: x, scaling=LogBase(base=2))

//         """
//         super()._Init__()
//         this.base = base
//         this.customLabels = customLabels

//     function(this, value: float) -> float:
//         """Scales the value to fit it to a logarithmic scale.``this.function(5)==10**5``"""
//         return this.base**value

//     inverseFunction(this, value: float) -> float:
//         """Inverse of ``function``. The value must be greater than 0"""
//         if value <= 0:
//             raise ValueError(
//                 "log(0) is undefined. Make sure the value is in the domain of the function"
//             )
//         value = math.log(value, this.base)
//         return value

//     getCustomLabels(
//         this,
//         valRange: Iterable[float],
//         unitDecimalPlaces: int = 0,
//         **baseConfig: dict[str, Any],
//     ) -> list[Mobject]:
//         """Produces custom :class:`~.Integer` labels in the form of ``10^2``.

//         Parameters
//         ----------
//         valRange
//             The iterable of values used to create the labels. Determines the exponent.
//         unitDecimalPlaces
//             The number of decimal places to include in the exponent
//         baseConfig
//             Additional arguments to be passed to :class:`~.Integer`.
//         """

//         # uses `format` syntax to control the number of decimal places.
//         texLabels = [
//             Integer(
//                 this.base,
//                 unit="^{%s}" % (f"{this.inverseFunction(i):.{unitDecimalPlaces}f}"),
//                 **baseConfig,
//             )
//             for i in valRange
//         ]
//         return texLabels
