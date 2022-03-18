// """A library of LaTeX templates."""
// from _Future__ import annotations

// _All__ = [
//     "TexTemplateLibrary",
//     "TexFontTemplates",
// ]

// from .tex import *

// # This file makes TexTemplateLibrary and TexFontTemplates available for use in manim Tex and MathTex objects.


// NewAmsTemplate() {
//     """Returns a simple Tex Template with only basic AMS packages"""
//     preamble = r"""
// \usepackage[english]{babel}
// \usepackage{amsmath}
// \usepackage{amssymb}
// """
//     return TexTemplate(preamble=preamble)


// """ Tex Template preamble used by original upstream 3b1b """
// _3b1bPreamble = r"""
// \usepackage[english]{babel}
// \usepackage[utf8]{inputenc}
// \usepackage[T1]{fontenc}
// \usepackage{lmodern}
// \usepackage{amsmath}
// \usepackage{amssymb}
// \usepackage{dsfont}
// \usepackage{setspace}
// \usepackage{tipa}
// \usepackage{relsize}
// \usepackage{textcomp}
// \usepackage{mathrsfs}
// \usepackage{calligra}
// \usepackage{wasysym}
// \usepackage{ragged2e}
// \usepackage{physics}
// \usepackage{xcolor}
// \usepackage{microtype}
// \DisableLigatures{encoding = *, family = * }
// \linespread{1}
// """


// # TexTemplateLibrary
// #
// class TexTemplateLibrary:
//     """
//     A collection of basic TeX template objects

//     Examples
//     --------
//     Normal usage as a value for the keyword argument texTemplate of Tex() and MathTex() mobjects::

//         ``Tex("My TeX code", texTemplate=TexTemplateLibrary.ctex)``

//     """

//     default = TexTemplate(preamble=_3b1bPreamble)
//     """An instance of the default TeX template in manim"""

//     threeb1b = TexTemplate(preamble=_3b1bPreamble)
//     """ An instance of the default TeX template used by 3b1b """

//     ctex = TexTemplate(
//         texCompiler="xelatex",
//         outputFormat=".xdv",
//         preamble=_3b1bPreamble.replace(
//             r"\DisableLigatures{encoding = *, family = * }",
//             r"\usepackage[UTF8]{ctex}",
//         ),
//     )
//     """An instance of the TeX template used by 3b1b when using the useCtex flag"""

//     simple = NewAmsTemplate()
//     """An instance of a simple TeX template with only basic AMS packages loaded"""


// # TexFontTemplates
// #
// # TexFontTemplates takes a fontId and returns the appropriate TexTemplate()
// # Usage:
// #       myTexTemplate = TexFontTemplates.fontId
// #
// # Note: not all of these will work out-of-the-box.
// # They may require specific fonts to be installed on the local system.
// # For example TexFontTemplates.comicSans will only work if the Microsoft font 'Comic Sans'
// # is installed on the local system.
// #
// # More information on these templates, along with example output can be found at
// # http://jf.burnol.free.fr/showcase.html"
// #
// #
// # Choices for fontId are:
// #
// # americanTypewriter       : "American Typewriter"
// # antykwa                   : "Antykwa Półtawskiego (TX Fonts for Greek and math symbols)"
// # appleChancery            : "Apple Chancery"
// # auriocusKalligraphicus   : "Auriocus Kalligraphicus (Symbol Greek)"
// # baskervaldAdfFourier    : "Baskervald ADF with Fourier"
// # baskervilleIt            : "Baskerville (Italic)"
// # biolinum                  : "Biolinum"
// # brushscriptx              : "BrushScriptX-Italic (PX math and Greek)"
// # chalkboardSe             : "Chalkboard SE"
// # chalkduster               : "Chalkduster"
// # comfortaa                 : "Comfortaa"
// # comicSans                : "Comic Sans MS"
// # droidSans                : "Droid Sans"
// # droidSansIt             : "Droid Sans (Italic)"
// # droidSerif               : "Droid Serif"
// # droidSerifPxIt         : "Droid Serif (PX math symbols) (Italic)"
// # ecfAugie                 : "ECF Augie (Euler Greek)"
// # ecfJd                    : "ECF JD (with TX fonts)"
// # ecfSkeetch               : "ECF Skeetch (CM Greek)"
// # ecfTallPaul             : "ECF Tall Paul (with Symbol font)"
// # ecfWebster               : "ECF Webster (with TX fonts)"
// # electrumAdf              : "Electrum ADF (CM Greek)"
// # epigrafica                : Epigrafica
// # fourierUtopia            : "Fourier Utopia (Fourier upright Greek)"
// # frenchCursive            : "French Cursive (Euler Greek)"
// # gfsBodoni                : "GFS Bodoni"
// # gfsDidot                 : "GFS Didot (Italic)"
// # gfsNeoHellenic           : "GFS NeoHellenic"
// # gnuFreesansTx           : "GNU FreeSerif (and TX fonts symbols)"
// # gnuFreeserifFreesans    : "GNU FreeSerif and FreeSans"
// # helveticaFourierIt      : "Helvetica with Fourier (Italic)"
// # latinModernTwIt        : "Latin Modern Typewriter Proportional (CM Greek) (Italic)"
// # latinModernTw           : "Latin Modern Typewriter Proportional"
// # libertine                 : "Libertine"
// # librisAdfFourier        : "Libris ADF with Fourier"
// # minionProMyriadPro     : "Minion Pro and Myriad Pro (and TX fonts symbols)"
// # minionProTx             : "Minion Pro (and TX fonts symbols)"
// # newCenturySchoolbook    : "New Century Schoolbook (Symbol Greek)"
// # newCenturySchoolbookPx : "New Century Schoolbook (Symbol Greek, PX math symbols)"
// # noteworthyLight          : "Noteworthy Light"
// # palatino                  : "Palatino (Symbol Greek)"
// # papyrus                   : "Papyrus"
// # romandeAdfFourierIt    : "Romande ADF with Fourier (Italic)"
// # slitex                    : "SliTeX (Euler Greek)"
// # timesFourierIt          : "Times with Fourier (Italic)"
// # urwAvantGarde           : "URW Avant Garde (Symbol Greek)"
// # urwZapfChancery         : "URW Zapf Chancery (CM Greek)"
// # venturisAdfFourierIt   : "Venturis ADF with Fourier (Italic)"
// # verdanaIt                : "Verdana (Italic)"
// # vollkornFourierIt       : "Vollkorn with Fourier (Italic)"
// # vollkorn                  : "Vollkorn (TX fonts for Greek and math symbols)"
// # zapfChancery             : "Zapf Chancery"
// # -----------------------------------------------------------------------------------------
// #
// #
// #
// #
// #
// #
// #
// #
// #
// #

// # Latin Modern Typewriter Proportional
// lmtp = NewAmsTemplate()
// lmtp.description = "Latin Modern Typewriter Proportional"
// lmtp.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[variablett]{lmodern}
// \renewcommand{\rmdefault}{\ttdefault}
// \usepackage[LGRgreek]{mathastext}
// \MTgreekfont{lmtt} % no lgr lmvtt, so use lgr lmtt
// \Mathastext
// \let\varepsilon\epsilon % only \varsigma in LGR
// """,
// )


// # Fourier Utopia (Fourier upright Greek)
// fufug = NewAmsTemplate()
// fufug.description = "Fourier Utopia (Fourier upright Greek)"
// fufug.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[upright]{fourier}
// \usepackage{mathastext}
// """,
// )


// # Droid Serif
// droidserif = NewAmsTemplate()
// droidserif.description = "Droid Serif"
// droidserif.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[default]{droidserif}
// \usepackage[LGRgreek]{mathastext}
// \let\varepsilon\epsilon
// """,
// )


// # Droid Sans
// droidsans = NewAmsTemplate()
// droidsans.description = "Droid Sans"
// droidsans.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[default]{droidsans}
// \usepackage[LGRgreek]{mathastext}
// \let\varepsilon\epsilon
// """,
// )


// # New Century Schoolbook (Symbol Greek)
// ncssg = NewAmsTemplate()
// ncssg.description = "New Century Schoolbook (Symbol Greek)"
// ncssg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{newcent}
// \usepackage[symbolgreek]{mathastext}
// \linespread{1.1}
// """,
// )


// # French Cursive (Euler Greek)
// fceg = NewAmsTemplate()
// fceg.description = "French Cursive (Euler Greek)"
// fceg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[default]{frcursive}
// \usepackage[eulergreek,noplusnominus,noequal,nohbar,%
// nolessnomore,noasterisk]{mathastext}
// """,
// )


// # Auriocus Kalligraphicus (Symbol Greek)
// aksg = NewAmsTemplate()
// aksg.description = "Auriocus Kalligraphicus (Symbol Greek)"
// aksg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{aurical}
// \renewcommand{\rmdefault}{AuriocusKalligraphicus}
// \usepackage[symbolgreek]{mathastext}
// """,
// )


// # Palatino (Symbol Greek)
// palatinosg = NewAmsTemplate()
// palatinosg.description = "Palatino (Symbol Greek)"
// palatinosg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{palatino}
// \usepackage[symbolmax,defaultmathsizes]{mathastext}
// """,
// )


// # Comfortaa
// comfortaa = NewAmsTemplate()
// comfortaa.description = "Comfortaa"
// comfortaa.addToPreamble(
//     r"""
// \usepackage[default]{comfortaa}
// \usepackage[LGRgreek,defaultmathsizes,noasterisk]{mathastext}
// \let\varphi\phi
// \linespread{1.06}
// """,
// )


// # ECF Augie (Euler Greek)
// ecfaugieeg = NewAmsTemplate()
// ecfaugieeg.description = "ECF Augie (Euler Greek)"
// ecfaugieeg.addToPreamble(
//     r"""
// \renewcommand\familydefault{fau} % emerald package
// \usepackage[defaultmathsizes,eulergreek]{mathastext}
// """,
// )


// # Electrum ADF (CM Greek)
// electrumadfcm = NewAmsTemplate()
// electrumadfcm.description = "Electrum ADF (CM Greek)"
// electrumadfcm.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[LGRgreek,basic,defaultmathsizes]{mathastext}
// \usepackage[lf]{electrum}
// \Mathastext
// \let\varphi\phi
// """,
// )


// # American Typewriter
// americantypewriter = NewAmsTemplate()
// americantypewriter.description = "American Typewriter"
// americantypewriter.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{American Typewriter}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// americantypewriter.texCompiler = "xelatex"
// americantypewriter.outputFormat = ".xdv"

// # Minion Pro and Myriad Pro (and TX fonts symbols)
// mpmptx = NewAmsTemplate()
// mpmptx.description = "Minion Pro and Myriad Pro (and TX fonts symbols)"
// mpmptx.addToPreamble(
//     r"""
// \usepackage{txfonts}
// \usepackage[upright]{txgreeks}
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Minion Pro}
// \setsansfont[Mapping=tex-text,Scale=MatchUppercase]{Myriad Pro}
// \renewcommand\familydefault\sfdefault
// \usepackage[defaultmathsizes]{mathastext}
// \renewcommand\familydefault\rmdefault
// """,
// )
// mpmptx.texCompiler = "xelatex"
// mpmptx.outputFormat = ".xdv"


// # New Century Schoolbook (Symbol Greek, PX math symbols)
// ncssgpxm = NewAmsTemplate()
// ncssgpxm.description = "New Century Schoolbook (Symbol Greek, PX math symbols)"
// ncssgpxm.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{pxfonts}
// \usepackage{newcent}
// \usepackage[symbolgreek,defaultmathsizes]{mathastext}
// \linespread{1.06}
// """,
// )


// # Vollkorn (TX fonts for Greek and math symbols)
// vollkorntx = NewAmsTemplate()
// vollkorntx.description = "Vollkorn (TX fonts for Greek and math symbols)"
// vollkorntx.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{txfonts}
// \usepackage[upright]{txgreeks}
// \usepackage{vollkorn}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )


// # Libertine
// libertine = NewAmsTemplate()
// libertine.description = "Libertine"
// libertine.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{libertine}
// \usepackage[greek=n]{libgreek}
// \usepackage[noasterisk,defaultmathsizes]{mathastext}
// """,
// )


// # SliTeX (Euler Greek)
// slitexeg = NewAmsTemplate()
// slitexeg.description = "SliTeX (Euler Greek)"
// slitexeg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{tpslifonts}
// \usepackage[eulergreek,defaultmathsizes]{mathastext}
// \MTEulerScale{1.06}
// \linespread{1.2}
// """,
// )


// # ECF Webster (with TX fonts)
// ecfwebstertx = NewAmsTemplate()
// ecfwebstertx.description = "ECF Webster (with TX fonts)"
// ecfwebstertx.addToPreamble(
//     r"""
// \usepackage{txfonts}
// \usepackage[upright]{txgreeks}
// \renewcommand\familydefault{fwb} % emerald package
// \usepackage{mathastext}
// \renewcommand{\int}{\intop\limits}
// \linespread{1.5}
// """,
// )
// ecfwebstertx.addToDocument(
//     r"""
// \mathversion{bold}
// """,
// )


// # Romande ADF with Fourier (Italic)
// italicromandeadff = NewAmsTemplate()
// italicromandeadff.description = "Romande ADF with Fourier (Italic)"
// italicromandeadff.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{fourier}
// \usepackage{romande}
// \usepackage[italic,defaultmathsizes,noasterisk]{mathastext}
// \renewcommand{\itshape}{\swashstyle}
// """,
// )


// # Apple Chancery
// applechancery = NewAmsTemplate()
// applechancery.description = "Apple Chancery"
// applechancery.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Apple Chancery}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// applechancery.texCompiler = "xelatex"
// applechancery.outputFormat = ".xdv"


// # Zapf Chancery
// zapfchancery = NewAmsTemplate()
// zapfchancery.description = "Zapf Chancery"
// zapfchancery.addToPreamble(
//     r"""
// \DeclareFontFamily{T1}{pzc}{}
// \DeclareFontShape{T1}{pzc}{mb}{it}{<->s*[1.2] pzcmi8t}{}
// \DeclareFontShape{T1}{pzc}{m}{it}{<->ssub * pzc/mb/it}{}
// \usepackage{chancery} % = \renewcommand{\rmdefault}{pzc}
// \renewcommand\shapedefault\itdefault
// \renewcommand\bfdefault\mddefault
// \usepackage[defaultmathsizes]{mathastext}
// \linespread{1.05}
// """,
// )


// # Verdana (Italic)
// italicverdana = NewAmsTemplate()
// italicverdana.description = "Verdana (Italic)"
// italicverdana.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Verdana}
// \usepackage[defaultmathsizes,italic]{mathastext}
// """,
// )
// italicverdana.texCompiler = "xelatex"
// italicverdana.outputFormat = ".xdv"


// # URW Zapf Chancery (CM Greek)
// urwzccmg = NewAmsTemplate()
// urwzccmg.description = "URW Zapf Chancery (CM Greek)"
// urwzccmg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \DeclareFontFamily{T1}{pzc}{}
// \DeclareFontShape{T1}{pzc}{mb}{it}{<->s*[1.2] pzcmi8t}{}
// \DeclareFontShape{T1}{pzc}{m}{it}{<->ssub * pzc/mb/it}{}
// \DeclareFontShape{T1}{pzc}{mb}{sl}{<->ssub * pzc/mb/it}{}
// \DeclareFontShape{T1}{pzc}{m}{sl}{<->ssub * pzc/mb/sl}{}
// \DeclareFontShape{T1}{pzc}{m}{n}{<->ssub * pzc/mb/it}{}
// \usepackage{chancery}
// \usepackage{mathastext}
// \linespread{1.05}""",
// )
// urwzccmg.addToDocument(
//     r"""
// \boldmath
// """,
// )


// # Comic Sans MS
// comicsansms = NewAmsTemplate()
// comicsansms.description = "Comic Sans MS"
// comicsansms.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Comic Sans MS}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// comicsansms.texCompiler = "xelatex"
// comicsansms.outputFormat = ".xdv"


// # GFS Didot (Italic)
// italicgfsdidot = NewAmsTemplate()
// italicgfsdidot.description = "GFS Didot (Italic)"
// italicgfsdidot.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \renewcommand\rmdefault{udidot}
// \usepackage[LGRgreek,defaultmathsizes,italic]{mathastext}
// \let\varphi\phi
// """,
// )


// # Chalkduster
// chalkduster = NewAmsTemplate()
// chalkduster.description = "Chalkduster"
// chalkduster.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Chalkduster}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// chalkduster.texCompiler = "lualatex"
// chalkduster.outputFormat = ".pdf"


// # Minion Pro (and TX fonts symbols)
// mptx = NewAmsTemplate()
// mptx.description = "Minion Pro (and TX fonts symbols)"
// mptx.addToPreamble(
//     r"""
// \usepackage{txfonts}
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Minion Pro}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// mptx.texCompiler = "xelatex"
// mptx.outputFormat = ".xdv"


// # GNU FreeSerif and FreeSans
// gnufsfs = NewAmsTemplate()
// gnufsfs.description = "GNU FreeSerif and FreeSans"
// gnufsfs.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[ExternalLocation,
//                 Mapping=tex-text,
//                 BoldFont=FreeSerifBold,
//                 ItalicFont=FreeSerifItalic,
//                 BoldItalicFont=FreeSerifBoldItalic]{FreeSerif}
// \setsansfont[ExternalLocation,
//                 Mapping=tex-text,
//                 BoldFont=FreeSansBold,
//                 ItalicFont=FreeSansOblique,
//                 BoldItalicFont=FreeSansBoldOblique,
//                 Scale=MatchLowercase]{FreeSans}
// \renewcommand{\familydefault}{lmss}
// \usepackage[LGRgreek,defaultmathsizes,noasterisk]{mathastext}
// \renewcommand{\familydefault}{\sfdefault}
// \Mathastext
// \let\varphi\phi % no `var' phi in LGR encoding
// \renewcommand{\familydefault}{\rmdefault}
// """,
// )
// gnufsfs.texCompiler = "xelatex"
// gnufsfs.outputFormat = ".xdv"

// # GFS NeoHellenic
// gfsneohellenic = NewAmsTemplate()
// gfsneohellenic.description = "GFS NeoHellenic"
// gfsneohellenic.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \renewcommand{\rmdefault}{neohellenic}
// \usepackage[LGRgreek]{mathastext}
// \let\varphi\phi
// \linespread{1.06}
// """,
// )


// # ECF Tall Paul (with Symbol font)
// ecftallpaul = NewAmsTemplate()
// ecftallpaul.description = "ECF Tall Paul (with Symbol font)"
// ecftallpaul.addToPreamble(
//     r"""
// \DeclareFontFamily{T1}{ftp}{}
// \DeclareFontShape{T1}{ftp}{m}{n}{
//     <->s*[1.4] ftpmw8t
// }{} % increase size by factor 1.4
// \renewcommand\familydefault{ftp} % emerald package
// \usepackage[symbol]{mathastext}
// \let\infty\inftypsy
// """,
// )


// # Droid Sans (Italic)
// italicdroidsans = NewAmsTemplate()
// italicdroidsans.description = "Droid Sans (Italic)"
// italicdroidsans.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[default]{droidsans}
// \usepackage[LGRgreek,defaultmathsizes,italic]{mathastext}
// \let\varphi\phi
// """,
// )


// # Baskerville (Italic)
// italicbaskerville = NewAmsTemplate()
// italicbaskerville.description = "Baskerville (Italic)"
// italicbaskerville.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Baskerville}
// \usepackage[defaultmathsizes,italic]{mathastext}
// """,
// )
// italicbaskerville.texCompiler = "xelatex"
// italicbaskerville.outputFormat = ".xdv"


// # ECF JD (with TX fonts)
// ecfjdtx = NewAmsTemplate()
// ecfjdtx.description = "ECF JD (with TX fonts)"
// ecfjdtx.addToPreamble(
//     r"""
// \usepackage{txfonts}
// \usepackage[upright]{txgreeks}
// \renewcommand\familydefault{fjd} % emerald package
// \usepackage{mathastext}
// """,
// )
// ecfjdtx.addToDocument(
//     r"""\mathversion{bold}
// """,
// )


// # Antykwa Półtawskiego (TX Fonts for Greek and math symbols)
// aptxgm = NewAmsTemplate()
// aptxgm.description = "Antykwa Półtawskiego (TX Fonts for Greek and math symbols)"
// aptxgm.addToPreamble(
//     r"""
// \usepackage[OT4,OT1]{fontenc}
// \usepackage{txfonts}
// \usepackage[upright]{txgreeks}
// \usepackage{antpolt}
// \usepackage[defaultmathsizes,nolessnomore]{mathastext}
// """,
// )


// # Papyrus
// papyrus = NewAmsTemplate()
// papyrus.description = "Papyrus"
// papyrus.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Papyrus}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// papyrus.texCompiler = "xelatex"
// papyrus.outputFormat = ".xdv"


// # GNU FreeSerif (and TX fonts symbols)
// gnufstx = NewAmsTemplate()
// gnufstx.description = "GNU FreeSerif (and TX fonts symbols)"
// gnufstx.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \usepackage{txfonts}  %\let\mathbb=\varmathbb
// \setmainfont[ExternalLocation,
//                 Mapping=tex-text,
//                 BoldFont=FreeSerifBold,
//                 ItalicFont=FreeSerifItalic,
//                 BoldItalicFont=FreeSerifBoldItalic]{FreeSerif}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// gnufstx.texCompiler = "xelatex"
// gnufstx.outputFormat = ".pdf"


// # ECF Skeetch (CM Greek)
// ecfscmg = NewAmsTemplate()
// ecfscmg.description = "ECF Skeetch (CM Greek)"
// ecfscmg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[T1]{fontenc}
// \DeclareFontFamily{T1}{fsk}{}
// \DeclareFontShape{T1}{fsk}{m}{n}{<->s*[1.315] fskmw8t}{}
// \renewcommand\rmdefault{fsk}
// \usepackage[noendash,defaultmathsizes,nohbar,defaultimath]{mathastext}
// """,
// )


// # Latin Modern Typewriter Proportional (CM Greek) (Italic)
// italiclmtpcm = NewAmsTemplate()
// italiclmtpcm.description = "Latin Modern Typewriter Proportional (CM Greek) (Italic)"
// italiclmtpcm.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[variablett,nomath]{lmodern}
// \renewcommand{\familydefault}{\ttdefault}
// \usepackage[frenchmath]{mathastext}
// \linespread{1.08}
// """,
// )


// # Baskervald ADF with Fourier
// baskervaldadff = NewAmsTemplate()
// baskervaldadff.description = "Baskervald ADF with Fourier"
// baskervaldadff.addToPreamble(
//     r"""
// \usepackage[upright]{fourier}
// \usepackage{baskervald}
// \usepackage[defaultmathsizes,noasterisk]{mathastext}
// """,
// )


// # Droid Serif (PX math symbols) (Italic)
// italicdroidserifpx = NewAmsTemplate()
// italicdroidserifpx.description = "Droid Serif (PX math symbols) (Italic)"
// italicdroidserifpx.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{pxfonts}
// \usepackage[default]{droidserif}
// \usepackage[LGRgreek,defaultmathsizes,italic,basic]{mathastext}
// \let\varphi\phi
// """,
// )


// # Biolinum
// biolinum = NewAmsTemplate()
// biolinum.description = "Biolinum"
// biolinum.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{libertine}
// \renewcommand{\familydefault}{\sfdefault}
// \usepackage[greek=n,biolinum]{libgreek}
// \usepackage[noasterisk,defaultmathsizes]{mathastext}
// """,
// )


// # Vollkorn with Fourier (Italic)
// italicvollkornf = NewAmsTemplate()
// italicvollkornf.description = "Vollkorn with Fourier (Italic)"
// italicvollkornf.addToPreamble(
//     r"""
// \usepackage{fourier}
// \usepackage{vollkorn}
// \usepackage[italic,nohbar]{mathastext}
// """,
// )


// # Chalkboard SE
// chalkboardse = NewAmsTemplate()
// chalkboardse.description = "Chalkboard SE"
// chalkboardse.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Chalkboard SE}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )
// chalkboardse.texCompiler = "xelatex"
// chalkboardse.outputFormat = ".xdv"


// # Noteworthy Light
// noteworthylight = NewAmsTemplate()
// noteworthylight.description = "Noteworthy Light"
// noteworthylight.addToPreamble(
//     r"""
// \usepackage[no-math]{fontspec}
// \setmainfont[Mapping=tex-text]{Noteworthy Light}
// \usepackage[defaultmathsizes]{mathastext}
// """,
// )


// # Epigrafica
// epigrafica = NewAmsTemplate()
// epigrafica.description = "Epigrafica"
// epigrafica.addToPreamble(
//     r"""
// \usepackage[LGR,OT1]{fontenc}
// \usepackage{epigrafica}
// \usepackage[basic,LGRgreek,defaultmathsizes]{mathastext}
// \let\varphi\phi
// \linespread{1.2}
// """,
// )


// # Libris ADF with Fourier
// librisadff = NewAmsTemplate()
// librisadff.description = "Libris ADF with Fourier"
// librisadff.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[upright]{fourier}
// \usepackage{libris}
// \renewcommand{\familydefault}{\sfdefault}
// \usepackage[noasterisk]{mathastext}
// """,
// )


// # Venturis ADF with Fourier (Italic)
// italicvanturisadff = NewAmsTemplate()
// italicvanturisadff.description = "Venturis ADF with Fourier (Italic)"
// italicvanturisadff.addToPreamble(
//     r"""
// \usepackage{fourier}
// \usepackage[lf]{venturis}
// \usepackage[italic,defaultmathsizes,noasterisk]{mathastext}
// """,
// )


// # GFS Bodoni
// gfsbodoni = NewAmsTemplate()
// gfsbodoni.description = "GFS Bodoni"
// gfsbodoni.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \renewcommand{\rmdefault}{bodoni}
// \usepackage[LGRgreek]{mathastext}
// \let\varphi\phi
// \linespread{1.06}
// """,
// )


// # BrushScriptX-Italic (PX math and Greek)
// brushscriptxpx = NewAmsTemplate()
// brushscriptxpx.description = "BrushScriptX-Italic (PX math and Greek)"
// brushscriptxpx.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{pxfonts}
// %\usepackage{pbsi}
// \renewcommand{\rmdefault}{pbsi}
// \renewcommand{\mddefault}{xl}
// \renewcommand{\bfdefault}{xl}
// \usepackage[defaultmathsizes,noasterisk]{mathastext}
// """,
// )
// brushscriptxpx.addToDocument(
//     r"""\boldmath
// """,
// )
// brushscriptxpx.texCompiler = "xelatex"
// brushscriptxpx.outputFormat = ".xdv"


// # URW Avant Garde (Symbol Greek)
// urwagsg = NewAmsTemplate()
// urwagsg.description = "URW Avant Garde (Symbol Greek)"
// urwagsg.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage{avant}
// \renewcommand{\familydefault}{\sfdefault}
// \usepackage[symbolgreek,defaultmathsizes]{mathastext}
// """,
// )


// # Times with Fourier (Italic)
// italictimesf = NewAmsTemplate()
// italictimesf.description = "Times with Fourier (Italic)"
// italictimesf.addToPreamble(
//     r"""
// \usepackage{fourier}
// \renewcommand{\rmdefault}{ptm}
// \usepackage[italic,defaultmathsizes,noasterisk]{mathastext}
// """,
// )


// # Helvetica with Fourier (Italic)
// italichelveticaf = NewAmsTemplate()
// italichelveticaf.description = "Helvetica with Fourier (Italic)"
// italichelveticaf.addToPreamble(
//     r"""
// \usepackage[T1]{fontenc}
// \usepackage[scaled]{helvet}
// \usepackage{fourier}
// \renewcommand{\rmdefault}{phv}
// \usepackage[italic,defaultmathsizes,noasterisk]{mathastext}
// """,
// )


// class TexFontTemplates:
//     """
//     A collection of TeX templates for the fonts described at http://jf.burnol.free.fr/showcase.html

//     These templates are specifically designed to allow you to typeset formulae and mathematics using
//     different fonts. They are based on the mathastext LaTeX package.

//     Examples
//     ---------
//     Normal usage as a value for the keyword argument texTemplate of Tex() and MathTex() mobjects::

//         ``Tex("My TeX code", texTemplate=TexFontTemplates.comicSans)``

//     Notes
//     ------
//     Many of these templates require that specific fonts
//     are installed on your local machine.
//     For example, choosing the template TexFontTemplates.comicSans will
//     not compile if the Comic Sans Microsoft font is not installed.

//     To experiment, try to render the TexFontTemplateLibrary example scene:
//          ``manim path/to/manim/exampleScenes/advancedTexFonts.py TexFontTemplateLibrary -p -ql``
//     """

//     americanTypewriter = americantypewriter
//     """American Typewriter"""
//     antykwa = aptxgm
//     """Antykwa Półtawskiego (TX Fonts for Greek and math symbols)"""
//     appleChancery = applechancery
//     """Apple Chancery"""
//     auriocusKalligraphicus = aksg
//     """Auriocus Kalligraphicus (Symbol Greek)"""
//     baskervaldAdfFourier = baskervaldadff
//     """Baskervald ADF with Fourier"""
//     baskervilleIt = italicbaskerville
//     """Baskerville (Italic)"""
//     biolinum = biolinum
//     """Biolinum"""
//     brushscriptx = brushscriptxpx
//     """BrushScriptX-Italic (PX math and Greek)"""
//     chalkboardSe = chalkboardse
//     """Chalkboard SE"""
//     chalkduster = chalkduster
//     """Chalkduster"""
//     comfortaa = comfortaa
//     """Comfortaa"""
//     comicSans = comicsansms
//     """Comic Sans MS"""
//     droidSans = droidsans
//     """Droid Sans"""
//     droidSansIt = italicdroidsans
//     """Droid Sans (Italic)"""
//     droidSerif = droidserif
//     """Droid Serif"""
//     droidSerifPxIt = italicdroidserifpx
//     """Droid Serif (PX math symbols) (Italic)"""
//     ecfAugie = ecfaugieeg
//     """ECF Augie (Euler Greek)"""
//     ecfJd = ecfjdtx
//     """ECF JD (with TX fonts)"""
//     ecfSkeetch = ecfscmg
//     """ECF Skeetch (CM Greek)"""
//     ecfTallPaul = ecftallpaul
//     """ECF Tall Paul (with Symbol font)"""
//     ecfWebster = ecfwebstertx
//     """ECF Webster (with TX fonts)"""
//     electrumAdf = electrumadfcm
//     """Electrum ADF (CM Greek)"""
//     epigrafica = epigrafica
//     """ Epigrafica """
//     fourierUtopia = fufug
//     """Fourier Utopia (Fourier upright Greek)"""
//     frenchCursive = fceg
//     """French Cursive (Euler Greek)"""
//     gfsBodoni = gfsbodoni
//     """GFS Bodoni"""
//     gfsDidot = italicgfsdidot
//     """GFS Didot (Italic)"""
//     gfsNeoHellenic = gfsneohellenic
//     """GFS NeoHellenic"""
//     gnuFreesansTx = gnufstx
//     """GNU FreeSerif (and TX fonts symbols)"""
//     gnuFreeserifFreesans = gnufsfs
//     """GNU FreeSerif and FreeSans"""
//     helveticaFourierIt = italichelveticaf
//     """Helvetica with Fourier (Italic)"""
//     latinModernTwIt = italiclmtpcm
//     """Latin Modern Typewriter Proportional (CM Greek) (Italic)"""
//     latinModernTw = lmtp
//     """Latin Modern Typewriter Proportional"""
//     libertine = libertine
//     """Libertine"""
//     librisAdfFourier = librisadff
//     """Libris ADF with Fourier"""
//     minionProMyriadPro = mpmptx
//     """Minion Pro and Myriad Pro (and TX fonts symbols)"""
//     minionProTx = mptx
//     """Minion Pro (and TX fonts symbols)"""
//     newCenturySchoolbook = ncssg
//     """New Century Schoolbook (Symbol Greek)"""
//     newCenturySchoolbookPx = ncssgpxm
//     """New Century Schoolbook (Symbol Greek, PX math symbols)"""
//     noteworthyLight = noteworthylight
//     """Noteworthy Light"""
//     palatino = palatinosg
//     """Palatino (Symbol Greek)"""
//     papyrus = papyrus
//     """Papyrus"""
//     romandeAdfFourierIt = italicromandeadff
//     """Romande ADF with Fourier (Italic)"""
//     slitex = slitexeg
//     """SliTeX (Euler Greek)"""
//     timesFourierIt = italictimesf
//     """Times with Fourier (Italic)"""
//     urwAvantGarde = urwagsg
//     """URW Avant Garde (Symbol Greek)"""
//     urwZapfChancery = urwzccmg
//     """URW Zapf Chancery (CM Greek)"""
//     venturisAdfFourierIt = italicvanturisadff
//     """Venturis ADF with Fourier (Italic)"""
//     verdanaIt = italicverdana
//     """Verdana (Italic)"""
//     vollkornFourierIt = italicvollkornf
//     """Vollkorn with Fourier (Italic)"""
//     vollkorn = vollkorntx
//     """Vollkorn (TX fonts for Greek and math symbols)"""
//     zapfChancery = zapfchancery
//     """Zapf Chancery"""
