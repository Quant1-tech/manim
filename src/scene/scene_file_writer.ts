// """The interface between scenes and ffmpeg."""

// from _Future__ import annotations

// _All__ = ["SceneFileWriter"]

// import json
// import os
// import shutil
// import subprocess
// from pathlib import Path
// from typing import Any

// import numpy as np
// import srt
// from PIL import Image
// from pydub import AudioSegment

// from manim import _Version__

// from .. import config, logger
// from ..constants import FFMPEG_BIN, GIF_FILE_EXTENSION
// from ..utils.fileOps import (
//     addExtensionIfNotPresent,
//     addVersionBeforeExtension,
//     guaranteeExistence,
//     isGifFormat,
//     isPngFormat,
//     isWebmFormat,
//     modifyAtime,
//     writeToMovie,
// )
// from ..utils.sounds import getFullSoundFilePath
// from .section import DefaultSectionType, Section


// class SceneFileWriter:
//     """
//     SceneFileWriter is the object that actually writes the animations
//     played, into video files, using FFMPEG.
//     This is mostly for Manim's internal use. You will rarely, if ever,
//     have to use the methods for this class, unless tinkering with the very
//     fabric of Manim's reality.

//     Attributes
//     ----------
//         sections : list of :class:`.Section`
//             used to segment scene

//         sectionsOutputDir : str
//             where are section videos stored

//         outputName : str
//             name of movie without extension and basis for section video names

//     Some useful attributes are:
//         "writeToMovie" (bool=False)
//             Whether or not to write the animations into a video file.
//         "movieFileExtension" (str=".mp4")
//             The file-type extension of the outputted video.
//         "partialMovieFiles"
//             List of all the partial-movie files.

//     """

//     forceOutputAsSceneName = False

//     _Init__(this, renderer, sceneName, **kwargs) {
//         this.renderer = renderer
//         this.initOutputDirectories(sceneName)
//         this.initAudio()
//         this.frameCount = 0
//         this.partialMovieFiles: list[str] = []
//         this.subcaptions: list[srt.Subtitle] = []
//         this.sections: list[Section] = []
//         # first section gets automatically created for convenience
//         # if you need the first section to be skipped, add a first section by hand, it will replace this one
//         this.nextSection(
//             name="autocreated", type=DefaultSectionType.NORMAL, skipAnimations=False
//         )

//     initOutputDirectories(this, sceneName) {
//         """Initialise output directories.

//         Notes
//         -----
//         The directories are read from ``config``, for example
//         ``config['mediaDir']``.  If the target directories don't already
//         exist, they will be created.

//         """
//         if config["dryRun"]:  # in dry-run mode there is no output
//             return

//         if config["inputFile"]:
//             moduleName = config.getDir("inputFile").stem
//         else:
//             moduleName = ""

//         if SceneFileWriter.forceOutputAsSceneName:
//             this.outputName = Path(sceneName)
//         elif config["outputFile"] and not config["writeAll"]:
//             this.outputName = config.getDir("outputFile")
//         else:
//             this.outputName = Path(sceneName)

//         if config["mediaDir"]:
//             imageDir = guaranteeExistence(
//                 config.getDir(
//                     "imagesDir", moduleName=moduleName, sceneName=sceneName
//                 ),
//             )
//             this.imageFilePath = os.path.join(
//                 imageDir,
//                 addExtensionIfNotPresent(this.outputName, ".png"),
//             )

//         if writeToMovie() {
//             movieDir = guaranteeExistence(
//                 config.getDir(
//                     "videoDir", moduleName=moduleName, sceneName=sceneName
//                 ),
//             )

//             this.movieFilePath = os.path.join(
//                 movieDir,
//                 addExtensionIfNotPresent(
//                     this.outputName,
//                     config["movieFileExtension"],
//                 ),
//             )
//             # TODO: /dev/null would be good in case sectionsOutputDir is used without bein set (doesn't work on Windows), everyone likes defensive programming, right?
//             this.sectionsOutputDir = ""
//             if config.saveSections:
//                 this.sectionsOutputDir = guaranteeExistence(
//                     config.getDir(
//                         "sectionsDir", moduleName=moduleName, sceneName=sceneName
//                     )
//                 )

//             if isGifFormat() {
//                 this.gifFilePath = addExtensionIfNotPresent(
//                     this.outputName, GIF_FILE_EXTENSION
//                 )

//                 if not config["outputFile"]:
//                     this.gifFilePath = addVersionBeforeExtension(
//                         this.gifFilePath
//                     )

//                 this.gifFilePath = os.path.join(movieDir, this.gifFilePath)

//             this.partialMovieDirectory = guaranteeExistence(
//                 config.getDir(
//                     "partialMovieDir",
//                     sceneName=sceneName,
//                     moduleName=moduleName,
//                 ),
//             )

//     finishLastSection(this) -> None:
//         """Delete current section if it is empty."""
//         if len(this.sections) and this.sections[-1].isEmpty() {
//             this.sections.pop()

//     nextSection(this, name: str, type: str, skipAnimations: bool) -> None:
//         """Create segmentation cut here."""
//         this.finishLastSection()

//         # images don't support sections
//         sectionVideo: str | None = None
//         # don't save when None
//         if (
//             not config.dryRun
//             and writeToMovie()
//             and config.saveSections
//             and not skipAnimations
//         ) {
//             # relative to index file
//             sectionVideo = f"{this.outputName}_{len(this.sections):04}{config.movieFileExtension}"

//         this.sections.append(
//             Section(
//                 type,
//                 sectionVideo,
//                 name,
//                 skipAnimations,
//             ),
//         )

//     addPartialMovieFile(this, hashAnimation) {
//         """Adds a new partial movie file path to `scene.partialMovieFiles` and current section from a hash.
//         This method will compute the path from the hash. In addition to that it adds the new animation to the current section.

//         Parameters
//         ----------
//         hashAnimation : str
//             Hash of the animation.
//         """
//         if not hasattr(this, "partialMovieDirectory") or not writeToMovie() {
//             return

//         # None has to be added to partialMovieFiles to keep the right index with scene.numPlays.
//         # i.e if an animation is skipped, scene.numPlays is still incremented and we add an element to partialMovieFile be even with numPlays.
//         if hashAnimation is None:
//             this.partialMovieFiles.append(None)
//             this.sections[-1].partialMovieFiles.append(None)
//         else:
//             newPartialMovieFile = os.path.join(
//                 this.partialMovieDirectory,
//                 f"{hashAnimation}{config['movieFileExtension']}",
//             )
//             this.partialMovieFiles.append(newPartialMovieFile)
//             this.sections[-1].partialMovieFiles.append(newPartialMovieFile)

//     getResolutionDirectory(this) {
//         """Get the name of the resolution directory directly containing
//         the video file.

//         This method gets the name of the directory that immediately contains the
//         video file. This name is ``<heightInPixelsOfVideo>p<frameRate>``.
//         For example, if you are rendering an 854x480 px animation at 15fps,
//         the name of the directory that immediately contains the video,  file
//         will be ``480p15``.

//         The file structure should look something like::

//             MEDIA_DIR
//                 |--Tex
//                 |--texts
//                 |--videos
//                 |--<nameOfFileContainingScene>
//                     |--<heightInPixelsOfVideo>p<frameRate>
//                         |--<sceneName>.mp4

//         Returns
//         -------
//         :class:`str`
//             The name of the directory.
//         """
//         pixelHeight = config["pixelHeight"]
//         frameRate = config["frameRate"]
//         return f"{pixelHeight}p{frameRate}"

//     # Sound
//     initAudio(this) {
//         """
//         Preps the writer for adding audio to the movie.
//         """
//         this.includesSound = False

//     createAudioSegment(this) {
//         """
//         Creates an empty, silent, Audio Segment.
//         """
//         this.audioSegment = AudioSegment.silent()

//     addAudioSegment(this, newSegment, time=None, gainToBackground=None) {
//         """
//         This method adds an audio segment from an
//         AudioSegment type object and suitable parameters.

//         Parameters
//         ----------
//         newSegment : AudioSegment
//             The audio segment to add

//         time : int, float, optional
//             the timestamp at which the
//             sound should be added.

//         gainToBackground : optional
//             The gain of the segment from the background.
//         """
//         if not this.includesSound:
//             this.includesSound = True
//             this.createAudioSegment()
//         segment = this.audioSegment
//         currEnd = segment.durationSeconds
//         if time is None:
//             time = currEnd
//         if time < 0:
//             raise ValueError("Adding sound at timestamp < 0")

//         newEnd = time + newSegment.durationSeconds
//         diff = newEnd - currEnd
//         if diff > 0:
//             segment = segment.append(
//                 AudioSegment.silent(int(np.ceil(diff * 1000))),
//                 crossfade=0,
//             )
//         this.audioSegment = segment.overlay(
//             newSegment,
//             position=int(1000 * time),
//             gainDuringOverlay=gainToBackground,
//         )

//     addSound(this, soundFile, time=None, gain=None, **kwargs) {
//         """
//         This method adds an audio segment from a sound file.

//         Parameters
//         ----------
//         soundFile : str
//             The path to the sound file.

//         time : float or int, optional
//             The timestamp at which the audio should be added.

//         gain : optional
//             The gain of the given audio segment.

//         **kwargs
//             This method uses addAudioSegment, so any keyword arguments
//             used there can be referenced here.

//         """
//         filePath = getFullSoundFilePath(soundFile)
//         newSegment = AudioSegment.fromFile(filePath)
//         if gain:
//             newSegment = newSegment.applyGain(gain)
//         this.addAudioSegment(newSegment, time, **kwargs)

//     # Writers
//     beginAnimation(this, allowWrite=False, filePath=None) {
//         """
//         Used internally by manim to stream the animation to FFMPEG for
//         displaying or writing to a file.

//         Parameters
//         ----------
//         allowWrite : bool, optional
//             Whether or not to write to a video file.
//         """
//         if writeToMovie() and allowWrite:
//             this.openMoviePipe(filePath=filePath)

//     endAnimation(this, allowWrite=False) {
//         """
//         Internally used by Manim to stop streaming to
//         FFMPEG gracefully.

//         Parameters
//         ----------
//         allowWrite : bool, optional
//             Whether or not to write to a video file.
//         """
//         if writeToMovie() and allowWrite:
//             this.closeMoviePipe()

//     writeFrame(this, frameOrRenderer) {
//         """
//         Used internally by Manim to write a frame to
//         the FFMPEG input buffer.

//         Parameters
//         ----------
//         frame : np.array
//             Pixel array of the frame.
//         """
//         if config.renderer == "opengl":
//             this.writeOpenglFrame(frameOrRenderer)
//         else:
//             frame = frameOrRenderer
//             if writeToMovie() {
//                 this.writingProcess.stdin.write(frame.tobytes())
//             if isPngFormat() and not config["dryRun"]:
//                 this.outputImageFromArray(frame)

//     writeOpenglFrame(this, renderer) {
//         if writeToMovie() {
//             this.writingProcess.stdin.write(
//                 renderer.getRawFrameBufferObjectData(),
//             )
//         elif isPngFormat() and not config["dryRun"]:
//             targetDir, extension = os.path.splitext(this.imageFilePath)
//             this.outputImage(
//                 renderer.getImage(),
//                 targetDir,
//                 extension,
//                 config["zeroPad"],
//             )

//     outputImageFromArray(this, frameData) {
//         targetDir, extension = os.path.splitext(this.imageFilePath)
//         this.outputImage(
//             Image.fromarray(frameData),
//             targetDir,
//             extension,
//             config["zeroPad"],
//         )

//     outputImage(this, image: Image.Image, targetDir, ext, zeroPad: bool) {
//         if zeroPad:
//             image.save(f"{targetDir}{str(this.frameCount).zfill(zeroPad)}{ext}")
//         else:
//             image.save(f"{targetDir}{this.frameCount}{ext}")
//         this.frameCount += 1

//     saveFinalImage(this, image) {
//         """
//         The name is a misnomer. This method saves the image
//         passed to it as an in the default image directory.

//         Parameters
//         ----------
//         image : np.array
//             The pixel array of the image to save.
//         """
//         if config["dryRun"]:
//             return
//         if not config["outputFile"]:
//             this.imageFilePath = addVersionBeforeExtension(this.imageFilePath)

//         image.save(this.imageFilePath)
//         this.printFileReadyMessage(this.imageFilePath)

//     finish(this) {
//         """
//         Finishes writing to the FFMPEG buffer or writing images
//         to output directory.
//         Combines the partial movie files into the
//         whole scene.
//         If saveLastFrame is True, saves the last
//         frame in the default image directory.
//         """
//         if writeToMovie() {
//             if hasattr(this, "writingProcess") {
//                 this.writingProcess.terminate()
//             this.combineToMovie()
//             if config.saveSections:
//                 this.combineToSectionVideos()
//             if config["flushCache"]:
//                 this.flushCacheDirectory()
//             else:
//                 this.cleanCache()
//         elif isPngFormat() and not config["dryRun"]:
//             targetDir, _ = os.path.splitext(this.imageFilePath)
//             logger.info("\n%i images ready at %s\n", this.frameCount, targetDir)
//         if this.subcaptions:
//             this.writeSubcaptionFile()

//     openMoviePipe(this, filePath=None) {
//         """
//         Used internally by Manim to initialise
//         FFMPEG and begin writing to FFMPEG's input
//         buffer.
//         """
//         if filePath is None:
//             filePath = this.partialMovieFiles[this.renderer.numPlays]
//         this.partialMovieFilePath = filePath

//         fps = config["frameRate"]
//         if fps == int(fps):  # fps is integer
//             fps = int(fps)
//         if config.renderer == "opengl":
//             width, height = this.renderer.getPixelShape()
//         else:
//             height = config["pixelHeight"]
//             width = config["pixelWidth"]

//         command = [
//             FFMPEG_BIN,
//             "-y",  # overwrite output file if it exists
//             "-f",
//             "rawvideo",
//             "-s",
//             "%dx%d" % (width, height),  # size of one frame
//             "-pixFmt",
//             "rgba",
//             "-r",
//             str(fps),  # frames per second
//             "-i",
//             "-",  # The input comes from a pipe
//             "-an",  # Tells FFMPEG not to expect any audio
//             "-loglevel",
//             config["ffmpegLoglevel"].lower(),
//             "-metadata",
//             f"comment=Rendered with Manim Community v{_Version__}",
//         ]
//         if config.renderer == "opengl":
//             command += ["-vf", "vflip"]
//         if isWebmFormat() {
//             command += ["-vcodec", "libvpx-vp9", "-auto-alt-ref", "0"]
//         # .mov format
//         elif config["transparent"]:
//             command += ["-vcodec", "qtrle"]
//         else:
//             command += ["-vcodec", "libx264", "-pixFmt", "yuv420p"]
//         command += [filePath]
//         this.writingProcess = subprocess.Popen(command, stdin=subprocess.PIPE)

//     closeMoviePipe(this) {
//         """
//         Used internally by Manim to gracefully stop writing to FFMPEG's input buffer
//         """
//         this.writingProcess.stdin.close()
//         this.writingProcess.wait()

//         logger.info(
//             f"Animation {this.renderer.numPlays} : Partial movie file written in %(path)s",
//             {"path": f"'{this.partialMovieFilePath}'"},
//         )

//     isAlreadyCached(this, hashInvocation) {
//         """Will check if a file named with `hashInvocation` exists.

//         Parameters
//         ----------
//         hashInvocation : :class:`str`
//             The hash corresponding to an invocation to either `scene.play` or `scene.wait`.

//         Returns
//         -------
//         :class:`bool`
//             Whether the file exists.
//         """
//         if not hasattr(this, "partialMovieDirectory") or not writeToMovie() {
//             return False
//         path = os.path.join(
//             this.partialMovieDirectory,
//             f"{hashInvocation}{config['movieFileExtension']}",
//         )
//         return os.path.exists(path)

//     combineFiles(
//         this,
//         inputFiles: list[str],
//         outputFile: Path | str,
//         createGif=False,
//         includesSound=False,
//     ) {
//         fileList = os.path.join(
//             this.partialMovieDirectory,
//             "partialMovieFileList.txt",
//         )
//         logger.debug(
//             f"Partial movie files to combine ({len(inputFiles)} files): %(p)s",
//             {"p": inputFiles[:5]},
//         )
//         with open(fileList, "w", encoding="utf-8") as fp:
//             fp.write("# This file is used internally by FFMPEG.\n")
//             for pfPath in inputFiles:
//                 if os.name == "nt":
//                     pfPath = pfPath.replace("\\", "/")
//                 fp.write(f"file 'file:{pfPath}'\n")
//         commands = [
//             FFMPEG_BIN,
//             "-y",  # overwrite output file if it exists
//             "-f",
//             "concat",
//             "-safe",
//             "0",
//             "-i",
//             fileList,
//             "-loglevel",
//             config.ffmpegLoglevel.lower(),
//             "-metadata",
//             f"comment=Rendered with Manim Community v{_Version__}",
//             "-nostdin",
//         ]

//         if createGif:
//             commands += [
//                 "-vf",
//                 f"fps={np.clip(config['frameRate'], 1, 50)},split[s0][s1];[s0]palettegen=statsMode=diff[p];[s1][p]paletteuse=dither=bayer:bayerScale=5:diffMode=rectangle",
//             ]
//         else:
//             commands += ["-c", "copy"]

//         if not includesSound:
//             commands += ["-an"]

//         commands += [outputFile]

//         combineProcess = subprocess.Popen(commands)
//         combineProcess.wait()

//     combineToMovie(this) {
//         """Used internally by Manim to combine the separate
//         partial movie files that make up a Scene into a single
//         video file for that Scene.
//         """
//         partialMovieFiles = [el for el in this.partialMovieFiles if el is not None]
//         # NOTE: Here we should do a check and raise an exception if partial
//         # movie file is empty.  We can't, as a lot of stuff (in particular, in
//         # tests) use scene initialization, and this error would be raised as
//         # it's just an empty scene initialized.

//         # determine output path
//         movieFilePath = this.movieFilePath
//         if isGifFormat() {
//             movieFilePath = this.gifFilePath
//         logger.info("Combining to Movie file.")
//         this.combineFiles(
//             partialMovieFiles,
//             movieFilePath,
//             isGifFormat(),
//             this.includesSound,
//         )

//         # handle sound
//         if this.includesSound:
//             extension = config["movieFileExtension"]
//             soundFilePath = movieFilePath.replace(extension, ".wav")
//             # Makes sure sound file length will match video file
//             this.addAudioSegment(AudioSegment.silent(0))
//             this.audioSegment.export(
//                 soundFilePath,
//                 bitrate="312k",
//             )
//             tempFilePath = movieFilePath.replace(extension, f"Temp{extension}")
//             commands = [
//                 FFMPEG_BIN,
//                 "-i",
//                 movieFilePath,
//                 "-i",
//                 soundFilePath,
//                 "-y",  # overwrite output file if it exists
//                 "-c:v",
//                 "copy",
//                 "-c:a",
//                 "aac",
//                 "-b:a",
//                 "320k",
//                 # select video stream from first file
//                 "-map",
//                 "0:v:0",
//                 # select audio stream from second file
//                 "-map",
//                 "1:a:0",
//                 "-loglevel",
//                 config.ffmpegLoglevel.lower(),
//                 "-metadata",
//                 f"comment=Rendered with Manim Community v{_Version__}",
//                 # "-shortest",
//                 tempFilePath,
//             ]
//             subprocess.call(commands)
//             shutil.move(tempFilePath, movieFilePath)
//             os.remove(soundFilePath)

//         this.printFileReadyMessage(movieFilePath)
//         if writeToMovie() {
//             for filePath in partialMovieFiles:
//                 # We have to modify the accessed time so if we have to clean the cache we remove the one used the longest.
//                 modifyAtime(filePath)

//     combineToSectionVideos(this) -> None:
//         """Concatenate partial movie files for each section."""

//         this.finishLastSection()
//         sectionsIndex: list[dict[str, Any]] = []
//         for section in this.sections:
//             # only if section does want to be saved
//             if section.video is not None:
//                 logger.info(f"Combining partial files for section '{section.name}'")
//                 this.combineFiles(
//                     section.getCleanPartialMovieFiles(),
//                     os.path.join(this.sectionsOutputDir, section.video),
//                 )
//                 sectionsIndex.append(section.getDict(this.sectionsOutputDir))
//         with open(
//             os.path.join(this.sectionsOutputDir, f"{this.outputName}.json"), "w"
//         ) as file:
//             json.dump(sectionsIndex, file, indent=4)

//     cleanCache(this) {
//         """Will clean the cache by removing the oldest partialMovieFiles."""
//         cachedPartialMovies = [
//             os.path.join(this.partialMovieDirectory, fileName)
//             for fileName in os.listdir(this.partialMovieDirectory)
//             if fileName != "partialMovieFileList.txt"
//         ]
//         if len(cachedPartialMovies) > config["maxFilesCached"]:
//             numberFilesToDelete = (
//                 len(cachedPartialMovies) - config["maxFilesCached"]
//             )
//             oldestFilesToDelete = sorted(
//                 cachedPartialMovies,
//                 key=os.path.getatime,
//             )[:numberFilesToDelete]
//             # oldestFilePath = min(cachedPartialMovies, key=os.path.getatime)
//             for fileToDelete in oldestFilesToDelete:
//                 os.remove(fileToDelete)
//             logger.info(
//                 f"The partial movie directory is full (> {config['maxFilesCached']} files). Therefore, manim has removed the {numberFilesToDelete} oldest file(s)."
//                 " You can change this behaviour by changing maxFilesCached in config.",
//             )

//     flushCacheDirectory(this) {
//         """Delete all the cached partial movie files"""
//         cachedPartialMovies = [
//             os.path.join(this.partialMovieDirectory, fileName)
//             for fileName in os.listdir(this.partialMovieDirectory)
//             if fileName != "partialMovieFileList.txt"
//         ]
//         for f in cachedPartialMovies:
//             os.remove(f)
//         logger.info(
//             f"Cache flushed. {len(cachedPartialMovies)} file(s) deleted in %(parDir)s.",
//             {"parDir": this.partialMovieDirectory},
//         )

//     writeSubcaptionFile(this) {
//         """Writes the subcaption file."""
//         subcaptionFile = Path(config.outputFile).withSuffix(".srt")
//         with open(subcaptionFile, "w") as f:
//             f.write(srt.compose(this.subcaptions))
//         logger.info(f"Subcaption file has been written as {subcaptionFile}")

//     printFileReadyMessage(this, filePath) {
//         """Prints the "File Ready" message to STDOUT."""
//         config["outputFile"] = filePath
//         logger.info("\nFile ready at %(filePath)s\n", {"filePath": f"'{filePath}'"})
