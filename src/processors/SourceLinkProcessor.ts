/**
 * CM6 Source mode link processor.
 * Detects markdown links in visible content.
 */

import {Processor, SourceLinkHint} from "../../types";
import {EditorView} from "@codemirror/view";
import {getMDHintLinks, getVisibleLinesCM6} from "../utils/common";

export default class SourceLinkProcessor implements Processor {
    cmEditor: EditorView;
    letters: string;

    constructor(editor: EditorView, letters: string) {
        this.cmEditor = editor;
        this.letters = letters;
    }

    public init(): SourceLinkHint[] {
        return this.getSourceLinkHints();
    }

    public getVisibleLines() {
        return getVisibleLinesCM6(this.cmEditor);
    }

    private getSourceLinkHints = (): SourceLinkHint[] => {
        const { letters } = this;
        const { index, content } = this.getVisibleLines();

        return getMDHintLinks(content, index, letters);
    }
}

// Named exports for both new and old names
export {SourceLinkProcessor};
export {SourceLinkProcessor as CM6LinkProcessor};
