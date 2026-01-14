/**
 * Search panel displaying current search string in top-right corner.
 * Shows real-time feedback as the user types in Flash mode.
 */
export class FlashSearchPanel {
    private panel: HTMLElement | null = null;
    private textEl: HTMLElement | null = null;
    private cursorEl: HTMLElement | null = null;

    /**
     * Create and attach panel to container.
     * @param container - The DOM element to attach the panel to
     */
    create(container: HTMLElement): void {
        this.panel = document.createElement('div');
        this.panel.className = 'flash-search-panel';

        this.textEl = document.createElement('span');
        this.textEl.className = 'flash-search-text';

        this.cursorEl = document.createElement('span');
        this.cursorEl.className = 'flash-search-cursor';
        this.cursorEl.textContent = '|';

        this.panel.appendChild(this.textEl);
        this.panel.appendChild(this.cursorEl);
        container.appendChild(this.panel);

        this.update('');
    }

    /**
     * Update displayed search text.
     * @param text - The current search string to display
     */
    update(text: string): void {
        if (!this.textEl) return;
        this.textEl.textContent = text || '';
    }

    /**
     * Remove panel from DOM and clean up references.
     */
    destroy(): void {
        if (this.panel && this.panel.parentElement) {
            this.panel.parentElement.removeChild(this.panel);
        }
        this.panel = null;
        this.textEl = null;
        this.cursorEl = null;
    }
}
