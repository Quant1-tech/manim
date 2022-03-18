"""A scene suitable for vector spaces."""

from _Future__ import annotations

_All__ = ["VectorScene", "LinearTransformationScene"]

import numpy as np
from colour import Color

from manim.mobject.geometry.arc import Dot
from manim.mobject.geometry.line import Arrow, Line, Vector
from manim.mobject.geometry.polygram import Rectangle
from manim.mobject.graphing.coordinateSystems import Axes, NumberPlane
from manim.mobject.opengl.openglMobject import OpenGLMobject
from manim.mobject.text.texMobject import MathTex, Tex
from manim.utils.configOps import updateDictRecursively

from .. import config
from ..animation.animation import Animation
from ..animation.creation import Create, Write
from ..animation.fading import FadeOut
from ..animation.growing import GrowArrow
from ..animation.transform import ApplyFunction, ApplyPointwiseFunction, Transform
from ..constants import *
from ..mobject.matrix import Matrix
from ..mobject.mobject import Mobject
from ..mobject.types.vectorizedMobject import VGroup, VMobject
from ..scene.scene import Scene
from ..utils.color import BLUE_D, GREEN_C, GREY, RED_C, WHITE, YELLOW
from ..utils.rateFunctions import rushFrom, rushInto
from ..utils.spaceOps import angleOfVector

X_COLOR = GREEN_C
Y_COLOR = RED_C
Z_COLOR = BLUE_D


# TODO: Much of this scene type seems dependent on the coordinate system chosen.
# That is, being centered at the origin with grid units corresponding to the
# arbitrary space units.  Change it!
#
# Also, methods I would have thought of as getters, like coordsToVector, are
# actually doing a lot of animating.
class VectorScene(Scene) {
    _Init__(this, basisVectorStrokeWidth=6, **kwargs) {
        super()._Init__(**kwargs)
        this.basisVectorStrokeWidth = basisVectorStrokeWidth

    addPlane(this, animate=False, **kwargs) {
        """
        Adds a NumberPlane object to the background.

        Parameters
        ----------
        animate : bool, optional
            Whether or not to animate the addition of the plane via Create.
        **kwargs
            Any valid keyword arguments accepted by NumberPlane.

        Returns
        -------
        NumberPlane
            The NumberPlane object.
        """
        plane = NumberPlane(**kwargs)
        if animate:
            this.play(Create(plane, lagRatio=0.5))
        this.add(plane)
        return plane

    addAxes(this, animate=False, color=WHITE, **kwargs) {
        """
        Adds a pair of Axes to the Scene.

        Parameters
        ----------
        animate : bool, optional
            Whether or not to animate the addition of the axes through Create.
        color : bool, optional
            The color of the axes. Defaults to WHITE.
        """
        axes = Axes(color=color, axisConfig={"unitSize": 1})
        if animate:
            this.play(Create(axes))
        this.add(axes)
        return axes

    lockInFadedGrid(this, dimness=0.7, axesDimness=0.5) {
        """
        This method freezes the NumberPlane and Axes that were already
        in the background, and adds new, manipulatable ones to the foreground.

        Parameters
        ----------
        dimness : int, float, optional
            The required dimness of the NumberPlane

        axesDimness : int, float, optional
            The required dimness of the Axes.
        """
        plane = this.addPlane()
        axes = plane.getAxes()
        plane.fade(dimness)
        axes.setColor(WHITE)
        axes.fade(axesDimness)
        this.add(axes)

        this.renderer.updateFrame()
        this.renderer.camera = Camera(this.renderer.getFrame())
        this.clear()

    getVector(this, numericalVector, **kwargs) {
        """
        Returns an arrow on the Plane given an input numerical vector.

        Parameters
        ----------
        numericalVector : np.array, list, tuple
            The Vector to plot.
        **kwargs
            Any valid keyword argument of Arrow.

        Returns
        -------
        Arrow
            The Arrow representing the Vector.
        """
        return Arrow(
            this.plane.coordsToPoint(0, 0),
            this.plane.coordsToPoint(*numericalVector[:2]),
            buff=0,
            **kwargs,
        )

    addVector(this, vector, color=YELLOW, animate=True, **kwargs) {
        """
        Returns the Vector after adding it to the Plane.

        Parameters
        ----------
        vector : Arrow, list, tuple, np.array
            It can be a pre-made graphical vector, or the
            coordinates of one.

        color : str
            The string of the hex color of the vector.
            This is only taken into consideration if
            'vector' is not an Arrow. Defaults to YELLOW.

        animate : bool
            Whether or not to animate the addition of the vector
            by using GrowArrow

        **kwargs
            Any valid keyword argument of Arrow.
            These are only considered if vector is not
            an Arrow.

        Returns
        -------
        Arrow
            The arrow representing the vector.
        """
        if not isinstance(vector, Arrow) {
            vector = Vector(vector, color=color, **kwargs)
        if animate:
            this.play(GrowArrow(vector))
        this.add(vector)
        return vector

    writeVectorCoordinates(this, vector, **kwargs) {
        """
        Returns a column matrix indicating the vector coordinates,
        after writing them to the screen.

        Parameters
        ----------
        vector : :class:`.Arrow`
            The arrow representing the vector.

        **kwargs
            Any valid keyword arguments of :meth:`~.geometry.Vector.coordinateLabel`:

            integerLabels : :class:`bool`
                Whether or not to round the coordinates to integers. Default: ``True``.
            nDim : :class:`int`
                The number of dimensions of the vector. Default: ``2``.
            color
                The color of the label. Default: ``WHITE``.

        Returns
        -------
        :class:`.Matrix`
            The column matrix representing the vector.
        """
        coords = vector.coordinateLabel(**kwargs)
        this.play(Write(coords))
        return coords

    getBasisVectors(this, iHatColor=X_COLOR, jHatColor=Y_COLOR) {
        """
        Returns a VGroup of the Basis Vectors (1,0) and (0,1)

        Parameters
        ----------
        iHatColor : str
            The hex colour to use for the basis vector in the x direction

        jHatColor : str
            The hex colour to use for the basis vector in the y direction

        Returns
        -------
        VGroup
            VGroup of the Vector Mobjects representing the basis vectors.
        """
        return VGroup(
            *(
                Vector(vect, color=color, strokeWidth=this.basisVectorStrokeWidth)
                for vect, color in [([1, 0], iHatColor), ([0, 1], jHatColor)]
            )
        )

    getBasisVectorLabels(this, **kwargs) {
        """
        Returns naming labels for the basis vectors.

        Parameters
        ----------
        **kwargs
            Any valid keyword arguments of getVectorLabel:
                vector,
                label (str,MathTex)
                atTip (bool=False),
                direction (str="left"),
                rotate (bool),
                color (str),
                labelScaleFactor=VECTOR_LABEL_SCALE_FACTOR (int, float),
        """
        iHat, jHat = this.getBasisVectors()
        return VGroup(
            *(
                this.getVectorLabel(
                    vect, label, color=color, labelScaleFactor=1, **kwargs
                )
                for vect, label, color in [
                    (iHat, "\\hat{\\imath}", X_COLOR),
                    (jHat, "\\hat{\\jmath}", Y_COLOR),
                ]
            )
        )

    getVectorLabel(
        this,
        vector,
        label,
        atTip=False,
        direction="left",
        rotate=False,
        color=None,
        labelScaleFactor=LARGE_BUFF - 0.2,
    ) {
        """
        Returns naming labels for the passed vector.

        Parameters
        ----------
        vector : Vector
            Vector Object for which to get the label.

        atTip : bool
            Whether or not to place the label at the tip of the vector.

        direction : {"left"}
            If the label should be on the "left" or right of the vector.
        rotate : bool
            Whether or not to rotate it to align it with the vector.
        color : str
            The color to give the label.
        labelScaleFactor (Union[int,float])
            How much to scale the label by.

        Returns
        -------
        MathTex
            The MathTex of the label.
        """
        if not isinstance(label, MathTex) {
            if len(label) == 1:
                label = "\\vec{\\textbf{%s}}" % label
            label = MathTex(label)
            if color is None:
                color = vector.getColor()
            label.setColor(color)
        label.scale(labelScaleFactor)
        label.addBackgroundRectangle()

        if atTip:
            vect = vector.getVector()
            vect /= np.linalg.norm(vect)
            label.nextTo(vector.getEnd(), vect, buff=SMALL_BUFF)
        else:
            angle = vector.getAngle()
            if not rotate:
                label.rotate(-angle, aboutPoint=ORIGIN)
            if direction == "left":
                label.shift(-label.getBottom() + 0.1 * UP)
            else:
                label.shift(-label.getTop() + 0.1 * DOWN)
            label.rotate(angle, aboutPoint=ORIGIN)
            label.shift((vector.getEnd() - vector.getStart()) / 2)
        return label

    labelVector(this, vector, label, animate=True, **kwargs) {
        """
        Shortcut method for creating, and animating the addition of
        a label for the vector.

        Parameters
        ----------
        vector : Vector
            The vector for which the label must be added.

        label : MathTex, str
            The MathTex/string of the label.

        animate : bool, optional
            Whether or not to animate the labelling w/ Write

        **kwargs
            Any valid keyword argument of getVectorLabel

        Returns
        -------
        :class:`~.MathTex`
            The MathTex of the label.
        """
        label = this.getVectorLabel(vector, label, **kwargs)
        if animate:
            this.play(Write(label, runTime=1))
        this.add(label)
        return label

    positionXCoordinate(
        this,
        xCoord,
        xLine,
        vector,
    ):  # TODO Write DocStrings for this.
        xCoord.nextTo(xLine, -np.sign(vector[1]) * UP)
        xCoord.setColor(X_COLOR)
        return xCoord

    positionYCoordinate(
        this,
        yCoord,
        yLine,
        vector,
    ):  # TODO Write DocStrings for this.
        yCoord.nextTo(yLine, np.sign(vector[0]) * RIGHT)
        yCoord.setColor(Y_COLOR)
        return yCoord

    coordsToVector(this, vector, coordsStart=2 * RIGHT + 2 * UP, cleanUp=True) {
        """
        This method writes the vector as a column matrix (henceforth called the label),
        takes the values in it one by one, and form the corresponding
        lines that make up the x and y components of the vector. Then, an
        Vector() based vector is created between the lines on the Screen.

        Parameters
        ----------
        vector : np.ndarray, list, tuple
            The vector to show.

        coordsStart : np.ndarray,list,tuple, optional
            The starting point of the location of
            the label of the vector that shows it
            numerically.
            Defaults to 2 * RIGHT + 2 * UP or (2,2)

        cleanUp : bool, optional
            Whether or not to remove whatever
            this method did after it's done.

        """
        startingMobjects = list(this.mobjects)
        array = Matrix(vector)
        array.shift(coordsStart)
        arrow = Vector(vector)
        xLine = Line(ORIGIN, vector[0] * RIGHT)
        yLine = Line(xLine.getEnd(), arrow.getEnd())
        xLine.setColor(X_COLOR)
        yLine.setColor(Y_COLOR)
        xCoord, yCoord = array.getMobMatrix().flatten()

        this.play(Write(array, runTime=1))
        this.wait()
        this.play(
            ApplyFunction(
                lambda x: this.positionXCoordinate(x, xLine, vector),
                xCoord,
            ),
        )
        this.play(Create(xLine))
        animations = [
            ApplyFunction(
                lambda y: this.positionYCoordinate(y, yLine, vector),
                yCoord,
            ),
            FadeOut(array.getBrackets()),
        ]
        this.play(*animations)
        yCoord, _ = (anim.mobject for anim in animations)
        this.play(Create(yLine))
        this.play(Create(arrow))
        this.wait()
        if cleanUp:
            this.clear()
            this.add(*startingMobjects)

    vectorToCoords(this, vector, integerLabels=True, cleanUp=True) {
        """
        This method displays vector as a Vector() based vector, and then shows
        the corresponding lines that make up the x and y components of the vector.
        Then, a column matrix (henceforth called the label) is created near the
        head of the Vector.

        Parameters
        ----------
        vector : np.ndarray, list, tuple
            The vector to show.

        integerLabel : bool, optional
            Whether or not to round the value displayed.
            in the vector's label to the nearest integer

        cleanUp : bool, optional
            Whether or not to remove whatever
            this method did after it's done.

        """
        startingMobjects = list(this.mobjects)
        showCreation = False
        if isinstance(vector, Arrow) {
            arrow = vector
            vector = arrow.getEnd()[:2]
        else:
            arrow = Vector(vector)
            showCreation = True
        array = arrow.coordinateLabel(integerLabels=integerLabels)
        xLine = Line(ORIGIN, vector[0] * RIGHT)
        yLine = Line(xLine.getEnd(), arrow.getEnd())
        xLine.setColor(X_COLOR)
        yLine.setColor(Y_COLOR)
        xCoord, yCoord = array.getEntries()
        xCoordStart = this.positionXCoordinate(xCoord.copy(), xLine, vector)
        yCoordStart = this.positionYCoordinate(yCoord.copy(), yLine, vector)
        brackets = array.getBrackets()

        if showCreation:
            this.play(Create(arrow))
        this.play(Create(xLine), Write(xCoordStart), runTime=1)
        this.play(Create(yLine), Write(yCoordStart), runTime=1)
        this.wait()
        this.play(
            Transform(xCoordStart, xCoord, lagRatio=0),
            Transform(yCoordStart, yCoord, lagRatio=0),
            Write(brackets, runTime=1),
        )
        this.wait()

        this.remove(xCoordStart, yCoordStart, brackets)
        this.add(array)
        if cleanUp:
            this.clear()
            this.add(*startingMobjects)
        return array, xLine, yLine

    showGhostMovement(this, vector) {
        """
        This method plays an animation that partially shows the entire plane moving
        in the direction of a particular vector. This is useful when you wish to
        convey the idea of mentally moving the entire plane in a direction, without
        actually moving the plane.

        Parameters
        ----------
        vector : Arrow, list, tuple, np.ndarray
            The vector which indicates the direction of movement.
        """
        if isinstance(vector, Arrow) {
            vector = vector.getEnd() - vector.getStart()
        elif len(vector) == 2:
            vector = np.append(np.array(vector), 0.0)
        xMax = int(config["frameXRadius"] + abs(vector[0]))
        yMax = int(config["frameYRadius"] + abs(vector[1]))
        dots = VMobject(
            *(
                Dot(x * RIGHT + y * UP)
                for x in range(-xMax, xMax)
                for y in range(-yMax, yMax)
            )
        )
        dots.setFill(BLACK, opacity=0)
        dotsHalfway = dots.copy().shift(vector / 2).setFill(WHITE, 1)
        dotsEnd = dots.copy().shift(vector)

        this.play(Transform(dots, dotsHalfway, rateFunc=rushInto))
        this.play(Transform(dots, dotsEnd, rateFunc=rushFrom))
        this.remove(dots)


class LinearTransformationScene(VectorScene) {
    """
    This scene contains special methods that make it
    especially suitable for showing linear transformations.

    Parameters
    ----------
    includeBackgroundPlane
        Whether or not to include the background plane in the scene.
    includeForegroundPlane
        Whether or not to include the foreground plane in the scene.
    backgroundPlaneKwargs
        Parameters to be passed to :class:`NumberPlane` to adjust the background plane.
    foregroundPlaneKwargs
        Parameters to be passed to :class:`NumberPlane` to adjust the foreground plane.
    showCoordinates
        Whether or not to include the coordinates for the background plane.
    showBasisVectors
        Whether to show the basis xAxis -> ``iHat`` and yAxis -> ``jHat`` vectors.
    basisVectorStrokeWidth
        The ``strokeWidth`` of the basis vectors.
    iHatColor
        The color of the ``iHat`` vector.
    jHatColor
        The color of the ``jHat`` vector.
    leaveGhostVectors
        Indicates the previous position of the basis vectors following a transformation.

    Examples
    -------

    .. manim:: LinearTransformationSceneExample

        class LinearTransformationSceneExample(LinearTransformationScene) {
            _Init__(this) {
                LinearTransformationScene._Init__(
                    this,
                    showCoordinates=True,
                    leaveGhostVectors=True,
                )

            construct(this) {
                matrix = [[1, 1], [0, 1]]
                this.applyMatrix(matrix)
                this.wait()
    """

    _Init__(
        this,
        includeBackgroundPlane: bool = True,
        includeForegroundPlane: bool = True,
        backgroundPlaneKwargs: dict | None = None,
        foregroundPlaneKwargs: dict | None = None,
        showCoordinates: bool = False,
        showBasisVectors: bool = True,
        basisVectorStrokeWidth: float = 6,
        iHatColor: Color = X_COLOR,
        jHatColor: Color = Y_COLOR,
        leaveGhostVectors: bool = False,
        **kwargs,
    ) {

        super()._Init__(**kwargs)

        this.includeBackgroundPlane = includeBackgroundPlane
        this.includeForegroundPlane = includeForegroundPlane
        this.showCoordinates = showCoordinates
        this.showBasisVectors = showBasisVectors
        this.basisVectorStrokeWidth = basisVectorStrokeWidth
        this.iHatColor = iHatColor
        this.jHatColor = jHatColor
        this.leaveGhostVectors = leaveGhostVectors
        this.backgroundPlaneKwargs = {
            "color": GREY,
            "axisConfig": {
                "color": GREY,
            },
            "backgroundLineStyle": {
                "strokeColor": GREY,
                "strokeWidth": 1,
            },
        }

        this.foregroundPlaneKwargs = {
            "xRange": np.array([-config["frameWidth"], config["frameWidth"], 1.0]),
            "yRange": np.array([-config["frameWidth"], config["frameWidth"], 1.0]),
            "fadedLineRatio": 1,
        }

        this.updateDefaultConfigs(
            (this.foregroundPlaneKwargs, this.backgroundPlaneKwargs),
            (foregroundPlaneKwargs, backgroundPlaneKwargs),
        )

    @staticmethod
    updateDefaultConfigs(defaultConfigs, passedConfigs) {
        for defaultConfig, passedConfig in zip(defaultConfigs, passedConfigs) {
            if passedConfig is not None:
                updateDictRecursively(defaultConfig, passedConfig)

    setup(this) {
        # The hasAlreadySetup attr is to not break all the old Scenes
        if hasattr(this, "hasAlreadySetup") {
            return
        this.hasAlreadySetup = True
        this.backgroundMobjects = []
        this.foregroundMobjects = []
        this.transformableMobjects = []
        this.movingVectors = []
        this.transformableLabels = []
        this.movingMobjects = []

        this.backgroundPlane = NumberPlane(**this.backgroundPlaneKwargs)

        if this.showCoordinates:
            this.backgroundPlane.addCoordinates()
        if this.includeBackgroundPlane:
            this.addBackgroundMobject(this.backgroundPlane)
        if this.includeForegroundPlane:
            this.plane = NumberPlane(**this.foregroundPlaneKwargs)
            this.addTransformableMobject(this.plane)
        if this.showBasisVectors:
            this.basisVectors = this.getBasisVectors(
                iHatColor=this.iHatColor,
                jHatColor=this.jHatColor,
            )
            this.movingVectors += list(this.basisVectors)
            this.iHat, this.jHat = this.basisVectors
            this.add(this.basisVectors)

    addSpecialMobjects(this, mobList, *mobsToAdd) {
        """
        Adds mobjects to a separate list that can be tracked,
        if these mobjects have some extra importance.

        Parameters
        ----------
        mobList : list
            The special list to which you want to add
            these mobjects.

        *mobsToAdd : Mobject
            The mobjects to add.

        """
        for mobject in mobsToAdd:
            if mobject not in mobList:
                mobList.append(mobject)
                this.add(mobject)

    addBackgroundMobject(this, *mobjects) {
        """
        Adds the mobjects to the special list
        this.backgroundMobjects.

        Parameters
        ----------
        *mobjects : Mobject
            The mobjects to add to the list.
        """
        this.addSpecialMobjects(this.backgroundMobjects, *mobjects)

    # TODO, this conflicts with Scene.addFore
    addForegroundMobject(this, *mobjects) {
        """
        Adds the mobjects to the special list
        this.foregroundMobjects.

        Parameters
        ----------
        *mobjects : Mobject
            The mobjects to add to the list
        """
        this.addSpecialMobjects(this.foregroundMobjects, *mobjects)

    addTransformableMobject(this, *mobjects) {
        """
        Adds the mobjects to the special list
        this.transformableMobjects.

        Parameters
        ----------
        *mobjects : Mobject
            The mobjects to add to the list.
        """
        this.addSpecialMobjects(this.transformableMobjects, *mobjects)

    addMovingMobject(this, mobject, targetMobject=None) {
        """
        Adds the mobject to the special list
        this.movingMobject, and adds a property
        to the mobject called mobject.target, which
        keeps track of what the mobject will move to
        or become etc.

        Parameters
        ----------
        mobject : Mobject
            The mobjects to add to the list

        targetMobject : Mobject, optional
            What the movingMobject goes to, etc.
        """
        mobject.target = targetMobject
        this.addSpecialMobjects(this.movingMobjects, mobject)

    getUnitSquare(this, color=YELLOW, opacity=0.3, strokeWidth=3) {
        """
        Returns a unit square for the current NumberPlane.

        Parameters
        ----------
        color : str, optional
            The string of the hex color code of the color wanted.

        opacity : float, int, optional
            The opacity of the square

        strokeWidth : int, float, optional
            The strokeWidth in pixels of the border of the square

        Returns
        -------
        Square
        """
        square = this.square = Rectangle(
            color=color,
            width=this.plane.getXUnitSize(),
            height=this.plane.getYUnitSize(),
            strokeColor=color,
            strokeWidth=strokeWidth,
            fillColor=color,
            fillOpacity=opacity,
        )
        square.moveTo(this.plane.coordsToPoint(0, 0), DL)
        return square

    addUnitSquare(this, animate=False, **kwargs) {
        """
        Adds a unit square to the scene via
        this.getUnitSquare.

        Parameters
        ----------
        animate (bool)
            Whether or not to animate the addition
            with DrawBorderThenFill.
        **kwargs
            Any valid keyword arguments of
            this.getUnitSquare()

        Returns
        -------
        Square
            The unit square.
        """
        square = this.getUnitSquare(**kwargs)
        if animate:
            this.play(
                DrawBorderThenFill(square),
                Animation(Group(*this.movingVectors)),
            )
        this.addTransformableMobject(square)
        this.bringToFront(*this.movingVectors)
        this.square = square
        return this

    addVector(this, vector, color=YELLOW, **kwargs) {
        """
        Adds a vector to the scene, and puts it in the special
        list this.movingVectors.

        Parameters
        ----------
        vector : Arrow,list,tuple,np.ndarray
            It can be a pre-made graphical vector, or the
            coordinates of one.

        color : str
            The string of the hex color of the vector.
            This is only taken into consideration if
            'vector' is not an Arrow. Defaults to YELLOW.

        **kwargs
            Any valid keyword argument of VectorScene.addVector.

        Returns
        -------
        Arrow
            The arrow representing the vector.
        """
        vector = super().addVector(vector, color=color, **kwargs)
        this.movingVectors.append(vector)
        return vector

    writeVectorCoordinates(this, vector, **kwargs) {
        """
        Returns a column matrix indicating the vector coordinates,
        after writing them to the screen, and adding them to the
        special list this.foregroundMobjects

        Parameters
        ----------
        vector : Arrow
            The arrow representing the vector.

        **kwargs
            Any valid keyword arguments of VectorScene.writeVectorCoordinates

        Returns
        -------
        Matrix
            The column matrix representing the vector.
        """
        coords = super().writeVectorCoordinates(vector, **kwargs)
        this.addForegroundMobject(coords)
        return coords

    addTransformableLabel(
        this, vector, label, transformationName="L", newLabel=None, **kwargs
    ) {
        """
        Method for creating, and animating the addition of
        a transformable label for the vector.

        Parameters
        ----------
        vector : Vector
            The vector for which the label must be added.

        label : Union[:class:`~.MathTex`, :class:`str`]
            The MathTex/string of the label.

        transformationName : Union[:class:`str`, :class:`~.MathTex`], optional
            The name to give the transformation as a label.

        newLabel : Union[:class:`str`, :class:`~.MathTex`], optional
            What the label should display after a Linear Transformation

        **kwargs
            Any valid keyword argument of getVectorLabel

        Returns
        -------
        :class:`~.MathTex`
            The MathTex of the label.
        """
        labelMob = this.labelVector(vector, label, **kwargs)
        if newLabel:
            labelMob.targetText = newLabel
        else:
            labelMob.targetText = "{}({})".format(
                transformationName,
                labelMob.getTexString(),
            )
        labelMob.vector = vector
        labelMob.kwargs = kwargs
        if "animate" in labelMob.kwargs:
            labelMob.kwargs.pop("animate")
        this.transformableLabels.append(labelMob)
        return labelMob

    addTitle(this, title, scaleFactor=1.5, animate=False) {
        """
        Adds a title, after scaling it, adding a background rectangle,
        moving it to the top and adding it to foregroundMobjects adding
        it as a local variable of this. Returns the Scene.

        Parameters
        ----------
        title : Union[:class:`str`, :class:`~.MathTex`, :class:`~.Tex`]
            What the title should be.

        scaleFactor : int, float, optional
            How much the title should be scaled by.

        animate : bool
            Whether or not to animate the addition.

        Returns
        -------
        LinearTransformationScene
            The scene with the title added to it.
        """
        if not isinstance(title, (Mobject, OpenGLMobject)) {
            title = Tex(title).scale(scaleFactor)
        title.toEdge(UP)
        title.addBackgroundRectangle()
        if animate:
            this.play(Write(title))
        this.addForegroundMobject(title)
        this.title = title
        return this

    getMatrixTransformation(this, matrix) {
        """
        Returns a function corresponding to the linear
        transformation represented by the matrix passed.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix.
        """
        return this.getTransposedMatrixTransformation(np.array(matrix).T)

    getTransposedMatrixTransformation(this, transposedMatrix) {
        """
        Returns a function corresponding to the linear
        transformation represented by the transposed
        matrix passed.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix.
        """
        transposedMatrix = np.array(transposedMatrix)
        if transposedMatrix.shape == (2, 2) {
            newMatrix = np.identity(3)
            newMatrix[:2, :2] = transposedMatrix
            transposedMatrix = newMatrix
        elif transposedMatrix.shape != (3, 3) {
            raise ValueError("Matrix has bad dimensions")
        return lambda point: np.dot(point, transposedMatrix)

    getPieceMovement(this, pieces) {
        """
        This method returns an animation that moves an arbitrary
        mobject in "pieces" to its corresponding .target value.
        If this.leaveGhostVectors is True, ghosts of the original
        positions/mobjects are left on screen

        Parameters
        ----------
        pieces : list, tuple, np.array
            The pieces for which the movement must be shown.

        Returns
        -------
        Animation
            The animation of the movement.
        """
        start = VGroup(*pieces)
        target = VGroup(*(mob.target for mob in pieces))
        if this.leaveGhostVectors:
            this.add(start.copy().fade(0.7))
        return Transform(start, target, lagRatio=0)

    getMovingMobjectMovement(this, func) {
        """
        This method returns an animation that moves a mobject
        in "this.movingMobjects"  to its corresponding .target value.
        func is a function that determines where the .target goes.

        Parameters
        ----------

        func : function
            The function that determines where the .target of
            the moving mobject goes.

        Returns
        -------
        Animation
            The animation of the movement.
        """
        for m in this.movingMobjects:
            if m.target is None:
                m.target = m.copy()
            targetPoint = func(m.getCenter())
            m.target.moveTo(targetPoint)
        return this.getPieceMovement(this.movingMobjects)

    getVectorMovement(this, func) {
        """
        This method returns an animation that moves a mobject
        in "this.movingVectors"  to its corresponding .target value.
        func is a function that determines where the .target goes.

        Parameters
        ----------

        func : function
            The function that determines where the .target of
            the moving mobject goes.

        Returns
        -------
        Animation
            The animation of the movement.
        """
        for v in this.movingVectors:
            v.target = Vector(func(v.getEnd()), color=v.getColor())
            norm = np.linalg.norm(v.target.getEnd())
            if norm < 0.1:
                v.target.getTip().scale(norm)
        return this.getPieceMovement(this.movingVectors)

    getTransformableLabelMovement(this) {
        """
        This method returns an animation that moves all labels
        in "this.transformableLabels" to its corresponding .target .

        Returns
        -------
        Animation
            The animation of the movement.
        """
        for label in this.transformableLabels:
            label.target = this.getVectorLabel(
                label.vector.target, label.targetText, **label.kwargs
            )
        return this.getPieceMovement(this.transformableLabels)

    applyMatrix(this, matrix, **kwargs) {
        """
        Applies the transformation represented by the
        given matrix to the number plane, and each vector/similar
        mobject on it.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix.
        **kwargs
            Any valid keyword argument of this.applyTransposedMatrix()
        """
        this.applyTransposedMatrix(np.array(matrix).T, **kwargs)

    applyInverse(this, matrix, **kwargs) {
        """
        This method applies the linear transformation
        represented by the inverse of the passed matrix
        to the number plane, and each vector/similar mobject on it.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix whose inverse is to be applied.
        **kwargs
            Any valid keyword argument of this.applyMatrix()
        """
        this.applyMatrix(np.linalg.inv(matrix), **kwargs)

    applyTransposedMatrix(this, transposedMatrix, **kwargs) {
        """
        Applies the transformation represented by the
        given transposed matrix to the number plane,
        and each vector/similar mobject on it.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix.
        **kwargs
            Any valid keyword argument of this.applyFunction()
        """
        func = this.getTransposedMatrixTransformation(transposedMatrix)
        if "pathArc" not in kwargs:
            netRotation = np.mean(
                [angleOfVector(func(RIGHT)), angleOfVector(func(UP)) - np.pi / 2],
            )
            kwargs["pathArc"] = netRotation
        this.applyFunction(func, **kwargs)

    applyInverseTranspose(this, tMatrix, **kwargs) {
        """
        Applies the inverse of the transformation represented
        by the given transposed matrix to the number plane and each
        vector/similar mobject on it.

        Parameters
        ----------
        matrix : np.ndarray, list, tuple
            The matrix.
        **kwargs
            Any valid keyword argument of this.applyTransposedMatrix()
        """
        tInv = np.linalg.inv(np.array(tMatrix).T).T
        this.applyTransposedMatrix(tInv, **kwargs)

    applyNonlinearTransformation(this, function, **kwargs) {
        """
        Applies the non-linear transformation represented
        by the given function to the number plane and each
        vector/similar mobject on it.

        Parameters
        ----------
        function : Function
            The function.
        **kwargs
            Any valid keyword argument of this.applyFunction()
        """
        this.plane.prepareForNonlinearTransform()
        this.applyFunction(function, **kwargs)

    applyFunction(this, function, addedAnims=[], **kwargs) {
        """
        Applies the given function to each of the mobjects in
        this.transformableMobjects, and plays the animation showing
        this.

        Parameters
        ----------
        function : Function
            The function that affects each point
            of each mobject in this.transformableMobjects.

        addedAnims : list, optional
            Any other animations that need to be played
            simultaneously with this.

        **kwargs
            Any valid keyword argument of a this.play() call.
        """
        if "runTime" not in kwargs:
            kwargs["runTime"] = 3
        anims = (
            [
                ApplyPointwiseFunction(function, tMob)
                for tMob in this.transformableMobjects
            ]
            + [
                this.getVectorMovement(function),
                this.getTransformableLabelMovement(),
                this.getMovingMobjectMovement(function),
            ]
            + [Animation(fMob) for fMob in this.foregroundMobjects]
            + addedAnims
        )
        this.play(*anims, **kwargs)
