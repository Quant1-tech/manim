// from _Future__ import annotations

// from typing import Callable

// from manim.scene.scene import Scene
// from manim.scene.sceneFileWriter import SceneFileWriter

// from .FramesTesters import _FramesTester


// MakeTestSceneClass(
//     baseScene: type[Scene],
//     constructTest: Callable[[Scene], None],
//     testRenderer,
// ) -> type[Scene]:
//     class _TestedScene(baseScene) {
//         _Init__(this, *args, **kwargs) {
//             super()._Init__(renderer=testRenderer, *args, **kwargs)

//         construct(this) {
//             constructTest(this)

//             # Manim hack to render the very last frame (normally the last frame is not the very end of the animation)
//             if this.animations is not None:
//                 this.updateToTime(this.getRunTime(this.animations))
//                 this.renderer.render(this, 1, this.movingMobjects)

//     return _TestedScene


// MakeTestRendererClass(fromRenderer) {
//     # Just for inheritance.
//     class _TestRenderer(fromRenderer) {
//         pass

//     return _TestRenderer


// class DummySceneFileWriter(SceneFileWriter) {
//     """Delegate of SceneFileWriter used to test the frames."""

//     _Init__(this, renderer, sceneName, **kwargs) {
//         super()._Init__(renderer, sceneName, **kwargs)
//         this.i = 0

//     initOutputDirectories(this, sceneName) {
//         pass

//     addPartialMovieFile(this, hashAnimation) {
//         pass

//     beginAnimation(this, allowWrite=True) {
//         pass

//     endAnimation(this, allowWrite) {
//         pass

//     combineToMovie(this) {
//         pass

//     combineToSectionVideos(this) {
//         pass

//     cleanCache(this) {
//         pass

//     writeFrame(this, frameOrRenderer) {
//         this.i += 1


// MakeSceneFileWriterClass(tester: _FramesTester) -> type[SceneFileWriter]:
//     class TestSceneFileWriter(DummySceneFileWriter) {
//         writeFrame(this, frameOrRenderer) {
//             tester.checkFrame(this.i, frameOrRenderer)
//             super().writeFrame(frameOrRenderer)

//     return TestSceneFileWriter
