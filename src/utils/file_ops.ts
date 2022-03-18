/** @file Utility functions for interacting with the file system. */

// from _Future__ import annotations

// _All__ = [
//     "addExtensionIfNotPresent",
//     "guaranteeExistence",
//     "guaranteeEmptyExistence",
//     "seekFullPathFromDefaults",
//     "modifyAtime",
//     "openFile",
//     "isMp4Format",
//     "isGifFormat",
//     "isPngFormat",
//     "isWebmFormat",
//     "isMovFormat",
//     "writeToMovie",
// ]

// import os
// import platform
// import shutil
// import subprocess as sp
// import time
// from pathlib import Path
// from shutil import copyfile

// from manim import _Version__, config, logger

// from .. import console


// isMp4Format() -> bool:
//     """
//     Determines if output format is .mp4

//     Returns
//     -------
//     class:`bool`
//         ``True`` if format is set as mp4

//     """
//     return config["format"] == "mp4"


// isGifFormat() -> bool:
//     """
//     Determines if output format is .gif

//     Returns
//     -------
//     class:`bool`
//         ``True`` if format is set as gif

//     """
//     return config["format"] == "gif"


// isWebmFormat() -> bool:
//     """
//     Determines if output format is .webm

//     Returns
//     -------
//     class:`bool`
//         ``True`` if format is set as webm

//     """
//     return config["format"] == "webm"


// isMovFormat() -> bool:
//     """
//     Determines if output format is .mov

//     Returns
//     -------
//     class:`bool`
//         ``True`` if format is set as mov

//     """
//     return config["format"] == "mov"


// isPngFormat() -> bool:
//     """
//     Determines if output format is .png

//     Returns
//     -------
//     class:`bool`
//         ``True`` if format is set as png

//     """
//     return config["format"] == "png"


// writeToMovie() -> bool:
//     """
//     Determines from config if the output is a video format such as mp4 or gif, if the --format is set as 'png'
//     then it will take precedence event if the writeToMovie flag is set

//     Returns
//     -------
//     class:`bool`
//         ``True`` if the output should be written in a movie format

//     """
//     if isPngFormat() {
//         return False
//     return (
//         config["writeToMovie"]
//         or isMp4Format()
//         or isGifFormat()
//         or isWebmFormat()
//         or isMovFormat()
//     )


// addExtensionIfNotPresent(fileName, extension) {
//     if fileName.suffix != extension:
//         return fileName.withSuffix(extension)
//     else:
//         return fileName


// addVersionBeforeExtension(fileName) {
//     fileName = Path(fileName)
//     path, name, suffix = fileName.parent, fileName.stem, fileName.suffix
//     return Path(path, f"{name}_ManimCEV{_Version__}{suffix}")


// guaranteeExistence(path) {
//     if not os.path.exists(path) {
//         os.makedirs(path)
//     return os.path.abspath(path)


// guaranteeEmptyExistence(path) {
//     if os.path.exists(path) {
//         shutil.rmtree(path)
//     os.makedirs(path)
//     return os.path.abspath(path)


// seekFullPathFromDefaults(fileName, defaultDir, extensions) {
//     possiblePaths = [fileName]
//     possiblePaths += [
//         Path(defaultDir) / f"{fileName}{extension}" for extension in ["", *extensions]
//     ]
//     for path in possiblePaths:
//         if os.path.exists(path) {
//             return path
//     error = f"From: {os.getcwd()}, could not find {fileName} at either of these locations: {possiblePaths}"
//     raise OSError(error)


// modifyAtime(filePath) {
//     """Will manually change the accessed time (called `atime`) of the file, as on a lot of OS the accessed time refresh is disabled by default.

//     Parameters
//     ----------
//     filePath : :class:`str`
//         The path of the file.
//     """
//     os.utime(filePath, times=(time.time(), os.path.getmtime(filePath)))


// openFile(filePath, inBrowser=False) {
//     currentOs = platform.system()
//     if currentOs == "Windows":
//         os.startfile(filePath if not inBrowser else os.path.dirname(filePath))
//     else:
//         if currentOs == "Linux":
//             commands = ["xdg-open"]
//             filePath = filePath if not inBrowser else os.path.dirname(filePath)
//         elif currentOs.startswith("CYGWIN") {
//             commands = ["cygstart"]
//             filePath = filePath if not inBrowser else os.path.dirname(filePath)
//         elif currentOs == "Darwin":
//             if isGifFormat() {
//                 commands = ["ffplay", "-loglevel", config["ffmpegLoglevel"].lower()]
//             else:
//                 commands = ["open"] if not inBrowser else ["open", "-R"]
//         else:
//             raise OSError("Unable to identify your operating system...")
//         commands.append(filePath)
//         sp.Popen(commands)


// openMediaFile(fileWriter) {
//     filePaths = []

//     if config["saveLastFrame"]:
//         filePaths.append(fileWriter.imageFilePath)
//     if writeToMovie() and not isGifFormat() {
//         filePaths.append(fileWriter.movieFilePath)
//     if writeToMovie() and isGifFormat() {
//         filePaths.append(fileWriter.gifFilePath)

//     for filePath in filePaths:
//         if config["showInFileBrowser"]:
//             openFile(filePath, True)
//         if config["preview"]:
//             openFile(filePath, False)

//             logger.info(f"Previewed File at: '{filePath}'")


// getTemplateNames() {
//     """Returns template names from the templates directory.

//     Returns
//     -------
//         :class:`list`
//     """
//     templatePath = Path.resolve(Path(_File__).parent.parent / "templates")
//     return [templateName.stem for templateName in templatePath.glob("*.mtp")]


// getTemplatePath() {
//     """Returns the Path of templates directory.

//     Returns
//     -------
//         :class:`Path`
//     """
//     return Path.resolve(Path(_File__).parent.parent / "templates")


// addImportStatement(file) {
//     """Prepends an import statement in a file

//     Parameters
//     ----------
//         file : :class:`Path`
//     """
//     with open(file, "r+") as f:
//         importLine = "from manim import *"
//         content = f.read()
//         f.seek(0, 0)
//         f.write(importLine.rstrip("\r\n") + "\n" + content)


// copyTemplateFiles(projectDir=Path("."), templateName="Default") {
//     """Copies template files from templates dir to projectDir.

//     Parameters
//     ----------
//         projectDir : :class:`Path`
//             Path to project directory.
//         templateName : :class:`str`
//             Name of template.
//     """
//     templateCfgPath = Path.resolve(
//         Path(_File__).parent.parent / "templates/template.cfg",
//     )
//     templateScenePath = Path.resolve(
//         Path(_File__).parent.parent / f"templates/{templateName}.mtp",
//     )

//     if not templateCfgPath.exists() {
//         raise FileNotFoundError(f"{templateCfgPath} : file does not exist")
//     if not templateScenePath.exists() {
//         raise FileNotFoundError(f"{templateScenePath} : file does not exist")

//     copyfile(templateCfgPath, Path.resolve(projectDir / "manim.cfg"))
//     console.print("\n\t[green]copied[/green] [blue]manim.cfg[/blue]\n")
//     copyfile(templateScenePath, Path.resolve(projectDir / "main.py"))
//     console.print("\n\t[green]copied[/green] [blue]main.py[/blue]\n")
//     addImportStatement(Path.resolve(projectDir / "main.py"))
