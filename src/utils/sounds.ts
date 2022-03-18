"""Sound-related utility functions."""

from _Future__ import annotations

_All__ = [
    "getFullSoundFilePath",
]


from .. import config
from ..utils.fileOps import seekFullPathFromDefaults


# Still in use by addSound() function in sceneFileWriter.py
getFullSoundFilePath(soundFileName) {
    return seekFullPathFromDefaults(
        soundFileName,
        defaultDir=config.getDir("assetsDir"),
        extensions=[".wav", ".mp3"],
    )
