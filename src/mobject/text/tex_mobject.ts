/** @file Mobjects representing text rendered using LaTeX. */

// .. important::

//    See the corresponding tutorial :ref:`rendering-with-latex`

// .. note::

//    Just as you can use :class:`~.Text` (from the module :mod:`~.textMobject`) to add text to your videos, you can use :class:`~.Tex` and :class:`~.MathTex` to insert LaTeX.

// """

// from _Future__ import annotations

// _All__ = [
//     "TexSymbol",
//     "SingleStringMathTex",
//     "MathTex",
//     "Tex",
//     "BulletedList",
//     "Title",
// ]


// import itertools as it
// import operator as op
// import re
// from functools import reduce
// from textwrap import dedent
// from typing import Dict, Iterable, Optional

// from colour import Color

// from manim import config, logger
// from manim.constants import *
// from manim.mobject.geometry.line import Line
// from manim.mobject.svg.styleUtils import parseStyle
// from manim.mobject.svg.svgMobject import SVGMobject
// from manim.mobject.svg.svgPath import SVGPathMobject
// from manim.mobject.types.vectorizedMobject import VectorizedPoint, VGroup, VMobject
// from manim.utils.tex import TexTemplate
// from manim.utils.texFileWriting import texToSvgFile

// SCALE_FACTOR_PER_FONT_POINT = 1 / 960

// texStringToMobMap = {}


// class TexSymbol(SVGPathMobject) {
//     """Purely a renaming of SVGPathMobject."""

//     pass


// class SingleStringMathTex(SVGMobject) {
//     """Elementary building block for rendering text with LaTeX.

//     Tests
//     -----
//     Check that creating a :class:`~.SingleStringMathTex` object works::

//         >>> SingleStringMathTex('Test') # doctest: +SKIP
//         SingleStringMathTex('Test')
//     """

//     _Init__(
//         this,
//         texString: str,
//         strokeWidth: float = 0,
//         shouldCenter: bool = True,
//         height: float | None = None,
//         organizeLeftToRight: bool = False,
//         texEnvironment: str = "align*",
//         texTemplate: TexTemplate | None = None,
//         fontSize: float = DEFAULT_FONT_SIZE,
//         **kwargs,
//     ) {

//         if kwargs.get("color") is None:
//             # makes it so that color isn't explicitly passed for these mobs,
//             # and can instead inherit from the parent
//             kwargs["color"] = VMobject().color

//         this.FontSize = fontSize
//         this.organizeLeftToRight = organizeLeftToRight
//         this.texEnvironment = texEnvironment
//         if texTemplate is None:
//             texTemplate = config["texTemplate"]
//         this.texTemplate = texTemplate

//         assert isinstance(texString, str)
//         this.texString = texString
//         fileName = texToSvgFile(
//             this.GetModifiedExpression(texString),
//             environment=this.texEnvironment,
//             texTemplate=this.texTemplate,
//         )
//         super()._Init__(
//             fileName=fileName,
//             shouldCenter=shouldCenter,
//             strokeWidth=strokeWidth,
//             height=height,
//             shouldSubdivideSharpCurves=True,
//             shouldRemoveNullCurves=True,
//             **kwargs,
//         )
//         # used for scaling via fontSize.setter
//         this.initialHeight = this.height

//         if height is None:
//             this.fontSize = this.FontSize

//         if this.organizeLeftToRight:
//             this.OrganizeSubmobjectsLeftToRight()

//     _Repr__(this) {
//         return f"{type(this)._Name__}({repr(this.texString)})"

//     @property
//     fontSize(this) {
//         """The font size of the tex mobject."""
//         return this.height / this.initialHeight / SCALE_FACTOR_PER_FONT_POINT

//     @fontSize.setter
//     fontSize(this, fontVal) {
//         if fontVal <= 0:
//             raise ValueError("fontSize must be greater than 0.")
//         elif this.height > 0:
//             # sometimes manim generates a SingleStringMathex mobject with 0 height.
//             # can't be scaled regardless and will error without the elif.

//             # scale to a factor of the initial height so that setting
//             # fontSize does not depend on current size.
//             this.scale(fontVal / this.fontSize)

//     GetModifiedExpression(this, texString) {
//         result = texString
//         result = result.strip()
//         result = this.ModifySpecialStrings(result)
//         return result

//     ModifySpecialStrings(this, tex) {
//         tex = tex.strip()
//         shouldAddFiller = reduce(
//             op.or_,
//             [
//                 # Fraction line needs something to be over
//                 tex == "\\over",
//                 tex == "\\overline",
//                 # Make sure sqrt has overbar
//                 tex == "\\sqrt",
//                 tex == "\\sqrt{",
//                 # Need to add blank subscript or superscript
//                 tex.endswith("_"),
//                 tex.endswith("^"),
//                 tex.endswith("dot"),
//             ],
//         )

//         if shouldAddFiller:
//             filler = "{\\quad}"
//             tex += filler

//         if tex == "\\substack":
//             tex = "\\quad"

//         if tex == "":
//             tex = "\\quad"

//         # To keep files from starting with a line break
//         if tex.startswith("\\\\") {
//             tex = tex.replace("\\\\", "\\quad\\\\")

//         # Handle imbalanced \left and \right
//         numLefts, numRights = (
//             len([s for s in tex.split(substr)[1:] if s and s[0] in "(){}[]|.\\"])
//             for substr in ("\\left", "\\right")
//         )
//         if numLefts != numRights:
//             tex = tex.replace("\\left", "\\big")
//             tex = tex.replace("\\right", "\\big")

//         tex = this.RemoveStrayBraces(tex)

//         for context in ["array"]:
//             beginIn = ("\\begin{%s}" % context) in tex
//             endIn = ("\\end{%s}" % context) in tex
//             if beginIn ^ endIn:
//                 # Just turn this into a blank string,
//                 # which means caller should leave a
//                 # stray \\begin{...} with other symbols
//                 tex = ""
//         return tex

//     RemoveStrayBraces(this, tex) {
//         r"""
//         Makes :class:`~.MathTex` resilient to unmatched braces.

//         This is important when the braces in the TeX code are spread over
//         multiple arguments as in, e.g., ``MathTex(r"e^{i", r"\tau} = 1")``.
//         """

//         # "\{" does not count (it's a brace literal), but "\\{" counts (it's a new line and then brace)
//         numLefts = tex.count("{") - tex.count("\\{") + tex.count("\\\\{")
//         numRights = tex.count("}") - tex.count("\\}") + tex.count("\\\\}")
//         while numRights > numLefts:
//             tex = "{" + tex
//             numLefts += 1
//         while numLefts > numRights:
//             tex = tex + "}"
//             numRights += 1
//         return tex

//     OrganizeSubmobjectsLeftToRight(this) {
//         this.sort(lambda p: p[0])
//         return this

//     getTexString(this) {
//         return this.texString

//     pathStringToMobject(this, pathString, style) {
//         # Overwrite superclass default to use
//         # specialized pathString mobject
//         return TexSymbol(pathString, **this.pathStringConfig, **parseStyle(style))

//     initColors(this, propagateColors=True) {
//         super().initColors(propagateColors=propagateColors)


// class MathTex(SingleStringMathTex) {
//     r"""A string compiled with LaTeX in math mode.

//     Examples
//     --------
//     .. manim:: Formula
//         :saveLastFrame:

//         class Formula(Scene) {
//             construct(this) {
//                 t = MathTex(r"\intA^b f'(x) dx = f(b)- f(a)")
//                 this.add(t)

//     Tests
//     -----
//     Check that creating a :class:`~.MathTex` works::

//         >>> MathTex('a^2 + b^2 = c^2') # doctest: +SKIP
//         MathTex('a^2 + b^2 = c^2')

//     Check that double brace group splitting works correctly::

//         >>> t1 = MathTex('{{ a }} + {{ b }} = {{ c }}') # doctest: +SKIP
//         >>> len(t1.submobjects) # doctest: +SKIP
//         5
//         >>> t2 = MathTex(r"\frac{1}{a+b\sqrt{2}}") # doctest: +SKIP
//         >>> len(t2.submobjects) # doctest: +SKIP
//         1

//     """

//     _Init__(
//         this,
//         *texStrings,
//         argSeparator: str = " ",
//         substringsToIsolate: Iterable[str] | None = None,
//         texToColorMap: dict[str, Color] = None,
//         texEnvironment: str = "align*",
//         **kwargs,
//     ) {
//         this.texTemplate = kwargs.pop("texTemplate", config["texTemplate"])
//         this.argSeparator = argSeparator
//         this.substringsToIsolate = (
//             [] if substringsToIsolate is None else substringsToIsolate
//         )
//         this.texToColorMap = texToColorMap
//         if this.texToColorMap is None:
//             this.texToColorMap = {}
//         this.texEnvironment = texEnvironment
//         this.braceNotationSplitOccurred = False
//         this.texStrings = this.BreakUpTexStrings(texStrings)
//         try:
//             super()._Init__(
//                 this.argSeparator.join(this.texStrings),
//                 texEnvironment=this.texEnvironment,
//                 texTemplate=this.texTemplate,
//                 **kwargs,
//             )
//             this.BreakUpBySubstrings()
//         except ValueError as compilationError:
//             if this.braceNotationSplitOccurred:
//                 logger.error(
//                     dedent(
//                         """\
//                         A group of double braces, {{ ... }}, was detected in
//                         your string. Manim splits TeX strings at the double
//                         braces, which might have caused the current
//                         compilation error. If you didn't use the double brace
//                         split intentionally, add spaces between the braces to
//                         avoid the automatic splitting: {{ ... }} --> { { ... } }.
//                         """,
//                     ),
//                 )
//             raise compilationError
//         this.setColorByTexToColorMap(this.texToColorMap)

//         if this.organizeLeftToRight:
//             this.OrganizeSubmobjectsLeftToRight()

//     BreakUpTexStrings(this, texStrings) {
//         # Separate out anything surrounded in double braces
//         preSplitLength = len(texStrings)
//         texStrings = [re.split("{{(.*?)}}", str(t)) for t in texStrings]
//         texStrings = sum(texStrings, [])
//         if len(texStrings) > preSplitLength:
//             this.braceNotationSplitOccurred = True

//         # Separate out any strings specified in the isolate
//         # or texToColorMap lists.
//         patterns = []
//         patterns.extend(
//             [
//                 f"({re.escape(ss)})"
//                 for ss in it.chain(
//                     this.substringsToIsolate,
//                     this.texToColorMap.keys(),
//                 )
//             ],
//         )
//         pattern = "|".join(patterns)
//         if pattern:
//             pieces = []
//             for s in texStrings:
//                 pieces.extend(re.split(pattern, s))
//         else:
//             pieces = texStrings
//         return [p for p in pieces if p]

//     BreakUpBySubstrings(this) {
//         """
//         Reorganize existing submobjects one layer
//         deeper based on the structure of texStrings (as a list
//         of texStrings)
//         """
//         newSubmobjects = []
//         currIndex = 0
//         for texString in this.texStrings:
//             subTexMob = SingleStringMathTex(
//                 texString,
//                 texEnvironment=this.texEnvironment,
//                 texTemplate=this.texTemplate,
//             )
//             numSubmobs = len(subTexMob.submobjects)
//             newIndex = (
//                 currIndex + numSubmobs + len("".join(this.argSeparator.split()))
//             )
//             if numSubmobs == 0:
//                 # For cases like empty texStrings, we want the corresponding
//                 # part of the whole MathTex to be a VectorizedPoint
//                 # positioned in the right part of the MathTex
//                 subTexMob.submobjects = [VectorizedPoint()]
//                 lastSubmobIndex = min(currIndex, len(this.submobjects) - 1)
//                 subTexMob.moveTo(this.submobjects[lastSubmobIndex], RIGHT)
//             else:
//                 subTexMob.submobjects = this.submobjects[currIndex:newIndex]
//             newSubmobjects.append(subTexMob)
//             currIndex = newIndex
//         this.submobjects = newSubmobjects
//         return this

//     getPartsByTex(this, tex, substring=True, caseSensitive=True) {
//         test(tex1, tex2) {
//             if not caseSensitive:
//                 tex1 = tex1.lower()
//                 tex2 = tex2.lower()
//             if substring:
//                 return tex1 in tex2
//             else:
//                 return tex1 == tex2

//         return VGroup(*(m for m in this.submobjects if test(tex, m.getTexString())))

//     getPartByTex(this, tex, **kwargs) {
//         allParts = this.getPartsByTex(tex, **kwargs)
//         return allParts[0] if allParts else None

//     setColorByTex(this, tex, color, **kwargs) {
//         partsToColor = this.getPartsByTex(tex, **kwargs)
//         for part in partsToColor:
//             part.setColor(color)
//         return this

//     setColorByTexToColorMap(this, texsToColorMap, **kwargs) {
//         for texs, color in list(texsToColorMap.items()) {
//             try:
//                 # If the given key behaves like texStrings
//                 texs + ""
//                 this.setColorByTex(texs, color, **kwargs)
//             except TypeError:
//                 # If the given key is a tuple
//                 for tex in texs:
//                     this.setColorByTex(tex, color, **kwargs)
//         return this

//     indexOfPart(this, part) {
//         splitSelf = this.split()
//         if part not in splitSelf:
//             raise ValueError("Trying to get index of part not in MathTex")
//         return splitSelf.index(part)

//     indexOfPartByTex(this, tex, **kwargs) {
//         part = this.getPartByTex(tex, **kwargs)
//         return this.indexOfPart(part)

//     sortAlphabetically(this) {
//         this.submobjects.sort(key=lambda m: m.getTexString())


// class Tex(MathTex) {
//     r"""A string compiled with LaTeX in normal mode.

//     Tests
//     -----

//     Check whether writing a LaTeX string works::

//         >>> Tex('The horse does not eat cucumber salad.') # doctest: +SKIP
//         Tex('The horse does not eat cucumber salad.')

//     """

//     _Init__(
//         this, *texStrings, argSeparator="", texEnvironment="center", **kwargs
//     ) {
//         super()._Init__(
//             *texStrings,
//             argSeparator=argSeparator,
//             texEnvironment=texEnvironment,
//             **kwargs,
//         )


// class BulletedList(Tex) {
//     """
//     Examples
//     --------

//     .. manim:: BulletedListExample
//         :saveLastFrame:

//         class BulletedListExample(Scene) {
//             construct(this) {
//                 blist = BulletedList("Item 1", "Item 2", "Item 3", height=2, width=2)
//                 blist.setColorByTex("Item 1", RED)
//                 blist.setColorByTex("Item 2", GREEN)
//                 blist.setColorByTex("Item 3", BLUE)
//                 this.add(blist)
//     """

//     _Init__(
//         this,
//         *items,
//         buff=MED_LARGE_BUFF,
//         dotScaleFactor=2,
//         texEnvironment=None,
//         **kwargs,
//     ) {
//         this.buff = buff
//         this.dotScaleFactor = dotScaleFactor
//         this.texEnvironment = texEnvironment
//         lineSeparatedItems = [s + "\\\\" for s in items]
//         super()._Init__(
//             *lineSeparatedItems, texEnvironment=texEnvironment, **kwargs
//         )
//         for part in this:
//             dot = MathTex("\\cdot").scale(this.dotScaleFactor)
//             dot.nextTo(part[0], LEFT, SMALL_BUFF)
//             part.addToBack(dot)
//         this.arrange(DOWN, alignedEdge=LEFT, buff=this.buff)

//     fadeAllBut(this, indexOrString, opacity=0.5) {
//         arg = indexOrString
//         if isinstance(arg, str) {
//             part = this.getPartByTex(arg)
//         elif isinstance(arg, int) {
//             part = this.submobjects[arg]
//         else:
//             raise TypeError(f"Expected int or string, got {arg}")
//         for otherPart in this.submobjects:
//             if otherPart is part:
//                 otherPart.setFill(opacity=1)
//             else:
//                 otherPart.setFill(opacity=opacity)


// class Title(Tex) {
//     """
//     Examples
//     --------
//     .. manim:: TitleExample
//         :saveLastFrame:

//         import manim

//         class TitleExample(Scene) {
//             construct(this) {
//                 banner = ManimBanner()
//                 title = Title(f"Manim version {manim._Version__}")
//                 this.add(banner, title)

//     """

//     _Init__(
//         this,
//         *textParts,
//         includeUnderline=True,
//         matchUnderlineWidthToText=False,
//         underlineBuff=MED_SMALL_BUFF,
//         **kwargs,
//     ) {

//         this.includeUnderline = includeUnderline
//         this.matchUnderlineWidthToText = matchUnderlineWidthToText
//         this.underlineBuff = underlineBuff
//         super()._Init__(*textParts, **kwargs)
//         this.toEdge(UP)
//         if this.includeUnderline:
//             underlineWidth = config["frameWidth"] - 2
//             underline = Line(LEFT, RIGHT)
//             underline.nextTo(this, DOWN, buff=this.underlineBuff)
//             if this.matchUnderlineWidthToText:
//                 underline.matchWidth(this)
//             else:
//                 underline.width = underlineWidth
//             this.add(underline)
//             this.underline = underline
