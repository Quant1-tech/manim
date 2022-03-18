// from _Future__ import annotations

// import json
// import os
// from subprocess import run
// from typing import Any

// _All__ = [
//     "capture",
//     "getVideoMetadata",
//     "getDirLayout",
// ]


// capture(command, cwd=None, commandInput=None) {
//     p = run(command, cwd=cwd, input=commandInput, captureOutput=True, text=True)
//     out, err = p.stdout, p.stderr
//     return out, err, p.returncode


// getVideoMetadata(pathToVideo: str) -> dict[str, Any]:
//     command = [
//         "ffprobe",
//         "-v",
//         "error",
//         "-selectStreams",
//         "v:0",
//         "-showEntries",
//         "stream=width,height,nbFrames,duration,avgFrameRate,codecName",
//         "-printFormat",
//         "json",
//         str(pathToVideo),
//     ]
//     config, err, exitcode = capture(command)
//     assert exitcode == 0, f"FFprobe error: {err}"
//     return json.loads(config)["streams"][0]


// getDirLayout(dirpath: str) -> list[str]:
//     """Get list of paths relative to dirpath of all files in dir and subdirs recursively."""
//     indexFiles: list[str] = []
//     for root, dirs, files in os.walk(dirpath) {
//         for file in files:
//             indexFiles.append(f"{os.path.relpath(os.path.join(root, file), dirpath)}")
//     return indexFiles
