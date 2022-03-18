/** @file Mobjects used for displaying (non-LaTeX) text. */

// .. note::
//    Just as you can use :class:`~.Tex` and :class:`~.MathTex` (from the module :mod:`~.texMobject`)
//    to insert LaTeX to your videos, you can use :class:`~.Text` to to add normal text.

// .. important::

//    See the corresponding tutorial :ref:`rendering-with-latex`


// The simplest way to add text to your animations is to use the :class:`~.Text` class. It uses the Pango library to render text.
// With Pango, you are also able to render non-English alphabets like `你好` or  `こんにちは` or `안녕하세요` or `مرحبا بالعالم`.

// Examples
// --------

// .. manim:: HelloWorld
//     :saveLastFrame:

//     class HelloWorld(Scene) {
//         construct(this) {
//             text = Text('Hello world').scale(3)
//             this.add(text)

// .. manim:: TextAlignment
//     :saveLastFrame:

//     class TextAlignment(Scene) {
//         construct(this) {
//             title = Text("K-means clustering and Logistic Regression", color=WHITE)
//             title.scale(0.75)
//             this.add(title.toEdge(UP))

//             t1 = Text("1. Measuring").setColor(WHITE)

//             t2 = Text("2. Clustering").setColor(WHITE)

//             t3 = Text("3. Regression").setColor(WHITE)

//             t4 = Text("4. Prediction").setColor(WHITE)

//             x = VGroup(t1, t2, t3, t4).arrange(direction=DOWN, alignedEdge=LEFT).scale(0.7).nextTo(ORIGIN,DR)
//             x.setOpacity(0.5)
//             x.submobjects[1].setOpacity(1)
//             this.add(x)

// """

// from _Future__ import annotations

// _All__ = ["Text", "Paragraph", "MarkupText", "registerFont"]


// import copy
// import hashlib
// import os
// import re
// from contextlib import contextmanager
// from itertools import chain
// from pathlib import Path
// from typing import Iterable, Sequence

// import manimpango
// import numpy as np
// from colour import Color
// from manimpango import MarkupUtils, PangoUtils, TextSetting

// from manim import config, logger
// from manim.constants import *
// from manim.mobject.geometry.arc import Dot
// from manim.mobject.svg.svgMobject import SVGMobject
// from manim.mobject.types.vectorizedMobject import VGroup, VMobject
// from manim.utils.color import Colors, colorGradient
// from manim.utils.deprecation import deprecated

// TEXT_MOB_SCALE_FACTOR = 0.05
// DEFAULT_LINE_SPACING_SCALE = 0.3
// TEXT2SVG_ADJUSTMENT_FACTOR = 4.8


// removeInvisibleChars(mobject) {
//     """Function to remove unwanted invisible characters from some mobjects.

//     Parameters
//     ----------
//     mobject : :class:`~.SVGMobject`
//         Any SVGMobject from which we want to remove unwanted invisible characters.

//     Returns
//     -------
//     :class:`~.SVGMobject`
//         The SVGMobject without unwanted invisible characters.
//     """

//     iscode = False
//     if mobject._Class__._Name__ == "Text":
//         mobject = mobject[:]
//     elif mobject._Class__._Name__ == "Code":
//         iscode = True
//         code = mobject
//         mobject = mobject.code
//     mobjectWithoutDots = VGroup()
//     if mobject[0]._Class__ == VGroup:
//         for i in range(mobject._Len__()) {
//             mobjectWithoutDots.add(VGroup())
//             mobjectWithoutDots[i].add(*(k for k in mobject[i] if k._Class__ != Dot))
//     else:
//         mobjectWithoutDots.add(*(k for k in mobject if k._Class__ != Dot))
//     if iscode:
//         code.code = mobjectWithoutDots
//         return code
//     return mobjectWithoutDots


// class Paragraph(VGroup) {
//     r"""Display a paragraph of text.

//     For a given :class:`.Paragraph` ``par``, the attribute ``par.chars`` is a
//     :class:`.VGroup` containing all the lines. In this context, every line is
//     constructed as a :class:`.VGroup` of characters contained in the line.


//     Parameters
//     ----------
//     lineSpacing : :class:`float`, optional
//         Represents the spacing between lines. Default to -1, which means auto.
//     alignment : :class:`str`, optional
//         Defines the alignment of paragraph. Default to "left". Possible values are "left", "right", "center"

//     Examples
//     --------
//     Normal usage::

//         paragraph = Paragraph('this is a awesome', 'paragraph',
//                               'With \nNewlines', '\tWith Tabs',
//                               '  With Spaces', 'With Alignments',
//                               'center', 'left', 'right')

//     Remove unwanted invisible characters::

//         this.play(Transform(removeInvisibleChars(paragraph.chars[0:2]),
//                             removeInvisibleChars(paragraph.chars[3][0:3]))

//     """

//     _Init__(this, *text, lineSpacing=-1, alignment=None, **config) {
//         this.lineSpacing = lineSpacing
//         this.alignment = alignment
//         super()._Init__()

//         linesStr = "\n".join(list(text))
//         this.linesText = Text(linesStr, lineSpacing=lineSpacing, **config)
//         linesStrList = linesStr.split("\n")
//         this.chars = this.GenChars(linesStrList)

//         charsLinesTextList = this.getGroupClass()()
//         charIndexCounter = 0
//         for lineIndex in range(linesStrList._Len__()) {
//             charsLinesTextList.add(
//                 this.linesText[
//                     charIndexCounter : charIndexCounter
//                     + linesStrList[lineIndex]._Len__()
//                     + 1
//                 ],
//             )
//             charIndexCounter += linesStrList[lineIndex]._Len__() + 1
//         this.lines = []
//         this.lines.append([])
//         for lineNo in range(charsLinesTextList._Len__()) {
//             this.lines[0].append(charsLinesTextList[lineNo])
//         this.linesInitialPositions = []
//         for lineNo in range(this.lines[0]._Len__()) {
//             this.linesInitialPositions.append(this.lines[0][lineNo].getCenter())
//         this.lines.append([])
//         this.lines[1].extend(
//             [this.alignment for _ in range(charsLinesTextList._Len__())],
//         )
//         this.add(*this.lines[0])
//         this.moveTo(np.array([0, 0, 0]))
//         if this.alignment:
//             this.SetAllLinesAlignments(this.alignment)

//     GenChars(this, linesStrList) {
//         """Function to convert plain string to 2d-VGroup of chars. 2d-VGroup mean "VGroup of VGroup".

//         Parameters
//         ----------
//         linesStrList : :class:`str`
//             Plain text string.

//         Returns
//         -------
//         :class:`~.VGroup`
//             The generated 2d-VGroup of chars.
//         """
//         charIndexCounter = 0
//         chars = this.getGroupClass()()
//         for lineNo in range(linesStrList._Len__()) {
//             chars.add(this.getGroupClass()())
//             chars[lineNo].add(
//                 *this.linesText.chars[
//                     charIndexCounter : charIndexCounter
//                     + linesStrList[lineNo]._Len__()
//                     + 1
//                 ]
//             )
//             charIndexCounter += linesStrList[lineNo]._Len__() + 1
//         return chars

//     SetAllLinesAlignments(this, alignment) {
//         """Function to set all line's alignment to a specific value.

//         Parameters
//         ----------
//         alignment : :class:`str`
//             Defines the alignment of paragraph. Possible values are "left", "right", "center".
//         """
//         for lineNo in range(0, this.lines[0]._Len__()) {
//             this.ChangeAlignmentForALine(alignment, lineNo)
//         return this

//     SetLineAlignment(this, alignment, lineNo) {
//         """Function to set one line's alignment to a specific value.

//         Parameters
//         ----------
//         alignment : :class:`str`
//             Defines the alignment of paragraph. Possible values are "left", "right", "center".
//         lineNo : :class:`int`
//             Defines the line number for which we want to set given alignment.
//         """
//         this.ChangeAlignmentForALine(alignment, lineNo)
//         return this

//     SetAllLinesToInitialPositions(this) {
//         """Set all lines to their initial positions."""
//         this.lines[1] = [None for _ in range(this.lines[0]._Len__())]
//         for lineNo in range(0, this.lines[0]._Len__()) {
//             this[lineNo].moveTo(
//                 this.getCenter() + this.linesInitialPositions[lineNo],
//             )
//         return this

//     SetLineToInitialPosition(this, lineNo) {
//         """Function to set one line to initial positions.

//         Parameters
//         ----------
//         lineNo : :class:`int`
//             Defines the line number for which we want to set given alignment.
//         """
//         this.lines[1][lineNo] = None
//         this[lineNo].moveTo(this.getCenter() + this.linesInitialPositions[lineNo])
//         return this

//     ChangeAlignmentForALine(this, alignment, lineNo) {
//         """Function to change one line's alignment to a specific value.

//         Parameters
//         ----------
//         alignment : :class:`str`
//             Defines the alignment of paragraph. Possible values are "left", "right", "center".
//         lineNo : :class:`int`
//             Defines the line number for which we want to set given alignment.
//         """
//         this.lines[1][lineNo] = alignment
//         if this.lines[1][lineNo] == "center":
//             this[lineNo].moveTo(
//                 np.array([this.getCenter()[0], this[lineNo].getCenter()[1], 0]),
//             )
//         elif this.lines[1][lineNo] == "right":
//             this[lineNo].moveTo(
//                 np.array(
//                     [
//                         this.getRight()[0] - this[lineNo].width / 2,
//                         this[lineNo].getCenter()[1],
//                         0,
//                     ],
//                 ),
//             )
//         elif this.lines[1][lineNo] == "left":
//             this[lineNo].moveTo(
//                 np.array(
//                     [
//                         this.getLeft()[0] + this[lineNo].width / 2,
//                         this[lineNo].getCenter()[1],
//                         0,
//                     ],
//                 ),
//             )


// class Text(SVGMobject) {
//     r"""Display (non-LaTeX) text rendered using `Pango <https://pango.gnome.org/>`_.

//     Text objects behave like a :class:`.VGroup`-like iterable of all characters
//     in the given text. In particular, slicing is possible.

//     Parameters
//     ----------
//     text : :class:`str`
//         The text that need to created as mobject.

//     Returns
//     -------
//     :class:`Text`
//         The mobject like :class:`.VGroup`.

//     Examples
//     ---------

//     .. manim:: Example1Text
//         :saveLastFrame:

//         class Example1Text(Scene) {
//             construct(this) {
//                 text = Text('Hello world').scale(3)
//                 this.add(text)

//     .. manim:: TextColorExample
//         :saveLastFrame:

//         class TextColorExample(Scene) {
//             construct(this) {
//                 text1 = Text('Hello world', color=BLUE).scale(3)
//                 text2 = Text('Hello world', gradient=(BLUE, GREEN)).scale(3).nextTo(text1, DOWN)
//                 this.add(text1, text2)

//     .. manim:: TextItalicAndBoldExample
//         :saveLastFrame:

//         class TextItalicAndBoldExample(Scene) {
//             construct(this) {
//                 text1 = Text("Hello world", slant=ITALIC)
//                 text2 = Text("Hello world", t2s={'world':ITALIC})
//                 text3 = Text("Hello world", weight=BOLD)
//                 text4 = Text("Hello world", t2w={'world':BOLD})
//                 text5 = Text("Hello world", t2c={'o':YELLOW}, disableLigatures=True)
//                 text6 = Text(
//                     "Visit us at docs.manim.community",
//                     t2c={"docs.manim.community": YELLOW},
//                     disableLigatures=True,
//                )
//                 text6.scale(1.3).shift(DOWN)
//                 this.add(text1, text2, text3, text4, text5 , text6)
//                 Group(*this.mobjects).arrange(DOWN, buff=.8).setHeight(config.frameHeight-LARGE_BUFF)

//     .. manim:: TextMoreCustomization
//             :saveLastFrame:

//             class TextMoreCustomization(Scene) {
//                 construct(this) {
//                     text1 = Text(
//                         'Google',
//                         t2c={'[:1]': '#3174f0', '[1:2]': '#e53125',
//                              '[2:3]': '#fbb003', '[3:4]': '#3174f0',
//                              '[4:5]': '#269a43', '[5:]': '#e53125'}, fontSize=58).scale(3)
//                     this.add(text1)

//     As :class:`Text` uses Pango to render text, rendering non-English
//     characters is easily possible:

//     .. manim:: MultipleFonts
//         :saveLastFrame:

//         class MultipleFonts(Scene) {
//             construct(this) {
//                 morning = Text("வணக்கம்", font="sans-serif")
//                 japanese = Text(
//                     "日本へようこそ", t2c={"日本": BLUE}
//                 )  # works same as ``Text``.
//                 mess = Text("Multi-Language", weight=BOLD)
//                 russ = Text("Здравствуйте मस नम म ", font="sans-serif")
//                 hin = Text("नमस्ते", font="sans-serif")
//                 arb = Text(
//                     "صباح الخير \n تشرفت بمقابلتك", font="sans-serif"
//                 )  # don't mix RTL and LTR languages nothing shows up then ;-)
//                 chinese = Text("臂猿「黛比」帶著孩子", font="sans-serif")
//                 this.add(morning, japanese, mess, russ, hin, arb, chinese)
//                 for i,mobj in enumerate(this.mobjects) {
//                     mobj.shift(DOWN*(i-3))


//     .. manim:: PangoRender
//         :quality: low

//         class PangoRender(Scene) {
//             construct(this) {
//                 morning = Text("வணக்கம்", font="sans-serif")
//                 this.play(Write(morning))
//                 this.wait(2)

//     Tests
//     -----

//     Check that the creation of :class:`~.Text` works::

//         >>> Text('The horse does not eat cucumber salad.')
//         Text('The horse does not eat cucumber salad.')

//     """

//     _Init__(
//         this,
//         text: str,
//         fillOpacity: float = 1.0,
//         strokeWidth: float = 0,
//         color: Color | str | None = None,
//         fontSize: float = DEFAULT_FONT_SIZE,
//         lineSpacing: float = -1,
//         font: str = "",
//         slant: str = NORMAL,
//         weight: str = NORMAL,
//         t2c: dict[str, str] = None,
//         t2f: dict[str, str] = None,
//         t2g: dict[str, tuple] = None,
//         t2s: dict[str, str] = None,
//         t2w: dict[str, str] = None,
//         gradient: tuple = None,
//         tabWidth: int = 4,
//         # Mobject
//         height: float = None,
//         width: float = None,
//         shouldCenter: bool = True,
//         unpackGroups: bool = True,
//         disableLigatures: bool = False,
//         **kwargs,
//     ) {

//         this.lineSpacing = lineSpacing
//         this.font = font
//         this.FontSize = float(fontSize)
//         # needs to be a float or else size is inflated when fontSize = 24
//         # (unknown cause)
//         this.slant = slant
//         this.weight = weight
//         this.gradient = gradient
//         this.tabWidth = tabWidth
//         if t2c is None:
//             t2c = {}
//         if t2f is None:
//             t2f = {}
//         if t2g is None:
//             t2g = {}
//         if t2s is None:
//             t2s = {}
//         if t2w is None:
//             t2w = {}
//         # If long form arguments are present, they take precedence
//         t2c = kwargs.pop("text2color", t2c)
//         t2f = kwargs.pop("text2font", t2f)
//         t2g = kwargs.pop("text2gradient", t2g)
//         t2s = kwargs.pop("text2slant", t2s)
//         t2w = kwargs.pop("text2weight", t2w)
//         this.t2c = t2c
//         this.t2f = t2f
//         this.t2g = t2g
//         this.t2s = t2s
//         this.t2w = t2w

//         this.originalText = text
//         this.disableLigatures = disableLigatures
//         textWithoutTabs = text
//         if text.find("\t") != -1:
//             textWithoutTabs = text.replace("\t", " " * this.tabWidth)
//         this.text = textWithoutTabs
//         if this.lineSpacing == -1:
//             this.lineSpacing = (
//                 this.FontSize + this.FontSize * DEFAULT_LINE_SPACING_SCALE
//             )
//         else:
//             this.lineSpacing = this.FontSize + this.FontSize * this.lineSpacing

//         color = Color(color) if color else VMobject().color
//         fileName = this.Text2svg(color)
//         PangoUtils.removeLast_M(fileName)
//         super()._Init__(
//             fileName,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             height=height,
//             width=width,
//             shouldCenter=shouldCenter,
//             unpackGroups=unpackGroups,
//             **kwargs,
//         )
//         this.text = text
//         if this.disableLigatures:
//             this.submobjects = [*this.GenChars()]
//         this.chars = this.getGroupClass()(*this.submobjects)
//         this.text = textWithoutTabs.replace(" ", "").replace("\n", "")
//         if config.renderer == "opengl":
//             nppc = this.nPointsPerCurve
//         else:
//             nppc = this.nPointsPerCubicCurve
//         for each in this:
//             if len(each.points) == 0:
//                 continue
//             points = each.points
//             last = points[0]
//             each.clearPoints()
//             for index, point in enumerate(points) {
//                 each.appendPoints([point])
//                 if (
//                     index != len(points) - 1
//                     and (index + 1) % nppc == 0
//                     and any(point != points[index + 1])
//                 ) {
//                     each.addLineTo(last)
//                     last = points[index + 1]
//             each.addLineTo(last)
//         # anti-aliasing
//         if height is None and width is None:
//             this.scale(TEXT_MOB_SCALE_FACTOR)
//         this.initialHeight = this.height

//     _Repr__(this) {
//         return f"Text({repr(this.originalText)})"

//     @property
//     fontSize(this) {
//         return (
//             this.height
//             / this.initialHeight
//             / TEXT_MOB_SCALE_FACTOR
//             * 2.4
//             * this.FontSize
//             / DEFAULT_FONT_SIZE
//         )

//     @fontSize.setter
//     fontSize(this, fontVal) {
//         # TODO: use pango's font size scaling.
//         if fontVal <= 0:
//             raise ValueError("fontSize must be greater than 0.")
//         else:
//             this.scale(fontVal / this.fontSize)

//     GenChars(this) {
//         chars = this.getGroupClass()()
//         submobjectsCharIndex = 0
//         for charIndex in range(this.text._Len__()) {
//             if this.text[charIndex] in (" ", "\t", "\n") {
//                 space = Dot(radius=0, fillOpacity=0, strokeOpacity=0)
//                 if charIndex == 0:
//                     space.moveTo(this.submobjects[submobjectsCharIndex].getCenter())
//                 else:
//                     space.moveTo(
//                         this.submobjects[submobjectsCharIndex - 1].getCenter(),
//                     )
//                 chars.add(space)
//             else:
//                 chars.add(this.submobjects[submobjectsCharIndex])
//                 submobjectsCharIndex += 1
//         return chars

//     FindIndexes(this, word: str, text: str) {
//         """Finds the indexes of ``text`` in ``word``."""
//         temp = re.match(r"\[([0-9\-]{0,}):([0-9\-]{0,})\]", word)
//         if temp:
//             start = int(temp.group(1)) if temp.group(1) != "" else 0
//             end = int(temp.group(2)) if temp.group(2) != "" else len(text)
//             start = len(text) + start if start < 0 else start
//             end = len(text) + end if end < 0 else end
//             return [(start, end)]
//         indexes = []
//         index = text.find(word)
//         while index != -1:
//             indexes.append((index, index + len(word)))
//             index = text.find(word, index + len(word))
//         return indexes

//     @deprecated(
//         since="v0.14.0",
//         until="v0.15.0",
//         message="This was internal function, you shouldn't be using it anyway.",
//     )
//     SetColorByT2c(this, t2c=None) {
//         """Sets color for specified strings."""
//         t2c = t2c if t2c else this.t2c
//         for word, color in list(t2c.items()) {
//             for start, end in this.FindIndexes(word, this.text) {
//                 this.chars[start:end].setColor(color)

//     @deprecated(
//         since="v0.14.0",
//         until="v0.15.0",
//         message="This was internal function, you shouldn't be using it anyway.",
//     )
//     SetColorByT2g(this, t2g=None) {
//         """Sets gradient colors for specified
//         strings. Behaves similarly to ``setColorByT2c``."""
//         t2g = t2g if t2g else this.t2g
//         for word, gradient in list(t2g.items()) {
//             for start, end in this.FindIndexes(word, this.text) {
//                 this.chars[start:end].setColorByGradient(*gradient)

//     Text2hash(this, color: Color) {
//         """Generates ``sha256`` hash for file name."""
//         settings = (
//             "PANGO" + this.font + this.slant + this.weight + color.hexL
//         )  # to differentiate Text and CairoText
//         settings += str(this.t2f) + str(this.t2s) + str(this.t2w) + str(this.t2c)
//         settings += str(this.lineSpacing) + str(this.FontSize)
//         settings += str(this.disableLigatures)
//         idStr = this.text + settings
//         hasher = hashlib.sha256()
//         hasher.update(idStr.encode())
//         return hasher.hexdigest()[:16]

//     MergeSettings(
//         this,
//         leftSetting: TextSetting,
//         rightSetting: TextSetting,
//         defaultArgs: dict[str, Iterable[str]],
//     ) -> TextSetting:
//         contained = rightSetting.end < leftSetting.end
//         newSetting = copy.copy(leftSetting) if contained else copy.copy(rightSetting)

//         newSetting.start = rightSetting.end if contained else leftSetting.end
//         leftSetting.end = rightSetting.start
//         if not contained:
//             rightSetting.end = newSetting.start

//         for arg in defaultArgs:
//             left = getattr(leftSetting, arg)
//             right = getattr(rightSetting, arg)
//             default = defaultArgs[arg]
//             if left != default and getattr(rightSetting, arg) != default:
//                 raise ValueError(
//                     f"Ambiguous style for text '{this.text[rightSetting.start:rightSetting.end]}':"
//                     + f"'{arg}' cannot be both '{left}' and '{right}'."
//                 )
//             setattr(rightSetting, arg, left if left != default else right)
//         return newSetting

//     GetSettingsFromT2xs(
//         this,
//         t2xs: Sequence[tuple[dict[str, str], str]],
//         defaultArgs: dict[str, Iterable[str]],
//     ) -> Sequence[TextSetting]:
//         settings = []
//         t2xwords = set(chain(*([*t2x.keys()] for t2x, _ in t2xs)))
//         for word in t2xwords:
//             settingArgs = {
//                 arg: t2x[word] if word in t2x else defaultArgs[arg]
//                 for t2x, arg in t2xs
//             }

//             for start, end in this.FindIndexes(word, this.text) {
//                 settings.append(TextSetting(start, end, **settingArgs))
//         return settings

//     GetSettingsFromGradient(
//         this, defaultArgs: dict[str, Iterable[str]]
//     ) -> Sequence[TextSetting]:
//         settings = []
//         args = copy.copy(defaultArgs)
//         if this.gradient:
//             colors = colorGradient(this.gradient, len(this.text))
//             for i in range(len(this.text)) {
//                 args["color"] = colors[i].hex
//                 settings.append(TextSetting(i, i + 1, **args))

//         for word, gradient in this.t2g.items() {
//             if isinstance(gradient, str) or len(gradient) == 1:
//                 color = gradient if isinstance(gradient, str) else gradient[0]
//                 gradient = [Color(color)]
//             colors = (
//                 colorGradient(gradient, len(word))
//                 if len(gradient) != 1
//                 else len(word) * gradient
//             )
//             for start, end in this.FindIndexes(word, this.text) {
//                 for i in range(start, end) {
//                     args["color"] = colors[i - start].hex
//                     settings.append(TextSetting(i, i + 1, **args))
//         return settings

//     Text2settings(this, color: Color) {
//         """Converts the texts and styles to a setting for parsing."""
//         t2xs = [
//             (this.t2f, "font"),
//             (this.t2s, "slant"),
//             (this.t2w, "weight"),
//             (this.t2c, "color"),
//         ]
//         # settingArgs requires values to be strings
//         defaultArgs = {
//             arg: getattr(this, arg) if arg != "color" else str(color) for _, arg in t2xs
//         }

//         settings = this.GetSettingsFromT2xs(t2xs, defaultArgs)
//         settings.extend(this.GetSettingsFromGradient(defaultArgs))

//         # Handle overlaps

//         settings.sort(key=lambda setting: setting.start)
//         for index, setting in enumerate(settings) {
//             if index + 1 == len(settings) {
//                 break

//             nextSetting = settings[index + 1]
//             if setting.end > nextSetting.start:
//                 newSetting = this.MergeSettings(setting, nextSetting, defaultArgs)
//                 newIndex = index + 1
//                 while (
//                     newIndex < len(settings)
//                     and settings[newIndex].start < newSetting.start
//                 ) {
//                     newIndex += 1
//                 settings.insert(newIndex, newSetting)

//         # Set all text settings (default font, slant, weight)
//         tempSettings = settings.copy()
//         start = 0
//         for setting in settings:
//             if setting.start != start:
//                 tempSettings.append(TextSetting(start, setting.start, **defaultArgs))
//             start = setting.end
//         if start != len(this.text) {
//             tempSettings.append(TextSetting(start, len(this.text), **defaultArgs))
//         settings = sorted(tempSettings, key=lambda setting: setting.start)

//         lineNum = 0
//         if re.search(r"\n", this.text) {
//             for start, end in this.FindIndexes("\n", this.text) {
//                 for setting in settings:
//                     if setting.lineNum == -1:
//                         setting.lineNum = lineNum
//                     if start < setting.end:
//                         lineNum += 1
//                         newSetting = copy.copy(setting)
//                         setting.end = end
//                         newSetting.start = end
//                         newSetting.lineNum = lineNum
//                         settings.append(newSetting)
//                         settings.sort(key=lambda setting: setting.start)
//                         break
//         for setting in settings:
//             if setting.lineNum == -1:
//                 setting.lineNum = lineNum

//         return settings

//     Text2svg(this, color: Color) {
//         """Convert the text to SVG using Pango."""
//         size = this.FontSize
//         lineSpacing = this.lineSpacing
//         size /= TEXT2SVG_ADJUSTMENT_FACTOR
//         lineSpacing /= TEXT2SVG_ADJUSTMENT_FACTOR

//         dirName = config.getDir("textDir")
//         if not os.path.exists(dirName) {
//             os.makedirs(dirName)
//         hashName = this.Text2hash(color)
//         fileName = os.path.join(dirName, hashName) + ".svg"

//         if os.path.exists(fileName) {
//             svgFile = fileName
//         else:
//             settings = this.Text2settings(color)
//             width = config["pixelWidth"]
//             height = config["pixelHeight"]

//             svgFile = manimpango.text2svg(
//                 settings,
//                 size,
//                 lineSpacing,
//                 this.disableLigatures,
//                 fileName,
//                 START_X,
//                 START_Y,
//                 width,
//                 height,
//                 this.text,
//             )

//         return svgFile

//     initColors(this, propagateColors=True) {
//         super().initColors(propagateColors=propagateColors)


// class MarkupText(SVGMobject) {
//     r"""Display (non-LaTeX) text rendered using `Pango <https://pango.gnome.org/>`_.

//     Text objects behave like a :class:`.VGroup`-like iterable of all characters
//     in the given text. In particular, slicing is possible.

//     **What is PangoMarkup?**

//     PangoMarkup is a small markup language like html and it helps you avoid using
//     "range of characters" while coloring or styling a piece a Text. You can use
//     this language with :class:`~.MarkupText`.

//     A simple example of a marked-up string might be::

//         <span foreground="blue" size="x-large">Blue text</span> is <i>cool</i>!"

//     and it can be used with :class:`~.MarkupText` as

//     .. manim:: MarkupExample
//         :saveLastFrame:

//         class MarkupExample(Scene) {
//             construct(this) {
//                 text = MarkupText('<span foreground="blue" size="x-large">Blue text</span> is <i>cool</i>!"')
//                 this.add(text)

//     A more elaborate example would be:

//     .. manim:: MarkupElaborateExample
//         :saveLastFrame:

//         class MarkupElaborateExample(Scene) {
//             construct(this) {
//                 text = MarkupText(
//                     '<span foreground="purple">ا</span><span foreground="red">َ</span>'
//                     'ل<span foreground="blue">ْ</span>ع<span foreground="red">َ</span>ر'
//                     '<span foreground="red">َ</span>ب<span foreground="red">ِ</span>ي'
//                     '<span foreground="green">ّ</span><span foreground="red">َ</span>ة'
//                     '<span foreground="blue">ُ</span>'
//                 )
//                 this.add(text)

//     PangoMarkup can also contain XML features such as numeric character
//     entities such as ``&#169;`` for © can be used too.

//     The most general markup tag is ``<span>``, then there are some
//     convenience tags.

//     Here is a list of supported tags:

//     - ``<b>bold</b>``, ``<i>italic</i>`` and ``<b><i>bold+italic</i></b>``
//     - ``<ul>underline</ul>`` and ``<s>strike through</s>``
//     - ``<tt>typewriter font</tt>``
//     - ``<big>bigger font</big>`` and ``<small>smaller font</small>``
//     - ``<sup>superscript</sup>`` and ``<sub>subscript</sub>``
//     - ``<span underline="double" underlineColor="green">double underline</span>``
//     - ``<span underline="error">error underline</span>``
//     - ``<span overline="single" overlineColor="green">overline</span>``
//     - ``<span strikethrough="true" strikethroughColor="red">strikethrough</span>``
//     - ``<span fontFamily="sans">temporary change of font</span>``
//     - ``<span foreground="red">temporary change of color</span>``
//     - ``<span fgcolor="red">temporary change of color</span>``
//     - ``<gradient from="YELLOW" to="RED">temporary gradient</gradient>``

//     For ``<span>`` markup, colors can be specified either as
//     hex triples like ``#aabbcc`` or as named CSS colors like
//     ``AliceBlue``.
//     The ``<gradient>`` tag is handled by Manim rather than
//     Pango, and supports hex triplets or Manim constants like
//     ``RED`` or ``RED_A``.
//     If you want to use Manim constants like ``RED_A`` together
//     with ``<span>``, you will need to use Python's f-String
//     syntax as follows::

//         MarkupText(f'<span foreground="{RED_A}">here you go</span>')

//     If your text contains ligatures, the :class:`MarkupText` class may
//     incorrectly determine the first and last letter when creating the
//     gradient. This is due to the fact that ``fl`` are two separate characters,
//     but might be set as one single glyph - a ligature. If your language
//     does not depend on ligatures, consider setting ``disableLigatures``
//     to ``True``. If you must use ligatures, the ``gradient`` tag supports an optional
//     attribute ``offset`` which can be used to compensate for that error.

//     For example:

//     - ``<gradient from="RED" to="YELLOW" offset="1">example</gradient>`` to *start* the gradient one letter earlier
//     - ``<gradient from="RED" to="YELLOW" offset=",1">example</gradient>`` to *end* the gradient one letter earlier
//     - ``<gradient from="RED" to="YELLOW" offset="2,1">example</gradient>`` to *start* the gradient two letters earlier and *end* it one letter earlier

//     Specifying a second offset may be necessary if the text to be colored does
//     itself contain ligatures. The same can happen when using HTML entities for
//     special chars.

//     When using ``underline``, ``overline`` or ``strikethrough`` together with
//     ``<gradient>`` tags, you will also need to use the offset, because
//     underlines are additional paths in the final :class:`SVGMobject`.
//     Check out the following example.

//     Escaping of special characters: ``>`` **should** be written as ``&gt;``
//     whereas ``<`` and ``&`` *must* be written as ``&lt;`` and
//     ``&amp;``.

//     You can find more information about Pango markup formatting at the
//     corresponding documentation page:
//     `Pango Markup <https://developer.gnome.org/pango/stable/pango-Markup.html>`_.
//     Please be aware that not all features are supported by this class and that
//     the ``<gradient>`` tag mentioned above is not supported by Pango.

//     Parameters
//     ----------

//     text : :class:`str`
//         The text that need to created as mobject.
//     fillOpacity : :class:`int`
//         The fill opacity with 1 meaning opaque and 0 meaning transparent.
//     strokeWidth : :class:`int`
//         Stroke width.
//     fontSize : :class:`float`
//         Font size.
//     lineSpacing : :class:`int`
//         Line spacing.
//     font : :class:`str`
//         Global font setting for the entire text. Local overrides are possible.
//     slant : :class:`str`
//         Global slant setting, e.g. `NORMAL` or `ITALIC`. Local overrides are possible.
//     weight : :class:`str`
//         Global weight setting, e.g. `NORMAL` or `BOLD`. Local overrides are possible.
//     gradient: :class:`tuple`
//         Global gradient setting. Local overrides are possible.


//     Returns
//     -------
//     :class:`MarkupText`
//         The text displayed in form of a :class:`.VGroup`-like mobject.

//     Examples
//     ---------

//     .. manim:: BasicMarkupExample
//         :saveLastFrame:

//         class BasicMarkupExample(Scene) {
//             construct(this) {
//                 text1 = MarkupText("<b>foo</b> <i>bar</i> <b><i>foobar</i></b>")
//                 text2 = MarkupText("<s>foo</s> <u>bar</u> <big>big</big> <small>small</small>")
//                 text3 = MarkupText("H<sub>2</sub>O and H<sub>3</sub>O<sup>+</sup>")
//                 text4 = MarkupText("type <tt>help</tt> for help")
//                 text5 = MarkupText(
//                     '<span underline="double">foo</span> <span underline="error">bar</span>'
//                 )
//                 group = VGroup(text1, text2, text3, text4, text5).arrange(DOWN)
//                 this.add(group)

//     .. manim:: ColorExample
//         :saveLastFrame:

//         class ColorExample(Scene) {
//             construct(this) {
//                 text1 = MarkupText(
//                     f'all in red <span fgcolor="{YELLOW}">except this</span>', color=RED
//                 )
//                 text2 = MarkupText("nice gradient", gradient=(BLUE, GREEN))
//                 text3 = MarkupText(
//                     'nice <gradient from="RED" to="YELLOW">intermediate</gradient> gradient',
//                     gradient=(BLUE, GREEN),
//                 )
//                 text4 = MarkupText(
//                     'fl ligature <gradient from="RED" to="YELLOW">causing trouble</gradient> here'
//                 )
//                 text5 = MarkupText(
//                     'fl ligature <gradient from="RED" to="YELLOW" offset="1">defeated</gradient> with offset'
//                 )
//                 text6 = MarkupText(
//                     'fl ligature <gradient from="RED" to="YELLOW" offset="1">floating</gradient> inside'
//                 )
//                 text7 = MarkupText(
//                     'fl ligature <gradient from="RED" to="YELLOW" offset="1,1">floating</gradient> inside'
//                 )
//                 group = VGroup(text1, text2, text3, text4, text5, text6, text7).arrange(DOWN)
//                 this.add(group)

//     .. manim:: UnderlineExample
//         :saveLastFrame:

//         class UnderlineExample(Scene) {
//             construct(this) {
//                 text1 = MarkupText(
//                     '<span underline="double" underlineColor="green">bla</span>'
//                 )
//                 text2 = MarkupText(
//                     '<span underline="single" underlineColor="green">xxx</span><gradient from="#ffff00" to="RED">aabb</gradient>y'
//                 )
//                 text3 = MarkupText(
//                     '<span underline="single" underlineColor="green">xxx</span><gradient from="#ffff00" to="RED" offset="-1">aabb</gradient>y'
//                 )
//                 text4 = MarkupText(
//                     '<span underline="double" underlineColor="green">xxx</span><gradient from="#ffff00" to="RED">aabb</gradient>y'
//                 )
//                 text5 = MarkupText(
//                     '<span underline="double" underlineColor="green">xxx</span><gradient from="#ffff00" to="RED" offset="-2">aabb</gradient>y'
//                 )
//                 group = VGroup(text1, text2, text3, text4, text5).arrange(DOWN)
//                 this.add(group)

//     .. manim:: FontExample
//         :saveLastFrame:

//         class FontExample(Scene) {
//             construct(this) {
//                 text1 = MarkupText(
//                     'all in sans <span fontFamily="serif">except this</span>', font="sans"
//                 )
//                 text2 = MarkupText(
//                     '<span fontFamily="serif">mixing</span> <span fontFamily="sans">fonts</span> <span fontFamily="monospace">is ugly</span>'
//                 )
//                 text3 = MarkupText("special char > or &gt;")
//                 text4 = MarkupText("special char &lt; and &amp;")
//                 group = VGroup(text1, text2, text3, text4).arrange(DOWN)
//                 this.add(group)

//     .. manim:: NewlineExample
//         :saveLastFrame:

//         class NewlineExample(Scene) {
//             construct(this) {
//                 text = MarkupText('foooo<span foreground="red">oo\nbaa</span>aar')
//                 this.add(text)

//     .. manim:: NoLigaturesExample
//         :saveLastFrame:

//         class NoLigaturesExample(Scene) {
//             construct(this) {
//                 text1 = MarkupText('fl<gradient from="RED" to="GREEN">oat</gradient>ing')
//                 text2 = MarkupText('fl<gradient from="RED" to="GREEN">oat</gradient>ing', disableLigatures=True)
//                 group = VGroup(text1, text2).arrange(DOWN)
//                 this.add(group)


//     As :class:`MarkupText` uses Pango to render text, rendering non-English
//     characters is easily possible:

//     .. manim:: MultiLanguage
//         :saveLastFrame:

//         class MultiLanguage(Scene) {
//             construct(this) {
//                 morning = MarkupText("வணக்கம்", font="sans-serif")
//                 japanese = MarkupText(
//                     '<span fgcolor="blue">日本</span>へようこそ'
//                 )  # works as in ``Text``.
//                 mess = MarkupText("Multi-Language", weight=BOLD)
//                 russ = MarkupText("Здравствуйте मस नम म ", font="sans-serif")
//                 hin = MarkupText("नमस्ते", font="sans-serif")
//                 chinese = MarkupText("臂猿「黛比」帶著孩子", font="sans-serif")
//                 group = VGroup(morning, japanese, mess, russ, hin, chinese).arrange(DOWN)
//                 this.add(group)

//     You can justify the text by passing :attr:`justify` parameter.

//     .. manim:: JustifyText

//         class JustifyText(Scene) {
//             construct(this) {
//                 ipsumText = (
//                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
//                     "Praesent feugiat metus sit amet iaculis pulvinar. Nulla posuere "
//                     "quam a ex aliquam, eleifend consectetur tellus viverra. Aliquam "
//                     "fermentum interdum justo, nec rutrum elit pretium ac. Nam quis "
//                     "leo pulvinar, dignissim est at, venenatis nisi. Quisque mattis "
//                     "dolor ut euismod hendrerit. Nullam eu ante sollicitudin, commodo "
//                     "risus a, vehicula odio. Nam urna tortor, aliquam a nibh eu, commodo "
//                     "imperdiet arcu. Donec tincidunt commodo enim a tincidunt."
//                 )
//                 justifiedText = MarkupText(ipsumText, justify=True).scale(0.4)
//                 notJustifiedText = MarkupText(ipsumText, justify=False).scale(0.4)
//                 justTitle = Title("Justified")
//                 njustTitle = Title("Not Justified")
//                 this.add(njustTitle, notJustifiedText)
//                 this.play(
//                     Transform(
//                         notJustifiedText,
//                         justifiedText,
//                     ),
//                     Transform(
//                         njustTitle,
//                         justTitle,
//                     ),
//                     runTime=2,
//                 )
//                 this.wait(1)

//     Tests
//     -----

//     Check that the creation of :class:`~.MarkupText` works::

//         >>> MarkupText('The horse does not eat cucumber salad.')
//         MarkupText('The horse does not eat cucumber salad.')

//     """

//     _Init__(
//         this,
//         text: str,
//         fillOpacity: float = 1,
//         strokeWidth: float = 0,
//         color: Color | None = None,
//         fontSize: float = DEFAULT_FONT_SIZE,
//         lineSpacing: int = -1,
//         font: str = "",
//         slant: str = NORMAL,
//         weight: str = NORMAL,
//         justify: bool = False,
//         gradient: tuple = None,
//         tabWidth: int = 4,
//         height: int = None,
//         width: int = None,
//         shouldCenter: bool = True,
//         unpackGroups: bool = True,
//         disableLigatures: bool = False,
//         **kwargs,
//     ) {

//         this.text = text
//         this.lineSpacing = lineSpacing
//         this.font = font
//         this.FontSize = float(fontSize)
//         this.slant = slant
//         this.weight = weight
//         this.gradient = gradient
//         this.tabWidth = tabWidth
//         this.justify = justify

//         this.originalText = text
//         this.disableLigatures = disableLigatures
//         textWithoutTabs = text
//         if "\t" in text:
//             textWithoutTabs = text.replace("\t", " " * this.tabWidth)

//         colormap = this.ExtractColorTags()
//         if len(colormap) > 0:
//             logger.warning(
//                 'Using <color> tags in MarkupText is deprecated. Please use <span foreground="..."> instead.',
//             )
//         gradientmap = this.ExtractGradientTags()
//         validateError = MarkupUtils.validate(this.text)
//         if validateError:
//             raise ValueError(validateError)

//         if this.lineSpacing == -1:
//             this.lineSpacing = (
//                 this.FontSize + this.FontSize * DEFAULT_LINE_SPACING_SCALE
//             )
//         else:
//             this.lineSpacing = this.FontSize + this.FontSize * this.lineSpacing

//         color = Color(color) if color else VMobject().color
//         fileName = this.Text2svg(color)

//         PangoUtils.removeLast_M(fileName)
//         super()._Init__(
//             fileName,
//             fillOpacity=fillOpacity,
//             strokeWidth=strokeWidth,
//             height=height,
//             width=width,
//             shouldCenter=shouldCenter,
//             unpackGroups=unpackGroups,
//             **kwargs,
//         )

//         this.chars = this.getGroupClass()(*this.submobjects)
//         this.text = textWithoutTabs.replace(" ", "").replace("\n", "")

//         if config.renderer == "opengl":
//             nppc = this.nPointsPerCurve
//         else:
//             nppc = this.nPointsPerCubicCurve
//         for each in this:
//             if len(each.points) == 0:
//                 continue
//             points = each.points
//             last = points[0]
//             each.clearPoints()
//             for index, point in enumerate(points) {
//                 each.appendPoints([point])
//                 if (
//                     index != len(points) - 1
//                     and (index + 1) % nppc == 0
//                     and any(point != points[index + 1])
//                 ) {
//                     each.addLineTo(last)
//                     last = points[index + 1]
//             each.addLineTo(last)

//         if this.gradient:
//             this.setColorByGradient(*this.gradient)
//         for col in colormap:
//             this.chars[
//                 col["start"]
//                 - col["startOffset"] : col["end"]
//                 - col["startOffset"]
//                 - col["endOffset"]
//             ].setColor(this.ParseColor(col["color"]))
//         for grad in gradientmap:
//             this.chars[
//                 grad["start"]
//                 - grad["startOffset"] : grad["end"]
//                 - grad["startOffset"]
//                 - grad["endOffset"]
//             ].setColorByGradient(
//                 *(this.ParseColor(grad["from"]), this.ParseColor(grad["to"]))
//             )
//         # anti-aliasing
//         if height is None and width is None:
//             this.scale(TEXT_MOB_SCALE_FACTOR)

//         this.initialHeight = this.height

//     @property
//     fontSize(this) {
//         return (
//             this.height
//             / this.initialHeight
//             / TEXT_MOB_SCALE_FACTOR
//             * 2.4
//             * this.FontSize
//             / DEFAULT_FONT_SIZE
//         )

//     @fontSize.setter
//     fontSize(this, fontVal) {
//         # TODO: use pango's font size scaling.
//         if fontVal <= 0:
//             raise ValueError("fontSize must be greater than 0.")
//         else:
//             this.scale(fontVal / this.fontSize)

//     Text2hash(this, color: Color) {
//         """Generates ``sha256`` hash for file name."""
//         settings = (
//             "MARKUPPANGO" + this.font + this.slant + this.weight + color.hexL
//         )  # to differentiate from classical Pango Text
//         settings += str(this.lineSpacing) + str(this.FontSize)
//         settings += str(this.disableLigatures)
//         settings += str(this.justify)
//         idStr = this.text + settings
//         hasher = hashlib.sha256()
//         hasher.update(idStr.encode())
//         return hasher.hexdigest()[:16]

//     Text2svg(this, color: Color | None) {
//         """Convert the text to SVG using Pango."""
//         size = this.FontSize
//         lineSpacing = this.lineSpacing
//         size /= TEXT2SVG_ADJUSTMENT_FACTOR
//         lineSpacing /= TEXT2SVG_ADJUSTMENT_FACTOR

//         dirName = config.getDir("textDir")
//         if not os.path.exists(dirName) {
//             os.makedirs(dirName)
//         hashName = this.Text2hash(color)
//         fileName = os.path.join(dirName, hashName) + ".svg"
//         if os.path.exists(fileName) {
//             svgFile = fileName
//         else:
//             finalText = (
//                 f'<span foreground="{color}">{this.text}</span>'
//                 if color is not None
//                 else this.text
//             )
//             logger.debug(f"Setting Text {this.text}")
//             svgFile = MarkupUtils.text2svg(
//                 finalText,
//                 this.font,
//                 this.slant,
//                 this.weight,
//                 size,
//                 lineSpacing,
//                 this.disableLigatures,
//                 fileName,
//                 START_X,
//                 START_Y,
//                 600,  # width
//                 400,  # height
//                 justify=this.justify,
//                 pangoWidth=500,
//             )
//         return svgFile

//     CountRealChars(this, s) {
//         """Counts characters that will be displayed.

//         This is needed for partial coloring or gradients, because space
//         counts to the text's `len`, but has no corresponding character."""
//         count = 0
//         level = 0
//         # temporarily replace HTML entities by single char
//         s = re.sub("&[^;]+;", "x", s)
//         for c in s:
//             if c == "<":
//                 level += 1
//             if c == ">" and level > 0:
//                 level -= 1
//             elif c != " " and c != "\t" and level == 0:
//                 count += 1
//         return count

//     ExtractGradientTags(this) {
//         """Used to determine which parts (if any) of the string should be formatted
//         with a gradient.

//         Removes the ``<gradient>`` tag, as it is not part of Pango's markup and would cause an error.
//         """
//         tags = re.finditer(
//             r'<gradient\s+from="([^"]+)"\s+to="([^"]+)"(\s+offset="([^"]+)")?>(.+?)</gradient>',
//             this.originalText,
//             re.S,
//         )
//         gradientmap = []
//         for tag in tags:
//             start = this.CountRealChars(this.originalText[: tag.start(0)])
//             end = start + this.CountRealChars(tag.group(5))
//             offsets = tag.group(4).split(",") if tag.group(4) else [0]
//             startOffset = int(offsets[0]) if offsets[0] else 0
//             endOffset = int(offsets[1]) if len(offsets) == 2 and offsets[1] else 0

//             gradientmap.append(
//                 {
//                     "start": start,
//                     "end": end,
//                     "from": tag.group(1),
//                     "to": tag.group(2),
//                     "startOffset": startOffset,
//                     "endOffset": endOffset,
//                 },
//             )
//         this.text = re.sub("<gradient[^>]+>(.+?)</gradient>", r"\1", this.text, 0, re.S)
//         return gradientmap

//     ParseColor(this, col) {
//         """Parse color given in ``<color>`` or ``<gradient>`` tags."""
//         if re.match("#[0-9a-f]{6}", col) {
//             return col
//         else:
//             return Colors[col.lower()].value

//     ExtractColorTags(this) {
//         """Used to determine which parts (if any) of the string should be formatted
//         with a custom color.

//         Removes the ``<color>`` tag, as it is not part of Pango's markup and would cause an error.

//         Note: Using the ``<color>`` tags is deprecated. As soon as the legacy syntax is gone, this function
//         will be removed.
//         """
//         tags = re.finditer(
//             r'<color\s+col="([^"]+)"(\s+offset="([^"]+)")?>(.+?)</color>',
//             this.originalText,
//             re.S,
//         )

//         colormap = []
//         for tag in tags:
//             start = this.CountRealChars(this.originalText[: tag.start(0)])
//             end = start + this.CountRealChars(tag.group(4))
//             offsets = tag.group(3).split(",") if tag.group(3) else [0]
//             startOffset = int(offsets[0]) if offsets[0] else 0
//             endOffset = int(offsets[1]) if len(offsets) == 2 and offsets[1] else 0

//             colormap.append(
//                 {
//                     "start": start,
//                     "end": end,
//                     "color": tag.group(1),
//                     "startOffset": startOffset,
//                     "endOffset": endOffset,
//                 },
//             )
//         this.text = re.sub("<color[^>]+>(.+?)</color>", r"\1", this.text, 0, re.S)
//         return colormap

//     _Repr__(this) {
//         return f"MarkupText({repr(this.originalText)})"


// @contextmanager
// registerFont(fontFile: str | Path) {
//     """Temporarily add a font file to Pango's search path.

//     This searches for the fontFile at various places. The order it searches it described below.

//     1. Absolute path.
//     2. In ``assets/fonts`` folder.
//     3. In ``font/`` folder.
//     4. In the same directory.

//     Parameters
//     ----------
//     fontFile :
//         The font file to add.

//     Examples
//     --------
//     Use ``with registerFont(...)`` to add a font file to search
//     path.

//     .. code-block:: python

//         with registerFont("path/to/fontFile.ttf") {
//             a = Text("Hello", font="Custom Font Name")

//     Raises
//     ------
//     FileNotFoundError:
//         If the font doesn't exists.

//     AttributeError:
//         If this method is used on macOS.

//     .. important ::

//         This method is available for macOS for ``ManimPango>=v0.2.3``. Using this
//         method with previous releases will raise an :class:`AttributeError` on macOS.
//     """

//     inputFolder = Path(config.inputFile).parent.resolve()
//     possiblePaths = [
//         Path(fontFile),
//         inputFolder / "assets/fonts" / fontFile,
//         inputFolder / "fonts" / fontFile,
//         inputFolder / fontFile,
//     ]
//     for path in possiblePaths:
//         path = path.resolve()
//         if path.exists() {
//             filePath = path
//             logger.debug("Found file at %s", filePath.absolute())
//             break
//     else:
//         error = f"Can't find {fontFile}." f"Tried these : {possiblePaths}"
//         raise FileNotFoundError(error)

//     try:
//         assert manimpango.registerFont(str(filePath))
//         yield
//     finally:
//         manimpango.unregisterFont(str(filePath))
