/**
 * CM6 Widget for rendering Flash jump labels.
 * Labels appear after matched text and inherit font from source.
 */

import { WidgetType } from "@codemirror/view";
import { FontInfo } from "../../types";

/**
 * Widget that renders a Flash label at a specific position.
 * Supports font inheritance and matched state styling.
 */
export class FlashLabelWidget extends WidgetType {
    constructor(
        readonly label: string,
        readonly matchedKey: string,
        readonly fontInfo: FontInfo
    ) {
        super();
    }

    /**
     * Compares widgets for equality to optimize re-rendering.
     * Only compares label and matchedKey - fontInfo changes trigger re-render anyway.
     */
    eq(other: FlashLabelWidget): boolean {
        return other.label === this.label &&
               other.matchedKey === this.matchedKey;
    }

    /**
     * Creates the DOM element for the label.
     */
    toDOM(): HTMLElement {
        const wrapper = document.createElement('span');
        wrapper.className = 'flash-label';
        wrapper.textContent = this.label;

        // Apply inherited font styles
        if (this.fontInfo.fontFamily) {
            wrapper.style.fontFamily = this.fontInfo.fontFamily;
        }
        if (this.fontInfo.fontSize) {
            wrapper.style.fontSize = this.fontInfo.fontSize;
        }
        // Note: fontWeight is not inherited - labels always use bold for visibility

        // Add matched class if prefix matches
        if (this.matchedKey &&
            this.label.toUpperCase().startsWith(this.matchedKey.toUpperCase())) {
            wrapper.classList.add('matched');
        }

        return wrapper;
    }

    /**
     * Allow events to propagate through the widget.
     */
    ignoreEvent(): boolean {
        return false;
    }
}
