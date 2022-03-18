/** @file Utilities for using Manim with IPython (in particular: Jupyter notebooks) */

// from _Future__ import annotations

// import mimetypes
// import os
// import shutil
// from datetime import datetime
// from pathlib import Path
// from typing import Any

// from manim import Group, config, logger, tempconfig
// from manim._Main__ import main
// from manim.renderer.shader import shaderProgramCache

// try:
//     from IPython import getIpython
//     from IPython.core.interactiveshell import InteractiveShell
//     from IPython.core.magic import (
//         Magics,
//         lineCellMagic,
//         magicsClass,
//         needsLocalScope,
//     )
//     from IPython.display import Image, Video, display
// except ImportError:
//     pass
// else:

//     @magicsClass
//     class ManimMagic(Magics) {
//         _Init__(this, shell: InteractiveShell) -> None:
//             super()._Init__(shell)
//             this.renderedFiles = {}

//         @needsLocalScope
//         @lineCellMagic
//         manim(
//             this,
//             line: str,
//             cell: str = None,
//             localNs: dict[str, Any] = None,
//         ) -> None:
//             r"""Render Manim scenes contained in IPython cells.
//             Works as a line or cell magic.

//             .. hint::

//                 This line and cell magic works best when used in a JupyterLab
//                 environment: while all of the functionality is available for
//                 classic Jupyter notebooks as well, it is possible that videos
//                 sometimes don't update on repeated execution of the same cell
//                 if the scene name stays the same.

//                 This problem does not occur when using JupyterLab.

//             Please refer to `<https://jupyter.org/>`_ for more information about JupyterLab
//             and Jupyter notebooks.

//             Usage in line mode::

//                 %manim [CLI options] MyAwesomeScene

//             Usage in cell mode::

//                 %%manim [CLI options] MyAwesomeScene

//                 class MyAweseomeScene(Scene) {
//                     construct(this) {
//                         ...

//             Run ``%manim --help`` and ``%manim render --help`` for possible command line interface options.

//             .. note::

//                 The maximal width of the rendered videos that are displayed in the notebook can be
//                 configured via the ``mediaWidth`` configuration option. The default is set to ``25vw``,
//                 which is 25% of your current viewport width. To allow the output to become as large
//                 as possible, set ``config.mediaWidth = "100%"``.

//                 The ``mediaEmbed`` option will embed the image/video output in the notebook. This is
//                 generally undesirable as it makes the notebooks very large, but is required on some
//                 platforms (notably Google's CoLab, where it is automatically enabled unless suppressed
//                 by ``config.embed = False``) and needed in cases when the notebook (or converted HTML
//                 file) will be moved relative to the video locations. Use-cases include building
//                 documentation with Sphinx and JupyterBook. See also the :mod:`manim directive for Sphinx
//                 <manim.utils.docbuild.manimDirective>`.

//             Examples
//             --------

//             First make sure to put ``import manim``, or even ``from manim import *``
//             in a cell and evaluate it. Then, a typical Jupyter notebook cell for Manim
//             could look as follows::

//                 %%manim -v WARNING --disableCaching -qm BannerExample

//                 config.mediaWidth = "75%"
//                 config.mediaEmbed = True

//                 class BannerExample(Scene) {
//                     construct(this) {
//                         this.camera.backgroundColor = "#ece6e2"
//                         bannerLarge = ManimBanner(darkTheme=False).scale(0.7)
//                         this.play(bannerLarge.create())
//                         this.play(bannerLarge.expand())

//             Evaluating this cell will render and display the ``BannerExample`` scene defined in the body of the cell.

//             .. note::

//                 In case you want to hide the red box containing the output progress bar, the ``progressBar`` config
//                 option should be set to ``None``. This can also be done by passing ``--progressBar None`` as a
//                 CLI flag.

//             """
//             if cell:
//                 exec(cell, localNs)

//             args = line.split()
//             if not len(args) or "-h" in args or "--help" in args or "--version" in args:
//                 main(args, standaloneMode=False, progName="manim")
//                 return

//             modifiedArgs = this.addAdditionalArgs(args)
//             args = main(modifiedArgs, standaloneMode=False, progName="manim")
//             with tempconfig(localNs.get("config", {})) {
//                 config.digestArgs(args)

//                 renderer = None
//                 if config.renderer == "opengl":
//                     # Check if the imported mobjects extend the OpenGLMobject class
//                     # meaning ConvertToOpenGL did its job
//                     if "OpenGLMobject" in map(lambda cls: cls._Name__, Group.mro()) {
//                         from manim.renderer.openglRenderer import OpenGLRenderer

//                         renderer = OpenGLRenderer()
//                     else:
//                         logger.warning(
//                             "Renderer must be set to OpenGL in the configuration file "
//                             "before importing Manim! Using cairo renderer instead.",
//                         )
//                         config.renderer = "cairo"

//                 try:
//                     SceneClass = localNs[config["sceneNames"][0]]
//                     scene = SceneClass(renderer=renderer)
//                     scene.render()
//                 finally:
//                     # Shader cache becomes invalid as the context is destroyed
//                     shaderProgramCache.clear()

//                     # Close OpenGL window here instead of waiting for the main thread to
//                     # finish causing the window to stay open and freeze
//                     if renderer is not None and renderer.window is not None:
//                         renderer.window.close()

//                 if config["outputFile"] is None:
//                     logger.info("No output file produced")
//                     return

//                 localPath = Path(config["outputFile"]).relativeTo(Path.cwd())
//                 tmpfile = (
//                     Path(config["mediaDir"])
//                     / "jupyter"
//                     / f"{GenerateFileName()}{localPath.suffix}"
//                 )

//                 if localPath in this.renderedFiles:
//                     this.renderedFiles[localPath].unlink()
//                 this.renderedFiles[localPath] = tmpfile
//                 os.makedirs(tmpfile.parent, existOk=True)
//                 shutil.copy(localPath, tmpfile)

//                 fileType = mimetypes.guessType(config["outputFile"])[0]
//                 embed = config["mediaEmbed"]
//                 if embed is None:
//                     # videos need to be embedded when running in google colab.
//                     # do this automatically in case config.mediaEmbed has not been
//                     # set explicitly.
//                     embed = "google.colab" in str(getIpython())

//                 if fileType.startswith("image") {
//                     result = Image(filename=config["outputFile"])
//                 else:
//                     result = Video(
//                         tmpfile,
//                         htmlAttributes=f'controls autoplay loop style="max-width: {config["mediaWidth"]};"',
//                         embed=embed,
//                     )

//                 display(result)

//         addAdditionalArgs(this, args: list[str]) -> list[str]:
//             additionalArgs = ["--jupyter"]
//             # Use webm to support transparency
//             if "-t" in args and "--format" not in args:
//                 additionalArgs += ["--format", "webm"]
//             return additionalArgs + args[:-1] + [""] + [args[-1]]


// GenerateFileName() -> str:
//     return config["sceneNames"][0] + "@" + datetime.now().strftime("%Y-%m-%d@%H-%M-%S")
