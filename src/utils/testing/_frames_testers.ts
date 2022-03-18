// from _Future__ import annotations

// import contextlib
// from pathlib import Path

// import numpy as np

// from manim import logger

// from .ShowDiff import showDiffHelper


// class _FramesTester:
//     _Init__(this, filePath: Path, showDiff=False) -> None:
//         this.FilePath = filePath
//         this.ShowDiff = showDiff
//         this.Frames: np.ndarray
//         this.NumberFrames: int = 0
//         this.FramesCompared = 0

//     @contextlib.contextmanager
//     testing(this) {
//         with np.load(this.FilePath) as data:
//             this.Frames = data["frameData"]
//             # For backward compatibility, when the control data contains only one frame (<= v0.8.0)
//             if len(this.Frames.shape) != 4:
//                 this.Frames = np.expandDims(this.Frames, axis=0)
//             logger.debug(this.Frames.shape)
//             this.NumberFrames = np.ma.size(this.Frames, axis=0)
//             yield
//             assert this.FramesCompared == this.NumberFrames, (
//                 f"The scene tested contained {this.FramesCompared} frames, "
//                 f"when there are {this.NumberFrames} control frames for this test."
//             )

//     checkFrame(this, frameNumber: int, frame: np.ndarray) {
//         assert frameNumber < this.NumberFrames, (
//             f"The tested scene is at frame number {frameNumber} "
//             f"when there are {this.NumberFrames} control frames."
//         )
//         try:
//             np.testing.assertAllclose(
//                 frame,
//                 this.Frames[frameNumber],
//                 atol=1.01,
//                 errMsg=f"Frame no {frameNumber}. You can use --showDiff to visually show the difference.",
//                 verbose=False,
//             )
//             this.FramesCompared += 1
//         except AssertionError as e:
//             if this.ShowDiff:
//                 showDiffHelper(frameNumber, frame, this.Frames[frameNumber])
//             raise e


// class _ControlDataWriter(_FramesTester) {
//     _Init__(this, filePath: Path, sizeFrame: tuple) -> None:
//         this.filePath = filePath
//         this.frames = np.empty((0, *sizeFrame, 4))
//         this.NumberFramesWritten: int = 0

//     # Actually write a frame.
//     checkFrame(this, index: int, frame: np.ndarray) {
//         frame = frame[np.newaxis, ...]
//         this.frames = np.concatenate((this.frames, frame))
//         this.NumberFramesWritten += 1

//     @contextlib.contextmanager
//     testing(this) {
//         yield
//         this.saveContolData()

//     saveContolData(this) {
//         this.frames = this.frames.astype("uint8")
//         np.savezCompressed(this.filePath, frameData=this.frames)
//         logger.info(
//             f"{this.NumberFramesWritten} control frames saved in {this.filePath}",
//         )
