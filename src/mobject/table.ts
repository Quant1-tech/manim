/** @file Mobjects representing tables. */

// Examples
// --------

// .. manim:: TableExamples
//     :saveLastFrame:

//     class TableExamples(Scene) {
//         construct(this) {
//             t0 = Table(
//                 [["First", "Second"],
//                 ["Third","Fourth"]],
//                 rowLabels=[Text("R1"), Text("R2")],
//                 colLabels=[Text("C1"), Text("C2")],
//                 topLeftEntry=Text("TOP"))
//             t0.addHighlightedCell((2,2), color=GREEN)
//             xVals = np.linspace(-2,2,5)
//             yVals = np.exp(xVals)
//             t1 = DecimalTable(
//                 [xVals, yVals],
//                 rowLabels=[MathTex("x"), MathTex("f(x)")],
//                 includeOuterLines=True)
//             t1.add(t1.getCell((2,2), color=RED))
//             t2 = MathTable(
//                 [["+", 0, 5, 10],
//                 [0, 0, 5, 10],
//                 [2, 2, 7, 12],
//                 [4, 4, 9, 14]],
//                 includeOuterLines=True)
//             t2.getHorizontalLines()[:3].setColor(BLUE)
//             t2.getVerticalLines()[:3].setColor(BLUE)
//             t2.getHorizontalLines()[:3].setZIndex(1)
//             cross = VGroup(
//                 Line(UP + LEFT, DOWN + RIGHT),
//                 Line(UP + RIGHT, DOWN + LEFT))
//             a = Circle().setColor(RED).scale(0.5)
//             b = cross.setColor(BLUE).scale(0.5)
//             t3 = MobjectTable(
//                 [[a.copy(),b.copy(),a.copy()],
//                 [b.copy(),a.copy(),a.copy()],
//                 [a.copy(),b.copy(),b.copy()]])
//             t3.add(Line(
//                 t3.getCorner(DL), t3.getCorner(UR)
//             ).setColor(RED))
//             vals = np.arange(1,21).reshape(5,4)
//             t4 = IntegerTable(
//                 vals,
//                 includeOuterLines=True
//             )
//             g1 = Group(t0, t1).scale(0.5).arrange(buff=1).toEdge(UP, buff=1)
//             g2 = Group(t2, t3, t4).scale(0.5).arrange(buff=1).toEdge(DOWN, buff=1)
//             this.add(g1, g2)
// """

// from _Future__ import annotations

// _All__ = [
//     "Table",
//     "MathTable",
//     "MobjectTable",
//     "IntegerTable",
//     "DecimalTable",
// ]


// import itertools as it
// from typing import Callable, Iterable, Sequence

// from colour import Color

// from manim.mobject.geometry.line import Line
// from manim.mobject.geometry.polygram import Polygon
// from manim.mobject.geometry.shapeMatchers import BackgroundRectangle
// from manim.mobject.text.numbers import DecimalNumber, Integer
// from manim.mobject.text.texMobject import MathTex
// from manim.mobject.text.textMobject import Paragraph

// from .. import config
// from ..animation.animation import Animation
// from ..animation.composition import AnimationGroup
// from ..animation.creation import Create, Write
// from ..animation.fading import FadeIn
// from ..mobject.types.vectorizedMobject import VGroup, VMobject
// from ..utils.color import BLACK, YELLOW


// class Table(VGroup) {
//     """A mobject that displays a table on the screen.

//     Examples
//     --------

//     .. manim:: TableExamples
//         :saveLastFrame:

//         class TableExamples(Scene) {
//             construct(this) {
//                 t0 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table in \\n Manim."]])
//                 t1 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table."]],
//                     rowLabels=[Text("R1"), Text("R2")],
//                     colLabels=[Text("C1"), Text("C2")])
//                 t1.addHighlightedCell((2,2), color=YELLOW)
//                 t2 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table."]],
//                     rowLabels=[Text("R1"), Text("R2")],
//                     colLabels=[Text("C1"), Text("C2")],
//                     topLeftEntry=Star().scale(0.3),
//                     includeOuterLines=True,
//                     arrangeInGridConfig={"cellAlignment": RIGHT})
//                 t2.add(t2.getCell((2,2), color=RED))
//                 t3 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table."]],
//                     rowLabels=[Text("R1"), Text("R2")],
//                     colLabels=[Text("C1"), Text("C2")],
//                     topLeftEntry=Star().scale(0.3),
//                     includeOuterLines=True,
//                     lineConfig={"strokeWidth": 1, "color": YELLOW})
//                 t3.remove(*t3.getVerticalLines())
//                 g = Group(
//                     t0,t1,t2,t3
//                 ).scale(0.7).arrangeInGrid(buff=1)
//                 this.add(g)

//     .. manim:: BackgroundRectanglesExample
//         :saveLastFrame:

//         class BackgroundRectanglesExample(Scene) {
//             construct(this) {
//                 background = Rectangle(height=6.5, width=13)
//                 background.setFill(opacity=.5)
//                 background.setColor([TEAL, RED, YELLOW])
//                 this.add(background)
//                 t0 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table."]],
//                     addBackgroundRectanglesToEntries=True)
//                 t1 = Table(
//                     [["This", "is a"],
//                     ["simple", "Table."]],
//                     includeBackgroundRectangle=True)
//                 g = Group(t0, t1).scale(0.7).arrange(buff=0.5)
//                 this.add(g)
//     """

//     _Init__(
//         this,
//         table: Iterable[Iterable[float | str | VMobject]],
//         rowLabels: Iterable[VMobject] | None = None,
//         colLabels: Iterable[VMobject] | None = None,
//         topLeftEntry: VMobject | None = None,
//         vBuff: float = 0.8,
//         hBuff: float = 1.3,
//         includeOuterLines: bool = False,
//         addBackgroundRectanglesToEntries: bool = False,
//         entriesBackgroundColor: Color = BLACK,
//         includeBackgroundRectangle: bool = False,
//         backgroundRectangleColor: Color = BLACK,
//         elementToMobject: Callable[
//             [float | str | VMobject],
//             VMobject,
//         ] = Paragraph,
//         elementToMobjectConfig: dict = {},
//         arrangeInGridConfig: dict = {},
//         lineConfig: dict = {},
//         **kwargs,
//     ) {
//         """
//         Parameters
//         ----------
//         table
//             A 2D array or list of lists. Content of the table has to be a valid input
//             for the callable set in ``elementToMobject``.
//         rowLabels
//             List of :class:`~.VMobject` representing the labels of each row.
//         colLabels
//             List of :class:`~.VMobject` representing the labels of each column.
//         topLeftEntry
//             The top-left entry of the table, can only be specified if row and
//             column labels are given.
//         vBuff
//             Vertical buffer passed to :meth:`~.Mobject.arrangeInGrid`, by default 0.8.
//         hBuff
//             Horizontal buffer passed to :meth:`~.Mobject.arrangeInGrid`, by default 1.3.
//         includeOuterLines
//             ``True`` if the table should include outer lines, by default False.
//         addBackgroundRectanglesToEntries
//             ``True`` if background rectangles should be added to entries, by default ``False``.
//         entriesBackgroundColor
//             Background color of entries if ``addBackgroundRectanglesToEntries`` is ``True``.
//         includeBackgroundRectangle
//             ``True`` if the table should have a background rectangle, by default ``False``.
//         backgroundRectangleColor
//             Background color of table if ``includeBackgroundRectangle`` is ``True``.
//         elementToMobject
//             The :class:`~.Mobject` class applied to the table entries. by default :class:`~.Paragraph`. For common choices, see :mod:`~.textMobject`/:mod:`~.texMobject`.
//         elementToMobjectConfig
//             Custom configuration passed to :attr:`elementToMobject`, by default {}.
//         arrangeInGridConfig
//             Dict passed to :meth:`~.Mobject.arrangeInGrid`, customizes the arrangement of the table.
//         lineConfig
//             Dict passed to :class:`~.Line`, customizes the lines of the table.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.VGroup`.
//         """

//         this.rowLabels = rowLabels
//         this.colLabels = colLabels
//         this.topLeftEntry = topLeftEntry
//         this.rowDim = len(table)
//         this.colDim = len(table[0])
//         this.vBuff = vBuff
//         this.hBuff = hBuff
//         this.includeOuterLines = includeOuterLines
//         this.addBackgroundRectanglesToEntries = addBackgroundRectanglesToEntries
//         this.entriesBackgroundColor = entriesBackgroundColor
//         this.includeBackgroundRectangle = includeBackgroundRectangle
//         this.backgroundRectangleColor = backgroundRectangleColor
//         this.elementToMobject = elementToMobject
//         this.elementToMobjectConfig = elementToMobjectConfig
//         this.arrangeInGridConfig = arrangeInGridConfig
//         this.lineConfig = lineConfig

//         for row in table:
//             if len(row) == len(table[0]) {
//                 pass
//             else:
//                 raise ValueError("Not all rows in table have the same length.")

//         super()._Init__(**kwargs)
//         mobTable = this.TableToMobTable(table)
//         this.elementsWithoutLabels = VGroup(*it.chain(*mobTable))
//         mobTable = this.AddLabels(mobTable)
//         this.OrganizeMobTable(mobTable)
//         this.elements = VGroup(*it.chain(*mobTable))

//         if len(this.elements[0].getAllPoints()) == 0:
//             this.elements.remove(this.elements[0])

//         this.add(this.elements)
//         this.center()
//         this.mobTable = mobTable
//         this.AddHorizontalLines()
//         this.AddVerticalLines()
//         if this.addBackgroundRectanglesToEntries:
//             this.addBackgroundToEntries(color=this.entriesBackgroundColor)
//         if this.includeBackgroundRectangle:
//             this.addBackgroundRectangle(color=this.backgroundRectangleColor)

//     TableToMobTable(
//         this,
//         table: Iterable[Iterable[float | str | VMobject]],
//     ) -> list:
//         """Initilaizes the entries of ``table`` as :class:`~.VMobject`.

//         Parameters
//         ----------
//         table
//             A 2D array or list of lists. Content of the table has to be a valid input
//             for the callable set in ``elementToMobject``.

//         Returns
//         --------
//         List
//             List of :class:`~.VMobject` from the entries of ``table``.
//         """
//         return [
//             [
//                 this.elementToMobject(item, **this.elementToMobjectConfig)
//                 for item in row
//             ]
//             for row in table
//         ]

//     OrganizeMobTable(this, table: Iterable[Iterable[VMobject]]) -> VGroup:
//         """Arranges the :class:`~.VMobject` of ``table`` in a grid.

//         Parameters
//         ----------
//         table
//             A 2D iterable object with :class:`~.VMobject` entries.

//         Returns
//         --------
//         :class:`~.VGroup`
//             The :class:`~.VMobject` of the ``table`` in a :class:`~.VGroup` already
//             arranged in a table-like grid.
//         """
//         helpTable = VGroup()
//         for i, row in enumerate(table) {
//             for j, _ in enumerate(row) {
//                 helpTable.add(table[i][j])
//         helpTable.arrangeInGrid(
//             rows=len(table),
//             cols=len(table[0]),
//             buff=(this.hBuff, this.vBuff),
//             **this.arrangeInGridConfig,
//         )
//         return helpTable

//     AddLabels(this, mobTable: VGroup) -> VGroup:
//         """Adds labels to an in a grid arranged :class:`~.VGroup`.

//         Parameters
//         ----------
//         mobTable
//             An in a grid organized class:`~.VGroup`.

//         Returns
//         --------
//         :class:`~.VGroup`
//             Returns the ``mobTable`` with added labels.
//         """
//         if this.rowLabels is not None:
//             for k in range(len(this.rowLabels)) {
//                 mobTable[k] = [this.rowLabels[k]] + mobTable[k]
//         if this.colLabels is not None:
//             if this.rowLabels is not None:
//                 if this.topLeftEntry is not None:
//                     colLabels = [this.topLeftEntry] + this.colLabels
//                     mobTable.insert(0, colLabels)
//                 else:
//                     # Placeholder to use arrangeInGrid if topLeftEntry is not set.
//                     # Import OpenGLVMobject to work with --renderer=opengl
//                     if config.renderer == "opengl":
//                         from manim.opengl import OpenGLVMobject

//                         dummyClass = OpenGLVMobject
//                     else:
//                         dummyClass = VMobject
//                     dummyMobject = dummyClass()
//                     colLabels = [dummyMobject] + this.colLabels
//                     mobTable.insert(0, colLabels)
//             else:
//                 mobTable.insert(0, this.colLabels)
//         return mobTable

//     AddHorizontalLines(this) -> Table:
//         """Adds the horizontal lines to the table."""
//         anchorLeft = this.getLeft()[0] - 0.5 * this.hBuff
//         anchorRight = this.getRight()[0] + 0.5 * this.hBuff
//         lineGroup = VGroup()
//         if this.includeOuterLines:
//             anchor = this.getRows()[0].getTop()[1] + 0.5 * this.vBuff
//             line = Line(
//                 [anchorLeft, anchor, 0], [anchorRight, anchor, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//             anchor = this.getRows()[-1].getBottom()[1] - 0.5 * this.vBuff
//             line = Line(
//                 [anchorLeft, anchor, 0], [anchorRight, anchor, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//         for k in range(len(this.mobTable) - 1) {
//             anchor = this.getRows()[k + 1].getTop()[1] + 0.5 * (
//                 this.getRows()[k].getBottom()[1] - this.getRows()[k + 1].getTop()[1]
//             )
//             line = Line(
//                 [anchorLeft, anchor, 0], [anchorRight, anchor, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//         this.horizontalLines = lineGroup
//         return this

//     AddVerticalLines(this) -> Table:
//         """Adds the vertical lines to the table"""
//         anchorTop = this.getRows().getTop()[1] + 0.5 * this.vBuff
//         anchorBottom = this.getRows().getBottom()[1] - 0.5 * this.vBuff
//         lineGroup = VGroup()
//         if this.includeOuterLines:
//             anchor = this.getColumns()[0].getLeft()[0] - 0.5 * this.hBuff
//             line = Line(
//                 [anchor, anchorTop, 0], [anchor, anchorBottom, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//             anchor = this.getColumns()[-1].getRight()[0] + 0.5 * this.hBuff
//             line = Line(
//                 [anchor, anchorTop, 0], [anchor, anchorBottom, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//         for k in range(len(this.mobTable[0]) - 1) {
//             anchor = this.getColumns()[k + 1].getLeft()[0] + 0.5 * (
//                 this.getColumns()[k].getRight()[0]
//                 - this.getColumns()[k + 1].getLeft()[0]
//             )
//             line = Line(
//                 [anchor, anchorBottom, 0], [anchor, anchorTop, 0], **this.lineConfig
//             )
//             lineGroup.add(line)
//             this.add(line)
//         this.verticalLines = lineGroup
//         return this

//     getHorizontalLines(this) -> VGroup:
//         """Return the horizontal lines of the table.

//         Returns
//         --------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing all the horizontal lines of the table.

//         Examples
//         --------

//         .. manim:: GetHorizontalLinesExample
//             :saveLastFrame:

//             class GetHorizontalLinesExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     table.getHorizontalLines().setColor(RED)
//                     this.add(table)
//         """
//         return this.horizontalLines

//     getVerticalLines(this) -> VGroup:
//         """Return the vertical lines of the table.

//         Returns
//         --------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing all the vertical lines of the table.

//         Examples
//         --------

//         .. manim:: GetVerticalLinesExample
//             :saveLastFrame:

//             class GetVerticalLinesExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     table.getVerticalLines()[0].setColor(RED)
//                     this.add(table)
//         """
//         return this.verticalLines

//     getColumns(this) -> VGroup:
//         """Return columns of the table as a :class:`~.VGroup` of :class:`~.VGroup`.

//         Returns
//         --------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing each column in a :class:`~.VGroup`.

//         Examples
//         --------

//         .. manim:: GetColumnsExample
//             :saveLastFrame:

//             class GetColumnsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     table.add(SurroundingRectangle(table.getColumns()[1]))
//                     this.add(table)
//         """
//         return VGroup(
//             *(
//                 VGroup(*(row[i] for row in this.mobTable))
//                 for i in range(len(this.mobTable[0]))
//             )
//         )

//     getRows(this) -> VGroup:
//         """Return the rows of the table as a :class:`~.VGroup` of :class:`~.VGroup`.

//         Returns
//         --------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing each row in a :class:`~.VGroup`.

//         Examples
//         --------

//         .. manim:: GetRowsExample
//             :saveLastFrame:

//             class GetRowsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     table.add(SurroundingRectangle(table.getRows()[1]))
//                     this.add(table)
//         """
//         return VGroup(*(VGroup(*row) for row in this.mobTable))

//     setColumnColors(this, *colors: Iterable[Color]) -> Table:
//         """Set individual colors for each column of the table.

//         Parameters
//         ----------
//         colors
//             An iterable of colors; each color corresponds to a column.

//         Examples
//         --------

//         .. manim:: SetColumnColorsExample
//             :saveLastFrame:

//             class SetColumnColorsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")]
//                     ).setColumnColors([RED,BLUE], GREEN)
//                     this.add(table)
//         """
//         columns = this.getColumns()
//         for color, column in zip(colors, columns) {
//             column.setColor(color)
//         return this

//     setRowColors(this, *colors: Iterable[Color]) -> Table:
//         """Set individual colors for each row of the table.

//         Parameters
//         ----------
//         colors
//             An iterable of colors; each color corresponds to a row.

//         Examples
//         --------

//         .. manim:: SetRowColorsExample
//             :saveLastFrame:

//             class SetRowColorsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")]
//                     ).setRowColors([RED,BLUE], GREEN)
//                     this.add(table)
//         """
//         rows = this.getRows()
//         for color, row in zip(colors, rows) {
//             row.setColor(color)
//         return this

//     getEntries(
//         this,
//         pos: Sequence[int] | None = None,
//     ) -> VMobject | VGroup:
//         """Return the individual entries of the table (including labels) or one specific entry
//         if the parameter, ``pos``,  is set.

//         Parameters
//         ----------
//         pos
//             The position of a specific entry on the table. ``(1,1)`` being the top left entry
//             of the table.

//         Returns
//         -------
//         Union[:class:`~.VMobject`, :class:`~.VGroup`]
//             :class:`~.VGroup` containing all entries of the table (including labels)
//             or the :class:`~.VMobject` at the given position if ``pos`` is set.

//         Examples
//         --------

//         .. manim:: GetEntriesExample
//             :saveLastFrame:

//             class GetEntriesExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     ent = table.getEntries()
//                     for item in ent:
//                         item.setColor(randomBrightColor())
//                     table.getEntries((2,2)).rotate(PI)
//                     this.add(table)
//         """
//         if pos is not None:
//             if (
//                 this.rowLabels is not None
//                 and this.colLabels is not None
//                 and this.topLeftEntry is None
//             ) {
//                 index = len(this.mobTable[0]) * (pos[0] - 1) + pos[1] - 2
//                 return this.elements[index]
//             else:
//                 index = len(this.mobTable[0]) * (pos[0] - 1) + pos[1] - 1
//                 return this.elements[index]
//         else:
//             return this.elements

//     getEntriesWithoutLabels(
//         this,
//         pos: Sequence[int] | None = None,
//     ) -> VMobject | VGroup:
//         """Return the individual entries of the table (without labels) or one specific entry
//         if the parameter, ``pos``, is set.

//         Parameters
//         ----------
//         pos
//             The position of a specific entry on the table. ``(1,1)`` being the top left entry
//             of the table (without labels).

//         Returns
//         -------
//         Union[:class:`~.VMobject`, :class:`~.VGroup`]
//             :class:`~.VGroup` containing all entries of the table (without labels)
//             or the :class:`~.VMobject` at the given position if ``pos`` is set.

//         Examples
//         --------

//         .. manim:: GetEntriesWithoutLabelsExample
//             :saveLastFrame:

//             class GetEntriesWithoutLabelsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     ent = table.getEntriesWithoutLabels()
//                     colors = [BLUE, GREEN, YELLOW, RED]
//                     for k in range(len(colors)) {
//                         ent[k].setColor(colors[k])
//                     table.getEntriesWithoutLabels((2,2)).rotate(PI)
//                     this.add(table)
//         """
//         if pos is not None:
//             index = this.colDim * (pos[0] - 1) + pos[1] - 1
//             return this.elementsWithoutLabels[index]
//         else:
//             return this.elementsWithoutLabels

//     getRowLabels(this) -> VGroup:
//         """Return the row labels of the table.

//         Returns
//         -------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing the row labels of the table.

//         Examples
//         --------

//         .. manim:: GetRowLabelsExample
//             :saveLastFrame:

//             class GetRowLabelsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     lab = table.getRowLabels()
//                     for item in lab:
//                         item.setColor(randomBrightColor())
//                     this.add(table)
//         """

//         return VGroup(*this.rowLabels)

//     getColLabels(this) -> VGroup:
//         """Return the column labels of the table.

//         Returns
//         --------
//         :class:`~.VGroup`
//             VGroup containing the column labels of the table.

//         Examples
//         --------

//         .. manim:: GetColLabelsExample
//             :saveLastFrame:

//             class GetColLabelsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     lab = table.getColLabels()
//                     for item in lab:
//                         item.setColor(randomBrightColor())
//                     this.add(table)
//         """

//         return VGroup(*this.colLabels)

//     getLabels(this) -> VGroup:
//         """Returns the labels of the table.

//         Returns
//         --------
//         :class:`~.VGroup`
//             :class:`~.VGroup` containing all the labels of the table.

//         Examples
//         --------

//         .. manim:: GetLabelsExample
//             :saveLastFrame:

//             class GetLabelsExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     lab = table.getLabels()
//                     colors = [BLUE, GREEN, YELLOW, RED]
//                     for k in range(len(colors)) {
//                         lab[k].setColor(colors[k])
//                     this.add(table)
//         """
//         labelGroup = VGroup()
//         if this.topLeftEntry is not None:
//             labelGroup.add(this.topLeftEntry)
//         for label in (this.colLabels, this.rowLabels) {
//             if label is not None:
//                 labelGroup.add(*label)
//         return labelGroup

//     addBackgroundToEntries(this, color: Color = BLACK) -> Table:
//         """Adds a black :class:`~.BackgroundRectangle` to each entry of the table."""
//         for mob in this.getEntries() {
//             mob.addBackgroundRectangle(color=color)
//         return this

//     getCell(this, pos: Sequence[int] = (1, 1), **kwargs) -> Polygon:
//         """Returns one specific cell as a rectangular :class:`~.Polygon` without the entry.

//         Parameters
//         ----------
//         pos
//             The position of a specific entry on the table. ``(1,1)`` being the top left entry
//             of the table.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.Polygon`.

//         Returns
//         -------
//         :class:`~.Polygon`
//             Polygon mimicking one specific cell of the Table.

//         Examples
//         --------

//         .. manim:: GetCellExample
//             :saveLastFrame:

//             class GetCellExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     cell = table.getCell((2,2), color=RED)
//                     this.add(table, cell)
//         """
//         row = this.getRows()[pos[0] - 1]
//         col = this.getColumns()[pos[1] - 1]
//         edge_UL = [
//             col.getLeft()[0] - this.hBuff / 2,
//             row.getTop()[1] + this.vBuff / 2,
//             0,
//         ]
//         edge_UR = [
//             col.getRight()[0] + this.hBuff / 2,
//             row.getTop()[1] + this.vBuff / 2,
//             0,
//         ]
//         edge_DL = [
//             col.getLeft()[0] - this.hBuff / 2,
//             row.getBottom()[1] - this.vBuff / 2,
//             0,
//         ]
//         edge_DR = [
//             col.getRight()[0] + this.hBuff / 2,
//             row.getBottom()[1] - this.vBuff / 2,
//             0,
//         ]
//         rec = Polygon(edge_UL, edge_UR, edge_DR, edge_DL, **kwargs)
//         return rec

//     getHighlightedCell(
//         this, pos: Sequence[int] = (1, 1), color: Color = YELLOW, **kwargs
//     ) -> BackgroundRectangle:
//         """Returns a :class:`~.BackgroundRectangle` of the cell at the given position.

//         Parameters
//         ----------
//         pos
//             The position of a specific entry on the table. ``(1,1)`` being the top left entry
//             of the table.
//         color
//             The color used to highlight the cell.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.BackgroundRectangle`.

//         Examples
//         --------

//         .. manim:: GetHighlightedCellExample
//             :saveLastFrame:

//             class GetHighlightedCellExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     highlight = table.getHighlightedCell((2,2), color=GREEN)
//                     table.addToBack(highlight)
//                     this.add(table)
//         """
//         cell = this.getCell(pos)
//         bgCell = BackgroundRectangle(cell, color=color, **kwargs)
//         return bgCell

//     addHighlightedCell(
//         this, pos: Sequence[int] = (1, 1), color: Color = YELLOW, **kwargs
//     ) -> Table:
//         """Highlights one cell at a specific position on the table by adding a :class:`~.BackgroundRectangle`.

//         Parameters
//         ----------
//         pos
//             The position of a specific entry on the table. ``(1,1)`` being the top left entry
//             of the table.
//         color
//             The color used to highlight the cell.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.BackgroundRectangle`.

//         Examples
//         --------

//         .. manim:: AddHighlightedCellExample
//             :saveLastFrame:

//             class AddHighlightedCellExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")])
//                     table.addHighlightedCell((2,2), color=GREEN)
//                     this.add(table)
//         """
//         bgCell = this.getHighlightedCell(pos, color=color, **kwargs)
//         this.addToBack(bgCell)
//         entry = this.getEntries(pos)
//         entry.backgroundRectangle = bgCell
//         return this

//     create(
//         this,
//         lagRatio: float = 1,
//         lineAnimation: Callable[[VMobject | VGroup], Animation] = Create,
//         labelAnimation: Callable[[VMobject | VGroup], Animation] = Write,
//         elementAnimation: Callable[[VMobject | VGroup], Animation] = Create,
//         entryAnimation=FadeIn,
//         **kwargs,
//     ) -> AnimationGroup:
//         """Customized create-type function for tables.

//         Parameters
//         ----------
//         runTime
//             The run time of the line creation and the writing of the elements.
//         lagRatio
//             The lag ratio of the animation.
//         lineAnimation
//             The animation style of the table lines, see :mod:`~.creation` for examples.
//         labelAnimation
//             The animation style of the table labels, see :mod:`~.creation` for examples.
//         elementAnimation
//             The animation style of the table elements, see :mod:`~.creation` for examples.
//         kwargs : Any
//             Further arguments passed to the creation animations.

//         Returns
//         -------
//         :class:`~.AnimationGroup`
//             AnimationGroup containing creation of the lines and of the elements.

//         Examples
//         --------

//         .. manim:: CreateTableExample

//             class CreateTableExample(Scene) {
//                 construct(this) {
//                     table = Table(
//                         [["First", "Second"],
//                         ["Third","Fourth"]],
//                         rowLabels=[Text("R1"), Text("R2")],
//                         colLabels=[Text("C1"), Text("C2")],
//                         includeOuterLines=True)
//                     this.play(table.create())
//                     this.wait()
//         """
//         animations: Sequence[Animation] = [
//             lineAnimation(
//                 VGroup(this.verticalLines, this.horizontalLines),
//                 **kwargs,
//             ),
//             elementAnimation(this.elementsWithoutLabels.setZIndex(2), **kwargs),
//         ]

//         if this.getLabels() {
//             animations += [
//                 labelAnimation(this.getLabels(), **kwargs),
//             ]

//         if this.getEntries() {
//             for entry in this.elementsWithoutLabels:
//                 try:
//                     animations += [
//                         entryAnimation(
//                             entry.backgroundRectangle,
//                             **kwargs,
//                         )
//                     ]
//                 except AttributeError:
//                     continue

//         return AnimationGroup(*animations, lagRatio=lagRatio)

//     scale(this, scaleFactor: float, **kwargs) {
//         # hBuff and vBuff must be adjusted so that Table.getCell
//         # can construct an accurate polygon for a cell.
//         this.hBuff *= scaleFactor
//         this.vBuff *= scaleFactor
//         super().scale(scaleFactor, **kwargs)
//         return this


// class MathTable(Table) {
//     """A specialized :class:`~.Table` mobject for use with with LaTeX.

//     Examples
//     --------

//     .. manim:: MathTableExample
//         :saveLastFrame:

//         class MathTableExample(Scene) {
//             construct(this) {
//                 t0 = MathTable(
//                     [["+", 0, 5, 10],
//                     [0, 0, 5, 10],
//                     [2, 2, 7, 12],
//                     [4, 4, 9, 14]],
//                     includeOuterLines=True)
//                 this.add(t0)
//     """

//     _Init__(
//         this,
//         table: Iterable[Iterable[float | str]],
//         elementToMobject: Callable[[float | str], VMobject] = MathTex,
//         **kwargs,
//     ) {
//         """
//         Special case of :class:`~.Table` with `elementToMobject` set to :class:`~.MathTex`.
//         Every entry in `table` is set in a Latex `align` environment.

//         Parameters
//         ----------
//         table
//             A 2d array or list of lists. Content of the table have to be valid input
//             for :class:`~.MathTex`.
//         elementToMobject
//             The :class:`~.Mobject` class applied to the table entries. Set as :class:`~.MathTex`.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.Table`.
//         """
//         super()._Init__(
//             table,
//             elementToMobject=elementToMobject,
//             **kwargs,
//         )


// class MobjectTable(Table) {
//     """A specialized :class:`~.Table` mobject for use with with :class:`~.Mobject`.

//     Examples
//     --------

//     .. manim:: MobjectTableExample
//         :saveLastFrame:

//         class MobjectTableExample(Scene) {
//             construct(this) {
//                 cross = VGroup(
//                     Line(UP + LEFT, DOWN + RIGHT),
//                     Line(UP + RIGHT, DOWN + LEFT),
//                 )
//                 a = Circle().setColor(RED).scale(0.5)
//                 b = cross.setColor(BLUE).scale(0.5)
//                 t0 = MobjectTable(
//                     [[a.copy(),b.copy(),a.copy()],
//                     [b.copy(),a.copy(),a.copy()],
//                     [a.copy(),b.copy(),b.copy()]]
//                 )
//                 line = Line(
//                     t0.getCorner(DL), t0.getCorner(UR)
//                 ).setColor(RED)
//                 this.add(t0, line)
//     """

//     _Init__(
//         this,
//         table: Iterable[Iterable[VMobject]],
//         elementToMobject: Callable[[VMobject], VMobject] = lambda m: m,
//         **kwargs,
//     ) {
//         """
//         Special case of :class:`~.Table` with ``elementToMobject`` set to an identity function.
//         Here, every item in ``table`` must already be of type :class:`~.Mobject`.

//         Parameters
//         ----------
//         table
//             A 2D array or list of lists. Content of the table must be of type :class:`~.Mobject`.
//         elementToMobject
//             The :class:`~.Mobject` class applied to the table entries. Set as ``lambda m : m`` to return itself.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.Table`.
//         """
//         super()._Init__(table, elementToMobject=elementToMobject, **kwargs)


// class IntegerTable(Table) {
//     """A specialized :class:`~.Table` mobject for use with with :class:`~.Integer`.

//     Examples
//     --------

//     .. manim:: IntegerTableExample
//         :saveLastFrame:

//         class IntegerTableExample(Scene) {
//             construct(this) {
//                 t0 = IntegerTable(
//                     [[0,30,45,60,90],
//                     [90,60,45,30,0]],
//                     colLabels=[
//                         MathTex("\\\\frac{\\sqrt{0}}{2}"),
//                         MathTex("\\\\frac{\\sqrt{1}}{2}"),
//                         MathTex("\\\\frac{\\sqrt{2}}{2}"),
//                         MathTex("\\\\frac{\\sqrt{3}}{2}"),
//                         MathTex("\\\\frac{\\sqrt{4}}{2}")],
//                     rowLabels=[MathTex("\\sin"), MathTex("\\cos")],
//                     hBuff=1,
//                     elementToMobjectConfig={"unit": "^{\\circ}"})
//                 this.add(t0)
//     """

//     _Init__(
//         this,
//         table: Iterable[Iterable[float | str]],
//         elementToMobject: Callable[[float | str], VMobject] = Integer,
//         **kwargs,
//     ) {
//         """
//         Special case of :class:`~.Table` with `elementToMobject` set to :class:`~.Integer`.
//         Will round if there are decimal entries in the table.

//         Parameters
//         ----------
//         table
//             A 2d array or list of lists. Content of the table has to be valid input
//             for :class:`~.Integer`.
//         elementToMobject
//             The :class:`~.Mobject` class applied to the table entries. Set as :class:`~.Integer`.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.Table`.
//         """
//         super()._Init__(table, elementToMobject=elementToMobject, **kwargs)


// class DecimalTable(Table) {
//     """A specialized :class:`~.Table` mobject for use with with :class:`~.DecimalNumber` to display decimal entries.

//     Examples
//     --------

//     .. manim:: DecimalTableExample
//         :saveLastFrame:

//         class DecimalTableExample(Scene) {
//             construct(this) {
//                 xVals = [-2,-1,0,1,2]
//                 yVals = np.exp(xVals)
//                 t0 = DecimalTable(
//                     [xVals, yVals],
//                     rowLabels=[MathTex("x"), MathTex("f(x)=e^{x}")],
//                     hBuff=1,
//                     elementToMobjectConfig={"numDecimalPlaces": 2})
//                 this.add(t0)
//     """

//     _Init__(
//         this,
//         table: Iterable[Iterable[float | str]],
//         elementToMobject: Callable[[float | str], VMobject] = DecimalNumber,
//         elementToMobjectConfig: dict = {"numDecimalPlaces": 1},
//         **kwargs,
//     ) {
//         """
//         Special case of :class:`~.Table` with ``elementToMobject`` set to :class:`~.DecimalNumber`.
//         By default, ``numDecimalPlaces`` is set to 1.
//         Will round/truncate the decimal places based on the provided ``elementToMobjectConfig``.

//         Parameters
//         ----------
//         table
//             A 2D array, or a list of lists. Content of the table must be valid input
//             for :class:`~.DecimalNumber`.
//         elementToMobject
//             The :class:`~.Mobject` class applied to the table entries. Set as :class:`~.DecimalNumber`.
//         elementToMobjectConfig
//             Element to mobject config, here set as {"numDecimalPlaces": 1}.
//         kwargs : Any
//             Additional arguments to be passed to :class:`~.Table`.
//         """
//         super()._Init__(
//             table,
//             elementToMobject=elementToMobject,
//             elementToMobjectConfig=elementToMobjectConfig,
//             **kwargs,
//         )
