/**
 * Live Preview mode processor.
 * Handles both rendered DOM links and source code links.
 */

import {PreviewLinkHint, SourceLinkHint} from "../../types";
import {EditorView} from "@codemirror/view";
import {displayPreviewPopovers, getPreviewLinkHints} from "../utils/preview";
import {generateHintLabels} from "../hints/HintGenerator";
import {detectMarkdownLinks} from "../detection/LinkDetector";
import {getVisibleContentCM6} from "../detection/VisibleContent";

export type LivePreviewResult = [PreviewLinkHint[], SourceLinkHint[], HTMLElement[]];

export default class LivePreviewProcessor {
    private container: HTMLElement;
    private editor: EditorView;
    letters: string;

    constructor(container: HTMLElement, editor: EditorView, letters: string) {
        this.container = container;
        this.editor = editor;
        this.letters = letters;
    }

    public init(): LivePreviewResult {
        const { container, letters } = this;

        // Get preview links from DOM
        const previewHints = getPreviewLinkHints(container, letters);

        // Get source links from editor
        const sourceHints = this.detectSourceLinks();

        // Generate combined labels
        const totalCount = previewHints.length + sourceHints.length;
        const labels = generateHintLabels(letters, totalCount);

        // Remap labels to both sets
        const previewRemapped = previewHints
            .map((hint, idx) => ({ ...hint, letter: labels[idx] }))
            .filter(hint => hint.letter);

        const sourceRemapped = sourceHints
            .map((hint, idx) => ({ ...hint, letter: labels[idx + previewHints.length] }))
            .filter(hint => hint.letter);

        // Display preview popovers
        const hintElements = displayPreviewPopovers(previewRemapped);

        return [previewRemapped, sourceRemapped, hintElements];
    }

    public getVisibleContent() {
        return getVisibleContentCM6(this.editor);
    }

    private detectSourceLinks(): SourceLinkHint[] {
        const { letters } = this;
        const { startIndex, content } = this.getVisibleContent();
        return detectMarkdownLinks(content, startIndex, letters);
    }
}

// Named exports for both new and old names
export {LivePreviewProcessor};
export {LivePreviewProcessor as LivePreviewLinkProcessor};
