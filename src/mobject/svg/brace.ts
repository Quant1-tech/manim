/** @file Mobject representing curly braces. */

import {DEFAULT_MOBJECT_TO_MOBJECT_BUFFER, DOWN, LEFT, RIGHT, UL} from "../../constants";
import {$add, $normalize, $scale, $sub, Pt3} from "../../utils/js";
import {Mobject} from "../mobject";
import {VMobject} from "../types/vectorized_mobject";
import {SVGPathMobject} from "./svg_path";
import {MathTex, Tex} from "./tex_mobject";

const pathStringTemplate =
    "m0.01216 0c-0.01152 0-0.01216 6.103e-4 -0.01216 0.01311v0.007762c0.06776 " +
    "0.122 0.1799 0.1455 0.2307 0.1455h{0}c0.03046 3.899e-4 0.07964 0.00449 " +
    "0.1246 0.02636 0.0537 0.02695 0.07418 0.05816 0.08648 0.07769 0.001562 " +
    "0.002538 0.004539 0.002563 0.01098 0.002563 0.006444-2e-8 0.009421-2.47e-" +
    "5 0.01098-0.002563 0.0123-0.01953 0.03278-0.05074 0.08648-0.07769 0.04491" +
    "-0.02187 0.09409-0.02597 0.1246-0.02636h{0}c0.05077 0 0.1629-0.02346 " +
    "0.2307-0.1455v-0.007762c-1.78e-6 -0.0125-6.365e-4 -0.01311-0.01216-0.0131" +
    "1-0.006444-3.919e-8 -0.009348 2.448e-5 -0.01091 0.002563-0.0123 0.01953-" +
    "0.03278 0.05074-0.08648 0.07769-0.04491 0.02187-0.09416 0.02597-0.1246 " +
    "0.02636h{1}c-0.04786 0-0.1502 0.02094-0.2185 0.1256-0.06833-0.1046-0.1706" +
    "-0.1256-0.2185-0.1256h{1}c-0.03046-3.899e-4 -0.07972-0.004491-0.1246-0.02" +
    "636-0.0537-0.02695-0.07418-0.05816-0.08648-0.07769-0.001562-0.002538-" +
    "0.004467-0.002563-0.01091-0.002563z";

const defaultMinWidth = 0.90552;

// from _Future__ import annotations

// _All__ = ["Brace", "BraceLabel", "ArcBrace", "BraceText", "BraceBetweenPoints"]

// from typing import Sequence

// import numpy as np

// from manim.Config import config
// from manim.mobject.geometry.arc import Arc
// from manim.mobject.geometry.line import Line

// from ...animation.composition import AnimationGroup
// from ...animation.fading import FadeIn
// from ...animation.growing import GrowFromCenter
// from ...constants import *
// from ...utils.color import BLACK

/**
 * Takes a mobject and draws a brace adjacent to it.
 * 
 * Passing a direction vector determines the direction from which the brace is drawn. By default it is drawn from below.
 */
export class Brace extends SVGPathMobject {
    buff: number;

    /**
     * @param mobject The mobject adjacent to which the brace is placed.
     */
    constructor(mobject: VMobject, {
        buff = 0.2,
        direction = DOWN,
        sharpness = 2
    }: {
        buff?: number;
        
        /** The direction from which the brace faces the mobject. */
        direction?: number[];
        sharpness?: number;
    } = {}) {
        const angle = -Math.atan2(direction[1], direction[0]) + Math.PI;
        // mobject.rotate(-angle, aboutPoint=ORIGIN)
        const left = mobject.getCorner($add(DOWN, LEFT));
        const right = mobject.getCorner($add(DOWN, RIGHT));

        const targetWidth = right[0] - left[0];
        const linearSectionLength = Math.max(0, (targetWidth * sharpness - defaultMinWidth) / 2);

        let d = pathStringTemplate;
        d = d.replace(/\{0\}/g, String(linearSectionLength));
        d = d.replace(/\{1\}/g, String(-linearSectionLength));

        super(d);
        this.buff = buff;
        // super()._Init__(
        //     pathString=path,
        //     strokeWidth=strokeWidth,
        //     fillOpacity=fillOpacity,
        //     backgroundStrokeWidth=backgroundStrokeWidth,
        //     backgroundStrokeColor=backgroundStrokeColor,
        //     **kwargs
        // )
        this.stretchToFitWidth(targetWidth);
        this.targetWidth = targetWidth;
        this.shift(left, $scale(this.getCorner(UL), -1), $scale(DOWN, this.buff));

        // this.rotate(angle);

        // for mob in mobject, this:
        //     mob.rotate(angle, aboutPoint=ORIGIN)
    
    //     _Init__(
    //         this,
    //         mobject,
    //         direction: Sequence[float] | None = DOWN,
    //         buff=0.2,
    //         sharpness=2,
    //         strokeWidth=0,
    //         fillOpacity=1.0,
    //         backgroundStrokeWidth=0,
    //         backgroundStrokeColor=BLACK,
    //         **kwargs,
    //     ) {

    //         this.buff = buff

    //         angle = -np.arctan2(*direction[:2]) + np.pi
    //         mobject.rotate(-angle, aboutPoint=ORIGIN)
    //         left = mobject.getCorner(DOWN + LEFT)
    //         right = mobject.getCorner(DOWN + RIGHT)
    //         targetWidth = right[0] - left[0]
    //         linearSectionLength = max(
    //             0,
    //             (targetWidth * sharpness - defaultMinWidth) / 2,
    //         )

    //         path = pathStringTemplate.format(
    //             linearSectionLength,
    //             -linearSectionLength,
    //         )

    //         super()._Init__(
    //             pathString=path,
    //             strokeWidth=strokeWidth,
    //             fillOpacity=fillOpacity,
    //             backgroundStrokeWidth=backgroundStrokeWidth,
    //             backgroundStrokeColor=backgroundStrokeColor,
    //             **kwargs,
    //         )
    //         this.stretchToFitWidth(targetWidth)
    //         this.shift(left - this.getCorner(UP + LEFT) + this.buff * DOWN)

    //         for mob in mobject, this:
    //             mob.rotate(angle, aboutPoint=ORIGIN)
    }

    putAtTip(mob: Mobject, {buff = DEFAULT_MOBJECT_TO_MOBJECT_BUFFER, useNextTo = true} = {}) {
        if (useNextTo) {
            mob.nextTo(this.getTip(), {direction: this.getDirection().map(vi => Math.round(vi)) as Pt3});
        } else {
            mob.moveTo(this.getTip());
            const shiftDistance = mob.width / 2 + buff;
            mob.shift($scale(this.getDirection(), shiftDistance));
        }
        return this;
    }

    getText(text: string) {
        const textMob = new Tex(text);
        this.putAtTip(textMob);
        return textMob;
    }

    getTex(tex: string) {
        const texMob = new MathTex(tex);
        this.putAtTip(texMob);
        return texMob;
    }

    /** Returns the position of the seventh point in the path, which is the tip. */
    getTip() {
        return this.points[28]; // = 7*4
    }

    getDirection() {
        return $normalize($sub(this.getTip(), this.getCenter()));
    }
}

// class BraceLabel(VMobject, metaclass=ConvertToOpenGL) {
//     _Init__(
//         this,
//         obj,
//         text,
//         braceDirection=DOWN,
//         labelConstructor=MathTex,
//         fontSize=DEFAULT_FONT_SIZE,
//         buff=0.2,
//         **kwargs,
//     ) {
//         this.labelConstructor = labelConstructor
//         super()._Init__(**kwargs)

//         this.braceDirection = braceDirection
//         this.buff = buff
//         if isinstance(obj, list) {
//             obj = this.getGroupClass()(*obj)
//         this.brace = Brace(obj, braceDirection, buff, **kwargs)

//         if isinstance(text, (tuple, list)) {
//             this.label = this.labelConstructor(fontSize=fontSize, *text, **kwargs)
//         else:
//             this.label = this.labelConstructor(str(text), fontSize=fontSize)

//         this.brace.putAtTip(this.label)
//         this.add(this.brace, this.label)

//     creationAnim(this, labelAnim=FadeIn, braceAnim=GrowFromCenter) {
//         return AnimationGroup(braceAnim(this.brace), labelAnim(this.label))

//     shiftBrace(this, obj, **kwargs) {
//         if isinstance(obj, list) {
//             obj = this.getGroupClass()(*obj)
//         this.brace = Brace(obj, this.braceDirection, **kwargs)
//         this.brace.putAtTip(this.label)
//         return this

//     changeLabel(this, *text, **kwargs) {
//         this.label = this.labelConstructor(*text, **kwargs)

//         this.brace.putAtTip(this.label)
//         return this

//     changeBraceLabel(this, obj, *text, **kwargs) {
//         this.shiftBrace(obj)
//         this.changeLabel(*text, **kwargs)
//         return this


// class BraceText(BraceLabel) {
//     _Init__(this, obj, text, labelConstructor=Tex, **kwargs) {
//         super()._Init__(obj, text, labelConstructor=labelConstructor, **kwargs)


// class BraceBetweenPoints(Brace) {
//     """Similar to Brace, but instead of taking a mobject it uses 2
//     points to place the brace.

//     A fitting direction for the brace is
//     computed, but it still can be manually overridden.
//     If the points go from left to right, the brace is drawn from below.
//     Swapping the points places the brace on the opposite side.

//     Parameters
//     ----------
//     point_1 :
//         The first point.
//     point_2 :
//         The second point.
//     direction :
//         The direction from which the brace faces towards the points.

//     Examples
//     --------
//         .. manim:: BraceBPExample

//             class BraceBPExample(Scene) {
//                 construct(this) {
//                     p1 = [0,0,0]
//                     p2 = [1,2,0]
//                     brace = BraceBetweenPoints(p1,p2)
//                     this.play(Create(NumberPlane()))
//                     this.play(Create(brace))
//                     this.wait(2)
//     """

//     _Init__(
//         this,
//         point_1: Sequence[float] | None,
//         point_2: Sequence[float] | None,
//         direction: Sequence[float] | None = ORIGIN,
//         **kwargs,
//     ) {
//         if all(direction == ORIGIN) {
//             lineVector = np.array(point_2) - np.array(point_1)
//             direction = np.array([lineVector[1], -lineVector[0], 0])
//         super()._Init__(Line(point_1, point_2), direction=direction, **kwargs)


// class ArcBrace(Brace) {
//     """Creates a :class:`~Brace` that wraps around an :class:`~.Arc`.

//     The direction parameter allows the brace to be applied
//     from outside or inside the arc.

//     .. warning::
//         The :class:`ArcBrace` is smaller for arcs with smaller radii.

//     .. note::
//         The :class:`ArcBrace` is initially a vertical :class:`Brace` defined by the
//         length of the :class:`~.Arc`, but is scaled down to match the start and end
//         angles. An exponential function is then applied after it is shifted based on
//         the radius of the arc.

//         The scaling effect is not applied for arcs with radii smaller than 1 to prevent
//         over-scaling.

//     Parameters
//     ----------
//     arc
//         The :class:`~.Arc` that wraps around the :class:`Brace` mobject.
//     direction
//         The direction from which the brace faces the arc.
//         ``LEFT`` for inside the arc, and ``RIGHT`` for the outside.

//     Example
//     -------
//         .. manim:: ArcBraceExample
//             :saveLastFrame:
//             :refClasses: Arc

//             class ArcBraceExample(Scene) {
//                 construct(this) {
//                     arc_1 = Arc(radius=1.5,startAngle=0,angle=2*PI/3).setColor(RED)
//                     brace_1 = ArcBrace(arc_1,LEFT)
//                     group_1 = VGroup(arc_1,brace_1)

//                     arc_2 = Arc(radius=3,startAngle=0,angle=5*PI/6).setColor(YELLOW)
//                     brace_2 = ArcBrace(arc_2)
//                     group_2 = VGroup(arc_2,brace_2)

//                     arc_3 = Arc(radius=0.5,startAngle=-0,angle=PI).setColor(BLUE)
//                     brace_3 = ArcBrace(arc_3)
//                     group_3 = VGroup(arc_3,brace_3)

//                     arc_4 = Arc(radius=0.2,startAngle=0,angle=3*PI/2).setColor(GREEN)
//                     brace_4 = ArcBrace(arc_4)
//                     group_4 = VGroup(arc_4,brace_4)

//                     arcGroup = VGroup(group_1, group_2, group_3, group_4).arrangeInGrid(buff=1.5)
//                     this.add(arcGroup.center())

//     """

//     _Init__(
//         this,
//         arc: Arc = Arc(startAngle=-1, angle=2, radius=1),
//         direction: Sequence[float] = RIGHT,
//         **kwargs,
//     ) {
//         arcEndAngle = arc.startAngle + arc.angle
//         line = Line(UP * arc.startAngle, UP * arcEndAngle)
//         scaleShift = RIGHT * np.log(arc.radius)

//         if arc.radius >= 1:
//             line.scale(arc.radius, aboutPoint=ORIGIN)
//             super()._Init__(line, direction=direction, **kwargs)
//             this.scale(1 / (arc.radius), aboutPoint=ORIGIN)
//         else:
//             super()._Init__(line, direction=direction, **kwargs)

//         if arc.radius >= 0.3:
//             this.shift(scaleShift)
//         else:
//             this.shift(RIGHT * np.log(0.3))

//         this.applyComplexFunction(np.exp)
//         this.shift(arc.getArcCenter())
