/**
 * Preview mode (reading view) link processor.
 * Detects links in the rendered preview DOM.
 */

import {PreviewLinkHint} from "../../types";
import {displayPreviewPopovers, getPreviewLinkHints} from "../utils/preview";

export default class PreviewProcessor {
    private container: HTMLElement;
    letters: string;

    constructor(container: HTMLElement, letters: string) {
        this.container = container;
        this.letters = letters;
    }

    public init(): PreviewLinkHint[] {
        const { container, letters } = this;
        const hints = getPreviewLinkHints(container, letters);
        displayPreviewPopovers(hints);
        return hints;
    }
}

// Named exports for both new and old names
export {PreviewProcessor};
export {PreviewProcessor as PreviewLinkProcessor};
