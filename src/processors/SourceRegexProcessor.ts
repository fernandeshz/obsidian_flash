/**
 * CM6 Source mode regex processor.
 * Detects regex matches in visible content.
 */

import SourceLinkProcessor from "./SourceLinkProcessor";
import {Processor, SourceLinkHint} from "../../types";
import {EditorView} from "@codemirror/view";
import {extractRegexpBlocks} from "../utils/regexp";

export default class SourceRegexProcessor extends SourceLinkProcessor implements Processor {
    regexp: string;
    caseSensitive: boolean;

    constructor(editor: EditorView, letters: string, regexp: string, caseSensitive: boolean) {
        super(editor, letters);
        this.regexp = regexp;
        this.caseSensitive = caseSensitive;
    }

    init(): SourceLinkHint[] {
        const { letters, regexp } = this;
        const { index, content } = this.getVisibleLines();
        return extractRegexpBlocks(content, index, regexp, letters, this.caseSensitive);
    }
}

// Named exports for both new and old names
export {SourceRegexProcessor};
export {SourceRegexProcessor as CM6RegexProcessor};
