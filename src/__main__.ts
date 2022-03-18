// from _Future__ import annotations

// import sys

// import click
// from clickDefaultGroup import DefaultGroup

// from . import _Version__, console
// from .cli.cfg.group import cfg
// from .cli.init.commands import init
// from .cli.new.group import new
// from .cli.plugins.commands import plugins
// from .cli.render.commands import render
// from .constants import EPILOG


// exitEarly(ctx, param, value) {
//     if value:
//         sys.exit()


// console.print(f"Manim Community [green]v{_Version__}[/green]\n")


// @click.group(
//     cls=DefaultGroup,
//     default="render",
//     noArgsIsHelp=True,
//     help="Animation engine for explanatory math videos",
//     epilog=EPILOG,
// )
// @click.option(
//     "--version",
//     isFlag=True,
//     help="Show version and exit.",
//     callback=exitEarly,
//     isEager=True,
//     exposeValue=False,
// )
// @click.passContext
// main(ctx) {
//     """The entry point for manim."""
//     pass


// main.addCommand(cfg)
// main.addCommand(plugins)
// main.addCommand(init)
// main.addCommand(new)
// main.addCommand(render)

// if _Name__ == "_Main__":
//     main()
