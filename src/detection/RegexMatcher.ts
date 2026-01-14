/**
 * Regex-based text matching utilities.
 * Includes safety validations and formatting adjustment.
 */

import {SourceLinkHint} from "../../types";
import {generateHintLabels} from "../hints/HintGenerator";
import {escapeRegex, adjustIndexForFormatting, validateRegex} from "../utils/regexp";

// Re-export for backward compatibility
export {escapeRegex, adjustIndexForFormatting, validateRegex};

/**
 * Maximum number of matches to prevent performance issues
 */
const MAX_MATCHES = 10000;

/**
 * Find regex matches in content with safety protections
 *
 * @param content - Text to search
 * @param offset - Index offset to add to matches
 * @param pattern - Regex pattern string
 * @param alphabet - Letters for hint labels
 * @param caseSensitive - Whether match is case sensitive
 * @returns Array of matches with hint labels
 */
export function findRegexMatches(
    content: string,
    offset: number,
    pattern: string,
    alphabet: string,
    caseSensitive: boolean
): SourceLinkHint[] {
    // Validate regex
    const validationError = validateRegex(pattern);
    if (validationError) {
        console.warn('Regex validation failed:', validationError);
        return [];
    }

    // Create regex with appropriate flags
    let regex: RegExp;
    try {
        regex = caseSensitive ? new RegExp(pattern, 'gu') : new RegExp(pattern, 'igu');
    } catch (e) {
        console.warn('Unicode regex failed, falling back to ASCII mode:', e);
        regex = caseSensitive ? new RegExp(pattern, 'g') : new RegExp(pattern, 'ig');
    }

    const matches: { index: number; type: 'regex'; linkText: string }[] = [];
    let regExResult: RegExpExecArray | null;
    let lastIndex = -1;
    let matchCount = 0;

    while ((regExResult = regex.exec(content))) {
        // Protection against infinite loops from zero-length matches
        if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
            continue;
        }
        lastIndex = regex.lastIndex;

        // Limit total matches
        if (++matchCount > MAX_MATCHES) {
            console.warn(`Regex matched more than ${MAX_MATCHES} times, stopping early`);
            break;
        }

        const linkText = regExResult[1] ?? regExResult[0];
        const adjustedIndex = adjustIndexForFormatting(content, regExResult.index, linkText);

        matches.push({
            index: adjustedIndex + offset,
            type: 'regex',
            linkText,
        });
    }

    const labels = generateHintLabels(alphabet, matches.length);

    return matches
        .sort((a, b) => a.index - b.index)
        .map((match, i) => ({
            letter: labels[i],
            ...match,
        }))
        .filter(match => match.letter);
}

// Backward compatibility aliases
export const extractRegexpBlocks = findRegexMatches;
