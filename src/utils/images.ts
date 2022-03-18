/** @file Image manipulation utilities. */

// from _Future__ import annotations

// _All__ = ["getFullRasterImagePath", "dragPixels", "invertImage"]

// import numpy as np
// from PIL import Image

// from .. import config
// from ..utils.fileOps import seekFullPathFromDefaults


// getFullRasterImagePath(imageFileName: str) -> str:
//     return seekFullPathFromDefaults(
//         imageFileName,
//         defaultDir=config.getDir("assetsDir"),
//         extensions=[".jpg", ".jpeg", ".png", ".gif", ".ico"],
//     )


// dragPixels(frames: list[np.array]) -> list[np.array]:
//     curr = frames[0]
//     newFrames = []
//     for frame in frames:
//         curr += (curr == 0) * np.array(frame)
//         newFrames.append(np.array(curr))
//     return newFrames


// invertImage(image: np.array) -> Image:
//     arr = np.array(image)
//     arr = (255 * np.ones(arr.shape)).astype(arr.dtype) - arr
//     return Image.fromarray(arr)
