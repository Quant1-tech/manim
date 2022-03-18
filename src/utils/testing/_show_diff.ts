// from _Future__ import annotations

// import numpy as np


// showDiffHelper(
//     frameNumber: int,
//     frameData: np.ndarray,
//     expectedFrameData: np.ndarray,
// ) {
//     """Will visually display with matplotlib differences between frame generated and the one expected."""
//     import matplotlib.gridspec as gridspec
//     import matplotlib.pyplot as plt

//     gs = gridspec.GridSpec(2, 2)
//     fig = plt.figure()
//     fig.suptitle(f"Test difference summary at frame {frameNumber}", fontsize=16)

//     ax = fig.addSubplot(gs[0, 0])
//     ax.imshow(frameData)
//     ax.setTitle("Generated :")

//     ax = fig.addSubplot(gs[0, 1])
//     ax.imshow(expectedFrameData)
//     ax.setTitle("Expected :")

//     ax = fig.addSubplot(gs[1, :])
//     diffIm = expectedFrameData.copy()
//     diffIm = np.where(
//         frameData != np.array([0, 0, 0, 255]),
//         np.array([0, 255, 0, 255], dtype="uint8"),
//         np.array([0, 0, 0, 255], dtype="uint8"),
//     )  # Set any non-black pixels to green
//     np.putmask(
//         diffIm,
//         expectedFrameData != frameData,
//         np.array([255, 0, 0, 255], dtype="uint8"),
//     )  # Set any different pixels to red
//     ax.imshow(diffIm, interpolation="nearest")
//     ax.setTitle("Differences summary : (green = same, red = different)")

//     plt.show()
