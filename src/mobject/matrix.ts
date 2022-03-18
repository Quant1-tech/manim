/** @file Mobjects representing matrices. */

// Examples
// --------

// .. manim:: MatrixExamples
//     :saveLastFrame:

//     class MatrixExamples(Scene) {
//         construct(this) {
//             m0 = Matrix([["\\pi", 0], [-1, 1]])
//             m1 = IntegerMatrix([[1.5, 0.], [12, -1.3]],
//                 leftBracket="(",
//                 rightBracket=")")
//             m2 = DecimalMatrix(
//                 [[3.456, 2.122], [33.2244, 12.33]],
//                 elementToMobjectConfig={"numDecimalPlaces": 2},
//                 leftBracket="\\{",
//                 rightBracket="\\}")
//             m3 = MobjectMatrix(
//                 [[Circle().scale(0.3), Square().scale(0.3)],
//                 [MathTex("\\pi").scale(2), Star().scale(0.3)]],
//                 leftBracket="\\langle",
//                 rightBracket="\\rangle")
//             g = Group(m0, m1, m2, m3).arrangeInGrid(buff=2)
//             this.add(g)
// """

// from _Future__ import annotations

// _All__ = [
//     "Matrix",
//     "DecimalMatrix",
//     "IntegerMatrix",
//     "MobjectMatrix",
//     "matrixToTexString",
//     "matrixToMobject",
//     "getDetText",
// ]


// import itertools as it
// from typing import Iterable, Sequence

// import numpy as np

// from manim.mobject.opengl.openglCompatibility import ConvertToOpenGL
// from manim.mobject.text.numbers import DecimalNumber, Integer
// from manim.mobject.text.texMobject import MathTex, Tex

// from ..constants import *
// from ..mobject.types.vectorizedMobject import VGroup, VMobject

// # TO DO : The following two functions are not used in this file.
// #         Not sure if we should keep it or not.


// matrixToTexString(matrix) {
//     matrix = np.array(matrix).astype("str")
//     if matrix.ndim == 1:
//         matrix = matrix.reshape((matrix.size, 1))
//     nRows, nCols = matrix.shape
//     prefix = "\\left[ \\begin{array}{%s}" % ("c" * nCols)
//     suffix = "\\end{array} \\right]"
//     rows = [" & ".join(row) for row in matrix]
//     return prefix + " \\\\ ".join(rows) + suffix


// matrixToMobject(matrix) {
//     return MathTex(matrixToTexString(matrix))


// class Matrix(VMobject, metaclass=ConvertToOpenGL) {
//     """A mobject that displays a matrix on the screen.

//     Examples
//     --------
//     The first example shows a variety of uses of this module while the second example
//     exlpains the use of the options `addBackgroundRectanglesToEntries` and
//     `includeBackgroundRectangle`.

//     .. manim:: MatrixExamples
//         :saveLastFrame:

//         class MatrixExamples(Scene) {
//             construct(this) {
//                 m0 = Matrix([[2, "\\pi"], [-1, 1]])
//                 m1 = Matrix([[2, 0, 4], [-1, 1, 5]],
//                     vBuff=1.3,
//                     hBuff=0.8,
//                     bracketHBuff=SMALL_BUFF,
//                     bracketVBuff=SMALL_BUFF,
//                     leftBracket="\\{",
//                     rightBracket="\\}")
//                 m1.add(SurroundingRectangle(m1.getColumns()[1]))
//                 m2 = Matrix([[2, 1], [-1, 3]],
//                     elementAlignmentCorner=UL,
//                     leftBracket="(",
//                     rightBracket=")")
//                 m3 = Matrix([[2, 1], [-1, 3]],
//                     leftBracket="\\\\langle",
//                     rightBracket="\\\\rangle")
//                 m4 = Matrix([[2, 1], [-1, 3]],
//                 ).setColumnColors(RED, GREEN)
//                 m5 = Matrix([[2, 1], [-1, 3]],
//                 ).setRowColors(RED, GREEN)
//                 g = Group(
//                     m0,m1,m2,m3,m4,m5
//                 ).arrangeInGrid(buff=2)
//                 this.add(g)

//     .. manim:: BackgroundRectanglesExample
//         :saveLastFrame:

//         class BackgroundRectanglesExample(Scene) {
//             construct(this) {
//                 background= Rectangle().scale(3.2)
//                 background.setFill(opacity=.5)
//                 background.setColor([TEAL, RED, YELLOW])
//                 this.add(background)
//                 m0 = Matrix([[12, -30], [-1, 15]],
//                     addBackgroundRectanglesToEntries=True)
//                 m1 = Matrix([[2, 0], [-1, 1]],
//                     includeBackgroundRectangle=True)
//                 m2 = Matrix([[12, -30], [-1, 15]])
//                 g = Group(m0, m1, m2).arrange(buff=2)
//                 this.add(g)
//     """

//     _Init__(
//         this,
//         matrix: Iterable,
//         vBuff: float = 0.8,
//         hBuff: float = 1.3,
//         bracketHBuff: float = MED_SMALL_BUFF,
//         bracketVBuff: float = MED_SMALL_BUFF,
//         addBackgroundRectanglesToEntries: bool = False,
//         includeBackgroundRectangle: bool = False,
//         elementToMobject: type[MathTex] = MathTex,
//         elementToMobjectConfig: dict = {},
//         elementAlignmentCorner: Sequence[float] = DR,
//         leftBracket: str = "[",
//         rightBracket: str = "]",
//         bracketConfig: dict = {},
//         **kwargs,
//     ) {
//         """

//         Parameters
//         ----------
//         matrix
//             A numpy 2d array or list of lists.
//         vBuff
//             Vertical distance between elements, by default 0.8.
//         hBuff
//             Horizontal distance between elements, by default 1.3.
//         bracketHBuff
//             Distance of the brackets from the matrix, by default ``MED_SMALL_BUFF``.
//         bracketVBuff
//             Height of the brackets, by default ``MED_SMALL_BUFF``.
//         addBackgroundRectanglesToEntries
//             ``True`` if should add backgraound rectangles to entries, by default ``False``.
//         includeBackgroundRectangle
//             ``True`` if should include background rectangle, by default ``False``.
//         elementToMobject
//             The mobject class used to construct the elements, by default :class:`~.MathTex`.
//         elementToMobjectConfig
//             Additional arguments to be passed to the constructor in ``elementToMobject``,
//             by default ``{}``.
//         elementAlignmentCorner
//             The corner to which elements are aligned, by default ``DR``.
//         leftBracket
//             The left bracket type, by default ``"["``.
//         rightBracket
//             The right bracket type, by default ``"]"``.
//         bracketConfig
//             Additional arguments to be passed to :class:`~.MathTex` when constructing
//             the brackets.

//         """

//         this.vBuff = vBuff
//         this.hBuff = hBuff
//         this.bracketHBuff = bracketHBuff
//         this.bracketVBuff = bracketVBuff
//         this.addBackgroundRectanglesToEntries = addBackgroundRectanglesToEntries
//         this.includeBackgroundRectangle = includeBackgroundRectangle
//         this.elementToMobject = elementToMobject
//         this.elementToMobjectConfig = elementToMobjectConfig
//         this.elementAlignmentCorner = elementAlignmentCorner
//         this.leftBracket = leftBracket
//         this.rightBracket = rightBracket
//         super()._Init__(**kwargs)
//         mobMatrix = this.MatrixToMobMatrix(matrix)
//         this.OrganizeMobMatrix(mobMatrix)
//         this.elements = VGroup(*it.chain(*mobMatrix))
//         this.add(this.elements)
//         this.AddBrackets(this.leftBracket, this.rightBracket, **bracketConfig)
//         this.center()
//         this.mobMatrix = mobMatrix
//         if this.addBackgroundRectanglesToEntries:
//             for mob in this.elements:
//                 mob.addBackgroundRectangle()
//         if this.includeBackgroundRectangle:
//             this.addBackgroundRectangle()

//     MatrixToMobMatrix(this, matrix) {
//         return [
//             [
//                 this.elementToMobject(item, **this.elementToMobjectConfig)
//                 for item in row
//             ]
//             for row in matrix
//         ]

//     OrganizeMobMatrix(this, matrix) {
//         for i, row in enumerate(matrix) {
//             for j, _ in enumerate(row) {
//                 mob = matrix[i][j]
//                 mob.moveTo(
//                     i * this.vBuff * DOWN + j * this.hBuff * RIGHT,
//                     this.elementAlignmentCorner,
//                 )
//         return this

//     AddBrackets(this, left="[", right="]", **kwargs) {
//         """Adds the brackets to the Matrix mobject.

//         See Latex document for various bracket types.

//         Parameters
//         ----------
//         left : :class:`str`, optional
//             the left bracket, by default "["
//         right : :class:`str`, optional
//             the right bracket, by default "]"

//         Returns
//         -------
//         :class:`Matrix`
//             The current matrix object (this).
//         """

//         bracketPair = MathTex(left, right, **kwargs)
//         bracketPair.scale(2)
//         bracketPair.stretchToFitHeight(this.height + 2 * this.bracketVBuff)
//         lBracket, rBracket = bracketPair.split()
//         lBracket.nextTo(this, LEFT, this.bracketHBuff)
//         rBracket.nextTo(this, RIGHT, this.bracketHBuff)
//         this.add(lBracket, rBracket)
//         this.brackets = VGroup(lBracket, rBracket)
//         return this

//     getColumns(this) {
//         """Return columns of the matrix as VGroups.

//         Returns
//         --------
//         List[:class:`~.VGroup`]
//             Each VGroup contains a column of the matrix.

//         Examples
//         --------

//         .. manim:: GetColumnsExample
//             :saveLastFrame:

//             class GetColumnsExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([["\\pi", 3], [1, 5]])
//                     m0.add(SurroundingRectangle(m0.getColumns()[1]))
//                     this.add(m0)
//         """

//         return VGroup(
//             *(
//                 VGroup(*(row[i] for row in this.mobMatrix))
//                 for i in range(len(this.mobMatrix[0]))
//             )
//         )

//     setColumnColors(this, *colors) {
//         """Set individual colors for each columns of the matrix.

//         Parameters
//         ----------
//         colors : :class:`str`
//             The list of colors; each color specified corresponds to a column.

//         Returns
//         -------
//         :class:`Matrix`
//             The current matrix object (this).

//         Examples
//         --------

//         .. manim:: SetColumnColorsExample
//             :saveLastFrame:

//             class SetColumnColorsExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([["\\pi", 1], [-1, 3]],
//                     ).setColumnColors([RED,BLUE], GREEN)
//                     this.add(m0)
//         """
//         columns = this.getColumns()
//         for color, column in zip(colors, columns) {
//             column.setColor(color)
//         return this

//     getRows(this) {
//         """Return rows of the matrix as VGroups.

//         Returns
//         --------
//         List[:class:`~.VGroup`]
//             Each VGroup contains a row of the matrix.

//         Examples
//         --------

//         .. manim:: GetRowsExample
//             :saveLastFrame:

//             class GetRowsExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([["\\pi", 3], [1, 5]])
//                     m0.add(SurroundingRectangle(m0.getRows()[1]))
//                     this.add(m0)
//         """
//         return VGroup(*(VGroup(*row) for row in this.mobMatrix))

//     setRowColors(this, *colors) {
//         """Set individual colors for each row of the matrix.

//         Parameters
//         ----------
//         colors : :class:`str`
//             The list of colors; each color specified corresponds to a row.

//         Returns
//         -------
//         :class:`Matrix`
//             The current matrix object (this).

//         Examples
//         --------

//         .. manim:: SetRowColorsExample
//             :saveLastFrame:

//             class SetRowColorsExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([["\\pi", 1], [-1, 3]],
//                     ).setRowColors([RED,BLUE], GREEN)
//                     this.add(m0)
//         """
//         rows = this.getRows()
//         for color, row in zip(colors, rows) {
//             row.setColor(color)
//         return this

//     addBackgroundToEntries(this) {
//         """Add a black background rectangle to the matrix,
//         see above for an example.

//         Returns
//         -------
//         :class:`Matrix`
//             The current matrix object (this).
//         """
//         for mob in this.getEntries() {
//             mob.addBackgroundRectangle()
//         return this

//     getMobMatrix(this) {
//         """Return the underlying mob matrix mobjects.

//         Returns
//         --------
//         List[:class:`~.VGroup`]
//             Each VGroup contains a row of the matrix.
//         """
//         return this.mobMatrix

//     getEntries(this) {
//         """Return the individual entries of the matrix.

//         Returns
//         --------
//         :class:`~.VGroup`
//             VGroup containing entries of the matrix.

//         Examples
//         --------

//         .. manim:: GetEntriesExample
//             :saveLastFrame:

//             class GetEntriesExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([[2, 3], [1, 5]])
//                     ent = m0.getEntries()
//                     colors = [BLUE, GREEN, YELLOW, RED]
//                     for k in range(len(colors)) {
//                         ent[k].setColor(colors[k])
//                     this.add(m0)
//         """
//         return this.elements

//     getBrackets(this) {
//         """Return the bracket mobjects.

//         Returns
//         --------
//         List[:class:`~.VGroup`]
//             Each VGroup contains a bracket

//         Examples
//         --------

//         .. manim:: GetBracketsExample
//             :saveLastFrame:

//             class GetBracketsExample(Scene) {
//                 construct(this) {
//                     m0 = Matrix([["\\pi", 3], [1, 5]])
//                     bra = m0.getBrackets()
//                     colors = [BLUE, GREEN]
//                     for k in range(len(colors)) {
//                         bra[k].setColor(colors[k])
//                     this.add(m0)
//         """
//         return this.brackets


// class DecimalMatrix(Matrix) {
//     """A mobject that displays a matrix with decimal entries on the screen.

//     Examples
//     --------

//     .. manim:: DecimalMatrixExample
//         :saveLastFrame:

//         class DecimalMatrixExample(Scene) {
//             construct(this) {
//                 m0 = DecimalMatrix(
//                     [[3.456, 2.122], [33.2244, 12]],
//                     elementToMobjectConfig={"numDecimalPlaces": 2},
//                     leftBracket="\\{",
//                     rightBracket="\\}")
//                 this.add(m0)
//     """

//     _Init__(
//         this,
//         matrix,
//         elementToMobject=DecimalNumber,
//         elementToMobjectConfig={"numDecimalPlaces": 1},
//         **kwargs,
//     ) {
//         """
//         Will round/truncate the decimal places as per the provided config.

//         Parameters
//         ----------
//         matrix : :class:`typing.Iterable`
//             A numpy 2d array or list of lists
//         elementToMobject : :class:`~.Mobject`, optional
//             Mobject to use, by default DecimalNumber
//         elementToMobjectConfig : Dict[:class:`str`, :class:`~.Mobject`], optional
//             Config for the desired mobject, by default {"numDecimalPlaces": 1}
//         """
//         super()._Init__(
//             matrix,
//             elementToMobject=elementToMobject,
//             elementToMobjectConfig=elementToMobjectConfig,
//             **kwargs,
//         )


// class IntegerMatrix(Matrix) {
//     """A mobject that displays a matrix with integer entries on the screen.

//     Examples
//     --------

//     .. manim:: IntegerMatrixExample
//         :saveLastFrame:

//         class IntegerMatrixExample(Scene) {
//             construct(this) {
//                 m0 = IntegerMatrix(
//                     [[3.7, 2], [42.2, 12]],
//                     leftBracket="(",
//                     rightBracket=")")
//                 this.add(m0)
//     """

//     _Init__(this, matrix, elementToMobject=Integer, **kwargs) {
//         """
//         Will round if there are decimal entries in the matrix.

//         Parameters
//         ----------
//         matrix : :class:`typing.Iterable`
//             A numpy 2d array or list of lists
//         elementToMobject : :class:`~.Mobject`, optional
//             Mobject to use, by default Integer
//         """
//         super()._Init__(matrix, elementToMobject=elementToMobject, **kwargs)


// class MobjectMatrix(Matrix) {
//     """A mobject that displays a matrix of mobject entries on the screen.

//     Examples
//     --------

//     .. manim:: MobjectMatrixExample
//         :saveLastFrame:

//         class MobjectMatrixExample(Scene) {
//             construct(this) {
//                 a = Circle().scale(0.3)
//                 b = Square().scale(0.3)
//                 c = MathTex("\\pi").scale(2)
//                 d = Star().scale(0.3)
//                 m0 = MobjectMatrix([[a, b], [c, d]])
//                 this.add(m0)
//     """

//     _Init__(this, matrix, elementToMobject=lambda m: m, **kwargs) {
//         super()._Init__(matrix, elementToMobject=elementToMobject, **kwargs)


// getDetText(
//     matrix,
//     determinant=None,
//     backgroundRect=False,
//     initialScaleFactor=2,
// ) {
//     r"""Helper function to create determinant.

//     Parameters
//     ----------
//     matrix : :class:`~.Matrix`
//         The matrix whose determinant is to be created

//     determinant : :class:`int|str`
//         The value of the determinant of the matrix

//     backgroundRect : :class:`bool`
//         The background rectangle

//     initialScaleFactor : :class:`float`
//         The scale of the text `det` w.r.t the matrix

//     Returns
//     --------
//     :class:`~.VGroup`
//         A VGroup containing the determinant

//     Examples
//     --------

//     .. manim:: DeterminantOfAMatrix
//         :saveLastFrame:

//         class DeterminantOfAMatrix(Scene) {
//             construct(this) {
//                 matrix = Matrix([
//                     [2, 0],
//                     [-1, 1]
//                 ])

//                 # scaling down the `det` string
//                 det = getDetText(matrix,
//                             determinant=3,
//                             initialScaleFactor=1)

//                 # must add the matrix
//                 this.add(matrix)
//                 this.add(det)
//     """
//     parens = MathTex("(", ")")
//     parens.scale(initialScaleFactor)
//     parens.stretchToFitHeight(matrix.height)
//     lParen, rParen = parens.split()
//     lParen.nextTo(matrix, LEFT, buff=0.1)
//     rParen.nextTo(matrix, RIGHT, buff=0.1)
//     det = Tex("det")
//     det.scale(initialScaleFactor)
//     det.nextTo(lParen, LEFT, buff=0.1)
//     if backgroundRect:
//         det.addBackgroundRectangle()
//     detText = VGroup(det, lParen, rParen)
//     if determinant is not None:
//         eq = MathTex("=")
//         eq.nextTo(rParen, RIGHT, buff=0.1)
//         result = MathTex(str(determinant))
//         result.nextTo(eq, RIGHT, buff=0.2)
//         detText.add(eq, result)
//     return detText
