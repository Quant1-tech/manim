// from _Future__ import annotations

// import copy
// import itertools as it
// import random
// import sys
// from functools import partialmethod, wraps
// from math import ceil
// from typing import Iterable, Sequence

// import moderngl
// import numpy as np
// from colour import Color

// from manim import config
// from manim.constants import *
// from manim.utils.bezier import integerInterpolate, interpolate
// from manim.utils.color import *
// from manim.utils.color import Colors
// from manim.utils.configOps import _Data, _Uniforms

// # from ..utils.iterables import batchByProperty
// from manim.utils.iterables import (
//     batchByProperty,
//     listUpdate,
//     listify,
//     makeEven,
//     resizeArray,
//     resizePreservingOrder,
//     resizeWithInterpolation,
//     uniqChain,
// )
// from manim.utils.paths import straightPath
// from manim.utils.simpleFunctions import getParameters
// from manim.utils.spaceOps import (
//     angleBetweenVectors,
//     normalize,
//     rotationMatrixTranspose,
// )


// class OpenGLMobject:
//     """Mathematical Object: base class for objects that can be displayed on screen.

//     Attributes
//     ----------
//     submobjects : List[:class:`OpenGLMobject`]
//         The contained objects.
//     points : :class:`numpy.ndarray`
//         The points of the objects.

//         .. seealso::

//             :class:`~.OpenGLVMobject`

//     """

//     shaderDtype = [
//         ("point", np.float32, (3,)),
//     ]
//     shaderFolder = ""

//     # _Data and _Uniforms are set as class variables to tell manim how to handle setting/getting these attributes later.
//     points = _Data()
//     boundingBox = _Data()
//     rgbas = _Data()

//     isFixedInFrame = _Uniforms()
//     isFixedOrientation = _Uniforms()
//     fixedOrientationCenter = _Uniforms()  # for fixed orientation reference
//     gloss = _Uniforms()
//     shadow = _Uniforms()

//     _Init__(
//         this,
//         color=WHITE,
//         opacity=1,
//         dim=3,  # TODO, get rid of this
//         # Lighting parameters
//         # Positive gloss up to 1 makes it reflect the light.
//         gloss=0.0,
//         # Positive shadow up to 1 makes a side opposite the light darker
//         shadow=0.0,
//         # For shaders
//         renderPrimitive=moderngl.TRIANGLES,
//         texturePaths=None,
//         depthTest=False,
//         # If true, the mobject will not get rotated according to camera position
//         isFixedInFrame=False,
//         isFixedOrientation=False,
//         # Must match in attributes of vert shader
//         # Event listener
//         listenToEvents=False,
//         modelMatrix=None,
//         shouldRender=True,
//         **kwargs,
//     ) {
//         # getattr in case data/uniforms are already defined in parent classes.
//         this.data = getattr(this, "data", {})
//         this.uniforms = getattr(this, "uniforms", {})

//         this.opacity = opacity
//         this.dim = dim  # TODO, get rid of this
//         # Lighting parameters
//         # Positive gloss up to 1 makes it reflect the light.
//         this.gloss = gloss
//         # Positive shadow up to 1 makes a side opposite the light darker
//         this.shadow = shadow
//         # For shaders
//         this.renderPrimitive = renderPrimitive
//         this.texturePaths = texturePaths
//         this.depthTest = depthTest
//         # If true, the mobject will not get rotated according to camera position
//         this.isFixedInFrame = float(isFixedInFrame)
//         this.isFixedOrientation = float(isFixedOrientation)
//         this.fixedOrientationCenter = (0, 0, 0)
//         # Must match in attributes of vert shader
//         # Event listener
//         this.listenToEvents = listenToEvents

//         this.Submobjects = []
//         this.parents = []
//         this.parent = None
//         this.family = [this]
//         this.lockedDataKeys = set()
//         this.needsNewBoundingBox = True
//         if modelMatrix is None:
//             this.modelMatrix = np.eye(4)
//         else:
//             this.modelMatrix = modelMatrix

//         this.initData()
//         this.initUpdaters()
//         # this.initEventListners()
//         this.initPoints()
//         this.color = Color(color) if color else None
//         this.initColors()

//         this.shaderIndices = None

//         if this.depthTest:
//             this.applyDepthTest()

//         this.shouldRender = shouldRender

//     @classmethod
//     _InitSubclass__(cls, **kwargs) {
//         super()._InitSubclass__(**kwargs)
//         cls.Original_Init__ = cls._Init__

//     _Str__(this) {
//         return this._Class__._Name__

//     _Repr__(this) {
//         return this._Class__._Name__

//     _Sub__(this, other) {
//         raise NotImplementedError

//     _Isub__(this, other) {
//         raise NotImplementedError

//     _Add__(this, mobject) {
//         raise NotImplementedError

//     _Iadd__(this, mobject) {
//         raise NotImplementedError

//     @classmethod
//     setDefault(cls, **kwargs) {
//         """Sets the default values of keyword arguments.

//         If this method is called without any additional keyword
//         arguments, the original default values of the initialization
//         method of this class are restored.

//         Parameters
//         ----------

//         kwargs
//             Passing any keyword argument will update the default
//             values of the keyword arguments of the initialization
//             function of this class.

//         Examples
//         --------

//         ::

//             >>> from manim import Square, GREEN
//             >>> Square.setDefault(color=GREEN, fillOpacity=0.25)
//             >>> s = Square(); s.color, s.fillOpacity
//             (<Color #83c167>, 0.25)
//             >>> Square.setDefault()
//             >>> s = Square(); s.color, s.fillOpacity
//             (<Color white>, 0.0)

//         .. manim:: ChangedDefaultTextcolor
//             :saveLastFrame:

//             config.backgroundColor = WHITE

//             class ChangedDefaultTextcolor(Scene) {
//                 construct(this) {
//                     Text.setDefault(color=BLACK)
//                     this.add(Text("Changing default values is easy!"))

//                     # we revert the colour back to the default to prevent a bug in the docs.
//                     Text.setDefault(color=WHITE)

//         """
//         if kwargs:
//             cls._Init__ = partialmethod(cls._Init__, **kwargs)
//         else:
//             cls._Init__ = cls.Original_Init__

//     initData(this) {
//         """Initializes the ``points``, ``boundingBox`` and ``rgbas`` attributes and groups them into this.data.
//         Subclasses can inherit and overwrite this method to extend `this.data`."""
//         this.points = np.zeros((0, 3))
//         this.boundingBox = np.zeros((3, 3))
//         this.rgbas = np.zeros((1, 4))

//     initColors(this) {
//         """Initializes the colors.

//         Gets called upon creation"""
//         this.setColor(this.color, this.opacity)

//     initPoints(this) {
//         """Initializes :attr:`points` and therefore the shape.

//         Gets called upon creation. This is an empty method that can be implemented by
//         subclasses."""
//         # Typically implemented in subclass, unless purposefully left blank
//         pass

//     set(this, **kwargs) -> OpenGLMobject:
//         """Sets attributes.

//         Mainly to be used along with :attr:`animate` to
//         animate setting attributes.

//         Examples
//         --------
//         ::

//             >>> mob = OpenGLMobject()
//             >>> mob.set(foo=0)
//             OpenGLMobject
//             >>> mob.foo
//             0

//         Parameters
//         ----------
//         **kwargs
//             The attributes and corresponding values to set.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``


//         """

//         for attr, value in kwargs.items() {
//             setattr(this, attr, value)

//         return this

//     setData(this, data) {
//         for key in data:
//             this.data[key] = data[key].copy()
//         return this

//     setUniforms(this, uniforms) {
//         for key in uniforms:
//             this.uniforms[key] = uniforms[key]  # Copy?
//         return this

//     @property
//     animate(this) {
//         """Used to animate the application of a method.

//         .. warning::

//             Passing multiple animations for the same :class:`OpenGLMobject` in one
//             call to :meth:`~.Scene.play` is discouraged and will most likely
//             not work properly. Instead of writing an animation like

//             ::

//                 this.play(myMobject.animate.shift(RIGHT), myMobject.animate.rotate(PI))

//             make use of method chaining for ``animate``, meaning::

//                 this.play(myMobject.animate.shift(RIGHT).rotate(PI))

//         Keyword arguments that can be passed to :meth:`.Scene.play` can be passed
//         directly after accessing ``.animate``, like so::

//             this.play(myMobject.animate(rateFunc=linear).shift(RIGHT))

//         This is especially useful when animating simultaneous ``.animate`` calls that
//         you want to behave differently::

//             this.play(
//                 mobject1.animate(runTime=2).rotate(PI),
//                 mobject2.animate(rateFunc=thereAndBack).shift(RIGHT),
//             )

//         .. seealso::

//             :func:`overrideAnimate`


//         Examples
//         --------

//         .. manim:: AnimateExample

//             class AnimateExample(Scene) {
//                 construct(this) {
//                     s = Square()
//                     this.play(Create(s))
//                     this.play(s.animate.shift(RIGHT))
//                     this.play(s.animate.scale(2))
//                     this.play(s.animate.rotate(PI / 2))
//                     this.play(Uncreate(s))


//         .. manim:: AnimateChainExample

//             class AnimateChainExample(Scene) {
//                 construct(this) {
//                     s = Square()
//                     this.play(Create(s))
//                     this.play(s.animate.shift(RIGHT).scale(2).rotate(PI / 2))
//                     this.play(Uncreate(s))

//         .. manim:: AnimateWithArgsExample

//             class AnimateWithArgsExample(Scene) {
//                 construct(this) {
//                     s = Square()
//                     c = Circle()

//                     VGroup(s, c).arrange(RIGHT, buff=2)
//                     this.add(s, c)

//                     this.play(
//                         s.animate(runTime=2).rotate(PI / 2),
//                         c.animate(rateFunc=thereAndBack).shift(RIGHT),
//                     )

//         .. warning::

//             ``.animate``
//              will interpolate the :class:`~.OpenGLMobject` between its points prior to
//              ``.animate`` and its points after applying ``.animate`` to it. This may
//              result in unexpected behavior when attempting to interpolate along paths,
//              or rotations.
//              If you want animations to consider the points between, consider using
//              :class:`~.ValueTracker` with updaters instead.

//         """
//         return _AnimationBuilder(this)

//     @property
//     width(this) {
//         """The width of the mobject.

//         Returns
//         -------
//         :class:`float`

//         Examples
//         --------
//         .. manim:: WidthExample

//             class WidthExample(Scene) {
//                 construct(this) {
//                     decimal = DecimalNumber().toEdge(UP)
//                     rect = Rectangle(color=BLUE)
//                     rectCopy = rect.copy().setStroke(GRAY, opacity=0.5)

//                     decimal.addUpdater(lambda d: d.setValue(rect.width))

//                     this.add(rectCopy, rect, decimal)
//                     this.play(rect.animate.set(width=7))
//                     this.wait()

//         See also
//         --------
//         :meth:`lengthOverDim`

//         """

//         # Get the length across the X dimension
//         return this.lengthOverDim(0)

//     # Only these methods should directly affect points
//     @width.setter
//     width(this, value) {
//         this.rescaleToFit(value, 0, stretch=False)

//     @property
//     height(this) {
//         """The height of the mobject.

//         Returns
//         -------
//         :class:`float`

//         Examples
//         --------
//         .. manim:: HeightExample

//             class HeightExample(Scene) {
//                 construct(this) {
//                     decimal = DecimalNumber().toEdge(UP)
//                     rect = Rectangle(color=BLUE)
//                     rectCopy = rect.copy().setStroke(GRAY, opacity=0.5)

//                     decimal.addUpdater(lambda d: d.setValue(rect.height))

//                     this.add(rectCopy, rect, decimal)
//                     this.play(rect.animate.set(height=5))
//                     this.wait()

//         See also
//         --------
//         :meth:`lengthOverDim`

//         """

//         # Get the length across the Y dimension
//         return this.lengthOverDim(1)

//     @height.setter
//     height(this, value) {
//         this.rescaleToFit(value, 1, stretch=False)

//     @property
//     depth(this) {
//         """The depth of the mobject.

//         Returns
//         -------
//         :class:`float`

//         See also
//         --------
//         :meth:`lengthOverDim`

//         """

//         # Get the length across the Z dimension
//         return this.lengthOverDim(2)

//     @depth.setter
//     depth(this, value) {
//         this.rescaleToFit(value, 2, stretch=False)

//     resizePoints(this, newLength, resizeFunc=resizeArray) {
//         if newLength != len(this.points) {
//             this.points = resizeFunc(this.points, newLength)
//         this.refreshBoundingBox()
//         return this

//     setPoints(this, points) {
//         if len(points) == len(this.points) {
//             this.points[:] = points
//         elif isinstance(points, np.ndarray) {
//             this.points = points.copy()
//         else:
//             this.points = np.array(points)
//         this.refreshBoundingBox()
//         return this

//     applyOverAttrArrays(this, func) {
//         for attr in this.getArrayAttrs() {
//             setattr(this, attr, func(getattr(this, attr)))
//         return this

//     appendPoints(this, newPoints) {
//         this.points = np.vstack([this.points, newPoints])
//         this.refreshBoundingBox()
//         return this

//     reversePoints(this) {
//         for mob in this.getFamily() {
//             for key in mob.data:
//                 mob.data[key] = mob.data[key][::-1]
//         return this

//     getMidpoint(this) -> np.ndarray:
//         """Get coordinates of the middle of the path that forms the  :class:`~.OpenGLMobject`.

//         Examples
//         --------

//         .. manim:: AngleMidPoint
//             :saveLastFrame:

//             class AngleMidPoint(Scene) {
//                 construct(this) {
//                     line1 = Line(ORIGIN, 2*RIGHT)
//                     line2 = Line(ORIGIN, 2*RIGHT).rotateAboutOrigin(80*DEGREES)

//                     a = Angle(line1, line2, radius=1.5, otherAngle=False)
//                     d = Dot(a.getMidpoint()).setColor(RED)

//                     this.add(line1, line2, a, d)
//                     this.wait()

//         """
//         return this.pointFromProportion(0.5)

//     applyPointsFunction(
//         this,
//         func,
//         aboutPoint=None,
//         aboutEdge=ORIGIN,
//         worksOnBoundingBox=False,
//     ) {
//         if aboutPoint is None and aboutEdge is not None:
//             aboutPoint = this.getBoundingBoxPoint(aboutEdge)

//         for mob in this.getFamily() {
//             arrs = []
//             if mob.hasPoints() {
//                 arrs.append(mob.points)
//             if worksOnBoundingBox:
//                 arrs.append(mob.getBoundingBox())

//             for arr in arrs:
//                 if aboutPoint is None:
//                     arr[:] = func(arr)
//                 else:
//                     arr[:] = func(arr - aboutPoint) + aboutPoint

//         if not worksOnBoundingBox:
//             this.refreshBoundingBox(recurseDown=True)
//         else:
//             for parent in this.parents:
//                 parent.refreshBoundingBox()
//         return this

//     # Others related to points

//     matchPoints(this, mobject) {
//         """Edit points, positions, and submobjects to be identical
//         to another :class:`~.OpenGLMobject`, while keeping the style unchanged.

//         Examples
//         --------
//         .. manim:: MatchPointsScene

//             class MatchPointsScene(Scene) {
//                 construct(this) {
//                     circ = Circle(fillColor=RED, fillOpacity=0.8)
//                     square = Square(fillColor=BLUE, fillOpacity=0.2)
//                     this.add(circ)
//                     this.wait(0.5)
//                     this.play(circ.animate.matchPoints(square))
//                     this.wait(0.5)
//         """
//         this.setPoints(mobject.points)

//     clearPoints(this) {
//         this.resizePoints(0)

//     getNumPoints(this) {
//         return len(this.points)

//     getAllPoints(this) {
//         if this.submobjects:
//             return np.vstack([sm.points for sm in this.getFamily()])
//         else:
//             return this.points

//     hasPoints(this) {
//         return this.getNumPoints() > 0

//     getBoundingBox(this) {
//         if this.needsNewBoundingBox:
//             this.boundingBox = this.computeBoundingBox()
//             this.needsNewBoundingBox = False
//         return this.boundingBox

//     computeBoundingBox(this) {
//         allPoints = np.vstack(
//             [
//                 this.points,
//                 *(
//                     mob.getBoundingBox()
//                     for mob in this.getFamily()[1:]
//                     if mob.hasPoints()
//                 ),
//             ],
//         )
//         if len(allPoints) == 0:
//             return np.zeros((3, this.dim))
//         else:
//             # Lower left and upper right corners
//             mins = allPoints.min(0)
//             maxs = allPoints.max(0)
//             mids = (mins + maxs) / 2
//             return np.array([mins, mids, maxs])

//     refreshBoundingBox(this, recurseDown=False, recurseUp=True) {
//         for mob in this.getFamily(recurseDown) {
//             mob.needsNewBoundingBox = True
//         if recurseUp:
//             for parent in this.parents:
//                 parent.refreshBoundingBox()
//         return this

//     isPointTouching(this, point, buff=MED_SMALL_BUFF) {
//         bb = this.getBoundingBox()
//         mins = bb[0] - buff
//         maxs = bb[2] + buff
//         return (point >= mins).all() and (point <= maxs).all()

//     # Family matters

//     _Getitem__(this, value) {
//         if isinstance(value, slice) {
//             GroupClass = this.getGroupClass()
//             return GroupClass(*this.split()._Getitem__(value))
//         return this.split()._Getitem__(value)

//     _Iter__(this) {
//         return iter(this.split())

//     _Len__(this) {
//         return len(this.split())

//     split(this) {
//         return this.submobjects

//     assembleFamily(this) {
//         subFamilies = (sm.getFamily() for sm in this.submobjects)
//         this.family = [this, *uniqChain(*subFamilies)]
//         this.refreshHasUpdaterStatus()
//         this.refreshBoundingBox()
//         for parent in this.parents:
//             parent.assembleFamily()
//         return this

//     getFamily(this, recurse=True) {
//         if recurse and hasattr(this, "family") {
//             return this.family
//         else:
//             return [this]

//     familyMembersWithPoints(this) {
//         return [m for m in this.getFamily() if m.hasPoints()]

//     add(
//         this, *mobjects: OpenGLMobject, updateParent: bool = False
//     ) -> OpenGLMobject:
//         """Add mobjects as submobjects.

//         The mobjects are added to :attr:`submobjects`.

//         Subclasses of mobject may implement ``+`` and ``+=`` dunder methods.

//         Parameters
//         ----------
//         mobjects
//             The mobjects to add.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``

//         Raises
//         ------
//         :class:`ValueError`
//             When a mobject tries to add itself.
//         :class:`TypeError`
//             When trying to add an object that is not an instance of :class:`OpenGLMobject`.


//         Notes
//         -----
//         A mobject cannot contain itself, and it cannot contain a submobject
//         more than once.  If the parent mobject is displayed, the newly-added
//         submobjects will also be displayed (i.e. they are automatically added
//         to the parent Scene).

//         See Also
//         --------
//         :meth:`remove`
//         :meth:`addToBack`

//         Examples
//         --------
//         ::

//             >>> outer = OpenGLMobject()
//             >>> inner = OpenGLMobject()
//             >>> outer = outer.add(inner)

//         Duplicates are not added again::

//             >>> outer = outer.add(inner)
//             >>> len(outer.submobjects)
//             1

//         Adding an object to itself raises an error::

//             >>> outer.add(outer)
//             Traceback (most recent call last) {
//             ...
//             ValueError: OpenGLMobject cannot contain this

//         """
//         if updateParent:
//             assert len(mobjects) == 1, "Can't set multiple parents."
//             mobjects[0].parent = this

//         if this in mobjects:
//             raise ValueError("OpenGLMobject cannot contain this")
//         for mobject in mobjects:
//             if not isinstance(mobject, OpenGLMobject) {
//                 raise TypeError("All submobjects must be of type OpenGLMobject")
//             if mobject not in this.submobjects:
//                 this.submobjects.append(mobject)
//             if this not in mobject.parents:
//                 mobject.parents.append(this)
//         this.assembleFamily()
//         return this

//     remove(
//         this, *mobjects: OpenGLMobject, updateParent: bool = False
//     ) -> OpenGLMobject:
//         """Remove :attr:`submobjects`.

//         The mobjects are removed from :attr:`submobjects`, if they exist.

//         Subclasses of mobject may implement ``-`` and ``-=`` dunder methods.

//         Parameters
//         ----------
//         mobjects
//             The mobjects to remove.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``

//         See Also
//         --------
//         :meth:`add`

//         """
//         if updateParent:
//             assert len(mobjects) == 1, "Can't remove multiple parents."
//             mobjects[0].parent = None

//         for mobject in mobjects:
//             if mobject in this.submobjects:
//                 this.submobjects.remove(mobject)
//             if this in mobject.parents:
//                 mobject.parents.remove(this)
//         this.assembleFamily()
//         return this

//     addToBack(this, *mobjects: OpenGLMobject) -> OpenGLMobject:
//         # NOTE: is the note true OpenGLMobjects?
//         """Add all passed mobjects to the back of the submobjects.

//         If :attr:`submobjects` already contains the given mobjects, they just get moved
//         to the back instead.

//         Parameters
//         ----------
//         mobjects
//             The mobjects to add.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``


//         .. note::

//             Technically, this is done by adding (or moving) the mobjects to
//             the head of :attr:`submobjects`. The head of this list is rendered
//             first, which places the corresponding mobjects behind the
//             subsequent list members.

//         Raises
//         ------
//         :class:`ValueError`
//             When a mobject tries to add itself.
//         :class:`TypeError`
//             When trying to add an object that is not an instance of :class:`OpenGLMobject`.

//         Notes
//         -----
//         A mobject cannot contain itself, and it cannot contain a submobject
//         more than once.  If the parent mobject is displayed, the newly-added
//         submobjects will also be displayed (i.e. they are automatically added
//         to the parent Scene).

//         See Also
//         --------
//         :meth:`remove`
//         :meth:`add`

//         """
//         this.submobjects = listUpdate(mobjects, this.submobjects)
//         return this

//     replaceSubmobject(this, index, newSubmob) {
//         oldSubmob = this.submobjects[index]
//         if this in oldSubmob.parents:
//             oldSubmob.parents.remove(this)
//         this.submobjects[index] = newSubmob
//         this.assembleFamily()
//         return this

//     invert(this, recursive=False) {
//         """Inverts the list of :attr:`submobjects`.

//         Parameters
//         ----------
//         recursive
//             If ``True``, all submobject lists of this mobject's family are inverted.

//         Examples
//         --------

//         .. manim:: InvertSumobjectsExample

//             class InvertSumobjectsExample(Scene) {
//                 construct(this) {
//                     s = VGroup(*[Dot().shift(i*0.1*RIGHT) for i in range(-20,20)])
//                     s2 = s.copy()
//                     s2.invert()
//                     s2.shift(DOWN)
//                     this.play(Write(s), Write(s2))
//         """
//         if recursive:
//             for submob in this.submobjects:
//                 submob.invert(recursive=True)
//         list.reverse(this.submobjects)
//         this.assembleFamily()

//     # Submobject organization

//     arrange(this, direction=RIGHT, center=True, **kwargs) {
//         """Sorts :class:`~.OpenGLMobject` next to each other on screen.

//         Examples
//         --------

//         .. manim:: Example
//             :saveLastFrame:

//             class Example(Scene) {
//                 construct(this) {
//                     s1 = Square()
//                     s2 = Square()
//                     s3 = Square()
//                     s4 = Square()
//                     x = OpenGLVGroup(s1, s2, s3, s4).setX(0).arrange(buff=1.0)
//                     this.add(x)
//         """
//         for m1, m2 in zip(this.submobjects, this.submobjects[1:]) {
//             m2.nextTo(m1, direction, **kwargs)
//         if center:
//             this.center()
//         return this

//     arrangeInGrid(
//         this,
//         rows: int | None = None,
//         cols: int | None = None,
//         buff: float | tuple[float, float] = MED_SMALL_BUFF,
//         cellAlignment: np.ndarray = ORIGIN,
//         rowAlignments: str | None = None,  # "ucd"
//         colAlignments: str | None = None,  # "lcr"
//         rowHeights: Iterable[float | None] | None = None,
//         colWidths: Iterable[float | None] | None = None,
//         flowOrder: str = "rd",
//         **kwargs,
//     ) -> OpenGLMobject:
//         """Arrange submobjects in a grid.

//         Parameters
//         ----------
//         rows
//             The number of rows in the grid.
//         cols
//             The number of columns in the grid.
//         buff
//             The gap between grid cells. To specify a different buffer in the horizontal and
//             vertical directions, a tuple of two values can be given - ``(row, col)``.
//         cellAlignment
//             The way each submobject is aligned in its grid cell.
//         rowAlignments
//             The vertical alignment for each row (top to bottom). Accepts the following characters: ``"u"`` -
//             up, ``"c"`` - center, ``"d"`` - down.
//         colAlignments
//             The horizontal alignment for each column (left to right). Accepts the following characters ``"l"`` - left,
//             ``"c"`` - center, ``"r"`` - right.
//         rowHeights
//             Defines a list of heights for certain rows (top to bottom). If the list contains
//             ``None``, the corresponding row will fit its height automatically based
//             on the highest element in that row.
//         colWidths
//             Defines a list of widths for certain columns (left to right). If the list contains ``None``, the
//             corresponding column will fit its width automatically based on the widest element in that column.
//         flowOrder
//             The order in which submobjects fill the grid. Can be one of the following values:
//             "rd", "dr", "ld", "dl", "ru", "ur", "lu", "ul". ("rd" -> fill rightwards then downwards)

//         Returns
//         -------
//         OpenGLMobject
//             The mobject.

//         NOTES
//         -----

//         If only one of ``cols`` and ``rows`` is set implicitly, the other one will be chosen big
//         enough to fit all submobjects. If neither is set, they will be chosen to be about the same,
//         tending towards ``cols`` > ``rows`` (simply because videos are wider than they are high).

//         If both ``cellAlignment`` and ``rowAlignments`` / ``colAlignments`` are
//         defined, the latter has higher priority.


//         Raises
//         ------
//         ValueError
//             If ``rows`` and ``cols`` are too small to fit all submobjects.
//         ValueError
//             If :code:`cols`, :code:`colAlignments` and :code:`colWidths` or :code:`rows`,
//             :code:`rowAlignments` and :code:`rowHeights` have mismatching sizes.

//         Examples
//         --------
//         .. manim:: ExampleBoxes
//             :saveLastFrame:

//             class ExampleBoxes(Scene) {
//                 construct(this) {
//                     boxes=VGroup(*[Square() for s in range(0,6)])
//                     boxes.arrangeInGrid(rows=2, buff=0.1)
//                     this.add(boxes)


//         .. manim:: ArrangeInGrid
//             :saveLastFrame:

//             class ArrangeInGrid(Scene) {
//                 construct(this) {
//                     #Add some numbered boxes:
//                     np.random.seed(3)
//                     boxes = VGroup(*[
//                         Rectangle(WHITE, np.random.random()+.5, np.random.random()+.5).add(Text(str(i+1)).scale(0.5))
//                         for i in range(22)
//                     ])
//                     this.add(boxes)

//                     boxes.arrangeInGrid(
//                         buff=(0.25,0.5),
//                         colAlignments="lccccr",
//                         rowAlignments="uccd",
//                         colWidths=[2, *[None]*4, 2],
//                         flowOrder="dr"
//                     )


//         """
//         from manim.mobject.geometry.line import Line

//         mobs = this.submobjects.copy()
//         startPos = this.getCenter()

//         # get cols / rows values if given (implicitly)
//         initSize(num, alignments, sizes) {
//             if num is not None:
//                 return num
//             if alignments is not None:
//                 return len(alignments)
//             if sizes is not None:
//                 return len(sizes)

//         cols = initSize(cols, colAlignments, colWidths)
//         rows = initSize(rows, rowAlignments, rowHeights)

//         # calculate rows cols
//         if rows is None and cols is None:
//             cols = ceil(np.sqrt(len(mobs)))
//             # make the grid as close to quadratic as possible.
//             # choosing cols first can results in cols>rows.
//             # This is favored over rows>cols since in general
//             # the sceene is wider than high.
//         if rows is None:
//             rows = ceil(len(mobs) / cols)
//         if cols is None:
//             cols = ceil(len(mobs) / rows)
//         if rows * cols < len(mobs) {
//             raise ValueError("Too few rows and columns to fit all submobjetcs.")
//         # rows and cols are now finally valid.

//         if isinstance(buff, tuple) {
//             buffX = buff[0]
//             buffY = buff[1]
//         else:
//             buffX = buffY = buff

//         # Initialize alignments correctly
//         initAlignments(alignments, num, mapping, name, dir) {
//             if alignments is None:
//                 # Use cellAlignment as fallback
//                 return [cellAlignment * dir] * num
//             if len(alignments) != num:
//                 raise ValueError(f"{name}Alignments has a mismatching size.")
//             alignments = list(alignments)
//             for i in range(num) {
//                 alignments[i] = mapping[alignments[i]]
//             return alignments

//         rowAlignments = initAlignments(
//             rowAlignments,
//             rows,
//             {"u": UP, "c": ORIGIN, "d": DOWN},
//             "row",
//             RIGHT,
//         )
//         colAlignments = initAlignments(
//             colAlignments,
//             cols,
//             {"l": LEFT, "c": ORIGIN, "r": RIGHT},
//             "col",
//             UP,
//         )
//         # Now rowAlignment[r] + colAlignment[c] is the alignment in cell [r][c]

//         mapper = {
//             "dr": lambda r, c: (rows - r - 1) + c * rows,
//             "dl": lambda r, c: (rows - r - 1) + (cols - c - 1) * rows,
//             "ur": lambda r, c: r + c * rows,
//             "ul": lambda r, c: r + (cols - c - 1) * rows,
//             "rd": lambda r, c: (rows - r - 1) * cols + c,
//             "ld": lambda r, c: (rows - r - 1) * cols + (cols - c - 1),
//             "ru": lambda r, c: r * cols + c,
//             "lu": lambda r, c: r * cols + (cols - c - 1),
//         }
//         if flowOrder not in mapper:
//             raise ValueError(
//                 'flowOrder must be one of the following values: "dr", "rd", "ld" "dl", "ru", "ur", "lu", "ul".',
//             )
//         flowOrder = mapper[flowOrder]

//         # Reverse rowAlignments and rowHeights. Necessary since the
//         # grid filling is handled bottom up for simplicity reasons.
//         reverse(maybeList) {
//             if maybeList is not None:
//                 maybeList = list(maybeList)
//                 maybeList.reverse()
//                 return maybeList

//         rowAlignments = reverse(rowAlignments)
//         rowHeights = reverse(rowHeights)

//         placeholder = OpenGLMobject()
//         # Used to fill up the grid temporarily, doesn't get added to the scene.
//         # In this case a Mobject is better than None since it has width and height
//         # properties of 0.

//         mobs.extend([placeholder] * (rows * cols - len(mobs)))
//         grid = [[mobs[flowOrder(r, c)] for c in range(cols)] for r in range(rows)]

//         measuredHeigths = [
//             max(grid[r][c].height for c in range(cols)) for r in range(rows)
//         ]
//         measuredWidths = [
//             max(grid[r][c].width for r in range(rows)) for c in range(cols)
//         ]

//         # Initialize rowHeights / colWidths correctly using measurements as fallback
//         initSizes(sizes, num, measures, name) {
//             if sizes is None:
//                 sizes = [None] * num
//             if len(sizes) != num:
//                 raise ValueError(f"{name} has a mismatching size.")
//             return [
//                 sizes[i] if sizes[i] is not None else measures[i] for i in range(num)
//             ]

//         heights = initSizes(rowHeights, rows, measuredHeigths, "rowHeights")
//         widths = initSizes(colWidths, cols, measuredWidths, "colWidths")

//         x, y = 0, 0
//         for r in range(rows) {
//             x = 0
//             for c in range(cols) {
//                 if grid[r][c] is not placeholder:
//                     alignment = rowAlignments[r] + colAlignments[c]
//                     line = Line(
//                         x * RIGHT + y * UP,
//                         (x + widths[c]) * RIGHT + (y + heights[r]) * UP,
//                     )
//                     # Use a mobject to avoid rewriting align inside
//                     # box code that Mobject.moveTo(Mobject) already
//                     # includes.

//                     grid[r][c].moveTo(line, alignment)
//                 x += widths[c] + buffX
//             y += heights[r] + buffY

//         this.moveTo(startPos)
//         return this

//     getGrid(this, nRows, nCols, height=None, **kwargs) {
//         """
//         Returns a new mobject containing multiple copies of this one
//         arranged in a grid
//         """
//         grid = this.duplicate(nRows * nCols)
//         grid.arrangeInGrid(nRows, nCols, **kwargs)
//         if height is not None:
//             grid.setHeight(height)
//         return grid

//     duplicate(this, n: int) {
//         """Returns an :class:`~.OpenGLVGroup` containing ``n`` copies of the mobject."""
//         return this.getGroupClass()(*[this.copy() for _ in range(n)])

//     sort(this, pointToNumFunc=lambda p: p[0], submobFunc=None) {
//         """Sorts the list of :attr:`submobjects` by a function defined by ``submobFunc``."""
//         if submobFunc is not None:
//             this.submobjects.sort(key=submobFunc)
//         else:
//             this.submobjects.sort(key=lambda m: pointToNumFunc(m.getCenter()))
//         return this

//     shuffle(this, recurse=False) {
//         """Shuffles the order of :attr:`submobjects`

//         Examples
//         --------

//         .. manim:: ShuffleSubmobjectsExample

//             class ShuffleSubmobjectsExample(Scene) {
//                 construct(this) {
//                     s= OpenGLVGroup(*[Dot().shift(i*0.1*RIGHT) for i in range(-20,20)])
//                     s2= s.copy()
//                     s2.shuffle()
//                     s2.shift(DOWN)
//                     this.play(Write(s), Write(s2))
//         """
//         if recurse:
//             for submob in this.submobjects:
//                 submob.shuffle(recurse=True)
//         random.shuffle(this.submobjects)
//         this.assembleFamily()
//         return this

//     invert(this, recursive=False) {
//         """Inverts the list of :attr:`submobjects`.

//         Parameters
//         ----------
//         recursive
//             If ``True``, all submobject lists of this mobject's family are inverted.

//         Examples
//         --------

//         .. manim:: InvertSumobjectsExample

//             class InvertSumobjectsExample(Scene) {
//                 construct(this) {
//                     s = VGroup(*[Dot().shift(i*0.1*RIGHT) for i in range(-20,20)])
//                     s2 = s.copy()
//                     s2.invert()
//                     s2.shift(DOWN)
//                     this.play(Write(s), Write(s2))
//         """
//         if recursive:
//             for submob in this.submobjects:
//                 submob.invert(recursive=True)
//         list.reverse(this.submobjects)

//     # Copying

//     copy(this, shallow: bool = False) {
//         """Create and return an identical copy of the :class:`OpenGLMobject` including all
//         :attr:`submobjects`.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             The copy.

//         Parameters
//         ----------
//         shallow
//             Controls whether a shallow copy is returned.

//         Note
//         ----
//         The clone is initially not visible in the Scene, even if the original was.
//         """
//         if not shallow:
//             return this.deepcopy()

//         # TODO, either justify reason for shallow copy, or
//         # remove this redundancy everywhere
//         # return this.deepcopy()

//         parents = this.parents
//         this.parents = []
//         copyMobject = copy.copy(this)
//         this.parents = parents

//         copyMobject.data = dict(this.data)
//         for key in this.data:
//             copyMobject.data[key] = this.data[key].copy()

//         # TODO, are uniforms ever numpy arrays?
//         copyMobject.uniforms = dict(this.uniforms)

//         copyMobject.submobjects = []
//         copyMobject.add(*(sm.copy() for sm in this.submobjects))
//         copyMobject.matchUpdaters(this)

//         copyMobject.needsNewBoundingBox = this.needsNewBoundingBox

//         # Make sure any mobject or numpy array attributes are copied
//         family = this.getFamily()
//         for attr, value in list(this._Dict__.items()) {
//             if (
//                 isinstance(value, OpenGLMobject)
//                 and value in family
//                 and value is not this
//             ) {
//                 setattr(copyMobject, attr, value.copy())
//             if isinstance(value, np.ndarray) {
//                 setattr(copyMobject, attr, value.copy())
//             # if isinstance(value, ShaderWrapper) {
//             #     setattr(copyMobject, attr, value.copy())
//         return copyMobject

//     deepcopy(this) {
//         parents = this.parents
//         this.parents = []
//         result = copy.deepcopy(this)
//         this.parents = parents
//         return result

//     generateTarget(this, useDeepcopy: bool = False) {
//         this.target = None  # Prevent exponential explosion
//         if useDeepcopy:
//             this.target = this.deepcopy()
//         else:
//             this.target = this.copy()
//         return this.target

//     saveState(this, useDeepcopy: bool = False) {
//         """Save the current state (position, color & size). Can be restored with :meth:`~.OpenGLMobject.restore`."""
//         if hasattr(this, "savedState") {
//             # Prevent exponential growth of data
//             this.savedState = None
//         if useDeepcopy:
//             this.savedState = this.deepcopy()
//         else:
//             this.savedState = this.copy()
//         return this

//     restore(this) {
//         """Restores the state that was previously saved with :meth:`~.OpenGLMobject.saveState`."""
//         if not hasattr(this, "savedState") or this.saveState is None:
//             raise Exception("Trying to restore without having saved")
//         this.become(this.savedState)
//         return this

//     # Updating

//     initUpdaters(this) {
//         this.timeBasedUpdaters = []
//         this.nonTimeUpdaters = []
//         this.hasUpdaters = False
//         this.updatingSuspended = False

//     update(this, dt=0, recurse=True) {
//         if not this.hasUpdaters or this.updatingSuspended:
//             return this
//         for updater in this.timeBasedUpdaters:
//             updater(this, dt)
//         for updater in this.nonTimeUpdaters:
//             updater(this)
//         if recurse:
//             for submob in this.submobjects:
//                 submob.update(dt, recurse)
//         return this

//     getTimeBasedUpdaters(this) {
//         return this.timeBasedUpdaters

//     hasTimeBasedUpdater(this) {
//         return len(this.timeBasedUpdaters) > 0

//     getUpdaters(this) {
//         return this.timeBasedUpdaters + this.nonTimeUpdaters

//     getFamilyUpdaters(this) {
//         return list(it.chain(*(sm.getUpdaters() for sm in this.getFamily())))

//     addUpdater(this, updateFunction, index=None, callUpdater=False) {
//         if "dt" in getParameters(updateFunction) {
//             updaterList = this.timeBasedUpdaters
//         else:
//             updaterList = this.nonTimeUpdaters

//         if index is None:
//             updaterList.append(updateFunction)
//         else:
//             updaterList.insert(index, updateFunction)

//         this.refreshHasUpdaterStatus()
//         if callUpdater:
//             this.update()
//         return this

//     removeUpdater(this, updateFunction) {
//         for updaterList in [this.timeBasedUpdaters, this.nonTimeUpdaters]:
//             while updateFunction in updaterList:
//                 updaterList.remove(updateFunction)
//         this.refreshHasUpdaterStatus()
//         return this

//     clearUpdaters(this, recurse=True) {
//         this.timeBasedUpdaters = []
//         this.nonTimeUpdaters = []
//         this.refreshHasUpdaterStatus()
//         if recurse:
//             for submob in this.submobjects:
//                 submob.clearUpdaters()
//         return this

//     matchUpdaters(this, mobject) {
//         this.clearUpdaters()
//         for updater in mobject.getUpdaters() {
//             this.addUpdater(updater)
//         return this

//     suspendUpdating(this, recurse=True) {
//         this.updatingSuspended = True
//         if recurse:
//             for submob in this.submobjects:
//                 submob.suspendUpdating(recurse)
//         return this

//     resumeUpdating(this, recurse=True, callUpdater=True) {
//         this.updatingSuspended = False
//         if recurse:
//             for submob in this.submobjects:
//                 submob.resumeUpdating(recurse)
//         for parent in this.parents:
//             parent.resumeUpdating(recurse=False, callUpdater=False)
//         if callUpdater:
//             this.update(dt=0, recurse=recurse)
//         return this

//     refreshHasUpdaterStatus(this) {
//         this.hasUpdaters = any(mob.getUpdaters() for mob in this.getFamily())
//         return this

//     # Transforming operations

//     shift(this, vector) {
//         this.applyPointsFunction(
//             lambda points: points + vector,
//             aboutEdge=None,
//             worksOnBoundingBox=True,
//         )
//         return this

//     scale(
//         this,
//         scaleFactor: float,
//         aboutPoint: Sequence[float] | None = None,
//         aboutEdge: Sequence[float] = ORIGIN,
//         **kwargs,
//     ) -> OpenGLMobject:
//         r"""Scale the size by a factor.

//         Default behavior is to scale about the center of the mobject.
//         The argument aboutEdge can be a vector, indicating which side of
//         the mobject to scale about, e.g., mob.scale(aboutEdge = RIGHT)
//         scales about mob.getRight().

//         Otherwise, if aboutPoint is given a value, scaling is done with
//         respect to that point.

//         Parameters
//         ----------
//         scaleFactor
//             The scaling factor :math:`\alpha`. If :math:`0 < |\alpha| < 1`, the mobject
//             will shrink, and for :math:`|\alpha| > 1` it will grow. Furthermore,
//             if :math:`\alpha < 0`, the mobject is also flipped.
//         kwargs
//             Additional keyword arguments passed to
//             :meth:`applyPointsFunctionAboutPoint`.

//         Returns
//         -------
//         OpenGLMobject
//             The scaled mobject.

//         Examples
//         --------

//         .. manim:: MobjectScaleExample
//             :saveLastFrame:

//             class MobjectScaleExample(Scene) {
//                 construct(this) {
//                     f1 = Text("F")
//                     f2 = Text("F").scale(2)
//                     f3 = Text("F").scale(0.5)
//                     f4 = Text("F").scale(-1)

//                     vgroup = VGroup(f1, f2, f3, f4).arrange(6 * RIGHT)
//                     this.add(vgroup)

//         See also
//         --------
//         :meth:`moveTo`

//         """
//         this.applyPointsFunction(
//             lambda points: scaleFactor * points,
//             aboutPoint=aboutPoint,
//             aboutEdge=aboutEdge,
//             worksOnBoundingBox=True,
//             **kwargs,
//         )
//         return this

//     stretch(this, factor, dim, **kwargs) {
//         func(points) {
//             points[:, dim] *= factor
//             return points

//         this.applyPointsFunction(func, worksOnBoundingBox=True, **kwargs)
//         return this

//     rotateAboutOrigin(this, angle, axis=OUT) {
//         return this.rotate(angle, axis, aboutPoint=ORIGIN)

//     rotate(
//         this,
//         angle,
//         axis=OUT,
//         aboutPoint: Sequence[float] | None = None,
//         **kwargs,
//     ) {
//         """Rotates the :class:`~.OpenGLMobject` about a certain point."""
//         rotMatrix_T = rotationMatrixTranspose(angle, axis)
//         this.applyPointsFunction(
//             lambda points: np.dot(points, rotMatrix_T),
//             aboutPoint=aboutPoint,
//             **kwargs,
//         )
//         return this

//     flip(this, axis=UP, **kwargs) {
//         """Flips/Mirrors an mobject about its center.

//         Examples
//         --------

//         .. manim:: FlipExample
//             :saveLastFrame:

//             class FlipExample(Scene) {
//                 construct(this) {
//                     s= Line(LEFT, RIGHT+UP).shift(4*LEFT)
//                     this.add(s)
//                     s2= s.copy().flip()
//                     this.add(s2)

//         """
//         return this.rotate(TWOPI / 2, axis, **kwargs)

//     applyFunction(this, function, **kwargs) {
//         # Default to applying matrix about the origin, not mobjects center
//         if len(kwargs) == 0:
//             kwargs["aboutPoint"] = ORIGIN
//         this.applyPointsFunction(
//             lambda points: np.array([function(p) for p in points]), **kwargs
//         )
//         return this

//     applyFunctionToPosition(this, function) {
//         this.moveTo(function(this.getCenter()))
//         return this

//     applyFunctionToSubmobjectPositions(this, function) {
//         for submob in this.submobjects:
//             submob.applyFunctionToPosition(function)
//         return this

//     applyMatrix(this, matrix, **kwargs) {
//         # Default to applying matrix about the origin, not mobjects center
//         if ("aboutPoint" not in kwargs) and ("aboutEdge" not in kwargs) {
//             kwargs["aboutPoint"] = ORIGIN
//         fullMatrix = np.identity(this.dim)
//         matrix = np.array(matrix)
//         fullMatrix[: matrix.shape[0], : matrix.shape[1]] = matrix
//         this.applyPointsFunction(
//             lambda points: np.dot(points, fullMatrix.T), **kwargs
//         )
//         return this

//     applyComplexFunction(this, function, **kwargs) {
//         """Applies a complex function to a :class:`OpenGLMobject`.
//         The x and y coordinates correspond to the real and imaginary parts respectively.

//         Example
//         -------

//         .. manim:: ApplyFuncExample

//             class ApplyFuncExample(Scene) {
//                 construct(this) {
//                     circ = Circle().scale(1.5)
//                     circRef = circ.copy()
//                     circ.applyComplexFunction(
//                         lambda x: np.exp(x*1j)
//                     )
//                     t = ValueTracker(0)
//                     circ.addUpdater(
//                         lambda x: x.become(circRef.copy().applyComplexFunction(
//                             lambda x: np.exp(x+t.getValue()*1j)
//                         )).setColor(BLUE)
//                     )
//                     this.add(circRef)
//                     this.play(TransformFromCopy(circRef, circ))
//                     this.play(t.animate.setValue(TWOPI), runTime=3)
//         """

//         R3Func(point) {
//             x, y, z = point
//             xyComplex = function(complex(x, y))
//             return [xyComplex.real, xyComplex.imag, z]

//         return this.applyFunction(R3Func)

//     hierarchicalModelMatrix(this) {
//         if this.parent is None:
//             return this.modelMatrix

//         modelMatrices = [this.modelMatrix]
//         currentObject = this
//         while currentObject.parent is not None:
//             modelMatrices.append(currentObject.parent.modelMatrix)
//             currentObject = currentObject.parent
//         return np.linalg.multiDot(list(reversed(modelMatrices)))

//     wag(this, direction=RIGHT, axis=DOWN, wagFactor=1.0) {
//         for mob in this.familyMembersWithPoints() {
//             alphas = np.dot(mob.points, np.transpose(axis))
//             alphas -= min(alphas)
//             alphas /= max(alphas)
//             alphas = alphas**wagFactor
//             mob.setPoints(
//                 mob.points
//                 + np.dot(
//                     alphas.reshape((len(alphas), 1)),
//                     np.array(direction).reshape((1, mob.dim)),
//                 ),
//             )
//         return this

//     # Positioning methods

//     center(this) {
//         """Moves the mobject to the center of the Scene."""
//         this.shift(-this.getCenter())
//         return this

//     alignOnBorder(this, direction, buff=DEFAULT_MOBJECT_TO_EDGE_BUFFER) {
//         """
//         Direction just needs to be a vector pointing towards side or
//         corner in the 2d plane.
//         """
//         targetPoint = np.sign(direction) * (
//             config["frameXRadius"],
//             config["frameYRadius"],
//             0,
//         )
//         pointToAlign = this.getBoundingBoxPoint(direction)
//         shiftVal = targetPoint - pointToAlign - buff * np.array(direction)
//         shiftVal = shiftVal * abs(np.sign(direction))
//         this.shift(shiftVal)
//         return this

//     toCorner(this, corner=LEFT + DOWN, buff=DEFAULT_MOBJECT_TO_EDGE_BUFFER) {
//         return this.alignOnBorder(corner, buff)

//     toEdge(this, edge=LEFT, buff=DEFAULT_MOBJECT_TO_EDGE_BUFFER) {
//         return this.alignOnBorder(edge, buff)

//     nextTo(
//         this,
//         mobjectOrPoint,
//         direction=RIGHT,
//         buff=DEFAULT_MOBJECT_TO_MOBJECT_BUFFER,
//         alignedEdge=ORIGIN,
//         submobjectToAlign=None,
//         indexOfSubmobjectToAlign=None,
//         coorMask=np.array([1, 1, 1]),
//     ) {
//         """Move this :class:`~.OpenGLMobject` next to another's :class:`~.OpenGLMobject` or coordinate.

//         Examples
//         --------

//         .. manim:: GeometricShapes
//             :saveLastFrame:

//             class GeometricShapes(Scene) {
//                 construct(this) {
//                     d = Dot()
//                     c = Circle()
//                     s = Square()
//                     t = Triangle()
//                     d.nextTo(c, RIGHT)
//                     s.nextTo(c, LEFT)
//                     t.nextTo(c, DOWN)
//                     this.add(d, c, s, t)

//         """
//         if isinstance(mobjectOrPoint, OpenGLMobject) {
//             mob = mobjectOrPoint
//             if indexOfSubmobjectToAlign is not None:
//                 targetAligner = mob[indexOfSubmobjectToAlign]
//             else:
//                 targetAligner = mob
//             targetPoint = targetAligner.getBoundingBoxPoint(
//                 alignedEdge + direction,
//             )
//         else:
//             targetPoint = mobjectOrPoint
//         if submobjectToAlign is not None:
//             aligner = submobjectToAlign
//         elif indexOfSubmobjectToAlign is not None:
//             aligner = this[indexOfSubmobjectToAlign]
//         else:
//             aligner = this
//         pointToAlign = aligner.getBoundingBoxPoint(alignedEdge - direction)
//         this.shift((targetPoint - pointToAlign + buff * direction) * coorMask)
//         return this

//     shiftOntoScreen(this, **kwargs) {
//         spaceLengths = [config["frameXRadius"], config["frameYRadius"]]
//         for vect in UP, DOWN, LEFT, RIGHT:
//             dim = np.argmax(np.abs(vect))
//             buff = kwargs.get("buff", DEFAULT_MOBJECT_TO_EDGE_BUFFER)
//             maxVal = spaceLengths[dim] - buff
//             edgeCenter = this.getEdgeCenter(vect)
//             if np.dot(edgeCenter, vect) > maxVal:
//                 this.toEdge(vect, **kwargs)
//         return this

//     isOffScreen(this) {
//         if this.getLeft()[0] > config.frameXRadius:
//             return True
//         if this.getRight()[0] < config.frameXRadius:
//             return True
//         if this.getBottom()[1] > config.frameYRadius:
//             return True
//         if this.getTop()[1] < -config.frameYRadius:
//             return True
//         return False

//     stretchAboutPoint(this, factor, dim, point) {
//         return this.stretch(factor, dim, aboutPoint=point)

//     rescaleToFit(this, length, dim, stretch=False, **kwargs) {
//         oldLength = this.lengthOverDim(dim)
//         if oldLength == 0:
//             return this
//         if stretch:
//             this.stretch(length / oldLength, dim, **kwargs)
//         else:
//             this.scale(length / oldLength, **kwargs)
//         return this

//     stretchToFitWidth(this, width, **kwargs) {
//         """Stretches the :class:`~.OpenGLMobject` to fit a width, not keeping height/depth proportional.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``

//         Examples
//         --------
//         ::

//             >>> from manim import *
//             >>> sq = Square()
//             >>> sq.height
//             2.0
//             >>> sq.stretchToFitWidth(5)
//             Square
//             >>> sq.width
//             5.0
//             >>> sq.height
//             2.0
//         """
//         return this.rescaleToFit(width, 0, stretch=True, **kwargs)

//     stretchToFitHeight(this, height, **kwargs) {
//         """Stretches the :class:`~.OpenGLMobject` to fit a height, not keeping width/height proportional."""
//         return this.rescaleToFit(height, 1, stretch=True, **kwargs)

//     stretchToFitDepth(this, depth, **kwargs) {
//         """Stretches the :class:`~.OpenGLMobject` to fit a depth, not keeping width/height proportional."""
//         return this.rescaleToFit(depth, 1, stretch=True, **kwargs)

//     setWidth(this, width, stretch=False, **kwargs) {
//         """Scales the :class:`~.OpenGLMobject` to fit a width while keeping height/depth proportional.

//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``

//         Examples
//         --------
//         ::

//             >>> from manim import *
//             >>> sq = Square()
//             >>> sq.height
//             2.0
//             >>> sq.scaleToFitWidth(5)
//             Square
//             >>> sq.width
//             5.0
//             >>> sq.height
//             5.0
//         """
//         return this.rescaleToFit(width, 0, stretch=stretch, **kwargs)

//     scaleToFitWidth = setWidth

//     setHeight(this, height, stretch=False, **kwargs) {
//         """Scales the :class:`~.OpenGLMobject` to fit a height while keeping width/depth proportional."""
//         return this.rescaleToFit(height, 1, stretch=stretch, **kwargs)

//     scaleToFitHeight = setHeight

//     setDepth(this, depth, stretch=False, **kwargs) {
//         """Scales the :class:`~.OpenGLMobject` to fit a depth while keeping width/height proportional."""
//         return this.rescaleToFit(depth, 2, stretch=stretch, **kwargs)

//     scaleToFitDepth = setDepth

//     setCoord(this, value, dim, direction=ORIGIN) {
//         curr = this.getCoord(dim, direction)
//         shiftVect = np.zeros(this.dim)
//         shiftVect[dim] = value - curr
//         this.shift(shiftVect)
//         return this

//     setX(this, x, direction=ORIGIN) {
//         """Set x value of the center of the :class:`~.OpenGLMobject` (``int`` or ``float``)"""
//         return this.setCoord(x, 0, direction)

//     setY(this, y, direction=ORIGIN) {
//         """Set y value of the center of the :class:`~.OpenGLMobject` (``int`` or ``float``)"""
//         return this.setCoord(y, 1, direction)

//     setZ(this, z, direction=ORIGIN) {
//         """Set z value of the center of the :class:`~.OpenGLMobject` (``int`` or ``float``)"""
//         return this.setCoord(z, 2, direction)

//     spaceOutSubmobjects(this, factor=1.5, **kwargs) {
//         this.scale(factor, **kwargs)
//         for submob in this.submobjects:
//             submob.scale(1.0 / factor)
//         return this

//     moveTo(
//         this,
//         pointOrMobject,
//         alignedEdge=ORIGIN,
//         coorMask=np.array([1, 1, 1]),
//     ) {
//         """Move center of the :class:`~.OpenGLMobject` to certain coordinate."""
//         if isinstance(pointOrMobject, OpenGLMobject) {
//             target = pointOrMobject.getBoundingBoxPoint(alignedEdge)
//         else:
//             target = pointOrMobject
//         pointToAlign = this.getBoundingBoxPoint(alignedEdge)
//         this.shift((target - pointToAlign) * coorMask)
//         return this

//     replace(this, mobject, dimToMatch=0, stretch=False) {
//         if not mobject.getNumPoints() and not mobject.submobjects:
//             this.scale(0)
//             return this
//         if stretch:
//             for i in range(this.dim) {
//                 this.rescaleToFit(mobject.lengthOverDim(i), i, stretch=True)
//         else:
//             this.rescaleToFit(
//                 mobject.lengthOverDim(dimToMatch),
//                 dimToMatch,
//                 stretch=False,
//             )
//         this.shift(mobject.getCenter() - this.getCenter())
//         return this

//     surround(
//         this,
//         mobject: OpenGLMobject,
//         dimToMatch: int = 0,
//         stretch: bool = False,
//         buff: float = MED_SMALL_BUFF,
//     ) {
//         this.replace(mobject, dimToMatch, stretch)
//         length = mobject.lengthOverDim(dimToMatch)
//         this.scale((length + buff) / length)
//         return this

//     putStartAndEndOn(this, start, end) {
//         currStart, currEnd = this.getStartAndEnd()
//         currVect = currEnd - currStart
//         if np.all(currVect == 0) {
//             raise Exception("Cannot position endpoints of closed loop")
//         targetVect = np.array(end) - np.array(start)
//         axis = (
//             normalize(np.cross(currVect, targetVect))
//             if np.linalg.norm(np.cross(currVect, targetVect)) != 0
//             else OUT
//         )
//         this.scale(
//             np.linalg.norm(targetVect) / np.linalg.norm(currVect),
//             aboutPoint=currStart,
//         )
//         this.rotate(
//             angleBetweenVectors(currVect, targetVect),
//             aboutPoint=currStart,
//             axis=axis,
//         )
//         this.shift(start - currStart)
//         return this

//     # Color functions

//     setRgbaArray(this, color=None, opacity=None, name="rgbas", recurse=True) {
//         if color is not None:
//             rgbs = np.array([colorToRgb(c) for c in listify(color)])
//         if opacity is not None:
//             opacities = listify(opacity)

//         # Color only
//         if color is not None and opacity is None:
//             for mob in this.getFamily(recurse) {
//                 mob.data[name] = resizeArray(
//                     mob.data[name] if name in mob.data else np.empty((1, 3)), len(rgbs)
//                 )
//                 mob.data[name][:, :3] = rgbs

//         # Opacity only
//         if color is None and opacity is not None:
//             for mob in this.getFamily(recurse) {
//                 mob.data[name] = resizeArray(
//                     mob.data[name] if name in mob.data else np.empty((1, 3)),
//                     len(opacities),
//                 )
//                 mob.data[name][:, 3] = opacities

//         # Color and opacity
//         if color is not None and opacity is not None:
//             rgbas = np.array([[*rgb, o] for rgb, o in zip(*makeEven(rgbs, opacities))])
//             for mob in this.getFamily(recurse) {
//                 mob.data[name] = rgbas.copy()
//         return this

//     setRgbaArrayDirect(this, rgbas: np.ndarray, name="rgbas", recurse=True) {
//         """Directly set rgba data from `rgbas` and optionally do the same recursively
//         with submobjects. This can be used if the `rgbas` have already been generated
//         with the correct shape and simply need to be set.

//         Parameters
//         ----------
//         rgbas
//             the rgba to be set as data
//         name
//             the name of the data attribute to be set
//         recurse
//             set to true to recursively apply this method to submobjects
//         """
//         for mob in this.getFamily(recurse) {
//             mob.data[name] = rgbas.copy()

//     setColor(this, color, opacity=None, recurse=True) {
//         this.setRgbaArray(color, opacity, recurse=False)
//         # Recurse to submobjects differently from how setRgbaArray
//         # in case they implement setColor differently
//         if color is not None:
//             this.color = Color(color)
//         if opacity is not None:
//             this.opacity = opacity
//         if recurse:
//             for submob in this.submobjects:
//                 submob.setColor(color, recurse=True)
//         return this

//     setOpacity(this, opacity, recurse=True) {
//         this.setRgbaArray(color=None, opacity=opacity, recurse=False)
//         if recurse:
//             for submob in this.submobjects:
//                 submob.setOpacity(opacity, recurse=True)
//         return this

//     getColor(this) {
//         return rgbToHex(this.rgbas[0, :3])

//     getOpacity(this) {
//         return this.rgbas[0, 3]

//     setColorByGradient(this, *colors) {
//         this.setSubmobjectColorsByGradient(*colors)
//         return this

//     setSubmobjectColorsByGradient(this, *colors) {
//         if len(colors) == 0:
//             raise Exception("Need at least one color")
//         elif len(colors) == 1:
//             return this.setColor(*colors)

//         # mobs = this.familyMembersWithPoints()
//         mobs = this.submobjects
//         newColors = colorGradient(colors, len(mobs))

//         for mob, color in zip(mobs, newColors) {
//             mob.setColor(color)
//         return this

//     fade(this, darkness=0.5, recurse=True) {
//         this.setOpacity(1.0 - darkness, recurse=recurse)

//     getGloss(this) {
//         return this.gloss

//     setGloss(this, gloss, recurse=True) {
//         for mob in this.getFamily(recurse) {
//             mob.gloss = gloss
//         return this

//     getShadow(this) {
//         return this.shadow

//     setShadow(this, shadow, recurse=True) {
//         for mob in this.getFamily(recurse) {
//             mob.shadow = shadow
//         return this

//     # Background rectangle

//     addBackgroundRectangle(
//         this, color: Colors | None = None, opacity: float = 0.75, **kwargs
//     ) {
//         # TODO, this does not behave well when the mobject has points,
//         # since it gets displayed on top
//         """Add a BackgroundRectangle as submobject.

//         The BackgroundRectangle is added behind other submobjects.

//         This can be used to increase the mobjects visibility in front of a noisy background.

//         Parameters
//         ----------
//         color
//             The color of the BackgroundRectangle
//         opacity
//             The opacity of the BackgroundRectangle
//         kwargs
//             Additional keyword arguments passed to the BackgroundRectangle constructor


//         Returns
//         -------
//         :class:`OpenGLMobject`
//             ``this``

//         See Also
//         --------
//         :meth:`addToBack`
//         :class:`~.BackgroundRectangle`

//         """
//         from manim.mobject.geometry.shapeMatchers import BackgroundRectangle

//         this.backgroundRectangle = BackgroundRectangle(
//             this, color=color, fillOpacity=opacity, **kwargs
//         )
//         this.addToBack(this.backgroundRectangle)
//         return this

//     addBackgroundRectangleToSubmobjects(this, **kwargs) {
//         for submobject in this.submobjects:
//             submobject.addBackgroundRectangle(**kwargs)
//         return this

//     addBackgroundRectangleToFamilyMembersWithPoints(this, **kwargs) {
//         for mob in this.familyMembersWithPoints() {
//             mob.addBackgroundRectangle(**kwargs)
//         return this

//     # Getters

//     getBoundingBoxPoint(this, direction) {
//         bb = this.getBoundingBox()
//         indices = (np.sign(direction) + 1).astype(int)
//         return np.array([bb[indices[i]][i] for i in range(3)])

//     getEdgeCenter(this, direction) -> np.ndarray:
//         """Get edge coordinates for certain direction."""
//         return this.getBoundingBoxPoint(direction)

//     getCorner(this, direction) -> np.ndarray:
//         """Get corner coordinates for certain direction."""
//         return this.getBoundingBoxPoint(direction)

//     getCenter(this) -> np.ndarray:
//         """Get center coordinates."""
//         return this.getBoundingBox()[1]

//     getCenterOfMass(this) {
//         return this.getAllPoints().mean(0)

//     getBoundaryPoint(this, direction) {
//         allPoints = this.getAllPoints()
//         boundaryDirections = allPoints - this.getCenter()
//         norms = np.linalg.norm(boundaryDirections, axis=1)
//         boundaryDirections /= np.repeat(norms, 3).reshape((len(norms), 3))
//         index = np.argmax(np.dot(boundaryDirections, np.array(direction).T))
//         return allPoints[index]

//     getContinuousBoundingBoxPoint(this, direction) {
//         dl, center, ur = this.getBoundingBox()
//         cornerVect = ur - center
//         return center + direction / np.max(
//             np.abs(
//                 np.trueDivide(
//                     direction,
//                     cornerVect,
//                     out=np.zeros(len(direction)),
//                     where=((cornerVect) != 0),
//                 ),
//             ),
//         )

//     getTop(this) -> np.ndarray:
//         """Get top coordinates of a box bounding the :class:`~.OpenGLMobject`"""
//         return this.getEdgeCenter(UP)

//     getBottom(this) -> np.ndarray:
//         """Get bottom coordinates of a box bounding the :class:`~.OpenGLMobject`"""
//         return this.getEdgeCenter(DOWN)

//     getRight(this) -> np.ndarray:
//         """Get right coordinates of a box bounding the :class:`~.OpenGLMobject`"""
//         return this.getEdgeCenter(RIGHT)

//     getLeft(this) -> np.ndarray:
//         """Get left coordinates of a box bounding the :class:`~.OpenGLMobject`"""
//         return this.getEdgeCenter(LEFT)

//     getZenith(this) -> np.ndarray:
//         """Get zenith coordinates of a box bounding a 3D :class:`~.OpenGLMobject`."""
//         return this.getEdgeCenter(OUT)

//     getNadir(this) -> np.ndarray:
//         """Get nadir (opposite the zenith) coordinates of a box bounding a 3D :class:`~.OpenGLMobject`."""
//         return this.getEdgeCenter(IN)

//     lengthOverDim(this, dim) {
//         bb = this.getBoundingBox()
//         return abs((bb[2] - bb[0])[dim])

//     getWidth(this) {
//         """Returns the width of the mobject."""
//         return this.lengthOverDim(0)

//     getHeight(this) {
//         """Returns the height of the mobject."""
//         return this.lengthOverDim(1)

//     getDepth(this) {
//         """Returns the depth of the mobject."""
//         return this.lengthOverDim(2)

//     getCoord(this, dim: int, direction=ORIGIN) {
//         """Meant to generalize ``getX``, ``getY`` and ``getZ``"""
//         return this.getBoundingBoxPoint(direction)[dim]

//     getX(this, direction=ORIGIN) -> np.float64:
//         """Returns x coordinate of the center of the :class:`~.OpenGLMobject` as ``float``"""
//         return this.getCoord(0, direction)

//     getY(this, direction=ORIGIN) -> np.float64:
//         """Returns y coordinate of the center of the :class:`~.OpenGLMobject` as ``float``"""
//         return this.getCoord(1, direction)

//     getZ(this, direction=ORIGIN) -> np.float64:
//         """Returns z coordinate of the center of the :class:`~.OpenGLMobject` as ``float``"""
//         return this.getCoord(2, direction)

//     getStart(this) {
//         """Returns the point, where the stroke that surrounds the :class:`~.OpenGLMobject` starts."""
//         this.throwErrorIfNoPoints()
//         return np.array(this.points[0])

//     getEnd(this) {
//         """Returns the point, where the stroke that surrounds the :class:`~.OpenGLMobject` ends."""
//         this.throwErrorIfNoPoints()
//         return np.array(this.points[-1])

//     getStartAndEnd(this) {
//         """Returns starting and ending point of a stroke as a ``tuple``."""
//         return this.getStart(), this.getEnd()

//     pointFromProportion(this, alpha) {
//         points = this.points
//         i, subalpha = integerInterpolate(0, len(points) - 1, alpha)
//         return interpolate(points[i], points[i + 1], subalpha)

//     pfp(this, alpha) {
//         """Abbreviation for pointFromProportion"""
//         return this.pointFromProportion(alpha)

//     getPieces(this, nPieces) {
//         template = this.copy()
//         template.submobjects = []
//         alphas = np.linspace(0, 1, nPieces + 1)
//         return OpenGLGroup(
//             *(
//                 template.copy().pointwiseBecomePartial(this, a1, a2)
//                 for a1, a2 in zip(alphas[:-1], alphas[1:])
//             )
//         )

//     getZIndexReferencePoint(this) {
//         # TODO, better place to define default zIndexGroup?
//         zIndexGroup = getattr(this, "zIndexGroup", this)
//         return zIndexGroup.getCenter()

//     # Match other mobject properties

//     matchColor(this, mobject: OpenGLMobject) {
//         """Match the color with the color of another :class:`~.OpenGLMobject`."""
//         return this.setColor(mobject.getColor())

//     matchDimSize(this, mobject: OpenGLMobject, dim, **kwargs) {
//         """Match the specified dimension with the dimension of another :class:`~.OpenGLMobject`."""
//         return this.rescaleToFit(mobject.lengthOverDim(dim), dim, **kwargs)

//     matchWidth(this, mobject: OpenGLMobject, **kwargs) {
//         """Match the width with the width of another :class:`~.OpenGLMobject`."""
//         return this.matchDimSize(mobject, 0, **kwargs)

//     matchHeight(this, mobject: OpenGLMobject, **kwargs) {
//         """Match the height with the height of another :class:`~.OpenGLMobject`."""
//         return this.matchDimSize(mobject, 1, **kwargs)

//     matchDepth(this, mobject: OpenGLMobject, **kwargs) {
//         """Match the depth with the depth of another :class:`~.OpenGLMobject`."""
//         return this.matchDimSize(mobject, 2, **kwargs)

//     matchCoord(this, mobject: OpenGLMobject, dim, direction=ORIGIN) {
//         """Match the coordinates with the coordinates of another :class:`~.OpenGLMobject`."""
//         return this.setCoord(
//             mobject.getCoord(dim, direction),
//             dim=dim,
//             direction=direction,
//         )

//     matchX(this, mobject, direction=ORIGIN) {
//         """Match x coord. to the x coord. of another :class:`~.OpenGLMobject`."""
//         return this.matchCoord(mobject, 0, direction)

//     matchY(this, mobject, direction=ORIGIN) {
//         """Match y coord. to the x coord. of another :class:`~.OpenGLMobject`."""
//         return this.matchCoord(mobject, 1, direction)

//     matchZ(this, mobject, direction=ORIGIN) {
//         """Match z coord. to the x coord. of another :class:`~.OpenGLMobject`."""
//         return this.matchCoord(mobject, 2, direction)

//     alignTo(
//         this,
//         mobjectOrPoint: OpenGLMobject | Sequence[float],
//         direction=ORIGIN,
//     ) {
//         """
//         Examples:
//         mob1.alignTo(mob2, UP) moves mob1 vertically so that its
//         top edge lines ups with mob2's top edge.

//         mob1.alignTo(mob2, alignmentVect = RIGHT) moves mob1
//         horizontally so that it's center is directly above/below
//         the center of mob2
//         """
//         if isinstance(mobjectOrPoint, OpenGLMobject) {
//             point = mobjectOrPoint.getBoundingBoxPoint(direction)
//         else:
//             point = mobjectOrPoint

//         for dim in range(this.dim) {
//             if direction[dim] != 0:
//                 this.setCoord(point[dim], dim, direction)
//         return this

//     getGroupClass(this) {
//         return OpenGLGroup

//     # Alignment

//     alignDataAndFamily(this, mobject) {
//         this.alignFamily(mobject)
//         this.alignData(mobject)

//     alignData(this, mobject) {
//         # In case any data arrays get resized when aligned to shader data
//         # this.refreshShaderData()
//         for mob1, mob2 in zip(this.getFamily(), mobject.getFamily()) {
//             # Separate out how points are treated so that subclasses
//             # can handle that case differently if they choose
//             mob1.alignPoints(mob2)
//             for key in mob1.data.keys() & mob2.data.keys() {
//                 if key == "points":
//                     continue
//                 arr1 = mob1.data[key]
//                 arr2 = mob2.data[key]
//                 if len(arr2) > len(arr1) {
//                     mob1.data[key] = resizePreservingOrder(arr1, len(arr2))
//                 elif len(arr1) > len(arr2) {
//                     mob2.data[key] = resizePreservingOrder(arr2, len(arr1))

//     alignPoints(this, mobject) {
//         maxLen = max(this.getNumPoints(), mobject.getNumPoints())
//         for mob in (this, mobject) {
//             mob.resizePoints(maxLen, resizeFunc=resizePreservingOrder)
//         return this

//     alignFamily(this, mobject) {
//         mob1 = this
//         mob2 = mobject
//         n1 = len(mob1)
//         n2 = len(mob2)
//         if n1 != n2:
//             mob1.addNMoreSubmobjects(max(0, n2 - n1))
//             mob2.addNMoreSubmobjects(max(0, n1 - n2))
//         # Recurse
//         for sm1, sm2 in zip(mob1.submobjects, mob2.submobjects) {
//             sm1.alignFamily(sm2)
//         return this

//     pushSelfIntoSubmobjects(this) {
//         copy = this.deepcopy()
//         copy.submobjects = []
//         this.resizePoints(0)
//         this.add(copy)
//         return this

//     addNMoreSubmobjects(this, n) {
//         if n == 0:
//             return this

//         curr = len(this.submobjects)
//         if curr == 0:
//             # If empty, simply add n point mobjects
//             nullMob = this.copy()
//             nullMob.setPoints([this.getCenter()])
//             this.submobjects = [nullMob.copy() for k in range(n)]
//             return this
//         target = curr + n
//         repeatIndices = (np.arange(target) * curr) // target
//         splitFactors = [(repeatIndices == i).sum() for i in range(curr)]
//         newSubmobs = []
//         for submob, sf in zip(this.submobjects, splitFactors) {
//             newSubmobs.append(submob)
//             for _ in range(1, sf) {
//                 newSubmob = submob.copy()
//                 # If the submobject is at all transparent, then
//                 # make the copy completely transparent
//                 if submob.getOpacity() < 1:
//                     newSubmob.setOpacity(0)
//                 newSubmobs.append(newSubmob)
//         this.submobjects = newSubmobs
//         return this

//     # Interpolate

//     interpolate(this, mobject1, mobject2, alpha, pathFunc=straightPath()) {
//         """Turns this :class:`~.OpenGLMobject` into an interpolation between ``mobject1``
//         and ``mobject2``.

//         Examples
//         --------

//         .. manim:: DotInterpolation
//             :saveLastFrame:

//             class DotInterpolation(Scene) {
//                 construct(this) {
//                     dotR = Dot(color=DARK_GREY)
//                     dotR.shift(2 * RIGHT)
//                     dotL = Dot(color=WHITE)
//                     dotL.shift(2 * LEFT)

//                     dotMiddle = OpenGLVMobject().interpolate(dotL, dotR, alpha=0.3)

//                     this.add(dotL, dotR, dotMiddle)
//         """
//         for key in this.data:
//             if key in this.lockedDataKeys:
//                 continue
//             if len(this.data[key]) == 0:
//                 continue
//             if key not in mobject1.data or key not in mobject2.data:
//                 continue

//             if key in ("points", "boundingBox") {
//                 func = pathFunc
//             else:
//                 func = interpolate

//             this.data[key][:] = func(mobject1.data[key], mobject2.data[key], alpha)
//         for key in this.uniforms:
//             if key != "fixedOrientationCenter":
//                 this.uniforms[key] = interpolate(
//                     mobject1.uniforms[key],
//                     mobject2.uniforms[key],
//                     alpha,
//                 )
//             else:
//                 this.uniforms["fixedOrientationCenter"] = tuple(
//                     interpolate(
//                         np.array(mobject1.uniforms["fixedOrientationCenter"]),
//                         np.array(mobject2.uniforms["fixedOrientationCenter"]),
//                         alpha,
//                     )
//                 )
//         return this

//     pointwiseBecomePartial(this, mobject, a, b) {
//         """
//         Set points in such a way as to become only
//         part of mobject.
//         Inputs 0 <= a < b <= 1 determine what portion
//         of mobject to become.
//         """
//         pass  # To implement in subclass

//     become(
//         this,
//         mobject: OpenGLMobject,
//         matchHeight: bool = False,
//         matchWidth: bool = False,
//         matchDepth: bool = False,
//         matchCenter: bool = False,
//         stretch: bool = False,
//     ) {
//         """Edit all data and submobjects to be identical
//         to another :class:`~.OpenGLMobject`

//         .. note::

//             If both matchHeight and matchWidth are ``True`` then the transformed :class:`~.OpenGLMobject`
//             will match the height first and then the width

//         Parameters
//         ----------
//         matchHeight
//             If ``True``, then the transformed :class:`~.OpenGLMobject` will match the height of the original
//         matchWidth
//             If ``True``, then the transformed :class:`~.OpenGLMobject` will match the width of the original
//         matchDepth
//             If ``True``, then the transformed :class:`~.OpenGLMobject` will match the depth of the original
//         matchCenter
//             If ``True``, then the transformed :class:`~.OpenGLMobject` will match the center of the original
//         stretch
//             If ``True``, then the transformed :class:`~.OpenGLMobject` will stretch to fit the proportions of the original

//         Examples
//         --------
//         .. manim:: BecomeScene

//             class BecomeScene(Scene) {
//                 construct(this) {
//                     circ = Circle(fillColor=RED, fillOpacity=0.8)
//                     square = Square(fillColor=BLUE, fillOpacity=0.2)
//                     this.add(circ)
//                     this.wait(0.5)
//                     circ.become(square)
//                     this.wait(0.5)
//         """

//         if stretch:
//             mobject.stretchToFitHeight(this.height)
//             mobject.stretchToFitWidth(this.width)
//             mobject.stretchToFitDepth(this.depth)
//         else:
//             if matchHeight:
//                 mobject.matchHeight(this)
//             if matchWidth:
//                 mobject.matchWidth(this)
//             if matchDepth:
//                 mobject.matchDepth(this)

//         if matchCenter:
//             mobject.moveTo(this.getCenter())

//         this.alignFamily(mobject)
//         for sm1, sm2 in zip(this.getFamily(), mobject.getFamily()) {
//             sm1.setData(sm2.data)
//             sm1.setUniforms(sm2.uniforms)
//         this.refreshBoundingBox(recurseDown=True)
//         return this

//     # Locking data

//     lockData(this, keys) {
//         """
//         To speed up some animations, particularly transformations,
//         it can be handy to acknowledge which pieces of data
//         won't change during the animation so that calls to
//         interpolate can skip this, and so that it's not
//         read into the shaderWrapper objects needlessly
//         """
//         if this.hasUpdaters:
//             return
//         # Be sure shader data has most up to date information
//         this.refreshShaderData()
//         this.lockedDataKeys = set(keys)

//     lockMatchingData(this, mobject1, mobject2) {
//         for sm, sm1, sm2 in zip(
//             this.getFamily(),
//             mobject1.getFamily(),
//             mobject2.getFamily(),
//         ) {
//             keys = sm.data.keys() & sm1.data.keys() & sm2.data.keys()
//             sm.lockData(
//                 list(
//                     filter(
//                         lambda key: np.all(sm1.data[key] == sm2.data[key]),
//                         keys,
//                     ),
//                 ),
//             )
//         return this

//     unlockData(this) {
//         for mob in this.getFamily() {
//             mob.lockedDataKeys = set()

//     # Operations touching shader uniforms

//     affectsShaderInfoId(func) {
//         @wraps(func)
//         wrapper(this) {
//             for mob in this.getFamily() {
//                 func(mob)
//                 # mob.refreshShaderWrapperId()
//             return this

//         return wrapper

//     @affectsShaderInfoId
//     fixInFrame(this) {
//         this.isFixedInFrame = 1.0
//         return this

//     @affectsShaderInfoId
//     fixOrientation(this) {
//         this.isFixedOrientation = 1.0
//         this.fixedOrientationCenter = tuple(this.getCenter())
//         this.depthTest = True
//         return this

//     @affectsShaderInfoId
//     unfixFromFrame(this) {
//         this.isFixedInFrame = 0.0
//         return this

//     @affectsShaderInfoId
//     unfixOrientation(this) {
//         this.isFixedOrientation = 0.0
//         this.fixedOrientationCenter = (0, 0, 0)
//         this.depthTest = False
//         return this

//     @affectsShaderInfoId
//     applyDepthTest(this) {
//         this.depthTest = True
//         return this

//     @affectsShaderInfoId
//     deactivateDepthTest(this) {
//         this.depthTest = False
//         return this

//     # Shader code manipulation

//     replaceShaderCode(this, old, new) {
//         # TODO, will this work with VMobject structure, given
//         # that it does not simpler return shaderWrappers of
//         # family?
//         for wrapper in this.getShaderWrapperList() {
//             wrapper.replaceCode(old, new)
//         return this

//     setColorByCode(this, glslCode) {
//         """
//         Takes a snippet of code and inserts it into a
//         context which has the following variables:
//         vec4 color, vec3 point, vec3 unitNormal.
//         The code should change the color variable
//         """
//         this.replaceShaderCode("///// INSERT COLOR FUNCTION HERE /////", glslCode)
//         return this

//     setColorByXyzFunc(
//         this,
//         glslSnippet,
//         minValue=-5.0,
//         maxValue=5.0,
//         colormap="viridis",
//     ) {
//         """
//         Pass in a glsl expression in terms of x, y and z which returns
//         a float.
//         """
//         # TODO, add a version of this which changes the point data instead
//         # of the shader code
//         for char in "xyz":
//             glslSnippet = glslSnippet.replace(char, "point." + char)
//         rgbList = getColormapList(colormap)
//         this.setColorByCode(
//             "color.rgb = floatToColor({}, {}, {}, {});".format(
//                 glslSnippet,
//                 float(minValue),
//                 float(maxValue),
//                 getColormapCode(rgbList),
//             ),
//         )
//         return this

//     # For shader data

//     # refreshShaderWrapperId(this) {
//     #     this.shaderWrapper.refreshId()
//     #     return this

//     getShaderWrapper(this) {
//         from manim.renderer.shaderWrapper import ShaderWrapper

//         this.shaderWrapper = ShaderWrapper(
//             vertData=this.getShaderData(),
//             vertIndices=this.getShaderVertIndices(),
//             uniforms=this.getShaderUniforms(),
//             depthTest=this.depthTest,
//             texturePaths=this.texturePaths,
//             renderPrimitive=this.renderPrimitive,
//             shaderFolder=this._Class__.shaderFolder,
//         )
//         return this.shaderWrapper

//     getShaderWrapperList(this) {
//         shaderWrappers = it.chain(
//             [this.getShaderWrapper()],
//             *(sm.getShaderWrapperList() for sm in this.submobjects),
//         )
//         batches = batchByProperty(shaderWrappers, lambda sw: sw.getId())

//         result = []
//         for wrapperGroup, _ in batches:
//             shaderWrapper = wrapperGroup[0]
//             if not shaderWrapper.isValid() {
//                 continue
//             shaderWrapper.combineWith(*wrapperGroup[1:])
//             if len(shaderWrapper.vertData) > 0:
//                 result.append(shaderWrapper)
//         return result

//     checkDataAlignment(this, array, dataKey) {
//         # Makes sure that this.data[key] can be broadcast into
//         # the given array, meaning its length has to be either 1
//         # or the length of the array
//         dLen = len(this.data[dataKey])
//         if dLen != 1 and dLen != len(array) {
//             this.data[dataKey] = resizeWithInterpolation(
//                 this.data[dataKey],
//                 len(array),
//             )
//         return this

//     getResizedShaderDataArray(this, length) {
//         # If possible, try to populate an existing array, rather
//         # than recreating it each frame
//         points = this.points
//         shaderData = np.zeros(len(points), dtype=this.shaderDtype)
//         return shaderData

//     readDataToShader(this, shaderData, shaderDataKey, dataKey) {
//         if dataKey in this.lockedDataKeys:
//             return
//         this.checkDataAlignment(shaderData, dataKey)
//         shaderData[shaderDataKey] = this.data[dataKey]

//     getShaderData(this) {
//         shaderData = this.getResizedShaderDataArray(this.getNumPoints())
//         this.readDataToShader(shaderData, "point", "points")
//         return shaderData

//     refreshShaderData(this) {
//         this.getShaderData()

//     getShaderUniforms(this) {
//         return this.uniforms

//     getShaderVertIndices(this) {
//         return this.shaderIndices

//     @property
//     submobjects(this) {
//         return this.Submobjects if hasattr(this, "Submobjects") else []

//     @submobjects.setter
//     submobjects(this, submobjectList) {
//         this.remove(*this.submobjects)
//         this.add(*submobjectList)

//     # Errors

//     throwErrorIfNoPoints(this) {
//         if not this.hasPoints() {
//             message = (
//                 "Cannot call OpenGLMobject.{} " + "for a OpenGLMobject with no points"
//             )
//             callerName = sys.Getframe(1).fCode.coName
//             raise Exception(message.format(callerName))


// class OpenGLGroup(OpenGLMobject) {
//     _Init__(this, *mobjects, **kwargs) {
//         if not all([isinstance(m, OpenGLMobject) for m in mobjects]) {
//             raise Exception("All submobjects must be of type OpenGLMobject")
//         super()._Init__(**kwargs)
//         this.add(*mobjects)


// class OpenGLPoint(OpenGLMobject) {
//     _Init__(
//         this, location=ORIGIN, artificialWidth=1e-6, artificialHeight=1e-6, **kwargs
//     ) {
//         this.artificialWidth = artificialWidth
//         this.artificialHeight = artificialHeight
//         super()._Init__(**kwargs)
//         this.setLocation(location)

//     getWidth(this) {
//         return this.artificialWidth

//     getHeight(this) {
//         return this.artificialHeight

//     getLocation(this) {
//         return this.points[0].copy()

//     getBoundingBoxPoint(this, *args, **kwargs) {
//         return this.getLocation()

//     setLocation(this, newLoc) {
//         this.setPoints(np.array(newLoc, ndmin=2, dtype=float))


// class _AnimationBuilder:
//     _Init__(this, mobject) {
//         this.mobject = mobject
//         this.mobject.generateTarget()

//         this.overriddenAnimation = None
//         this.isChaining = False
//         this.methods = []

//         # Whether animation args can be passed
//         this.cannotPassArgs = False
//         this.animArgs = {}

//     _Call__(this, **kwargs) {
//         if this.cannotPassArgs:
//             raise ValueError(
//                 "Animation arguments must be passed before accessing methods and can only be passed once",
//             )

//         this.animArgs = kwargs
//         this.cannotPassArgs = True

//         return this

//     _Getattr__(this, methodName) {
//         method = getattr(this.mobject.target, methodName)
//         this.methods.append(method)
//         hasOverriddenAnimation = hasattr(method, "OverrideAnimate")

//         if (this.isChaining and hasOverriddenAnimation) or this.overriddenAnimation:
//             raise NotImplementedError(
//                 "Method chaining is currently not supported for "
//                 "overridden animations",
//             )

//         updateTarget(*methodArgs, **methodKwargs) {
//             if hasOverriddenAnimation:
//                 this.overriddenAnimation = method.OverrideAnimate(
//                     this.mobject,
//                     *methodArgs,
//                     animArgs=this.animArgs,
//                     **methodKwargs,
//                 )
//             else:
//                 method(*methodArgs, **methodKwargs)
//             return this

//         this.isChaining = True
//         this.cannotPassArgs = True

//         return updateTarget

//     build(this) {
//         from manim.animation.transform import _MethodAnimation

//         if this.overriddenAnimation:
//             anim = this.overriddenAnimation
//         else:
//             anim = _MethodAnimation(this.mobject, this.methods)

//         for attr, value in this.animArgs.items() {
//             setattr(anim, attr, value)

//         return anim


// overrideAnimate(method) {
//     r"""Decorator for overriding method animations.

//     This allows to specify a method (returning an :class:`~.Animation`)
//     which is called when the decorated method is used with the ``.animate`` syntax
//     for animating the application of a method.

//     .. seealso::

//         :attr:`OpenGLMobject.animate`

//     .. note::

//         Overridden methods cannot be combined with normal or other overridden
//         methods using method chaining with the ``.animate`` syntax.


//     Examples
//     --------

//     .. manim:: AnimationOverrideExample

//         class CircleWithContent(VGroup) {
//             _Init__(this, content) {
//                 super()._Init__()
//                 this.circle = Circle()
//                 this.content = content
//                 this.add(this.circle, content)
//                 content.moveTo(this.circle.getCenter())

//             clearContent(this) {
//                 this.remove(this.content)
//                 this.content = None

//             @overrideAnimate(clearContent)
//             ClearContentAnimation(this, animArgs=None) {
//                 if animArgs is None:
//                     animArgs = {}
//                 anim = Uncreate(this.content, **animArgs)
//                 this.clearContent()
//                 return anim

//         class AnimationOverrideExample(Scene) {
//             construct(this) {
//                 t = Text("hello!")
//                 myMobject = CircleWithContent(t)
//                 this.play(Create(myMobject))
//                 this.play(myMobject.animate.clearContent())
//                 this.wait()

//     """

//     decorator(animationMethod) {
//         method.OverrideAnimate = animationMethod
//         return animationMethod

//     return decorator
