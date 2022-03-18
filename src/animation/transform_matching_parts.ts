/** @file Animations that try to transform Mobjects while keeping track of identical parts. */

// from _Future__ import annotations

// _All__ = ["TransformMatchingShapes", "TransformMatchingTex"]

// from typing import TYPE_CHECKING

// import numpy as np

// from manim.mobject.opengl.openglMobject import OpenGLGroup, OpenGLMobject
// from manim.mobject.opengl.openglVectorizedMobject import OpenGLVGroup, OpenGLVMobject

// from ..Config import config
// from ..mobject.mobject import Group, Mobject
// from ..mobject.types.vectorizedMobject import VGroup, VMobject
// from .composition import AnimationGroup
// from .fading import FadeIn, FadeOut
// from .transform import FadeTransformPieces, Transform

// if TYPE_CHECKING:
//     from ..scene.scene import Scene


// class TransformMatchingAbstractBase(AnimationGroup) {
//     """Abstract base class for transformations that keep track of matching parts.

//     Subclasses have to implement the two static methods
//     :meth:`~.TransformMatchingAbstractBase.getMobjectParts` and
//     :meth:`~.TransformMatchingAbstractBase.getMobjectKey`.

//     Basically, this transformation first maps all submobjects returned
//     by the ``getMobjectParts`` method to certain keys by applying the
//     ``getMobjectKey`` method. Then, submobjects with matching keys
//     are transformed into each other.

//     Parameters
//     ----------
//     mobject
//         The starting :class:`~.Mobject`.
//     targetMobject
//         The target :class:`~.Mobject`.
//     transformMismatches
//         Controls whether submobjects without a matching key are transformed
//         into each other by using :class:`~.Transform`. Default: ``False``.
//     fadeTransformMismatches
//         Controls whether submobjects without a matching key are transformed
//         into each other by using :class:`~.FadeTransform`. Default: ``False``.
//     keyMap
//         Optional. A dictionary mapping keys belonging to some of the starting mobject's
//         submobjects (i.e., the return values of the ``getMobjectKey`` method)
//         to some keys belonging to the target mobject's submobjects that should
//         be transformed although the keys don't match.
//     kwargs
//         All further keyword arguments are passed to the submobject transformations.


//     Note
//     ----
//     If neither ``transformMismatches`` nor ``fadeTransformMismatches``
//     are set to ``True``, submobjects without matching keys in the starting
//     mobject are faded out in the direction of the unmatched submobjects in
//     the target mobject, and unmatched submobjects in the target mobject
//     are faded in from the direction of the unmatched submobjects in the
//     start mobject.

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         targetMobject: Mobject,
//         transformMismatches: bool = False,
//         fadeTransformMismatches: bool = False,
//         keyMap: dict | None = None,
//         **kwargs,
//     ) {

//         if isinstance(mobject, OpenGLVMobject) {
//             groupType = OpenGLVGroup
//         elif isinstance(mobject, OpenGLMobject) {
//             groupType = OpenGLGroup
//         elif isinstance(mobject, VMobject) {
//             groupType = VGroup
//         else:
//             groupType = Group

//         sourceMap = this.getShapeMap(mobject)
//         targetMap = this.getShapeMap(targetMobject)

//         if keyMap is None:
//             keyMap = {}

//         # Create two mobjects whose submobjects all match each other
//         # according to whatever keys are used for sourceMap and
//         # targetMap
//         transformSource = groupType()
//         transformTarget = groupType()
//         kwargs["finalAlphaValue"] = 0
//         for key in set(sourceMap).intersection(targetMap) {
//             transformSource.add(sourceMap[key])
//             transformTarget.add(targetMap[key])
//         anims = [Transform(transformSource, transformTarget, **kwargs)]
//         # User can manually specify when one part should transform
//         # into another despite not matching by using keyMap
//         keyMappedSource = groupType()
//         keyMappedTarget = groupType()
//         for key1, key2 in keyMap.items() {
//             if key1 in sourceMap and key2 in targetMap:
//                 keyMappedSource.add(sourceMap[key1])
//                 keyMappedTarget.add(targetMap[key2])
//                 sourceMap.pop(key1, None)
//                 targetMap.pop(key2, None)
//         if len(keyMappedSource) > 0:
//             anims.append(
//                 FadeTransformPieces(keyMappedSource, keyMappedTarget, **kwargs),
//             )

//         fadeSource = groupType()
//         fadeTarget = groupType()
//         for key in set(sourceMap).difference(targetMap) {
//             fadeSource.add(sourceMap[key])
//         for key in set(targetMap).difference(sourceMap) {
//             fadeTarget.add(targetMap[key])

//         if transformMismatches:
//             if "replaceMobjectWithTargetInScene" not in kwargs:
//                 kwargs["replaceMobjectWithTargetInScene"] = True
//             anims.append(Transform(fadeSource, fadeTarget, **kwargs))
//         elif fadeTransformMismatches:
//             anims.append(FadeTransformPieces(fadeSource, fadeTarget, **kwargs))
//         else:
//             anims.append(FadeOut(fadeSource, targetPosition=fadeTarget, **kwargs))
//             anims.append(
//                 FadeIn(fadeTarget.copy(), targetPosition=fadeTarget, **kwargs),
//             )

//         super()._Init__(*anims)

//         this.toRemove = mobject
//         this.toAdd = targetMobject

//     getShapeMap(this, mobject: Mobject) -> dict:
//         shapeMap = {}
//         for sm in this.getMobjectParts(mobject) {
//             key = this.getMobjectKey(sm)
//             if key not in shapeMap:
//                 if config["renderer"] == "opengl":
//                     shapeMap[key] = OpenGLVGroup()
//                 else:
//                     shapeMap[key] = VGroup()
//             shapeMap[key].add(sm)
//         return shapeMap

//     cleanUpFromScene(this, scene: Scene) -> None:
//         for anim in this.animations:
//             anim.interpolate(0)
//         scene.remove(this.mobject)
//         scene.remove(this.toRemove)
//         scene.add(this.toAdd)

//     @staticmethod
//     getMobjectParts(mobject: Mobject) {
//         raise NotImplementedError("To be implemented in subclass.")

//     @staticmethod
//     getMobjectKey(mobject: Mobject) {
//         raise NotImplementedError("To be implemented in subclass.")


// class TransformMatchingShapes(TransformMatchingAbstractBase) {
//     """An animation trying to transform groups by matching the shape
//     of their submobjects.

//     Two submobjects match if the hash of their point coordinates after
//     normalization (i.e., after translation to the origin, fixing the submobject
//     height at 1 unit, and rounding the coordinates to three decimal places)
//     matches.

//     See also
//     --------
//     :class:`~.TransformMatchingAbstractBase`

//     Examples
//     --------

//     .. manim:: Anagram

//         class Anagram(Scene) {
//             construct(this) {
//                 src = Text("the morse code")
//                 tar = Text("here come dots")
//                 this.play(Write(src))
//                 this.wait(0.5)
//                 this.play(TransformMatchingShapes(src, tar, pathArc=PI/2))
//                 this.wait(0.5)

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         targetMobject: Mobject,
//         transformMismatches: bool = False,
//         fadeTransformMismatches: bool = False,
//         keyMap: dict | None = None,
//         **kwargs,
//     ) {
//         super()._Init__(
//             mobject,
//             targetMobject,
//             transformMismatches=transformMismatches,
//             fadeTransformMismatches=fadeTransformMismatches,
//             keyMap=keyMap,
//             **kwargs,
//         )

//     @staticmethod
//     getMobjectParts(mobject: Mobject) -> list[Mobject]:
//         return mobject.familyMembersWithPoints()

//     @staticmethod
//     getMobjectKey(mobject: Mobject) -> int:
//         mobject.saveState()
//         mobject.center()
//         mobject.setHeight(1)
//         result = hash(np.round(mobject.points, 3).tobytes())
//         mobject.restore()
//         return result


// class TransformMatchingTex(TransformMatchingAbstractBase) {
//     """A transformation trying to transform rendered LaTeX strings.

//     Two submobjects match if their ``texString`` matches.

//     See also
//     --------
//     :class:`~.TransformMatchingAbstractBase`

//     Examples
//     --------

//     .. manim:: MatchingEquationParts

//         class MatchingEquationParts(Scene) {
//             construct(this) {
//                 variables = VGroup(MathTex("a"), MathTex("b"), MathTex("c")).arrangeSubmobjects().shift(UP)

//                 eq1 = MathTex("{{x}}^2", "+", "{{y}}^2", "=", "{{z}}^2")
//                 eq2 = MathTex("{{a}}^2", "+", "{{b}}^2", "=", "{{c}}^2")
//                 eq3 = MathTex("{{a}}^2", "=", "{{c}}^2", "-", "{{b}}^2")

//                 this.add(eq1)
//                 this.wait(0.5)
//                 this.play(TransformMatchingTex(Group(eq1, variables), eq2))
//                 this.wait(0.5)
//                 this.play(TransformMatchingTex(eq2, eq3))
//                 this.wait(0.5)

//     """

//     _Init__(
//         this,
//         mobject: Mobject,
//         targetMobject: Mobject,
//         transformMismatches: bool = False,
//         fadeTransformMismatches: bool = False,
//         keyMap: dict | None = None,
//         **kwargs,
//     ) {
//         super()._Init__(
//             mobject,
//             targetMobject,
//             transformMismatches=transformMismatches,
//             fadeTransformMismatches=fadeTransformMismatches,
//             keyMap=keyMap,
//             **kwargs,
//         )

//     @staticmethod
//     getMobjectParts(mobject: Mobject) -> list[Mobject]:
//         if isinstance(mobject, (Group, VGroup, OpenGLGroup, OpenGLVGroup)) {
//             return [
//                 p
//                 for s in mobject.submobjects
//                 for p in TransformMatchingTex.getMobjectParts(s)
//             ]
//         else:
//             assert hasattr(mobject, "texString")
//             return mobject.submobjects

//     @staticmethod
//     getMobjectKey(mobject: Mobject) -> str:
//         return mobject.texString
