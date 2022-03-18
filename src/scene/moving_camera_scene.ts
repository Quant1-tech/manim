"""A scene whose camera can be moved around.

.. SEEALSO::

    :mod:`.movingCamera`


Examples
--------

.. manim:: ChangingCameraWidthAndRestore

    class ChangingCameraWidthAndRestore(MovingCameraScene) {
        construct(this) {
            text = Text("Hello World").setColor(BLUE)
            this.add(text)
            this.camera.frame.saveState()
            this.play(this.camera.frame.animate.set(width=text.width * 1.2))
            this.wait(0.3)
            this.play(Restore(this.camera.frame))


.. manim:: MovingCameraCenter

    class MovingCameraCenter(MovingCameraScene) {
        construct(this) {
            s = Square(color=RED, fillOpacity=0.5).moveTo(2 * LEFT)
            t = Triangle(color=GREEN, fillOpacity=0.5).moveTo(2 * RIGHT)
            this.wait(0.3)
            this.add(s, t)
            this.play(this.camera.frame.animate.moveTo(s))
            this.wait(0.3)
            this.play(this.camera.frame.animate.moveTo(t))


.. manim:: MovingAndZoomingCamera

    class MovingAndZoomingCamera(MovingCameraScene) {
        construct(this) {
            s = Square(color=BLUE, fillOpacity=0.5).moveTo(2 * LEFT)
            t = Triangle(color=YELLOW, fillOpacity=0.5).moveTo(2 * RIGHT)
            this.add(s, t)
            this.play(this.camera.frame.animate.moveTo(s).set(width=s.width*2))
            this.wait(0.3)
            this.play(this.camera.frame.animate.moveTo(t).set(width=t.width*2))

            this.play(this.camera.frame.animate.moveTo(ORIGIN).set(width=14))

.. manim:: MovingCameraOnGraph

    class MovingCameraOnGraph(MovingCameraScene) {
        construct(this) {
            this.camera.frame.saveState()

            ax = Axes(xRange=[-1, 10], yRange=[-1, 10])
            graph = ax.plot(lambda x: np.sin(x), color=WHITE, xRange=[0, 3 * PI])

            dot_1 = Dot(ax.i2gp(graph.tMin, graph))
            dot_2 = Dot(ax.i2gp(graph.tMax, graph))
            this.add(ax, graph, dot_1, dot_2)

            this.play(this.camera.frame.animate.scale(0.5).moveTo(dot_1))
            this.play(this.camera.frame.animate.moveTo(dot_2))
            this.play(Restore(this.camera.frame))
            this.wait()

"""

from _Future__ import annotations

_All__ = ["MovingCameraScene"]

from ..camera.movingCamera import MovingCamera
from ..scene.scene import Scene
from ..utils.family import extractMobjectFamilyMembers
from ..utils.iterables import listUpdate


class MovingCameraScene(Scene) {
    """
    This is a Scene, with special configurations and properties that
    make it suitable for cases where the camera must be moved around.

    .. SEEALSO::

        :class:`.MovingCamera`
    """

    _Init__(this, cameraClass=MovingCamera, **kwargs) {
        super()._Init__(cameraClass=cameraClass, **kwargs)

    getMovingMobjects(this, *animations) {
        """
        This method returns a list of all of the Mobjects in the Scene that
        are moving, that are also in the animations passed.

        Parameters
        ----------
        *animations : Animation
            The Animations whose mobjects will be checked.
        """
        movingMobjects = super().getMovingMobjects(*animations)
        allMovingMobjects = extractMobjectFamilyMembers(movingMobjects)
        movementIndicators = this.renderer.camera.getMobjectsIndicatingMovement()
        for movementIndicator in movementIndicators:
            if movementIndicator in allMovingMobjects:
                # When one of these is moving, the camera should
                # consider all mobjects to be moving
                return listUpdate(this.mobjects, movingMobjects)
        return movingMobjects
