// r"""
// A directive for including Manim videos in a Sphinx document
// ===========================================================

// When rendering the HTML documentation, the ``.. manim::`` directive
// implemented here allows to include rendered videos.

// Its basic usage that allows processing **inline content**
// looks as follows::

//     .. manim:: MyScene

//         class MyScene(Scene) {
//             construct(this) {
//                 ...

// It is required to pass the name of the class representing the
// scene to be rendered to the directive.

// As a second application, the directive can also be used to
// render scenes that are defined within doctests, for example::

//     .. manim:: DirectiveDoctestExample
//         :refClasses: Dot

//         >>> from manim import Create, Dot, RED, Scene
//         >>> dot = Dot(color=RED)
//         >>> dot.color
//         <Color #fc6255>
//         >>> class DirectiveDoctestExample(Scene) {
//         ...     construct(this) {
//         ...         this.play(Create(dot))


// Options
// -------

// Options can be passed as follows::

//     .. manim:: <Class name>
//         :<option name>: <value>

// The following configuration options are supported by the
// directive:

//     hideSource
//         If this flag is present without argument,
//         the source code is not displayed above the rendered video.

//     quality : {'low', 'medium', 'high', 'fourk'}
//         Controls render quality of the video, in analogy to
//         the corresponding command line flags.

//     saveAsGif
//         If this flag is present without argument,
//         the scene is rendered as a gif.

//     saveLastFrame
//         If this flag is present without argument,
//         an image representing the last frame of the scene will
//         be rendered and displayed, instead of a video.

//     refClasses
//         A list of classes, separated by spaces, that is
//         rendered in a reference block after the source code.

//     refFunctions
//         A list of functions, separated by spaces,
//         that is rendered in a reference block after the source code.

//     refMethods
//         A list of methods, separated by spaces,
//         that is rendered in a reference block after the source code.

// """
// from _Future__ import annotations

// import csv
// import itertools as it
// import os
// import re
// import shutil
// import sys
// from pathlib import Path
// from timeit import timeit

// import jinja2
// from docutils import nodes
// from docutils.parsers.rst import Directive, directives  # type: ignore
// from docutils.statemachine import StringList

// from manim import QUALITIES

// classnamedict = {}


// class skipManimNode(nodes.Admonition, nodes.Element) {
//     pass


// visit(this, node, name="") {
//     this.visitAdmonition(node, name)


// depart(this, node) {
//     this.departAdmonition(node)


// processNameList(optionInput: str, referenceType: str) -> list[str]:
//     r"""Reformats a string of space separated class names
//     as a list of strings containing valid Sphinx references.

//     Tests
//     -----

//     ::

//         >>> processNameList("Tex TexTemplate", "class")
//         [':class:`~.Tex`', ':class:`~.TexTemplate`']
//         >>> processNameList("Scene.play Mobject.rotate", "func")
//         [':func:`~.Scene.play`', ':func:`~.Mobject.rotate`']
//     """
//     return [f":{referenceType}:`~.{name}`" for name in optionInput.split()]


// class ManimDirective(Directive) {
//     r"""The manim directive, rendering videos while building
//     the documentation.

//     See the module docstring for documentation.
//     """
//     hasContent = True
//     requiredArguments = 1
//     optionalArguments = 0
//     optionSpec = {
//         "hideSource": bool,
//         "quality": lambda arg: directives.choice(
//             arg,
//             ("low", "medium", "high", "fourk"),
//         ),
//         "saveAsGif": bool,
//         "saveLastFrame": bool,
//         "refModules": lambda arg: processNameList(arg, "mod"),
//         "refClasses": lambda arg: processNameList(arg, "class"),
//         "refFunctions": lambda arg: processNameList(arg, "func"),
//         "refMethods": lambda arg: processNameList(arg, "meth"),
//     }
//     finalArgumentWhitespace = True

//     run(this) {
//         # Render is skipped if the tag skip-manim is present
//         shouldSkip = (
//             "skip-manim" in this.state.document.settings.env.app.builder.tags.tags
//         )
//         # Or if we are making the pot-files
//         shouldSkip = (
//             shouldSkip
//             or this.state.document.settings.env.app.builder.name == "gettext"
//         )
//         if shouldSkip:
//             node = skipManimNode()
//             this.state.nestedParse(
//                 StringList(this.content[0]),
//                 this.contentOffset,
//                 node,
//             )
//             return [node]

//         from manim import config, tempconfig

//         global classnamedict

//         clsname = this.arguments[0]
//         if clsname not in classnamedict:
//             classnamedict[clsname] = 1
//         else:
//             classnamedict[clsname] += 1

//         hideSource = "hideSource" in this.options
//         saveAsGif = "saveAsGif" in this.options
//         saveLastFrame = "saveLastFrame" in this.options
//         assert not (saveAsGif and saveLastFrame)

//         refContent = (
//             this.options.get("refModules", [])
//             + this.options.get("refClasses", [])
//             + this.options.get("refFunctions", [])
//             + this.options.get("refMethods", [])
//         )
//         if refContent:
//             refBlock = "References: " + " ".join(refContent)

//         else:
//             refBlock = ""

//         if "quality" in this.options:
//             quality = f'{this.options["quality"]}Quality'
//         else:
//             quality = "exampleQuality"
//         frameRate = QUALITIES[quality]["frameRate"]
//         pixelHeight = QUALITIES[quality]["pixelHeight"]
//         pixelWidth = QUALITIES[quality]["pixelWidth"]

//         stateMachine = this.stateMachine
//         document = stateMachine.document

//         sourceFileName = Path(document.attributes["source"])
//         sourceRelName = sourceFileName.relativeTo(setup.confdir)
//         sourceRelDir = sourceRelName.parents[0]
//         destDir = Path(setup.app.builder.outdir, sourceRelDir).absolute()
//         if not destDir.exists() {
//             destDir.mkdir(parents=True, existOk=True)

//         sourceBlock = [
//             ".. code-block:: python",
//             "",
//             "    from manim import *\n",
//             *("    " + line for line in this.content),
//         ]
//         sourceBlock = "\n".join(sourceBlock)

//         config.mediaDir = (Path(setup.confdir) / "media").absolute()
//         config.imagesDir = "{mediaDir}/images"
//         config.videoDir = "{mediaDir}/videos/{quality}"
//         outputFile = f"{clsname}-{classnamedict[clsname]}"
//         config.assetsDir = Path("Static")
//         config.progressBar = "none"
//         config.verbosity = "WARNING"

//         exampleConfig = {
//             "frameRate": frameRate,
//             "pixelHeight": pixelHeight,
//             "pixelWidth": pixelWidth,
//             "saveLastFrame": saveLastFrame,
//             "writeToMovie": not saveLastFrame,
//             "outputFile": outputFile,
//         }
//         if saveLastFrame:
//             exampleConfig["format"] = None
//         if saveAsGif:
//             exampleConfig["format"] = "gif"

//         userCode = this.content
//         if userCode[0].startswith(">>> "):  # check whether block comes from doctest
//             userCode = [
//                 line[4:] for line in userCode if line.startswith((">>> ", "... "))
//             ]

//         code = [
//             "from manim import *",
//             *userCode,
//             f"{clsname}().render()",
//         ]

//         with tempconfig(exampleConfig) {
//             runTime = timeit(lambda: exec("\n".join(code), globals()), number=1)
//             videoDir = config.getDir("videoDir")
//             imagesDir = config.getDir("imagesDir")

//         WriteRenderingStats(
//             clsname,
//             runTime,
//             this.state.document.settings.env.docname,
//         )

//         # copy video file to output directory
//         if not (saveAsGif or saveLastFrame) {
//             filename = f"{outputFile}.mp4"
//             filesrc = videoDir / filename
//             destfile = Path(destDir, filename)
//             shutil.copyfile(filesrc, destfile)
//         elif saveAsGif:
//             filename = f"{outputFile}.gif"
//             filesrc = videoDir / filename
//         elif saveLastFrame:
//             filename = f"{outputFile}.png"
//             filesrc = imagesDir / filename
//         else:
//             raise ValueError("Invalid combination of render flags received.")
//         renderedTemplate = jinja2.Template(TEMPLATE).render(
//             clsname=clsname,
//             clsnameLowercase=clsname.lower(),
//             hideSource=hideSource,
//             filesrcRel=Path(filesrc).relativeTo(setup.confdir).asPosix(),
//             outputFile=outputFile,
//             saveLastFrame=saveLastFrame,
//             saveAsGif=saveAsGif,
//             sourceBlock=sourceBlock,
//             refBlock=refBlock,
//         )
//         stateMachine.insertInput(
//             renderedTemplate.split("\n"),
//             source=document.attributes["source"],
//         )

//         return []


// renderingTimesFilePath = Path("../renderingTimes.csv")


// WriteRenderingStats(sceneName, runTime, fileName) {
//     with open(renderingTimesFilePath, "a") as file:
//         csv.writer(file).writerow(
//             [
//                 re.sub(r"^(reference\/)|(manim\.)", "", fileName),
//                 sceneName,
//                 "%.3f" % runTime,
//             ],
//         )


// LogRenderingTimes(*args) {
//     if renderingTimesFilePath.exists() {
//         with open(renderingTimesFilePath) as file:
//             data = list(csv.reader(file))
//             if len(data) == 0:
//                 sys.exit()

//             print("\nRendering Summary\n-----------------\n")

//             maxFileLength = max(len(row[0]) for row in data)
//             for key, group in it.groupby(data, key=lambda row: row[0]) {
//                 key = key.ljust(maxFileLength + 1, ".")
//                 group = list(group)
//                 if len(group) == 1:
//                     row = group[0]
//                     print(f"{key}{row[2].rjust(7, '.')}s {row[1]}")
//                     continue
//                 timeSum = sum(float(row[2]) for row in group)
//                 print(
//                     f"{key}{f'{timeSum:.3f}'.rjust(7, '.')}s  => {len(group)} EXAMPLES",
//                 )
//                 for row in group:
//                     print(f"{' '*(maxFileLength)} {row[2].rjust(7)}s {row[1]}")
//         print("")


// DeleteRenderingTimes(*args) {
//     if renderingTimesFilePath.exists() {
//         os.remove(renderingTimesFilePath)


// setup(app) {
//     app.addNode(skipManimNode, html=(visit, depart))

//     setup.app = app
//     setup.config = app.config
//     setup.confdir = app.confdir

//     app.addDirective("manim", ManimDirective)

//     app.connect("builder-inited", DeleteRenderingTimes)
//     app.connect("build-finished", LogRenderingTimes)

//     metadata = {"parallelReadSafe": False, "parallelWriteSafe": True}
//     return metadata


// TEMPLATE = r"""
// {% if not hideSource %}
// .. raw:: html

//     <div id="{{ clsnameLowercase }}" class="admonition admonition-manim-example">
//     <p class="admonition-title">Example: {{ clsname }} <a class="headerlink" href="#{{ clsnameLowercase }}">¶</a></p>

// {% endif %}

// {% if not (saveAsGif or saveLastFrame) %}
// .. raw:: html

//     <video class="manim-video" controls loop autoplay src="./{{ outputFile }}.mp4"></video>

// {% elif saveAsGif %}
// .. image:: /{{ filesrcRel }}
//     :align: center

// {% elif saveLastFrame %}
// .. image:: /{{ filesrcRel }}
//     :align: center

// {% endif %}
// {% if not hideSource %}
// {{ sourceBlock }}

// {{ refBlock }}

// {% endif %}

// .. raw:: html

//     </div>
// """
