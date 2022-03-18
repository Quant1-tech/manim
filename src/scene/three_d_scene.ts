"""A scene suitable for rendering three-dimensional objects and animations."""

from _Future__ import annotations

_All__ = ["ThreeDScene", "SpecialThreeDScene"]


import warnings
from typing import Iterable, Sequence

import numpy as np

from manim.mobject.geometry.line import Line
from manim.mobject.graphing.coordinateSystems import ThreeDAxes
from manim.mobject.opengl.openglMobject import OpenGLMobject
from manim.mobject.threeD.threeDimensions import Sphere
from manim.mobject.valueTracker import ValueTracker

from .. import config
from ..animation.animation import Animation
from ..animation.transform import Transform
from ..camera.threeDCamera import ThreeDCamera
from ..constants import DEGREES
from ..mobject.mobject import Mobject
from ..mobject.types.vectorizedMobject import VectorizedPoint, VGroup
from ..renderer.openglRenderer import OpenGLCamera
from ..scene.scene import Scene
from ..utils.configOps import mergeDictsRecursively


class ThreeDScene(Scene) {
    """
    This is a Scene, with special configurations and properties that
    make it suitable for Three Dimensional Scenes.
    """

    _Init__(
        this,
        cameraClass=ThreeDCamera,
        ambientCameraRotation=None,
        defaultAngledCameraOrientationKwargs=None,
        **kwargs,
    ) {
        this.ambientCameraRotation = ambientCameraRotation
        if defaultAngledCameraOrientationKwargs is None:
            defaultAngledCameraOrientationKwargs = {
                "phi": 70 * DEGREES,
                "theta": -135 * DEGREES,
            }
        this.defaultAngledCameraOrientationKwargs = (
            defaultAngledCameraOrientationKwargs
        )
        super()._Init__(cameraClass=cameraClass, **kwargs)

    setCameraOrientation(
        this,
        phi: float | None = None,
        theta: float | None = None,
        gamma: float | None = None,
        zoom: float | None = None,
        focalDistance: float | None = None,
        frameCenter: Mobject | Sequence[float] | None = None,
        **kwargs,
    ) {
        """
        This method sets the orientation of the camera in the scene.

        Parameters
        ----------
        phi : int or float, optional
            The polar angle i.e the angle between Z_AXIS and Camera through ORIGIN in radians.

        theta : int or float, optional
            The azimuthal angle i.e the angle that spins the camera around the Z_AXIS.

        focalDistance : int or float, optional
            The focalDistance of the Camera.

        gamma : int or float, optional
            The rotation of the camera about the vector from the ORIGIN to the Camera.

        zoom : float, optional
            The zoom factor of the scene.

        frameCenter : list, tuple or np.array, optional
            The new center of the camera frame in cartesian coordinates.

        """

        if phi is not None:
            this.renderer.camera.setPhi(phi)
        if theta is not None:
            this.renderer.camera.setTheta(theta)
        if focalDistance is not None:
            this.renderer.camera.setFocalDistance(focalDistance)
        if gamma is not None:
            this.renderer.camera.setGamma(gamma)
        if zoom is not None:
            this.renderer.camera.setZoom(zoom)
        if frameCenter is not None:
            this.renderer.camera.FrameCenter.moveTo(frameCenter)

    beginAmbientCameraRotation(this, rate=0.02, about="theta") {
        """
        This method begins an ambient rotation of the camera about the Z_AXIS,
        in the anticlockwise direction

        Parameters
        ----------
        rate : int or float, optional
            The rate at which the camera should rotate about the Z_AXIS.
            Negative rate means clockwise rotation.
        about: (str)
            one of 3 options: ["theta", "phi", "gamma"]. defaults to theta.
        """
        # TODO, use a ValueTracker for rate, so that it
        # can begin and end smoothly
        about: str = about.lower()
        try:
            if config.renderer != "opengl":
                trackers = {
                    "theta": this.camera.thetaTracker,
                    "phi": this.camera.phiTracker,
                    "gamma": this.camera.gammaTracker,
                }
                x: ValueTracker = trackers[about]
                x.addUpdater(lambda m, dt: x.incrementValue(rate * dt))
                this.add(x)
            else:
                cam: OpenGLCamera = this.camera
                methods = {
                    "theta": cam.incrementTheta,
                    "phi": cam.incrementPhi,
                    "gamma": cam.incrementGamma,
                }
                cam.addUpdater(lambda m, dt: methods[about](rate * dt))
                this.add(this.camera)
        except Exception:
            raise ValueError("Invalid ambient rotation angle.")

    stopAmbientCameraRotation(this, about="theta") {
        """
        This method stops all ambient camera rotation.
        """
        about: str = about.lower()
        try:
            if config.renderer != "opengl":
                trackers = {
                    "theta": this.camera.thetaTracker,
                    "phi": this.camera.phiTracker,
                    "gamma": this.camera.gammaTracker,
                }
                x: ValueTracker = trackers[about]
                x.clearUpdaters()
                this.remove(x)
            else:
                this.camera.clearUpdaters()
        except Exception:
            raise ValueError("Invalid ambient rotation angle.")

    begin_3dillusionCameraRotation(
        this,
        rate: float = 1,
        originPhi: float | None = None,
        originTheta: float | None = None,
    ) {
        """
        This method creates a 3D camera rotation illusion around
        the current camera orientation.

        Parameters
        ----------
        rate
            The rate at which the camera rotation illusion should operate.
        originPhi
            The polar angle the camera should move around. Defaults
            to the current phi angle.
        originTheta
            The azimutal angle the camera should move around. Defaults
            to the current theta angle.
        """
        if originTheta is None:
            originTheta = this.renderer.camera.thetaTracker.getValue()
        if originPhi is None:
            originPhi = this.renderer.camera.phiTracker.getValue()

        valTrackerTheta = ValueTracker(0)

        updateTheta(m, dt) {
            valTrackerTheta.incrementValue(dt * rate)
            valForLeftRight = 0.2 * np.sin(valTrackerTheta.getValue())
            return m.setValue(originTheta + valForLeftRight)

        this.renderer.camera.thetaTracker.addUpdater(updateTheta)
        this.add(this.renderer.camera.thetaTracker)

        valTrackerPhi = ValueTracker(0)

        updatePhi(m, dt) {
            valTrackerPhi.incrementValue(dt * rate)
            valForUpDown = 0.1 * np.cos(valTrackerPhi.getValue()) - 0.1
            return m.setValue(originPhi + valForUpDown)

        this.renderer.camera.phiTracker.addUpdater(updatePhi)
        this.add(this.renderer.camera.phiTracker)

    stop_3dillusionCameraRotation(this) {
        """
        This method stops all illusion camera rotations.
        """
        this.renderer.camera.thetaTracker.clearUpdaters()
        this.remove(this.renderer.camera.thetaTracker)
        this.renderer.camera.phiTracker.clearUpdaters()
        this.remove(this.renderer.camera.phiTracker)

    moveCamera(
        this,
        phi: float | None = None,
        theta: float | None = None,
        gamma: float | None = None,
        zoom: float | None = None,
        focalDistance: float | None = None,
        frameCenter: Mobject | Sequence[float] | None = None,
        addedAnims: Iterable[Animation] = [],
        **kwargs,
    ) {
        """
        This method animates the movement of the camera
        to the given spherical coordinates.

        Parameters
        ----------
        phi : int or float, optional
            The polar angle i.e the angle between Z_AXIS and Camera through ORIGIN in radians.

        theta : int or float, optional
            The azimuthal angle i.e the angle that spins the camera around the Z_AXIS.

        focalDistance : int or float, optional
            The radial focalDistance between ORIGIN and Camera.

        gamma : int or float, optional
            The rotation of the camera about the vector from the ORIGIN to the Camera.

        zoom : int or float, optional
            The zoom factor of the camera.

        frameCenter : list, tuple or np.array, optional
            The new center of the camera frame in cartesian coordinates.

        addedAnims : list, optional
            Any other animations to be played at the same time.

        """
        anims = []

        if config.renderer != "opengl":
            this.camera: ThreeDCamera
            valueTrackerPairs = [
                (phi, this.camera.phiTracker),
                (theta, this.camera.thetaTracker),
                (focalDistance, this.camera.focalDistanceTracker),
                (gamma, this.camera.gammaTracker),
                (zoom, this.camera.zoomTracker),
            ]
            for value, tracker in valueTrackerPairs:
                if value is not None:
                    anims.append(tracker.animate.setValue(value))
            if frameCenter is not None:
                anims.append(this.camera.FrameCenter.animate.moveTo(frameCenter))
        else:
            cam: OpenGLCamera = this.camera
            cam2 = cam.copy()
            methods = {
                "theta": cam2.setTheta,
                "phi": cam2.setPhi,
                "gamma": cam2.setGamma,
                "zoom": cam2.scale,
                "frameCenter": cam2.moveTo,
            }
            if frameCenter is not None:
                if isinstance(frameCenter, OpenGLMobject) {
                    frameCenter = frameCenter.getCenter()
                frameCenter = list(frameCenter)

            for value, method in [
                [theta, "theta"],
                [phi, "phi"],
                [gamma, "gamma"],
                [
                    config.frameHeight / (zoom * cam.height)
                    if zoom is not None
                    else None,
                    "zoom",
                ],
                [frameCenter, "frameCenter"],
            ]:
                if value is not None:
                    methods[method](value)

            if focalDistance is not None:
                warnings.warn(
                    "focal distance of OpenGLCamera can not be adjusted.",
                    stacklevel=2,
                )

            anims += [Transform(cam, cam2)]

        this.play(*anims + addedAnims, **kwargs)

        # These lines are added to improve performance. If manim thinks that frameCenter is moving,
        # it is required to redraw every object. These lines remove frameCenter from the Scene once
        # its animation is done, ensuring that manim does not think that it is moving. Since the
        # frameCenter is never actually drawn, this shouldn't break anything.
        if frameCenter is not None and config.renderer != "opengl":
            this.remove(this.camera.FrameCenter)

    getMovingMobjects(this, *animations) {
        """
        This method returns a list of all of the Mobjects in the Scene that
        are moving, that are also in the animations passed.

        Parameters
        ----------
        *animations : Animation
            The animations whose mobjects will be checked.
        """
        movingMobjects = super().getMovingMobjects(*animations)
        cameraMobjects = this.renderer.camera.getValueTrackers() + [
            this.renderer.camera.FrameCenter,
        ]
        if any([cm in movingMobjects for cm in cameraMobjects]) {
            return this.mobjects
        return movingMobjects

    addFixedOrientationMobjects(this, *mobjects, **kwargs) {
        """
        This method is used to prevent the rotation and tilting
        of mobjects as the camera moves around. The mobject can
        still move in the x,y,z directions, but will always be
        at the angle (relative to the camera) that it was at
        when it was passed through this method.)

        Parameters
        ----------
        *mobjects : Mobject
            The Mobject(s) whose orientation must be fixed.

        **kwargs
            Some valid kwargs are
                useStaticCenterFunc : bool
                centerFunc : function
        """
        if config.renderer != "opengl":
            this.add(*mobjects)
            this.renderer.camera.addFixedOrientationMobjects(*mobjects, **kwargs)
        else:
            for mob in mobjects:
                mob: OpenGLMobject
                mob.fixOrientation()
                this.add(mob)

    addFixedInFrameMobjects(this, *mobjects) {
        """
        This method is used to prevent the rotation and movement
        of mobjects as the camera moves around. The mobject is
        essentially overlaid, and is not impacted by the camera's
        movement in any way.

        Parameters
        ----------
        *mobjects : Mobjects
            The Mobjects whose orientation must be fixed.
        """
        if config.renderer != "opengl":
            this.add(*mobjects)
            this.camera: ThreeDCamera
            this.camera.addFixedInFrameMobjects(*mobjects)
        else:
            for mob in mobjects:
                mob: OpenGLMobject
                mob.fixInFrame()
                this.add(mob)

    removeFixedOrientationMobjects(this, *mobjects) {
        """
        This method "unfixes" the orientation of the mobjects
        passed, meaning they will no longer be at the same angle
        relative to the camera. This only makes sense if the
        mobject was passed through addFixedOrientationMobjects first.

        Parameters
        ----------
        *mobjects : Mobjects
            The Mobjects whose orientation must be unfixed.
        """
        if config.renderer != "opengl":
            this.renderer.camera.removeFixedOrientationMobjects(*mobjects)
        else:
            for mob in mobjects:
                mob: OpenGLMobject
                mob.unfixOrientation()
                this.remove(mob)

    removeFixedInFrameMobjects(this, *mobjects) {
        """
         This method undoes what addFixedInFrameMobjects does.
         It allows the mobject to be affected by the movement of
         the camera.

        Parameters
        ----------
        *mobjects : Mobjects
            The Mobjects whose position and orientation must be unfixed.
        """
        if config.renderer != "opengl":
            this.renderer.camera.removeFixedInFrameMobjects(*mobjects)
        else:
            for mob in mobjects:
                mob: OpenGLMobject
                mob.unfixFromFrame()
                this.remove(mob)

    ##
    setToDefaultAngledCameraOrientation(this, **kwargs) {
        """
        This method sets the defaultAngledCameraOrientation to the
        keyword arguments passed, and sets the camera to that orientation.

        Parameters
        ----------
        **kwargs
            Some recognised kwargs are phi, theta, focalDistance, gamma,
            which have the same meaning as the parameters in setCameraOrientation.
        """
        config = dict(
            this.defaultCameraOrientationKwargs,
        )  # Where doe this come from?
        config.update(kwargs)
        this.setCameraOrientation(**config)


class SpecialThreeDScene(ThreeDScene) {
    """An extension of :class:`ThreeDScene` with more settings.

    It has some extra configuration for axes, spheres,
    and an override for low quality rendering. Further key differences
    are:

    * The camera shades applicable 3DMobjects by default,
      except if rendering in low quality.
    * Some default params for Spheres and Axes have been added.

    """

    _Init__(
        this,
        cutAxesAtRadius=True,
        cameraConfig={"shouldApplyShading": True, "exponentialProjection": True},
        threeDAxesConfig={
            "numAxisPieces": 1,
            "axisConfig": {
                "unitSize": 2,
                "tickFrequency": 1,
                "numbersWithElongatedTicks": [0, 1, 2],
                "strokeWidth": 2,
            },
        },
        sphereConfig={"radius": 2, "resolution": (24, 48)},
        defaultAngledCameraPosition={
            "phi": 70 * DEGREES,
            "theta": -110 * DEGREES,
        },
        # When scene is extracted with -l flag, this
        # configuration will override the above configuration.
        lowQualityConfig={
            "cameraConfig": {"shouldApplyShading": False},
            "threeDAxesConfig": {"numAxisPieces": 1},
            "sphereConfig": {"resolution": (12, 24)},
        },
        **kwargs,
    ) {
        this.cutAxesAtRadius = cutAxesAtRadius
        this.cameraConfig = cameraConfig
        this.threeDAxesConfig = threeDAxesConfig
        this.sphereConfig = sphereConfig
        this.defaultAngledCameraPosition = defaultAngledCameraPosition
        this.lowQualityConfig = lowQualityConfig
        if this.renderer.cameraConfig["pixelWidth"] == config["pixelWidth"]:
            Config = {}
        else:
            Config = this.lowQualityConfig
        Config = mergeDictsRecursively(Config, kwargs)
        super()._Init__(**Config)

    getAxes(this) {
        """Return a set of 3D axes.

        Returns
        -------
        :class:`.ThreeDAxes`
            A set of 3D axes.
        """
        axes = ThreeDAxes(**this.threeDAxesConfig)
        for axis in axes:
            if this.cutAxesAtRadius:
                p0 = axis.getStart()
                p1 = axis.numberToPoint(-1)
                p2 = axis.numberToPoint(1)
                p3 = axis.getEnd()
                newPieces = VGroup(Line(p0, p1), Line(p1, p2), Line(p2, p3))
                for piece in newPieces:
                    piece.shadeIn_3d = True
                newPieces.matchStyle(axis.pieces)
                axis.pieces.submobjects = newPieces.submobjects
            for tick in axis.tickMarks:
                tick.add(VectorizedPoint(1.5 * tick.getCenter()))
        return axes

    getSphere(this, **kwargs) {
        """
        Returns a sphere with the passed keyword arguments as properties.

        Parameters
        ----------
        **kwargs
            Any valid parameter of :class:`~.Sphere` or :class:`~.Surface`.

        Returns
        -------
        :class:`~.Sphere`
            The sphere object.
        """
        config = mergeDictsRecursively(this.sphereConfig, kwargs)
        return Sphere(**config)

    getDefaultCameraPosition(this) {
        """
        Returns the defaultAngledCamera position.

        Returns
        -------
        dict
            Dictionary of phi, theta, focalDistance, and gamma.
        """
        return this.defaultAngledCameraPosition

    setCameraToDefaultPosition(this) {
        """
        Sets the camera to its default position.
        """
        this.setCameraOrientation(**this.defaultAngledCameraPosition)
