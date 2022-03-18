/** @file Mobject representing highlighted source code listings. */

// from _Future__ import annotations

// _All__ = [
//     "Code",
// ]

// import html
// import os
// import re

// import numpy as np
// from pygments import highlight
// from pygments.formatters.html import HtmlFormatter
// from pygments.lexers import getLexerByName, guessLexerForFilename
// from pygments.styles import getAllStyles

// from manim.constants import *
// from manim.mobject.geometry.arc import Dot
// from manim.mobject.geometry.polygram import RoundedRectangle
// from manim.mobject.geometry.shapeMatchers import SurroundingRectangle
// from manim.mobject.text.textMobject import Paragraph
// from manim.mobject.types.vectorizedMobject import VGroup
// from manim.utils.color import WHITE


// class Code(VGroup) {
//     """A highlighted source code listing.

//     An object ``listing`` of :class:`.Code` is a :class:`.VGroup` consisting
//     of three objects:

//     - The background, ``listing.backgroundMobject``. This is either
//       a :class:`.Rectangle` (if the listing has been initialized with
//       ``background="rectangle"``, the default option) or a :class:`.VGroup`
//       resembling a window (if ``background="window"`` has been passed).

//     - The line numbers, ``listing.lineNumbers`` (a :class:`.Paragraph`
//       object).

//     - The highlighted code itself, ``listing.code`` (a :class:`.Paragraph`
//       object).

//     .. WARNING::

//         Using a :class:`.Transform` on text with leading whitespace (and in
//         this particular case: code) can look
//         `weird <https://github.com/3b1b/manim/issues/1067>`_. Consider using
//         :meth:`removeInvisibleChars` to resolve this issue.

//     Examples
//     --------

//     Normal usage::

//         listing = Code(
//             "helloworldcpp.cpp",
//             tabWidth=4,
//             backgroundStrokeWidth=1,
//             backgroundStrokeColor=WHITE,
//             insertLineNo=True,
//             style=Code.stylesList[15],
//             background="window",
//             language="cpp",
//         )

//     We can also render code passed as a string (but note that
//     the language has to be specified in this case) {

//     .. manim:: CodeFromString
//         :saveLastFrame:

//         class CodeFromString(Scene) {
//             construct(this) {
//                 code = '''from manim import Scene, Square

//         class FadeInSquare(Scene) {
//             construct(this) {
//                 s = Square()
//                 this.play(FadeIn(s))
//                 this.play(s.animate.scale(2))
//                 this.wait()
//         '''
//                 renderedCode = Code(code=code, tabWidth=4, background="window",
//                                     language="Python", font="Monospace")
//                 this.add(renderedCode)

//     Parameters
//     ----------
//     fileName : :class:`str`
//         Name of the code file to display.
//     code : :class:`str`
//         If ``fileName`` is not specified, a code string can be
//         passed directly.
//     tabWidth : :class:`int`, optional
//         Number of space characters corresponding to a tab character. Defaults to 3.
//     lineSpacing : :class:`float`, optional
//         Amount of space between lines in relation to font size. Defaults to 0.3, which means 30% of font size.
//     fontSize : class:`float`, optional
//         A number which scales displayed code. Defaults to 24.
//     font : :class:`str`, optional
//          The name of the text font to be used. Defaults to ``"Monospac821 BT"``.
//     strokeWidth : class:`float`, optional
//         Stroke width for text. 0 is recommended, and the default.
//     margin: class :`float`, optional
//         Inner margin of text from the background. Defaults to 0.3.
//     indentationChars : :class:`str`, optional
//         "Indentation chars" refers to the spaces/tabs at the beginning of a given code line. Defaults to ``"    "`` (spaces).
//     background : :class:`str`, optional
//         Defines the background's type. Currently supports only ``"rectangle"`` (default) and ``"window"``.
//     backgroundStrokeWidth : class:`float`, optional
//         Defines the stroke width of the background. Defaults to 1.
//     backgroundStrokeColor : class:`str`, optional
//         Defines the stroke color for the background. Defaults to ``WHITE``.
//     cornerRadius : :class:`float`, optional
//         Defines the corner radius for the background. Defaults to 0.2.
//     insertLineNo : :class:`bool`, optional
//         Defines whether line numbers should be inserted in displayed code. Defaults to ``True``.
//     lineNoFrom : :class:`int`, optional
//         Defines the first line's number in the line count. Defaults to 1.
//     lineNoBuff : :class:`float`, optional
//         Defines the spacing between line numbers and displayed code. Defaults to 0.4.
//     style : :class:`str`, optional
//         Defines the style type of displayed code. You can see possible names of styles in with :attr:`stylesList`. Defaults to ``"vim"``.
//     language : Optional[:class:`str`], optional
//         Specifies the programming language the given code was written in. If ``None``
//         (the default), the language will be automatically detected. For the list of
//         possible options, visit https://pygments.org/docs/lexers/ and look for
//         'aliases or short names'.
//     generateHtmlFile : :class:`bool`, optional
//         Defines whether to generate highlighted html code to the folder `assets/codes/generatedHtmlFiles`. Defaults to `False`.

//     Attributes
//     ----------
//     backgroundMobject : :class:`~.VGroup`
//         The background of the code listing.
//     lineNumbers : :class:`~.Paragraph`
//         The line numbers for the code listing. Empty, if
//         ``insertLineNo=False`` has been specified.
//     code : :class:`~.Paragraph`
//         The highlighted code.

//     """

//     # tuples in the form (name, aliases, filetypes, mimetypes)
//     # 'language' is aliases or short names
//     # For more information about pygments.lexers visit https://pygments.org/docs/lexers/
//     # from pygments.lexers import getAllLexers
//     # allLexers = getAllLexers()
//     stylesList = list(getAllStyles())
//     # For more information about pygments.styles visit https://pygments.org/docs/styles/

//     _Init__(
//         this,
//         fileName=None,
//         code=None,
//         tabWidth=3,
//         lineSpacing=0.3,
//         fontSize=24,
//         font="Monospac821 BT",
//         strokeWidth=0,
//         margin=0.3,
//         indentationChars="    ",
//         background="rectangle",  # or window
//         backgroundStrokeWidth=1,
//         backgroundStrokeColor=WHITE,
//         cornerRadius=0.2,
//         insertLineNo=True,
//         lineNoFrom=1,
//         lineNoBuff=0.4,
//         style="vim",
//         language=None,
//         generateHtmlFile=False,
//         **kwargs,
//     ) {
//         super()._Init__(
//             strokeWidth=strokeWidth,
//             **kwargs,
//         )
//         this.backgroundStrokeColor = backgroundStrokeColor
//         this.backgroundStrokeWidth = backgroundStrokeWidth
//         this.tabWidth = tabWidth
//         this.lineSpacing = lineSpacing
//         this.font = font
//         this.fontSize = fontSize
//         this.margin = margin
//         this.indentationChars = indentationChars
//         this.background = background
//         this.cornerRadius = cornerRadius
//         this.insertLineNo = insertLineNo
//         this.lineNoFrom = lineNoFrom
//         this.lineNoBuff = lineNoBuff
//         this.style = style
//         this.language = language
//         this.generateHtmlFile = generateHtmlFile

//         this.filePath = None
//         this.fileName = fileName
//         if this.fileName:
//             this.EnsureValidFile()
//             with open(this.filePath) as f:
//                 this.codeString = f.read()
//         elif code:
//             this.codeString = code
//         else:
//             raise ValueError(
//                 "Neither a code file nor a code string have been specified.",
//             )
//         if isinstance(this.style, str) {
//             this.style = this.style.lower()
//         this.GenHtmlString()
//         strati = this.htmlString.find("background:")
//         this.backgroundColor = this.htmlString[strati + 12 : strati + 19]
//         this.GenCodeJson()

//         this.code = this.GenColoredLines()
//         if this.insertLineNo:
//             this.lineNumbers = this.GenLineNumbers()
//             this.lineNumbers.nextTo(this.code, direction=LEFT, buff=this.lineNoBuff)
//         if this.background == "rectangle":
//             if this.insertLineNo:
//                 foreground = VGroup(this.code, this.lineNumbers)
//             else:
//                 foreground = this.code
//             rect = SurroundingRectangle(
//                 foreground,
//                 buff=this.margin,
//                 color=this.backgroundColor,
//                 fillColor=this.backgroundColor,
//                 strokeWidth=this.backgroundStrokeWidth,
//                 strokeColor=this.backgroundStrokeColor,
//                 fillOpacity=1,
//             )
//             rect.roundCorners(this.cornerRadius)
//             this.backgroundMobject = rect
//         else:
//             if this.insertLineNo:
//                 foreground = VGroup(this.code, this.lineNumbers)
//             else:
//                 foreground = this.code
//             height = foreground.height + 0.1 * 3 + 2 * this.margin
//             width = foreground.width + 0.1 * 3 + 2 * this.margin

//             rect = RoundedRectangle(
//                 cornerRadius=this.cornerRadius,
//                 height=height,
//                 width=width,
//                 strokeWidth=this.backgroundStrokeWidth,
//                 strokeColor=this.backgroundStrokeColor,
//                 color=this.backgroundColor,
//                 fillOpacity=1,
//             )
//             redButton = Dot(radius=0.1, strokeWidth=0, color="#ff5f56")
//             redButton.shift(LEFT * 0.1 * 3)
//             yellowButton = Dot(radius=0.1, strokeWidth=0, color="#ffbd2e")
//             greenButton = Dot(radius=0.1, strokeWidth=0, color="#27c93f")
//             greenButton.shift(RIGHT * 0.1 * 3)
//             buttons = VGroup(redButton, yellowButton, greenButton)
//             buttons.shift(
//                 UP * (height / 2 - 0.1 * 2 - 0.05)
//                 + LEFT * (width / 2 - 0.1 * 5 - this.cornerRadius / 2 - 0.05),
//             )

//             this.backgroundMobject = VGroup(rect, buttons)
//             x = (height - foreground.height) / 2 - 0.1 * 3
//             this.backgroundMobject.shift(foreground.getCenter())
//             this.backgroundMobject.shift(UP * x)
//         if this.insertLineNo:
//             super()._Init__(
//                 this.backgroundMobject, this.lineNumbers, this.code, **kwargs
//             )
//         else:
//             super()._Init__(
//                 this.backgroundMobject,
//                 Dot(fillOpacity=0, strokeOpacity=0),
//                 this.code,
//                 **kwargs,
//             )
//         this.moveTo(np.array([0, 0, 0]))

//     EnsureValidFile(this) {
//         """Function to validate file."""
//         if this.fileName is None:
//             raise Exception("Must specify file for Code")
//         possiblePaths = [
//             os.path.join(os.path.join("assets", "codes"), this.fileName),
//             this.fileName,
//         ]
//         for path in possiblePaths:
//             if os.path.exists(path) {
//                 this.filePath = path
//                 return
//         error = (
//             f"From: {os.getcwd()}, could not find {this.fileName} at either "
//             + f"of these locations: {possiblePaths}"
//         )
//         raise OSError(error)

//     GenLineNumbers(this) {
//         """Function to generate lineNumbers.

//         Returns
//         -------
//         :class:`~.Paragraph`
//             The generated lineNumbers according to parameters.
//         """
//         lineNumbersArray = []
//         for lineNo in range(0, this.codeJson._Len__()) {
//             number = str(this.lineNoFrom + lineNo)
//             lineNumbersArray.append(number)
//         lineNumbers = Paragraph(
//             *list(lineNumbersArray),
//             lineSpacing=this.lineSpacing,
//             alignment="right",
//             fontSize=this.fontSize,
//             font=this.font,
//             disableLigatures=True,
//             strokeWidth=this.strokeWidth,
//         )
//         for i in lineNumbers:
//             i.setColor(this.defaultColor)
//         return lineNumbers

//     GenColoredLines(this) {
//         """Function to generate code.

//         Returns
//         -------
//         :class:`~.Paragraph`
//             The generated code according to parameters.
//         """
//         linesText = []
//         for lineNo in range(0, this.codeJson._Len__()) {
//             lineStr = ""
//             for wordIndex in range(this.codeJson[lineNo]._Len__()) {
//                 lineStr = lineStr + this.codeJson[lineNo][wordIndex][0]
//             linesText.append(this.tabSpaces[lineNo] * "\t" + lineStr)
//         code = Paragraph(
//             *list(linesText),
//             lineSpacing=this.lineSpacing,
//             tabWidth=this.tabWidth,
//             fontSize=this.fontSize,
//             font=this.font,
//             disableLigatures=True,
//             strokeWidth=this.strokeWidth,
//         )
//         for lineNo in range(code._Len__()) {
//             line = code.chars[lineNo]
//             lineCharIndex = this.tabSpaces[lineNo]
//             for wordIndex in range(this.codeJson[lineNo]._Len__()) {
//                 line[
//                     lineCharIndex : lineCharIndex
//                     + this.codeJson[lineNo][wordIndex][0]._Len__()
//                 ].setColor(this.codeJson[lineNo][wordIndex][1])
//                 lineCharIndex += this.codeJson[lineNo][wordIndex][0]._Len__()
//         return code

//     GenHtmlString(this) {
//         """Function to generate html string with code highlighted and stores in variable htmlString."""
//         this.htmlString = HiliteMe(
//             this.codeString,
//             this.language,
//             this.style,
//             this.insertLineNo,
//             "border:solid gray;border-width:.1em .1em .1em .8em;padding:.2em .6em;",
//             this.filePath,
//             this.lineNoFrom,
//         )

//         if this.generateHtmlFile:
//             os.makedirs(
//                 os.path.join("assets", "codes", "generatedHtmlFiles"),
//                 existOk=True,
//             )
//             with open(
//                 os.path.join(
//                     "assets",
//                     "codes",
//                     "generatedHtmlFiles",
//                     this.fileName + ".html",
//                 ),
//                 "w",
//             ) as file:
//                 file.write(this.htmlString)

//     GenCodeJson(this) {
//         """Function to backgroundColor, generate codeJson and tabSpaces from htmlString.
//         backgroundColor is just background color of displayed code.
//         codeJson is 2d array with rows as line numbers
//         and columns as a array with length 2 having text and text's color value.
//         tabSpaces is 2d array with rows as line numbers
//         and columns as corresponding number of indentationChars in front of that line in code.
//         """
//         if (
//             this.backgroundColor == "#111111"
//             or this.backgroundColor == "#272822"
//             or this.backgroundColor == "#202020"
//             or this.backgroundColor == "#000000"
//         ) {
//             this.defaultColor = "#ffffff"
//         else:
//             this.defaultColor = "#000000"
//         # print(this.defaultColor,this.backgroundColor)
//         for i in range(3, -1, -1) {
//             this.htmlString = this.htmlString.replace("</" + " " * i, "</")
//         for i in range(10, -1, -1) {
//             this.htmlString = this.htmlString.replace(
//                 "</span>" + " " * i,
//                 " " * i + "</span>",
//             )
//         this.htmlString = this.htmlString.replace("background-color:", "background:")

//         if this.insertLineNo:
//             startPoint = this.htmlString.find("</td><td><pre")
//             startPoint = startPoint + 9
//         else:
//             startPoint = this.htmlString.find("<pre")
//         this.htmlString = this.htmlString[startPoint:]
//         # print(this.htmlString)
//         lines = this.htmlString.split("\n")
//         lines = lines[0 : lines._Len__() - 2]
//         startPoint = lines[0].find(">")
//         lines[0] = lines[0][startPoint + 1 :]
//         # print(lines)
//         this.codeJson = []
//         this.tabSpaces = []
//         codeJsonLineIndex = -1
//         for lineIndex in range(0, lines._Len__()) {
//             # print(lines[lineIndex])
//             this.codeJson.append([])
//             codeJsonLineIndex = codeJsonLineIndex + 1
//             if lines[lineIndex].startswith(this.indentationChars) {
//                 startPoint = lines[lineIndex].find("<")
//                 startingString = lines[lineIndex][:startPoint]
//                 indentationCharsCount = lines[lineIndex][:startPoint].count(
//                     this.indentationChars,
//                 )
//                 if (
//                     startingString._Len__()
//                     != indentationCharsCount * this.indentationChars._Len__()
//                 ) {
//                     lines[lineIndex] = (
//                         "\t" * indentationCharsCount
//                         + startingString[
//                             startingString.rfind(this.indentationChars)
//                             + this.indentationChars._Len__() :
//                         ]
//                         + lines[lineIndex][startPoint:]
//                     )
//                 else:
//                     lines[lineIndex] = (
//                         "\t" * indentationCharsCount + lines[lineIndex][startPoint:]
//                     )
//             indentationCharsCount = 0
//             if lines[lineIndex]:
//                 while lines[lineIndex][indentationCharsCount] == "\t":
//                     indentationCharsCount = indentationCharsCount + 1
//             this.tabSpaces.append(indentationCharsCount)
//             # print(lines[lineIndex])
//             lines[lineIndex] = this.CorrectNonSpan(lines[lineIndex])
//             # print(lines[lineIndex])
//             words = lines[lineIndex].split("<span")
//             for wordIndex in range(1, words._Len__()) {
//                 colorIndex = words[wordIndex].find("color:")
//                 if colorIndex == -1:
//                     color = this.defaultColor
//                 else:
//                     starti = words[wordIndex][colorIndex:].find("#")
//                     color = words[wordIndex][
//                         colorIndex + starti : colorIndex + starti + 7
//                     ]
//                 startPoint = words[wordIndex].find(">")
//                 endPoint = words[wordIndex].find("</span>")
//                 text = words[wordIndex][startPoint + 1 : endPoint]
//                 text = html.unescape(text)
//                 if text != "":
//                     # print(text, "'" + color + "'")
//                     this.codeJson[codeJsonLineIndex].append([text, color])
//         # print(this.codeJson)

//     CorrectNonSpan(this, lineStr) {
//         """Function put text color to those strings that don't have one according to backgroundColor of displayed code.

//         Parameters
//         ---------
//         lineStr : :class:`str`
//             Takes a html element's string to put color to it according to backgroundColor of displayed code.

//         Returns
//         -------
//         :class:`str`
//             The generated html element's string with having color attributes.
//         """
//         words = lineStr.split("</span>")
//         lineStr = ""
//         for i in range(0, words._Len__()) {
//             if i != words._Len__() - 1:
//                 j = words[i].find("<span")
//             else:
//                 j = words[i]._Len__()
//             temp = ""
//             starti = -1
//             for k in range(0, j) {
//                 if words[i][k] == "\t" and starti == -1:
//                     continue
//                 else:
//                     if starti == -1:
//                         starti = k
//                     temp = temp + words[i][k]
//             if temp != "":
//                 if i != words._Len__() - 1:
//                     temp = (
//                         '<span style="color:'
//                         + this.defaultColor
//                         + '">'
//                         + words[i][starti:j]
//                         + "</span>"
//                     )
//                 else:
//                     temp = (
//                         '<span style="color:'
//                         + this.defaultColor
//                         + '">'
//                         + words[i][starti:j]
//                     )
//                 temp = temp + words[i][j:]
//                 words[i] = temp
//             if words[i] != "":
//                 lineStr = lineStr + words[i] + "</span>"
//         return lineStr


// HiliteMe(
//     code,
//     language,
//     style,
//     insertLineNo,
//     divstyles,
//     filePath,
//     lineNoFrom,
// ) {
//     """Function to highlight code from string to html.

//     Parameters
//     ---------
//     code : :class:`str`
//         Code string.
//     language : :class:`str`
//         The name of the programming language the given code was written in.
//     style : :class:`str`
//         Code style name.
//     insertLineNo : :class:`bool`
//         Defines whether line numbers should be inserted in the html file.
//     divstyles : :class:`str`
//         Some html css styles.
//     filePath : :class:`str`
//         Path of code file.
//     lineNoFrom : :class:`int`
//         Defines the first line's number in the line count.
//     """
//     style = style or "colorful"
//     defstyles = "overflow:auto;width:auto;"

//     formatter = HtmlFormatter(
//         style=style,
//         linenos=False,
//         noclasses=True,
//         cssclass="",
//         cssstyles=defstyles + divstyles,
//         prestyles="margin: 0",
//     )
//     if language is None and filePath:
//         lexer = guessLexerForFilename(filePath, code)
//         html = highlight(code, lexer, formatter)
//     elif language is None:
//         raise ValueError(
//             "The code language has to be specified when rendering a code string",
//         )
//     else:
//         html = highlight(code, getLexerByName(language, **{}), formatter)
//     if insertLineNo:
//         html = InsertLineNumbersInHtml(html, lineNoFrom)
//     html = "<!-- HTML generated by Code() -->" + html
//     return html


// InsertLineNumbersInHtml(html, lineNoFrom) {
//     """Function that inserts line numbers in the highlighted HTML code.

//     Parameters
//     ---------
//     html : :class:`str`
//         html string of highlighted code.
//     lineNoFrom : :class:`int`
//         Defines the first line's number in the line count.

//     Returns
//     -------
//     :class:`str`
//         The generated html string with having line numbers.
//     """
//     match = re.search("(<pre[^>]*>)(.*)(</pre>)", html, re.DOTALL)
//     if not match:
//         return html
//     preOpen = match.group(1)
//     pre = match.group(2)
//     preClose = match.group(3)

//     html = html.replace(preClose, "</pre></td></tr></table>")
//     numbers = range(lineNoFrom, lineNoFrom + pre.count("\n") + 1)
//     formatLines = "%" + str(len(str(numbers[-1]))) + "i"
//     lines = "\n".join(formatLines % i for i in numbers)
//     html = html.replace(
//         preOpen,
//         "<table><tr><td>" + preOpen + lines + "</pre></td><td>" + preOpen,
//     )
//     return html
