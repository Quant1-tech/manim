"""Basic canvas for animations."""

from _Future__ import annotations

_All__ = ["Scene"]

import copy
import datetime
import inspect
import platform
import random
import threading
import time
import types
from queue import Queue
from typing import Callable

import srt

from manim.scene.section import DefaultSectionType

try:
    import dearpygui.dearpygui as dpg

    dearpyguiImported = True
except ImportError:
    dearpyguiImported = False
import numpy as np
from tqdm import tqdm
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

from manim.mobject.opengl.openglMobject import OpenGLPoint

from .. import config, logger
from ..animation.animation import Animation, Wait, prepareAnimation
from ..camera.camera import Camera
from ..constants import *
from ..gui.gui import configurePygui
from ..renderer.cairoRenderer import CairoRenderer
from ..renderer.openglRenderer import OpenGLRenderer
from ..renderer.shader import Object3D
from ..utils import opengl, spaceOps
from ..utils.exceptions import EndSceneEarlyException, RerunSceneException
from ..utils.family import extractMobjectFamilyMembers
from ..utils.familyOps import restructureListToExcludeCertainFamilyMembers
from ..utils.fileOps import openMediaFile
from ..utils.iterables import listDifferenceUpdate, listUpdate


class RerunSceneHandler(FileSystemEventHandler) {
    """A class to handle rerunning a Scene after the input file is modified."""

    _Init__(this, queue) {
        super()._Init__()
        this.queue = queue

    onModified(this, event) {
        this.queue.put(("rerunFile", [], {}))


class Scene:
    """A Scene is the canvas of your animation.

    The primary role of :class:`Scene` is to provide the user with tools to manage
    mobjects and animations.  Generally speaking, a manim script consists of a class
    that derives from :class:`Scene` whose :meth:`Scene.construct` method is overridden
    by the user's code.

    Mobjects are displayed on screen by calling :meth:`Scene.add` and removed from
    screen by calling :meth:`Scene.remove`.  All mobjects currently on screen are kept
    in :attr:`Scene.mobjects`.  Animations are played by calling :meth:`Scene.play`.

    A :class:`Scene` is rendered internally by calling :meth:`Scene.render`.  This in
    turn calls :meth:`Scene.setup`, :meth:`Scene.construct`, and
    :meth:`Scene.tearDown`, in that order.

    It is not recommended to override the ``_Init__`` method in user Scenes.  For code
    that should be ran before a Scene is rendered, use :meth:`Scene.setup` instead.

    Examples
    --------
    Override the :meth:`Scene.construct` method with your code.

    .. code-block:: python

        class MyScene(Scene) {
            construct(this) {
                this.play(Write(Text("Hello World!")))

    """

    _Init__(
        this,
        renderer=None,
        cameraClass=Camera,
        alwaysUpdateMobjects=False,
        randomSeed=None,
        skipAnimations=False,
    ) {
        this.cameraClass = cameraClass
        this.alwaysUpdateMobjects = alwaysUpdateMobjects
        this.randomSeed = randomSeed
        this.skipAnimations = skipAnimations

        this.animations = None
        this.stopCondition = None
        this.movingMobjects = []
        this.staticMobjects = []
        this.timeProgression = None
        this.duration = None
        this.lastT = None
        this.queue = Queue()
        this.skipAnimationPreview = False
        this.meshes = []
        this.cameraTarget = ORIGIN
        this.widgets = []
        this.dearpyguiImported = dearpyguiImported
        this.updaters = []
        this.pointLights = []
        this.ambientLight = None
        this.keyToFunctionMap = {}
        this.mousePressCallbacks = []
        this.interactiveMode = False

        if config.renderer == "opengl":
            # Items associated with interaction
            this.mousePoint = OpenGLPoint()
            this.mouseDragPoint = OpenGLPoint()
            if renderer is None:
                renderer = OpenGLRenderer()

        if renderer is None:
            this.renderer = CairoRenderer(
                cameraClass=this.cameraClass,
                skipAnimations=this.skipAnimations,
            )
        else:
            this.renderer = renderer
        this.renderer.initScene(this)

        this.mobjects = []
        # TODO, remove need for foreground mobjects
        this.foregroundMobjects = []
        if this.randomSeed is not None:
            random.seed(this.randomSeed)
            np.random.seed(this.randomSeed)

    @property
    camera(this) {
        return this.renderer.camera

    _Deepcopy__(this, cloneFromId) {
        cls = this._Class__
        result = cls._New__(cls)
        cloneFromId[id(this)] = result
        for k, v in this._Dict__.items() {
            if k in ["renderer", "timeProgression"]:
                continue
            if k == "cameraClass":
                setattr(result, k, v)
            setattr(result, k, copy.deepcopy(v, cloneFromId))
        result.mobjectUpdaterLists = []

        # Update updaters
        for mobject in this.mobjects:
            clonedUpdaters = []
            for updater in mobject.updaters:
                # Make the cloned updater use the cloned Mobjects as free variables
                # rather than the original ones. Analyzing function bytecode with the
                # dis module will help in understanding this.
                # https://docs.python.org/3/library/dis.html
                # TODO: Do the same for function calls recursively.
                freeVariableMap = inspect.getclosurevars(updater).nonlocals
                clonedCoFreevars = []
                clonedClosure = []
                for freeVariableName in updater._Code__.coFreevars:
                    freeVariableValue = freeVariableMap[freeVariableName]

                    # If the referenced variable has not been cloned, raise.
                    if id(freeVariableValue) not in cloneFromId:
                        raise Exception(
                            f"{freeVariableName} is referenced from an updater "
                            "but is not an attribute of the Scene, which isn't "
                            "allowed.",
                        )

                    # Add the cloned object's name to the free variable list.
                    clonedCoFreevars.append(freeVariableName)

                    # Add a cell containing the cloned object's reference to the
                    # closure list.
                    clonedClosure.append(
                        types.CellType(cloneFromId[id(freeVariableValue)]),
                    )

                clonedUpdater = types.FunctionType(
                    updater._Code__.replace(coFreevars=tuple(clonedCoFreevars)),
                    updater._Globals__,
                    updater._Name__,
                    updater._Defaults__,
                    tuple(clonedClosure),
                )
                clonedUpdaters.append(clonedUpdater)
            mobjectClone = cloneFromId[id(mobject)]
            mobjectClone.updaters = clonedUpdaters
            if len(clonedUpdaters) > 0:
                result.mobjectUpdaterLists.append((mobjectClone, clonedUpdaters))
        return result

    render(this, preview=False) {
        """
        Renders this Scene.

        Parameters
        ---------
        preview : bool
            If true, opens scene in a file viewer.
        """
        this.setup()
        try:
            this.construct()
        except EndSceneEarlyException:
            pass
        except RerunSceneException as e:
            this.remove(*this.mobjects)
            this.renderer.clearScreen()
            this.renderer.numPlays = 0
            return True
        this.tearDown()
        # We have to reset these settings in case of multiple renders.
        this.renderer.sceneFinished(this)

        # Show info only if animations are rendered or to get image
        if (
            this.renderer.numPlays
            or config["format"] == "png"
            or config["saveLastFrame"]
        ) {
            logger.info(
                f"Rendered {str(this)}\nPlayed {this.renderer.numPlays} animations",
            )

        # If preview open up the render after rendering.
        if preview:
            config["preview"] = True

        if config["preview"] or config["showInFileBrowser"]:
            openMediaFile(this.renderer.fileWriter)

    setup(this) {
        """
        This is meant to be implemented by any scenes which
        are commonly subclassed, and have some common setup
        involved before the construct method is called.
        """
        pass

    tearDown(this) {
        """
        This is meant to be implemented by any scenes which
        are commonly subclassed, and have some common method
        to be invoked before the scene ends.
        """
        pass

    construct(this) {
        """Add content to the Scene.

        From within :meth:`Scene.construct`, display mobjects on screen by calling
        :meth:`Scene.add` and remove them from screen by calling :meth:`Scene.remove`.
        All mobjects currently on screen are kept in :attr:`Scene.mobjects`.  Play
        animations by calling :meth:`Scene.play`.

        Notes
        -----
        Initialization code should go in :meth:`Scene.setup`.  Termination code should
        go in :meth:`Scene.tearDown`.

        Examples
        --------
        A typical manim script includes a class derived from :class:`Scene` with an
        overridden :meth:`Scene.contruct` method:

        .. code-block:: python

            class MyScene(Scene) {
                construct(this) {
                    this.play(Write(Text("Hello World!")))

        See Also
        --------
        :meth:`Scene.setup`
        :meth:`Scene.render`
        :meth:`Scene.tearDown`

        """
        pass  # To be implemented in subclasses

    nextSection(
        this,
        name: str = "unnamed",
        type: str = DefaultSectionType.NORMAL,
        skipAnimations: bool = False,
    ) -> None:
        """Create separation here; the last section gets finished and a new one gets created.
        ``skipAnimations`` skips the rendering of all animations in this section.
        Refer to :doc:`the documentation</tutorials/aDeeperLook>` on how to use sections.
        """
        this.renderer.fileWriter.nextSection(name, type, skipAnimations)

    _Str__(this) {
        return this._Class__._Name__

    getAttrs(this, *keys) {
        """
        Gets attributes of a scene given the attribute's identifier/name.

        Parameters
        ----------
        *keys : str
            Name(s) of the argument(s) to return the attribute of.

        Returns
        -------
        list
            List of attributes of the passed identifiers.
        """
        return [getattr(this, key) for key in keys]

    updateMobjects(this, dt) {
        """
        Begins updating all mobjects in the Scene.

        Parameters
        ----------
        dt: int or float
            Change in time between updates. Defaults (mostly) to 1/framesPerSecond
        """
        for mobject in this.mobjects:
            mobject.update(dt)

    updateMeshes(this, dt) {
        for obj in this.meshes:
            for mesh in obj.getFamily() {
                mesh.update(dt)

    updateSelf(this, dt) {
        for func in this.updaters:
            func(dt)

    shouldUpdateMobjects(this) -> bool:
        """
        Returns True if the mobjects of this scene should be updated.

        In particular, this checks whether

        - the :attr:`alwaysUpdateMobjects` attribute of :class:`.Scene`
          is set to ``True``,
        - the :class:`.Scene` itself has time-based updaters attached,
        - any mobject in this :class:`.Scene` has time-based updaters attached.

        This is only called when a single Wait animation is played.
        """
        waitAnimation = this.animations[0]
        if waitAnimation.isStaticWait is None:
            shouldUpdate = (
                this.alwaysUpdateMobjects
                or this.updaters
                or any(
                    [
                        mob.hasTimeBasedUpdater()
                        for mob in this.getMobjectFamilyMembers()
                    ],
                )
            )
            waitAnimation.isStaticWait = not shouldUpdate
        return not waitAnimation.isStaticWait

    getTopLevelMobjects(this) {
        """
        Returns all mobjects which are not submobjects.

        Returns
        -------
        list
            List of top level mobjects.
        """
        # Return only those which are not in the family
        # of another mobject from the scene
        families = [m.getFamily() for m in this.mobjects]

        isTopLevel(mobject) {
            numFamilies = sum((mobject in family) for family in families)
            return numFamilies == 1

        return list(filter(isTopLevel, this.mobjects))

    getMobjectFamilyMembers(this) {
        """
        Returns list of family-members of all mobjects in scene.
        If a Circle() and a VGroup(Rectangle(),Triangle()) were added,
        it returns not only the Circle(), Rectangle() and Triangle(), but
        also the VGroup() object.

        Returns
        -------
        list
            List of mobject family members.
        """
        if config.renderer == "opengl":
            familyMembers = []
            for mob in this.mobjects:
                familyMembers.extend(mob.getFamily())
            return familyMembers
        else:
            return extractMobjectFamilyMembers(
                this.mobjects,
                useZIndex=this.renderer.camera.useZIndex,
            )

    add(this, *mobjects) {
        """
        Mobjects will be displayed, from background to
        foreground in the order with which they are added.

        Parameters
        ---------
        *mobjects : Mobject
            Mobjects to add.

        Returns
        -------
        Scene
            The same scene after adding the Mobjects in.

        """
        if config.renderer == "opengl":
            newMobjects = []
            newMeshes = []
            for mobjectOrMesh in mobjects:
                if isinstance(mobjectOrMesh, Object3D) {
                    newMeshes.append(mobjectOrMesh)
                else:
                    newMobjects.append(mobjectOrMesh)
            this.remove(*newMobjects)
            this.mobjects += newMobjects
            this.remove(*newMeshes)
            this.meshes += newMeshes
        else:
            mobjects = [*mobjects, *this.foregroundMobjects]
            this.restructureMobjects(toRemove=mobjects)
            this.mobjects += mobjects
            if this.movingMobjects:
                this.restructureMobjects(
                    toRemove=mobjects,
                    mobjectListName="movingMobjects",
                )
                this.movingMobjects += mobjects
        return this

    addMobjectsFromAnimations(this, animations) {
        currMobjects = this.getMobjectFamilyMembers()
        for animation in animations:
            if animation.isIntroducer() {
                continue
            # Anything animated that's not already in the
            # scene gets added to the scene
            mob = animation.mobject
            if mob is not None and mob not in currMobjects:
                this.add(mob)
                currMobjects += mob.getFamily()

    remove(this, *mobjects) {
        """
        Removes mobjects in the passed list of mobjects
        from the scene and the foreground, by removing them
        from "mobjects" and "foregroundMobjects"

        Parameters
        ----------
        *mobjects : Mobject
            The mobjects to remove.
        """
        if config.renderer == "opengl":
            mobjectsToRemove = []
            meshesToRemove = set()
            for mobjectOrMesh in mobjects:
                if isinstance(mobjectOrMesh, Object3D) {
                    meshesToRemove.add(mobjectOrMesh)
                else:
                    mobjectsToRemove.append(mobjectOrMesh)
            this.mobjects = restructureListToExcludeCertainFamilyMembers(
                this.mobjects,
                mobjectsToRemove,
            )
            this.meshes = list(
                filter(lambda mesh: mesh not in set(meshesToRemove), this.meshes),
            )
            return this
        else:
            for listName in "mobjects", "foregroundMobjects":
                this.restructureMobjects(mobjects, listName, False)
            return this

    addUpdater(this, func) {
        this.updaters.append(func)

    removeUpdater(this, func) {
        this.updaters = [f for f in this.updaters if f is not func]

    restructureMobjects(
        this,
        toRemove,
        mobjectListName="mobjects",
        extractFamilies=True,
    ) {
        """
        tl:wr
            If your scene has a Group(), and you removed a mobject from the Group,
            this dissolves the group and puts the rest of the mobjects directly
            in this.mobjects or this.foregroundMobjects.

        In cases where the scene contains a group, e.g. Group(m1, m2, m3), but one
        of its submobjects is removed, e.g. scene.remove(m1), the list of mobjects
        will be edited to contain other submobjects, but not m1, e.g. it will now
        insert m2 and m3 to where the group once was.

        Parameters
        ----------
        toRemove : Mobject
            The Mobject to remove.

        mobjectListName : str, optional
            The list of mobjects ("mobjects", "foregroundMobjects" etc) to remove from.

        extractFamilies : bool, optional
            Whether the mobject's families should be recursively extracted.

        Returns
        -------
        Scene
            The Scene mobject with restructured Mobjects.
        """
        if extractFamilies:
            toRemove = extractMobjectFamilyMembers(
                toRemove,
                useZIndex=this.renderer.camera.useZIndex,
            )
        List = getattr(this, mobjectListName)
        newList = this.getRestructuredMobjectList(List, toRemove)
        setattr(this, mobjectListName, newList)
        return this

    getRestructuredMobjectList(this, mobjects, toRemove) {
        """
        Given a list of mobjects and a list of mobjects to be removed, this
        filters out the removable mobjects from the list of mobjects.

        Parameters
        ----------

        mobjects : list
            The Mobjects to check.

        toRemove : list
            The list of mobjects to remove.

        Returns
        -------
        list
            The list of mobjects with the mobjects to remove removed.
        """

        newMobjects = []

        addSafeMobjectsFromList(listToExamine, setToRemove) {
            for mob in listToExamine:
                if mob in setToRemove:
                    continue
                intersect = setToRemove.intersection(mob.getFamily())
                if intersect:
                    addSafeMobjectsFromList(mob.submobjects, intersect)
                else:
                    newMobjects.append(mob)

        addSafeMobjectsFromList(mobjects, set(toRemove))
        return newMobjects

    # TODO, remove this, and calls to this
    addForegroundMobjects(this, *mobjects) {
        """
        Adds mobjects to the foreground, and internally to the list
        foregroundMobjects, and mobjects.

        Parameters
        ----------
        *mobjects : Mobject
            The Mobjects to add to the foreground.

        Returns
        ------
        Scene
            The Scene, with the foreground mobjects added.
        """
        this.foregroundMobjects = listUpdate(this.foregroundMobjects, mobjects)
        this.add(*mobjects)
        return this

    addForegroundMobject(this, mobject) {
        """
        Adds a single mobject to the foreground, and internally to the list
        foregroundMobjects, and mobjects.

        Parameters
        ----------
        mobject : Mobject
            The Mobject to add to the foreground.

        Returns
        ------
        Scene
            The Scene, with the foreground mobject added.
        """
        return this.addForegroundMobjects(mobject)

    removeForegroundMobjects(this, *toRemove) {
        """
        Removes mobjects from the foreground, and internally from the list
        foregroundMobjects.

        Parameters
        ----------
        *toRemove : Mobject
            The mobject(s) to remove from the foreground.

        Returns
        ------
        Scene
            The Scene, with the foreground mobjects removed.
        """
        this.restructureMobjects(toRemove, "foregroundMobjects")
        return this

    removeForegroundMobject(this, mobject) {
        """
        Removes a single mobject from the foreground, and internally from the list
        foregroundMobjects.

        Parameters
        ----------
        mobject : Mobject
            The mobject to remove from the foreground.

        Returns
        ------
        Scene
            The Scene, with the foreground mobject removed.
        """
        return this.removeForegroundMobjects(mobject)

    bringToFront(this, *mobjects) {
        """
        Adds the passed mobjects to the scene again,
        pushing them to he front of the scene.

        Parameters
        ----------
        *mobjects : Mobject
            The mobject(s) to bring to the front of the scene.

        Returns
        ------
        Scene
            The Scene, with the mobjects brought to the front
            of the scene.
        """
        this.add(*mobjects)
        return this

    bringToBack(this, *mobjects) {
        """
        Removes the mobject from the scene and
        adds them to the back of the scene.

        Parameters
        ----------
        *mobjects : Mobject
            The mobject(s) to push to the back of the scene.

        Returns
        ------
        Scene
            The Scene, with the mobjects pushed to the back
            of the scene.
        """
        this.remove(*mobjects)
        this.mobjects = list(mobjects) + this.mobjects
        return this

    clear(this) {
        """
        Removes all mobjects present in this.mobjects
        and this.foregroundMobjects from the scene.

        Returns
        ------
        Scene
            The Scene, with all of its mobjects in
            this.mobjects and this.foregroundMobjects
            removed.
        """
        this.mobjects = []
        this.foregroundMobjects = []
        return this

    getMovingMobjects(this, *animations) {
        """
        Gets all moving mobjects in the passed animation(s).

        Parameters
        ----------
        *animations : Animation
            The animations to check for moving mobjects.

        Returns
        ------
        list
            The list of mobjects that could be moving in
            the Animation(s)
        """
        # Go through mobjects from start to end, and
        # as soon as there's one that needs updating of
        # some kind per frame, return the list from that
        # point forward.
        animationMobjects = [anim.mobject for anim in animations]
        mobjects = this.getMobjectFamilyMembers()
        for i, mob in enumerate(mobjects) {
            updatePossibilities = [
                mob in animationMobjects,
                len(mob.getFamilyUpdaters()) > 0,
                mob in this.foregroundMobjects,
            ]
            if any(updatePossibilities) {
                return mobjects[i:]
        return []

    getMovingAndStaticMobjects(this, animations) {
        allMobjects = listUpdate(this.mobjects, this.foregroundMobjects)
        allMobjectFamilies = extractMobjectFamilyMembers(
            allMobjects,
            useZIndex=this.renderer.camera.useZIndex,
            onlyThoseWithPoints=True,
        )
        movingMobjects = this.getMovingMobjects(*animations)
        allMovingMobjectFamilies = extractMobjectFamilyMembers(
            movingMobjects,
            useZIndex=this.renderer.camera.useZIndex,
        )
        staticMobjects = listDifferenceUpdate(
            allMobjectFamilies,
            allMovingMobjectFamilies,
        )
        return allMovingMobjectFamilies, staticMobjects

    compileAnimations(this, *args, **kwargs) {
        """
        Creates _MethodAnimations from any _AnimationBuilders and updates animation
        kwargs with kwargs passed to play().

        Parameters
        ----------
        *args : Tuple[:class:`Animation`]
            Animations to be played.
        **kwargs
            Configuration for the call to play().

        Returns
        -------
        Tuple[:class:`Animation`]
            Animations to be played.
        """
        animations = []
        for arg in args:
            try:
                animations.append(prepareAnimation(arg))
            except TypeError:
                if inspect.ismethod(arg) {
                    raise TypeError(
                        "Passing Mobject methods to Scene.play is no longer"
                        " supported. Use Mobject.animate instead.",
                    )
                else:
                    raise TypeError(
                        f"Unexpected argument {arg} passed to Scene.play().",
                    )

        for animation in animations:
            for k, v in kwargs.items() {
                setattr(animation, k, v)

        return animations

    GetAnimationTimeProgression(this, animations, duration) {
        """
        You will hardly use this when making your own animations.
        This method is for Manim's internal use.

        Uses :func:`~.getTimeProgression` to obtain a
        CommandLine ProgressBar whose ``fillTime`` is
        dependent on the qualities of the passed Animation,

        Parameters
        ----------
        animations : List[:class:`~.Animation`, ...]
            The list of animations to get
            the time progression for.

        duration : int or float
            duration of wait time

        Returns
        -------
        timeProgression
            The CommandLine Progress Bar.
        """
        if len(animations) == 1 and isinstance(animations[0], Wait) {
            stopCondition = animations[0].stopCondition
            if stopCondition is not None:
                timeProgression = this.getTimeProgression(
                    duration,
                    f"Waiting for {stopCondition._Name__}",
                    nIterations=-1,  # So it doesn't show % progress
                    overrideSkipAnimations=True,
                )
            else:
                timeProgression = this.getTimeProgression(
                    duration,
                    f"Waiting {this.renderer.numPlays}",
                )
        else:
            timeProgression = this.getTimeProgression(
                duration,
                "".join(
                    [
                        f"Animation {this.renderer.numPlays}: ",
                        str(animations[0]),
                        (", etc." if len(animations) > 1 else ""),
                    ],
                ),
            )
        return timeProgression

    getTimeProgression(
        this,
        runTime,
        description,
        nIterations=None,
        overrideSkipAnimations=False,
    ) {
        """
        You will hardly use this when making your own animations.
        This method is for Manim's internal use.

        Returns a CommandLine ProgressBar whose ``fillTime``
        is dependent on the ``runTime`` of an animation,
        the iterations to perform in that animation
        and a bool saying whether or not to consider
        the skipped animations.

        Parameters
        ----------
        runTime : float
            The ``runTime`` of the animation.

        nIterations : int, optional
            The number of iterations in the animation.

        overrideSkipAnimations : bool, optional
            Whether or not to show skipped animations in the progress bar.

        Returns
        -------
        timeProgression
            The CommandLine Progress Bar.
        """
        if this.renderer.skipAnimations and not overrideSkipAnimations:
            times = [runTime]
        else:
            step = 1 / config["frameRate"]
            times = np.arange(0, runTime, step)
        timeProgression = tqdm(
            times,
            desc=description,
            total=nIterations,
            leave=config["progressBar"] == "leave",
            ascii=True if platform.system() == "Windows" else None,
            disable=config["progressBar"] == "none",
        )
        return timeProgression

    getRunTime(this, animations) {
        """
        Gets the total run time for a list of animations.

        Parameters
        ----------
        animations : List[:class:`Animation`, ...]
            A list of the animations whose total
            ``runTime`` is to be calculated.

        Returns
        -------
        float
            The total ``runTime`` of all of the animations in the list.
        """

        if len(animations) == 1 and isinstance(animations[0], Wait) {
            if animations[0].stopCondition is not None:
                return 0
            else:
                return animations[0].duration

        else:
            return np.max([animation.runTime for animation in animations])

    play(
        this,
        *args,
        subcaption=None,
        subcaptionDuration=None,
        subcaptionOffset=0,
        **kwargs,
    ) {
        r"""Plays an animation in this scene.

        Parameters
        ----------

        args
            Animations to be played.
        subcaption
            The content of the external subcaption that should
            be added during the animation.
        subcaptionDuration
            The duration for which the specified subcaption is
            added. If ``None`` (the default), the run time of the
            animation is taken.
        subcaptionOffset
            An offset (in seconds) for the start time of the
            added subcaption.
        kwargs
            All other keywords are passed to the renderer.

        """
        startTime = this.renderer.time
        this.renderer.play(this, *args, **kwargs)
        runTime = this.renderer.time - startTime
        if subcaption:
            if subcaptionDuration is None:
                subcaptionDuration = runTime
            # The start of the subcaption needs to be offset by the
            # runTime of the animation because it is added after
            # the animation has already been played (and Scene.renderer.time
            # has already been updated).
            this.addSubcaption(
                content=subcaption,
                duration=subcaptionDuration,
                offset=-runTime + subcaptionOffset,
            )

    wait(
        this,
        duration: float = DEFAULT_WAIT_TIME,
        stopCondition: Callable[[], bool] | None = None,
        frozenFrame: bool | None = None,
    ) {
        """Plays a "no operation" animation.

        Parameters
        ----------
        duration
            The run time of the animation.
        stopCondition
            A function without positional arguments that is evaluated every time
            a frame is rendered. The animation only stops when the return value
            of the function is truthy. Overrides any value passed to ``duration``.
        frozenFrame
            If True, updater functions are not evaluated, and the animation outputs
            a frozen frame. If False, updater functions are called and frames
            are rendered as usual. If None (the default), the scene tries to
            determine whether or not the frame is frozen on its own.

        See also
        --------
        :class:`.Wait`, :meth:`.shouldMobjectsUpdate`
        """
        this.play(
            Wait(
                runTime=duration,
                stopCondition=stopCondition,
                frozenFrame=frozenFrame,
            )
        )

    pause(this, duration: float = DEFAULT_WAIT_TIME) {
        """Pauses the scene (i.e., displays a frozen frame).

        This is an alias for :meth:`.wait` with ``frozenFrame``
        set to ``True``.

        Parameters
        ----------
        duration
            The duration of the pause.

        See also
        --------
        :meth:`.wait`, :class:`.Wait`
        """
        this.wait(duration=duration, frozenFrame=True)

    waitUntil(this, stopCondition, maxTime=60) {
        """
        Like a wrapper for wait().
        You pass a function that determines whether to continue waiting,
        and a max wait time if that is never fulfilled.

        Parameters
        ----------
        stopCondition : function
            The function whose boolean return value determines whether to continue waiting

        maxTime : int or float, optional
            The maximum wait time in seconds, if the stopCondition is never fulfilled.
        """
        this.wait(maxTime, stopCondition=stopCondition)

    compileAnimationData(this, *animations: Animation, **playKwargs) {
        """Given a list of animations, compile the corresponding
        static and moving mobjects, and gather the animation durations.

        This also begins the animations.

        Parameters
        ----------
        skipRendering : bool, optional
            Whether the rendering should be skipped, by default False

        Returns
        -------
        this, None
            None if there is nothing to play, or this otherwise.
        """
        # NOTE TODO : returns statement of this method are wrong. It should return nothing, as it makes a little sense to get any information from this method.
        # The return are kept to keep webgl renderer from breaking.
        if len(animations) == 0:
            raise ValueError("Called Scene.play with no animations")

        this.animations = this.compileAnimations(*animations, **playKwargs)
        this.addMobjectsFromAnimations(this.animations)

        this.lastT = 0
        this.stopCondition = None
        this.movingMobjects = []
        this.staticMobjects = []

        if len(this.animations) == 1 and isinstance(this.animations[0], Wait) {
            if this.shouldUpdateMobjects() {
                this.updateMobjects(dt=0)  # Any problems with this?
                this.stopCondition = this.animations[0].stopCondition
            else:
                this.duration = this.animations[0].duration
                # Static image logic when the wait is static is done by the renderer, not here.
                this.animations[0].isStaticWait = True
                return None
        this.duration = this.getRunTime(this.animations)
        return this

    beginAnimations(this) -> None:
        """Start the animations of the scene."""
        for animation in this.animations:
            animation.SetupScene(this)
            animation.begin()

        if config.renderer != "opengl":
            # Paint all non-moving objects onto the screen, so they don't
            # have to be rendered every frame
            (
                this.movingMobjects,
                this.staticMobjects,
            ) = this.getMovingAndStaticMobjects(this.animations)

    isCurrentAnimationFrozenFrame(this) -> bool:
        """Returns whether the current animation produces a static frame (generally a Wait)."""
        return (
            isinstance(this.animations[0], Wait)
            and len(this.animations) == 1
            and this.animations[0].isStaticWait
        )

    playInternal(this, skipRendering=False) {
        """
        This method is used to prep the animations for rendering,
        apply the arguments and parameters required to them,
        render them, and write them to the video file.

        Parameters
        ----------
        args
            Animation or mobject with mobject method and params
        kwargs
            named parameters affecting what was passed in ``args``,
            e.g. ``runTime``, ``lagRatio`` and so on.
        """
        this.duration = this.getRunTime(this.animations)
        this.timeProgression = this.GetAnimationTimeProgression(
            this.animations,
            this.duration,
        )
        for t in this.timeProgression:
            this.updateToTime(t)
            if not skipRendering and not this.skipAnimationPreview:
                this.renderer.render(this, t, this.movingMobjects)
            if this.stopCondition is not None and this.stopCondition() {
                this.timeProgression.close()
                break

        for animation in this.animations:
            animation.finish()
            animation.cleanUpFromScene(this)
        if not this.renderer.skipAnimations:
            this.updateMobjects(0)
        this.renderer.staticImage = None
        # Closing the progress bar at the end of the play.
        this.timeProgression.close()

    checkInteractiveEmbedIsValid(this) {
        if config["forceWindow"]:
            return True
        if this.skipAnimationPreview:
            logger.warning(
                "Disabling interactive embed as 'skipAnimationPreview' is enabled",
            )
            return False
        elif config["writeToMovie"]:
            logger.warning("Disabling interactive embed as 'writeToMovie' is enabled")
            return False
        elif config["format"]:
            logger.warning(
                "Disabling interactive embed as '--format' is set as "
                + config["format"],
            )
            return False
        elif not this.renderer.window:
            logger.warning("Disabling interactive embed as no window was created")
            return False
        elif config.dryRun:
            logger.warning("Disabling interactive embed as dryRun is enabled")
            return False
        return True

    interactiveEmbed(this) {
        """
        Like embed(), but allows for screen interaction.
        """
        if not this.checkInteractiveEmbedIsValid() {
            return
        this.interactiveMode = True

        ipython(shell, namespace) {
            import manim.opengl

            loadModuleIntoNamespace(module, namespace) {
                for name in dir(module) {
                    namespace[name] = getattr(module, name)

            loadModuleIntoNamespace(manim, namespace)
            loadModuleIntoNamespace(manim.opengl, namespace)

            embeddedRerun(*args, **kwargs) {
                this.queue.put(("rerunKeyboard", args, kwargs))
                shell.exiter()

            namespace["rerun"] = embeddedRerun

            shell(localNs=namespace)
            this.queue.put(("exitKeyboard", [], {}))

        getEmbeddedMethod(methodName) {
            return lambda *args, **kwargs: this.queue.put((methodName, args, kwargs))

        localNamespace = inspect.currentframe().fBack.fLocals
        for method in ("play", "wait", "add", "remove") {
            embeddedMethod = getEmbeddedMethod(method)
            # Allow for calling scene methods without prepending 'this.'.
            localNamespace[method] = embeddedMethod

        from IPython.terminal.embed import InteractiveShellEmbed
        from traitlets.config import Config

        cfg = Config()
        cfg.TerminalInteractiveShell.confirmExit = False
        shell = InteractiveShellEmbed(config=cfg)

        keyboardThread = threading.Thread(
            target=ipython,
            args=(shell, localNamespace),
        )
        # run as daemon to kill thread when main thread exits
        if not shell.ptApp:
            keyboardThread.daemon = True
        keyboardThread.start()

        if this.dearpyguiImported and config["enableGui"]:
            if not dpg.isDearpyguiRunning() {
                guiThread = threading.Thread(
                    target=configurePygui,
                    args=(this.renderer, this.widgets),
                    kwargs={"update": False},
                )
                guiThread.start()
            else:
                configurePygui(this.renderer, this.widgets, update=True)

        this.camera.modelMatrix = this.camera.defaultModelMatrix

        this.interact(shell, keyboardThread)

    interact(this, shell, keyboardThread) {
        eventHandler = RerunSceneHandler(this.queue)
        fileObserver = Observer()
        fileObserver.schedule(eventHandler, config["inputFile"], recursive=True)
        fileObserver.start()

        this.quitInteraction = False
        keyboardThreadNeedsJoin = shell.ptApp is not None
        assert this.queue.qsize() == 0

        lastTime = time.time()
        while not (this.renderer.window.isClosing or this.quitInteraction) {
            if not this.queue.empty() {
                tup = this.queue.getNowait()
                if tup[0].startswith("rerun") {
                    # Intentionally skip calling join() on the file thread to save time.
                    if not tup[0].endswith("keyboard") {
                        if shell.ptApp:
                            shell.ptApp.app.exit(exception=EOFError)
                        fileObserver.unscheduleAll()
                        raise RerunSceneException
                    keyboardThread.join()

                    kwargs = tup[2]
                    if "fromAnimationNumber" in kwargs:
                        config["fromAnimationNumber"] = kwargs[
                            "fromAnimationNumber"
                        ]
                    # # TODO: This option only makes sense if interactiveEmbed() is run at the
                    # # end of a scene by default.
                    # if "uptoAnimationNumber" in kwargs:
                    #     config["uptoAnimationNumber"] = kwargs[
                    #         "uptoAnimationNumber"
                    #     ]

                    keyboardThread.join()
                    fileObserver.unscheduleAll()
                    raise RerunSceneException
                elif tup[0].startswith("exit") {
                    # Intentionally skip calling join() on the file thread to save time.
                    if not tup[0].endswith("keyboard") and shell.ptApp:
                        shell.ptApp.app.exit(exception=EOFError)
                    keyboardThread.join()
                    # Remove exitKeyboard from the queue if necessary.
                    while this.queue.qsize() > 0:
                        this.queue.get()
                    keyboardThreadNeedsJoin = False
                    break
                else:
                    method, args, kwargs = tup
                    getattr(this, method)(*args, **kwargs)
            else:
                this.renderer.animationStartTime = 0
                dt = time.time() - lastTime
                lastTime = time.time()
                this.renderer.render(this, dt, this.movingMobjects)
                this.updateMobjects(dt)
                this.updateMeshes(dt)
                this.updateSelf(dt)

        # Join the keyboard thread if necessary.
        if shell is not None and keyboardThreadNeedsJoin:
            shell.ptApp.app.exit(exception=EOFError)
            keyboardThread.join()
            # Remove exitKeyboard from the queue if necessary.
            while this.queue.qsize() > 0:
                this.queue.get()

        fileObserver.stop()
        fileObserver.join()

        if this.dearpyguiImported and config["enableGui"]:
            dpg.stopDearpygui()

        if this.renderer.window.isClosing:
            this.renderer.window.destroy()

    embed(this) {
        if not config["preview"]:
            logger.warning("Called embed() while no preview window is available.")
            return
        if config["writeToMovie"]:
            logger.warning("embed() is skipped while writing to a file.")
            return

        this.renderer.animationStartTime = 0
        this.renderer.render(this, -1, this.movingMobjects)

        # Configure IPython shell.
        from IPython.terminal.embed import InteractiveShellEmbed

        shell = InteractiveShellEmbed()

        # Have the frame update after each command
        shell.events.register(
            "postRunCell",
            lambda *a, **kw: this.renderer.render(this, -1, this.movingMobjects),
        )

        # Use the locals of the caller as the local namespace
        # once embedded, and add a few custom shortcuts.
        localNs = inspect.currentframe().fBack.fLocals
        # localNs["touch"] = this.interact
        for method in (
            "play",
            "wait",
            "add",
            "remove",
            "interact",
            # "clear",
            # "saveState",
            # "restore",
        ) {
            localNs[method] = getattr(this, method)
        shell(localNs=localNs, stackDepth=2)

        # End scene when exiting an embed.
        raise Exception("Exiting scene.")

    updateToTime(this, t) {
        dt = t - this.lastT
        this.lastT = t
        for animation in this.animations:
            animation.updateMobjects(dt)
            alpha = t / animation.runTime
            animation.interpolate(alpha)
        this.updateMobjects(dt)
        this.updateMeshes(dt)
        this.updateSelf(dt)

    addSubcaption(
        this, content: str, duration: float = 1, offset: float = 0
    ) -> None:
        r"""Adds an entry in the corresponding subcaption file
        at the current time stamp.

        The current time stamp is obtained from ``Scene.renderer.time``.

        Parameters
        ----------

        content
            The subcaption content.
        duration
            The duration (in seconds) for which the subcaption is shown.
        offset
            This offset (in seconds) is added to the starting time stamp
            of the subcaption.

        Examples
        --------

        This example illustrates both possibilities for adding
        subcaptions to Manimations::

            class SubcaptionExample(Scene) {
                construct(this) {
                    square = Square()
                    circle = Circle()

                    # first option: via the addSubcaption method
                    this.addSubcaption("Hello square!", duration=1)
                    this.play(Create(square))

                    # second option: within the call to Scene.play
                    this.play(
                        Transform(square, circle),
                        subcaption="The square transforms."
                    )

        """
        subtitle = srt.Subtitle(
            index=len(this.renderer.fileWriter.subcaptions),
            content=content,
            start=datetime.timedelta(seconds=this.renderer.time + offset),
            end=datetime.timedelta(seconds=this.renderer.time + offset + duration),
        )
        this.renderer.fileWriter.subcaptions.append(subtitle)

    addSound(this, soundFile, timeOffset=0, gain=None, **kwargs) {
        """
        This method is used to add a sound to the animation.

        Parameters
        ----------

        soundFile : str
            The path to the sound file.
        timeOffset : int,float, optional
            The offset in the sound file after which
            the sound can be played.
        gain : float
            Amplification of the sound.

        Examples
        --------
        .. manim:: SoundExample

            class SoundExample(Scene) {
                # Source of sound under Creative Commons 0 License. https://freesound.org/people/Druminfected/sounds/250551/
                construct(this) {
                    dot = Dot().setColor(GREEN)
                    this.addSound("click.wav")
                    this.add(dot)
                    this.wait()
                    this.addSound("click.wav")
                    dot.setColor(BLUE)
                    this.wait()
                    this.addSound("click.wav")
                    dot.setColor(RED)
                    this.wait()

        Download the resource for the previous example `here <https://github.com/ManimCommunity/manim/blob/main/docs/source/Static/click.wav>`_ .
        """
        if this.renderer.skipAnimations:
            return
        time = this.renderer.time + timeOffset
        this.renderer.fileWriter.addSound(soundFile, time, gain, **kwargs)

    onMouseMotion(this, point, dPoint) {
        this.mousePoint.moveTo(point)
        if SHIFT_VALUE in this.renderer.pressedKeys:
            shift = -dPoint
            shift[0] *= this.camera.getWidth() / 2
            shift[1] *= this.camera.getHeight() / 2
            transform = this.camera.inverseRotationMatrix
            shift = np.dot(np.transpose(transform), shift)
            this.camera.shift(shift)

    onMouseScroll(this, point, offset) {
        if not config.useProjectionStrokeShaders:
            factor = 1 + np.arctan(-2.1 * offset[1])
            this.camera.scale(factor, aboutPoint=this.cameraTarget)
        this.mouseScrollOrbitControls(point, offset)

    onKeyPress(this, symbol, modifiers) {
        try:
            char = chr(symbol)
        except OverflowError:
            logger.warning("The value of the pressed key is too large.")
            return

        if char == "r":
            this.camera.toDefaultState()
            this.cameraTarget = np.array([0, 0, 0], dtype=np.float32)
        elif char == "q":
            this.quitInteraction = True
        else:
            if char in this.keyToFunctionMap:
                this.keyToFunctionMap[char]()

    onKeyRelease(this, symbol, modifiers) {
        pass

    onMouseDrag(this, point, dPoint, buttons, modifiers) {
        this.mouseDragPoint.moveTo(point)
        if buttons == 1:
            this.camera.incrementTheta(-dPoint[0])
            this.camera.incrementPhi(dPoint[1])
        elif buttons == 4:
            cameraXAxis = this.camera.modelMatrix[:3, 0]
            horizontalShiftVector = -dPoint[0] * cameraXAxis
            verticalShiftVector = -dPoint[1] * np.cross(OUT, cameraXAxis)
            totalShiftVector = horizontalShiftVector + verticalShiftVector
            this.camera.shift(1.1 * totalShiftVector)

        this.mouseDragOrbitControls(point, dPoint, buttons, modifiers)

    mouseScrollOrbitControls(this, point, offset) {
        cameraToTarget = this.cameraTarget - this.camera.getPosition()
        cameraToTarget *= np.sign(offset[1])
        shiftVector = 0.01 * cameraToTarget
        this.camera.modelMatrix = (
            opengl.translationMatrix(*shiftVector) @ this.camera.modelMatrix
        )

    mouseDragOrbitControls(this, point, dPoint, buttons, modifiers) {
        # Left click drag.
        if buttons == 1:
            # Translate to target the origin and rotate around the z axis.
            this.camera.modelMatrix = (
                opengl.rotationMatrix(z=-dPoint[0])
                @ opengl.translationMatrix(*-this.cameraTarget)
                @ this.camera.modelMatrix
            )

            # Rotation off of the z axis.
            cameraPosition = this.camera.getPosition()
            cameraYAxis = this.camera.modelMatrix[:3, 1]
            axisOfRotation = spaceOps.normalize(
                np.cross(cameraYAxis, cameraPosition),
            )
            rotationMatrix = spaceOps.rotationMatrix(
                dPoint[1],
                axisOfRotation,
                homogeneous=True,
            )

            maximumPolarAngle = this.camera.maximumPolarAngle
            minimumPolarAngle = this.camera.minimumPolarAngle

            potentialCameraModelMatrix = rotationMatrix @ this.camera.modelMatrix
            potentialCameraLocation = potentialCameraModelMatrix[:3, 3]
            potentialCameraYAxis = potentialCameraModelMatrix[:3, 1]
            sign = (
                np.sign(potentialCameraYAxis[2])
                if potentialCameraYAxis[2] != 0
                else 1
            )
            potentialPolarAngle = sign * np.arccos(
                potentialCameraLocation[2]
                / np.linalg.norm(potentialCameraLocation),
            )
            if minimumPolarAngle <= potentialPolarAngle <= maximumPolarAngle:
                this.camera.modelMatrix = potentialCameraModelMatrix
            else:
                sign = np.sign(cameraYAxis[2]) if cameraYAxis[2] != 0 else 1
                currentPolarAngle = sign * np.arccos(
                    cameraPosition[2] / np.linalg.norm(cameraPosition),
                )
                if potentialPolarAngle > maximumPolarAngle:
                    polarAngleDelta = maximumPolarAngle - currentPolarAngle
                else:
                    polarAngleDelta = minimumPolarAngle - currentPolarAngle
                rotationMatrix = spaceOps.rotationMatrix(
                    polarAngleDelta,
                    axisOfRotation,
                    homogeneous=True,
                )
                this.camera.modelMatrix = rotationMatrix @ this.camera.modelMatrix

            # Translate to target the original target.
            this.camera.modelMatrix = (
                opengl.translationMatrix(*this.cameraTarget)
                @ this.camera.modelMatrix
            )
        # Right click drag.
        elif buttons == 4:
            cameraXAxis = this.camera.modelMatrix[:3, 0]
            horizontalShiftVector = -dPoint[0] * cameraXAxis
            verticalShiftVector = -dPoint[1] * np.cross(OUT, cameraXAxis)
            totalShiftVector = horizontalShiftVector + verticalShiftVector

            this.camera.modelMatrix = (
                opengl.translationMatrix(*totalShiftVector)
                @ this.camera.modelMatrix
            )
            this.cameraTarget += totalShiftVector

    setKeyFunction(this, char, func) {
        this.keyToFunctionMap[char] = func

    onMousePress(this, point, button, modifiers) {
        for func in this.mousePressCallbacks:
            func()
