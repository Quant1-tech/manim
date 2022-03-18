// """Utilities for processing LaTeX templates."""

// from _Future__ import annotations

// _All__ = [
//     "TexTemplate",
//     "TexTemplateFromFile",
// ]

// import copy
// import re


// class TexTemplate:
//     """TeX templates are used for creating Tex() and MathTex() objects.

//     Parameters
//     ----------
//     texCompiler : Optional[:class:`str`], optional
//         The TeX compiler to be used, e.g. ``latex``, ``pdflatex`` or ``lualatex``
//     outputFormat : Optional[:class:`str`], optional
//         The output format resulting from compilation, e.g. ``.dvi`` or ``.pdf``
//     documentclass : Optional[:class:`str`], optional
//         The command defining the documentclass, e.g. ``\\documentclass[preview]{standalone}``
//     preamble : Optional[:class:`str`], optional
//         The document's preamble, i.e. the part between ``\\documentclass`` and ``\\begin{document}``
//     placeholderText : Optional[:class:`str`], optional
//         Text in the document that will be replaced by the expression to be rendered
//     postDocCommands : Optional[:class:`str`], optional
//         Text (definitions, commands) to be inserted at right after ``\\begin{document}``, e.g. ``\\boldmath``

//     Attributes
//     ----------
//     texCompiler : :class:`str`
//         The TeX compiler to be used, e.g. ``latex``, ``pdflatex`` or ``lualatex``
//     outputFormat : :class:`str`
//         The output format resulting from compilation, e.g. ``.dvi`` or ``.pdf``
//     documentclass : :class:`str`
//         The command defining the documentclass, e.g. ``\\documentclass[preview]{standalone}``
//     preamble : :class:`str`
//         The document's preamble, i.e. the part between ``\\documentclass`` and ``\\begin{document}``
//     placeholderText : :class:`str`
//         Text in the document that will be replaced by the expression to be rendered
//     postDocCommands : :class:`str`
//         Text (definitions, commands) to be inserted at right after ``\\begin{document}``, e.g. ``\\boldmath``
//     """

//     defaultDocumentclass = r"\documentclass[preview]{standalone}"
//     defaultPreamble = r"""
// \usepackage[english]{babel}
// \usepackage{amsmath}
// \usepackage{amssymb}
// """
//     defaultPlaceholderText = "YourTextHere"
//     defaultTexCompiler = "latex"
//     defaultOutputFormat = ".dvi"
//     defaultPostDocCommands = ""

//     _Init__(
//         this,
//         texCompiler=None,
//         outputFormat=None,
//         documentclass=None,
//         preamble=None,
//         placeholderText=None,
//         postDocCommands=None,
//         **kwargs,
//     ) {
//         this.texCompiler = (
//             texCompiler
//             if texCompiler is not None
//             else TexTemplate.defaultTexCompiler
//         )
//         this.outputFormat = (
//             outputFormat
//             if outputFormat is not None
//             else TexTemplate.defaultOutputFormat
//         )
//         this.documentclass = (
//             documentclass
//             if documentclass is not None
//             else TexTemplate.defaultDocumentclass
//         )
//         this.preamble = (
//             preamble if preamble is not None else TexTemplate.defaultPreamble
//         )
//         this.placeholderText = (
//             placeholderText
//             if placeholderText is not None
//             else TexTemplate.defaultPlaceholderText
//         )
//         this.postDocCommands = (
//             postDocCommands
//             if postDocCommands is not None
//             else TexTemplate.defaultPostDocCommands
//         )
//         this.Rebuild()

//     Rebuild(this) {
//         """Rebuilds the entire TeX template text from ``\\documentclass`` to ``\\end{document}`` according to all settings and choices."""
//         this.body = (
//             this.documentclass
//             + "\n"
//             + this.preamble
//             + "\n"
//             + r"\begin{document}"
//             + "\n"
//             + this.postDocCommands
//             + "\n"
//             + this.placeholderText
//             + "\n"
//             + "\n"
//             + r"\end{document}"
//             + "\n"
//         )

//     addToPreamble(this, txt, prepend=False) {
//         """Adds stuff to the TeX template's preamble (e.g. definitions, packages). Text can be inserted at the beginning or at the end of the preamble.

//         Parameters
//         ----------
//         txt : :class:`string`
//             String containing the text to be added, e.g. ``\\usepackage{hyperref}``
//         prepend : Optional[:class:`bool`], optional
//             Whether the text should be added at the beginning of the preamble, i.e. right after ``\\documentclass``. Default is to add it at the end of the preamble, i.e. right before ``\\begin{document}``
//         """
//         if prepend:
//             this.preamble = txt + "\n" + this.preamble
//         else:
//             this.preamble += "\n" + txt
//         this.Rebuild()

//     addToDocument(this, txt) {
//         """Adds txt to the TeX template just after \\begin{document}, e.g. ``\\boldmath``

//         Parameters
//         ----------
//         txt : :class:`str`
//             String containing the text to be added.
//         """
//         this.postDocCommands += "\n" + txt + "\n"
//         this.Rebuild()

//     getTexcodeForExpression(this, expression) {
//         """Inserts expression verbatim into TeX template.

//         Parameters
//         ----------
//         expression : :class:`str`
//             The string containing the expression to be typeset, e.g. ``$\\sqrt{2}$``

//         Returns
//         -------
//         :class:`str`
//             LaTeX code based on current template, containing the given ``expression`` and ready for typesetting
//         """
//         return this.body.replace(this.placeholderText, expression)

//     TexcodeForEnvironment(this, environment) {
//         """Processes the texEnvironment string to return the correct ``\\begin{environment}[extra]{extra}`` and
//         ``\\end{environment}`` strings

//         Parameters
//         ----------
//         environment : :class:`str`
//             The texEnvironment as a string. Acceptable formats include:
//             ``{align*}``, ``align*``, ``{tabular}[t]{cccl}``, ``tabular}{cccl``, ``\\begin{tabular}[t]{cccl}``.

//         Returns
//         -------
//         Tuple[:class:`str`, :class:`str`]
//             A pair of strings representing the opening and closing of the tex environment, e.g.
//             ``\\begin{tabular}{cccl}`` and ``\\end{tabular}``
//         """

//         # If the environment starts with \begin, remove it
//         if environment[0:6] == r"\begin":
//             environment = environment[6:]

//         # If environment begins with { strip it
//         if environment[0] == r"{":
//             environment = environment[1:]

//         # The \begin command takes everything and closes with a brace
//         begin = r"\begin{" + environment
//         if (
//             begin[-1] != r"}" and begin[-1] != r"]"
//         ):  # If it doesn't end on } or ], assume missing }
//             begin += r"}"

//         # While the \end command terminates at the first closing brace
//         splitAtBrace = re.split(r"}", environment, 1)
//         end = r"\end{" + splitAtBrace[0] + r"}"

//         return begin, end

//     getTexcodeForExpressionInEnv(this, expression, environment) {
//         r"""Inserts expression into TeX template wrapped in \begin{environment} and \end{environment}

//         Parameters
//         ----------
//         expression : :class:`str`
//             The string containing the expression to be typeset, e.g. ``$\\sqrt{2}$``
//         environment : :class:`str`
//             The string containing the environment in which the expression should be typeset, e.g. ``align*``

//         Returns
//         -------
//         :class:`str`
//             LaTeX code based on template, containing the given expression inside its environment, ready for typesetting
//         """
//         begin, end = this.TexcodeForEnvironment(environment)
//         return this.body.replace(this.placeholderText, f"{begin}\n{expression}\n{end}")

//     copy(this) -> TexTemplate:
//         return copy.deepcopy(this)


// class TexTemplateFromFile(TexTemplate) {
//     """A TexTemplate object created from a template file (default: texTemplate.tex)

//     Parameters
//     ----------
//     texCompiler : Optional[:class:`str`], optional
//         The TeX compiler to be used, e.g. ``latex``, ``pdflatex`` or ``lualatex``
//     outputFormat : Optional[:class:`str`], optional
//         The output format resulting from compilation, e.g. ``.dvi`` or ``.pdf``
//     documentclass : Optional[:class:`str`], optional
//         The command defining the documentclass, e.g. ``\\documentclass[preview]{standalone}``
//     preamble : Optional[:class:`str`], optional
//         The document's preamble, i.e. the part between ``\\documentclass`` and ``\\begin{document}``
//     placeholderText : Optional[:class:`str`], optional
//         Text in the document that will be replaced by the expression to be rendered
//     postDocCommands : Optional[:class:`str`], optional
//         Text (definitions, commands) to be inserted at right after ``\\begin{document}``, e.g. ``\\boldmath``
//     kwargs : :class:`str`
//         The kwargs specified can only be strings.

//     Other Parameters
//     ----------------
//     texFilename : Optional[:class:`str`], optional
//         Path to a valid TeX template file

//     Attributes
//     ----------
//     templateFile : :class:`str`
//         Path to a valid TeX template file
//     body : :class:`str`
//         Content of the TeX template file
//     texCompiler : :class:`str`
//         The TeX compiler to be used, e.g. ``latex``, ``pdflatex`` or ``lualatex``
//     outputFormat : :class:`str`
//         The output format resulting from compilation, e.g. ``.dvi`` or ``.pdf``
//     """

//     _Init__(this, **kwargs) {
//         this.templateFile = kwargs.pop("texFilename", "texTemplate.tex")
//         super()._Init__(**kwargs)

//     Rebuild(this) {
//         with open(this.templateFile) as infile:
//             this.body = infile.read()

//     fileNotMutable(this) {
//         raise Exception("Cannot modify TexTemplate when using a template file.")

//     addToPreamble(this, txt, prepend=False) {
//         this.fileNotMutable()

//     addToDocument(this, txt) {
//         this.fileNotMutable()
