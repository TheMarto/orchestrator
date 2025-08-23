"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkingUtil = void 0;
const uuid_1 = require("uuid");
class ChunkingUtil {
    static config = {
        chunkSize: 500,
        chunkOverlap: 50,
        separators: ['\n\n', '\n', '. ', '! ', '? ', '; ', ' '],
    };
    static chunkDocument(content, fileName, source = 'upload') {
        const chunks = [];
        const cleanContent = this.cleanText(content);
        if (cleanContent.length <= this.config.chunkSize) {
            const chunk = {
                id: (0, uuid_1.v4)(),
                content: cleanContent,
                metadata: {
                    source,
                    fileName,
                    chunkIndex: 0,
                    totalChunks: 1,
                    charCount: cleanContent.length,
                    timestamp: new Date(),
                },
            };
            return [chunk];
        }
        const textChunks = this.smartSplit(cleanContent);
        textChunks.forEach((chunkContent, index) => {
            const chunk = {
                id: (0, uuid_1.v4)(),
                content: chunkContent.trim(),
                metadata: {
                    source,
                    fileName,
                    chunkIndex: index,
                    totalChunks: textChunks.length,
                    charCount: chunkContent.length,
                    timestamp: new Date(),
                },
            };
            chunks.push(chunk);
        });
        return chunks;
    }
    static cleanText(text) {
        return text
            .replace(/\r\n/g, '\n')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
    static smartSplit(text) {
        const chunks = [];
        let currentChunk = '';
        const sentences = this.splitBySeparators(text);
        for (const sentence of sentences) {
            if (sentence.length > this.config.chunkSize) {
                if (currentChunk) {
                    chunks.push(currentChunk);
                    currentChunk = '';
                }
                const sentenceParts = this.splitLongSentence(sentence);
                chunks.push(...sentenceParts);
                continue;
            }
            if (currentChunk.length + sentence.length > this.config.chunkSize) {
                if (currentChunk) {
                    chunks.push(currentChunk);
                    const overlap = this.getOverlapText(currentChunk);
                    currentChunk = overlap + sentence;
                }
                else {
                    currentChunk = sentence;
                }
            }
            else {
                currentChunk += (currentChunk ? ' ' : '') + sentence;
            }
        }
        if (currentChunk) {
            chunks.push(currentChunk);
        }
        return chunks.filter(chunk => chunk.trim().length > 0);
    }
    static splitBySeparators(text) {
        let sentences = [text];
        for (const separator of this.config.separators) {
            const newSentences = [];
            for (const sentence of sentences) {
                const parts = sentence.split(separator);
                newSentences.push(...parts.filter(part => part.trim().length > 0));
            }
            sentences = newSentences;
        }
        return sentences;
    }
    static splitLongSentence(sentence) {
        const parts = [];
        const words = sentence.split(' ');
        let currentPart = '';
        for (const word of words) {
            if (currentPart.length + word.length + 1 <= this.config.chunkSize) {
                currentPart += (currentPart ? ' ' : '') + word;
            }
            else {
                if (currentPart) {
                    parts.push(currentPart);
                }
                currentPart = word;
            }
        }
        if (currentPart) {
            parts.push(currentPart);
        }
        return parts;
    }
    static getOverlapText(text) {
        if (text.length <= this.config.chunkOverlap) {
            return text + ' ';
        }
        const words = text.split(' ');
        let overlap = '';
        for (let i = words.length - 1; i >= 0; i--) {
            const potentialOverlap = words.slice(i).join(' ');
            if (potentialOverlap.length <= this.config.chunkOverlap) {
                overlap = potentialOverlap + ' ';
                break;
            }
        }
        return overlap;
    }
}
exports.ChunkingUtil = ChunkingUtil;
//# sourceMappingURL=chunking.util.js.map